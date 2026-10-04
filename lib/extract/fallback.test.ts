/**
 * Every way the model can fail ends in "rules only", with a reason the UI can
 * show. Featherless error bodies are real recordings; timeouts and dropped
 * connections are simulated.
 */

import { describe, expect, it, vi } from "vitest";
import { handleExtract, MAX_TRANSCRIPT_CHARS } from "./handler";
import { readTranscript } from "./client";
import { loadError, loadReply, replayFetch } from "./fixtures/recordings";
import type { ExtractResponse } from "./types";

const TRANSCRIPT = "I take the water tablet, once a day like before.";

async function extract(
  options: Parameters<typeof handleExtract>[1],
  body: unknown = { transcript: TRANSCRIPT },
) {
  const response = await handleExtract(
    new Request("http://test/api/extract", { method: "POST", body: JSON.stringify(body) }),
    options,
  );
  return { status: response.status, body: (await response.json()) as ExtractResponse };
}

/** A fetch that only ever ends by being aborted, like a model still cold-starting. */
function hangingFetch(): typeof fetch {
  return ((_url: string, init?: RequestInit) =>
    new Promise((_, reject) => {
      init?.signal?.addEventListener("abort", () =>
        reject(new DOMException("The operation was aborted.", "AbortError")),
      );
    })) as typeof fetch;
}

function modelReply(content: string, finishReason = "stop") {
  return replayFetch({
    recordedAt: "",
    model: "Qwen/Qwen2.5-14B-Instruct",
    status: 200,
    body: { model: "Qwen/Qwen2.5-14B-Instruct", choices: [{ message: { content }, finish_reason: finishReason }] },
  });
}

describe("/api/extract falls back", () => {
  it("without an API key, and never calls out", async () => {
    const fetchImpl = vi.fn();
    const { status, body } = await extract({ apiKey: undefined, fetchImpl });
    expect(status).toBe(503);
    expect(body).toMatchObject({ ok: false, reason: "no_api_key" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("when the model does not answer in time", async () => {
    const { status, body } = await extract({ apiKey: "k", timeoutMs: 30, fetchImpl: hangingFetch() });
    expect(status).toBe(504);
    expect(body).toMatchObject({ ok: false, reason: "timeout" });
  });

  it("on Featherless's real 'model not found' reply", async () => {
    const { status, body } = await extract({
      apiKey: "k",
      fetchImpl: replayFetch(loadError("model_not_found.json")),
    });
    expect(status).toBe(502);
    expect(body).toMatchObject({ ok: false, reason: "http_error" });
    expect(body.ok === false && body.detail).toContain("HTTP 404");
  });

  it("on Featherless's real 'unauthorized' reply", async () => {
    const { body } = await extract({ apiKey: "k", fetchImpl: replayFetch(loadError("unauthorized.json")) });
    expect(body).toMatchObject({ ok: false, reason: "http_error" });
    expect(body.ok === false && body.detail).toContain("HTTP 401");
  });

  it("when the connection fails", async () => {
    const fetchImpl = (() => Promise.reject(new TypeError("fetch failed"))) as typeof fetch;
    const { body } = await extract({ apiKey: "k", fetchImpl });
    expect(body).toMatchObject({ ok: false, reason: "network_error" });
  });

  it("when the reply has no JSON in it", async () => {
    const { body } = await extract({ apiKey: "k", fetchImpl: modelReply("I'm sorry, I can't do that.") });
    expect(body).toMatchObject({ ok: false, reason: "unparseable" });
  });

  it("when the reply was cut off by the token limit", async () => {
    const { body } = await extract({ apiKey: "k", fetchImpl: modelReply('{"items":[{"kind"', "length") });
    expect(body).toMatchObject({ ok: false, reason: "unparseable" });
  });

  it("refuses an empty or oversized transcript before calling out", async () => {
    const fetchImpl = vi.fn();
    expect((await extract({ apiKey: "k", fetchImpl }, { transcript: "  " })).status).toBe(400);
    expect(
      (await extract({ apiKey: "k", fetchImpl }, { transcript: "a".repeat(MAX_TRANSCRIPT_CHARS + 1) }))
        .status,
    ).toBe(400);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe("readTranscript in the browser", () => {
  const serverSays = (status: number, body: ExtractResponse) =>
    (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

  it("passes a model reading through", async () => {
    const recording = loadReply("wow_moment.json");
    const routeReply = await handleExtract(
      new Request("http://test/api/extract", {
        method: "POST",
        body: JSON.stringify({ transcript: recording.transcript }),
      }),
      { apiKey: "replayed", fetchImpl: replayFetch(recording) },
    );
    const fetchImpl = (async () => routeReply) as unknown as typeof fetch;
    const { extraction, source } = await readTranscript(recording.transcript, { fetchImpl });
    expect(source).toMatchObject({ mode: "model", model: "Qwen/Qwen2.5-14B-Instruct" });
    expect(extraction?.items).toHaveLength(1);
  });

  it("reports the server's reason when it fell back", async () => {
    const { extraction, source } = await readTranscript(TRANSCRIPT, {
      fetchImpl: serverSays(504, { ok: false, reason: "timeout", detail: "no reply within 15000 ms" }),
    });
    expect(extraction).toBeNull();
    expect(source).toEqual({ mode: "rules_only", reason: "timeout", detail: "no reply within 15000 ms" });
  });

  it("gives up on its own if the server is slower than the client timeout", async () => {
    const { source } = await readTranscript(TRANSCRIPT, { timeoutMs: 30, fetchImpl: hangingFetch() });
    expect(source).toMatchObject({ mode: "rules_only", reason: "timeout" });
  });

  it("falls back when there is no API route at all, e.g. a static export", async () => {
    const fetchImpl = (async () => new Response("<!doctype html>", { status: 404 })) as unknown as typeof fetch;
    const { source } = await readTranscript(TRANSCRIPT, { fetchImpl });
    expect(source).toMatchObject({ mode: "rules_only", reason: "network_error" });
  });
});
