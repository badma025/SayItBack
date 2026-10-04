/**
 * The evidence gate: an extracted item is only allowed into the receipt if the
 * quote it cites is really in the letter, and if the slot values it asserts are
 * visible in that quote.
 *
 * This is where most of the hallucination defence lives. Three checks, in order
 * of how often they catch something:
 *
 * 1. **Span check.** The quote must match the letter text, exactly or within a
 *    tight edit distance.
 * 2. **Digit check.** Fuzzy matching must never change a number. "40mg" read as
 *    "80mg" is one character and 40 milligrams apart, so similarity alone would
 *    wave it through.
 * 3. **Slot grounding.** A dose of 80mg has to appear in the quote. An item
 *    whose quote says "reduce" cannot carry `direction: "increased"`.
 */

import type {
  EvidenceMatch,
  ExtractionWarning,
  MedicationChangeSlots,
  RawItem,
  RawLetterExtraction,
  UnverifiedItem,
  VerifiedItem,
  VerifiedLetter,
} from "./types.js";
import { digitRuns, normalise, normaliseWithOffsets } from "./text.js";
import { parseDirection, parseNumber } from "./parse.js";

export interface EvidenceOptions {
  /** Minimum similarity for a fuzzy span match. */
  minSimilarity?: number;
  /** Quotes shorter than this (normalised characters) are not evidence. */
  minQuoteLength?: number;
}

const DEFAULTS = { minSimilarity: 0.9, minQuoteLength: 8 } as const;

export type QuoteCheck =
  | { status: "verified"; match: EvidenceMatch }
  | {
      status: "unverified";
      reason: "no_match" | "digits_differ" | "quote_too_short";
      nearest: EvidenceMatch | null;
    };

/**
 * Find a quote in a source text.
 *
 * Uses approximate substring matching (Sellers' variant of Levenshtein, where
 * the match may start anywhere) so a single pass over the letter finds the best
 * window, rather than sliding a fixed one.
 */
export function findQuote(
  quote: string,
  sourceText: string,
  options: EvidenceOptions = {},
): QuoteCheck {
  const minSimilarity = options.minSimilarity ?? DEFAULTS.minSimilarity;
  const minQuoteLength = options.minQuoteLength ?? DEFAULTS.minQuoteLength;

  const needle = normalise(quote);
  const haystack = normaliseWithOffsets(sourceText);

  if (needle.length < minQuoteLength) {
    return { status: "unverified", reason: "quote_too_short", nearest: null };
  }

  const exact = haystack.value.indexOf(needle);
  if (exact !== -1) {
    const match = toMatch(haystack, exact, exact + needle.length, "exact", 1);
    return digitsAgree(quote, match)
      ? { status: "verified", match }
      : { status: "unverified", reason: "digits_differ", nearest: match };
  }

  const best = bestApproximateMatch(needle, haystack.value);
  if (best === null) return { status: "unverified", reason: "no_match", nearest: null };

  const nearest = toMatch(haystack, best.start, best.end, "fuzzy", best.similarity);
  if (best.similarity < minSimilarity) {
    return { status: "unverified", reason: "no_match", nearest };
  }
  if (!digitsAgree(quote, nearest)) {
    return { status: "unverified", reason: "digits_differ", nearest };
  }
  return { status: "verified", match: nearest };
}

function toMatch(
  haystack: { offsets: number[]; original: string },
  start: number,
  end: number,
  kind: "exact" | "fuzzy",
  similarity: number,
): EvidenceMatch {
  const originalStart = haystack.offsets[start] ?? 0;
  const lastIndex = Math.max(start, end - 1);
  const originalEnd = (haystack.offsets[lastIndex] ?? haystack.original.length - 1) + 1;
  return {
    kind,
    start: originalStart,
    end: originalEnd,
    matchedText: haystack.original.slice(originalStart, originalEnd),
    similarity,
  };
}

/**
 * Numbers may not drift. Every digit run in the quote must appear, the same
 * number of times, in the span the letter actually contains.
 */
function digitsAgree(quote: string, match: EvidenceMatch): boolean {
  const claimed = digitRuns(quote);
  if (claimed.length === 0) return true;

  const present = digitRuns(match.matchedText);
  const pool = [...present];
  for (const run of claimed) {
    const index = pool.indexOf(run);
    if (index === -1) return false;
    pool.splice(index, 1);
  }
  return true;
}

interface ApproximateMatch {
  start: number;
  end: number;
  similarity: number;
}

/**
 * Best approximate occurrence of `needle` anywhere in `haystack`.
 *
 * Row 0 of the DP table is all zeros, which makes the match free to start at any
 * offset; the minimum of the final row is the best end offset. A parallel row
 * carries the start offset forward so the caller can highlight the span.
 */
function bestApproximateMatch(needle: string, haystack: string): ApproximateMatch | null {
  if (needle.length === 0 || haystack.length === 0) return null;

  const width = haystack.length + 1;
  let previousCost = new Array<number>(width).fill(0);
  let previousStart = Array.from({ length: width }, (_, j) => j);
  let currentCost = new Array<number>(width).fill(0);
  let currentStart = new Array<number>(width).fill(0);

  for (let i = 1; i <= needle.length; i++) {
    currentCost[0] = i;
    currentStart[0] = 0;

    for (let j = 1; j <= width - 1; j++) {
      const substitution =
        (previousCost[j - 1] as number) + (needle[i - 1] === haystack[j - 1] ? 0 : 1);
      const deletion = (previousCost[j] as number) + 1; // a needle char with no source char
      const insertion = (currentCost[j - 1] as number) + 1; // a source char not in the needle

      if (substitution <= deletion && substitution <= insertion) {
        currentCost[j] = substitution;
        currentStart[j] = previousStart[j - 1] as number;
      } else if (deletion <= insertion) {
        currentCost[j] = deletion;
        currentStart[j] = previousStart[j] as number;
      } else {
        currentCost[j] = insertion;
        currentStart[j] = currentStart[j - 1] as number;
      }
    }

    [previousCost, currentCost] = [currentCost, previousCost];
    [previousStart, currentStart] = [currentStart, previousStart];
  }

  let bestEnd = 0;
  let bestCost = Number.POSITIVE_INFINITY;
  for (let j = 1; j <= width - 1; j++) {
    const cost = previousCost[j] as number;
    if (cost < bestCost) {
      bestCost = cost;
      bestEnd = j;
    }
  }
  if (bestEnd === 0) return null;

  const start = previousStart[bestEnd] as number;
  return {
    start,
    end: bestEnd,
    similarity: Math.max(0, 1 - bestCost / needle.length),
  };
}

/* ------------------------- slot grounding ------------------------- */

export type SlotGrounding =
  | { status: "ok"; warnings: ExtractionWarning[] }
  | {
      status: "failed";
      reason: "slot_not_in_quote" | "slot_conflicts_with_quote";
      detail: string;
    };

/**
 * Check that the slot values an item asserts are visible in its own quote.
 *
 * Only numbers are treated as hard requirements. A letter may state a change in
 * a table column the quote does not cover, so a direction that is merely absent
 * from the quote earns a warning; a direction that *contradicts* the quote fails.
 */
export function checkSlotGrounding(item: RawItem): SlotGrounding {
  const warnings: ExtractionWarning[] = [];
  if (item.kind !== "medication_change") return { status: "ok", warnings };

  const slots = item.slots as MedicationChangeSlots;
  const quote = item.evidence.quote;
  const runs = digitRuns(quote);
  const spelled = spelledNumbers(quote);

  for (const [name, dose] of [
    ["dose", slots.dose],
    ["previous_dose", slots.previous_dose],
  ] as const) {
    if (dose === null) continue;
    const asText = String(dose.value);
    const present = runs.includes(asText) || spelled.includes(dose.value);
    if (!present) {
      return {
        status: "failed",
        reason: "slot_not_in_quote",
        detail: `${name} ${asText}${dose.unit} does not appear in the quote`,
      };
    }
  }

  if (slots.direction !== "unknown") {
    const fromQuote = parseDirection(quote);
    if (fromQuote === "unknown") {
      warnings.push({
        code: "direction_not_in_quote",
        detail: `the quote does not say the dose was ${slots.direction}`,
      });
    } else if (fromQuote !== slots.direction) {
      return {
        status: "failed",
        reason: "slot_conflicts_with_quote",
        detail: `slot says ${slots.direction}, the quote reads as ${fromQuote}`,
      };
    }
  }

  return { status: "ok", warnings };
}

/** Numbers written as words in a quote, e.g. "two tablets" in a dosing line. */
function spelledNumbers(text: string): number[] {
  const values: number[] = [];
  for (const word of normalise(text).split(/[\s-]+/)) {
    const value = parseNumber(word);
    if (value !== null && !/^\d/.test(word)) values.push(value);
  }
  return values;
}

/* --------------------------- the gate --------------------------- */

export interface VerifyOptions extends EvidenceOptions {
  sourceKind?: VerifiedLetter["sourceKind"];
}

/**
 * Run the whole gate over one extraction. Verified items go on to grading;
 * everything else becomes a "check with the ward" line, never a silent drop -
 * a dropped medicine change is exactly the failure that leaves a receipt
 * wrongly all green.
 */
export function verifyLetterExtraction(
  sourceText: string,
  extraction: RawLetterExtraction,
  options: VerifyOptions = {},
): VerifiedLetter {
  const sourceKind = options.sourceKind ?? "pdf_text_layer";
  const items: VerifiedItem[] = [];
  const checkWithWard: UnverifiedItem[] = [];

  for (const item of extraction.items) {
    const quoteCheck = findQuote(item.evidence.quote, sourceText, options);
    if (quoteCheck.status === "unverified") {
      checkWithWard.push({
        id: item.id,
        kind: item.kind,
        slots: item.slots,
        evidence: {
          ...item.evidence,
          status: "unverified",
          reason: quoteCheck.reason,
          nearest: quoteCheck.nearest,
        },
      });
      continue;
    }

    const grounding = checkSlotGrounding(item);
    if (grounding.status === "failed") {
      checkWithWard.push({
        id: item.id,
        kind: item.kind,
        slots: item.slots,
        evidence: {
          ...item.evidence,
          status: "unverified",
          reason: grounding.reason,
          nearest: quoteCheck.match,
        },
      });
      continue;
    }

    const warnings = [...grounding.warnings];
    if (quoteCheck.match.kind === "fuzzy") {
      warnings.push({
        code: "fuzzy_quote",
        detail: `matched at ${quoteCheck.match.similarity.toFixed(2)} similarity, not word for word`,
      });
    }
    if (sourceKind === "ocr") {
      warnings.push({
        code: "ocr_source",
        detail: "the text came from OCR, so the quote was checked against a machine reading",
      });
    }

    items.push({
      id: item.id,
      kind: item.kind,
      slots: item.slots,
      evidence: { ...item.evidence, status: "verified", match: quoteCheck.match },
      warnings,
    });
  }

  return { sourceText, sourceKind, items, checkWithWard };
}
