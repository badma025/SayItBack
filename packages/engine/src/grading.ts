/**
 * Asymmetric grading and the understanding receipt.
 *
 * The asymmetry is the whole safety argument, so it is stated once, here, and
 * implemented in one function:
 *
 *   An item is `confirmed` only if every critical slot is `match`.
 *   Everything else - missing, unclear, ambiguous, half-said, conflicting - is
 *   `not_yet_confirmed`.
 *
 * There is no middle grade and no score. A wrong dose shown as a tick is worse
 * than no app at all, so the only way to earn the tick is to say the letter's
 * values. The wording never claims the person understood, only that what they
 * said matches the letter, and a nurse signs the receipt off.
 */

import type {
  GradedItem,
  MedicationChangeSlots,
  NotConfirmedReason,
  Receipt,
  SlotResult,
  SpokenExtraction,
  VerifiedItem,
  VerifiedLetter,
} from "./types.js";
import { type ComparatorOptions, compareItem, lettersDrugScope, pairItems } from "./comparator.js";

export interface GradeOptions extends ComparatorOptions {
  /**
   * Treat a transcript the user has not reviewed more carefully. Off by
   * default; the UI is expected to offer the edit step.
   */
  requireReviewedTranscript?: boolean;
}

/** Grade one item from its slot results. The asymmetric rule lives here. */
export function gradeSlots(
  slots: readonly SlotResult[],
  wasMentioned: boolean,
): { grade: GradedItem["grade"]; reason: NotConfirmedReason | null } {
  const critical = slots.filter((slot) => slot.critical);

  // Nothing said about an item cannot confirm it, whatever the slots look like.
  if (!wasMentioned || critical.every((slot) => slot.verdict === "absent")) {
    return { grade: "not_yet_confirmed", reason: "not_mentioned" };
  }
  if (critical.length > 0 && critical.every((slot) => slot.verdict === "match")) {
    return { grade: "confirmed", reason: null };
  }
  if (critical.some((slot) => slot.verdict === "mismatch")) {
    return { grade: "not_yet_confirmed", reason: "conflicts_with_letter" };
  }
  if (critical.some((slot) => slot.verdict === "uncertain")) {
    return { grade: "not_yet_confirmed", reason: "unclear" };
  }
  return { grade: "not_yet_confirmed", reason: "partly_covered" };
}

/**
 * The receipt's wording for a gap, as a question for the ward.
 *
 * Templated from the letter's own slot values, with no generated prose: the
 * engine must not drift into telling anyone what to do. "Not yet confirmed" is
 * phrased as something to ask, never as a mark out of ten.
 */
export function askTheWardFor(item: VerifiedItem, slots: readonly SlotResult[]): string | null {
  const unresolved = slots.filter((slot) => slot.critical && slot.verdict !== "match");
  if (unresolved.length === 0) return null;

  const subject = subjectOf(item);
  const parts = unresolved.map((slot) => {
    const label = SLOT_LABELS[slot.slot] ?? slot.slot;
    if (slot.verdict === "mismatch" && slot.heard !== null) {
      return `${label} (we heard ${slot.heard}, the letter says ${slot.expected})`;
    }
    return label;
  });

  return `Ask the ward to go over ${subject}: ${parts.join(", ")}.`;
}

const SLOT_LABELS: Record<string, string> = {
  drug: "which medicine it is",
  dose: "how much to take",
  direction: "whether it has changed",
  frequency: "how often to take it",
  condition: "what the diagnosis means",
  symptom: "what to watch out for",
  contact: "who to call",
  with_whom: "who the appointment is with",
  timeframe_days: "when it is",
};

function subjectOf(item: VerifiedItem): string {
  switch (item.kind) {
    case "medication_change":
      return (item.slots as MedicationChangeSlots).drug;
    case "diagnosis":
      return "the diagnosis";
    case "red_flag":
      return "the warning signs";
    case "follow_up":
      return "the follow-up appointment";
  }
}

/** Conflicts first, then gaps: the red lines are the ones worth the time. */
const REASON_SEVERITY: Record<NotConfirmedReason, number> = {
  conflicts_with_letter: 0,
  unclear: 1,
  partly_covered: 2,
  not_mentioned: 3,
};

/**
 * Grade a whole teach-back.
 *
 * Takes the verified letter and the slots filled from the transcript, and
 * returns the receipt: what matched, what to re-teach, what to ask the ward and
 * what to take to the pharmacist. Nothing here calls a model.
 */
export function gradeTeachBack(
  letter: VerifiedLetter,
  spoken: SpokenExtraction,
  options: GradeOptions = {},
): Receipt {
  const comparatorOptions: ComparatorOptions = {
    ...options,
    drugScope: options.drugScope ?? lettersDrugScope(letter.items),
  };

  const { pairs, unpaired } = pairItems(letter.items, spoken.items, comparatorOptions);

  const items: GradedItem[] = pairs.map(({ item, spoken: said }) => {
    const slots = compareItem(item, said, comparatorOptions);
    const graded = gradeSlots(slots, said !== null);

    // An unreviewed transcript can hold an ASR error nobody has looked at, so
    // callers may insist on the edit step before any tick is allowed.
    const awaitingReview =
      options.requireReviewedTranscript === true && spoken.transcriptEdited !== true;
    const grade =
      graded.grade === "confirmed" && awaitingReview ? "not_yet_confirmed" : graded.grade;
    const reason: NotConfirmedReason | null =
      grade === "confirmed" ? null : (graded.reason ?? "unclear");

    return {
      itemId: item.id,
      kind: item.kind,
      grade,
      reason,
      slots,
      quote: item.evidence.quote,
      heading: item.evidence.heading,
      matchedUtterance: said?.utterance ?? null,
      askTheWard: grade === "confirmed" ? null : askTheWardFor(item, slots),
    };
  });

  const reteach = items
    .filter((item) => item.grade === "not_yet_confirmed")
    .sort(
      (a, b) =>
        REASON_SEVERITY[a.reason ?? "not_mentioned"] - REASON_SEVERITY[b.reason ?? "not_mentioned"],
    );

  const conflicts = items.reduce(
    (total, item) =>
      total + item.slots.filter((slot) => slot.critical && slot.verdict === "mismatch").length,
    0,
  );

  return {
    items,
    reteach,
    checkWithWard: letter.checkWithWard,
    questionsForPharmacist: spoken.questions,
    notInLetter: unpaired,
    summary: {
      total: items.length,
      confirmed: items.filter((item) => item.grade === "confirmed").length,
      notYetConfirmed: items.filter((item) => item.grade === "not_yet_confirmed").length,
      conflicts,
    },
    signOff: { required: true, signedBy: null },
  };
}

/**
 * What to re-explain, and the only words allowed to do it with.
 *
 * Re-teaching may quote the letter and name the gap. It may not add advice,
 * reassurance or anything the letter does not say, which is why this returns
 * data rather than prose.
 */
export interface ReteachStep {
  itemId: string;
  /** The letter's own words. The only content allowed on screen or in TTS. */
  quote: string;
  /** Which slots still need covering, in the receipt's wording. */
  gaps: string[];
  askTheWard: string | null;
}

export function reteachPlan(receipt: Receipt): ReteachStep[] {
  return receipt.reteach.map((item) => ({
    itemId: item.itemId,
    quote: item.quote,
    gaps: item.slots
      .filter((slot) => slot.critical && slot.verdict !== "match")
      .map((slot) => SLOT_LABELS[slot.slot] ?? slot.slot),
    askTheWard: item.askTheWard,
  }));
}

/** Items the person has not yet confirmed, as plain ids. Drives the loop. */
export function outstandingItemIds(receipt: Receipt): string[] {
  return receipt.reteach.map((item) => item.itemId);
}

/**
 * The headline evaluation metric: confirmations that should not have happened.
 *
 * Given labelled ground truth - the item ids a human says the person really
 * did get right - count the items the engine confirmed that the human did not.
 * Reported in the README as a raw count, not a rate.
 */
export function falseConfirmCount(
  receipt: Receipt,
  trulyUnderstoodItemIds: readonly string[],
): number {
  const truth = new Set(trulyUnderstoodItemIds);
  return receipt.items.filter((item) => item.grade === "confirmed" && !truth.has(item.itemId))
    .length;
}
