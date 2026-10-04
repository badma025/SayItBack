import { describe, expect, it } from "vitest";
import { biasVocabulary, findDrugTerms, layNamesFor, resolveDrug } from "../src/lay-names.js";

describe("resolveDrug", () => {
  it("resolves a generic name and a brand name", () => {
    expect(resolveDrug("Furosemide")).toEqual({
      status: "resolved",
      generic: "furosemide",
      via: "generic",
    });
    expect(resolveDrug("Lasix")).toEqual({
      status: "resolved",
      generic: "furosemide",
      via: "synonym",
    });
  });

  it("resolves a lay name against what this letter contains", () => {
    expect(resolveDrug("water tablet", ["furosemide", "bisoprolol"])).toEqual({
      status: "resolved",
      generic: "furosemide",
      via: "lay_name",
    });
  });

  it("reports ambiguity when the letter has two water tablets", () => {
    const result = resolveDrug("water tablet", ["furosemide", "spironolactone"]);
    expect(result.status).toBe("ambiguous");
    if (result.status !== "ambiguous") return;
    expect(result.candidates).toEqual(["furosemide", "spironolactone"]);
  });

  it("reports ambiguity with no letter to narrow against", () => {
    expect(resolveDrug("blood thinner").status).toBe("ambiguous");
  });

  it("says unknown rather than picking the nearest word", () => {
    expect(resolveDrug("fruity semi")).toEqual({ status: "unknown" });
    expect(resolveDrug("")).toEqual({ status: "unknown" });
  });
});

describe("findDrugTerms", () => {
  it("finds multi-word lay names that tokenising would lose", () => {
    expect(findDrugTerms("he takes the water tablet in the morning")).toContain("water tablet");
  });

  it("does not match a term inside another word", () => {
    expect(findDrugTerms("superwatertablets")).toHaveLength(0);
  });
});

describe("the dictionary as data", () => {
  it("knows what a household calls furosemide", () => {
    expect(layNamesFor("furosemide")).toContain("water tablet");
    expect(layNamesFor("not-a-drug")).toEqual([]);
  });

  it("offers every spoken form to the speech recogniser", () => {
    const vocabulary = biasVocabulary(["furosemide"]);
    expect(vocabulary).toEqual(expect.arrayContaining(["furosemide", "frusemide", "water tablet"]));
  });
});
