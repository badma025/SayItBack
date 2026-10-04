"use client";

import React from "react";
import { type ReadingSource } from "../lib/extract/client";
import { type GuardNote } from "../lib/extract/recall-guard";
import { type FallbackReason, type Rejection } from "../lib/extract/types";

interface ReadingSourceNoteProps {
  source: ReadingSource;
  guardNotes: GuardNote[];
}

const FALLBACK_TEXT: Record<FallbackReason, string> = {
  timeout: "The AI reader didn't reply in time.",
  no_api_key: "The AI reader isn't set up on this server.",
  http_error: "The AI reader returned an error.",
  network_error: "The AI reader couldn't be reached.",
  unparseable: "The AI reader's reply couldn't be read.",
  bad_request: "The AI reader couldn't take this answer.",
};

const REJECTION_TEXT: Record<Rejection["reason"], string> = {
  span_not_in_transcript: "quoted words that weren't said",
  missing_span: "gave no quote",
  value_not_in_span: "its quote didn't contain the value",
  malformed: "not an allowed value",
};

function modelName(id: string): string {
  return id.split("/").pop() ?? id;
}

/**
 * Says who read the transcript: the model plus the rules, or the rules alone.
 * Either way, code compared it with the letter. The model never grades.
 */
export function ReadingSourceNote({ source, guardNotes }: ReadingSourceNoteProps) {
  if (source.mode === "rules_only") {
    return (
      <div role="status" className="rounded-lg border border-warn-line bg-warn-soft px-4 py-3 text-sm">
        <p className="font-bold text-warn">Checked by rules only</p>
        <p className="mt-1 text-muted">
          {FALLBACK_TEXT[source.reason]} The words were matched to the letter by code, as always,
          but things said in a roundabout way may show as not mentioned.
        </p>
        <p className="mt-1 font-mono text-xs text-faint">{source.detail}</p>
      </div>
    );
  }

  const { rejected } = source;
  const hasDetail = rejected.length > 0 || guardNotes.length > 0;

  return (
    <div role="status" className="text-sm text-muted">
      <p>
        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-ok align-middle" aria-hidden />
        Read by {modelName(source.model)} in {(source.latencyMs / 1000).toFixed(1)} s, then
        checked by code. The AI only picks out what was said; it doesn&apos;t mark anything.
      </p>
      {hasDetail && (
        <details className="mt-1.5">
          <summary className="cursor-pointer text-faint hover:text-ink">
            {rejected.length > 0 &&
              `${rejected.length} AI reading${rejected.length === 1 ? "" : "s"} thrown out`}
            {rejected.length > 0 && guardNotes.length > 0 && " · "}
            {guardNotes.length > 0 && `${guardNotes.length} safety net${guardNotes.length === 1 ? "" : "s"} used`}
          </summary>
          <ul className="mt-2 space-y-1 border-l-2 border-line pl-3">
            {rejected.map((r) => (
              <li key={r.path}>
                <span className="font-mono text-xs text-faint">{r.path}</span>{" "}
                {REJECTION_TEXT[r.reason]}
                {r.evidence && <span className="font-serif italic"> &ldquo;{r.evidence}&rdquo;</span>}
              </li>
            ))}
            {guardNotes.map((note, index) => (
              <li key={`${note.code}-${index}`}>{note.detail}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
