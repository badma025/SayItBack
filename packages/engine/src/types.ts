/**
 * Say It Back - shared vocabulary.
 *
 * The whole engine rests on one rule: the LLM fills slots, deterministic code
 * decides. Nothing in this file lets a model emit a verdict. Models emit
 * enums, numbers and quotes; the comparator turns those into grades.
 */

/** Standard UK eDischarge (PRSB) headings we expect to find in a letter. */
export type PrsbHeading =
  | "diagnoses"
  | "medications_and_medical_devices"
  | "allergies_and_adverse_reactions"
  | "plan_and_requested_actions"
  | "admission_details"
  | "person_completing_record"
  | "unknown";

export type ItemKind = "diagnosis" | "medication_change" | "red_flag" | "follow_up";

/* ------------------------------------------------------------------ *
 * Slot value types. Every one is an enum, a number or a short string
 * copied from the source. None of them is free prose.
 * ------------------------------------------------------------------ */

/** Direction of a medicine change. `unknown` is always allowed and never confirms. */
export type Direction =
  | "started"
  | "stopped"
  | "increased"
  | "decreased"
  | "unchanged"
  | "unknown";

export type DoseUnit = "mcg" | "mg" | "g" | "ml" | "unit" | "tablet" | "puff" | "patch";

export interface Dose {
  value: number;
  unit: DoseUnit;
}

/**
 * Canonical dosing frequency. Spoken English is mapped onto this by
 * `parseFrequency`; the LLM is asked to emit it directly.
 */
export type Frequency =
  | "once_daily"
  | "twice_daily"
  | "three_times_daily"
  | "four_times_daily"
  | "every_other_day"
  | "weekly"
  | "as_needed"
  | "unknown";

/** Who to contact for a red flag. Deliberately a closed list. */
export type ContactRoute =
  | "999"
  | "111"
  | "gp"
  | "ward"
  | "pharmacist"
  | "heart_failure_nurse"
  | "unknown";

export type FollowUpModality = "in_person" | "telephone" | "video" | "unknown";

/* ------------------------------------------------------------------ *
 * Slot sets, one per item kind.
 * ------------------------------------------------------------------ */

export interface DiagnosisSlots {
  /** Clinical term as written in the letter, e.g. "heart failure". */
  condition: string;
  /** Plain words, e.g. "the heart is not pumping strongly enough". */
  lay_term: string | null;
}

export interface MedicationChangeSlots {
  /** Generic drug name as written, e.g. "furosemide". */
  drug: string;
  /** What the household calls it, e.g. "water tablet". */
  lay_name: string | null;
  direction: Direction;
  /** The dose to take now, after the change. */
  dose: Dose | null;
  /** The dose before the change, when the letter states it. */
  previous_dose: Dose | null;
  frequency: Frequency;
}

export interface RedFlagSlots {
  /** The symptom to watch for, e.g. "breathless at night". */
  symptom: string;
  contact: ContactRoute;
}

export interface FollowUpSlots {
  /** Who the appointment is with, e.g. "heart failure nurse". */
  with_whom: string;
  /** Days from discharge, when the letter gives an interval or a date. */
  timeframe_days: number | null;
  modality: FollowUpModality;
}

export type SlotsFor<K extends ItemKind> = K extends "diagnosis"
  ? DiagnosisSlots
  : K extends "medication_change"
    ? MedicationChangeSlots
    : K extends "red_flag"
      ? RedFlagSlots
      : FollowUpSlots;

export type AnySlots = DiagnosisSlots | MedicationChangeSlots | RedFlagSlots | FollowUpSlots;

/* ------------------------------------------------------------------ *
 * Items as the LLM emits them, before any verification.
 * ------------------------------------------------------------------ */

/** A verbatim span the model claims to have copied out of the letter. */
export interface RawEvidence {
  quote: string;
  heading: PrsbHeading;
}

export interface RawItem<K extends ItemKind = ItemKind> {
  id: string;
  kind: K;
  evidence: RawEvidence;
  slots: SlotsFor<K>;
}

/** What the extraction prompt returns for a letter. */
export interface RawLetterExtraction {
  items: RawItem[];
}

/* ------------------------------------------------------------------ *
 * Items after the quote has been checked against the letter text.
 * ------------------------------------------------------------------ */

export type EvidenceMatchKind = "exact" | "fuzzy";

export interface EvidenceMatch {
  kind: EvidenceMatchKind;
  /** Character offsets into the source text the quote was checked against. */
  start: number;
  end: number;
  /** The letter's own wording for the span, which is what the UI highlights. */
  matchedText: string;
  /** 0-1 similarity. 1 for an exact match. */
  similarity: number;
}

export type EvidenceFailureReason =
  | "no_match"
  /** Fuzzy match found, but the quote's numbers are not the letter's numbers. */
  | "digits_differ"
  /** The quote is too short to be evidence of anything. */
  | "quote_too_short"
  /** A slot value the model filled is nowhere in the quote it cited. */
  | "slot_not_in_quote"
  /** A slot value contradicts the quote, e.g. "increased" against "reduce to". */
  | "slot_conflicts_with_quote";

export interface VerifiedEvidence extends RawEvidence {
  status: "verified";
  match: EvidenceMatch;
}

export interface UnverifiedEvidence extends RawEvidence {
  status: "unverified";
  reason: EvidenceFailureReason;
  /** Best candidate span, kept so a human can see what the model was looking at. */
  nearest: EvidenceMatch | null;
}

/**
 * Something the UI should say out loud about an item that still passed. Unlike
 * a failure, a warning does not remove the item from grading.
 */
export interface ExtractionWarning {
  code:
    /** The quote was matched approximately rather than character for character. */
    | "fuzzy_quote"
    /** The direction of change is asserted but not visible in the quote. */
    | "direction_not_in_quote"
    /** The source text came from OCR, so the quote check is partly circular. */
    | "ocr_source";
  detail: string;
}

/** An item that earned its place: its quote really is in the letter. */
export interface VerifiedItem<K extends ItemKind = ItemKind> {
  id: string;
  kind: K;
  evidence: VerifiedEvidence;
  slots: SlotsFor<K>;
  warnings: ExtractionWarning[];
}

/** An item whose quote failed. Never graded; shown as "check with the ward". */
export interface UnverifiedItem<K extends ItemKind = ItemKind> {
  id: string;
  kind: K;
  evidence: UnverifiedEvidence;
  slots: SlotsFor<K>;
}

export interface VerifiedLetter {
  /** Ground-truth text, ideally from a PDF text layer rather than OCR. */
  sourceText: string;
  /** How the text was obtained. Photos make the quote check circular. */
  sourceKind: "pdf_text_layer" | "typed" | "ocr";
  items: VerifiedItem[];
  /** Items whose quotes did not check out. These go to the ward, not the grade. */
  checkWithWard: UnverifiedItem[];
}

/* ------------------------------------------------------------------ *
 * What the person said.
 * ------------------------------------------------------------------ */

/**
 * The same slot schema, filled from the teach-back transcript. There is no
 * evidence check here: the transcript is the evidence, and the user can edit
 * it before grading.
 */
export interface SpokenItem<K extends ItemKind = ItemKind> {
  id: string;
  kind: K;
  slots: Partial<SlotsFor<K>>;
  /** The stretch of transcript the slots came from, for the UI to underline. */
  utterance: string;
}

/** A question the person asked. The model answers none of them. */
export interface PharmacistQuestion {
  id: string;
  question: string;
  /** Verbatim, so nothing is paraphrased into advice. */
  utterance: string;
}

export interface SpokenExtraction {
  transcript: string;
  items: SpokenItem[];
  questions: PharmacistQuestion[];
  /** True when the user corrected the ASR output before grading. */
  transcriptEdited?: boolean;
}

/* ------------------------------------------------------------------ *
 * Verdicts.
 * ------------------------------------------------------------------ */

/**
 * The verdict for a single slot.
 * - `match`     the person's value equals the letter's value;
 * - `mismatch`  they said something, and it conflicts;
 * - `absent`    they did not mention it;
 * - `uncertain` we cannot tell - mangled name, ambiguous lay term, missing unit.
 *
 * Only `match` can contribute to a confirmation.
 */
export type SlotVerdict = "match" | "mismatch" | "absent" | "uncertain";

export interface SlotResult {
  slot: string;
  verdict: SlotVerdict;
  /** What the letter says, rendered for the UI. */
  expected: string | null;
  /** What the person said, rendered for the UI. */
  heard: string | null;
  /** Whether this slot can block a confirmation. */
  critical: boolean;
  /** Short reason, used in the "questions to ask" wording. */
  note?: string;
}

/**
 * The item-level grade. Two states only, and the positive one is narrow by
 * construction: `confirmed` means "what they said matches the letter", never
 * "they understood".
 */
export type Grade = "confirmed" | "not_yet_confirmed";

export type NotConfirmedReason =
  /** Nothing in the teach-back was about this item. */
  | "not_mentioned"
  /** Mentioned, and a critical value conflicts with the letter. */
  | "conflicts_with_letter"
  /** Mentioned, some critical values still missing. */
  | "partly_covered"
  /** Mentioned, but we could not read it reliably enough to confirm. */
  | "unclear";

export interface GradedItem {
  itemId: string;
  kind: ItemKind;
  grade: Grade;
  reason: NotConfirmedReason | null;
  slots: SlotResult[];
  /** The letter's own words. Re-teaching may use these and nothing else. */
  quote: string;
  heading: PrsbHeading;
  /** Which utterance was paired with this item, if any. */
  matchedUtterance: string | null;
  /** Wording for the receipt: a question for the ward, never a judgement. */
  askTheWard: string | null;
}

export interface Receipt {
  items: GradedItem[];
  /** Items to re-explain, using only their quotes. Ordered by severity. */
  reteach: GradedItem[];
  /** Items whose letter quote failed verification. Not graded. */
  checkWithWard: UnverifiedItem[];
  /** Advice questions, routed away from the model. */
  questionsForPharmacist: PharmacistQuestion[];
  /** Things said that are not in the letter. Flagged, never graded. */
  notInLetter: SpokenItem[];
  summary: {
    total: number;
    confirmed: number;
    notYetConfirmed: number;
    /** Count of critical slots that conflict with the letter. The red ones. */
    conflicts: number;
  };
  /** A nurse signs the receipt off. The engine never does. */
  signOff: { required: true; signedBy: null };
}
