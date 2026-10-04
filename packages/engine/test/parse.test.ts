import { describe, expect, it } from "vitest";
import {
  formatDose,
  formatTimeframe,
  parseContact,
  parseDirection,
  parseDose,
  parseDoses,
  parseFrequency,
  parseNumber,
  parseTimeframeDays,
  sameDose,
} from "../src/parse.js";

describe("parseNumber", () => {
  it("reads numerals and spelled-out numbers", () => {
    expect(parseNumber("80")).toBe(80);
    expect(parseNumber("2.5")).toBe(2.5);
    expect(parseNumber("eighty")).toBe(80);
    expect(parseNumber("eighty five")).toBe(85);
    expect(parseNumber("one hundred and twenty")).toBe(120);
  });

  it("tolerates the spelling people actually use", () => {
    expect(parseNumber("fourty")).toBe(40);
  });

  it("refuses to guess", () => {
    expect(parseNumber("a few")).toBeNull();
    expect(parseNumber("a")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });
});

describe("parseDose", () => {
  it("reads written and spoken doses", () => {
    expect(parseDose("furosemide 80mg once daily")).toEqual({
      value: 80,
      unit: "mg",
      unitInferred: false,
    });
    expect(parseDose("eighty milligrams of the water tablet")).toEqual({
      value: 80,
      unit: "mg",
      unitInferred: false,
    });
    expect(parseDose("two tablets at night")).toEqual({
      value: 2,
      unit: "tablet",
      unitInferred: false,
    });
  });

  it("takes a bare number only when given a unit to assume", () => {
    expect(parseDose("it went up to eighty")).toBeNull();
    expect(parseDose("it went up to eighty", "mg")).toEqual({
      value: 80,
      unit: "mg",
      unitInferred: true,
    });
  });

  it("does not read a frequency or an interval as a dose", () => {
    expect(parseDose("he takes it two times a day", "mg")).toBeNull();
    expect(parseDose("the appointment is in three days", "mg")).toBeNull();
  });

  it("returns the last dose, because the new one is said last", () => {
    expect(parseDose("it went up from forty to eighty", "mg")?.value).toBe(80);
    expect(parseDoses("it went up from forty to eighty", "mg").map((dose) => dose.value)).toEqual([
      40, 80,
    ]);
  });

  it("converts between mass units and nothing else", () => {
    expect(sameDose({ value: 0.5, unit: "g" }, { value: 500, unit: "mg" })).toBe(true);
    expect(sameDose({ value: 80, unit: "mg" }, { value: 80, unit: "ml" })).toBe(false);
    expect(sameDose({ value: 40, unit: "mg" }, { value: 80, unit: "mg" })).toBe(false);
  });

  it("formats doses the way the receipt shows them", () => {
    expect(formatDose({ value: 80, unit: "mg" })).toBe("80mg");
    expect(formatDose({ value: 1, unit: "tablet" })).toBe("1 tablet");
    expect(formatDose({ value: 2, unit: "tablet" })).toBe("2 tablets");
  });
});

describe("parseFrequency", () => {
  it("maps the ways people say a daily dose", () => {
    for (const phrase of ["once a day", "once daily", "one a day", "every day", "at night"]) {
      expect(parseFrequency(phrase)).toBe("once_daily");
    }
  });

  it("maps twice, three and four times a day", () => {
    expect(parseFrequency("twice a day")).toBe("twice_daily");
    expect(parseFrequency("morning and night")).toBe("twice_daily");
    expect(parseFrequency("three times a day")).toBe("three_times_daily");
    expect(parseFrequency("four times a day")).toBe("four_times_daily");
  });

  it("keeps as-needed separate from regular dosing", () => {
    expect(parseFrequency("only when he needs it")).toBe("as_needed");
    expect(parseFrequency("every other day")).toBe("every_other_day");
    expect(parseFrequency("he just takes it")).toBe("unknown");
  });
});

describe("parseDirection", () => {
  it("reads an increase however it is phrased", () => {
    for (const phrase of ["the dose increased", "it went up", "they doubled it", "up to 80"]) {
      expect(parseDirection(phrase)).toBe("increased");
    }
  });

  it("reads 'like before' as unchanged, not as a dose change", () => {
    expect(parseDirection("once a day like before")).toBe("unchanged");
    expect(parseDirection("same as before")).toBe("unchanged");
  });

  it("reads stopping and starting", () => {
    expect(parseDirection("he has to stop taking it")).toBe("stopped");
    expect(parseDirection("that one is a new tablet")).toBe("started");
    expect(parseDirection("they reduced it")).toBe("decreased");
  });

  it("says unknown rather than guessing", () => {
    expect(parseDirection("the white one")).toBe("unknown");
  });
});

describe("parseContact", () => {
  it("reads the emergency routes", () => {
    expect(parseContact("I would call 999")).toBe("999");
    expect(parseContact("ring triple nine")).toBe("999");
    expect(parseContact("phone 111")).toBe("111");
    expect(parseContact("call the heart failure nurse")).toBe("heart_failure_nurse");
    expect(parseContact("speak to the GP")).toBe("gp");
    expect(parseContact("I'd just wait")).toBe("unknown");
  });

  it("prefers 999 over a softer route when both are said", () => {
    expect(parseContact("call the GP, or 999 if it is bad")).toBe("999");
  });
});

describe("parseTimeframeDays", () => {
  it("converts intervals to days", () => {
    expect(parseTimeframeDays("in two weeks")).toBe(14);
    expect(parseTimeframeDays("seven days")).toBe(7);
    expect(parseTimeframeDays("within 48 hours")).toBe(2);
    expect(parseTimeframeDays("a fortnight")).toBe(14);
  });

  it("does not do calendars", () => {
    expect(parseTimeframeDays("next Tuesday")).toBeNull();
  });

  it("formats weeks as weeks", () => {
    expect(formatTimeframe(14)).toBe("2 weeks");
    expect(formatTimeframe(7)).toBe("1 week");
    expect(formatTimeframe(3)).toBe("3 days");
  });
});
