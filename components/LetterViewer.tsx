"use client";

import React, { useState } from "react";
import {
  FileText,
  AlertTriangle,
  Clock,
  PhoneCall,
  Calendar,
  Pill,
  User,
  ShieldCheck,
  CheckCircle2,
  FileCode,
} from "lucide-react";
import { type DischargeLetter } from "../lib/letters";
import { PdfViewer } from "./PdfViewer";
import { type ExtractedPdfDocument } from "../lib/pdf-parser";

interface LetterViewerProps {
  letter: DischargeLetter;
  highlightedItemId?: string | null;
  onPdfTextExtracted?: (extracted: ExtractedPdfDocument) => void;
}

export function LetterViewer({
  letter,
  highlightedItemId,
  onPdfTextExtracted,
}: LetterViewerProps) {
  const [activeTab, setActiveTab] = useState<"structured" | "pdf">("structured");

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header Tabs */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 pt-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("structured")}
            className={`px-3 py-1.5 rounded-t-md text-xs font-bold flex items-center gap-1.5 transition-colors border-t border-x ${
              activeTab === "structured"
                ? "bg-white text-[#005EB8] border-gray-200 border-b-white -mb-px shadow-xs"
                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>eDischarge Summary (PRSB)</span>
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={`px-3 py-1.5 rounded-t-md text-xs font-bold flex items-center gap-1.5 transition-colors border-t border-x ${
              activeTab === "pdf"
                ? "bg-white text-[#005EB8] border-gray-200 border-b-white -mb-px shadow-xs"
                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-100"
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#005EB8]" />
            <span>Original PDF (pdf.js)</span>
          </button>
        </div>

        <div className="text-[11px] text-gray-500 pb-1 font-mono flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>Verified Quotes Grounded</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "pdf" ? (
          <div className="p-3 h-full min-h-[580px]">
            <PdfViewer
              pdfUrl="/kwame-discharge-letter.pdf"
              onTextExtracted={onPdfTextExtracted}
            />
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-5 text-sm">
            {/* Patient Header Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-gray-700">
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-gray-200 pb-2 mb-2">
                <div>
                  <span className="font-bold text-gray-900 text-sm">
                    {letter.patient_name.toUpperCase()}
                  </span>
                  <span className="text-gray-500 ml-2">Age: {letter.age}</span>
                </div>
                <div className="font-mono text-gray-600">NHS: {letter.nhs_number}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-semibold text-gray-800">Carer:</span>{" "}
                  {letter.carer.name} ({letter.carer.relationship})
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Ward:</span> {letter.ward}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Discharge Date:</span>{" "}
                  {letter.discharge_date}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Hospital:</span> {letter.hospital}
                </div>
              </div>
            </div>

            {/* 1. Primary Diagnosis */}
            <section className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  1. Primary Diagnosis
                </span>
                <span className="text-[11px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                  PRSB Grounded
                </span>
              </div>
              <div className="bg-blue-50/50 border border-blue-200/80 rounded-lg p-3">
                <div className="font-semibold text-gray-900">
                  {letter.primary_diagnosis.clinical_name}
                </div>
                <div className="text-xs text-blue-900 mt-1 italic">
                  Plain words: {letter.primary_diagnosis.plain_language}
                </div>
              </div>
            </section>

            {/* 2. Medicine Changes (The Golden Path wow item!) */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                    2. Must-Know Medicine Changes (Critical)
                  </span>
                </div>
                <span className="text-[11px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                  High Risk of Readmission
                </span>
              </div>

              {letter.must_know_medicine_changes.map((med, idx) => (
                <div
                  key={idx}
                  id="target-medication-change"
                  className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                    highlightedItemId === "dose-gap" || highlightedItemId?.includes("med")
                      ? "border-red-500 bg-red-50/90 shadow-md ring-2 ring-red-400"
                      : "border-red-300 bg-red-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-gray-900 capitalize">
                          {med.drug}
                        </span>
                        <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-semibold border border-amber-200">
                          {med.lay_name}
                        </span>
                        <span className="text-xs bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase">
                          {med.direction}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Previous dose:{" "}
                        <span className="line-through text-gray-500 font-medium">
                          {med.previous_dose}
                        </span>{" "}
                        →{" "}
                        <span className="text-red-700 font-bold bg-red-100/70 px-1 rounded">
                          New discharge dose: {med.dose} {med.frequency}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-red-200/80 text-xs text-gray-700">
                    <span className="font-semibold text-gray-800">Clinical Rationale:</span>{" "}
                    {med.clinical_rationale}
                  </div>

                  <div className="mt-2 bg-white/80 border border-red-200 rounded p-2 text-[11px] text-gray-600 font-mono">
                    <span className="text-red-800 font-bold">Verbatim Quote in PDF: </span>
                    &ldquo;{med.verbatim_quote}&rdquo;
                  </div>
                </div>
              ))}
            </section>

            {/* 3. Unchanged Medicines */}
            <section className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                3. Unchanged Medicines (Continue as Normal)
              </span>
              <div className="bg-gray-50 border border-gray-200 rounded-lg divide-y divide-gray-200 text-xs">
                {letter.unchanged_medicines.map((med, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between items-center gap-2">
                    <div>
                      <span className="font-semibold text-gray-900 capitalize">{med.drug}</span>{" "}
                      <span className="text-gray-500">({med.lay_name})</span>
                    </div>
                    <div className="text-gray-700 font-medium">
                      {med.dose} · {med.frequency}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Red Flag Symptoms */}
            <section className="space-y-1.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  4. Red Flag Warning Symptoms
                </span>
              </div>
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 space-y-1.5">
                <div className="font-bold text-amber-900">
                  Threshold: {letter.red_flag_symptoms.weight_gain_threshold}
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-gray-800">
                  {letter.red_flag_symptoms.symptoms.map((sym, idx) => (
                    <li key={idx}>{sym}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 5. Emergency Contacts */}
            <section className="space-y-1.5">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#005EB8]" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  5. Who to Call (Escalation)
                </span>
              </div>
              <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3 text-xs space-y-1">
                <div className="font-bold text-[#005EB8]">
                  {letter.who_to_call.primary_urgent_service}:{" "}
                  <span className="text-base text-gray-900 font-black">
                    {letter.who_to_call.primary_urgent_phone}
                  </span>
                </div>
                <div className="text-gray-600">{letter.who_to_call.operating_hours}</div>
                <div className="text-gray-600 pt-1 border-t border-blue-200/60 flex gap-4">
                  <span>Out of Hours: {letter.who_to_call.out_of_hours}</span>
                  <span>Life Threatening: {letter.who_to_call.life_threatening_emergency}</span>
                </div>
              </div>
            </section>

            {/* 6. Follow-up Appointment */}
            <section className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  6. Follow-up Appointment
                </span>
              </div>
              <div className="bg-indigo-50/60 border border-indigo-200 rounded-lg p-3 text-xs space-y-1 text-gray-800">
                <div className="font-semibold text-indigo-950">
                  {letter.follow_up_appointment.clinic_name} ({letter.follow_up_appointment.location})
                </div>
                <div className="font-bold text-gray-900">
                  {letter.follow_up_appointment.date_time} ({letter.follow_up_appointment.timeframe})
                </div>
                <div className="text-gray-600">Seen by: {letter.follow_up_appointment.seen_by}</div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
