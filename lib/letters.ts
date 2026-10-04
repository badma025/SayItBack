import letter1 from "../data/letters/kwame_letter_1_cardiology.json";
import letter2 from "../data/letters/kwame_letter_2_renal_titration.json";
import letter3 from "../data/letters/kwame_letter_3_ambulatory_frailty.json";

export interface CarerInfo {
  name: string;
  relationship: string;
  phone: string;
}

export interface DiagnosisInfo {
  clinical_name: string;
  plain_language: string;
  verbatim_quote: string;
}

export interface MedicineChange {
  drug: string;
  lay_name: string;
  direction: string;
  previous_dose?: string;
  dose: string;
  frequency: string;
  route?: string;
  clinical_rationale?: string;
  verbatim_quote: string;
  safety_critical?: boolean;
}

export interface UnchangedMedicine {
  drug: string;
  lay_name: string;
  direction: string;
  dose: string;
  frequency: string;
  verbatim_quote: string;
}

export interface RedFlags {
  weight_gain_threshold: string;
  symptoms: string[];
  verbatim_quote: string;
}

export interface ContactInfo {
  primary_urgent_service: string;
  primary_urgent_phone: string;
  operating_hours: string;
  out_of_hours: string;
  life_threatening_emergency: string;
  verbatim_quote: string;
}

export interface FollowUpInfo {
  clinic_name: string;
  location: string;
  date_time: string;
  timeframe: string;
  seen_by: string;
  patient_action: string;
  verbatim_quote: string;
}

export interface DischargeLetter {
  letter_id: string;
  patient_name: string;
  dob: string;
  age: number;
  nhs_number: string;
  carer: CarerInfo;
  trust: string;
  hospital: string;
  ward: string;
  admission_date: string;
  discharge_date: string;
  primary_diagnosis: DiagnosisInfo;
  must_know_medicine_changes: MedicineChange[];
  unchanged_medicines: UnchangedMedicine[];
  red_flag_symptoms: RedFlags;
  who_to_call: ContactInfo;
  follow_up_appointment: FollowUpInfo;
  gp_actions?: { action: string; verbatim_quote: string };
  carer_counseling?: {
    fluid_restriction: string;
    weighing_instructions: string;
    diuretic_timing: string;
    otc_warning: string;
  };
}

export const SEEDED_LETTERS: Record<string, DischargeLetter> = {
  kwame_letter_1_cardiology: letter1 as DischargeLetter,
  kwame_letter_2_renal_titration: letter2 as DischargeLetter,
  kwame_letter_3_ambulatory_frailty: letter3 as DischargeLetter,
};

export const DEFAULT_LETTER = SEEDED_LETTERS.kwame_letter_1_cardiology;
