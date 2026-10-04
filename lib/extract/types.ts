import type { SpokenExtraction } from "@sayitback/engine";

/** Why the model's reading was not used. Each one means "rules only". */
export type FallbackReason =
  | "no_api_key"
  | "timeout"
  | "network_error"
  | "http_error"
  | "unparseable"
  | "bad_request";

export class ExtractionFailure extends Error {
  constructor(
    readonly reason: FallbackReason,
    message: string,
  ) {
    super(message);
    this.name = "ExtractionFailure";
  }
}

export type RejectionReason =
  /** The cited span is not in the transcript. */
  | "span_not_in_transcript"
  /** A value was given with no span at all. */
  | "missing_span"
  /** The span is real but does not contain the value, e.g. dose 80 citing "once a day". */
  | "value_not_in_span"
  /** The shape was wrong: unknown kind, a dose without a number, and so on. */
  | "malformed";

/** One value the model asserted and the grounding step refused. */
export interface Rejection {
  /** Where in the model's reply, e.g. `items[0].slots.dose`. */
  path: string;
  reason: RejectionReason;
  /** The span the model cited, if any. */
  evidence: string | null;
}

/** What `/api/extract` returns when the model's reading is usable. */
export interface ExtractSuccess {
  ok: true;
  model: string;
  latencyMs: number;
  /** Grounded slots in the engine's schema. Every value survived the span check. */
  extraction: SpokenExtraction;
  rejected: Rejection[];
}

export interface ExtractFailure {
  ok: false;
  reason: FallbackReason;
  detail: string;
}

export type ExtractResponse = ExtractSuccess | ExtractFailure;
