/**
 * The span gate, on hand-written model replies. Each one is the smallest reply
 * that shows one rule; the recorded replies are in `recorded.test.ts`.
 */

import { describe, expect, it } from "vitest";
import { groundExtraction, indexOfPhrase, parseModelJson } from "./ground";
import { ExtractionFailure } from "./types";

const WOW = "I take the water tablet, once a day like before.";

function reply(items: unknown[], questions: unknown[] = []): string {
  return JSON.stringify({ items, questions });
}

function med(slots: Record<string, unknown>, utterance = WOW) {
  return { kind: "medication_change", utterance, slots };
}

describe("span matching", () => {
  it("matches whole tokens only", () => {
    expect(indexOfPhrase("it went up to eighty", "eighty")).toBe(14);
    expect(indexOfPhrase("it went up to eighty", "eight")).toBe(-1);
    expect(indexOfPhrase("take 80mg daily", "80")).toBe(5);
    expect(indexOfPhrase("take 180mg daily", "80")).toBe(-1);
  });
});

describe("groundExtraction", () => {
  it("keeps values whose spans are in the transcript, in the transcript's own wording", () => {
    const { extraction, rejected } = groundExtraction(
      reply([
        med(
          {
            drug: { value: "water tablet", evidence: "the WATER tablet" },
            frequency: { value: "once_daily", evidence: "once a day" },
            direction: { value: "unchanged", evidence: "like before" },
          },
          "i take the water tablet once a day like before",
        ),
      ]),
      WOW,
    );
    expect(rejected).toEqual([]);
    expect(extraction.items).toHaveLength(1);
    expect(extraction.items[0]!.utterance).toBe(WOW.slice(0, -1));
    expect(extraction.items[0]!.slots).toEqual({
      drug: "water tablet",
      frequency: "once_daily",
      direction: "unchanged",
    });
  });

  it("rejects a dose whose span was never said", () => {
    const { extraction, rejected } = groundExtraction(
      reply([med({ dose: { value: 80, unit: "mg", evidence: "eighty milligrams" } })]),
      WOW,
    );
    expect(extraction.items[0]!.slots).toEqual({});
    expect(rejected).toEqual([
      { path: "items[0].slots.dose", reason: "span_not_in_transcript", evidence: "eighty milligrams" },
    ]);
  });

  it("rejects a value its own span does not contain", () => {
    // Mistral-Small really did this: "once a day" cited as a dose of 1 tablet.
    const { rejected } = groundExtraction(
      reply([med({ dose: { value: 1, unit: "tablet", evidence: "once a day" } })]),
      WOW,
    );
    expect(rejected[0]).toMatchObject({ reason: "value_not_in_span" });
  });

  it("will not let the model resolve a lay name; the engine's dictionary does that", () => {
    const { extraction, rejected } = groundExtraction(
      reply([med({ drug: { value: "furosemide", evidence: "water tablet" } })]),
      WOW,
    );
    expect(extraction.items[0]!.slots).toEqual({});
    expect(rejected[0]).toMatchObject({ path: "items[0].slots.drug", reason: "value_not_in_span" });
  });

  it("rejects a value with no span", () => {
    const { rejected } = groundExtraction(reply([med({ frequency: { value: "once_daily" } })]), WOW);
    expect(rejected[0]).toMatchObject({ reason: "missing_span", evidence: null });
  });

  it("drops the whole item when its utterance is not in the transcript", () => {
    const { extraction, rejected } = groundExtraction(
      reply([
        med(
          { drug: { value: "water tablet", evidence: "water tablet" } },
          "I take the water tablet, eighty milligrams once a day",
        ),
      ]),
      WOW,
    );
    expect(extraction.items).toEqual([]);
    expect(rejected[0]).toMatchObject({ path: "items[0].utterance", reason: "span_not_in_transcript" });
  });

  it("checks numbers in timeframes against their span", () => {
    const transcript = "We see the heart failure nurse in two weeks.";
    const followUp = (days: number) => ({
      kind: "follow_up",
      utterance: transcript,
      slots: { timeframe_days: { value: days, evidence: "in two weeks" } },
    });
    expect(groundExtraction(reply([followUp(14)]), transcript).rejected).toEqual([]);
    expect(groundExtraction(reply([followUp(7)]), transcript).rejected[0]).toMatchObject({
      reason: "value_not_in_span",
    });
  });

  it("treats unknown and null as absent, not as claims", () => {
    const { extraction, rejected } = groundExtraction(
      reply([med({ direction: { value: "unknown" }, dose: null, frequency: { value: null } })]),
      WOW,
    );
    expect(rejected).toEqual([]);
    expect(extraction.items[0]!.slots).toEqual({});
  });

  it("has nowhere to put a verdict", () => {
    const { extraction, rejected } = groundExtraction(
      JSON.stringify({
        verdict: "confirmed",
        items: [
          { kind: "confirmed", utterance: WOW, slots: {} },
          med({ direction: { value: "confirmed", evidence: "like before" } }),
        ],
      }),
      WOW,
    );
    expect(rejected.map((r) => [r.path, r.reason])).toEqual([
      ["items[0]", "malformed"],
      ["items[1].slots.direction", "malformed"],
    ]);
    expect(JSON.stringify(extraction)).not.toContain("confirmed");
  });

  it("keeps questions in the person's words, never the model's", () => {
    const transcript = "Can he take ibuprofen for his knee pain?";
    const { extraction } = groundExtraction(
      reply(
        [],
        [{ evidence: "can he take ibuprofen", question: "Yes, ibuprofen is fine for his knee." }],
      ),
      transcript,
    );
    expect(extraction.questions).toEqual([
      { id: "llm-q-1", question: "Can he take ibuprofen", utterance: "Can he take ibuprofen" },
    ]);
  });

  it("reads JSON inside a code fence, and refuses a reply with none", () => {
    expect(parseModelJson('```json\n{"items":[]}\n```')).toEqual({ items: [] });
    expect(() => parseModelJson("Sorry, I can't help with that.")).toThrow(ExtractionFailure);
  });
});
