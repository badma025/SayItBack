import { describe, expect, it } from "vitest";
import { checkSlotGrounding, findQuote, verifyLetterExtraction } from "../src/evidence.js";
import type { RawItem, RawLetterExtraction } from "../src/types.js";
import { KWAME_EXTRACTION, KWAME_LETTER } from "./fixtures/kwame.js";

describe("findQuote", () => {
  it("finds a quote copied word for word", () => {
    const result = findQuote("Bisoprolol 2.5mg once daily", KWAME_LETTER);
    expect(result.status).toBe("verified");
    if (result.status !== "verified") return;
    expect(result.match.kind).toBe("exact");
    expect(KWAME_LETTER.slice(result.match.start, result.match.end)).toBe(
      "Bisoprolol 2.5mg once daily",
    );
  });

  it("forgives punctuation, capitals and line breaks", () => {
    const result = findQuote(
      "If you gain more than 2kg in two days, or you become more breathless at night",
      KWAME_LETTER,
    );
    expect(result.status).toBe("verified");
  });

  it("forgives a small transcription slip", () => {
    const result = findQuote("Furosemide - dose increassed to 80mg once daily", KWAME_LETTER);
    expect(result.status).toBe("verified");
    if (result.status !== "verified") return;
    expect(result.match.kind).toBe("fuzzy");
    expect(result.match.similarity).toBeGreaterThan(0.95);
  });

  it("refuses a quote that is not in the letter", () => {
    const result = findQuote("Take ibuprofen if you are in pain.", KWAME_LETTER);
    expect(result.status).toBe("unverified");
    if (result.status !== "unverified") return;
    expect(result.reason).toBe("no_match");
  });

  it("refuses a quote whose numbers drift, however close the words are", () => {
    // The photographed-letter failure: a vision model reads 80mg for 40mg, and
    // every other character still agrees.
    const result = findQuote("Furosemide - dose increased to 40mg once daily", KWAME_LETTER);
    expect(result.status).toBe("unverified");
    if (result.status !== "unverified") return;
    expect(result.reason).toBe("digits_differ");
    expect(result.nearest?.matchedText).toContain("80mg");
  });

  it("refuses a quote too short to be evidence", () => {
    const result = findQuote("80mg", KWAME_LETTER);
    expect(result.status).toBe("unverified");
    if (result.status !== "unverified") return;
    expect(result.reason).toBe("quote_too_short");
  });

  it("reports offsets into the original text, for highlighting", () => {
    const result = findQuote("Apixaban 5mg twice daily", KWAME_LETTER);
    if (result.status !== "verified") throw new Error("expected a verified quote");
    expect(KWAME_LETTER.slice(result.match.start, result.match.end)).toBe(
      "Apixaban 5mg twice daily",
    );
  });
});

describe("checkSlotGrounding", () => {
  const furosemide = KWAME_EXTRACTION.items.find((item) => item.id === "med-furosemide") as RawItem;

  it("passes an item whose numbers are in its own quote", () => {
    expect(checkSlotGrounding(furosemide).status).toBe("ok");
  });

  it("fails an item asserting a dose its quote never mentions", () => {
    const tampered = {
      ...furosemide,
      slots: { ...furosemide.slots, dose: { value: 120, unit: "mg" } },
    } as RawItem;
    const result = checkSlotGrounding(tampered);
    expect(result.status).toBe("failed");
    if (result.status !== "failed") return;
    expect(result.reason).toBe("slot_not_in_quote");
  });

  it("fails an item whose direction contradicts its quote", () => {
    const tampered = {
      ...furosemide,
      slots: { ...furosemide.slots, direction: "decreased" },
    } as RawItem;
    const result = checkSlotGrounding(tampered);
    expect(result.status).toBe("failed");
    if (result.status !== "failed") return;
    expect(result.reason).toBe("slot_conflicts_with_quote");
  });

  it("warns, but does not fail, when the quote simply does not cover the change", () => {
    const item = {
      id: "med-x",
      kind: "medication_change",
      evidence: { quote: "Bisoprolol 2.5mg once daily", heading: "medications_and_medical_devices" },
      slots: {
        drug: "bisoprolol",
        lay_name: null,
        direction: "started",
        dose: { value: 2.5, unit: "mg" },
        previous_dose: null,
        frequency: "once_daily",
      },
    } as RawItem;
    const result = checkSlotGrounding(item);
    expect(result.status).toBe("ok");
    if (result.status !== "ok") return;
    expect(result.warnings.map((warning) => warning.code)).toContain("direction_not_in_quote");
  });
});

describe("verifyLetterExtraction", () => {
  it("lets the demo letter through intact", () => {
    const letter = verifyLetterExtraction(KWAME_LETTER, KWAME_EXTRACTION);
    expect(letter.items).toHaveLength(KWAME_EXTRACTION.items.length);
    expect(letter.checkWithWard).toHaveLength(0);
  });

  it("sends an invented item to the ward instead of dropping it", () => {
    const withHallucination: RawLetterExtraction = {
      items: [
        ...KWAME_EXTRACTION.items,
        {
          id: "invented",
          kind: "medication_change",
          evidence: {
            quote: "Metformin 500mg twice daily - continue as before.",
            heading: "medications_and_medical_devices",
          },
          slots: {
            drug: "metformin",
            lay_name: null,
            direction: "unchanged",
            dose: { value: 500, unit: "mg" },
            previous_dose: null,
            frequency: "twice_daily",
          },
        },
      ],
    };

    const letter = verifyLetterExtraction(KWAME_LETTER, withHallucination);
    expect(letter.items.map((item) => item.id)).not.toContain("invented");
    expect(letter.checkWithWard.map((item) => item.id)).toContain("invented");
  });

  it("flags OCR sources, because the quote check is circular on a photo", () => {
    const letter = verifyLetterExtraction(KWAME_LETTER, KWAME_EXTRACTION, { sourceKind: "ocr" });
    for (const item of letter.items) {
      expect(item.warnings.map((warning) => warning.code)).toContain("ocr_source");
    }
  });
});
