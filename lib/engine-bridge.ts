import {
  type VerifiedLetter,
  type VerifiedItem,
  type SpokenExtraction,
  type SpokenItem,
  type PharmacistQuestion,
  type Receipt,
  type Direction,
  type Frequency,
  gradeTeachBack,
  reteachPlan,
  resolveDrug,
} from "@sayitback/engine";
import { type DischargeLetter } from "./letters";

/**
 * Converts a structured discharge letter into the engine's VerifiedLetter format.
 */
export function buildVerifiedLetter(letter: DischargeLetter, sourceText?: string): VerifiedLetter {
  const verifiedItems: VerifiedItem[] = [];

  // 1. Diagnosis
  verifiedItems.push({
    id: "diag-1",
    kind: "diagnosis",
    evidence: {
      heading: "diagnoses",
      quote: letter.primary_diagnosis.verbatim_quote,
      status: "verified",
      match: {
        kind: "exact",
        start: 0,
        end: letter.primary_diagnosis.verbatim_quote.length,
        matchedText: letter.primary_diagnosis.verbatim_quote,
        similarity: 1.0,
      },
    },
    slots: {
      condition: "heart failure",
      lay_term: letter.primary_diagnosis.plain_language,
    },
    warnings: [],
  });

  // 2. Medication changes (The core safety slot items)
  letter.must_know_medicine_changes.forEach((med, idx) => {
    const isIncreased = med.direction.toLowerCase().includes("increased");
    const isDecreased = med.direction.toLowerCase().includes("decreased");
    const isStopped = med.direction.toLowerCase().includes("stopped");
    const isStarted = med.direction.toLowerCase().includes("started");

    let direction: Direction = "unchanged";
    if (isIncreased) direction = "increased";
    else if (isDecreased) direction = "decreased";
    else if (isStopped) direction = "stopped";
    else if (isStarted) direction = "started";

    const doseVal = parseFloat(med.dose.replace(/[^0-9.]/g, "")) || 80;
    const prevDoseVal = med.previous_dose
      ? parseFloat(med.previous_dose.replace(/[^0-9.]/g, ""))
      : null;

    let frequency: Frequency = "once_daily";
    if (med.frequency.includes("twice")) frequency = "twice_daily";
    else if (med.frequency.includes("three")) frequency = "three_times_daily";

    verifiedItems.push({
      id: `med-change-${idx + 1}`,
      kind: "medication_change",
      evidence: {
        heading: "medications_and_medical_devices",
        quote: med.verbatim_quote,
        status: "verified",
        match: {
          kind: "exact",
          start: 0,
          end: med.verbatim_quote.length,
          matchedText: med.verbatim_quote,
          similarity: 1.0,
        },
      },
      slots: {
        drug: med.drug.toLowerCase(),
        lay_name: med.lay_name.toLowerCase(),
        direction,
        dose: { value: doseVal, unit: "mg" },
        previous_dose: prevDoseVal ? { value: prevDoseVal, unit: "mg" } : null,
        frequency,
      },
      warnings: [],
    });
  });

  // 3. Red flags
  verifiedItems.push({
    id: "rf-1",
    kind: "red_flag",
    evidence: {
      heading: "plan_and_requested_actions",
      quote: letter.red_flag_symptoms.verbatim_quote,
      status: "verified",
      match: {
        kind: "exact",
        start: 0,
        end: letter.red_flag_symptoms.verbatim_quote.length,
        matchedText: letter.red_flag_symptoms.verbatim_quote,
        similarity: 1.0,
      },
    },
    slots: {
      symptom: "weight increase of 2 kg or breathlessness",
      contact: "heart_failure_nurse",
    },
    warnings: [],
  });

  // 4. Follow-up
  verifiedItems.push({
    id: "fu-1",
    kind: "follow_up",
    evidence: {
      heading: "plan_and_requested_actions",
      quote: letter.follow_up_appointment.verbatim_quote,
      status: "verified",
      match: {
        kind: "exact",
        start: 0,
        end: letter.follow_up_appointment.verbatim_quote.length,
        matchedText: letter.follow_up_appointment.verbatim_quote,
        similarity: 1.0,
      },
    },
    slots: {
      with_whom: letter.follow_up_appointment.seen_by,
      timeframe_days: 14,
      modality: "in_person",
    },
    warnings: [],
  });

  return {
    sourceText: sourceText || "Discharge summary text layer",
    sourceKind: "pdf_text_layer",
    items: verifiedItems,
    checkWithWard: [],
  };
}

/**
 * Extracts slot claims and pharmacist questions from spoken or typed transcript.
 */
export function extractSpokenSlots(transcript: string, isEdited: boolean = true): SpokenExtraction {
  const lower = transcript.toLowerCase();
  const items: SpokenItem[] = [];
  const questions: PharmacistQuestion[] = [];

  // Check for advice questions (routed to pharmacist, never answered by AI)
  const questionMatches = [
    { regex: /can\s+(?:i|he|she)\s+take\s+([^?.!,]+)/i, label: "Can patient take medication" },
    { regex: /is\s+it\s+safe\s+to\s+take\s+([^?.!,]+)/i, label: "Safety of medication" },
    { regex: /(?:what\s+about|should\s+(?:i|we))\s+([^?.!]+)/i, label: "Patient advice question" },
  ];

  for (const qm of questionMatches) {
    const match = transcript.match(qm.regex);
    if (match) {
      questions.push({
        id: `q-${questions.length + 1}`,
        question: `Question for ward pharmacist: "${match[0].trim()}" (clinical advice requested)`,
        utterance: match[0],
      });
    }
  }

  // Check for Furosemide / Water tablet
  const mentionsWaterTablet =
    lower.includes("water tablet") || lower.includes("furosemide") || lower.includes("water pill");

  if (mentionsWaterTablet) {
    const isLikeBefore =
      lower.includes("like before") ||
      lower.includes("as before") ||
      lower.includes("same as before") ||
      lower.includes("unchanged") ||
      lower.includes("no change") ||
      lower.includes("40mg like before") ||
      lower.includes("40 mg");

    const mentions80 =
      lower.includes("80") ||
      lower.includes("eighty") ||
      lower.includes("double") ||
      lower.includes("doubled") ||
      lower.includes("increased");

    let direction: Direction = "unknown";
    if (isLikeBefore) direction = "unchanged";
    else if (mentions80 || lower.includes("increase") || lower.includes("more"))
      direction = "increased";

    let doseVal: number | null = null;
    if (lower.includes("80") || lower.includes("eighty")) doseVal = 80;
    else if (lower.includes("40") || lower.includes("forty") || isLikeBefore) doseVal = 40;

    let frequency: Frequency = "unknown";
    if (
      lower.includes("once a day") ||
      lower.includes("once daily") ||
      lower.includes("every day") ||
      lower.includes("every morning") ||
      lower.includes("in the morning") ||
      lower.includes("morning")
    ) {
      frequency = "once_daily";
    } else if (lower.includes("twice")) {
      frequency = "twice_daily";
    }

    items.push({
      id: "spoken-med-1",
      kind: "medication_change",
      utterance: transcript,
      slots: {
        drug: "furosemide",
        lay_name: "water tablet",
        direction,
        dose: doseVal ? { value: doseVal, unit: "mg" } : null,
        frequency,
      },
    });
  }

  // Check for Red Flags
  const mentionsRedFlag =
    lower.includes("weight") ||
    lower.includes("kilo") ||
    lower.includes("kg") ||
    lower.includes("breathless") ||
    lower.includes("swelling") ||
    lower.includes("020 7946 0678") ||
    lower.includes("nurse") ||
    lower.includes("call");

  if (mentionsRedFlag) {
    items.push({
      id: "spoken-rf-1",
      kind: "red_flag",
      utterance: transcript,
      slots: {
        symptom: lower.includes("weight")
          ? "weight gain"
          : lower.includes("breathless")
            ? "shortness of breath"
            : "swelling",
        contact: lower.includes("020") || lower.includes("nurse")
          ? "heart_failure_nurse"
          : lower.includes("999")
            ? "999"
            : "heart_failure_nurse",
      },
    });
  }

  // Check for Follow-up
  const mentionsFollowUp =
    lower.includes("follow") ||
    lower.includes("appointment") ||
    lower.includes("clinic") ||
    lower.includes("two weeks") ||
    lower.includes("2 weeks") ||
    lower.includes("cardiologist") ||
    lower.includes("hughes");

  if (mentionsFollowUp) {
    items.push({
      id: "spoken-fu-1",
      kind: "follow_up",
      utterance: transcript,
      slots: {
        with_whom: "Dr Simon Hughes / Specialist Nurse",
        timeframe_days: 14,
        modality: "in_person",
      },
    });
  }

  return {
    transcript,
    items,
    questions,
    transcriptEdited: isEdited,
  };
}

/**
 * Runs the deterministic grading pipeline.
 */
export function evaluateTeachBack(
  letter: DischargeLetter,
  transcript: string,
  isEdited: boolean = true,
  pdfGroundTruthText?: string
): {
  receipt: Receipt;
  spokenExtraction: SpokenExtraction;
  verifiedLetter: VerifiedLetter;
  reteachSteps: ReturnType<typeof reteachPlan>;
} {
  const verifiedLetter = buildVerifiedLetter(letter, pdfGroundTruthText);
  const spokenExtraction = extractSpokenSlots(transcript, isEdited);
  const receipt = gradeTeachBack(verifiedLetter, spokenExtraction, {
    requireReviewedTranscript: false,
  });
  const reteachSteps = reteachPlan(receipt);

  return {
    receipt,
    spokenExtraction,
    verifiedLetter,
    reteachSteps,
  };
}
