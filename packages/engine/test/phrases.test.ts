import { describe, expect, it } from "vitest";
import { comparePhrase, contentWords } from "../src/phrases.js";
import { digitRuns, editDistance, normalise, similarity } from "../src/text.js";

describe("normalise", () => {
  it("flattens case, punctuation, dashes and line breaks", () => {
    expect(normalise("Furosemide — dose INCREASED to 80mg,\n once daily.")).toBe(
      "furosemide - dose increased to 80mg once daily",
    );
  });

  it("keeps a decimal point, which carries a dose", () => {
    expect(normalise("Bisoprolol 2.5mg.")).toBe("bisoprolol 2.5mg");
  });

  it("lists digit runs in order", () => {
    expect(digitRuns("increased to 80mg from 40mg")).toEqual(["80", "40"]);
    expect(digitRuns("no numbers here")).toEqual([]);
  });

  it("measures edit distance and similarity", () => {
    expect(editDistance("furosemide", "furosemide")).toBe(0);
    expect(editDistance("40mg", "80mg")).toBe(1);
    // Two edits in ten characters: close enough to pair on, nowhere near
    // close enough to confirm on.
    expect(similarity("furosemide", "frusemide")).toBeCloseTo(0.8, 5);
  });
});

describe("contentWords", () => {
  it("keeps the words that carry the meaning", () => {
    expect(contentWords("If you have chest pain, call 999")).toEqual([
      "chest",
      "pain",
      "call",
      "999",
    ]);
  });
});

describe("comparePhrase", () => {
  it("matches the clinical term said back word for word", () => {
    expect(comparePhrase("heart failure", "they said it was heart failure").verdict).toBe("match");
  });

  it("matches a lay wording a clinician has signed off", () => {
    const result = comparePhrase("heart failure", "his heart is not pumping properly");
    expect(result.verdict).toBe("match");
    expect(result.via).toBe("synonym");
  });

  it("matches on content-word coverage, allowing for word endings", () => {
    const result = comparePhrase("swollen ankles", "his ankles were swollen");
    expect(result.verdict).toBe("match");
    expect(result.coverage).toBe(1);
  });

  it("says uncertain, not match, when only part of it comes through", () => {
    const result = comparePhrase("chest pain at rest", "he had some pain");
    expect(result.verdict).toBe("uncertain");
    expect(result.coverage).toBeLessThan(0.6);
  });

  it("says absent when none of it comes through", () => {
    expect(comparePhrase("chest pain", "I cannot remember").verdict).toBe("absent");
    expect(comparePhrase("chest pain", "").verdict).toBe("absent");
  });

  it("never returns a mismatch, because a gap is not a contradiction", () => {
    const verdicts = ["", "something else entirely", "pain"].map(
      (heard) => comparePhrase("chest pain", heard).verdict,
    );
    expect(verdicts).not.toContain("mismatch");
  });

  it("takes extra synonyms from the caller", () => {
    const result = comparePhrase("heart failure", "his pump is tired", {
      synonyms: { "heart failure": ["pump is tired"] },
    });
    expect(result.verdict).toBe("match");
  });
});
