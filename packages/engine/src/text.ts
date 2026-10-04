/**
 * Text normalisation and similarity. Shared by the evidence check (quote vs
 * letter) and the comparator (spoken drug name vs letter drug name).
 */

// A full stop between two digits is a decimal point, not punctuation: dropping
// it would turn "2.5mg" into "2 5mg" and then into a dose of 25.
const PUNCTUATION = /(?<![0-9])\.(?![0-9])|[,;:!?()[\]{}'"‘’“”]/g;
const PUNCTUATION_CHAR = /[,;:!?()[\]{}'"‘’“”]/;
const DASHES = /[‐-―−]/g;

/**
 * Lowercase, flatten unicode dashes, drop punctuation and collapse whitespace.
 * Units and numbers are left alone here; `parseDose` handles those.
 */
export function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(DASHES, "-")
    .replace(PUNCTUATION, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalisation plus hyphen removal, for comparing single words. */
export function normaliseWord(input: string): string {
  return normalise(input).replace(/-/g, "");
}

/**
 * Normalise while keeping a map back to offsets in the original string, so a
 * match found in normalised space can be reported against the letter the user
 * is looking at.
 */
export interface NormalisedText {
  /** The normalised characters. */
  value: string;
  /** `offsets[i]` is the index in the original string of `value[i]`. */
  offsets: number[];
  original: string;
}

export function normaliseWithOffsets(input: string): NormalisedText {
  const chars: string[] = [];
  const offsets: number[] = [];
  const flattened = input.replace(DASHES, "-");

  for (let i = 0; i < flattened.length; i++) {
    const raw = flattened[i] as string;
    const isDecimalPoint =
      raw === "." && /[0-9]/.test(flattened[i - 1] ?? "") && /[0-9]/.test(flattened[i + 1] ?? "");
    const isDropped = raw === "." ? !isDecimalPoint : PUNCTUATION_CHAR.test(raw);
    const ch = isDropped || /\s/.test(raw) ? " " : raw.toLowerCase();

    if (ch === " ") {
      // Collapse runs of whitespace, and never lead with one.
      if (chars.length === 0 || chars[chars.length - 1] === " ") continue;
      chars.push(" ");
      offsets.push(i);
      continue;
    }
    chars.push(ch);
    offsets.push(i);
  }

  while (chars.length > 0 && chars[chars.length - 1] === " ") {
    chars.pop();
    offsets.pop();
  }

  return { value: chars.join(""), offsets, original: input };
}

/** Levenshtein edit distance, iterative with a single row. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    current[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const substitution = (previous[j - 1] as number) + (a[i - 1] === b[j - 1] ? 0 : 1);
      const insertion = (current[j - 1] as number) + 1;
      const deletion = (previous[j] as number) + 1;
      current[j] = Math.min(substitution, insertion, deletion);
    }
    previous = current.slice();
  }

  return previous[b.length] as number;
}

/** Edit distance scaled to 0-1, where 1 is identical. */
export function similarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return 1 - editDistance(a, b) / longest;
}

/**
 * Every digit run in the text, in order. The evidence check uses this to refuse
 * a fuzzy match that silently changes a number: "40mg" must never pass as a
 * match for "80mg".
 */
export function digitRuns(input: string): string[] {
  return input.match(/\d+(?:\.\d+)?/g) ?? [];
}
