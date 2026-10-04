import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePdf() {
  const letterPath = path.join(__dirname, "../data/letters/kwame_letter_1_cardiology.json");
  const letterData = JSON.parse(fs.readFileSync(letterPath, "utf-8"));

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // NHS brand colours
  const nhsBlue = rgb(0 / 255, 94 / 255, 184 / 255);
  const nhsDark = rgb(0 / 255, 47 / 255, 108 / 255);
  const textDark = rgb(33 / 255, 43 / 255, 50 / 255);
  const textMuted = rgb(118 / 255, 134 / 255, 146 / 255);
  const redAlert = rgb(213 / 255, 40 / 255, 27 / 255);
  const lineGrey = rgb(232 / 255, 237 / 255, 238 / 255);

  // Helper for drawing wrapped text
  function drawText(page, text, x, y, size, font, color, maxWidth) {
    if (!maxWidth) {
      page.drawText(text, { x, y, size, font, color });
      return y - size - 4;
    }
    const words = text.split(" ");
    let line = "";
    let curY = y;
    for (const w of words) {
      const testLine = line ? `${line} ${w}` : w;
      const width = font.widthOfTextAtSize(testLine, size);
      if (width > maxWidth && line) {
        page.drawText(line, { x, y: curY, size, font, color });
        curY -= size + 4;
        line = w;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x, y: curY, size, font, color });
      curY -= size + 4;
    }
    return curY;
  }

  // --- PAGE 1 ---
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
  let y = 800;

  // Header banner
  page1.drawRectangle({
    x: 40,
    y: 770,
    width: 515,
    height: 44,
    color: nhsBlue,
  });
  page1.drawText("GUY'S AND ST THOMAS' NHS FOUNDATION TRUST", {
    x: 52,
    y: 796,
    size: 13,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  page1.drawText("St Thomas' Hospital · Westminster Bridge Road, London SE1 7EH", {
    x: 52,
    y: 780,
    size: 9,
    font: fontRegular,
    color: rgb(0.9, 0.95, 1),
  });

  y = 750;
  y = drawText(page1, "ELECTRONIC DISCHARGE SUMMARY (eDischarge / TTO)", 40, y, 14, fontBold, nhsDark);
  page1.drawLine({ start: { x: 40, y: y + 2 }, end: { x: 555, y: y + 2 }, thickness: 1, color: lineGrey });
  y -= 8;

  // Demographics Box
  page1.drawRectangle({ x: 40, y: y - 85, width: 515, height: 85, color: rgb(0.96, 0.97, 0.98), borderColor: lineGrey, borderWidth: 1 });
  let demY = y - 16;
  demY = drawText(page1, `Patient: ${letterData.patient_name.toUpperCase()} (Age: ${letterData.age})`, 50, demY, 11, fontBold, textDark);
  demY = drawText(page1, `NHS No: ${letterData.nhs_number}    DOB: ${letterData.dob}    Ward: ${letterData.ward}`, 50, demY, 9, fontRegular, textDark);
  demY = drawText(page1, `Carer: ${letterData.carer.name} (${letterData.carer.relationship}) - Tel: ${letterData.carer.phone}`, 50, demY, 9, fontRegular, textDark);
  demY = drawText(page1, `Admission: ${letterData.admission_date}    Discharge: ${letterData.discharge_date}    Consultant: Dr Simon Hughes`, 50, demY, 9, fontRegular, textMuted);
  y -= 100;

  // Primary Diagnosis
  y = drawText(page1, "1. PRIMARY DIAGNOSIS", 40, y, 11, fontBold, nhsBlue);
  y = drawText(page1, `Clinical: ${letterData.primary_diagnosis.clinical_name}`, 48, y, 10, fontBold, textDark, 500);
  y = drawText(page1, `Plain words: ${letterData.primary_diagnosis.plain_language}`, 48, y, 9, fontOblique, textMuted, 500);
  y -= 8;

  // Medication Changes (The Golden Path wow item!)
  y = drawText(page1, "2. MUST-KNOW MEDICINE CHANGES", 40, y, 11, fontBold, nhsBlue);
  
  for (const med of letterData.must_know_medicine_changes) {
    page1.drawRectangle({ x: 44, y: y - 88, width: 511, height: 88, color: rgb(1, 0.96, 0.96), borderColor: redAlert, borderWidth: 1 });
    let medY = y - 16;
    medY = drawText(page1, `• ${med.drug.toUpperCase()} (${med.lay_name}) — DIRECTION: ${med.direction.toUpperCase()}`, 52, medY, 10, fontBold, redAlert);
    medY = drawText(page1, `  Previous Dose: ${med.previous_dose} | NEW DISCHARGE DOSE: ${med.dose} ${med.frequency}`, 52, medY, 9, fontBold, textDark);
    medY = drawText(page1, `  Clinical Rationale: ${med.clinical_rationale}`, 52, medY, 8.5, fontRegular, textDark, 495);
    medY = drawText(page1, `  Exact Text: "${med.verbatim_quote}"`, 52, medY, 7.5, fontOblique, textMuted, 495);
    y -= 100;
  }

  // Unchanged Medicines
  y = drawText(page1, "3. UNCHANGED MEDICINES (CONTINUE AS NORMAL)", 40, y, 11, fontBold, nhsBlue);
  for (const med of letterData.unchanged_medicines) {
    y = drawText(page1, `• ${med.drug} (${med.lay_name}): ${med.dose} ${med.frequency}`, 48, y, 9, fontRegular, textDark, 500);
  }
  y -= 8;

  // GP Actions
  y = drawText(page1, "4. ACTIONS FOR GENERAL PRACTITIONER (GP)", 40, y, 11, fontBold, nhsBlue);
  y = drawText(page1, `• ${letterData.gp_actions.action}`, 48, y, 9, fontRegular, textDark, 500);

  // --- PAGE 2 ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  y = 800;

  // Header
  page2.drawRectangle({ x: 40, y: 775, width: 515, height: 35, color: nhsBlue });
  page2.drawText("DISCHARGE SAFETY PROTOCOL & ESCALATION — MENSAH, Kwame", {
    x: 52,
    y: 790,
    size: 11,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  y = 750;

  // Red Flag Symptoms
  y = drawText(page2, "5. RED FLAG SYMPTOMS (WATCH CLOSELY)", 40, y, 11, fontBold, redAlert);
  y = drawText(page2, `Weight Alert Threshold: ${letterData.red_flag_symptoms.weight_gain_threshold}`, 48, y, 9.5, fontBold, redAlert);
  for (const sym of letterData.red_flag_symptoms.symptoms) {
    y = drawText(page2, `  [!] ${sym}`, 48, y, 9, fontRegular, textDark, 500);
  }
  y = drawText(page2, `Quote: "${letterData.red_flag_symptoms.verbatim_quote}"`, 48, y, 8, fontOblique, textMuted, 500);
  y -= 10;

  // Who to Call
  y = drawText(page2, "6. EMERGENCY CONTACTS & WHO TO CALL", 40, y, 11, fontBold, nhsBlue);
  y = drawText(page2, `Primary Urgent Contact: ${letterData.who_to_call.primary_urgent_service}`, 48, y, 9.5, fontBold, textDark);
  y = drawText(page2, `Direct Telephone: ${letterData.who_to_call.primary_urgent_phone} (${letterData.who_to_call.operating_hours})`, 48, y, 9.5, fontBold, nhsBlue);
  y = drawText(page2, `Out of Hours: ${letterData.who_to_call.out_of_hours} | Life-Threatening Emergency: ${letterData.who_to_call.life_threatening_emergency}`, 48, y, 9, fontRegular, textDark);
  y -= 10;

  // Follow-up Appointment
  y = drawText(page2, "7. FOLLOW-UP APPOINTMENT", 40, y, 11, fontBold, nhsBlue);
  y = drawText(page2, `Clinic: ${letterData.follow_up_appointment.clinic_name} (${letterData.follow_up_appointment.location})`, 48, y, 9, fontRegular, textDark, 500);
  y = drawText(page2, `Date & Time: ${letterData.follow_up_appointment.date_time} (${letterData.follow_up_appointment.timeframe})`, 48, y, 9.5, fontBold, textDark);
  y = drawText(page2, `Seen By: ${letterData.follow_up_appointment.seen_by}`, 48, y, 9, fontRegular, textDark);
  y = drawText(page2, `Patient Action: ${letterData.follow_up_appointment.patient_action}`, 48, y, 9, fontRegular, textMuted);
  y -= 10;

  // Carer Counseling & Safety Warnings
  y = drawText(page2, "8. PATIENT & CARER BEDSIDE COUNSELING", 40, y, 11, fontBold, nhsBlue);
  y = drawText(page2, `• Fluid Restriction: ${letterData.carer_counseling.fluid_restriction}`, 48, y, 9, fontRegular, textDark);
  y = drawText(page2, `• Weighing Instructions: ${letterData.carer_counseling.weighing_instructions}`, 48, y, 9, fontRegular, textDark);
  y = drawText(page2, `• Diuretic Timing: ${letterData.carer_counseling.diuretic_timing}`, 48, y, 9, fontRegular, textDark);
  y = drawText(page2, `• WARNING: ${letterData.carer_counseling.otc_warning}`, 48, y, 9, fontBold, redAlert, 500);
  y -= 25;

  // Nurse Sign-Off Footer
  page2.drawRectangle({ x: 40, y: 70, width: 515, height: 75, color: rgb(0.97, 0.98, 0.99), borderColor: lineGrey, borderWidth: 1 });
  page2.drawText("WARD NURSE / PHARMACIST DISCHARGE SIGN-OFF", { x: 50, y: 130, size: 9, font: fontBold, color: nhsDark });
  page2.drawText("Discharge teach-back reviewed with carer. All questions addressed prior to ward exit.", { x: 50, y: 116, size: 8, font: fontRegular, color: textMuted });
  page2.drawText("Nurse Signature: _______________________   NMC Pin: _______________   Date: 04/10/2026", { x: 50, y: 92, size: 8.5, font: fontRegular, color: textDark });

  const pdfBytes = await pdfDoc.save();
  const outPath = path.join(__dirname, "../public/kwame-discharge-letter.pdf");
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`Generated authentic discharge letter PDF at: ${outPath} (${pdfBytes.length} bytes)`);
}

generatePdf().catch((err) => {
  console.error("Error generating PDF:", err);
  process.exit(1);
});
