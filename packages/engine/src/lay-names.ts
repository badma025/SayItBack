/**
 * Lay-name dictionary. Households do not say "furosemide", they say "the water
 * tablet". The comparator needs that mapping to be able to confirm anything.
 *
 * Two properties matter more than coverage:
 *
 * 1. It is a plain data table, auditable by a pharmacist in one sitting.
 * 2. Lay names are many-to-many. "Water tablet" is furosemide *and*
 *    spironolactone, so resolving one has to be able to answer "ambiguous",
 *    which the comparator then treats as not-confirmed.
 */

import { normalise, normaliseWord } from "./text.js";

export interface DrugEntry {
  /** Generic name, lowercase. */
  generic: string;
  /** Brand names and common spellings that mean the same molecule. */
  synonyms: string[];
  /** What a carer is likely to call it. */
  layNames: string[];
}

/**
 * Cardiology-leaning, because the demo letter is a heart-failure discharge.
 * Every lay name here is one we are willing to show a pharmacist.
 */
export const DRUG_DICTIONARY: DrugEntry[] = [
  {
    generic: "furosemide",
    synonyms: ["frusemide", "lasix"],
    layNames: ["water tablet", "water tablets", "water pill", "water pills", "fluid tablet"],
  },
  {
    generic: "spironolactone",
    synonyms: ["aldactone"],
    layNames: ["water tablet", "water tablets", "water pill", "water pills"],
  },
  {
    generic: "bisoprolol",
    synonyms: ["cardicor", "emcor"],
    layNames: ["beta blocker", "heart rate tablet", "heart slowing tablet"],
  },
  {
    generic: "ramipril",
    synonyms: ["tritace"],
    layNames: ["blood pressure tablet", "blood pressure tablets", "ace inhibitor"],
  },
  {
    generic: "apixaban",
    synonyms: ["eliquis"],
    layNames: ["blood thinner", "blood thinners", "anticoagulant"],
  },
  {
    generic: "warfarin",
    synonyms: ["coumadin"],
    layNames: ["blood thinner", "blood thinners", "anticoagulant"],
  },
  {
    generic: "atorvastatin",
    synonyms: ["lipitor"],
    layNames: ["cholesterol tablet", "statin"],
  },
  {
    generic: "dapagliflozin",
    synonyms: ["forxiga"],
    layNames: ["sugar tablet", "sglt2"],
  },
  {
    generic: "digoxin",
    synonyms: ["lanoxin"],
    layNames: ["heart tablet"],
  },
  {
    generic: "amoxicillin",
    synonyms: ["amoxil"],
    layNames: ["antibiotic", "antibiotics"],
  },
  {
    generic: "paracetamol",
    synonyms: ["acetaminophen", "calpol", "panadol"],
    layNames: ["painkiller", "pain killer"],
  },
];

export type DrugResolution =
  /** The term names exactly one drug. */
  | { status: "resolved"; generic: string; via: "generic" | "synonym" | "lay_name" }
  /** The term names more than one drug in scope. Never confirm on this. */
  | { status: "ambiguous"; candidates: string[]; via: "lay_name" }
  /** Not in the dictionary at all. */
  | { status: "unknown" };

/**
 * Resolve a spoken term to a generic drug name.
 *
 * `inScope` is the set of generic names the letter actually mentions. Passing it
 * lets "water tablet" resolve cleanly when the letter has only furosemide, while
 * still reporting ambiguity when the letter has furosemide *and*
 * spironolactone. Narrowing by what the letter says is legitimate: the engine
 * only ever explains the patient's own document.
 */
export function resolveDrug(term: string, inScope?: readonly string[]): DrugResolution {
  const needle = normaliseWord(term);
  if (needle.length === 0) return { status: "unknown" };

  const scope = inScope?.map((name) => normaliseWord(name));
  const inScopeOnly = (generic: string) =>
    scope === undefined || scope.includes(normaliseWord(generic));

  for (const entry of DRUG_DICTIONARY) {
    if (normaliseWord(entry.generic) === needle) {
      return { status: "resolved", generic: entry.generic, via: "generic" };
    }
  }

  for (const entry of DRUG_DICTIONARY) {
    if (entry.synonyms.some((synonym) => normaliseWord(synonym) === needle)) {
      return { status: "resolved", generic: entry.generic, via: "synonym" };
    }
  }

  const byLayName = DRUG_DICTIONARY.filter((entry) =>
    entry.layNames.some((layName) => normaliseWord(layName) === needle),
  ).map((entry) => entry.generic);

  if (byLayName.length === 0) return { status: "unknown" };

  const narrowed = byLayName.filter(inScopeOnly);
  const candidates = narrowed.length > 0 ? narrowed : byLayName;

  if (candidates.length === 1) {
    return { status: "resolved", generic: candidates[0] as string, via: "lay_name" };
  }
  return { status: "ambiguous", candidates, via: "lay_name" };
}

/**
 * Every dictionary term that appears in a stretch of speech, longest first.
 *
 * Needed because lay names are phrases: tokenising "the water tablet" into
 * words loses the only term that identifies the medicine.
 */
export function findDrugTerms(text: string): string[] {
  const haystack = normalise(text);
  if (haystack.length === 0) return [];

  const found: string[] = [];
  for (const entry of DRUG_DICTIONARY) {
    for (const term of [entry.generic, ...entry.synonyms, ...entry.layNames]) {
      const needle = normalise(term);
      if (needle.length === 0 || found.includes(term)) continue;
      const pattern = new RegExp(`(?:^|\\s)${escapeRegExp(needle)}(?:$|\\s)`);
      if (pattern.test(haystack)) found.push(term);
    }
  }
  return found.sort((a, b) => b.length - a.length);
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Lay names for a generic, for the re-teach wording and for ASR biasing. */
export function layNamesFor(generic: string): string[] {
  const needle = normaliseWord(generic);
  const entry = DRUG_DICTIONARY.find((candidate) => normaliseWord(candidate.generic) === needle);
  return entry ? [...entry.layNames] : [];
}

/** Every token worth biasing the speech recogniser towards. */
export function biasVocabulary(generics: readonly string[]): string[] {
  const vocabulary = new Set<string>();
  for (const generic of generics) {
    const needle = normaliseWord(generic);
    const entry = DRUG_DICTIONARY.find((candidate) => normaliseWord(candidate.generic) === needle);
    vocabulary.add(generic);
    if (!entry) continue;
    for (const synonym of entry.synonyms) vocabulary.add(synonym);
    for (const layName of entry.layNames) vocabulary.add(layName);
  }
  return [...vocabulary];
}
