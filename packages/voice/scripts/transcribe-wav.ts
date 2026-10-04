/**
 * Transcribe a 16 kHz mono 16-bit WAV with the same core the browser worker uses,
 * and print the transcript with and without drug-name biasing.
 *
 *   npx tsx scripts/transcribe-wav.ts <file.wav> <drug> [<drug> ...]
 */
import { readFileSync } from "node:fs";
import { biasTranscript } from "../src/biasing";
import { loadWhisper } from "../src/whisperCore";

function readWav16kMono(path: string): Float32Array {
  const buf = readFileSync(path);
  const dataAt = buf.indexOf("data", 12, "ascii");
  if (dataAt < 0) throw new Error("not a WAV file");
  const rate = buf.readUInt32LE(24);
  const channels = buf.readUInt16LE(22);
  const bits = buf.readUInt16LE(34);
  if (rate !== 16000 || channels !== 1 || bits !== 16) {
    throw new Error(`need 16 kHz mono 16-bit, got ${rate} Hz / ${channels} ch / ${bits}-bit`);
  }
  const size = buf.readUInt32LE(dataAt + 4);
  const n = Math.min(size, buf.length - dataAt - 8) / 2;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = buf.readInt16LE(dataAt + 8 + i * 2) / 32768;
  return out;
}

const [file, ...drugs] = process.argv.slice(2);
if (!file) {
  console.error("usage: tsx scripts/transcribe-wav.ts <file.wav> <drug> ...");
  process.exit(1);
}

let lastPct = -10;
const t0 = Date.now();
const whisper = await loadWhisper({
  model: process.env.SIB_MODEL,
  device: "cpu",
  onProgress: (p) => process.stderr.write(`\rloading ${(p.fraction * 100).toFixed(0)}%`),
});
process.stderr.write(`\nmodel ${whisper.model} loaded in ${Date.now() - t0} ms\n`);

const t1 = Date.now();
const raw = await whisper.run(readWav16kMono(file));
const { text, snaps } = biasTranscript(raw, drugs);
console.log(`raw     : ${raw}`);
console.log(`biased  : ${text}`);
console.log(`snaps   : ${JSON.stringify(snaps)}`);
console.log(`decode  : ${Date.now() - t1} ms`);
