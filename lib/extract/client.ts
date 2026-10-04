/**
 * Browser side of the extraction call. Always resolves: a failed or slow model
 * becomes `{ mode: "rules_only" }` with the reason, never an exception.
 */

import type { SpokenExtraction } from "@sayitback/engine";
import type { ExtractResponse, FallbackReason, Rejection } from "./types";

/** A little over the server's 15 s Featherless timeout, so the server's reason wins. */
export const CLIENT_TIMEOUT_MS = 18_000;

export type ReadingSource =
  | { mode: "model"; model: string; latencyMs: number; rejected: Rejection[] }
  | { mode: "rules_only"; reason: FallbackReason; detail: string };

export interface ModelReading {
  extraction: SpokenExtraction | null;
  source: ReadingSource;
}

export async function readTranscript(
  transcript: string,
  options: { timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<ModelReading> {
  const timeoutMs = options.timeoutMs ?? CLIENT_TIMEOUT_MS;
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
      signal: controller.signal,
    });
    const body = (await response.json()) as ExtractResponse;
    if (body.ok) {
      return {
        extraction: body.extraction,
        source: {
          mode: "model",
          model: body.model,
          latencyMs: body.latencyMs,
          rejected: body.rejected,
        },
      };
    }
    return { extraction: null, source: { mode: "rules_only", reason: body.reason, detail: body.detail } };
  } catch (error) {
    return {
      extraction: null,
      source: controller.signal.aborted
        ? { mode: "rules_only", reason: "timeout", detail: `no reply within ${timeoutMs / 1000} s` }
        : { mode: "rules_only", reason: "network_error", detail: (error as Error).message },
    };
  } finally {
    clearTimeout(timer);
  }
}
