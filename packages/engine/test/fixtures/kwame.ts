/**
 * The demo discharge: Kwame, 81, heart failure, furosemide up to 80mg.
 *
 * Synthetic, built on PRSB eDischarge headings. No real patient data is used
 * anywhere in this repo.
 */

import type { RawLetterExtraction, SpokenExtraction, SpokenItem } from "../../src/types.js";

export const KWAME_LETTER = `NHS DISCHARGE SUMMARY

Patient: Kwame A. (DOB 14/02/1945)
Ward: Beech (Cardiology)      Date of discharge: 06/10/2026

ADMISSION DETAILS
Admitted 01/10/2026 with worsening breathlessness and ankle swelling.

DIAGNOSES
1. Decompensated heart failure (reduced ejection fraction).
2. Hypertension.

ALLERGIES AND ADVERSE REACTIONS
Penicillin - rash.

MEDICATIONS AND MEDICAL DEVICES
Furosemide - dose increased to 80mg once daily. Previously 40mg once daily.
Bisoprolol 2.5mg once daily - no change.
Ramipril 5mg once daily - no change.
Apixaban 5mg twice daily - started this admission.

PLAN AND REQUESTED ACTIONS
Weigh yourself every morning. If you gain more than 2kg in two days, or you
become more breathless at night, telephone the heart failure nurse.
If you have chest pain or cannot catch your breath at rest, call 999.
Follow-up with the heart failure nurse in 7 days by telephone.
Repeat blood test (U&E) at the GP surgery in 7 days.

PERSON COMPLETING RECORD
Dr A. Mensah, Cardiology SHO.`;

/** What the extraction model returns for that letter, before verification. */
export const KWAME_EXTRACTION: RawLetterExtraction = {
  items: [
    {
      id: "dx-1",
      kind: "diagnosis",
      evidence: {
        quote: "Decompensated heart failure (reduced ejection fraction).",
        heading: "diagnoses",
      },
      slots: {
        condition: "heart failure",
        lay_term: "the heart is not pumping strongly enough",
      },
    },
    {
      id: "med-furosemide",
      kind: "medication_change",
      evidence: {
        quote: "Furosemide - dose increased to 80mg once daily. Previously 40mg once daily.",
        heading: "medications_and_medical_devices",
      },
      slots: {
        drug: "furosemide",
        lay_name: "water tablet",
        direction: "increased",
        dose: { value: 80, unit: "mg" },
        previous_dose: { value: 40, unit: "mg" },
        frequency: "once_daily",
      },
    },
    {
      id: "med-apixaban",
      kind: "medication_change",
      evidence: {
        quote: "Apixaban 5mg twice daily - started this admission.",
        heading: "medications_and_medical_devices",
      },
      slots: {
        drug: "apixaban",
        lay_name: "blood thinner",
        direction: "started",
        dose: { value: 5, unit: "mg" },
        previous_dose: null,
        frequency: "twice_daily",
      },
    },
    {
      id: "flag-chest-pain",
      kind: "red_flag",
      evidence: {
        quote: "If you have chest pain or cannot catch your breath at rest, call 999.",
        heading: "plan_and_requested_actions",
      },
      slots: { symptom: "chest pain", contact: "999" },
    },
    {
      id: "followup-hf-nurse",
      kind: "follow_up",
      evidence: {
        quote: "Follow-up with the heart failure nurse in 7 days by telephone.",
        heading: "plan_and_requested_actions",
      },
      slots: { with_whom: "heart failure nurse", timeframe_days: 7, modality: "telephone" },
    },
  ],
};

/** Build a teach-back extraction out of utterances, the way the UI does. */
export function teachBack(
  utterances: Array<Pick<SpokenItem, "kind" | "utterance"> & Partial<SpokenItem>>,
  questions: SpokenExtraction["questions"] = [],
): SpokenExtraction {
  const items: SpokenItem[] = utterances.map((spoken, index) => ({
    id: spoken.id ?? `said-${index}`,
    kind: spoken.kind,
    slots: spoken.slots ?? {},
    utterance: spoken.utterance,
  }));
  return {
    transcript: items.map((item) => item.utterance).join(" "),
    items,
    questions,
  };
}
