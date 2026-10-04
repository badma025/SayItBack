import type { GradedItem, Receipt, SlotResult } from "@sayitback/engine";

export type Tone = "ok" | "bad" | "warn" | "idle";

export interface ItemStatus {
  tone: Tone;
  /** Plain-English label for a carer, not an engineer. */
  label: string;
}

export function itemStatus(item: GradedItem | undefined): ItemStatus {
  if (!item) return { tone: "idle", label: "Not checked yet" };
  if (item.grade === "confirmed") return { tone: "ok", label: "Said back correctly" };
  switch (item.reason) {
    case "conflicts_with_letter":
      return { tone: "bad", label: "Doesn't match the letter" };
    case "partly_covered":
      return { tone: "warn", label: "Partly covered" };
    case "unclear":
      return { tone: "warn", label: "Couldn't make this out" };
    default:
      return { tone: "warn", label: "Not mentioned yet" };
  }
}

export const KIND_TITLE: Record<GradedItem["kind"], string> = {
  diagnosis: "What happened in hospital",
  medication_change: "Medicine change",
  red_flag: "Warning signs and who to call",
  follow_up: "Follow-up appointment",
};

/** The section of the letter each graded item belongs to, used for anchors. */
export function sectionIdFor(item: GradedItem): string {
  if (item.kind === "medication_change") return `letter-${item.itemId}`;
  if (item.kind === "diagnosis") return "letter-diagnosis";
  if (item.kind === "red_flag") return "letter-red-flags";
  return "letter-follow-up";
}

export function findItem(receipt: Receipt | null, predicate: (i: GradedItem) => boolean) {
  return receipt?.items.find(predicate);
}

const SLOT_NAMES: Record<string, string> = {
  drug: "medicine",
  dose: "dose",
  direction: "change",
  frequency: "how often",
  condition: "condition",
  symptom: "warning sign",
  contact: "who to call",
  timeframe_days: "when",
  with_whom: "with whom",
};

export function slotName(slot: string): string {
  return SLOT_NAMES[slot] ?? slot.replace(/_/g, " ");
}

/** Slots worth showing to a person: anything critical that did not match. */
export function problemSlots(item: GradedItem): SlotResult[] {
  return item.slots.filter((s) => s.critical && s.verdict !== "match");
}

export const TONE_TEXT: Record<Tone, string> = {
  ok: "text-ok",
  bad: "text-bad",
  warn: "text-warn",
  idle: "text-faint",
};

export const TONE_DOT: Record<Tone, string> = {
  ok: "bg-ok",
  bad: "bg-bad",
  warn: "bg-warn",
  idle: "bg-line",
};

export const TONE_MARK: Record<Tone, string> = {
  ok: "mark-ok",
  bad: "mark-bad",
  warn: "mark-warn",
  idle: "",
};
