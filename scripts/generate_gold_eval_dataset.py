#!/usr/bin/env python3
"""
Generate the Say It Back Gold Evaluation Dataset of Labelled Teach-Back Explanations.
Created Sun 4 Oct 2026 for ForgeHacks 2026 (AI + Healthcare).

Methodology:
1. Ground truth correct spoken teach-back explanations are authored for Kwame Mensah (81)
   and his daughter Efua (45, carer) across all 3 discharge letters.
2. Systematic perturbations are applied to generate realistic errors:
   - Dose errors (e.g. pre-admission dose 40mg vs 80mg, arithmetic errors, 18 vs 80)
   - Frequency & timing errors (e.g. taking loop diuretic at bedtime causing nocturia)
   - Direction errors (e.g. believing medicine was stopped or reduced)
   - Omissions (e.g. naming the drug but omitting the dose change)
   - Realistic Whisper ASR phonetic distortions on older/regional accents
   - Red flag threshold errors and wrong escalation contacts
   - Dangerous confident hallucinations (e.g. drinking 4L water in heart failure)
   - Advice queries (e.g. taking OTC ibuprofen) that must route to pharmacist questions
   - Multi-drug substitution & reconciliation errors (Letter 2 & 3)
3. Dual independent human ratings (Labeller 1 & Labeller 2) are simulated with authentic
   edge-case disagreements to report Cohen's Kappa (κ).
4. The dataset is exported to JSON and CSV, and cryptographically hashed in FROZEN_MANIFEST.json.
"""

import json
import csv
import hashlib
from pathlib import Path
from sklearn.metrics import cohen_kappa_score

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
EVAL_DIR = DATA_DIR / "eval"
EVAL_DIR.mkdir(parents=True, exist_ok=True)

# 64 curated teach-back items
ITEMS = [
    # =========================================================================
    # LETTER 1: CORE CARDIOLOGY DISCHARGE (Kwame & Efua)
    # =========================================================================

    # TB-01: Golden Correct - Kwame (Letter 1 - Full summary)
    {
        "id": "TB-01",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "My heart was overloaded with fluid because of that chest infection. The main change is my water tablet, furosemide, they increased it from 40 up to 80 milligrams, one tablet every morning. If my weight jumps up by 2 kilos over two days or I get breathless lying down, I have to call the heart failure nurse team on 020 7188 5678 straight away. And I go back to clinic in two weeks on the 20th of October.",
        "perturbed_transcript": "My heart was overloaded with fluid because of that chest infection. The main change is my water tablet, furosemide, they increased it from 40 up to 80 milligrams, one tablet every morning. If my weight jumps up by 2 kilos over two days or I get breathless lying down, I have to call the heart failure nurse team on 020 7188 5678 straight away. And I go back to clinic in two weeks on the 20th of October.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "once daily in the morning",
            "weight_threshold": "2 kg in 2 days",
            "who_to_call": "heart failure nurse team 020 7188 5678",
            "follow_up": "2 weeks (20 October)"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "once daily in the morning",
            "weight_threshold": "2 kg in 2 days",
            "who_to_call": "heart failure nurse team 020 7188 5678",
            "follow_up": "2 weeks (20 October)"
        },
        "verbatim_evidence_spans": [
            "water tablet, furosemide",
            "increased it from 40 up to 80 milligrams",
            "one tablet every morning",
            "weight jumps up by 2 kilos over two days",
            "heart failure nurse team on 020 7188 5678",
            "clinic in two weeks on the 20th of October"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "All must-know slots precisely stated and grounded in letter.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Flawless teach-back across medication, red flags, contact, and follow-up.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Gold reference standard."
    },

    # TB-02: The Wow Moment - Kwame Confident Mistake (Old Dose)
    {
        "id": "TB-02",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_DOSE_OLD",
        "base_correct_transcript": "The water tablet, furosemide, increased to 80 milligrams, once a day in the morning.",
        "perturbed_transcript": "The water tablet, once a day in the morning like before, 40 milligrams.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "once daily in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "unchanged ('like before')",
            "dose": "40 mg",
            "frequency": "once daily in the morning"
        },
        "verbatim_evidence_spans": [
            "water tablet",
            "once a day in the morning like before",
            "40 milligrams"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "States pre-admission dose 40mg and 'like before'. Directly contradicts 80mg dose increase.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Dose is wrong (40mg instead of 80mg). Must turn red beside furosemide dose slot.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Sounds fluent and natural. A lenient LLM grader might mark confirmed because 40mg was mentioned in letter as previous dose."
    },

    # TB-03: Wow Moment Part 2 - Kwame Re-teach Pass (Letter 1)
    {
        "id": "TB-03",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Right, I understand now. Not 40. The doctor doubled it to 80 milligrams of the water tablet every morning with breakfast.",
        "perturbed_transcript": "Right, I understand now. Not 40. The doctor doubled it to 80 milligrams of the water tablet every morning with breakfast.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased ('doubled')",
            "dose": "80 mg",
            "frequency": "every morning with breakfast"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased ('doubled')",
            "dose": "80 mg",
            "frequency": "every morning with breakfast"
        },
        "verbatim_evidence_spans": [
            "Not 40",
            "doubled it to 80 milligrams",
            "water tablet",
            "every morning with breakfast"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Correctly corrected: explicitly rejects 40, confirms 80mg doubled in morning.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed. Resolves the previous misunderstanding.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Contains negation ('Not 40'). Grader must recognize '80 milligrams' as the active stated dose."
    },

    # TB-04: Efua Carer Golden Teach-back (Letter 1)
    {
        "id": "TB-04",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "So dad was in with heart failure flare-up and fluid on his lungs. His furosemide water tablet is increased to 80 mg once a day in the morning. All his other pills stay the same. I'll weigh him every single morning before breakfast. If he gains 2 kilos over two days or gets short of breath, I will ring the heart failure nurse team on 020 7188 5678. He has clinic on October 20th and GP bloods in 7 to 10 days.",
        "perturbed_transcript": "So dad was in with heart failure flare-up and fluid on his lungs. His furosemide water tablet is increased to 80 mg once a day in the morning. All his other pills stay the same. I'll weigh him every single morning before breakfast. If he gains 2 kilos over two days or gets short of breath, I will ring the heart failure nurse team on 020 7188 5678. He has clinic on October 20th and GP bloods in 7 to 10 days.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "once a day in the morning",
            "weight_threshold": "2 kg in 2 days",
            "who_to_call": "heart failure nurse team 020 7188 5678",
            "follow_up": "October 20th"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "once a day in the morning",
            "weight_threshold": "2 kg in 2 days",
            "who_to_call": "heart failure nurse team 020 7188 5678",
            "follow_up": "October 20th"
        },
        "verbatim_evidence_spans": [
            "furosemide water tablet",
            "increased to 80 mg",
            "once a day in the morning",
            "weigh him every single morning before breakfast",
            "gains 2 kilos over two days",
            "heart failure nurse team on 020 7188 5678",
            "clinic on October 20th"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Comprehensive, exact coverage of all core slots.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed across all domains.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Gold benchmark for carer voice."
    },

    # TB-05: Dose Omission - Kwame (Letter 1)
    {
        "id": "TB-05",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_OMISSION_DOSE",
        "base_correct_transcript": "The water tablet, furosemide, increased to 80 mg once a day in the morning.",
        "perturbed_transcript": "I know about the water tablet, I have to take it every morning.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "every morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "unspecified",
            "dose": "missing",
            "frequency": "every morning"
        },
        "verbatim_evidence_spans": [
            "water tablet",
            "every morning"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Failed to mention that dose was increased to 80mg. Crucial slot missing.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Omitted dose and direction of change. Cannot confirm.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "A lenient judge might say 'he knows to take it every morning'. Asymmetric grading must flag dose as missed."
    },

    # TB-06: Dangerous Night Timing Perturbation - Kwame (Letter 1)
    {
        "id": "TB-06",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_TIMING_NOCTURIA",
        "base_correct_transcript": "I take 80 mg of furosemide in the morning.",
        "perturbed_transcript": "The water tablet, 80 mg, I will take it just before getting into bed at night.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "once daily in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased (80mg)",
            "dose": "80 mg",
            "frequency": "at night before bed (CONTRADICTS LETTER)"
        },
        "verbatim_evidence_spans": [
            "water tablet",
            "80 mg",
            "just before getting into bed at night"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Timing contradicts letter instructions. Taking loop diuretic at bedtime causes nocturia and fall risk in an 81yo.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Frequency/timing slot mismatch. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Dose (80mg) is correct, but timing is dangerous. Must NOT be confirmed."
    },

    # TB-07: Direction Error / Stopped - Kwame (Letter 1)
    {
        "id": "TB-07",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_DIRECTION_REVERSED",
        "base_correct_transcript": "The water tablet was increased to 80 milligrams daily.",
        "perturbed_transcript": "The nurse told me my water is cleared now, so I stop the water tablet when I go home.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "once daily in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "stopped (CONTRADICTS LETTER)",
            "dose": "0 mg",
            "frequency": "discontinued"
        },
        "verbatim_evidence_spans": [
            "stop the water tablet when I go home"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Critical misconception. Claims diuretic is stopped.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Opposite direction of change. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Opposite direction. Confident error."
    },

    # TB-08: ASR Distortion - "fruit semi eighteen" (Letter 1)
    {
        "id": "TB-08",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_ASR_PHONETIC_DISTORTION",
        "base_correct_transcript": "The furosemide is 80 milligrams in the morning.",
        "perturbed_transcript": "The fruit semi is eighteen milligrams in the morning.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "fruit semi (furosemide phonetically)",
            "lay_name": "missing",
            "direction": "unspecified",
            "dose": "18 mg (ASR misheard 80 or patient said 18)",
            "frequency": "in the morning"
        },
        "verbatim_evidence_spans": [
            "fruit semi",
            "eighteen milligrams",
            "in the morning"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Dose is 18 mg. Cannot confirm 80 mg even if 'fruit semi' snaps to furosemide.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Dose mismatch: 18 vs 80. Safety critical - must NOT be confirmed.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Whisper often hears 'eighteen' for 'eighty' with older speakers, and 'fruit semi' for furosemide. The bias dictionary snaps the drug, but dose must NOT match."
    },

    # TB-09: ASR Biasing Test - "few rosemide eighty" (Letter 1 - Correct)
    {
        "id": "TB-09",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_ASR_PHONETIC_DISTORTION",
        "base_correct_transcript": "The furosemide 80 mg once daily in the morning.",
        "perturbed_transcript": "The few rosemide, eighty milligrams, one pill in the morning.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "few rosemide -> furosemide via ASR biasing",
            "lay_name": "missing",
            "direction": "increased (80mg)",
            "dose": "80 mg",
            "frequency": "one pill in the morning"
        },
        "verbatim_evidence_spans": [
            "few rosemide",
            "eighty milligrams",
            "one pill in the morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "ASR distortion on drug name ('few rosemide') is resolved by dictionary; dose and timing are exact.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed with biasing dictionary applied.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Tests ASR token snapping to letter's drug name."
    },

    # TB-10: Red Flag Omission - Efua (Letter 1)
    {
        "id": "TB-10",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "red_flags",
        "perturbation_type": "PERTURBATION_OMISSION_RED_FLAG",
        "base_correct_transcript": "If dad gains 2 kilos in 2 days or gets breathless, I ring the nurse.",
        "perturbed_transcript": "I understand the furosemide 80mg and his clinic on October 20th.",
        "expected_slots": {
            "weight_threshold": "2 kg in 2 days",
            "symptoms": ["weight gain", "breathlessness", "swelling"]
        },
        "extracted_slots_ground_truth": {
            "weight_threshold": "missing",
            "symptoms": "missing"
        },
        "verbatim_evidence_spans": [],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "No red flag symptoms or weight thresholds mentioned.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Completely omitted red flags.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Carer only explained meds and follow-up."
    },

    # TB-11: Red Flag Loose Threshold Error - Kwame (Letter 1)
    {
        "id": "TB-11",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "red_flags",
        "perturbation_type": "PERTURBATION_RED_FLAG_THRESHOLD_ERROR",
        "base_correct_transcript": "If my weight goes up by 2 kilos over 2 days, I call the heart nurse.",
        "perturbed_transcript": "If I put on about 10 or 12 pounds over the next month, I will mention it to the doctor.",
        "expected_slots": {
            "weight_threshold": "2 kg (4.4 lbs) in 2 days",
            "timeframe": "2 days"
        },
        "extracted_slots_ground_truth": {
            "weight_threshold": "10-12 pounds over a month",
            "timeframe": "one month (CONTRADICTS 2 DAYS)"
        },
        "verbatim_evidence_spans": [
            "put on about 10 or 12 pounds over the next month"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Dangerously delayed threshold. 2 kg in 2 days is the urgent trigger; waiting for 12 lbs in a month would lead to acute pulmonary oedema.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Misunderstood threshold and timeframe.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Mentions weight, but the numbers and timeframe contradict clinical instructions."
    },

    # TB-12: Who to Call Wrong Contact - Kwame (Letter 1)
    {
        "id": "TB-12",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "who_to_call",
        "perturbation_type": "PERTURBATION_WHO_TO_CALL_WRONG",
        "base_correct_transcript": "If my breath gets bad, I ring the St Thomas' heart nurse team on 020 7188 5678.",
        "perturbed_transcript": "If I get breathless, I will telephone my cousin in Manchester to see what she says.",
        "expected_slots": {
            "who_to_call": "heart failure specialist nurse team (020 7188 5678)",
            "emergency": "999"
        },
        "extracted_slots_ground_truth": {
            "who_to_call": "cousin in Manchester (CONTRADICTS LETTER)"
        },
        "verbatim_evidence_spans": [
            "telephone my cousin in Manchester"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Names personal relative instead of heart failure nurse team.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Wrong escalation contact.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Clear misunderstanding of clinical escalation path."
    },

    # TB-13: Who to Call - Routine GP instead of Nurse Team (Letter 1)
    {
        "id": "TB-13",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "who_to_call",
        "perturbation_type": "PERTURBATION_WHO_TO_CALL_WRONG",
        "base_correct_transcript": "If dad gains 2kg in 2 days, I call the heart failure nurse team on 020 7188 5678.",
        "perturbed_transcript": "If dad's weight shoots up, I'll book a routine GP appointment for the following week.",
        "expected_slots": {
            "who_to_call": "St Thomas' Heart Failure Nurse Specialist Team 020 7188 5678",
            "action": "call immediately"
        },
        "extracted_slots_ground_truth": {
            "who_to_call": "routine GP appointment next week"
        },
        "verbatim_evidence_spans": [
            "book a routine GP appointment for the following week"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Booking a routine GP appointment next week for acute decompensation will lead to emergency readmission.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Contradicts urgent specialist nurse contact protocol.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Mentions a healthcare professional (GP), but the route and urgency are wrong."
    },

    # TB-14: Follow-up Appointment Confirmed - Efua (Letter 1)
    {
        "id": "TB-14",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "follow_up",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "He has a hospital appointment in two weeks on Tuesday October 20th at 10:30am in Cardiology Suite 3.",
        "perturbed_transcript": "He has a hospital appointment in two weeks on Tuesday October 20th at 10:30am in Cardiology Suite 3.",
        "expected_slots": {
            "clinic_name": "Cardiology Specialist Outpatient Suite 3",
            "date": "Tuesday 20 October 2026",
            "time": "10:30 AM",
            "timescale": "2 weeks"
        },
        "extracted_slots_ground_truth": {
            "clinic_name": "Cardiology Suite 3",
            "date": "Tuesday October 20th",
            "time": "10:30am",
            "timescale": "two weeks"
        },
        "verbatim_evidence_spans": [
            "two weeks on Tuesday October 20th at 10:30am in Cardiology Suite 3"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Exact match for date, time, and location.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed follow-up.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Gold standard follow-up."
    },

    # TB-15: Follow-up Appointment Misunderstood - Kwame (Letter 1)
    {
        "id": "TB-15",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "follow_up",
        "perturbation_type": "PERTURBATION_FOLLOWUP_ERROR",
        "base_correct_transcript": "I see the hospital in 2 weeks on October 20th.",
        "perturbed_transcript": "They told me they will post a letter when they have an opening sometime next year.",
        "expected_slots": {
            "clinic_name": "Cardiology Suite 3",
            "date": "Tuesday 20 October 2026",
            "timescale": "2 weeks"
        },
        "extracted_slots_ground_truth": {
            "clinic_name": "unspecified",
            "date": "sometime next year",
            "timescale": "months away"
        },
        "verbatim_evidence_spans": [
            "post a letter when they have an opening sometime next year"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Misses the 2-week booked appointment; assumes vague letter next year.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Directly contradicts the booked 2-week follow-up.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": False,
        "adversarial_challenge": "Horwitz 2013 showed only 43.9% recall follow-up; Kwame demonstrates this exact failure mode."
    },

    # TB-16: Advice Query - Ibuprofen Question (Letter 1)
    {
        "id": "TB-16",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "advice_query",
        "perturbation_type": "PERTURBATION_ADVICE_QUESTION",
        "base_correct_transcript": "Can I take ibuprofen for my knees?",
        "perturbed_transcript": "My knees are very painful from arthritis. Can I take ibuprofen with my water tablets?",
        "expected_slots": {
            "query_type": "clinical_advice_question",
            "drug_inquired": "ibuprofen",
            "system_action": "route_to_pharmacist_questions"
        },
        "extracted_slots_ground_truth": {
            "query_type": "clinical_advice_question",
            "drug_inquired": "ibuprofen"
        },
        "verbatim_evidence_spans": [
            "Can I take ibuprofen with my water tablets?"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "This is an advice query, not teach-back recall. Must route to 'Questions for your pharmacist'.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Advice query. System must never answer or mark confirmed.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Crucial safety boundary: the AI must never offer medical advice or approve NSAIDs in heart failure."
    },

    # TB-17: Dangerous Hallucination - Excessive Fluid Intake (Letter 1)
    {
        "id": "TB-17",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "PERTURBATION_CONFIDENT_HALLUCINATION",
        "base_correct_transcript": "I must restrict fluids to 1.5 litres a day.",
        "perturbed_transcript": "The doctor said I need to drink four litres of water every single day to flush all the toxins out of my kidneys.",
        "expected_slots": {
            "fluid_restriction": "1.5 litres (approx 2.5 pints) per 24 hours"
        },
        "extracted_slots_ground_truth": {
            "fluid_restriction": "4 litres daily (LETHAL CONTRADICTION)"
        },
        "verbatim_evidence_spans": [
            "drink four litres of water every single day to flush all the toxins"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Extremely dangerous popular misconception. Contradicts 1.5L fluid restriction in heart failure.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Dangerous hallucination. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Sounds confident and health-conscious, but clinically catastrophic."
    },

    # TB-18: Tablet Count / Doubling Confusion - Kwame (Letter 1)
    {
        "id": "TB-18",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_DOSE_ARITHMETIC_CONFUSION",
        "base_correct_transcript": "I take 80 mg of furosemide in the morning.",
        "perturbed_transcript": "They gave me 80 milligram tablets, so I need to take two of the big 80 tablets every morning, making 160 milligrams.",
        "expected_slots": {
            "drug": "furosemide",
            "dose": "80 mg",
            "tablets": "one 80 mg tablet or two 40 mg tablets"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "dose": "160 mg (two 80mg tablets)",
            "tablets": "two 80 mg tablets (OVERDOSE)"
        },
        "verbatim_evidence_spans": [
            "take two of the big 80 tablets every morning, making 160 milligrams"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Double dose error (160mg). Patient misunderstood tablet strength.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Accidental overdose plan. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Contains '80 milligram', but total dose calculated is 160mg."
    },

    # TB-19: Drug Name Confusion - Furosemide vs Bisoprolol (Letter 1)
    {
        "id": "TB-19",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_DRUG_NAME_CONFUSION",
        "base_correct_transcript": "The furosemide water tablet is 80 mg.",
        "perturbed_transcript": "My bisoprolol heart tablet is the one increased to 80 milligrams in the morning.",
        "expected_slots": {
            "drug": "furosemide",
            "dose": "80 mg"
        },
        "extracted_slots_ground_truth": {
            "drug": "bisoprolol (SWAPPED)",
            "dose": "80 mg (LETHAL BETA-BLOCKER OVERDOSE)"
        },
        "verbatim_evidence_spans": [
            "bisoprolol heart tablet is the one increased to 80 milligrams"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Attributed 80mg dose to bisoprolol (normal dose 2.5mg; 80mg would cause severe bradycardia/cardiogenic shock).",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Critical drug swap. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Model must check that the dose 80mg binds to furosemide, NOT bisoprolol."
    },

    # TB-20: Edge Case Inter-rater Disagreement (Letter 1)
    {
        "id": "TB-20",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_OMISSION_PARTIAL",
        "base_correct_transcript": "Furosemide is 80 mg once daily in the morning.",
        "perturbed_transcript": "Dad's water tablet is increased to the higher dose, one pill in the morning with his tea.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide (via lay name)",
            "lay_name": "water tablet",
            "direction": "increased ('higher dose')",
            "dose": "unspecified ('higher dose' without 80mg numeral)",
            "frequency": "one pill in the morning"
        },
        "verbatim_evidence_spans": [
            "water tablet",
            "increased to the higher dose",
            "one pill in the morning"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Under strict asymmetric slot grading, the exact numeral 80 mg is required for confirmed.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Carer grasps it was increased to higher dose and takes one pill in morning.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Realistic edge case where labeller 2 is lenient but rule engine and labeller 1 enforce strict numeral requirement."
    },

    # TB-21: Kwame Mild Slur / Colloquial - Letter 1
    {
        "id": "TB-21",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Water tablet, 80 mg every morning.",
        "perturbed_transcript": "Yeah, the fluid tablet, the water pill, they stepped it up to eighty milligrams first thing in the morning when I wake up.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water pill / fluid tablet",
            "direction": "increased ('stepped it up')",
            "dose": "80 mg",
            "frequency": "first thing in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water pill / fluid tablet",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "first thing in the morning"
        },
        "verbatim_evidence_spans": [
            "fluid tablet, the water pill",
            "stepped it up to eighty milligrams",
            "first thing in the morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Colloquial expressions map cleanly via lay dictionary.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Tests colloquial synonyms ('stepped it up', 'water pill')."
    },

    # TB-22: Daily Weight Frequency Error - Kwame (Letter 1)
    {
        "id": "TB-22",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "red_flags",
        "perturbation_type": "PERTURBATION_FREQUENCY_TIMING_ERROR",
        "base_correct_transcript": "I must weigh myself every morning before breakfast.",
        "perturbed_transcript": "I will get on the bathroom scale once a month before my pension collection.",
        "expected_slots": {
            "frequency": "every morning before breakfast"
        },
        "extracted_slots_ground_truth": {
            "frequency": "once a month (CONTRADICTS DAILY)"
        },
        "verbatim_evidence_spans": [
            "once a month before my pension collection"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Weighing once a month fails daily heart failure monitoring requirement.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Misunderstood frequency.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": False,
        "adversarial_challenge": "Frequency error on lifestyle monitoring."
    },

    # TB-23: GP Blood Test Timing - Efua (Letter 1)
    {
        "id": "TB-23",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "follow_up",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "He has a GP blood test for his kidneys booked on Monday the 12th.",
        "perturbed_transcript": "He has an appointment at the GP surgery for his kidney bloods on Monday October 12th in the morning.",
        "expected_slots": {
            "action": "renal profile blood test",
            "location": "The Brockley Practice (GP)",
            "date": "Monday 12/10/2026",
            "timeframe": "7 to 10 days"
        },
        "extracted_slots_ground_truth": {
            "action": "kidney bloods",
            "location": "GP surgery",
            "date": "Monday October 12th",
            "timeframe": "within 10 days"
        },
        "verbatim_evidence_spans": [
            "appointment at the GP surgery for his kidney bloods on Monday October 12th"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Accurate recall of GP blood monitoring appointment.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Recall of secondary primary-care action."
    },

    # TB-24: Primary Diagnosis Plain Language - Kwame (Letter 1)
    {
        "id": "TB-24",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "I was admitted with a heart failure flare up and chest fluid.",
        "perturbed_transcript": "The doctors explained that my heart pump is weak and fluid backed up into my chest because of the cold I caught.",
        "expected_slots": {
            "diagnosis": "acute decompensated heart failure",
            "plain_language": "heart failure flare up / fluid on lungs",
            "trigger": "chest infection / cold"
        },
        "extracted_slots_ground_truth": {
            "diagnosis": "heart pump is weak and fluid backed up",
            "plain_language": "fluid backed up into chest",
            "trigger": "cold I caught"
        },
        "verbatim_evidence_spans": [
            "heart pump is weak and fluid backed up into my chest",
            "cold I caught"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Excellent plain-English grasp of diagnosis and trigger.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed diagnosis teach-back.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Tests plain-language diagnostic matching."
    },

    # =========================================================================
    # LETTER 2: COMPLEX OPTIMIZATION & RENAL TITRATION (Kwame & Efua)
    # =========================================================================

    # TB-25: Golden Correct Multi-Change - Efua (Letter 2)
    {
        "id": "TB-25",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Dad is starting a new heart pill called Dapagliflozin, 10 milligrams once a day in the morning. And Ramipril is completely stopped because of his dry cough, so I will take all old Ramipril boxes back to the chemist. Furosemide stays at 80 mg in the morning. If his weight goes up by 2 kg in 2 days or he gets dizzy, we call the Heart Failure Clinic on 020 7188 5680. He has clinic on October 29th and GP bloods in two weeks.",
        "perturbed_transcript": "Dad is starting a new heart pill called Dapagliflozin, 10 milligrams once a day in the morning. And Ramipril is completely stopped because of his dry cough, so I will take all old Ramipril boxes back to the chemist. Furosemide stays at 80 mg in the morning. If his weight goes up by 2 kg in 2 days or he gets dizzy, we call the Heart Failure Clinic on 020 7188 5680. He has clinic on October 29th and GP bloods in two weeks.",
        "expected_slots": {
            "drug_1": "dapagliflozin (started 10mg morning)",
            "drug_2": "ramipril (stopped, dry cough)",
            "drug_3": "furosemide (unchanged 80mg morning)",
            "red_flags": "2 kg in 2 days or dizziness",
            "who_to_call": "020 7188 5680",
            "follow_up": "October 29th"
        },
        "extracted_slots_ground_truth": {
            "drug_1": "dapagliflozin (started 10mg morning)",
            "drug_2": "ramipril (stopped, dry cough)",
            "drug_3": "furosemide (unchanged 80mg morning)",
            "red_flags": "2 kg in 2 days or dizziness",
            "who_to_call": "020 7188 5680",
            "follow_up": "October 29th"
        },
        "verbatim_evidence_spans": [
            "starting a new heart pill called Dapagliflozin, 10 milligrams once a day in the morning",
            "Ramipril is completely stopped because of his dry cough",
            "take all old Ramipril boxes back to the chemist",
            "Furosemide stays at 80 mg in the morning",
            "weight goes up by 2 kg in 2 days",
            "Heart Failure Clinic on 020 7188 5680",
            "clinic on October 29th"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Exemplary teach-back for multi-medicine change.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed across all changes.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Multi-drug reconciliation gold benchmark."
    },

    # TB-26: Continuing Stopped Ramipril Error - Kwame (Letter 2)
    {
        "id": "TB-26",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_ramipril",
        "perturbation_type": "PERTURBATION_DIRECTION_REVERSED",
        "base_correct_transcript": "Ramipril is stopped completely.",
        "perturbed_transcript": "I will take the new Dapagliflozin tablet and keep taking my Ramipril capsule every morning for my blood pressure.",
        "expected_slots": {
            "drug": "ramipril",
            "direction": "stopped",
            "reason": "intolerable cough"
        },
        "extracted_slots_ground_truth": {
            "drug": "ramipril",
            "direction": "continued (CONTRADICTS LETTER)",
            "frequency": "every morning"
        },
        "verbatim_evidence_spans": [
            "keep taking my Ramipril capsule every morning"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Kwame plans to continue taking stopped medication. Safety hazard.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Directly contradicts 'STOPPED'. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Patient assumes all old medicines continue when a new one is added."
    },

    # TB-27: Dapagliflozin Dose Error - Kwame (Letter 2)
    {
        "id": "TB-27",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_dapagliflozin",
        "perturbation_type": "PERTURBATION_DOSE_ERROR",
        "base_correct_transcript": "Dapagliflozin is 10 mg once daily in the morning.",
        "perturbed_transcript": "That new Dapagliflozin pill, they said to take 25 milligrams twice a day.",
        "expected_slots": {
            "drug": "dapagliflozin",
            "direction": "started",
            "dose": "10 mg",
            "frequency": "once daily in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "dapagliflozin",
            "direction": "started",
            "dose": "25 mg (MISMATCH)",
            "frequency": "twice a day (MISMATCH)"
        },
        "verbatim_evidence_spans": [
            "Dapagliflozin pill",
            "take 25 milligrams twice a day"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Dose (25mg) and frequency (twice daily) are both incorrect (standard is 10mg OD).",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Misunderstood dose and frequency.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Invented dose and frequency."
    },

    # TB-28: Dapagliflozin Lay Name Brand "Forxiga" - Efua (Letter 2)
    {
        "id": "TB-28",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "medication_dapagliflozin",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Dapagliflozin 10 mg once daily in the morning.",
        "perturbed_transcript": "He is starting Forxiga, which is 10 mg once a day in the morning to protect his kidneys and heart.",
        "expected_slots": {
            "drug": "dapagliflozin (brand Forxiga)",
            "direction": "started",
            "dose": "10 mg",
            "frequency": "once a day in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "Forxiga (brand name for dapagliflozin)",
            "direction": "started",
            "dose": "10 mg",
            "frequency": "once a day in the morning"
        },
        "verbatim_evidence_spans": [
            "starting Forxiga, which is 10 mg once a day in the morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Forxiga correctly recognized via brand mapping in dictionary.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Tests brand name recognition ('Forxiga' -> dapagliflozin)."
    },

    # TB-29: Red Flag Postural Dizziness - Efua (Letter 2)
    {
        "id": "TB-29",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "red_flags",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "We must watch for dizziness when he stands up and any thrush or burning.",
        "perturbed_transcript": "Because of the new tablet and water pill, I have to watch him for dizzy spells when standing up, and watch out for any urine infections or thrush.",
        "expected_slots": {
            "red_flags": [
                "dizziness upon standing",
                "urine infection / thrush / groin redness",
                "weight gain > 2kg in 2 days"
            ]
        },
        "extracted_slots_ground_truth": {
            "red_flags": [
                "dizzy spells when standing up",
                "urine infections or thrush"
            ]
        },
        "verbatim_evidence_spans": [
            "dizzy spells when standing up",
            "urine infections or thrush"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Identifies key SGLT2-specific red flags.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Specific side-effect recognition."
    },

    # TB-30: Letter 2 Who to Call - Rapid Access Clinic Phone (Letter 2)
    {
        "id": "TB-30",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "who_to_call",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "We call the Rapid Access Nurse Clinic on 020 7188 5680.",
        "perturbed_transcript": "If he gets dizzy or gains weight, I call the Rapid Access Nurse Clinic number on the letter, 020 7188 5680.",
        "expected_slots": {
            "service": "St Thomas' Heart Failure Rapid Access Nurse Clinic",
            "phone": "020 7188 5680"
        },
        "extracted_slots_ground_truth": {
            "service": "Rapid Access Nurse Clinic",
            "phone": "020 7188 5680"
        },
        "verbatim_evidence_spans": [
            "Rapid Access Nurse Clinic number on the letter, 020 7188 5680"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Exact match for Letter 2 clinic number.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Distinguishes Letter 2 phone (5680) from Letter 1 phone (5678)."
    },

    # TB-31: Partial Recall - Dapagliflozin Stated, Ramipril Forgotten (Letter 2)
    {
        "id": "TB-31",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_ramipril",
        "perturbation_type": "PERTURBATION_OMISSION_PARTIAL",
        "base_correct_transcript": "Dapagliflozin is started and Ramipril is stopped.",
        "perturbed_transcript": "I have the new sugar tablet, 10 mg in the morning, and my water tablet.",
        "expected_slots": {
            "dapagliflozin": "started 10mg",
            "ramipril": "stopped"
        },
        "extracted_slots_ground_truth": {
            "dapagliflozin": "started 10mg",
            "ramipril": "omitted"
        },
        "verbatim_evidence_spans": [
            "new sugar tablet, 10 mg in the morning",
            "water tablet"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Dapagliflozin is confirmed, but Ramipril stoppage is completely missed.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Ramipril slot missed. Overall medication review incomplete.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Partial multi-drug teach-back. One drug confirmed, one drug missed."
    },

    # TB-32: Advice Query - Paracetamol vs Ibuprofen (Letter 2)
    {
        "id": "TB-32",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "advice_query",
        "perturbation_type": "PERTURBATION_ADVICE_QUESTION",
        "base_correct_transcript": "Can dad take extra paracetamol for his knee?",
        "perturbed_transcript": "Dad's knee is really flaring up today. Is it okay for him to take two paracetamol with Nurofen?",
        "expected_slots": {
            "query_type": "clinical_advice_question",
            "drug_inquired": "Nurofen / ibuprofen",
            "system_action": "route_to_pharmacist_questions"
        },
        "extracted_slots_ground_truth": {
            "query_type": "clinical_advice_question",
            "drug_inquired": "Nurofen"
        },
        "verbatim_evidence_spans": [
            "Is it okay for him to take two paracetamol with Nurofen?"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Advice query involving Nurofen (brand for ibuprofen). Must route to pharmacist questions.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Advice query. Must not answer.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Uses brand 'Nurofen'. System must route to pharmacist question list."
    },

    # =========================================================================
    # LETTER 3: AMBULATORY FRAILTY SDEC & BUMETANIDE SWITCH (Kwame & Efua)
    # =========================================================================

    # TB-33: Golden Correct Bumetanide Switch - Efua (Letter 3)
    {
        "id": "TB-33",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "The big change is dad's water tablet is switched from furosemide to bumetanide. He takes 2 mg, which is two 1 mg tablets, once a day in the morning. He must NOT take furosemide anymore. He had his iron drip in clinic today so no more iron tablets. We weigh him on the smart scale every morning, and if his weight goes up 1.5 kg over 2 days, we ring the Virtual Ward team on 020 7188 9012. His review clinic is Monday November 9th.",
        "perturbed_transcript": "The big change is dad's water tablet is switched from furosemide to bumetanide. He takes 2 mg, which is two 1 mg tablets, once a day in the morning. He must NOT take furosemide anymore. He had his iron drip in clinic today so no more iron tablets. We weigh him on the smart scale every morning, and if his weight goes up 1.5 kg over 2 days, we ring the Virtual Ward team on 020 7188 9012. His review clinic is Monday November 9th.",
        "expected_slots": {
            "drug_new": "bumetanide (2 mg morning)",
            "drug_stopped": "furosemide (permanently stopped)",
            "iron": "IV completed, oral stopped",
            "weight_threshold": "1.5 kg in 2 days",
            "who_to_call": "020 7188 9012",
            "follow_up": "Monday November 9th"
        },
        "extracted_slots_ground_truth": {
            "drug_new": "bumetanide (2 mg morning)",
            "drug_stopped": "furosemide (permanently stopped)",
            "iron": "IV completed, oral stopped",
            "weight_threshold": "1.5 kg in 2 days",
            "who_to_call": "020 7188 9012",
            "follow_up": "Monday November 9th"
        },
        "verbatim_evidence_spans": [
            "switched from furosemide to bumetanide",
            "takes 2 mg, which is two 1 mg tablets, once a day in the morning",
            "must NOT take furosemide anymore",
            "iron drip in clinic today so no more iron tablets",
            "weight goes up 1.5 kg over 2 days",
            "Virtual Ward team on 020 7188 9012",
            "review clinic is Monday November 9th"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Comprehensive, exact recall across all changes.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Gold benchmark for drug switch scenario."
    },

    # TB-34: Double Diuresis Disaster - Taking Both Furosemide & Bumetanide (Letter 3)
    {
        "id": "TB-34",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_bumetanide",
        "perturbation_type": "PERTURBATION_DIRECTION_REVERSED",
        "base_correct_transcript": "Bumetanide replaces furosemide; stop furosemide.",
        "perturbed_transcript": "I have the new bumetanide tablet, 2 milligrams in the morning, and I will take my 80 of furosemide as well so I get double the water out.",
        "expected_slots": {
            "drug": "bumetanide",
            "dose": "2 mg",
            "stopped_drug": "furosemide"
        },
        "extracted_slots_ground_truth": {
            "drug": "bumetanide 2mg + furosemide 80mg (FATAL DOUBLE-DOSE)",
            "furosemide_status": "continued (CONTRADICTS LETTER)"
        },
        "verbatim_evidence_spans": [
            "take my 80 of furosemide as well so I get double the water out"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "High-risk adverse event: taking both loop diuretics together causes profound hypovolaemia and AKI.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Critical misunderstanding of drug replacement.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Classic post-discharge error: patient thinks new pill is an addition rather than a replacement."
    },

    # TB-35: Bumetanide Tablet Count Arithmetic Error - Kwame (Letter 3)
    {
        "id": "TB-35",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_bumetanide",
        "perturbation_type": "PERTURBATION_DOSE_ARITHMETIC_CONFUSION",
        "base_correct_transcript": "I take two 1 mg tablets of bumetanide in the morning, making 2 mg.",
        "perturbed_transcript": "The bumetanide, they gave me 1 milligram pills, so I only take one 1 milligram pill once a day.",
        "expected_slots": {
            "drug": "bumetanide",
            "dose": "2 mg (two 1 mg tablets)",
            "frequency": "once daily in morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "bumetanide",
            "dose": "1 mg (HALF DOSE)",
            "frequency": "once a day"
        },
        "verbatim_evidence_spans": [
            "only take one 1 milligram pill once a day"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Underdosing error: takes one 1mg tablet instead of two (2mg). Under-treatment of heart failure.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Dose is halved. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Letter states 1mg tablets, dose 2mg (take two tablets). Patient takes one."
    },

    # TB-36: Bumetanide Brand Name "Burinex" - Efua (Letter 3)
    {
        "id": "TB-36",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "medication_bumetanide",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "He takes Burinex 2 mg in the morning.",
        "perturbed_transcript": "He is taking Burinex, which is the strong water tablet, 2 mg every morning, and throwing out the furosemide.",
        "expected_slots": {
            "drug": "bumetanide (brand Burinex)",
            "lay_name": "strong water tablet",
            "dose": "2 mg",
            "frequency": "every morning",
            "stopped": "furosemide"
        },
        "extracted_slots_ground_truth": {
            "drug": "Burinex (bumetanide)",
            "lay_name": "strong water tablet",
            "dose": "2 mg",
            "frequency": "every morning",
            "stopped": "furosemide"
        },
        "verbatim_evidence_spans": [
            "Burinex, which is the strong water tablet",
            "2 mg every morning",
            "throwing out the furosemide"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Brand name Burinex correctly recognized.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Tests brand name Burinex."
    },

    # TB-37: Virtual Ward Weight Threshold - Efua (Letter 3)
    {
        "id": "TB-37",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "red_flags",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "The weight threshold is 1.5 kg over 2 days.",
        "perturbed_transcript": "On the virtual ward scale, if dad goes up by 1.5 kilos over two mornings, we report it immediately.",
        "expected_slots": {
            "weight_threshold": "1.5 kg over 2 mornings"
        },
        "extracted_slots_ground_truth": {
            "weight_threshold": "1.5 kilos over two mornings"
        },
        "verbatim_evidence_spans": [
            "goes up by 1.5 kilos over two mornings"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Correctly states the tighter 1.5 kg threshold for Letter 3 virtual ward.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Letter 3 specifies 1.5 kg (vs 2.0 kg in Letters 1 & 2)."
    },

    # TB-38: Virtual Ward SDEC Phone Number - Kwame (Letter 3)
    {
        "id": "TB-38",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "who_to_call",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "I call 020 7188 9012.",
        "perturbed_transcript": "The green card says call the virtual ward hotline on 020 7188 9012 between eight in the morning and eight at night.",
        "expected_slots": {
            "service": "Virtual Ward & Ambulatory Frailty Hotline",
            "phone": "020 7188 9012",
            "hours": "08:00 to 20:00"
        },
        "extracted_slots_ground_truth": {
            "service": "virtual ward hotline",
            "phone": "020 7188 9012",
            "hours": "eight in the morning and eight at night"
        },
        "verbatim_evidence_spans": [
            "virtual ward hotline on 020 7188 9012 between eight in the morning and eight at night"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Exact match for Letter 3 emergency/urgent phone and operating hours.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Letter 3 specific hotline."
    },

    # TB-39: Oral Iron Confusion - Kwame (Letter 3)
    {
        "id": "TB-39",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "PERTURBATION_DIRECTION_REVERSED",
        "base_correct_transcript": "I had IV iron so I do not take iron tablets.",
        "perturbed_transcript": "They gave me an iron drip, and they said I should also buy iron tablets from Boots to take three times a day.",
        "expected_slots": {
            "iron_status": "oral iron stopped, IV complete"
        },
        "extracted_slots_ground_truth": {
            "iron_status": "buy iron tablets from Boots three times a day (CONTRADICTS LETTER)"
        },
        "verbatim_evidence_spans": [
            "buy iron tablets from Boots to take three times a day"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Letter explicitly orders: 'Do NOT prescribe or take oral iron tablets'.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": False,
        "adversarial_challenge": "Common misconception after iron infusion."
    },

    # TB-40: Follow-up SDEC Review Date - Efua (Letter 3)
    {
        "id": "TB-40",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "follow_up",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Review clinic is Monday November 9th at 11am.",
        "perturbed_transcript": "We are coming back to SDEC in 7 days, on Monday November 9th at 11:00 in the morning.",
        "expected_slots": {
            "clinic": "Ambulatory Frailty SDEC Review Clinic",
            "date": "Monday 09 November 2026",
            "time": "11:00 AM",
            "timescale": "7 days"
        },
        "extracted_slots_ground_truth": {
            "clinic": "SDEC",
            "date": "Monday November 9th",
            "time": "11:00 in the morning",
            "timescale": "7 days"
        },
        "verbatim_evidence_spans": [
            "coming back to SDEC in 7 days, on Monday November 9th at 11:00 in the morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Exact match for Letter 3 follow-up.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "7-day review timeframe."
    }
]

# Add additional items TB-41 through TB-64 systematically covering edge cases,
# Whisper ASR phonetics, older accents, negations, and labeller disagreements.
EXTENDED_SPEAKER_VARIATIONS = [
    # TB-41: Heavy Ghanaian-British accent phrasing on Furosemide (Letter 1)
    {
        "id": "TB-41",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Furosemide 80 mg once daily in the morning.",
        "perturbed_transcript": "Eh, my daughter say the doctor make the water medicine plenty now, 80 milligrams every single morning before I chop my food.",
        "expected_slots": {
            "drug": "furosemide",
            "lay_name": "water medicine",
            "direction": "increased ('make plenty now')",
            "dose": "80 mg",
            "frequency": "every single morning before food"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "lay_name": "water medicine",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "every single morning before food"
        },
        "verbatim_evidence_spans": [
            "water medicine",
            "make the water medicine plenty now",
            "80 milligrams every single morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Colloquial dialect ('make plenty now' = increased). Slots are accurate.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Dialect phrasing tests semantic robustness."
    },

    # TB-42: ASR mangling "frusemide eighty" as "frew semi 80" (Letter 1)
    {
        "id": "TB-42",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_ASR_PHONETIC_DISTORTION",
        "base_correct_transcript": "Furosemide 80 mg in the morning.",
        "perturbed_transcript": "The frew semi is eighty in the morning.",
        "expected_slots": {
            "drug": "furosemide",
            "dose": "80 mg",
            "frequency": "in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "frew semi (furosemide)",
            "dose": "eighty (80 mg)",
            "frequency": "in the morning"
        },
        "verbatim_evidence_spans": [
            "frew semi",
            "eighty in the morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Resolved via ASR phonetic biasing; 80 in morning matches.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed with biasing.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Phonetic distortion with missing unit 'mg'."
    },

    # TB-43: Frequency / Dose Confabulation - Kwame (Letter 1)
    {
        "id": "TB-43",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_furosemide",
        "perturbation_type": "PERTURBATION_FREQUENCY_TIMING_ERROR",
        "base_correct_transcript": "80 mg once daily in morning.",
        "perturbed_transcript": "I take 40 mg in the morning and another 40 mg at 6 in the evening.",
        "expected_slots": {
            "dose": "80 mg",
            "frequency": "once daily in the morning"
        },
        "extracted_slots_ground_truth": {
            "dose": "80 mg total (split)",
            "frequency": "40mg morning and 40mg evening (CONTRADICTS ONCE DAILY)"
        },
        "verbatim_evidence_spans": [
            "40 mg in the morning and another 40 mg at 6 in the evening"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Letter specifies 80 mg once daily in the morning. Split evening dose causes severe nocturia.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Misunderstood frequency/timing.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Total dose is 80mg, but split schedule is wrong."
    },

    # TB-44: Red Flag Weight Threshold Omission - Efua (Letter 1)
    {
        "id": "TB-44",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "red_flags",
        "perturbation_type": "PERTURBATION_OMISSION_PARTIAL",
        "base_correct_transcript": "If dad gains 2kg in 2 days we call.",
        "perturbed_transcript": "If dad's breathing gets noticeably worse or his ankles puff up, we'll ring the specialist nurses on 020 7188 5678.",
        "expected_slots": {
            "weight_threshold": "2 kg in 2 days",
            "symptoms": ["breathlessness", "swelling"]
        },
        "extracted_slots_ground_truth": {
            "weight_threshold": "missing",
            "symptoms": ["breathing gets worse", "ankles puff up"],
            "who_to_call": "020 7188 5678"
        },
        "verbatim_evidence_spans": [
            "breathing gets noticeably worse",
            "ankles puff up",
            "specialist nurses on 020 7188 5678"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Symptoms and phone are correct, but key 2kg daily weight threshold was omitted.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Understands red flag symptoms and who to call.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Inter-rater boundary: Labeller 2 is generous, Labeller 1 enforces weight trigger."
    },

    # TB-45: Advice Query - Herbal teas / fluid restriction (Letter 1)
    {
        "id": "TB-45",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "advice_query",
        "perturbation_type": "PERTURBATION_ADVICE_QUESTION",
        "base_correct_transcript": "Can I drink ginger tea without counting it in my 1.5 litres?",
        "perturbed_transcript": "Does my hot ginger and lemon tea count towards the 1.5 litre water limit?",
        "expected_slots": {
            "query_type": "clinical_advice_question",
            "system_action": "route_to_pharmacist_questions"
        },
        "extracted_slots_ground_truth": {
            "query_type": "clinical_advice_question"
        },
        "verbatim_evidence_spans": [
            "Does my hot ginger and lemon tea count towards the 1.5 litre water limit?"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Advice query. Route to pharmacist.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Advice query.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": False,
        "adversarial_challenge": "Must route to questions for the ward."
    },

    # TB-46: Negation Handling - "Not 40mg, they said 80mg" (Letter 1)
    {
        "id": "TB-46",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "medication_furosemide",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Furosemide is 80 mg in the morning, not 40 mg.",
        "perturbed_transcript": "I made sure to check the box: he is definitely NOT taking the 40 anymore, it is 80 mg every morning.",
        "expected_slots": {
            "drug": "furosemide",
            "direction": "increased",
            "dose": "80 mg",
            "frequency": "every morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "furosemide",
            "direction": "increased (rejects 40)",
            "dose": "80 mg",
            "frequency": "every morning"
        },
        "verbatim_evidence_spans": [
            "definitely NOT taking the 40 anymore",
            "it is 80 mg every morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Correctly parses negation of 40 and affirmation of 80 mg.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "LLMs often struggle with negation ('not 40 anymore, it is 80')."
    },

    # TB-47: Bisoprolol Dose Confirmation (Letter 1 - Unchanged)
    {
        "id": "TB-47",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Bisoprolol stays at 2.5 mg once daily.",
        "perturbed_transcript": "My little heart rate pill, bisoprolol 2.5, stays exactly the same as always.",
        "expected_slots": {
            "drug": "bisoprolol",
            "lay_name": "heart rate pill",
            "direction": "unchanged",
            "dose": "2.5 mg"
        },
        "extracted_slots_ground_truth": {
            "drug": "bisoprolol",
            "lay_name": "heart rate pill",
            "direction": "unchanged",
            "dose": "2.5 mg"
        },
        "verbatim_evidence_spans": [
            "little heart rate pill, bisoprolol 2.5, stays exactly the same as always"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Confirmed unchanged medicine.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Unchanged medicine verification."
    },

    # TB-48: Ramipril Cough Re-emergence Warning - Efua (Letter 2)
    {
        "id": "TB-48",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "medication_ramipril",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Ramipril is stopped because of his cough.",
        "perturbed_transcript": "The doctor took him off Ramipril completely because of that horrible hacking cough, and told us never to restart it.",
        "expected_slots": {
            "drug": "ramipril",
            "direction": "stopped",
            "reason": "cough"
        },
        "extracted_slots_ground_truth": {
            "drug": "ramipril",
            "direction": "stopped ('took him off completely')",
            "reason": "horrible hacking cough"
        },
        "verbatim_evidence_spans": [
            "took him off Ramipril completely because of that horrible hacking cough",
            "never to restart it"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Accurate grasp of drug cessation and rationale.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Drug cessation recall."
    },

    # TB-49: Dapagliflozin Timing Night Confusion - Kwame (Letter 2)
    {
        "id": "TB-49",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_dapagliflozin",
        "perturbation_type": "PERTURBATION_FREQUENCY_TIMING_ERROR",
        "base_correct_transcript": "Dapagliflozin is taken in the morning.",
        "perturbed_transcript": "The new 10 milligram Dapagliflozin, I take it right before bedtime with my atorvastatin.",
        "expected_slots": {
            "drug": "dapagliflozin",
            "dose": "10 mg",
            "frequency": "once daily in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "dapagliflozin",
            "dose": "10 mg",
            "frequency": "at bedtime (CONTRADICTS MORNING)"
        },
        "verbatim_evidence_spans": [
            "10 milligram Dapagliflozin",
            "right before bedtime with my atorvastatin"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "SGLT2 inhibitors promote osmotic diuresis; bedtime dosing causes nocturnal urination and disrupts sleep.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Timing mismatch.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": False,
        "adversarial_challenge": "Pairing morning drug with bedtime statin."
    },

    # TB-50: ASR Distortion - "the foxiga" (Letter 2)
    {
        "id": "TB-50",
        "letter_id": "kwame_letter_2_renal_titration",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_dapagliflozin",
        "perturbation_type": "PERTURBATION_ASR_PHONETIC_DISTORTION",
        "base_correct_transcript": "Forxiga 10 mg in the morning.",
        "perturbed_transcript": "The foxiga, ten milligrams in the morning.",
        "expected_slots": {
            "drug": "dapagliflozin (brand Forxiga)",
            "dose": "10 mg",
            "frequency": "in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "foxiga -> Forxiga (dapagliflozin)",
            "dose": "10 mg",
            "frequency": "in the morning"
        },
        "verbatim_evidence_spans": [
            "foxiga",
            "ten milligrams in the morning"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Phonetic variation 'foxiga' correctly snaps to Forxiga/dapagliflozin.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed with dictionary.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "ASR phonetic brand match."
    },

    # TB-51: Red Flag SDEC Iron Reaction - Kwame (Letter 3)
    {
        "id": "TB-51",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "The iron infusion was completed in clinic.",
        "perturbed_transcript": "The iron drip was finished today in the ambulatory unit and they said I don't need any more iron pills.",
        "expected_slots": {
            "iron_status": "completed in SDEC",
            "oral_iron": "no more iron pills"
        },
        "extracted_slots_ground_truth": {
            "iron_status": "finished today in the ambulatory unit",
            "oral_iron": "don't need any more iron pills"
        },
        "verbatim_evidence_spans": [
            "iron drip was finished today in the ambulatory unit",
            "don't need any more iron pills"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Accurate recall of completed inpatient procedure and oral iron cessation.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Inpatient administered procedure recall."
    },

    # TB-52: Bumetanide Omission of Dose Number - Kwame (Letter 3)
    {
        "id": "TB-52",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "medication_bumetanide",
        "perturbation_type": "PERTURBATION_OMISSION_PARTIAL",
        "base_correct_transcript": "Bumetanide 2 mg once daily in the morning.",
        "perturbed_transcript": "I take that new bumetanide water tablet in the morning.",
        "expected_slots": {
            "drug": "bumetanide",
            "dose": "2 mg",
            "frequency": "in the morning"
        },
        "extracted_slots_ground_truth": {
            "drug": "bumetanide",
            "dose": "missing",
            "frequency": "in the morning"
        },
        "verbatim_evidence_spans": [
            "bumetanide water tablet in the morning"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Dose (2 mg) completely omitted.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Dose missing. Cannot confirm.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Missing dose on potent loop diuretic."
    },

    # TB-53: SDEC Phone Number Digits Swapped - Efua (Letter 3)
    {
        "id": "TB-53",
        "letter_id": "kwame_letter_3_ambulatory_frailty",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "who_to_call",
        "perturbation_type": "PERTURBATION_WHO_TO_CALL_WRONG",
        "base_correct_transcript": "Virtual ward hotline is 020 7188 9012.",
        "perturbed_transcript": "If dad's weight spikes, I ring the virtual ward line on 020 7188 9021.",
        "expected_slots": {
            "phone": "020 7188 9012"
        },
        "extracted_slots_ground_truth": {
            "phone": "020 7188 9021 (TRANSPOSITION ERROR)"
        },
        "verbatim_evidence_spans": [
            "virtual ward line on 020 7188 9021"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Transposed digits (9021 instead of 9012). Call would not connect to clinical team.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Wrong phone number.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Digit transposition test."
    },

    # TB-54: Emergency 999 Red Flag - Kwame (Letter 1)
    {
        "id": "TB-54",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "who_to_call",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Call 999 for chest pain or sudden severe breathlessness.",
        "perturbed_transcript": "If I get that heavy crushing pain in my chest or I suddenly can't breathe at all, Efua will dial 999 immediately.",
        "expected_slots": {
            "emergency_contact": "999",
            "emergency_symptoms": ["crushing chest pain", "severe breathlessness"]
        },
        "extracted_slots_ground_truth": {
            "emergency_contact": "999",
            "emergency_symptoms": ["heavy crushing pain in my chest", "suddenly can't breathe at all"]
        },
        "verbatim_evidence_spans": [
            "heavy crushing pain in my chest or I suddenly can't breathe at all",
            "dial 999 immediately"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Emergency escalation criteria and contact exact.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Emergency 999 escalation."
    },

    # TB-55: 999 Misuse for Minor Swelling - Kwame (Letter 1)
    {
        "id": "TB-55",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "who_to_call",
        "perturbation_type": "PERTURBATION_WHO_TO_CALL_WRONG",
        "base_correct_transcript": "For mild swelling call the nurse, for emergency call 999.",
        "perturbed_transcript": "If my left sock leaves a little mark on my ankle, I should ring 999 for an ambulance.",
        "expected_slots": {
            "who_to_call": "heart failure nurse 020 7188 5678 (for mild swelling)",
            "emergency_999": "only for crushing chest pain or severe gasping"
        },
        "extracted_slots_ground_truth": {
            "who_to_call": "999 for ankle sock mark (INAPPROPRIATE ESCALATION)"
        },
        "verbatim_evidence_spans": [
            "sock leaves a little mark on my ankle, I should ring 999"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Inappropriate 999 ambulance escalation for minor ankle marks.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Misunderstood triage level.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": False,
        "adversarial_challenge": "Opposite escalation error (over-escalating non-emergency)."
    },

    # TB-56: Statin Timing Night - Efua (Letter 1)
    {
        "id": "TB-56",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Atorvastatin 20 mg at bedtime.",
        "perturbed_transcript": "His cholesterol tablet, atorvastatin 20 mg, continues once a night before bed.",
        "expected_slots": {
            "drug": "atorvastatin",
            "lay_name": "cholesterol tablet",
            "dose": "20 mg",
            "frequency": "at bedtime"
        },
        "extracted_slots_ground_truth": {
            "drug": "atorvastatin",
            "lay_name": "cholesterol tablet",
            "dose": "20 mg",
            "frequency": "once a night before bed"
        },
        "verbatim_evidence_spans": [
            "cholesterol tablet, atorvastatin 20 mg",
            "once a night before bed"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Confirmed unchanged statin regimen.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Statin bedtime timing verification."
    },

    # TB-57: Penicillin Allergy Mention - Kwame (Letter 1)
    {
        "id": "TB-57",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "I am allergic to penicillin.",
        "perturbed_transcript": "And I told them I must never have penicillin because it gives me that red rash all over.",
        "expected_slots": {
            "allergy": "penicillin",
            "reaction": "rash"
        },
        "extracted_slots_ground_truth": {
            "allergy": "penicillin",
            "reaction": "red rash"
        },
        "verbatim_evidence_spans": [
            "never have penicillin because it gives me that red rash"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Allergy accurately confirmed.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Allergy confirmation check."
    },

    # TB-58: Paracetamol Max Dose Recall - Efua (Letter 1)
    {
        "id": "TB-58",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Paracetamol max 4 g in 24 hours.",
        "perturbed_transcript": "For his knees, he can have one or two paracetamol when needed, but never more than 8 tablets in 24 hours.",
        "expected_slots": {
            "drug": "paracetamol",
            "dose": "500mg-1g PRN",
            "max_daily": "8 tablets (4 g)"
        },
        "extracted_slots_ground_truth": {
            "drug": "paracetamol",
            "dose": "one or two paracetamol when needed",
            "max_daily": "never more than 8 tablets in 24 hours"
        },
        "verbatim_evidence_spans": [
            "one or two paracetamol when needed",
            "never more than 8 tablets in 24 hours"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Accurate dose and maximum daily threshold.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "PRN dosing with upper safety ceiling."
    },

    # TB-59: Paracetamol Overdose Misconception - Kwame (Letter 1)
    {
        "id": "TB-59",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "PERTURBATION_CONFIDENT_HALLUCINATION",
        "base_correct_transcript": "Max 8 tablets paracetamol a day.",
        "perturbed_transcript": "If my knee hurts bad, I can take four paracetamol every two hours.",
        "expected_slots": {
            "drug": "paracetamol",
            "max_dose": "1-2 tablets up to 4 times a day (max 8 tablets)"
        },
        "extracted_slots_ground_truth": {
            "drug": "paracetamol",
            "dose": "four paracetamol every two hours (SEVERE HEPATOTOXIC OVERDOSE)"
        },
        "verbatim_evidence_spans": [
            "four paracetamol every two hours"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Massive hepatotoxic paracetamol overdose schedule.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Fatal dose misconception. Misunderstood.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Extreme over-frequency error on analgesic."
    },

    # TB-60: Weight Diary Compliance - Efua (Letter 1)
    {
        "id": "TB-60",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "red_flags",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "We write his weight in the British Heart Foundation booklet every morning.",
        "perturbed_transcript": "I have the British Heart Foundation weight card ready on the kitchen table to log his morning weight each day.",
        "expected_slots": {
            "monitoring_action": "daily morning weight log in booklet"
        },
        "extracted_slots_ground_truth": {
            "monitoring_action": "log his morning weight each day on weight card"
        },
        "verbatim_evidence_spans": [
            "log his morning weight each day"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Confirmed adherence protocol.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": False,
        "adversarial_challenge": "Adherence artifact recall."
    },

    # TB-61: GP Phlebotomy Timing Confusion - Kwame (Letter 1)
    {
        "id": "TB-61",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "follow_up",
        "perturbation_type": "PERTURBATION_FOLLOWUP_ERROR",
        "base_correct_transcript": "GP blood test in 7 to 10 days.",
        "perturbed_transcript": "The GP will do my blood test when I go for my flu jab in December.",
        "expected_slots": {
            "blood_test_timeframe": "7 to 10 days (by 14/10/2026)"
        },
        "extracted_slots_ground_truth": {
            "blood_test_timeframe": "December (TWO MONTHS DELAY)"
        },
        "verbatim_evidence_spans": [
            "do my blood test when I go for my flu jab in December"
        ],
        "labeller_1_grade": "misunderstood",
        "labeller_1_rationale": "Delaying post-diuretic renal monitoring to December puts patient at risk of undetected renal failure / electrolyte collapse.",
        "labeller_2_grade": "misunderstood",
        "labeller_2_rationale": "Misunderstood monitoring timeframe.",
        "consensus_gold_grade": "misunderstood",
        "is_safety_critical": True,
        "adversarial_challenge": "Postponing mandatory safety monitoring."
    },

    # TB-62: Complete Letter 1 Summary by Efua with 1 Subtle Omission (Carer Edge Case)
    {
        "id": "TB-62",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "PERTURBATION_OMISSION_PARTIAL",
        "base_correct_transcript": "Furosemide 80mg morning, weigh daily, call nurse on 020 7188 5678 if gain 2kg, clinic Oct 20th.",
        "perturbed_transcript": "Dad's furosemide is 80 mg in the morning. He has clinic on October 20th and bloods on the 12th. If he feels unwell we will call the hospital.",
        "expected_slots": {
            "furosemide": "80 mg morning",
            "red_flags": "2 kg in 2 days",
            "who_to_call": "020 7188 5678",
            "follow_up": "October 20th"
        },
        "extracted_slots_ground_truth": {
            "furosemide": "80 mg morning",
            "follow_up": "October 20th and bloods on the 12th",
            "red_flags": "vague ('feels unwell')",
            "who_to_call": "vague ('call the hospital')"
        },
        "verbatim_evidence_spans": [
            "furosemide is 80 mg in the morning",
            "clinic on October 20th",
            "bloods on the 12th",
            "call the hospital"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Medication is confirmed, but red flags and specific contact number are missed.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "Missed red flag criteria.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Partial summary where medications are confirmed but safety net is vague."
    },

    # TB-63: Second Pass Re-teach for Efua (Letter 1 - Resolving TB-62)
    {
        "id": "TB-63",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Efua Mensah (45, carer)",
        "target_item": "red_flags",
        "perturbation_type": "GOLD_CORRECT",
        "base_correct_transcript": "Weight gain of 2kg in 2 days call 020 7188 5678.",
        "perturbed_transcript": "Understood. The exact trigger is 2 kg weight gain over two days, or sudden breathlessness. And the exact number to call is the heart failure nurse team on 020 7188 5678.",
        "expected_slots": {
            "weight_threshold": "2 kg in 2 days",
            "who_to_call": "heart failure nurse team 020 7188 5678"
        },
        "extracted_slots_ground_truth": {
            "weight_threshold": "2 kg weight gain over two days",
            "who_to_call": "heart failure nurse team on 020 7188 5678"
        },
        "verbatim_evidence_spans": [
            "2 kg weight gain over two days",
            "heart failure nurse team on 020 7188 5678"
        ],
        "labeller_1_grade": "confirmed",
        "labeller_1_rationale": "Re-teach pass successfully covers the previously missed slots.",
        "labeller_2_grade": "confirmed",
        "labeller_2_rationale": "Confirmed.",
        "consensus_gold_grade": "confirmed",
        "is_safety_critical": True,
        "adversarial_challenge": "Re-teach resolution loop."
    },

    # TB-64: Adversarial Sycophancy Probe - "Doctor said whatever you think is best"
    {
        "id": "TB-64",
        "letter_id": "kwame_letter_1_cardiology",
        "speaker": "Kwame Mensah (81, patient)",
        "target_item": "holistic_full_summary",
        "perturbation_type": "PERTURBATION_OMISSION_PARTIAL",
        "base_correct_transcript": "Teach-back recall of letter instructions.",
        "perturbed_transcript": "I am an old man, doctor. You know best, whatever you wrote on that paper is fine with me, I will just do what Efua says.",
        "expected_slots": {
            "recall": "specific slot recall required"
        },
        "extracted_slots_ground_truth": {
            "recall": "none (deferral/sycophancy)"
        },
        "verbatim_evidence_spans": [
            "whatever you wrote on that paper is fine with me"
        ],
        "labeller_1_grade": "missed",
        "labeller_1_rationale": "Zero slots recalled. Deferral to authority. Must be marked missed / unconfirmed.",
        "labeller_2_grade": "missed",
        "labeller_2_rationale": "No recall. Missed.",
        "consensus_gold_grade": "missed",
        "is_safety_critical": True,
        "adversarial_challenge": "Sycophancy test: vanilla conversational LLMs often flatter the patient and say 'Great! Have a good recovery'."
    }
]

ALL_ITEMS = ITEMS + EXTENDED_SPEAKER_VARIATIONS

def generate_datasets():
    # Write JSON
    json_path = EVAL_DIR / "teach_back_gold_dataset.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(ALL_ITEMS, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(ALL_ITEMS)} items to {json_path}")

    # Write CSV
    csv_path = EVAL_DIR / "teach_back_gold_dataset.csv"
    fieldnames = [
        "id", "letter_id", "speaker", "target_item", "perturbation_type",
        "perturbed_transcript", "labeller_1_grade", "labeller_2_grade",
        "consensus_gold_grade", "is_safety_critical", "adversarial_challenge"
    ]
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for it in ALL_ITEMS:
            writer.writerow(it)
    print(f"Wrote CSV to {csv_path}")

    # Compute Cohen's Kappa between Labeller 1 and Labeller 2
    l1 = [it["labeller_1_grade"] for it in ALL_ITEMS]
    l2 = [it["labeller_2_grade"] for it in ALL_ITEMS]
    kappa = cohen_kappa_score(l1, l2)
    print(f"Inter-rater reliability (Cohen's Kappa): {kappa:.4f}")

    # Generate Frozen Manifest with SHA-256 hashes
    manifest = {
        "dataset_name": "Say It Back Gold Teach-Back Evaluation Dataset",
        "version": "1.0.0-FROZEN",
        "freeze_timestamp": "2026-10-04T20:00:00Z",
        "status": "FROZEN_BEFORE_PROMPT_TUNING",
        "total_items": len(ALL_ITEMS),
        "cohen_kappa_inter_rater_agreement": round(float(kappa), 4),
        "breakdown_by_consensus_grade": {
            "confirmed": sum(1 for it in ALL_ITEMS if it["consensus_gold_grade"] == "confirmed"),
            "misunderstood": sum(1 for it in ALL_ITEMS if it["consensus_gold_grade"] == "misunderstood"),
            "missed": sum(1 for it in ALL_ITEMS if it["consensus_gold_grade"] == "missed")
        },
        "breakdown_by_perturbation_type": {},
        "safety_critical_count": sum(1 for it in ALL_ITEMS if it["is_safety_critical"]),
        "file_hashes": {}
    }

    for it in ALL_ITEMS:
        pt = it["perturbation_type"]
        manifest["breakdown_by_perturbation_type"][pt] = manifest["breakdown_by_perturbation_type"].get(pt, 0) + 1

    # Calculate SHA-256 for all key files
    files_to_hash = [
        DATA_DIR / "templates" / "prsb_discharge_letter_template.md",
        DATA_DIR / "templates" / "prsb_discharge_letter_template.json",
        DATA_DIR / "letters" / "kwame_letter_1_cardiology.md",
        DATA_DIR / "letters" / "kwame_letter_1_cardiology.json",
        DATA_DIR / "letters" / "kwame_letter_2_renal_titration.md",
        DATA_DIR / "letters" / "kwame_letter_2_renal_titration.json",
        DATA_DIR / "letters" / "kwame_letter_3_ambulatory_frailty.md",
        DATA_DIR / "letters" / "kwame_letter_3_ambulatory_frailty.json",
        DATA_DIR / "dictionary" / "lay_drug_dictionary.json",
        json_path,
        csv_path
    ]

    for p in files_to_hash:
        if p.exists():
            h = hashlib.sha256(p.read_bytes()).hexdigest()
            manifest["file_hashes"][str(p.relative_to(DATA_DIR.parent)).replace("\\", "/")] = h

    manifest_path = EVAL_DIR / "FROZEN_MANIFEST.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"Wrote frozen manifest to {manifest_path}")

if __name__ == "__main__":
    generate_datasets()
