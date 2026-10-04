/**
 * `POST /api/extract`: transcript in, grounded slots out.
 *
 * Lives outside `app/` so the tests can call it with a replayed `fetch`. Every
 * failure comes back as `{ ok: false, reason }` with a non-2xx status, and the
 * client treats that as "rules only". Nothing here grades anything.
 */

import { callFeatherless, type FeatherlessOptions } from "./featherless";
import { groundExtraction } from "./ground";
import { ExtractionFailure, type ExtractResponse, type FallbackReason } from "./types";

/** Long enough for a few minutes of speech; anything longer is not a teach-back. */
export const MAX_TRANSCRIPT_CHARS = 4000;

const STATUS: Record<FallbackReason, number> = {
  bad_request: 400,
  no_api_key: 503,
  timeout: 504,
  network_error: 502,
  http_error: 502,
  unparseable: 502,
};

function reply(body: ExtractResponse): Response {
  return Response.json(body, {
    status: body.ok ? 200 : STATUS[body.reason],
    headers: { "Cache-Control": "no-store" },
  });
}

export async function handleExtract(
  request: Request,
  options: FeatherlessOptions,
): Promise<Response> {
  let transcript: unknown;
  try {
    transcript = ((await request.json()) as { transcript?: unknown }).transcript;
  } catch {
    transcript = undefined;
  }
  if (typeof transcript !== "string" || transcript.trim().length === 0) {
    return reply({ ok: false, reason: "bad_request", detail: "send { transcript: string }" });
  }
  if (transcript.length > MAX_TRANSCRIPT_CHARS) {
    return reply({
      ok: false,
      reason: "bad_request",
      detail: `transcript is over ${MAX_TRANSCRIPT_CHARS} characters`,
    });
  }

  try {
    const answer = await callFeatherless(transcript, options);
    const grounded = groundExtraction(answer.content, transcript);
    return reply({
      ok: true,
      model: answer.model,
      latencyMs: answer.latencyMs,
      extraction: grounded.extraction,
      rejected: grounded.rejected,
    });
  } catch (error) {
    if (error instanceof ExtractionFailure) {
      return reply({ ok: false, reason: error.reason, detail: error.message });
    }
    return reply({ ok: false, reason: "network_error", detail: (error as Error).message });
  }
}
