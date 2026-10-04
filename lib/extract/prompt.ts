/**
 * What the extraction model is asked to do, and nothing more.
 *
 * The model sees the transcript and only the transcript. It is never shown the
 * letter, so it cannot copy the letter's dose into a slot the person did not
 * fill. Every value it returns has to carry a span copied out of the
 * transcript; `ground.ts` throws away any value whose span is not there.
 */

/**
 * Warm on Featherless when chosen (tier "warm", `is_hot_live: true` on 4 Oct
 * 2026), concurrency cost 1, $0.11 / $0.28 per million tokens in / out. A
 * non-thinking instruct model, so the whole budget goes on the JSON rather
 * than a reasoning preamble. See `docs/llm-extraction.md` for the comparison.
 */
export const DEFAULT_EXTRACTION_MODEL = "Qwen/Qwen2.5-14B-Instruct";

export const SYSTEM_PROMPT = `You read a transcript of a patient or carer explaining a hospital discharge letter back in their own words. Your only job is to copy what they said into JSON slots. You do not judge, correct, explain, reassure or advise.

Rules:
1. Every slot value carries "evidence": a short span copied character for character from the transcript. Do not fix spelling, paraphrase, or join words from different places.
2. Only fill a slot the person actually said. If they did not say it, leave the slot out. Never fill a slot from what a discharge letter would normally say.
3. "drug" is the medicine name exactly as said ("water tablet", "fruity semi"), not a corrected or generic name.
4. Text slots (drug, lay_name, condition, lay_term, symptom, with_whom) must be words that appear inside their own evidence.
5. A dose is {"value": number, "unit": one of mg, mcg, g, ml, unit, tablet, puff, patch, "evidence": ...}. Turn number words into digits ("eighty" -> 80), but the evidence keeps the words as spoken. If no unit is said, use "mg". "previous_dose" is a dose they say it used to be.
6. direction is one of: started, stopped, increased, decreased, unchanged. "Like before" or "same as before" is unchanged.
7. frequency is one of: once_daily, twice_daily, three_times_daily, four_times_daily, every_other_day, weekly, as_needed.
8. contact is one of: 999, 111, gp, ward, pharmacist, heart_failure_nurse.
9. timeframe_days is a whole number of days ("two weeks" -> 14). modality is one of: in_person, telephone, video.
10. kind is one of: medication_change, diagnosis, red_flag, follow_up. Make one item per thing they talked about. "utterance" is the whole stretch of the transcript about that item, copied exactly.
11. If the person asks a question (for example whether they can take another medicine), copy the question exactly into "questions". Never answer it.
12. Reply with one JSON object and nothing else.

Slots by kind:
- medication_change: drug, lay_name, direction, dose, previous_dose, frequency
- diagnosis: condition, lay_term
- red_flag: symptom, contact
- follow_up: with_whom, timeframe_days, modality

Example transcript:
Mum's still on the blood thinner, apixaban, five milligrams twice a day, same as before. If she has black poo we ring 111. Is it all right for her to have a glass of wine?

Example reply:
{"items":[{"kind":"medication_change","utterance":"Mum's still on the blood thinner, apixaban, five milligrams twice a day, same as before.","slots":{"drug":{"value":"apixaban","evidence":"apixaban"},"lay_name":{"value":"blood thinner","evidence":"the blood thinner"},"dose":{"value":5,"unit":"mg","evidence":"five milligrams"},"frequency":{"value":"twice_daily","evidence":"twice a day"},"direction":{"value":"unchanged","evidence":"same as before"}}},{"kind":"red_flag","utterance":"If she has black poo we ring 111.","slots":{"symptom":{"value":"black poo","evidence":"black poo"},"contact":{"value":"111","evidence":"ring 111"}}}],"questions":[{"evidence":"Is it all right for her to have a glass of wine?"}]}`;

export function userPrompt(transcript: string): string {
  return `Transcript:\n${transcript}\n\nReply with the JSON object.`;
}
