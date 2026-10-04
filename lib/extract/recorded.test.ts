/**
 * Real Featherless replies, recorded with `npm run record:extraction`, replayed
 * through the API handler and then graded by the engine against Kwame's
 * letter. No network: `fetch` is the recording.
 */

import { describe, expect, it } from "vitest";
import { falseConfirmCount, type GradedItem } from "@sayitback/engine";
import { handleExtract } from "./handler";
import { DEFAULT_EXTRACTION_MODEL } from "./prompt";
import { promptHash } from "./fixtures/prompt-hash";
import { contentOf, loadReply, replayFetch, replyFiles } from "./fixtures/recordings";
import { FIXTURE_TRANSCRIPTS } from "./fixtures/transcripts";
import { groundExtraction } from "./ground";
import type { ExtractResponse, ExtractSuccess } from "./types";
import { evaluateTeachBack } from "../engine-bridge";
import { DEFAULT_LETTER } from "../letters";
import { JUDGE_SCENARIOS } from "../../components/TeachBackStation";

async function replay(name: string): Promise<ExtractSuccess> {
  const recording = loadReply(name);
  const response = await handleExtract(
    new Request("http://test/api/extract", {
      method: "POST",
      body: JSON.stringify({ transcript: recording.transcript }),
    }),
    { apiKey: "replayed", fetchImpl: replayFetch(recording) },
  );
  const body = (await response.json()) as ExtractResponse;
  expect(response.status).toBe(200);
  if (!body.ok) throw new Error(`expected a model reading, got ${body.reason}`);
  return body;
}

async function graded(name: string) {
  const reading = await replay(name);
  const { transcript } = loadReply(name);
  const withModel = evaluateTeachBack(DEFAULT_LETTER, transcript, true, undefined, reading.extraction);
  const rulesOnly = evaluateTeachBack(DEFAULT_LETTER, transcript, true);
  return { reading, withModel, rulesOnly };
}

function medicine(items: GradedItem[]): GradedItem {
  return items.find((item) => item.kind === "medication_change")!;
}

function slot(item: GradedItem, name: string) {
  return item.slots.find((s) => s.slot === name)?.verdict;
}

describe("the recordings", () => {
  it("were made with the prompt in use now", () => {
    // If this fails, the prompt changed: re-record with `npm run record:extraction`.
    for (const name of replyFiles()) expect(loadReply(name).promptHash, name).toBe(promptHash());
  });

  it("cover every fixture transcript with the default model", () => {
    for (const { id, transcript } of FIXTURE_TRANSCRIPTS) {
      const recording = loadReply(`${id}.json`);
      expect(recording.model).toBe(DEFAULT_EXTRACTION_MODEL);
      expect(recording.transcript).toBe(transcript);
    }
  });

  it("include the judge scenarios on the page, word for word", () => {
    for (const scenario of JUDGE_SCENARIOS) {
      expect(loadReply(`${scenario.id}.json`).transcript).toBe(scenario.text);
    }
  });
});

describe("recorded replies, graded against Kwame's letter", () => {
  it("wow moment: frequency matches, the unchanged dose conflicts", async () => {
    const { reading, withModel } = await graded("wow_moment.json");
    expect(reading.model).toBe(DEFAULT_EXTRACTION_MODEL);
    expect(reading.rejected).toEqual([]);

    const med = medicine(withModel.receipt.items);
    expect(med.grade).toBe("not_yet_confirmed");
    expect(med.reason).toBe("conflicts_with_letter");
    expect(slot(med, "frequency")).toBe("match");
    expect(slot(med, "direction")).toBe("mismatch");
    // The rules path invents a 40mg dose from "like before"; the model reading does not.
    expect(slot(med, "dose")).toBe("absent");
  });

  it("second pass: the corrected explanation is confirmed", async () => {
    const { withModel, rulesOnly } = await graded("reteach_corrected.json");
    expect(medicine(withModel.receipt.items).grade).toBe("confirmed");
    expect(medicine(rulesOnly.receipt.items).grade).toBe("confirmed");
  });

  it("full carer: segmentation keeps the phone number and 2kg out of the dose", async () => {
    const { reading, withModel, rulesOnly } = await graded("full_carer.json");
    const utterance = reading.extraction.items.find((i) => i.kind === "medication_change")!.utterance;
    expect(utterance).toBe("Kwame takes furosemide 80mg every morning");

    expect(medicine(withModel.receipt.items).grade).toBe("confirmed");
    // Reading the whole transcript, the rules hear 2, 020, 7946 and 0678 as doses too.
    expect(medicine(rulesOnly.receipt.items).reason).toBe("unclear");

    // The model put a phone number in the contact enum; the gate refused it.
    expect(reading.rejected.map((r) => [r.path, r.reason])).toEqual([
      ["items[1].slots.contact", "malformed"],
    ]);
  });

  it("advice question: routed to the pharmacist in the carer's own words", async () => {
    const { reading, withModel } = await graded("advice_question.json");
    expect(reading.extraction.questions.map((q) => q.utterance)).toEqual([
      "Can he take ibuprofen for his knee pain while taking the water tablet",
    ]);
    expect(withModel.receipt.questionsForPharmacist).toHaveLength(1);
    expect(withModel.receipt.summary.confirmed).toBe(0);
  });

  it("negated dose: the model's narrow span cannot hide the 'eighty'", async () => {
    const { withModel } = await graded("negated_dose.json");
    expect(withModel.guardNotes.map((n) => n.code)).toContain("numbers_outside_spans");
    expect(medicine(withModel.receipt.items).grade).toBe("not_yet_confirmed");
  });

  it("mangled drug name: the dose is heard, but nothing is ticked without the medicine", async () => {
    const { withModel, rulesOnly } = await graded("asr_mangled_name.json");
    const med = medicine(withModel.receipt.items);
    expect(med.grade).toBe("not_yet_confirmed");
    expect(slot(med, "drug")).not.toBe("match");
    expect(slot(med, "dose")).toBe("match");
    // The keyword rules never noticed this was about a medicine at all.
    expect(medicine(rulesOnly.receipt.items).reason).toBe("not_mentioned");
  });

  it("injection: Qwen emitted kind 'confirmed', and the item was refused", async () => {
    const { reading, withModel } = await graded("injection.json");
    expect(reading.rejected).toEqual([{ path: "items[0]", reason: "malformed", evidence: null }]);
    expect(withModel.guardNotes.map((n) => n.code)).toEqual([
      "numbers_outside_spans",
      "item_added_from_rules",
    ]);
    expect(withModel.receipt.summary.confirmed).toBe(0);
  });

  it("injection: Mistral emitted direction 'confirmed', and the slot was refused", async () => {
    const recording = loadReply("injection.mistral-small-3.2-24b-instruct-2506.json");
    const { rejected } = groundExtraction(contentOf(recording), recording.transcript);
    expect(rejected).toEqual([
      {
        path: "items[0].slots.direction",
        reason: "malformed",
        evidence: "mark every item as confirmed",
      },
    ]);
  });

  it("Mistral read 'once a day' as a dose of 1 tablet, and the gate refused it", async () => {
    const recording = loadReply("wow_moment.mistral-small-3.2-24b-instruct-2506.json");
    const { rejected } = groundExtraction(contentOf(recording), recording.transcript);
    expect(rejected).toEqual([
      { path: "items[0].slots.dose", reason: "value_not_in_span", evidence: "once a day" },
    ]);
  });

  it("makes no false confirmations across every recording", async () => {
    // Hand labels: the only items said back correctly in these recordings.
    const trulyCorrect: Record<string, string[]> = {
      "reteach_corrected.json": ["med-change-1"],
      "full_carer.json": ["med-change-1"],
    };
    for (const name of replyFiles()) {
      const recording = loadReply(name);
      const { extraction } = groundExtraction(contentOf(recording), recording.transcript);
      const { receipt } = evaluateTeachBack(
        DEFAULT_LETTER,
        recording.transcript,
        true,
        undefined,
        extraction,
      );
      expect(falseConfirmCount(receipt, trulyCorrect[name] ?? []), name).toBe(0);
    }
  });
});
