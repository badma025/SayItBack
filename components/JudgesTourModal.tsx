"use client";

import React from "react";
import { X, Award, ShieldAlert, Cpu, Sparkles, BookCheck, ExternalLink } from "lucide-react";

interface JudgesTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JudgesTourModal({ isOpen, onClose }: JudgesTourModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="bg-[#005EB8] text-white p-5 rounded-t-xl flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white text-[#005EB8] font-black px-2 py-0.5 text-xs rounded-sm">
                NHS
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-blue-100">
                ForgeHacks 2026 · AI + Healthcare Track
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight">
              Say It Back: 60-Second Judge Tour
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Kwame (81) &amp; Efua (45) at Thamesbank General Hospital bedside
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-gray-700">
          {/* Headline Premise */}
          <div className="bg-blue-50 border-l-4 border-[#005EB8] p-3.5 rounded-r-md text-blue-950">
            <span className="font-bold block text-sm mb-1">
              &ldquo;The AI listens; deterministic code decides. It never adds advice.&rdquo;
            </span>
            <p>
              Current discharge AI systems generate friendly summaries or conversational chatbots. But 18% of LLM discharge rewrites hallucinate or omit critical safety information (Zaretsky 2024). Say It Back inverts the paradigm: the patient or carer explains the letter back by voice, and deterministic slot rules grade their recall against verbatim quotes from their actual document.
            </p>
          </div>

          {/* 5 Rubric Criteria Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>How Say It Back Meets the 5 Hackathon Criteria</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/60">
                <span className="font-bold text-gray-900 block mb-1">1. Impact (20%)</span>
                <p className="text-gray-600">
                  78% of patients leave hospital with incomplete understanding; only 20% realize it (Engel 2009). 14.7% 30-day emergency readmissions in NHS England (948k readmissions in 2024/25). Catching Kwame&apos;s doubled water tablet prevents fluid overload readmission.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/60">
                <span className="font-bold text-gray-900 block mb-1">2. Technical &amp; AI Use (20%)</span>
                <p className="text-gray-600">
                  Not a wrapper! Ground-truth PDF text layer extracted via in-browser pdf.js. Span-grounded evidence verification, deterministic slot comparator, and post-ASR drug name biasing.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/60">
                <span className="font-bold text-gray-900 block mb-1">3. Innovation (20%)</span>
                <p className="text-gray-600">
                  First spoken teach-back system checked against exact quotes at bedside. Inverts generative AI from an advice-giver into an evidence-bound listener.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/60">
                <span className="font-bold text-gray-900 block mb-1">4. Execution (20%)</span>
                <p className="text-gray-600">
                  Zero login, zero API key requirement. Deployed live on Vercel with seeded letters, real pdf.js renderer, interactive 10s demo scenarios, and large-print printer CSS.
                </p>
              </div>
            </div>
          </div>

          {/* The 15-Second Wow Moment */}
          <div className="border border-amber-200 bg-amber-50/70 rounded-lg p-3.5 space-y-2">
            <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>The 15-Second Demo Walkthrough</span>
            </span>
            <ol className="list-decimal list-inside space-y-1 text-gray-800 text-xs">
              <li>
                Click <strong>&ldquo;1. The 15s Wow Moment&rdquo;</strong> button.
              </li>
              <li>
                Kwame says: <em>&ldquo;I take the water tablet, once a day like before.&rdquo;</em>
              </li>
              <li>
                <strong>Frequency</strong> slot turns <span className="text-emerald-700 font-bold">GREEN</span> (&ldquo;once daily&rdquo;).
              </li>
              <li>
                <strong>Dose</strong> slot turns <span className="text-red-700 font-bold">RED</span> next to <em>&ldquo;Furosemide: increased from 40mg to 80mg&rdquo;</em>.
              </li>
              <li>
                Click <strong>&ldquo;Try Second-Pass Teach-Back&rdquo;</strong> to watch the loop resolve into full confirmation!
              </li>
            </ol>
          </div>

          {/* Sourced Clinical Evidence */}
          <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-500 space-y-1">
            <span className="font-bold uppercase tracking-wider block text-gray-700">
              Evidence Base &amp; Academic Citations:
            </span>
            <div>• Engel KG et al. Patient comprehension of emergency department discharge instructions. Ann Emerg Med 2009.</div>
            <div>• Horwitz LI et al. Comprehensive discharge planning and patient recall. JAMA Intern Med 2013.</div>
            <div>• NHS Digital. Compendium: Emergency readmissions within 30 days of discharge (2024/25).</div>
            <div>• Zaretsky J et al. Physician review of generative AI hospital discharge summaries. JAMA Netw Open 2024.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#005EB8] hover:bg-[#004b93] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors"
          >
            Start Trying Kwame&apos;s Letter
          </button>
        </div>
      </div>
    </div>
  );
}
