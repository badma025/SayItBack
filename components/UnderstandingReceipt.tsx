"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { type Receipt } from "@sayitback/engine";
import { type DischargeLetter } from "../lib/letters";

interface UnderstandingReceiptProps {
  receipt: Receipt;
  letter: DischargeLetter;
  onPrint: () => void;
}

export function UnderstandingReceipt({
  receipt,
  letter,
  onPrint,
}: UnderstandingReceiptProps) {
  const [nurseName, setNurseName] = useState("Staff Nurse Sarah Jenkins");
  const [nmcPin, setNmcPin] = useState("12A3456E");
  const [signed, setSigned] = useState(false);

  const unresolvedItems = receipt.items.filter((i) => i.grade !== "confirmed");

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-5 sm:p-6 shadow-sm space-y-6 print-page">
      {/* NHS & Hospital Header */}
      <div className="border-b-2 border-[#005EB8] pb-4 flex flex-wrap justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#005EB8] text-white font-black px-2 py-0.5 text-xs rounded-xs">
              NHS
            </span>
            <span className="font-bold text-gray-900 text-sm">
              Guy&apos;s and St Thomas&apos; NHS Foundation Trust
            </span>
          </div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            DISCHARGE UNDERSTANDING RECEIPT &amp; HANDOVER
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Bedside teach-back verified prior to departure from Albert Ward.
          </p>
        </div>

        <button
          onClick={onPrint}
          className="no-print inline-flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Large-Print Fridge Card</span>
        </button>
      </div>

      {/* Patient & Carer Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 border border-gray-200 rounded p-3 text-xs">
        <div>
          <span className="text-gray-500 block">Patient Name:</span>
          <span className="font-bold text-gray-900 text-sm">
            {letter.patient_name.toUpperCase()}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">NHS Number:</span>
          <span className="font-mono font-bold text-gray-900">{letter.nhs_number}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Primary Carer:</span>
          <span className="font-bold text-gray-900">{letter.carer.name}</span>
        </div>
        <div>
          <span className="text-gray-500 block">Discharge Date:</span>
          <span className="font-bold text-gray-900">{letter.discharge_date}</span>
        </div>
      </div>

      {/* Core Safety Callout */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-md p-3 text-xs text-blue-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#005EB8]" />
          <span>Clinical Safety Grounding:</span>
        </div>
        <p>
          This receipt records spoken teach-back responses verified against verbatim quotes in Kwame&apos;s electronic discharge letter. It states questions to ask the ward or pharmacy, and never substitutes for clinician advice.
        </p>
      </div>

      {/* Summary of Verified Medication Changes */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b pb-1">
          1. Verified Medication Changes (Take-Home Medicines)
        </h3>
        {letter.must_know_medicine_changes.map((med, idx) => (
          <div
            key={idx}
            className="border border-emerald-300 bg-emerald-50/40 rounded p-3 text-xs space-y-1"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-sm capitalize">
                {med.drug} ({med.lay_name}) — {med.direction.toUpperCase()}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Grounded in PDF
              </span>
            </div>
            <div className="text-gray-800 font-medium">
              NEW DOSE: <span className="font-bold text-[#005EB8]">{med.dose}</span> {med.frequency}
            </div>
            <div className="text-gray-600 italic">
              &ldquo;{med.clinical_rationale}&rdquo;
            </div>
          </div>
        ))}
      </div>

      {/* Questions to Ask Ward / Gaps */}
      {unresolvedItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 border-b pb-1">
            2. Questions to Ask the Ward Before Leaving
          </h3>
          <div className="space-y-1.5">
            {unresolvedItems.map((item) => (
              <div
                key={item.itemId}
                className="bg-red-50 border border-red-200 rounded p-2.5 text-xs text-red-950 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{item.askTheWard}</span>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    Letter quote: &ldquo;{item.quote}&rdquo;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions for Ward Pharmacist */}
      {receipt.questionsForPharmacist && receipt.questionsForPharmacist.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 border-b pb-1">
            3. Questions For Your Ward Pharmacist
          </h3>
          <div className="space-y-1.5">
            {receipt.questionsForPharmacist.map((q) => (
              <div
                key={q.id}
                className="bg-amber-50 border border-amber-200 rounded p-2.5 text-xs text-amber-950 flex items-start gap-2"
              >
                <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">&ldquo;{q.utterance}&rdquo;</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red Flags & Emergency Box */}
      <div className="border border-gray-300 rounded p-3 text-xs bg-slate-50 space-y-1.5">
        <h4 className="font-bold text-gray-900 uppercase tracking-wider">
          4. Emergency Escalation Contacts
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
          <div>
            <span className="font-semibold">Specialist Nurse:</span>{" "}
            {letter.who_to_call.primary_urgent_service}
          </div>
          <div>
            <span className="font-semibold">Telephone:</span>{" "}
            <span className="font-bold text-blue-900">{letter.who_to_call.primary_urgent_phone}</span>
          </div>
          <div>
            <span className="font-semibold">Weight Alert:</span>{" "}
            {letter.red_flag_symptoms.weight_gain_threshold}
          </div>
          <div>
            <span className="font-semibold">Follow-up:</span>{" "}
            {letter.follow_up_appointment.date_time}
          </div>
        </div>
      </div>

      {/* Ward Nurse Sign-Off Block */}
      <div className="border-2 border-gray-400 bg-gray-50/80 rounded-lg p-4 space-y-3 print-break-inside-avoid">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Ward Clinician / Pharmacist Sign-Off
          </span>
          <span className="text-[11px] text-gray-500 font-mono">
            Albert Ward · St Thomas&apos;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-gray-500 block mb-0.5">Nurse / Pharmacist Name:</label>
            <input
              type="text"
              value={nurseName}
              onChange={(e) => setNurseName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-gray-800"
            />
          </div>
          <div>
            <label className="text-gray-500 block mb-0.5">NMC / GPhC Pin:</label>
            <input
              type="text"
              value={nmcPin}
              onChange={(e) => setNmcPin(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono text-gray-800"
            />
          </div>
          <div>
            <label className="text-gray-500 block mb-0.5">Status:</label>
            <button
              onClick={() => setSigned(!signed)}
              className={`w-full py-1 px-2 rounded font-bold text-xs border transition-colors ${
                signed
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {signed ? "Signed & Handover Complete" : "Click to Sign Off"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
