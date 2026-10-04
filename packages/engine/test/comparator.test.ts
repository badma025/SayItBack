import { describe, expect, it } from "vitest";
import { compareItem, pairItems, pairingScore } from "../src/comparator.js";
import type { MedicationChangeSlots, SlotResult, SpokenItem, VerifiedItem } from "../src/types.js";
import { verifyLetterExtraction } from "../src/evidence.js";
import { KWAME_EXTRACTION, KWAME_LETTER } from "./fixtures/kwame.js";

const letter = verifyLetterExtraction(KWAME_LETTER, KWAME_EXTRACTION);
const itemOf = (id: string): VerifiedItem =>
  letter.items.find((item) => item.id === id) as VerifiedItem;

const furosemide = itemOf("med-furosemide");
const apixaban = itemOf("med-apixaban");
const chestPain = itemOf("flag-chest-pain");
const followUp = itemOf("followup-hf-nurse");

const said = (
  kind: SpokenItem["kind"],
  utterance: string,
  slots: SpokenItem["slots"] = {},
): SpokenItem => ({ id: "said-1", kind, slots, utterance });

const verdictOf = (slots: readonly SlotResult[], name: string) =>
  slots.find((slot) => slot.slot === name)?.verdict;

const scope = ["furosemide", "apixaban"];

describe("pairing", () => {
  it("pairs a lay name with the right medicine", () => {
    expect(pairingScore(furosemide, said("medication_change", "the water tablet went up"))).toBe(1);
    expect(
      pairingScore(apixaban, said("medication_change", "the water tablet went up")),
    ).toBeLessThan(0.7);
  });

  it("never pairs across kinds", () => {
    expect(pairingScore(chestPain, said("medication_change", "chest pain"))).toBe(0);
  });

  it("flags a medicine that is not in the letter instead of grading it", () => {
    const result = pairItems(letter.items, [
      said("medication_change", "and he carries on with his metformin"),
    ]);
    expect(result.unpaired).toHaveLength(1);
    expect(result.pairs.every((pair) => pair.spoken === null)).toBe(true);
  });

  it("pairs a vague attempt when there is only one candidate of that kind", () => {
    const result = pairItems(
      [followUp],
      [said("follow_up", "somebody is ringing us about an appointment")],
    );
    expect(result.pairs[0]?.spoken).not.toBeNull();
  });
});

describe("the medicine comparator", () => {
  it("confirms a teach-back that gets drug, direction, dose and frequency right", () => {
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet has gone up to eighty milligrams, once a day"),
      { drugScope: scope },
    );
    expect(slots.filter((slot) => slot.critical).map((slot) => slot.verdict)).toEqual([
      "match",
      "match",
      "match",
      "match",
    ]);
  });

  it("the wow moment: frequency right, dose missing, direction contradicted", () => {
    // "The water tablet, once a day like before."
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet, once a day like before"),
      { drugScope: scope },
    );
    expect(verdictOf(slots, "drug")).toBe("match");
    expect(verdictOf(slots, "frequency")).toBe("match");
    expect(verdictOf(slots, "dose")).toBe("absent");
    expect(verdictOf(slots, "direction")).toBe("mismatch");
  });

  it("marks a wrong dose as a conflict, not a near miss", () => {
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet, forty milligrams once a day"),
      { drugScope: scope },
    );
    expect(verdictOf(slots, "dose")).toBe("mismatch");
  });

  it("will not confirm a dose the model asserts but the recording does not contain", () => {
    // The lenient-grader failure: the model fills dose 80mg from thin air.
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet, once a day", {
        dose: { value: 80, unit: "mg" },
      } as Partial<MedicationChangeSlots>),
      { drugScope: scope },
    );
    expect(verdictOf(slots, "dose")).toBe("uncertain");
  });

  it("will not confirm when the model and the rules disagree", () => {
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet, forty milligrams once a day", {
        dose: { value: 80, unit: "mg" },
      } as Partial<MedicationChangeSlots>),
      { drugScope: scope },
    );
    expect(verdictOf(slots, "dose")).toBe("uncertain");
  });

  it("asks rather than ticks when the recogniser mangles the drug name", () => {
    const slots = compareItem(
      furosemide,
      said("medication_change", "the fruosemide went up to eighty milligrams once a day"),
      { drugScope: scope },
    );
    expect(verdictOf(slots, "drug")).toBe("uncertain");
  });

  it("will not resolve a lay name that fits two medicines in the same letter", () => {
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet went up to eighty milligrams once a day"),
      { drugScope: ["furosemide", "spironolactone"] },
    );
    expect(verdictOf(slots, "drug")).toBe("uncertain");
  });

  it("treats a correctly stated new dose as covering the direction", () => {
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet is eighty milligrams, once a day"),
      { drugScope: scope },
    );
    expect(verdictOf(slots, "direction")).toBe("match");
  });

  it("keeps the direction open when the dose is not confirmed either", () => {
    const slots = compareItem(furosemide, said("medication_change", "the water tablet, once a day"), {
      drugScope: scope,
    });
    expect(verdictOf(slots, "direction")).toBe("absent");
  });

  it("asks which dose is current when two are mentioned out of order", () => {
    const slots = compareItem(
      furosemide,
      said("medication_change", "the water tablet, eighty down to forty, once a day"),
      { drugScope: scope },
    );
    expect(verdictOf(slots, "dose")).toBe("uncertain");
  });

  it("leaves out slots the letter does not state", () => {
    const stopped: VerifiedItem = {
      ...furosemide,
      slots: {
        ...(furosemide.slots as MedicationChangeSlots),
        dose: null,
        frequency: "unknown",
        direction: "stopped",
      },
    };
    const slots = compareItem(stopped, said("medication_change", "he stops the water tablet"), {
      drugScope: scope,
    });
    expect(slots.map((slot) => slot.slot)).toEqual(["drug", "direction"]);
  });
});

describe("the red-flag and follow-up comparators", () => {
  it("confirms a red flag said in the person's own words", () => {
    const slots = compareItem(
      chestPain,
      said("red_flag", "if he gets pain in the chest I ring 999"),
    );
    expect(verdictOf(slots, "symptom")).toBe("match");
    expect(verdictOf(slots, "contact")).toBe("match");
  });

  it("does not confirm the right symptom with the wrong number to call", () => {
    const slots = compareItem(chestPain, said("red_flag", "if he gets chest pain I call the GP"));
    expect(verdictOf(slots, "symptom")).toBe("match");
    expect(verdictOf(slots, "contact")).toBe("mismatch");
  });

  it("confirms a follow-up with the right person and interval", () => {
    const slots = compareItem(
      followUp,
      said("follow_up", "the heart failure nurse phones us in a week"),
    );
    expect(verdictOf(slots, "with_whom")).toBe("match");
    expect(verdictOf(slots, "timeframe_days")).toBe("match");
  });

  it("catches a wrong interval, the thing most people get wrong", () => {
    const slots = compareItem(
      followUp,
      said("follow_up", "the heart failure nurse rings in two weeks"),
    );
    expect(verdictOf(slots, "timeframe_days")).toBe("mismatch");
  });

  it("marks nothing said as absent, not as a mismatch", () => {
    const slots = compareItem(followUp, null);
    expect(slots.every((slot) => slot.verdict === "absent")).toBe(true);
  });
});
