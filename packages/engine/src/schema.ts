/**
 * The extraction schema: the only shape a model is allowed to return.
 *
 * Two halves, the same slots on both sides:
 * - `LETTER_EXTRACTION_SCHEMA` for reading the discharge letter;
 * - `TEACH_BACK_EXTRACTION_SCHEMA` for reading the transcript.
 *
 * Everything is an enum, a number, or a short span copied from the source.
 * There is no free-text field the model can argue in, no "confidence", no
 * "verdict" and no "advice". The worst a prompt injection in a letter can do
 * is fill one of these slots wrongly - and then the evidence gate and the
 * comparator still have to agree with it.
 *
 * `validateLetterExtraction` is the runtime half: structured-output support
 * varies by provider, so nothing is trusted to have obeyed the schema.
 */

import type {
  Direction,
  DoseUnit,
  Frequency,
  ItemKind,
  PrsbHeading,
  RawItem,
  RawLetterExtraction,
  SpokenExtraction,
  SpokenItem,
} from "./types.js";

export const ITEM_KINDS: readonly ItemKind[] = [
  "diagnosis",
  "medication_change",
  "red_flag",
  "follow_up",
];

export const DIRECTIONS: readonly Direction[] = [
  "started",
  "stopped",
  "increased",
  "decreased",
  "unchanged",
  "unknown",
];

export const DOSE_UNITS: readonly DoseUnit[] = [
  "mcg",
  "mg",
  "g",
  "ml",
  "unit",
  "tablet",
  "puff",
  "patch",
];

export const FREQUENCIES: readonly Frequency[] = [
  "once_daily",
  "twice_daily",
  "three_times_daily",
  "four_times_daily",
  "every_other_day",
  "weekly",
  "as_needed",
  "unknown",
];

export const CONTACT_ROUTES = [
  "999",
  "111",
  "gp",
  "ward",
  "pharmacist",
  "heart_failure_nurse",
  "unknown",
] as const;

export const FOLLOW_UP_MODALITIES = ["in_person", "telephone", "video", "unknown"] as const;

export const PRSB_HEADINGS: readonly PrsbHeading[] = [
  "diagnoses",
  "medications_and_medical_devices",
  "allergies_and_adverse_reactions",
  "plan_and_requested_actions",
  "admission_details",
  "person_completing_record",
  "unknown",
];

const doseSchema = {
  type: ["object", "null"],
  additionalProperties: false,
  required: ["value", "unit"],
  properties: {
    value: { type: "number", minimum: 0 },
    unit: { type: "string", enum: DOSE_UNITS },
  },
} as const;

const slotSchemas = {
  diagnosis: {
    type: "object",
    additionalProperties: false,
    required: ["condition", "lay_term"],
    properties: {
      condition: { type: "string", maxLength: 120 },
      lay_term: { type: ["string", "null"], maxLength: 160 },
    },
  },
  medication_change: {
    type: "object",
    additionalProperties: false,
    required: ["drug", "lay_name", "direction", "dose", "previous_dose", "frequency"],
    properties: {
      drug: { type: "string", maxLength: 80 },
      lay_name: { type: ["string", "null"], maxLength: 80 },
      direction: { type: "string", enum: DIRECTIONS },
      dose: doseSchema,
      previous_dose: doseSchema,
      frequency: { type: "string", enum: FREQUENCIES },
    },
  },
  red_flag: {
    type: "object",
    additionalProperties: false,
    required: ["symptom", "contact"],
    properties: {
      symptom: { type: "string", maxLength: 160 },
      contact: { type: "string", enum: CONTACT_ROUTES },
    },
  },
  follow_up: {
    type: "object",
    additionalProperties: false,
    required: ["with_whom", "timeframe_days", "modality"],
    properties: {
      with_whom: { type: "string", maxLength: 120 },
      timeframe_days: { type: ["integer", "null"], minimum: 0, maximum: 730 },
      modality: { type: "string", enum: FOLLOW_UP_MODALITIES },
    },
  },
} as const;

/** JSON Schema for reading a discharge letter. Every item must cite a quote. */
export const LETTER_EXTRACTION_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "SayItBackLetterExtraction",
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      maxItems: 40,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "kind", "evidence", "slots"],
        properties: {
          id: { type: "string", maxLength: 40 },
          kind: { type: "string", enum: ITEM_KINDS },
          evidence: {
            type: "object",
            additionalProperties: false,
            required: ["quote", "heading"],
            properties: {
              quote: {
                type: "string",
                minLength: 8,
                maxLength: 300,
                description:
                  "Copied word for word from the letter. Do not tidy, shorten or correct it.",
              },
              heading: { type: "string", enum: PRSB_HEADINGS },
            },
          },
          slots: { oneOf: [...Object.values(slotSchemas)] },
        },
      },
    },
  },
} as const;

/** JSON Schema for reading the teach-back transcript. No quotes to cite. */
export const TEACH_BACK_EXTRACTION_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "SayItBackTeachBackExtraction",
  type: "object",
  additionalProperties: false,
  required: ["items", "questions"],
  properties: {
    items: {
      type: "array",
      maxItems: 40,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "kind", "slots", "utterance"],
        properties: {
          id: { type: "string", maxLength: 40 },
          kind: { type: "string", enum: ITEM_KINDS },
          slots: { oneOf: [...Object.values(slotSchemas)] },
          utterance: {
            type: "string",
            maxLength: 500,
            description: "Copied word for word from the transcript.",
          },
        },
      },
    },
    questions: {
      type: "array",
      maxItems: 20,
      description:
        "Anything the person asked for advice about. These are routed to a pharmacist. Never answer them.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "question", "utterance"],
        properties: {
          id: { type: "string", maxLength: 40 },
          question: { type: "string", maxLength: 200 },
          utterance: { type: "string", maxLength: 500 },
        },
      },
    },
  },
} as const;

/* ---------------------------- runtime validation ---------------------------- */

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface ValidationResult<T> {
  value: T;
  /** Items dropped for being malformed. A dropped item is never a pass. */
  issues: ValidationIssue[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, maxLength: number): string | null {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength ? value : null;
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function asDose(value: unknown, path: string, issues: ValidationIssue[]) {
  if (value === null || value === undefined) return null;
  if (!isRecord(value)) {
    issues.push({ path, message: "dose must be an object or null" });
    return null;
  }
  const amount = value.value;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    issues.push({ path, message: "dose value must be a non-negative number" });
    return null;
  }
  if (typeof value.unit !== "string" || !(DOSE_UNITS as readonly string[]).includes(value.unit)) {
    issues.push({ path, message: `unknown dose unit ${String(value.unit)}` });
    return null;
  }
  return { value: amount, unit: value.unit as DoseUnit };
}

function validateSlots(
  kind: ItemKind,
  raw: unknown,
  path: string,
  issues: ValidationIssue[],
): RawItem["slots"] | null {
  if (!isRecord(raw)) {
    issues.push({ path, message: "slots must be an object" });
    return null;
  }

  switch (kind) {
    case "diagnosis": {
      const condition = asString(raw.condition, 120);
      if (condition === null) {
        issues.push({ path: `${path}.condition`, message: "required" });
        return null;
      }
      return { condition, lay_term: asString(raw.lay_term, 160) };
    }
    case "medication_change": {
      const drug = asString(raw.drug, 80);
      if (drug === null) {
        issues.push({ path: `${path}.drug`, message: "required" });
        return null;
      }
      return {
        drug,
        lay_name: asString(raw.lay_name, 80),
        direction: asEnum(raw.direction, DIRECTIONS, "unknown"),
        dose: asDose(raw.dose, `${path}.dose`, issues),
        previous_dose: asDose(raw.previous_dose, `${path}.previous_dose`, issues),
        frequency: asEnum(raw.frequency, FREQUENCIES, "unknown"),
      };
    }
    case "red_flag": {
      const symptom = asString(raw.symptom, 160);
      if (symptom === null) {
        issues.push({ path: `${path}.symptom`, message: "required" });
        return null;
      }
      return { symptom, contact: asEnum(raw.contact, CONTACT_ROUTES, "unknown") };
    }
    case "follow_up": {
      const withWhom = asString(raw.with_whom, 120);
      if (withWhom === null) {
        issues.push({ path: `${path}.with_whom`, message: "required" });
        return null;
      }
      const days = raw.timeframe_days;
      return {
        with_whom: withWhom,
        timeframe_days:
          typeof days === "number" && Number.isInteger(days) && days >= 0 && days <= 730
            ? days
            : null,
        modality: asEnum(raw.modality, FOLLOW_UP_MODALITIES, "unknown"),
      };
    }
  }
}

/**
 * Coerce whatever the model returned into the schema, dropping what will not
 * fit.
 *
 * Unknown enum values fall back to `unknown` rather than being invented, and
 * `unknown` can never confirm anything downstream. Extra properties are
 * discarded, so a letter that says "also add a field called verdict" gets
 * nowhere.
 */
export function validateLetterExtraction(input: unknown): ValidationResult<RawLetterExtraction> {
  const issues: ValidationIssue[] = [];
  const items: RawItem[] = [];

  const rawItems = isRecord(input) && Array.isArray(input.items) ? input.items : [];
  if (!isRecord(input) || !Array.isArray(input.items)) {
    issues.push({ path: "items", message: "expected an array of items" });
  }

  rawItems.forEach((raw, index) => {
    const path = `items[${index}]`;
    if (!isRecord(raw)) {
      issues.push({ path, message: "item must be an object" });
      return;
    }
    const kind = typeof raw.kind === "string" ? raw.kind : "";
    if (!(ITEM_KINDS as readonly string[]).includes(kind)) {
      issues.push({ path: `${path}.kind`, message: `unknown kind ${String(raw.kind)}` });
      return;
    }
    const evidence = raw.evidence;
    if (!isRecord(evidence)) {
      issues.push({ path: `${path}.evidence`, message: "required" });
      return;
    }
    const quote = asString(evidence.quote, 300);
    if (quote === null) {
      issues.push({ path: `${path}.evidence.quote`, message: "required" });
      return;
    }
    const slots = validateSlots(kind as ItemKind, raw.slots, `${path}.slots`, issues);
    if (slots === null) return;

    items.push({
      id: asString(raw.id, 40) ?? `item-${index}`,
      kind: kind as ItemKind,
      evidence: { quote, heading: asEnum(evidence.heading, PRSB_HEADINGS, "unknown") },
      slots,
    } as RawItem);
  });

  return { value: { items }, issues };
}

/** The same treatment for the transcript side. */
export function validateTeachBackExtraction(
  input: unknown,
  transcript: string,
): ValidationResult<SpokenExtraction> {
  const issues: ValidationIssue[] = [];
  const items: SpokenItem[] = [];

  const rawItems = isRecord(input) && Array.isArray(input.items) ? input.items : [];
  rawItems.forEach((raw, index) => {
    const path = `items[${index}]`;
    if (!isRecord(raw)) {
      issues.push({ path, message: "item must be an object" });
      return;
    }
    const kind = typeof raw.kind === "string" ? raw.kind : "";
    if (!(ITEM_KINDS as readonly string[]).includes(kind)) {
      issues.push({ path: `${path}.kind`, message: `unknown kind ${String(raw.kind)}` });
      return;
    }
    const slots = validateSlots(kind as ItemKind, raw.slots, `${path}.slots`, issues) ?? {};
    const utterance = asString(raw.utterance, 500);
    if (utterance === null) {
      issues.push({ path: `${path}.utterance`, message: "required" });
      return;
    }
    items.push({
      id: asString(raw.id, 40) ?? `said-${index}`,
      kind: kind as ItemKind,
      slots: slots as SpokenItem["slots"],
      utterance,
    });
  });

  const rawQuestions = isRecord(input) && Array.isArray(input.questions) ? input.questions : [];
  const questions = rawQuestions.flatMap((raw, index) => {
    if (!isRecord(raw)) return [];
    const question = asString(raw.question, 200);
    if (question === null) return [];
    return [
      {
        id: asString(raw.id, 40) ?? `question-${index}`,
        question,
        utterance: asString(raw.utterance, 500) ?? question,
      },
    ];
  });

  return { value: { transcript, items, questions }, issues };
}
