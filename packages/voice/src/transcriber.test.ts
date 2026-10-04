import { describe, expect, it } from "vitest";
import type { WorkerRequest, WorkerResponse } from "./protocol";
import { createTranscriber } from "./transcriber";

/** Minimal Worker stand-in; `script` decides how it answers each request. */
function fakeWorker(script: (msg: WorkerRequest, reply: (r: WorkerResponse) => void) => void) {
  const w = {
    onmessage: null as ((e: MessageEvent<WorkerResponse>) => void) | null,
    onerror: null,
    terminated: false,
    postMessage(msg: WorkerRequest) {
      queueMicrotask(() => script(msg, (r) => w.onmessage?.({ data: r } as MessageEvent<WorkerResponse>)));
    },
    terminate() {
      w.terminated = true;
    },
  };
  return w;
}

const okScript =
  (heard: string) => (msg: WorkerRequest, reply: (r: WorkerResponse) => void) => {
    if (msg.type === "load") {
      reply({ type: "progress", fraction: 0.5 });
      reply({ type: "ready", model: "fake", device: "wasm" });
    } else {
      reply({ type: "result", id: msg.id, text: heard });
    }
  };

describe("createTranscriber", () => {
  it("loads, reports progress, then transcribes with drug-name biasing", async () => {
    const t = createTranscriber({
      createWorker: () => fakeWorker(okScript("the fura semide at bisoprolal")) as unknown as Worker,
    });
    const states: string[] = [];
    t.subscribe((s) => states.push(`${s.status}:${s.progress}`));

    const r = await t.transcribe(new Float32Array(16), ["furosemide", "bisoprolol"]);
    expect(r.raw).toBe("the fura semide at bisoprolal");
    expect(r.text).toBe("the furosemide at bisoprolol");
    expect(r.snaps.map((s) => s.to)).toEqual(["furosemide", "bisoprolol"]);
    expect(states).toContain("loading:0.5");
    expect(t.getState().status).toBe("ready");
  });

  it("returns raw text unchanged when the letter has no drugs", async () => {
    const t = createTranscriber({
      createWorker: () => fakeWorker(okScript("fura semide")) as unknown as Worker,
    });
    const r = await t.transcribe(new Float32Array(16), []);
    expect(r).toMatchObject({ raw: "fura semide", text: "fura semide", snaps: [] });
  });

  it("surfaces a failed model load as an error state and allows a retry", async () => {
    let attempt = 0;
    const t = createTranscriber({
      createWorker: () =>
        fakeWorker((msg, reply) => {
          if (msg.type !== "load") return;
          attempt++;
          if (attempt === 1) reply({ type: "error", message: "offline" });
          else reply({ type: "ready", model: "fake", device: "wasm" });
        }) as unknown as Worker,
    });
    await expect(t.load()).rejects.toThrow("offline");
    expect(t.getState()).toMatchObject({ status: "error", error: "offline" });
    await expect(t.load()).resolves.toBeUndefined();
    expect(t.getState().status).toBe("ready");
  });

  it("rejects a failed transcription but stays usable", async () => {
    let n = 0;
    const t = createTranscriber({
      createWorker: () =>
        fakeWorker((msg, reply) => {
          if (msg.type === "load") reply({ type: "ready", model: "fake", device: "wasm" });
          else if (++n === 1) reply({ type: "error", id: msg.id, message: "decode failed" });
          else reply({ type: "result", id: msg.id, text: "ok" });
        }) as unknown as Worker,
    });
    await expect(t.transcribe(new Float32Array(4), [])).rejects.toThrow("decode failed");
    expect(t.getState().status).toBe("ready");
    expect((await t.transcribe(new Float32Array(4), [])).text).toBe("ok");
  });

  it("terminates the worker on dispose", async () => {
    const w = fakeWorker(okScript("x"));
    const t = createTranscriber({ createWorker: () => w as unknown as Worker });
    await t.load();
    t.dispose();
    expect(w.terminated).toBe(true);
  });
});
