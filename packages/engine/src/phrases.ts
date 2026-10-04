/**
 * Comparing a clinical phrase with how someone said it.
 *
 * Doses and frequencies are values and compare cleanly. "Heart failure" does
 * not: a carer says "his heart isn't pumping properly". Two deterministic
 * mechanisms, in order:
 *
 * 1. a small hand-written synonym table, auditable by a clinician;
 * 2. content-word coverage, which asks how much of the letter's phrase the
 *    person actually produced.
 *
 * Coverage short of the threshold returns `uncertain`, never `match`. This is
 * the slot type where a lenient grader would do the most damage, so it is the
 * one with the least leeway.
 */

import type { SlotVerdict } from "./types.js";
import { normalise, similarity } from "./text.js";

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "any",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "can",
  "do",
  "for",
  "from",
  "get",
  "getting",
  "had",
  "has",
  "have",
  "he",
  "her",
  "him",
  "his",
  "i",
  "if",
  "in",
  "is",
  "it",
  "its",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "out",
  "she",
  "so",
  "some",
  "that",
  "the",
  "their",
  "them",
  "then",
  "they",
  "this",
  "to",
  "up",
  "was",
  "we",
  "were",
  "when",
  "will",
  "with",
  "you",
  "your",
]);

/**
 * Lay wordings a clinician has agreed mean the same thing. Keyed by the
 * clinical phrase as it appears in the letter, normalised.
 *
 * Deliberately short. Everything not in here falls through to coverage, which
 * is conservative, rather than to a model, which is not.
 */
export const PHRASE_SYNONYMS: Record<string, string[]> = {
  "heart failure": [
    "heart is not pumping",
    "heart isnt pumping",
    "heart not pumping",
    "weak heart",
    "heart is weak",
    "heart cannot pump",
    "fluid building up",
    "water on the lungs",
    "fluid on the lungs",
  ],
  "fluid overload": ["too much fluid", "fluid building up", "swollen with fluid", "waterlogged"],
  breathlessness: [
    "out of breath",
    "short of breath",
    "cannot breathe",
    "struggling to breathe",
    "breathing trouble",
    "puffed out",
  ],
  "shortness of breath": [
    "out of breath",
    "short of breath",
    "cannot breathe",
    "struggling to breathe",
    "breathing trouble",
  ],
  "weight gain": ["putting on weight", "weight going up", "heavier", "gaining weight"],
  "swollen ankles": ["ankles swell", "swelling in the legs", "puffy ankles", "legs swell"],
  "chest pain": ["pain in the chest", "chest tightness", "tight chest"],
  "heart failure nurse": ["heart nurse", "specialist nurse", "the nurse for the heart"],
  "general practitioner": ["gp", "family doctor", "the surgery"],
};

/** Content words, lowercase, stopwords and short tokens removed. */
export function contentWords(phrase: string): string[] {
  return normalise(phrase)
    .split(/[\s-]+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

export interface PhraseComparison {
  verdict: SlotVerdict;
  /** 0-1 share of the letter's content words the person produced. */
  coverage: number;
  /** How the verdict was reached, for the README's worked examples. */
  via: "synonym" | "coverage" | "none";
}

export interface PhraseOptions {
  /** Coverage at or above this counts as a match. */
  matchThreshold?: number;
  /** Per-word fuzziness, so "breathless" covers "breathlessness". */
  wordSimilarity?: number;
  /** Extra synonyms on top of the built-in table. */
  synonyms?: Record<string, string[]>;
}

const PHRASE_DEFAULTS = { matchThreshold: 0.6, wordSimilarity: 0.82 } as const;

/**
 * Did the person's words cover the letter's phrase?
 *
 * Returns `absent` when nothing landed at all, `uncertain` for a partial hit,
 * and `match` only on a listed synonym or coverage over the threshold. It never
 * returns `mismatch`: saying too little about a symptom is a gap, not a
 * contradiction, and the two are re-taught differently.
 */
export function comparePhrase(
  expected: string,
  heard: string,
  options: PhraseOptions = {},
): PhraseComparison {
  const matchThreshold = options.matchThreshold ?? PHRASE_DEFAULTS.matchThreshold;
  const wordSimilarity = options.wordSimilarity ?? PHRASE_DEFAULTS.wordSimilarity;

  const spoken = normalise(heard);
  if (spoken.length === 0) return { verdict: "absent", coverage: 0, via: "none" };

  const key = normalise(expected);
  if (key.length > 0 && spoken.includes(key)) {
    return { verdict: "match", coverage: 1, via: "coverage" };
  }

  const table = { ...PHRASE_SYNONYMS, ...(options.synonyms ?? {}) };
  for (const synonym of table[key] ?? []) {
    if (spoken.includes(normalise(synonym))) {
      return { verdict: "match", coverage: 1, via: "synonym" };
    }
  }

  const expectedWords = contentWords(expected);
  if (expectedWords.length === 0) return { verdict: "absent", coverage: 0, via: "none" };

  const spokenWords = contentWords(heard);
  const covered = expectedWords.filter((word) =>
    spokenWords.some(
      (said) =>
        said === word ||
        said.startsWith(word) ||
        word.startsWith(said) ||
        similarity(said, word) >= wordSimilarity,
    ),
  ).length;

  const coverage = covered / expectedWords.length;
  if (coverage >= matchThreshold) return { verdict: "match", coverage, via: "coverage" };
  if (coverage > 0) return { verdict: "uncertain", coverage, via: "coverage" };
  return { verdict: "absent", coverage: 0, via: "none" };
}
