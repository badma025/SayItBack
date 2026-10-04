# NHS eDischarge Summary Template (PRSB Aligned)

*Standard Specification for UK Hospital Discharge Summaries (Professional Record Standards Body / NHS England)*  
*Document Version: 2.1 (October 2026)*  
*Target Care Setting: Inpatient to Primary Care / Patient & Carer Handover*

---

## 1. Document Metadata & Header
- **Document Type:** Electronic Discharge Summary (eDischarge / TTO)
- **Care Setting:** Inpatient Acute Admission to Community Care
- **Hospital / Trust:** [Hospital Name], [NHS Foundation Trust Name]
- **Document Transmission Date & Time:** [DD/MM/YYYY HH:MM]
- **Status:** Final Signed Off

---

## 2. Patient Demographics & Carer Details
- **Patient Full Name:** [Surname, Forename(s)]
- **NHS Number:** [XXX XXX XXXX]
- **Date of Birth:** [DD/MM/YYYY] (Age: [Years])
- **Gender:** [Male / Female / Other]
- **Usual Address:** [Full Address Line 1, Line 2, Postcode]
- **Patient Contact Telephone:** [Primary Phone Number]
- **Primary Carer / Next of Kin:**
  - **Name:** [Carer Full Name]
  - **Relationship:** [e.g., Daughter / Son / Spouse / Primary Carer]
  - **Contact Telephone:** [Carer Phone Number]
  - **Carer Role:** [Holds power of attorney / Primary caregiver / Present at discharge counseling]
- **Registered GP Practice:**
  - **Practice Name:** [GP Surgery Name]
  - **Practice Address:** [Surgery Address, Postcode]
  - **ODS Code:** [Surgery Code, e.g., Y01234]
  - **Registered GP:** Dr. [GP Full Name]

---

## 3. Encounter & Admission Information
- **Hospital Ward:** [Ward Name, e.g., Albert Ward (Cardiology & Frailty)]
- **Specialty:** [Cardiology / Geriatric Medicine / Acute Frailty]
- **Admission Date & Time:** [DD/MM/YYYY HH:MM]
- **Discharge Date & Time:** [DD/MM/YYYY HH:MM]
- **Method of Admission:** [Emergency via Emergency Department (A&E) / Direct GP Referral / SDEC]
- **Discharging Consultant:** Dr. [Consultant Name], FRCP (GMC: [XXXXXXX])
- **Named Discharging Clinician / Author:** Dr. [Author Name], Specialty Registrar / FY2 (GMC: [XXXXXXX])
- **Discharge Destination:** Patient's home (independent with carer support)

---

## 4. Clinical Summary & Reason for Admission
- **Presenting Complaint:**
  - [Primary symptom(s) prompting emergency admission, e.g., severe dyspnoea at rest, orthopnoea, rapid bilateral lower limb oedema]
- **Clinical Narrative & Hospital Course:**
  - [Detailed 1-2 paragraph description of inpatient trajectory, precipitating factors (e.g. LRTI / medication non-adherence / dietary indiscretion), clinical findings, bedside observations, response to inpatient diuresis/therapy]
- **Key Inpatient Investigations:**
  - **Bedside / Vitals at Discharge:** BP [XXX/XX] mmHg, Heart Rate [XX] bpm (rhythm), SpO2 [XX]% on room air, Weight [XX.X] kg (admission weight: [XX.X] kg; net diuresis: [X.X] L negative)
  - **Biochemistry / Bloods at Discharge:**
    - Serum Creatinine: [XX] µmol/L (Baseline: [XX] µmol/L)
    - eGFR: [XX] mL/min/1.73m²
    - Potassium (K+): [X.X] mmol/L
    - Sodium (Na+): [XXX] mmol/L
    - NT-proBNP: [XXXX] pg/mL (peak: [XXXX] pg/mL)
  - **Imaging & Diagnostics:**
    - Echocardiogram: [LVEF %, chamber dimensions, valvular pathology]
    - Chest X-ray: [Resolution of pulmonary oedema / effusion status]
    - ECG: [Sinus rhythm / Atrial fibrillation, conduction abnormalities]

---

## 5. Diagnoses
- **Primary Diagnosis:**
  - [Clinical diagnosis name, e.g. Acute decompensated heart failure with reduced ejection fraction (HFrEF)]
  - *Plain Language Term for Patient/Carer:* [e.g. Heart failure flare-up / Fluid overload due to weakened heart muscle pumping]
- **Secondary Diagnoses & Co-morbidities:**
  1. [Secondary Diagnosis 1, e.g., Ischaemic cardiomyopathy]
  2. [Secondary Diagnosis 2, e.g., Essential hypertension]
  3. [Secondary Diagnosis 3, e.g., Chronic kidney disease Stage 3a]
  4. [Secondary Diagnosis 4, e.g., Type 2 diabetes mellitus]
  5. [Secondary Diagnosis 5, e.g., Osteoarthritis]

---

## 6. Allergies & Adverse Drug Reactions
| Causative Agent | Reaction Type / Manifestation | Severity | Verification Status |
| :--- | :--- | :--- | :--- |
| [Drug Name, e.g. Penicillin] | [e.g., Urticarial rash, facial angioedema] | [Severe / Moderate] | Confirmed |

*If none known:* No Known Drug Allergies (NKDA).

---

## 7. Discharge Medications (TTO - To Take Out / Take-Home Medicines)

> **CRITICAL SLOTS PER MEDICINE CHANGE:**  
> `{drug: str, lay_name: str, direction: enum[started, stopped, increased, decreased, unchanged], dose: str, frequency: str, indication: str}`

### A. Changed Medications (Dose / Frequency / Route Alterations)
| Medicine (Generic Name) | Lay / Common Name | Direction of Change | Previous Regimen | New Discharge Regimen | Clinical Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[Generic Drug Name]** | [Lay Name, e.g., "Water tablet"] | **INCREASED / DECREASED** | [Old dose, e.g. 40 mg OD] | **[New dose, e.g. 80 mg once daily in the morning]** | [Rationale, e.g. Ongoing persistent fluid retention; increased diuretic requirement] |

### B. New Medications Started During Admission
| Medicine (Generic Name) | Lay / Common Name | Direction | New Regimen | Indication / Instructions |
| :--- | :--- | :--- | :--- | :--- |
| **[Generic Drug Name]** | [Lay Name, e.g., "Heart protector tablet"] | **STARTED** | [Dose & Frequency, e.g. 10 mg once daily in morning] | [Indication, e.g. Heart failure prognostication; ensure good hydration] |

### C. Medications Stopped / Discontinued
| Medicine (Generic Name) | Lay / Common Name | Direction | Previous Regimen | Reason for Discontinuation |
| :--- | :--- | :--- | :--- | :--- |
| **[Generic Drug Name]** | [Lay Name, e.g., "Blood pressure tablet"] | **STOPPED** | [Previous Dose, e.g. 5 mg OD] | [Reason, e.g. Intolerable dry cough / Hyperkalaemia] |

### D. Unchanged Medications (Continued at Pre-admission Dose)
| Medicine (Generic Name) | Lay / Common Name | Direction | Discharge Regimen | Indication |
| :--- | :--- | :--- | :--- | :--- |
| **[Generic Drug Name]** | [Lay Name, e.g., "Beta blocker"] | **UNCHANGED** | [Dose & Frequency, e.g. 2.5 mg once daily] | [Heart rate control & heart protection] |
| **[Generic Drug Name]** | [Lay Name, e.g., "Cholesterol tablet"] | **UNCHANGED** | [Dose & Frequency, e.g. 20 mg at night] | [Lipid management / secondary prevention] |
| **[Generic Drug Name]** | [Lay Name, e.g., "Pain relief tablet"] | **UNCHANGED** | [Dose & Frequency, e.g. 500 mg - 1 g up to QDS PRN] | [Joint pain; max 4 g in 24 hours] |

---

## 8. Actions for Primary Care (GP Practice & Community Pharmacy)
1. **Urgent Repeat Blood Tests:**
   - Test: Serum U&Es (Creatinine, Urea, Sodium, Potassium) and eGFR.
   - Timescale: Within **[7 to 10] calendar days** of discharge (target date: [DD/MM/YYYY]).
   - Rationale: Mandatory safety monitoring following diuretic up-titration / ACEi/ARB/ARNI/SGLT2i initiation.
2. **Prescription Alignment:**
   - Update electronic patient medication record (EMIS / SystmOne) with amended TTO list.
   - Cancel prior repeat prescriptions for discontinued / altered doses to prevent dispensing errors.
3. **Clinical Review:**
   - Routine GP or Practice Pharmacist medication review within **[2 to 4] weeks**.

---

## 9. Information Given to Patient & Carer (Bedside Counseling)
- **Fluid & Weight Guidance:**
  - Fluid restriction: Maximum **[1.5 / 2.0] litres** total fluids per 24 hours.
  - Daily weight monitoring: Patient and carer instructed to weigh every morning after passing urine, before breakfast, wearing similar light clothing.
- **Medication Counseling:**
  - Water tablet timing: Explained to take diuretic in the morning (around 08:00) so peak urination occurs during the day and does not disrupt nighttime sleep.
  - Carer participation: Handover completed with carer [Name], who is supporting with morning blister packs / medication administration.
- **Questions for Pharmacist:**
  - If taking over-the-counter medicines (especially NSAIDs like ibuprofen), always consult the pharmacist first as anti-inflammatory tablets can cause fluid retention and kidney harm.

---

## 10. Red Flag Symptoms & Emergency Contacts ("Who to Call")

> **MUST-KNOW SLOTS:**  
> `{symptoms: list[str], threshold: str, contact_primary: str, contact_emergency: str}`

### Urgent Warning Signs (Call Heart Failure Specialist Team)
If Kwame or carer notices ANY of the following:
1. **Sudden Weight Gain:** Gaining **2 kg (4.4 lbs) or more over 2 consecutive days**, or gradual gain of 2.5 kg in a week.
2. **Worsening Breathlessness:** Increased breathlessness when walking short distances, needing more pillows to sleep upright (orthopnoea), or waking up breathless at night.
3. **Increasing Swelling:** New or worsening swelling in ankles, calves, thighs, or fullness in the abdomen.
4. **Persistent Dizziness:** Lightheadedness upon standing or unusual fatigue.

### Contact Details:
- **Primary Urgent Contact (Specialist Team):**
  - **Service:** [Hospital / Community Heart Failure Specialist Nurse Team]
  - **Telephone Number:** **[020 XXXX XXXX]**
  - **Operational Hours:** Monday to Friday, 09:00 – 17:00
  - **Action:** Call immediately if red flags occur; team can adjust diuretic dose without hospital admission.
- **Out of Hours / Non-Emergency:**
  - Call **NHS 111** (available 24 hours / 7 days).
- **Life-Threatening Emergency:**
  - Call **999** or go directly to the nearest Emergency Department (A&E) if experiencing severe chest pain, sudden crushing breathlessness at rest, or collapse.

---

## 11. Follow-up Appointments & Planned Care

> **MUST-KNOW SLOTS:**  
> `{clinic_name: str, location: str, timescale_date: str, clinician_role: str, patient_actions: str}`

1. **Hospital Heart Failure Specialist Clinic:**
   - **Clinic Name:** Heart Failure Outpatient Specialist Clinic
   - **Location:** Suite [X], [Hospital Name], [Address Line, Postcode]
   - **Date & Time:** **[Day, DD Month YYYY at HH:MM]** (within [2 to 3] weeks of discharge)
   - **Seen By:** Consultant Cardiologist / Heart Failure Specialist Nurse
   - **Patient Action:** Bring completed daily weight diary and discharge medication bottles.
2. **Community Heart Failure Nurse Home Visit / Phone Contact:**
   - **Timescale:** Telephone welfare check within **[48 to 72] hours** of discharge.
3. **GP Practice Phlebotomy:**
   - **Appointment:** Phlebotomy appointment booked for **[DD/MM/YYYY]** at [GP Surgery Name] for renal profile.

---

## 12. Sign-off & Handover Confirmation
- **Discharging Doctor:** Dr. [Doctor Name], MBBS MRCP (GMC [XXXXXXX])  
  Signature: _______________________ Date: [DD/MM/YYYY]
- **Discharging Nurse / Ward Pharmacist:** [Nurse/Pharmacist Name], RGN/MPharm (PIN [XXXXXXX])  
  Signature: _______________________ Date: [DD/MM/YYYY]
- **Patient / Carer Acknowledgment:**
  - Received copy of discharge summary and 14-day supply of TTO medicines.
  - Spoken teach-back completed and verified at bedside.
