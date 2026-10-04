# @sayitback/voice

Teach-back capture: in-browser Whisper, drug-name biasing, and typing as the fallback.
Audio never leaves the device (no Web Speech API, no server STT).

```tsx
import { TeachBackInput } from "@sayitback/voice";

<TeachBackInput
  letterDrugs={["furosemide", "bisoprolol"]}   // drug names found in the letter
  onSubmit={({ text, source, edited, raw, snaps }) => grade(text)}
/>
```

`onSubmit` gives the final text the user has seen and been free to edit, plus the raw
Whisper output and every correction made, so nothing is hidden from the grader or the UI.

## How it works

| File | Role |
| --- | --- |
| `whisperCore.ts` | transformers.js pipeline (`onnx-community/whisper-base.en`, q8; falls back to `Xenova/whisper-tiny.en`). Shared by the browser worker and the Node script, so what we measure is what ships. |
| `whisper.worker.ts` | Runs it off the main thread. WebGPU if an adapter exists, else WASM. |
| `audio.ts` | `MediaRecorder` → `decodeAudioData` → 16 kHz mono. Works with Safari's mp4 as well as webm. |
| `transcriber.ts` | Main-thread client: load state and progress, retry after a failed load, biasing on the result. |
| `biasing.ts` | Snaps transcript words to the letter's drug names. Pure, no I/O. |
| `TeachBackInput.tsx` | Mic button, progress, always-visible editable textarea, list of corrections. |

### Biasing is post-correction, not decoder prompting

transformers.js does not support Whisper prompt tokens (`prompt_ids` is commented out in its
`generate()`), so we cannot prime the model with the letter's drugs. We correct afterwards,
and conservatively, because a wrong snap onto a look-alike turns a miss into a false
"confirmed". A 1-3 word window is snapped only if it:

- is ≥ 5 letters, and not already exactly a letter drug;
- scores ≥ 0.8 (edit distance, or phonetic key discounted by 5%) against **exactly one**
  letter drug, with the runner-up ≥ 0.05 behind;
- is not itself a known *other* drug (a built-in list of common UK drugs, extendable via
  `otherDrugs`): "amiodarone" is never snapped onto "amlodipine";
- if multi-word, is a pure fragment: whitespace between words, none already a drug name.
  This is what stops `furosemide 80 mg` or `furosemid in` from swallowing the dose or a
  neighbouring word (both were bugs caught by tests).

Results are returned as `{ raw, text, snaps }`, so biasing can be ablated
(`drugNameRecall(expected, raw)` vs `drugNameRecall(expected, text)`).

## Tests and checks

```
npm test                  # 26 unit tests: biasing guards, transcriber state machine
npm run typecheck
npx tsx scripts/transcribe-wav.ts <16k-mono.wav> furosemide bisoprolol   # real Whisper in Node
npx vite --config harness/vite.config.ts                                  # then:
node scripts/e2e-browser.mjs scripts/out/sample.wav   # real Chrome, WAV as fake mic
node scripts/e2e-fallback.mjs                         # mic denied → typing still submits
```

## What works / what doesn't (measured 4 Oct, n = 1 synthetic voice: read as a smoke test, not an eval)

Worked, verified end to end in Chrome (Windows) and in Node:

- mic → worker → Whisper → biasing → editable text → submit; mic-denied → typed submit.
- `bisoprolol` mis-heard as `Bysoprolol` / `biceprolol` / `buy Sepulol` was corrected in all
  three models tried (tiny.en, base.en, small.en).

Did not work:

- **`furosemide`, the golden-path drug, was not recovered.** Heard as `Fiosa Med`,
  `fjösemede`, `fiosemmede`, `fusi-mete` across tiny/base/small. These are ~0.5-0.7 similar to
  the target, below the 0.8 threshold, so the guards correctly refused to guess. Larger
  models did not help (small.en was ~2× slower and no better). The source was a Windows SAPI
  synthetic voice, which is not representative of Kwame, so this is unmeasured on real speech.
  Lowering the threshold would likely catch these but also raises false-snap risk; that
  trade-off should be set from the labelled recordings and the false-confirm count, not from
  this sample. `threshold` is a `BiasOptions` field for that sweep.
- Whatever slips through is safe by construction downstream: the user sees and can edit the
  transcript, and the comparator treats anything uncertain as "missed".

Not verified:

- Firefox and Safari (only Chrome was driven), real mobile devices, real older voices.
- Which device (WebGPU vs WASM) was used in the Chrome run.
- Latency in a browser: Node CPU took ~10 s to decode ~9 s of speech with base.en
  (model load ~10 s the first time, then cached by the browser).
- Offline use: onnxruntime-web fetches its WASM from a CDN by default, and the model comes
  from the Hugging Face Hub. A no-network demo needs both self-hosted (`env.backends.onnx.wasm.wasmPaths`,
  `env.localModelPath`).
- Numbers and units ("80mg" vs "eighty milligrams") are not normalised here; that belongs to
  the comparator.
