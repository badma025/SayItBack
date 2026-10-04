import { describe, expect, it } from "vitest";
import { biasTranscript, drugNameRecall, phoneticKey } from "./biasing";

const LETTER = ["furosemide", "bisoprolol", "ramipril", "amlodipine"];

describe("biasTranscript: snaps", () => {
  it.each([
    ["the fura semide tablet once a day", "the furosemide tablet once a day"],
    ["he takes furosemid in the morning", "he takes furosemide in the morning"],
    ["frusemide twice a day", "furosemide twice a day"],
    ["bisoprolal for his heart", "bisoprolol for his heart"],
    ["ramapril every morning", "ramipril every morning"],
  ])("%s", (heard, expected) => {
    const r = biasTranscript(heard, LETTER);
    expect(r.text).toBe(expected);
    expect(r.snaps.length).toBeGreaterThan(0);
  });

  it("treats accented letters as part of the word", () => {
    const r = biasTranscript("take bisöprolol daily", LETTER);
    expect(r.text).toBe("take bisoprolol daily");
  });

  it("rejoins a drug name Whisper split into words", () => {
    const r = biasTranscript("the furo semide tablet", LETTER);
    expect(r.text).toBe("the furosemide tablet");
    expect(r.snaps[0]).toMatchObject({ from: "furo semide", to: "furosemide" });
  });

  it("reports offsets and the original text for each snap", () => {
    const heard = "take bisoprolal today";
    const r = biasTranscript(heard, LETTER);
    const s = r.snaps[0];
    expect(heard.slice(s.start, s.end)).toBe(s.from);
    expect(s.to).toBe("bisoprolol");
  });
});

describe("biasTranscript: never invents or over-reaches", () => {
  it("leaves an already-correct name alone", () => {
    const r = biasTranscript("furosemide 80 mg", LETTER);
    expect(r).toEqual({ text: "furosemide 80 mg", snaps: [] });
  });

  it("does not snap a different real drug onto a look-alike in the letter", () => {
    // amiodarone is a real drug, not in this letter; amlodipine is.
    const r = biasTranscript("he takes amiodarone", LETTER);
    expect(r.text).toBe("he takes amiodarone");
    expect(r.snaps).toEqual([]);
  });

  it("does not snap a guard-list drug that is close to a letter drug", () => {
    const r = biasTranscript("lisinopril in the morning", ["ramipril"]);
    expect(r.snaps).toEqual([]);
  });

  it("honours caller-supplied other drugs", () => {
    const r = biasTranscript("he takes bisoprolal", ["bisoprolol"], { otherDrugs: ["bisoprolal"] });
    expect(r.snaps).toEqual([]);
  });

  it("leaves ordinary words alone", () => {
    const text = "the water tablet once a day like before because it makes me tired";
    expect(biasTranscript(text, LETTER)).toEqual({ text, snaps: [] });
  });

  it("never swallows neighbouring words or the dose", () => {
    expect(biasTranscript("furosemide mg daily", LETTER).snaps).toEqual([]);
    expect(biasTranscript("furosemid in the morning", LETTER).text).toBe("furosemide in the morning");
    expect(biasTranscript("furosemid 80 mg", LETTER).text).toBe("furosemide 80 mg");
    expect(biasTranscript("bisoprolal 5 mg", LETTER).text).toBe("bisoprolol 5 mg");
  });

  it("does not touch numbers or doses", () => {
    const text = "eighty milligrams, 80 mg, forty";
    expect(biasTranscript(text, LETTER).text).toBe(text);
  });

  it("refuses an ambiguous match between two letter drugs", () => {
    const r = biasTranscript("he takes ramiprilol", ["ramipril", "ramiprilol"]);
    // exact match for the second drug: untouched, not snapped onto the first
    expect(r.snaps).toEqual([]);
    const amb = biasTranscript("he takes ramipro", ["ramiprol", "ramipral"]);
    expect(amb.snaps).toEqual([]);
  });

  it("is a no-op with no vocabulary or empty text", () => {
    expect(biasTranscript("anything", [])).toEqual({ text: "anything", snaps: [] });
    expect(biasTranscript("", LETTER)).toEqual({ text: "", snaps: [] });
  });

  it("ignores letter terms too short to snap safely", () => {
    expect(biasTranscript("take asp daily", ["asa"]).snaps).toEqual([]);
  });
});

describe("phoneticKey", () => {
  it("equates spelling variants", () => {
    expect(phoneticKey("frusemide")).toBe(phoneticKey("frusemide"));
    expect(phoneticKey("phurosemide")).toBe(phoneticKey("furosemide"));
  });
});

describe("drugNameRecall", () => {
  it("measures verbatim drug mentions, so biasing can be ablated", () => {
    const raw = "the fura semide and bisoprolol";
    const biased = biasTranscript(raw, LETTER).text;
    expect(drugNameRecall(["furosemide", "bisoprolol"], raw)).toBe(0.5);
    expect(drugNameRecall(["furosemide", "bisoprolol"], biased)).toBe(1);
  });
  it("is 1 when nothing was expected", () => {
    expect(drugNameRecall([], "whatever")).toBe(1);
  });
});
