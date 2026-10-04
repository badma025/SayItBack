"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  FileText,
  CornerDownRight,
  Pill,
  Sparkles,
} from "lucide-react";
import { type Receipt, type GradedItem, type SlotResult } from "@sayitback/engine";

interface ComparatorResultsProps {
  receipt: Receipt;
  onSelectGap?: (itemId: string) => void;
}

export function ComparatorResults({ receipt, onSelectGap }: ComparatorResultsProps) {
  const { items, summary, questionsForPharmacist } = receipt;

  return (
    <div className="space-y-4">
      {/* Safety & Summary Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                Deterministic Comparator Results
              </h3>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                Asymmetric Rules
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Code compares slot values. Only verbatim matches confirm. Gaps stay red.
            </p>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{summary.confirmed} Confirmed</span>
            </span>
            {summary.conflicts > 0 && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded font-bold animate-pulse">
                <XCircle className="w-3.5 h-3.5 text-red-600" />
                <span>{summary.conflicts} Conflict</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>{summary.notYetConfirmed} Need Attention</span>
            </span>
          </div>
        </div>

        {/* Asymmetric Grading Callout */}
        <div className="mt-3 bg-blue-50/70 border border-blue-200 rounded-md p-2.5 text-xs text-blue-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#005EB8] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Asymmetric Grading Rule: </span>
            A slot confirms ONLY if what the patient said matches the letter. Any ambiguity or mismatch is marked &ldquo;not yet confirmed&rdquo;. A missed dose can never turn green.
          </div>
        </div>
      </div>

      {/* Questions for Pharmacist (Safety Guardrail Triggered) */}
      {questionsForPharmacist && questionsForPharmacist.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Questions For Your Ward Pharmacist (Zero-Advice Guardrail)
            </h4>
          </div>
          <p className="text-xs text-amber-800">
            The carer asked for clinical advice. The AI does not diagnose or prescribe:
          </p>
          <div className="space-y-1.5 pt-1">
            {questionsForPharmacist.map((q) => (
              <div
                key={q.id}
                className="bg-white border border-amber-200 rounded p-2.5 text-xs text-gray-800 font-medium flex items-start gap-2"
              >
                <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">&ldquo;{q.utterance}&rdquo;</div>
                  <div className="text-[11px] text-amber-700 mt-0.5">
                    Added to Understanding Receipt for bedside pharmacist sign-off before leaving.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graded Items Cards */}
      <div className="space-y-3">
        {items.map((item) => {
          const isConfirmed = item.grade === "confirmed";
          const hasConflict = item.slots.some((s) => s.verdict === "mismatch");

          return (
            <div
              key={item.itemId}
              className={`rounded-lg border-2 p-4 transition-all duration-200 bg-white ${
                isConfirmed
                  ? "border-emerald-300 bg-emerald-50/20"
                  : hasConflict
                    ? "border-red-400 bg-red-50/30 shadow-sm"
                    : "border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    {item.kind.replace("_", " ")}
                  </span>
                  <span className="text-xs font-mono text-gray-400">({item.itemId})</span>
                </div>

                <div className="flex items-center gap-2">
                  {isConfirmed ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed</span>
                    </span>
                  ) : hasConflict ? (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Conflict With Letter</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{item.reason?.replace(/_/g, " ") ?? "Not Yet Confirmed"}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Slot Table Breakdown */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="pb-1.5 font-semibold">Slot</th>
                      <th className="pb-1.5 font-semibold">Expected (Letter)</th>
                      <th className="pb-1.5 font-semibold">Heard (Transcript)</th>
                      <th className="pb-1.5 font-semibold text-right">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {item.slots.map((slot, sIdx) => {
                      const isMatch = slot.verdict === "match";
                      const isMismatch = slot.verdict === "mismatch";

                      return (
                        <tr key={sIdx} className="hover:bg-gray-50/50">
                          <td className="py-2 font-bold text-gray-800 capitalize">
                            {slot.slot.replace("_", " ")}
                            {slot.critical && (
                              <span className="ml-1 text-[10px] text-red-500 font-semibold">
                                *
                              </span>
                            )}
                          </td>
                          <td className="py-2 font-mono text-gray-700">
                            {formatSlotValue(slot.expected)}
                          </td>
                          <td className="py-2 font-mono text-gray-700">
                            {slot.heard !== null ? (
                              <span
                                className={
                                  isMismatch
                                    ? "text-red-700 font-bold bg-red-100 px-1 rounded"
                                    : ""
                                }
                              >
                                {formatSlotValue(slot.heard)}
                              </span>
                            ) : (
                              <span className="text-gray-400 italic">Not mentioned</span>
                            )}
                          </td>
                          <td className="py-2 text-right">
                            {isMatch ? (
                              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Match</span>
                              </span>
                            ) : isMismatch ? (
                              <span className="inline-flex items-center gap-0.5 text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded text-[11px]">
                                <XCircle className="w-3 h-3" />
                                <span>Mismatch</span>
                              </span>
                            ) : (
                              <span className="text-gray-400 font-mono text-[11px]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Exact Verbatim Quote from Letter */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 bg-gray-50/70 rounded p-2.5 text-[11px] text-gray-600 font-mono">
                <div className="flex items-center gap-1.5 text-gray-500 font-sans font-bold text-[10px] uppercase mb-1">
                  <FileText className="w-3 h-3 text-[#005EB8]" />
                  <span>Ground-Truth Evidence Span in Letter:</span>
                </div>
                <div className="text-gray-800 italic">&ldquo;{item.quote}&rdquo;</div>
              </div>

              {/* Ward Action Recommendation */}
              {item.askTheWard && (
                <div className="mt-2.5 flex items-start gap-1.5 text-xs text-red-900 bg-red-50 border border-red-200 rounded p-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Receipt Question: </span>
                    {item.askTheWard}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatSlotValue(val: any): string {
  if (val === null || val === undefined) return "—";
  if (typeof val === "object") {
    if ("value" in val && "unit" in val) {
      return `${val.value} ${val.unit}`;
    }
    return JSON.stringify(val);
  }
  return String(val);
}
