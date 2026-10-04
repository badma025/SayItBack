/**
 * The comparator. Deterministic code, no model in the loop.
 *
 * It does two jobs: decide which thing the person was talking about (pairing),
 * and decide, slot by slot, whether what they said is what the letter says.
 *
 * One rule runs through all of it: **a slot is only `match` if the rule-based
 * parse of the transcript says so**. The extraction model's slot fill is used
 * as corroboration, never as the sole witness. A model that reads "once a day
 * like before" as a confirmed dose increase cannot turn a slot green on its
 * own, because `parseDose` found no number.
 */

import type {
  DiagnosisSlots,
  Dose,
  FollowUpSlots,
  ItemKind,
  MedicationChangeSlots,
  RedFlagSlots,
  SlotResult,
  SpokenItem,
  VerifiedItem,
} from "./types.js";
import {
  formatContact,
  formatDirection,
  formatDose,
  formatFrequency,
  formatTimeframe,
  parseContact,
  parseDirection,
  parseDoses,
  parseFrequency,
  parseTimeframeDays,
  sameDose,
} from "./parse.js";
import { findDrugTerms, resolveDrug } from "./lay-names.js";
import { comparePhrase, type PhraseOptions } from "./phrases.js";
import { normaliseWord, similarity } from "./text.js";

export interface ComparatorOptions extends PhraseOptions {
  /**
   * Accept a bare number ("it went up to eighty") as a dose, taking the unit
   * from the letter. On by default: carers do not say "milligrams", and the
   * number itself still has to be right.
   */
  allowBareNumberDose?: boolean;
  /**
   * How close a spoken drug name has to sound before the engine will even
   * consider it the same medicine.
   */
  drugPairingSimilarity?: number;
  /**
   * `strict` (default) refuses to confirm a drug the speech recogniser only
   * approximately produced: "fruity semi" for furosemide becomes `uncertain`,
   * so the UI asks rather than ticks.
   */
  drugMatchPolicy?: "strict" | "lenient";
  /**
   * Every generic name the letter mentions. Lay names are many-to-many, so
   * "water tablet" can only be resolved against what this letter contains.
   * `gradeTeachBack` fills this in; a caller comparing one item on its own gets
   * that item's drug as the scope.
   */
  drugScope?: readonly string[];
  /**
   * When someone states the correct new dose but never says the word
   * "increased", treat the direction as covered. On by default: the operative
   * fact of a dose change is the new number.
   */
  doseImpliesDirection?: boolean;
}

const COMPARATOR_DEFAULTS = {
  allowBareNumberDose: true,
  drugPairingSimilarity: 0.72,
  drugMatchPolicy: "strict",
  doseImpliesDirection: true,
} as const;

/* ---------------------------- corroboration ---------------------------- */

interface Corroborated<T> {
  value: T | null;
  /** The model and the rules both produced a value, and they disagree. */
  conflict: boolean;
  source: "both" | "rules" | "model" | "none";
}

/**
 * Combine what the model said a slot was with what the rules read off the
 * transcript.
 *
 * `model`-only is a deliberately weak result: the caller downgrades it to
 * `uncertain`, so nothing is ever confirmed on the model's word alone.
 */
function corroborate<T>(
  model: T | null | undefined,
  rule: T | null,
  equal: (a: T, b: T) => boolean,
): Corroborated<T> {
  const modelValue = model ?? null;
  if (modelValue !== null && rule !== null) {
    return equal(modelValue, rule)
      ? { value: rule, conflict: false, source: "both" }
      : { value: rule, conflict: true, source: "both" };
  }
  if (rule !== null) return { value: rule, conflict: false, source: "rules" };
  if (modelValue !== null) return { value: modelValue, conflict: false, source: "model" };
  return { value: null, conflict: false, source: "none" };
}

/** Turn a corroborated value into a verdict against the letter's value. */
function verdictFor<T>(
  found: Corroborated<T>,
  expected: T,
  equal: (a: T, b: T) => boolean,
): { verdict: SlotResult["verdict"]; note?: string } {
  if (found.value === null) return { verdict: "absent" };
  if (found.conflict) {
    return { verdict: "uncertain", note: "we heard two different things here" };
  }
  if (found.source === "model") {
    return { verdict: "uncertain", note: "not clear enough in the recording to confirm" };
  }
  return equal(found.value, expected) ? { verdict: "match" } : { verdict: "mismatch" };
}

/* ------------------------------- pairing ------------------------------- */

export interface Pairing {
  item: VerifiedItem;
  spoken: SpokenItem | null;
  /** 0-1 confidence that this utterance is about this item. */
  score: number;
}

export interface PairingResult {
  pairs: Pairing[];
  /** Spoken items that matched no letter item. Flagged, never graded. */
  unpaired: SpokenItem[];
}

/** Generic drug names the letter mentions, used to narrow lay names. */
export function lettersDrugScope(items: readonly VerifiedItem[]): string[] {
  return items
    .filter((item) => item.kind === "medication_change")
    .map((item) => (item.slots as MedicationChangeSlots).drug);
}

function drugTermsOf(spoken: SpokenItem): string[] {
  const slots = spoken.slots as Partial<MedicationChangeSlots>;
  return [slots.drug, slots.lay_name].filter((term): term is string => Boolean(term));
}

/**
 * How well a spoken item fits a letter item. 0 means "not about this".
 *
 * Medicines pair on identity (dictionary resolution, then name similarity);
 * everything else pairs on how much of the letter's phrase the person produced.
 */
export function pairingScore(
  item: VerifiedItem,
  spoken: SpokenItem,
  options: ComparatorOptions = {},
): number {
  if (item.kind !== spoken.kind) return 0;

  if (item.kind === "medication_change") {
    const expected = (item.slots as MedicationChangeSlots).drug;
    const threshold = options.drugPairingSimilarity ?? COMPARATOR_DEFAULTS.drugPairingSimilarity;
    const terms = [
      ...drugTermsOf(spoken),
      ...findDrugTerms(spoken.utterance),
      ...spoken.utterance.split(/[\s,.]+/),
    ];

    const scope = options.drugScope ?? [expected];
    let best = 0;
    for (const term of terms) {
      if (term.trim().length === 0) continue;
      const resolved = resolveDrug(term, scope);
      if (resolved.status === "resolved" && normaliseWord(resolved.generic) === normaliseWord(expected)) {
        return 1;
      }
      if (resolved.status === "ambiguous" && resolved.candidates.includes(expected)) {
        best = Math.max(best, 0.6);
      }
      const sounded = similarity(normaliseWord(term), normaliseWord(expected));
      if (sounded >= threshold) best = Math.max(best, sounded * 0.8);
    }
    return best;
  }

  const expectedPhrase =
    item.kind === "diagnosis"
      ? (item.slots as DiagnosisSlots).condition
      : item.kind === "red_flag"
        ? (item.slots as RedFlagSlots).symptom
        : (item.slots as FollowUpSlots).with_whom;

  const phrase = comparePhrase(expectedPhrase, spoken.utterance, options);
  let score = phrase.verdict === "match" ? 1 : phrase.coverage;

  if (item.kind === "red_flag") {
    const contact = (item.slots as RedFlagSlots).contact;
    if (contact !== "unknown" && parseContact(spoken.utterance) === contact) {
      score = Math.max(score, 0.5);
    }
  }
  return score;
}

/**
 * Greedily pair spoken items to letter items, best score first.
 *
 * When a kind has exactly one letter item and one spoken item, they pair even
 * on a weak score: the person plainly meant that one, and grading a vague
 * attempt is more useful than reporting it as never mentioned.
 */
export function pairItems(
  items: readonly VerifiedItem[],
  spokenItems: readonly SpokenItem[],
  options: ComparatorOptions = {},
): PairingResult {
  const scoped: ComparatorOptions = {
    ...options,
    drugScope: options.drugScope ?? lettersDrugScope(items),
  };
  const candidates: Array<{ itemIndex: number; spokenIndex: number; score: number }> = [];

  items.forEach((item, itemIndex) => {
    spokenItems.forEach((spoken, spokenIndex) => {
      const score = pairingScore(item, spoken, scoped);
      if (score > 0) candidates.push({ itemIndex, spokenIndex, score });
    });
  });

  candidates.sort((a, b) => b.score - a.score);

  const pairedItem = new Map<number, { spoken: SpokenItem; score: number }>();
  const usedSpoken = new Set<number>();
  for (const candidate of candidates) {
    if (pairedItem.has(candidate.itemIndex) || usedSpoken.has(candidate.spokenIndex)) continue;
    pairedItem.set(candidate.itemIndex, {
      spoken: spokenItems[candidate.spokenIndex] as SpokenItem,
      score: candidate.score,
    });
    usedSpoken.add(candidate.spokenIndex);
  }

  // Sole-candidate rule, per kind.
  const kinds = new Set<ItemKind>([...items.map((i) => i.kind), ...spokenItems.map((s) => s.kind)]);
  for (const kind of kinds) {
    const itemIndexes = items.flatMap((item, index) => (item.kind === kind ? [index] : []));
    const spokenIndexes = spokenItems.flatMap((spoken, index) =>
      spoken.kind === kind ? [index] : [],
    );
    if (itemIndexes.length !== 1 || spokenIndexes.length !== 1) continue;

    const itemIndex = itemIndexes[0] as number;
    const spokenIndex = spokenIndexes[0] as number;
    if (pairedItem.has(itemIndex) || usedSpoken.has(spokenIndex)) continue;

    pairedItem.set(itemIndex, { spoken: spokenItems[spokenIndex] as SpokenItem, score: 0.1 });
    usedSpoken.add(spokenIndex);
  }

  return {
    pairs: items.map((item, index) => {
      const paired = pairedItem.get(index);
      return { item, spoken: paired?.spoken ?? null, score: paired?.score ?? 0 };
    }),
    unpaired: spokenItems.filter((_, index) => !usedSpoken.has(index)),
  };
}

/* ---------------------------- slot comparison ---------------------------- */

/**
 * Compare one letter item against what was said about it.
 *
 * Slots the letter does not state are left out entirely rather than reported as
 * missing: a stopped medicine has no dose to get right.
 */
export function compareItem(
  item: VerifiedItem,
  spoken: SpokenItem | null,
  options: ComparatorOptions = {},
): SlotResult[] {
  switch (item.kind) {
    case "medication_change":
      return compareMedication(item.slots as MedicationChangeSlots, spoken, options);
    case "diagnosis":
      return compareDiagnosis(item.slots as DiagnosisSlots, spoken, options);
    case "red_flag":
      return compareRedFlag(item.slots as RedFlagSlots, spoken, options);
    case "follow_up":
      return compareFollowUp(item.slots as FollowUpSlots, spoken, options);
  }
}

function compareMedication(
  expected: MedicationChangeSlots,
  spoken: SpokenItem | null,
  options: ComparatorOptions,
): SlotResult[] {
  const policy = options.drugMatchPolicy ?? COMPARATOR_DEFAULTS.drugMatchPolicy;
  const allowBareNumber = options.allowBareNumberDose ?? COMPARATOR_DEFAULTS.allowBareNumberDose;
  const doseImpliesDirection =
    options.doseImpliesDirection ?? COMPARATOR_DEFAULTS.doseImpliesDirection;

  const utterance = spoken?.utterance ?? "";
  const slots = (spoken?.slots ?? {}) as Partial<MedicationChangeSlots>;
  const results: SlotResult[] = [];

  /* drug */
  results.push(compareDrug(expected.drug, spoken, utterance, policy, options));

  /* dose */
  let doseVerdict: SlotResult["verdict"] = "absent";
  if (expected.dose !== null) {
    const fallbackUnit = allowBareNumber ? expected.dose.unit : undefined;
    const heardDoses = parseDoses(utterance, fallbackUnit);
    const lastHeard = heardDoses.length > 0 ? (heardDoses[heardDoses.length - 1] as Dose) : null;
    const found = corroborate<Dose>(slots.dose, lastHeard, sameDose);
    const outcome = verdictFor(found, expected.dose, sameDose);

    // "From forty to eighty" mentions the right number in the wrong place.
    if (
      outcome.verdict === "mismatch" &&
      heardDoses.length > 1 &&
      heardDoses.some((dose) => sameDose(dose, expected.dose as Dose))
    ) {
      outcome.verdict = "uncertain";
      outcome.note = "more than one dose was mentioned";
    }

    doseVerdict = outcome.verdict;
    results.push({
      slot: "dose",
      verdict: outcome.verdict,
      expected: formatDose(expected.dose),
      heard: found.value ? formatDose(found.value) : null,
      critical: true,
      ...(outcome.note ? { note: outcome.note } : {}),
    });
  }

  /* direction */
  if (expected.direction !== "unknown") {
    const ruleDirection = parseDirection(utterance);
    const found = corroborate(
      slots.direction === "unknown" ? null : slots.direction,
      ruleDirection === "unknown" ? null : ruleDirection,
      (a, b) => a === b,
    );
    const outcome = verdictFor(found, expected.direction, (a, b) => a === b);

    const coveredByDose = doseImpliesDirection && outcome.verdict === "absent" && doseVerdict === "match";
    results.push({
      slot: "direction",
      verdict: coveredByDose ? "match" : outcome.verdict,
      expected: formatDirection(expected.direction),
      heard: found.value ? formatDirection(found.value) : null,
      critical: true,
      ...(coveredByDose
        ? { note: "taken as covered, because the new dose was said correctly" }
        : outcome.note
          ? { note: outcome.note }
          : {}),
    });
  }

  /* frequency */
  if (expected.frequency !== "unknown") {
    const ruleFrequency = parseFrequency(utterance);
    const found = corroborate(
      slots.frequency === "unknown" ? null : slots.frequency,
      ruleFrequency === "unknown" ? null : ruleFrequency,
      (a, b) => a === b,
    );
    const outcome = verdictFor(found, expected.frequency, (a, b) => a === b);
    results.push({
      slot: "frequency",
      verdict: outcome.verdict,
      expected: formatFrequency(expected.frequency),
      heard: found.value ? formatFrequency(found.value) : null,
      critical: true,
      ...(outcome.note ? { note: outcome.note } : {}),
    });
  }

  return results;
}

function compareDrug(
  expected: string,
  spoken: SpokenItem | null,
  utterance: string,
  policy: "strict" | "lenient",
  options: ComparatorOptions,
): SlotResult {
  const base = { slot: "drug", expected, critical: true } as const;
  if (spoken === null) return { ...base, verdict: "absent", heard: null };

  const threshold = options.drugPairingSimilarity ?? COMPARATOR_DEFAULTS.drugPairingSimilarity;
  const scope = options.drugScope ?? [expected];
  const terms = [
    ...drugTermsOf(spoken),
    ...findDrugTerms(utterance),
    ...utterance.split(/[\s,.]+/),
  ].filter((term) => term.trim().length > 0);

  let ambiguous: { term: string; candidates: string[] } | null = null;
  let sounded: { term: string; score: number } | null = null;

  for (const term of terms) {
    const resolved = resolveDrug(term, scope);
    if (resolved.status === "resolved") {
      if (normaliseWord(resolved.generic) === normaliseWord(expected)) {
        return { ...base, verdict: "match", heard: term };
      }
      continue; // a different, known medicine: not evidence about this one
    }
    if (resolved.status === "ambiguous" && resolved.candidates.includes(expected)) {
      ambiguous = { term, candidates: resolved.candidates };
    }
    const score = similarity(normaliseWord(term), normaliseWord(expected));
    if (score >= threshold && (sounded === null || score > sounded.score)) {
      sounded = { term, score };
    }
  }

  if (ambiguous !== null) {
    return {
      ...base,
      verdict: "uncertain",
      heard: ambiguous.term,
      note: `"${ambiguous.term}" could be ${ambiguous.candidates.join(" or ")}`,
    };
  }
  if (sounded !== null) {
    return policy === "lenient"
      ? { ...base, verdict: "match", heard: sounded.term, note: "matched on sound, not spelling" }
      : {
          ...base,
          verdict: "uncertain",
          heard: sounded.term,
          note: `heard as "${sounded.term}", which only sounds like ${expected}`,
        };
  }
  return { ...base, verdict: "absent", heard: null };
}

function compareDiagnosis(
  expected: DiagnosisSlots,
  spoken: SpokenItem | null,
  options: ComparatorOptions,
): SlotResult[] {
  const utterance = spoken?.utterance ?? "";
  const phrase = comparePhrase(expected.condition, utterance, options);
  return [
    {
      slot: "condition",
      verdict: phrase.verdict,
      expected: expected.condition,
      heard: utterance.length > 0 ? utterance : null,
      critical: true,
      ...(phrase.verdict === "uncertain"
        ? { note: "only part of it came through" }
        : {}),
    },
  ];
}

function compareRedFlag(
  expected: RedFlagSlots,
  spoken: SpokenItem | null,
  options: ComparatorOptions,
): SlotResult[] {
  const utterance = spoken?.utterance ?? "";
  const slots = (spoken?.slots ?? {}) as Partial<RedFlagSlots>;
  const phrase = comparePhrase(expected.symptom, utterance, options);

  const results: SlotResult[] = [
    {
      slot: "symptom",
      verdict: phrase.verdict,
      expected: expected.symptom,
      heard: utterance.length > 0 ? utterance : null,
      critical: true,
      ...(phrase.verdict === "uncertain" ? { note: "only part of it came through" } : {}),
    },
  ];

  if (expected.contact !== "unknown") {
    const ruleContact = parseContact(utterance);
    const found = corroborate(
      slots.contact === "unknown" ? null : slots.contact,
      ruleContact === "unknown" ? null : ruleContact,
      (a, b) => a === b,
    );
    const outcome = verdictFor(found, expected.contact, (a, b) => a === b);
    results.push({
      slot: "contact",
      verdict: outcome.verdict,
      expected: formatContact(expected.contact),
      heard: found.value ? formatContact(found.value) : null,
      critical: true,
      ...(outcome.note ? { note: outcome.note } : {}),
    });
  }

  return results;
}

function compareFollowUp(
  expected: FollowUpSlots,
  spoken: SpokenItem | null,
  options: ComparatorOptions,
): SlotResult[] {
  const utterance = spoken?.utterance ?? "";
  const slots = (spoken?.slots ?? {}) as Partial<FollowUpSlots>;
  const phrase = comparePhrase(expected.with_whom, utterance, options);

  const results: SlotResult[] = [
    {
      slot: "with_whom",
      verdict: phrase.verdict,
      expected: expected.with_whom,
      heard: utterance.length > 0 ? utterance : null,
      critical: true,
      ...(phrase.verdict === "uncertain" ? { note: "only part of it came through" } : {}),
    },
  ];

  if (expected.timeframe_days !== null) {
    const ruleDays = parseTimeframeDays(utterance);
    const found = corroborate(slots.timeframe_days, ruleDays, (a, b) => a === b);
    const outcome = verdictFor(found, expected.timeframe_days, (a, b) => a === b);
    results.push({
      slot: "timeframe_days",
      verdict: outcome.verdict,
      expected: formatTimeframe(expected.timeframe_days),
      heard: found.value !== null ? formatTimeframe(found.value) : null,
      critical: true,
      ...(outcome.note ? { note: outcome.note } : {}),
    });
  }

  return results;
}
