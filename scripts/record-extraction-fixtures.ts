/**
 * Record real Featherless replies for the extraction tests.
 *
 *   npx tsx scripts/record-extraction-fixtures.ts                 # record with the default model
 *   npx tsx scripts/record-extraction-fixtures.ts --bench a,b     # compare models, write nothing
 *   npx tsx scripts/record-extraction-fixtures.ts --model m --only wow_moment
 *                                     # record another model's reply as <id>.<model>.json
 *
 * Reads FEATHERLESS_API_KEY from the environment or .env.local. Each fixture
 * stores the raw HTTP body and a hash of the prompt, so a test fails loudly
 * when the prompt changes and the recordings no longer describe it.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { FEATHERLESS_URL, buildRequestBody } from "../lib/extract/featherless";
import { DEFAULT_EXTRACTION_MODEL } from "../lib/extract/prompt";
import { promptHash } from "../lib/extract/fixtures/prompt-hash";
import { groundExtraction } from "../lib/extract/ground";
import { FIXTURE_TRANSCRIPTS } from "../lib/extract/fixtures/transcripts";

const OUT_DIR = join(__dirname, "..", "lib", "extract", "fixtures", "featherless");

function apiKey(): string {
  if (process.env.FEATHERLESS_API_KEY) return process.env.FEATHERLESS_API_KEY;
  const envFile = join(__dirname, "..", ".env.local");
  if (existsSync(envFile)) {
    const line = readFileSync(envFile, "utf8")
      .split(/\r?\n/)
      .find((l) => l.startsWith("FEATHERLESS_API_KEY="));
    if (line) return line.slice("FEATHERLESS_API_KEY=".length).trim();
  }
  throw new Error("FEATHERLESS_API_KEY is not set");
}

async function run(model: string, write: boolean, only: string[] = []) {
  const key = apiKey();
  let totalMs = 0;
  let rejected = 0;
  const transcripts = FIXTURE_TRANSCRIPTS.filter((f) => only.length === 0 || only.includes(f.id));
  for (const { id, transcript } of transcripts) {
    const started = Date.now();
    const response = await fetch(FEATHERLESS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(buildRequestBody(transcript, model)),
    });
    const latencyMs = Date.now() - started;
    totalMs += latencyMs;
    const body = await response.json();
    const content: string = body?.choices?.[0]?.message?.content ?? "";

    let summary: string;
    try {
      const grounded = groundExtraction(content, transcript);
      rejected += grounded.rejected.length;
      summary = `${grounded.extraction.items.length} items, ${grounded.extraction.questions.length} questions, ${grounded.rejected.length} rejected`;
    } catch (error) {
      summary = `UNPARSEABLE: ${(error as Error).message}`;
    }
    console.log(`${model}  ${id.padEnd(18)} HTTP ${response.status}  ${latencyMs} ms  ${summary}`);

    if (write) {
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(
        join(OUT_DIR, fixtureFileName(id, model)),
        JSON.stringify(
          {
            recordedAt: new Date().toISOString(),
            model,
            promptHash: promptHash(),
            transcript,
            latencyMs,
            status: response.status,
            body,
          },
          null,
          2,
        ) + "\n",
      );
    }
  }
  console.log(`${model}  total ${totalMs} ms, ${rejected} values rejected\n`);
}

/** The default model's recordings are `<id>.json`; any other model's carry its name. */
function fixtureFileName(id: string, model: string): string {
  if (model === DEFAULT_EXTRACTION_MODEL) return `${id}.json`;
  const slug = model.split("/").pop()!.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  return `${id}.${slug}.json`;
}

function argument(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const bench = argument("--bench");
  if (bench !== undefined) {
    const models = bench.split(",");
    for (const model of models) await run(model, false);
    return;
  }
  const only = argument("--only")?.split(",") ?? [];
  await run(argument("--model") ?? DEFAULT_EXTRACTION_MODEL, true, only);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
