import { describe, expect, it } from "vitest";
import { gradeTeachBack, type SpokenExtraction } from "@sayitback/engine";
import { applyRecallGuard, numbersOutsideSpans } from "./recall-guard";
import { buildVerifiedLetter, evaluateTeachBack, extractSpokenSlots } from "../engine-bridge";
import { DEFAULT_LETTER } from "../letters";

function medicineGrade(receipt: ReturnType<typeof gradeTeachBack>) {
  return receipt.items.find((item) => item.kind === "medication_change")!;
}

describe("numbersOutsideSpans", () => {
  it("finds a number no item's utterance covers", () => {
    const transcript = "Water tablet 80mg once a day? No, sorry, it's still 40mg.";
    const items = [
      { id: "a", kind: "medication_change" as const, utterance: "Water tablet 80mg once a day", slots: {} },
    ];
    expect(numbersOutsideSpans(transcript, items)).toEqual(["40"]);
    expect(numbersOutsideSpans(transcript, [{ ...items[0]!, utterance: transcript }])).toEqual([]);
  });
});

describe("applyRecallGuard", () => {
  // A hand-written reply that cuts the utterance around the right number and
  // leaves the correction out. Every value in it is a real span, so it passes
  // the span gate; only the guard stands between it and a tick.
  const transcript = "Water tablet 80mg once a day? No, sorry, it's still 40mg.";
  const narrowed: SpokenExtraction = {
    transcript,
    items: [
      {
        id: "llm-1",
        kind: "medication_change",
        utterance: "Water tablet 80mg once a day",
        slots: { drug: "Water tablet", dose: { value: 80, unit: "mg" }, frequency: "once_daily" },
      },
    ],
    questions: [],
  };

  it("would confirm a hidden correction without the guard", () => {
    const receipt = gradeTeachBack(buildVerifiedLetter(DEFAULT_LETTER), narrowed);
    expect(medicineGrade(receipt).grade).toBe("confirmed");
  });

  it("widens the medicine back to everything said, so the 40mg is heard", () => {
    const { receipt, guardNotes } = evaluateTeachBack(DEFAULT_LETTER, transcript, true, undefined, narrowed);
    expect(guardNotes[0]).toMatchObject({ code: "numbers_outside_spans" });
    expect(medicineGrade(receipt).grade).toBe("not_yet_confirmed");
  });

  it("adds back a kind of item the model missed, with only the rules reading it", () => {
    const said = "Can he take ibuprofen while on the water tablet?";
    const { extraction, notes } = applyRecallGuard(
      { transcript: said, items: [], questions: [] },
      extractSpokenSlots(said),
    );
    expect(notes.map((n) => n.code)).toContain("item_added_from_rules");
    const added = extraction.items.find((item) => item.kind === "medication_change")!;
    expect(added.id).toMatch(/^rules-/);
    expect(added.slots).toEqual({});
  });

  it("does not add a second item of a kind the model already read", () => {
    const rules = extractSpokenSlots(transcript);
    const { extraction } = applyRecallGuard({ ...narrowed, transcript }, rules);
    expect(extraction.items.filter((item) => item.kind === "medication_change")).toHaveLength(1);
  });

  it("keeps a question the rules caught and the model did not, once", () => {
    const said = "Can he take ibuprofen for his knee?";
    const rules = extractSpokenSlots(said);
    const missed = applyRecallGuard({ transcript: said, items: [], questions: [] }, rules);
    expect(missed.extraction.questions).toHaveLength(1);

    const caught = applyRecallGuard(
      {
        transcript: said,
        items: [],
        questions: [{ id: "llm-q-1", question: said, utterance: said }],
      },
      rules,
    );
    expect(caught.extraction.questions).toHaveLength(1);
    expect(caught.extraction.questions[0]!.id).toBe("llm-q-1");
  });
});
