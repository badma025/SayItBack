/**
 * The span gate for the transcript side.
 *
 * The model returns every slot value with a span it says it copied from the
 * transcript. This module keeps a value only if
 *
 *   1. the span really is in the transcript, word for word (case, punctuation
 *      and spacing aside, and never starting or ending mid-word), and
 *   2. the value is visible inside its own span: a dose of 80 has to cite a span
 *      that says 80 or eighty, a drug name has to cite a span containing that
 *      name.
 *
 * Everything else is rejected and listed, never silently kept. Enum slots
 * (direction, frequency, contact, modality) only need a real span here,
 * because the comparator re-reads them with `parse.ts` and refuses to confirm
 * anything the rules did not also hear.
 *
 * Pure: no network, no model. The same function runs on recorded replies in
 * the tests and on live replies in the API route.
 */

import {
  normalise,
  parseDoses,
  parseTimeframeDays,
  sameDose,
  type DoseUnit,
  type ItemKind,
  type PharmacistQuestion,
  type SpokenExtraction,
  type SpokenItem,
} from "@sayitback/engine";
import {
  CONTACT_ROUTES,
  DIRECTIONS,
  DOSE_UNITS,
  FOLLOW_UP_MODALITIES,
  FREQUENCIES,
  ITEM_KINDS,
} from "@sayitback/engine/schema";
import { normaliseWithOffsets, type NormalisedText } from "@sayitback/engine/text";
import { ExtractionFailure, type Rejection } from "./types";

type SlotRule =
  | { type: "text" }
  | { type: "dose" }
  | { type: "days" }
  | { type: "enum"; allowed: readonly string[] };

/** The slots each kind may carry, and how each one is checked against its span. */
const SLOT_RULES: Record<ItemKind, Record<string, SlotRule>> = {
  medication_change: {
    drug: { type: "text" },
    lay_name: { type: "text" },
    direction: { type: "enum", allowed: DIRECTIONS },
    dose: { type: "dose" },
    previous_dose: { type: "dose" },
    frequency: { type: "enum", allowed: FREQUENCIES },
  },
  diagnosis: {
    condition: { type: "text" },
    lay_term: { type: "text" },
  },
  red_flag: {
    symptom: { type: "text" },
    contact: { type: "enum", allowed: CONTACT_ROUTES },
  },
  follow_up: {
    with_whom: { type: "text" },
    timeframe_days: { type: "days" },
    modality: { type: "enum", allowed: FOLLOW_UP_MODALITIES },
  },
};

const MAX_ITEMS = 40;
const MAX_QUESTIONS = 20;

export interface GroundingResult {
  extraction: SpokenExtraction;
  rejected: Rejection[];
}

/* ------------------------------ span matching ------------------------------ */

function isLetter(ch: string | undefined): boolean {
  return ch !== undefined && /[a-z]/.test(ch);
}

function isDigit(ch: string | undefined): boolean {
  return ch !== undefined && /[0-9]/.test(ch);
}

/** Would `a` followed by `b` be one word? Then a span may not break between them. */
function sameToken(a: string | undefined, b: string | undefined): boolean {
  return (isLetter(a) && isLetter(b)) || (isDigit(a) && isDigit(b));
}

/**
 * Index of `needle` in `haystack` (both normalised) on token boundaries, or -1.
 * "80" may be found in "80mg", but "eight" is not found in "eighty".
 */
export function indexOfPhrase(haystack: string, needle: string): number {
  if (needle.length === 0) return -1;
  let from = 0;
  for (;;) {
    const index = haystack.indexOf(needle, from);
    if (index === -1) return -1;
    const startsCleanly = index === 0 || !sameToken(haystack[index - 1], needle[0]);
    const end = index + needle.length;
    const endsCleanly =
      end === haystack.length || !sameToken(needle[needle.length - 1], haystack[end]);
    if (startsCleanly && endsCleanly) return index;
    from = index + 1;
  }
}

/** The transcript's own wording for a span, or null if the span is not in it. */
function locate(span: string, transcript: NormalisedText): string | null {
  const needle = normalise(span);
  const index = indexOfPhrase(transcript.value, needle);
  if (index === -1) return null;
  const start = transcript.offsets[index] as number;
  const end = (transcript.offsets[index + needle.length - 1] as number) + 1;
  return transcript.original.slice(start, end);
}

/* ------------------------------ reply parsing ------------------------------ */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * The JSON object in a model reply. Tolerates a code fence or a sentence
 * around it, because `response_format` is advisory on some models.
 */
export function parseModelJson(content: string): Record<string, unknown> {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end <= start) {
    throw new ExtractionFailure("unparseable", "the reply contains no JSON object");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(content.slice(start, end + 1));
  } catch (error) {
    throw new ExtractionFailure("unparseable", `the reply is not valid JSON: ${(error as Error).message}`);
  }
  if (!isRecord(parsed)) throw new ExtractionFailure("unparseable", "the reply is not a JSON object");
  return parsed;
}

/* --------------------------------- slots --------------------------------- */

type SlotOutcome = { ok: true; value: unknown } | { ok: false; rejection: Rejection } | null;

function groundSlot(
  rule: SlotRule,
  entry: unknown,
  path: string,
  transcript: NormalisedText,
): SlotOutcome {
  if (entry === undefined || entry === null) return null;
  if (!isRecord(entry)) {
    return { ok: false, rejection: { path, reason: "malformed", evidence: null } };
  }

  const value = entry.value;
  // An empty slot is an absent slot; it needs no evidence and claims nothing.
  if (value === undefined || value === null || value === "" || value === "unknown") return null;

  const evidence = typeof entry.evidence === "string" ? entry.evidence : null;
  const reject = (reason: Rejection["reason"]): SlotOutcome => ({
    ok: false,
    rejection: { path, reason, evidence },
  });

  if (evidence === null || normalise(evidence).length === 0) return reject("missing_span");
  if (locate(evidence, transcript) === null) return reject("span_not_in_transcript");
  const span = normalise(evidence);

  switch (rule.type) {
    case "text": {
      if (typeof value !== "string") return reject("malformed");
      return indexOfPhrase(span, normalise(value)) === -1
        ? reject("value_not_in_span")
        : { ok: true, value: value.trim() };
    }
    case "dose": {
      const unit = entry.unit;
      if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return reject("malformed");
      if (typeof unit !== "string" || !(DOSE_UNITS as readonly string[]).includes(unit)) {
        return reject("malformed");
      }
      const dose = { value, unit: unit as DoseUnit };
      return parseDoses(evidence, dose.unit).some((heard) => sameDose(heard, dose))
        ? { ok: true, value: dose }
        : reject("value_not_in_span");
    }
    case "days": {
      if (typeof value !== "number" || !Number.isInteger(value) || value < 0) return reject("malformed");
      return parseTimeframeDays(evidence) === value
        ? { ok: true, value }
        : reject("value_not_in_span");
    }
    case "enum": {
      return typeof value === "string" && rule.allowed.includes(value)
        ? { ok: true, value }
        : reject("malformed");
    }
  }
}

/* --------------------------------- the gate --------------------------------- */

/**
 * Turn a raw model reply into the engine's `SpokenExtraction`, keeping only
 * values whose spans check out.
 *
 * Throws `ExtractionFailure("unparseable")` when there is no JSON object to
 * read at all; the caller falls back to rules only.
 */
export function groundExtraction(content: string, transcript: string): GroundingResult {
  const reply = parseModelJson(content);
  const text = normaliseWithOffsets(transcript);
  const rejected: Rejection[] = [];
  const items: SpokenItem[] = [];

  const rawItems = Array.isArray(reply.items) ? reply.items.slice(0, MAX_ITEMS) : [];
  if (!Array.isArray(reply.items)) {
    rejected.push({ path: "items", reason: "malformed", evidence: null });
  }

  rawItems.forEach((raw, index) => {
    const path = `items[${index}]`;
    if (!isRecord(raw) || !(ITEM_KINDS as readonly unknown[]).includes(raw.kind)) {
      rejected.push({ path, reason: "malformed", evidence: null });
      return;
    }
    const kind = raw.kind as ItemKind;

    // The utterance is what the comparator's rules re-read, so it gets the
    // same treatment as any value: no real span, no item.
    const cited = typeof raw.utterance === "string" ? raw.utterance : null;
    if (cited === null || normalise(cited).length === 0) {
      rejected.push({ path: `${path}.utterance`, reason: "missing_span", evidence: null });
      return;
    }
    const utterance = locate(cited, text);
    if (utterance === null) {
      rejected.push({ path: `${path}.utterance`, reason: "span_not_in_transcript", evidence: cited });
      return;
    }

    const rawSlots = isRecord(raw.slots) ? raw.slots : {};
    const slots: Record<string, unknown> = {};
    for (const [name, rule] of Object.entries(SLOT_RULES[kind])) {
      const outcome = groundSlot(rule, rawSlots[name], `${path}.slots.${name}`, text);
      if (outcome === null) continue;
      if (outcome.ok) slots[name] = outcome.value;
      else rejected.push(outcome.rejection);
    }

    items.push({ id: `llm-${index + 1}`, kind, utterance, slots } as SpokenItem);
  });

  // Questions are kept as the transcript's own words. The model's phrasing of
  // a question is never shown, so nothing can be paraphrased into advice.
  const questions: PharmacistQuestion[] = [];
  const rawQuestions = Array.isArray(reply.questions) ? reply.questions.slice(0, MAX_QUESTIONS) : [];
  rawQuestions.forEach((raw, index) => {
    const path = `questions[${index}]`;
    const cited = isRecord(raw) && typeof raw.evidence === "string" ? raw.evidence : null;
    if (cited === null || normalise(cited).length === 0) {
      rejected.push({ path, reason: "missing_span", evidence: null });
      return;
    }
    const utterance = locate(cited, text);
    if (utterance === null) {
      rejected.push({ path, reason: "span_not_in_transcript", evidence: cited });
      return;
    }
    questions.push({ id: `llm-q-${index + 1}`, question: utterance, utterance });
  });

  return { extraction: { transcript, items, questions }, rejected };
}
