/**
 * Server-side call to Featherless (OpenAI-compatible chat completions).
 *
 * Never imported by client code: the API key stays on the server. Every way
 * this can go wrong is turned into a typed `ExtractionFailure`, so the route
 * can fall back to rules only and the UI can say why.
 */

import { DEFAULT_EXTRACTION_MODEL, SYSTEM_PROMPT, userPrompt } from "./prompt";
import { ExtractionFailure } from "./types";

export const FEATHERLESS_URL = "https://api.featherless.ai/v1/chat/completions";

/**
 * A warm 14B model answered in 1.5-5 s in testing, with one reply at 10 s.
 * Past this, the bedside gets the rules-only reading instead of a spinner.
 */
export const DEFAULT_TIMEOUT_MS = 15_000;

export interface FeatherlessOptions {
  apiKey: string | undefined;
  model?: string;
  timeoutMs?: number;
  /** Injected in tests to replay recorded responses. */
  fetchImpl?: typeof fetch;
}

export interface FeatherlessReply {
  /** The assistant message text, before any parsing. */
  content: string;
  /** The model Featherless says answered, which may differ from the one asked for. */
  model: string;
  latencyMs: number;
}

export function buildRequestBody(transcript: string, model: string) {
  return {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt(transcript) },
    ],
    temperature: 0,
    max_tokens: 1200,
    response_format: { type: "json_object" },
  };
}

export async function callFeatherless(
  transcript: string,
  options: FeatherlessOptions,
): Promise<FeatherlessReply> {
  if (!options.apiKey) {
    throw new ExtractionFailure("no_api_key", "FEATHERLESS_API_KEY is not set on the server");
  }
  const model = options.model ?? DEFAULT_EXTRACTION_MODEL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetchImpl ?? fetch;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();

  let response: Response;
  try {
    response = await fetchImpl(FEATHERLESS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildRequestBody(transcript, model)),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timer);
    if (controller.signal.aborted) {
      throw new ExtractionFailure("timeout", `no reply from ${model} within ${timeoutMs} ms`);
    }
    throw new ExtractionFailure("network_error", (error as Error).message);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (error) {
    clearTimeout(timer);
    if (controller.signal.aborted) {
      throw new ExtractionFailure("timeout", `reply from ${model} cut off after ${timeoutMs} ms`);
    }
    throw new ExtractionFailure("http_error", `HTTP ${response.status} with a body that is not JSON`);
  }
  clearTimeout(timer);

  if (!response.ok) {
    const message =
      (body as { error?: { message?: string } } | null)?.error?.message ?? "no error message";
    throw new ExtractionFailure("http_error", `HTTP ${response.status}: ${message}`);
  }

  const reply = body as {
    model?: string;
    choices?: Array<{ message?: { content?: string | null }; finish_reason?: string }>;
  };
  const choice = reply.choices?.[0];
  const content = choice?.message?.content;
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new ExtractionFailure("unparseable", "the model returned no message content");
  }
  if (choice?.finish_reason === "length") {
    throw new ExtractionFailure("unparseable", "the reply hit the token limit before the JSON closed");
  }

  return { content, model: reply.model ?? model, latencyMs: Date.now() - started };
}
