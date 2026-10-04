/**
 * Rule-based parsers for the slot values a person speaks.
 *
 * These exist so the LLM is never the only thing that read the transcript. The
 * comparator fills slots twice - once from the model, once from these rules -
 * and refuses to confirm anything the two disagree about. A lenient model
 * cannot turn "once a day like before" into a confirmed dose increase on its
 * own.
 */

import type { ContactRoute, Direction, Dose, DoseUnit, Frequency } from "./types.js";
import { normalise } from "./text.js";

/* ------------------------------ numbers ------------------------------ */

const UNITS_TO_NINETEEN: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const TENS: Record<string, number> = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fourty: 40, // common ASR and typing slip
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

/**
 * Read a spelled-out English number up to 999, or a numeral.
 *
 * Returns null rather than guessing. "a" and "an" are deliberately not treated
 * as 1: "a tablet" is not a dose statement.
 */
export function parseNumber(input: string): number | null {
  const text = normalise(input);
  if (text.length === 0) return null;

  const numeral = text.match(/^\d+(?:\.\d+)?$/);
  if (numeral) return Number(numeral[0]);

  const words = text.split(/[\s-]+/).filter((word) => word !== "and");
  let total = 0;
  let current = 0;
  let sawNumber = false;

  for (const word of words) {
    if (word === "hundred") {
      if (current === 0) return null;
      current *= 100;
      continue;
    }
    if (word in UNITS_TO_NINETEEN) {
      const value = UNITS_TO_NINETEEN[word] as number;
      // "eighty five" style: tens then units.
      current += value;
      sawNumber = true;
      continue;
    }
    if (word in TENS) {
      current += TENS[word] as number;
      sawNumber = true;
      continue;
    }
    if (/^\d+(?:\.\d+)?$/.test(word)) {
      current += Number(word);
      sawNumber = true;
      continue;
    }
    return null;
  }

  if (!sawNumber) return null;
  total += current;
  return total;
}

/* ------------------------------- doses ------------------------------- */

const UNIT_WORDS: Array<{ pattern: RegExp; unit: DoseUnit }> = [
  { pattern: /\b(?:mcg|microgram|micrograms|micrograms?)\b/, unit: "mcg" },
  { pattern: /\b(?:mg|milligram|milligrams|milligrammes?)\b/, unit: "mg" },
  { pattern: /\b(?:g|gram|grams|grammes?)\b/, unit: "g" },
  { pattern: /\b(?:ml|millilitre|millilitres|milliliters?)\b/, unit: "ml" },
  { pattern: /\b(?:units?|iu)\b/, unit: "unit" },
  { pattern: /\b(?:tablets?|tabs?|pills?)\b/, unit: "tablet" },
  { pattern: /\b(?:puffs?)\b/, unit: "puff" },
  { pattern: /\b(?:patch|patches)\b/, unit: "patch" },
];

/** Milligram-equivalents, for units that convert. The rest never convert. */
const MASS_IN_MG: Partial<Record<DoseUnit, number>> = {
  mcg: 0.001,
  mg: 1,
  g: 1000,
};

export interface ParsedDose extends Dose {
  /** The unit was not spoken; it was taken from the letter's own unit. */
  unitInferred: boolean;
}

/**
 * Number words, longest first. A regex alternation takes the first branch that
 * fits, so "eight" ahead of "eighty" would read "eighty milligrams" as 8mg -
 * exactly the kind of silent number error this engine exists to catch.
 */
const NUMBER_WORD = [
  "\\d+(?:\\.\\d+)?",
  ...[...Object.keys(UNITS_TO_NINETEEN), ...Object.keys(TENS), "hundred"].sort(
    (a, b) => b.length - a.length,
  ),
].join("|");

/**
 * Words that follow a number without making it a dose. "two times a day" is a
 * frequency and "in three days" is an interval; neither may be read as 2mg or
 * 3mg just because the letter happens to use milligrams.
 */
const NOT_A_DOSE_AFTER_NUMBER =
  /^(?:times?|days?|weeks?|months?|years?|hours?|minutes?|mins?|am|pm|oclock|o)$/;

/**
 * Every dose mentioned, in the order spoken.
 *
 * Handles "eighty milligrams", "80mg", "two tablets" and - when `fallbackUnit`
 * is given - a bare "eighty". Bare numbers are accepted because carers say "it
 * went up to eighty", not "to eighty milligrams"; the result is flagged
 * `unitInferred`, and the comparator still requires the number itself to match.
 */
export function parseDoses(input: string, fallbackUnit?: DoseUnit): ParsedDose[] {
  const text = normalise(input);
  if (text.length === 0) return [];

  // A number (numeral or words) optionally followed by a unit.
  const pattern = new RegExp(
    `((?:${NUMBER_WORD})(?:[\\s-]+(?:${NUMBER_WORD}))*)\\s*([a-z]+)?`,
    "g",
  );

  const doses: ParsedDose[] = [];
  for (const candidate of text.matchAll(pattern)) {
    const value = parseNumber(candidate[1] as string);
    if (value === null) continue;

    const trailing = candidate[2];
    if (trailing !== undefined) {
      const matched = UNIT_WORDS.find((entry) => entry.pattern.test(trailing));
      if (matched) {
        doses.push({ value, unit: matched.unit, unitInferred: false });
        continue;
      }
      if (NOT_A_DOSE_AFTER_NUMBER.test(trailing)) continue;
    }

    if (fallbackUnit !== undefined) {
      doses.push({ value, unit: fallbackUnit, unitInferred: true });
    }
  }

  return doses;
}

/**
 * The dose the person is claiming to take now: the last one mentioned.
 *
 * English puts the new value last - "it went up from forty to eighty" - so the
 * last dose is the current one. When more than one is mentioned the caller
 * should treat the statement as ambiguous rather than confirmed; see
 * `parseDoses`.
 */
export function parseDose(input: string, fallbackUnit?: DoseUnit): ParsedDose | null {
  const doses = parseDoses(input, fallbackUnit);
  return doses.length === 0 ? null : (doses[doses.length - 1] as ParsedDose);
}

/** Are two doses the same quantity? Converts between mass units only. */
export function sameDose(a: Dose, b: Dose): boolean {
  if (a.unit === b.unit) return a.value === b.value;

  const aFactor = MASS_IN_MG[a.unit];
  const bFactor = MASS_IN_MG[b.unit];
  if (aFactor === undefined || bFactor === undefined) return false;

  // Compare in micrograms to keep the arithmetic in whole-ish numbers.
  const left = a.value * aFactor * 1000;
  const right = b.value * bFactor * 1000;
  return Math.abs(left - right) < 1e-6;
}

export function formatDose(dose: Dose): string {
  return dose.unit === "tablet" || dose.unit === "puff" || dose.unit === "patch"
    ? `${dose.value} ${dose.unit}${dose.value === 1 ? "" : "s"}`
    : `${dose.value}${dose.unit}`;
}

/* ----------------------------- frequency ----------------------------- */

const FREQUENCY_PATTERNS: Array<{ pattern: RegExp; frequency: Frequency }> = [
  {
    pattern:
      /\b(?:as needed|when needed|if needed|as required|only when|only if|prn|when (?:he|she|they|you|i) needs? it)\b/,
    frequency: "as_needed",
  },
  { pattern: /\b(?:every other day|alternate days|every second day)\b/, frequency: "every_other_day" },
  { pattern: /\b(?:once a week|weekly|every week|one a week)\b/, frequency: "weekly" },
  {
    pattern: /\b(?:four times (?:a )?(?:day|daily)|qds|four a day)\b/,
    frequency: "four_times_daily",
  },
  {
    pattern: /\b(?:three times (?:a )?(?:day|daily)|tds|tid|thrice daily|three a day)\b/,
    frequency: "three_times_daily",
  },
  {
    pattern:
      /\b(?:twice (?:a )?(?:day|daily)|two times (?:a )?(?:day|daily)|bd|bid|morning and (?:night|evening)|twice daily)\b/,
    frequency: "twice_daily",
  },
  {
    pattern:
      /\b(?:once (?:a )?(?:day|daily)|one (?:a|per) day|one time (?:a )?day|od|every day|each day|daily|every morning|in the mornings?|at night|every night|each night)\b/,
    frequency: "once_daily",
  },
];

/** Map spoken dosing language onto the canonical enum. */
export function parseFrequency(input: string): Frequency {
  const text = normalise(input);
  for (const entry of FREQUENCY_PATTERNS) {
    if (entry.pattern.test(text)) return entry.frequency;
  }
  return "unknown";
}

export function formatFrequency(frequency: Frequency): string {
  const labels: Record<Frequency, string> = {
    once_daily: "once a day",
    twice_daily: "twice a day",
    three_times_daily: "three times a day",
    four_times_daily: "four times a day",
    every_other_day: "every other day",
    weekly: "once a week",
    as_needed: "only when needed",
    unknown: "not stated",
  };
  return labels[frequency];
}

/* ----------------------------- direction ----------------------------- */

const DIRECTION_PATTERNS: Array<{ pattern: RegExp; direction: Direction }> = [
  {
    pattern: /\b(?:stopped|stop taking|stop it|come off|coming off|no longer|discontinued|don't take|do not take)\b/,
    direction: "stopped",
  },
  {
    pattern: /\b(?:increased|increase|gone up|going up|goes up|went up|put up|doubled|higher|more of|up to|up from)\b/,
    direction: "increased",
  },
  {
    pattern: /\b(?:decreased|decrease|reduced|reduce|gone down|going down|went down|halved|lower|less of|cut down|down to)\b/,
    direction: "decreased",
  },
  {
    pattern: /\b(?:started|start taking|new tablet|new medicine|new one|begin|beginning|added)\b/,
    direction: "started",
  },
  {
    pattern: /\b(?:same as before|like before|as before|no change|unchanged|carry on|keep taking|stays? the same|still)\b/,
    direction: "unchanged",
  },
];

/**
 * Map spoken change language onto the canonical enum.
 *
 * Order matters and is not alphabetical:
 * - "stopped" is checked first, so "stopped the increase" is not an increase;
 * - an explicit change verb beats a no-change phrase, because "it went up to
 *   eighty, still once a day" is a dose increase with an unchanged *frequency*;
 * - "once a day like before" therefore still reads as `unchanged`, since no
 *   change verb appears in it at all.
 *
 * Negation is a known gap: "it didn't go up" reads as an increase. Anything
 * this parser gets wrong shows up as a mismatch and a question for the ward,
 * never as a confirmation.
 */
export function parseDirection(input: string): Direction {
  const text = normalise(input);
  for (const entry of DIRECTION_PATTERNS) {
    if (entry.pattern.test(text)) return entry.direction;
  }
  return "unknown";
}

/* ------------------------------ contact ------------------------------ */

const CONTACT_PATTERNS: Array<{ pattern: RegExp; contact: ContactRoute }> = [
  { pattern: /\b(?:999|nine nine nine|triple nine|ambulance|emergency services)\b/, contact: "999" },
  { pattern: /\b(?:111|one one one|triple one|nhs 111)\b/, contact: "111" },
  { pattern: /\b(?:heart failure nurse|specialist nurse|hf nurse)\b/, contact: "heart_failure_nurse" },
  { pattern: /\b(?:pharmacist|chemist)\b/, contact: "pharmacist" },
  { pattern: /\b(?:gp|doctor|surgery|family doctor)\b/, contact: "gp" },
  { pattern: /\b(?:ward|hospital|the unit)\b/, contact: "ward" },
];

/** Who the person says they would call. */
export function parseContact(input: string): ContactRoute {
  const text = normalise(input);
  for (const entry of CONTACT_PATTERNS) {
    if (entry.pattern.test(text)) return entry.contact;
  }
  return "unknown";
}

export function formatContact(contact: ContactRoute): string {
  const labels: Record<ContactRoute, string> = {
    "999": "999",
    "111": "NHS 111",
    gp: "the GP",
    ward: "the ward",
    pharmacist: "the pharmacist",
    heart_failure_nurse: "the heart failure nurse",
    unknown: "not stated",
  };
  return labels[contact];
}

/* ----------------------------- timeframe ----------------------------- */

/**
 * An interval in days: "in two weeks" is 14, "within 48 hours" is 2, "next
 * Tuesday" is null because the engine does not do calendars.
 */
export function parseTimeframeDays(input: string): number | null {
  const text = normalise(input);
  const pattern = new RegExp(
    `((?:${NUMBER_WORD})(?:[\\s-]+(?:${NUMBER_WORD}))*)\\s*(day|days|week|weeks|month|months|hour|hours)\\b`,
  );
  const match = text.match(pattern);
  if (match) {
    const value = parseNumber(match[1] as string);
    if (value === null) return null;
    const unit = match[2] as string;
    if (unit.startsWith("day")) return value;
    if (unit.startsWith("week")) return value * 7;
    if (unit.startsWith("month")) return value * 30;
    return Math.round(value / 24);
  }
  if (/\b(?:tomorrow)\b/.test(text)) return 1;
  if (/\b(?:a week|next week)\b/.test(text)) return 7;
  if (/\b(?:a fortnight|fortnight)\b/.test(text)) return 14;
  return null;
}

export function formatTimeframe(days: number): string {
  if (days % 7 === 0 && days >= 7) {
    const weeks = days / 7;
    return `${weeks} week${weeks === 1 ? "" : "s"}`;
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}

export function formatDirection(direction: Direction): string {
  const labels: Record<Direction, string> = {
    started: "newly started",
    stopped: "stopped",
    increased: "increased",
    decreased: "reduced",
    unchanged: "unchanged",
    unknown: "not stated",
  };
  return labels[direction];
}
