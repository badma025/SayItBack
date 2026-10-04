import { describe, expect, it } from "vitest";
import {
  falseConfirmCount,
  gradeSlots,
  gradeTeachBack,
  outstandingItemIds,
  reteachPlan,
} from "../src/grading.js";
import { verifyLetterExtraction } from "../src/evidence.js";
import type { GradedItem, Receipt, SlotResult } from "../src/types.js";
import { KWAME_EXTRACTION, KWAME_LETTER, teachBack } from "./fixtures/kwame.js";

const letter = verifyLetterExtraction(KWAME_LETTER, KWAME_EXTRACTION);
const itemIn = (receipt: Receipt, id: string): GradedItem =>
  receipt.items.find((item) => item.itemId === id) as GradedItem;

const slot = (
  name: string,
  verdict: SlotResult["verdict"],
  critical = true,
): SlotResult => ({ slot: name, verdict, expected: "x", heard: null, critical });

/** Everything Efua would have to say to cover the whole letter. */
const fullTeachBack = () =>
  teachBack([
    {
      kind: "diagnosis",
      utterance: "they said his heart is not pumping properly, heart failure",
    },
    {
      kind: "medication_change",
      utterance: "the water tablet has gone up to eighty milligrams, once a day",
    },
    {
      kind: "medication_change",
      utterance: "the apixaban is new, five milligrams twice a day",
    },
    { kind: "red_flag", utterance: "if he gets chest pain or cannot breathe I call 999" },
    { kind: "follow_up", utterance: "the heart failure nurse telephones us in seven days" },
  ]);

describe("the asymmetric rule", () => {
  it("confirms only when every critical slot matches", () => {
    expect(gradeSlots([slot("a", "match"), slot("b", "match")], true).grade).toBe("confirmed");
  });

  it("refuses to confirm on a single unmatched critical slot", () => {
    for (const verdict of ["mismatch", "absent", "uncertain"] as const) {
      expect(gradeSlots([slot("a", "match"), slot("b", verdict)], true).grade).toBe(
        "not_yet_confirmed",
      );
    }
  });

  it("ignores non-critical slots when deciding", () => {
    expect(gradeSlots([slot("a", "match"), slot("b", "absent", false)], true).grade).toBe(
      "confirmed",
    );
  });

  it("names a conflict ahead of a gap, because they are re-taught differently", () => {
    expect(gradeSlots([slot("a", "mismatch"), slot("b", "absent")], true).reason).toBe(
      "conflicts_with_letter",
    );
    expect(gradeSlots([slot("a", "match"), slot("b", "uncertain")], true).reason).toBe("unclear");
    expect(gradeSlots([slot("a", "match"), slot("b", "absent")], true).reason).toBe(
      "partly_covered",
    );
    expect(gradeSlots([slot("a", "absent"), slot("b", "absent")], true).reason).toBe(
      "not_mentioned",
    );
  });

  it("never confirms an item nobody spoke about", () => {
    expect(gradeSlots([slot("a", "match")], false).grade).toBe("not_yet_confirmed");
  });
});

describe("the receipt", () => {
  it("confirms the whole letter when the whole letter is said back", () => {
    const receipt = gradeTeachBack(letter, fullTeachBack());
    expect(receipt.summary).toEqual({ total: 5, confirmed: 5, notYetConfirmed: 0, conflicts: 0 });
    expect(receipt.reteach).toHaveLength(0);
  });

  it("never signs itself off", () => {
    const receipt = gradeTeachBack(letter, fullTeachBack());
    expect(receipt.signOff).toEqual({ required: true, signedBy: null });
  });

  it("marks everything not yet confirmed when nothing is said", () => {
    const receipt = gradeTeachBack(letter, teachBack([]));
    expect(receipt.summary.confirmed).toBe(0);
    expect(receipt.summary.notYetConfirmed).toBe(5);
    expect(receipt.items.every((item) => item.reason === "not_mentioned")).toBe(true);
  });

  it("the demo: the dose is red, and only that item is re-taught", () => {
    const receipt = gradeTeachBack(
      letter,
      teachBack([
        {
          kind: "diagnosis",
          utterance: "they said his heart is not pumping properly, heart failure",
        },
        { kind: "medication_change", utterance: "the water tablet, once a day like before" },
        { kind: "medication_change", utterance: "the apixaban is new, five milligrams twice a day" },
        { kind: "red_flag", utterance: "if he gets chest pain or cannot breathe I call 999" },
        { kind: "follow_up", utterance: "the heart failure nurse telephones us in seven days" },
      ]),
    );

    const furosemide = itemIn(receipt, "med-furosemide");
    expect(furosemide.grade).toBe("not_yet_confirmed");
    expect(furosemide.reason).toBe("conflicts_with_letter");

    const bySlot = Object.fromEntries(furosemide.slots.map((s) => [s.slot, s.verdict]));
    expect(bySlot).toMatchObject({ drug: "match", frequency: "match", direction: "mismatch" });
    expect(bySlot.dose).toBe("absent");

    expect(outstandingItemIds(receipt)).toEqual(["med-furosemide"]);
    expect(receipt.summary.confirmed).toBe(4);
    expect(receipt.summary.conflicts).toBe(1);
  });

  it("the second pass goes green once the dose is said", () => {
    const receipt = gradeTeachBack(
      letter,
      teachBack([
        {
          kind: "medication_change",
          utterance: "the water tablet went up to eighty milligrams, still once a day",
        },
      ]),
    );
    expect(itemIn(receipt, "med-furosemide").grade).toBe("confirmed");
  });

  it("words a gap as a question for the ward, not a judgement", () => {
    const receipt = gradeTeachBack(
      letter,
      teachBack([
        { kind: "medication_change", utterance: "the water tablet, forty milligrams once a day" },
      ]),
    );
    const furosemide = itemIn(receipt, "med-furosemide");
    expect(furosemide.askTheWard).toBe(
      "Ask the ward to go over furosemide: how much to take (we heard 40mg, the letter says 80mg), whether it has changed.",
    );
    expect(furosemide.askTheWard).not.toMatch(/understood|understand|score|wrong/i);
  });

  it("gives a confirmed item nothing to ask about", () => {
    const receipt = gradeTeachBack(letter, fullTeachBack());
    expect(receipt.items.every((item) => item.askTheWard === null)).toBe(true);
  });

  it("re-teaches conflicts before gaps", () => {
    const receipt = gradeTeachBack(
      letter,
      teachBack([
        { kind: "medication_change", utterance: "the water tablet, forty milligrams once a day" },
      ]),
    );
    expect(receipt.reteach[0]?.itemId).toBe("med-furosemide");
    expect(receipt.reteach[0]?.reason).toBe("conflicts_with_letter");
  });

  it("routes advice questions to a pharmacist and answers none of them", () => {
    const receipt = gradeTeachBack(
      letter,
      teachBack(
        [{ kind: "medication_change", utterance: "the water tablet, eighty milligrams once a day" }],
        [
          {
            id: "q-1",
            question: "Can he take ibuprofen for his knee?",
            utterance: "can he take ibuprofen for his knee",
          },
        ],
      ),
    );
    // The question is carried verbatim and nowhere else: no answer, no advice,
    // and nothing added to the graded items or the re-teach script.
    expect(receipt.questionsForPharmacist).toEqual([
      {
        id: "q-1",
        question: "Can he take ibuprofen for his knee?",
        utterance: "can he take ibuprofen for his knee",
      },
    ]);
    const graded = JSON.stringify({ items: receipt.items, reteach: reteachPlan(receipt) });
    expect(graded.toLowerCase()).not.toContain("ibuprofen");
  });

  it("flags a medicine that is not in the letter without grading it", () => {
    const receipt = gradeTeachBack(
      letter,
      teachBack([{ kind: "medication_change", utterance: "he also takes his metformin as usual" }]),
    );
    expect(receipt.notInLetter).toHaveLength(1);
    expect(receipt.summary.confirmed).toBe(0);
  });

  it("carries unverified letter items through as ward questions", () => {
    const withHallucination = verifyLetterExtraction(KWAME_LETTER, {
      items: [
        ...KWAME_EXTRACTION.items,
        {
          id: "invented",
          kind: "red_flag",
          evidence: {
            quote: "Stop the water tablet if you feel dizzy at any point.",
            heading: "plan_and_requested_actions",
          },
          slots: { symptom: "dizziness", contact: "gp" },
        },
      ],
    });
    const receipt = gradeTeachBack(withHallucination, fullTeachBack());
    expect(receipt.checkWithWard.map((item) => item.id)).toEqual(["invented"]);
    expect(receipt.items.map((item) => item.itemId)).not.toContain("invented");
  });

  it("can be told to withhold every tick until the transcript is reviewed", () => {
    const spoken = fullTeachBack();
    const strict = gradeTeachBack(letter, spoken, { requireReviewedTranscript: true });
    expect(strict.summary.confirmed).toBe(0);
    expect(strict.items.every((item) => item.reason === "unclear")).toBe(true);

    const reviewed = gradeTeachBack(
      letter,
      { ...spoken, transcriptEdited: true },
      { requireReviewedTranscript: true },
    );
    expect(reviewed.summary.confirmed).toBe(5);
  });
});

describe("the re-teach plan", () => {
  it("carries the letter's quote and nothing else", () => {
    const receipt = gradeTeachBack(
      letter,
      teachBack([{ kind: "medication_change", utterance: "the water tablet, once a day" }]),
    );
    const plan = reteachPlan(receipt);
    const furosemide = plan.find((step) => step.itemId === "med-furosemide");

    expect(furosemide?.quote).toBe(
      "Furosemide - dose increased to 80mg once daily. Previously 40mg once daily.",
    );
    expect(KWAME_LETTER).toContain(furosemide?.quote as string);
    expect(furosemide?.gaps).toEqual(["how much to take", "whether it has changed"]);
  });
});

describe("falseConfirmCount", () => {
  it("counts ticks a human labeller did not agree with", () => {
    const receipt = gradeTeachBack(letter, fullTeachBack());
    expect(falseConfirmCount(receipt, receipt.items.map((item) => item.itemId))).toBe(0);
    expect(falseConfirmCount(receipt, ["med-furosemide"])).toBe(4);
  });
});
