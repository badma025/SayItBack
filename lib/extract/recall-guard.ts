/**
 * The recall guard: the model's reading may add precision, never lose things.
 *
 * The model's main contribution is segmentation. It cuts the transcript into
 * one utterance per item, so `parse.ts` reads "80mg every morning" for the
 * medicine instead of the whole transcript with a phone number and "2kg" in
 * it. That narrowing is also the risk: a span chosen around the right number
 * could hide the wrong one. So after the model has spoken:
 *
 * 1. **No number may go missing.** If a number in the transcript sits outside
 *    every utterance the model cut, the medicine items go back to reading the
 *    whole transcript, and `parse.ts` sees every dose that was said.
 * 2. **No item may go missing.** Any kind of item the rules found and the model
 *    did not is added back, with its slots emptied, so `parse.ts` on the
 *    utterance is the only thing reading it.
 * 3. **No question may go missing.** Questions the rules caught are kept too.
 *
 * Grading is untouched: `gradeTeachBack` in the engine still decides every
 * verdict.
 */

import { normalise, parseDoses, type SpokenExtraction, type SpokenItem } from "@sayitback/engine";
import { indexOfPhrase } from "./ground";

export interface GuardNote {
  code: "numbers_outside_spans" | "item_added_from_rules" | "question_added_from_rules";
  detail: string;
}

export interface GuardedExtraction {
  extraction: SpokenExtraction;
  notes: GuardNote[];
}

/** Numbers in the transcript that no item's utterance covers. */
export function numbersOutsideSpans(transcript: string, items: readonly SpokenItem[]): string[] {
  let rest = normalise(transcript);
  for (const item of items) {
    const span = normalise(item.utterance);
    const index = indexOfPhrase(rest, span);
    if (index !== -1) {
      rest = `${rest.slice(0, index)} ${" ".repeat(span.length)} ${rest.slice(index + span.length)}`;
    }
  }
  // Any unit stands in for "no unit said"; what matters is the number itself.
  return parseDoses(rest, "mg").map((dose) => String(dose.value));
}

function overlaps(a: string, b: string): boolean {
  const left = normalise(a);
  const right = normalise(b);
  return left.includes(right) || right.includes(left);
}

export function applyRecallGuard(
  model: SpokenExtraction,
  rules: SpokenExtraction,
): GuardedExtraction {
  const notes: GuardNote[] = [];
  const transcript = model.transcript;

  let items: SpokenItem[] = model.items;
  const stray = numbersOutsideSpans(transcript, items);
  if (stray.length > 0) {
    notes.push({
      code: "numbers_outside_spans",
      detail: `the model's reading left out ${stray.join(", ")}, so medicines were checked against everything said`,
    });
    items = items.map((item) =>
      item.kind === "medication_change" ? { ...item, utterance: transcript } : item,
    );
  }

  const kindsRead = new Set(items.map((item) => item.kind));
  for (const item of rules.items) {
    if (kindsRead.has(item.kind)) continue;
    kindsRead.add(item.kind);
    items = [...items, { ...item, id: `rules-${item.id}`, slots: {} }];
    notes.push({
      code: "item_added_from_rules",
      detail: `the model found no ${item.kind.replace(/_/g, " ")}; the rules did`,
    });
  }

  const questions = [...model.questions];
  for (const question of rules.questions) {
    if (questions.some((kept) => overlaps(kept.utterance, question.utterance))) continue;
    questions.push({ ...question, id: `rules-${question.id}` });
    notes.push({ code: "question_added_from_rules", detail: `"${question.utterance}"` });
  }

  return {
    extraction: {
      transcript,
      items,
      questions,
      ...(rules.transcriptEdited !== undefined ? { transcriptEdited: rules.transcriptEdited } : {}),
    },
    notes,
  };
}
