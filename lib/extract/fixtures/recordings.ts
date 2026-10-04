/**
 * Loads the recorded Featherless replies and replays them as `fetch`.
 * Test-only; recorded with `npm run record:extraction`.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface Recording {
  recordedAt: string;
  model: string;
  /** Present on replies to the extraction prompt; absent on recorded errors. */
  promptHash?: string;
  transcript?: string;
  status: number;
  body: unknown;
}

const REPLIES = join(__dirname, "featherless");
const ERRORS = join(__dirname, "featherless-errors");

export function replyFiles(): string[] {
  return readdirSync(REPLIES).filter((name) => name.endsWith(".json"));
}

export function loadReply(name: string): Recording & { transcript: string; promptHash: string } {
  return JSON.parse(readFileSync(join(REPLIES, name), "utf8"));
}

export function loadError(name: string): Recording {
  return JSON.parse(readFileSync(join(ERRORS, name), "utf8"));
}

/** The assistant message text inside a recorded reply. */
export function contentOf(recording: Recording): string {
  return (recording.body as { choices: Array<{ message: { content: string } }> }).choices[0]!.message
    .content;
}

/** A `fetch` that answers every request with the recorded HTTP status and body. */
export function replayFetch(recording: Recording): typeof fetch & { calls: number } {
  const replay = async () => {
    replay.calls += 1;
    return new Response(JSON.stringify(recording.body), {
      status: recording.status,
      headers: { "Content-Type": "application/json" },
    });
  };
  replay.calls = 0;
  return replay as unknown as typeof fetch & { calls: number };
}
