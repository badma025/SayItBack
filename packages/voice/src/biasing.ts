/**
 * ASR biasing: snap transcript words to drug names found in the letter.
 *
 * transformers.js does not support Whisper prompt tokens (`prompt_ids` is commented
 * out in its generate()), so we cannot prime the decoder with the letter's drugs.
 * Instead we post-correct the transcript, and we do it conservatively: a wrong snap
 * (patient says "amiodarone", letter says "amlodipine") would turn a miss into a
 * false "confirmed", which is the one number we are judged on.
 *
 * A window of 1-3 words is snapped only when ALL of these hold:
 *   - it is not already exactly a letter drug;
 *   - it is at least MIN_TERM_LENGTH characters once joined;
 *   - it scores >= SNAP_THRESHOLD against exactly one letter drug (the runner-up
 *     must trail by AMBIGUITY_MARGIN);
 *   - it is not itself a recognised *other* drug (the guard list, plus any extras).
 *
 * Every snap is returned so the UI can show it and the user can edit the transcript.
 */

export interface Snap {
  /** Text as Whisper wrote it. */
  from: string;
  /** Letter drug name it was corrected to. */
  to: string;
  /** Character offsets of `from` in the original transcript. */
  start: number;
  end: number;
  score: number;
}

export interface BiasResult {
  text: string;
  snaps: Snap[];
}

export interface BiasOptions {
  /** Extra drug names that are NOT in this letter and must never be snapped onto one that is. */
  otherDrugs?: readonly string[];
  threshold?: number;
}

export const MIN_TERM_LENGTH = 5;
export const SNAP_THRESHOLD = 0.8;
export const AMBIGUITY_MARGIN = 0.05;
const MAX_WINDOW_WORDS = 3;

/**
 * Common UK discharge drugs. Used only as a negative guard so that a spoken drug
 * which is real, but not in the letter, is left alone instead of snapped onto a
 * look-alike that is in the letter. Spelling variants of one drug (frusemide) are left
 * out on purpose: snapping them onto the letter's furosemide is correct.
 */
export const COMMON_DRUGS: readonly string[] = [
  "furosemide", "bumetanide", "spironolactone", "eplerenone", "bisoprolol",
  "carvedilol", "metoprolol", "atenolol", "propranolol", "ramipril", "lisinopril",
  "enalapril", "perindopril", "candesartan", "losartan", "valsartan", "sacubitril",
  "amlodipine", "amiodarone", "nifedipine", "diltiazem", "verapamil", "digoxin",
  "warfarin", "apixaban", "rivaroxaban", "edoxaban", "dabigatran", "clopidogrel",
  "aspirin", "ticagrelor", "atorvastatin", "simvastatin", "rosuvastatin", "pravastatin",
  "ezetimibe", "isosorbide", "nicorandil", "ivabradine", "dapagliflozin", "empagliflozin",
  "metformin", "gliclazide", "insulin", "levothyroxine", "omeprazole", "lansoprazole",
  "pantoprazole", "paracetamol", "ibuprofen", "naproxen", "diclofenac", "codeine",
  "morphine", "tramadol", "amoxicillin", "clarithromycin", "doxycycline", "prednisolone",
  "salbutamol", "tamsulosin", "finasteride", "allopurinol", "colchicine", "hydralazine",
  "hydroxyzine", "hydroxychloroquine", "potassium", "senna", "lactulose", "sertraline",
  "citalopram", "mirtazapine", "amitriptyline", "gabapentin", "pregabalin", "lorazepam",
  "diazepam", "zopiclone",
];

/** Lowercase, drop diacritics (Whisper sometimes emits "fjösemede"), strip non-letters. */
function letters(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

/** Crude English-ish phonetic key: enough to equate "frusemide"/"furosemide" style variants. */
export function phoneticKey(word: string): string {
  let s = letters(word);
  s = s
    .replace(/ph/g, "f")
    .replace(/ck/g, "k")
    .replace(/c(?=[eiy])/g, "s")
    .replace(/c/g, "k")
    .replace(/q/g, "k")
    .replace(/z/g, "s")
    .replace(/x/g, "ks")
    .replace(/y/g, "i")
    .replace(/(?<=.)h/g, "")
    .replace(/(.)\1+/g, "$1");
  // Vowels carry most of the ASR noise; keep the first, collapse the rest to one class.
  return s[0] + s.slice(1).replace(/[aeiou]/g, "a").replace(/a+/g, "a");
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[b.length];
}

function similarity(a: string, b: string): number {
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - levenshtein(a, b) / max;
}

/** 0..1 similarity between a heard string and a drug name. */
export function termScore(heard: string, drug: string): number {
  const h = letters(heard);
  const d = letters(drug);
  if (!h || !d) return 0;
  const raw = similarity(h, d);
  // Phonetic keys are shorter, so they match more loosely; discount them so a
  // phonetic-only hit has to be very close to clear the threshold.
  const phon = similarity(phoneticKey(h), phoneticKey(d)) * 0.95;
  return Math.max(raw, phon);
}

interface Word {
  text: string;
  start: number;
  end: number;
}

function words(text: string): Word[] {
  const out: Word[] = [];
  for (const m of text.matchAll(/\p{L}[\p{L}\p{M}'-]*/gu)) {
    out.push({ text: m[0], start: m.index!, end: m.index! + m[0].length });
  }
  return out;
}

/** Drug names from a letter, deduped, lowercase, long enough to snap safely. */
export function normaliseVocabulary(drugs: readonly string[]): string[] {
  const seen = new Set<string>();
  for (const d of drugs) {
    const l = letters(d);
    if (l.length >= MIN_TERM_LENGTH) seen.add(l);
  }
  return [...seen];
}

export function biasTranscript(
  transcript: string,
  letterDrugs: readonly string[],
  opts: BiasOptions = {},
): BiasResult {
  const vocab = normaliseVocabulary(letterDrugs);
  if (!vocab.length || !transcript.trim()) return { text: transcript, snaps: [] };

  const threshold = opts.threshold ?? SNAP_THRESHOLD;
  const vocabSet = new Set(vocab);
  const others = [...COMMON_DRUGS, ...(opts.otherDrugs ?? [])]
    .map(letters)
    .filter((d) => d.length >= MIN_TERM_LENGTH && !vocabSet.has(d));

  /** Best letter drug for a heard string, or null if nothing clears every guard. */
  const match = (h: string): { to: string; score: number } | null => {
    // A different, real drug: leave it alone even if it resembles a letter drug.
    if (others.some((o) => termScore(h, o) >= 0.95)) return null;
    const ranked = vocab
      .map((d) => ({ d, score: termScore(h, d) }))
      .sort((a, b) => b.score - a.score);
    const [best, second] = ranked;
    if (best.score < threshold) return null;
    if (second && best.score - second.score < AMBIGUITY_MARGIN) return null;
    // Closer to some other known drug than to ours: don't guess.
    if (others.some((o) => termScore(h, o) > best.score)) return null;
    return { to: best.d, score: best.score };
  };

  // Already written exactly as a letter drug (plain lowercase-able ASCII, so "bisöprolol"
  // is not "exact" and still gets normalised).
  const isWholeDrug = (w: Word) => {
    const l = w.text.toLowerCase();
    return vocabSet.has(l);
  };

  const ws = words(transcript);
  const snaps: Snap[] = [];
  let i = 0;
  while (i < ws.length) {
    // Already a correct drug name: leave it, and never merge it into a longer window.
    if (isWholeDrug(ws[i])) {
      i += 1;
      continue;
    }
    // Score every window at this position and keep the best, not the longest: otherwise
    // "furosemid in" would swallow "in". Longer windows must be pure fragments (whitespace
    // between them, none already a drug name), which is how Whisper splits an unknown drug.
    let chosen: { len: number; to: string; score: number } | null = null;
    for (let len = 1; len <= Math.min(MAX_WINDOW_WORDS, ws.length - i); len++) {
      const slice = ws.slice(i, i + len);
      if (len > 1) {
        const contiguous = slice.every(
          (w, k) => k === 0 || /^\s+$/.test(transcript.slice(slice[k - 1].end, w.start)),
        );
        const hasWholeDrug = slice.some(isWholeDrug);
        if (!contiguous || hasWholeDrug) break;
      }
      const h = letters(slice.map((w) => w.text).join(""));
      if (h.length < MIN_TERM_LENGTH) continue;
      const m = vocabSet.has(h) ? { to: h, score: 1 } : match(h);
      if (m && (!chosen || m.score > chosen.score)) chosen = { len, ...m };
    }
    if (chosen) {
      const first = ws[i];
      const last = ws[i + chosen.len - 1];
      snaps.push({
        from: transcript.slice(first.start, last.end),
        to: chosen.to,
        start: first.start,
        end: last.end,
        score: chosen.score,
      });
      i += chosen.len;
    } else {
      i += 1;
    }
  }

  // Apply right to left so offsets stay valid. Snapped names are lowercase;
  // transcripts are compared case-insensitively downstream.
  let text = transcript;
  for (const s of [...snaps].reverse()) {
    text = text.slice(0, s.start) + s.to + text.slice(s.end);
  }
  return { text, snaps };
}

/**
 * Fraction of expected drug mentions that appear verbatim (case-insensitive,
 * whole word) in a hypothesis. 1 - this is the drug-name error rate we report
 * with and without biasing.
 */
export function drugNameRecall(expected: readonly string[], hypothesis: string): number {
  if (!expected.length) return 1;
  const hyp = new Set(words(hypothesis).map((w) => letters(w.text)));
  const hit = expected.filter((d) => hyp.has(letters(d))).length;
  return hit / expected.length;
}
