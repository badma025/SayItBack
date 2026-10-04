# LLM extraction of the teach-back

The model fills slots from what was said. Code decides everything else.

```
transcript ──> POST /api/extract ──> Featherless (Qwen2.5-14B-Instruct)
                    │                        │ JSON: every value + a quote
                    │                        v
                    │                 ground.ts: quote in transcript? value in quote?
                    │                        │ rejected values listed, never kept
                    v                        v
             extractSpokenSlots ──> recall-guard.ts ──> gradeTeachBack (engine rules)
             (rules, unchanged)
```

## What the model is allowed to do

- **It sees the transcript only, never the letter.** It cannot copy the
  letter's 80mg into a slot that the person didn't fill.
- **Every value carries `evidence`, a span copied from the transcript.**
  `lib/extract/ground.ts` throws the value away when:
  - the span is not in the transcript, matched word for word (case,
    punctuation and spacing aside, and never starting or ending mid-word, so
    "eight" is not found in "eighty");
  - the value isn't visible in its own span. A dose of 80 must cite a span
    that says 80 or eighty, a timeframe of 14 must cite "two weeks", and a drug
    name must appear inside its span. The model may not turn "water tablet"
    into "furosemide"; the engine's lay-name dictionary does that, and it
    reports "water tablet" as ambiguous when the letter has two diuretics;
  - an enum is outside its list. That's how `kind: "confirmed"` and
    `direction: "confirmed"` from the injection test are caught.
- **Each item's `utterance` is a span too.** If it isn't in the transcript, the
  whole item is dropped.
- **Questions are kept in the person's words.** Any wording the model writes
  for a question is discarded, so nothing can be paraphrased into advice.
- **The model never grades.** The engine's comparator still re-reads every
  utterance with `parse.ts`, and a value only the model heard is `uncertain`,
  never `match`.

## The recall guard (`lib/extract/recall-guard.ts`)

The model's main contribution is cutting the transcript into one utterance
per item. In "Kwame takes furosemide 80mg every morning. If his weight jumps
2kg we ring 020 7946 0678…", the rules reading the whole transcript hear 2,
020, 7946 and 0678 as doses and mark the medicine unclear. With the model's
cut, the medicine is confirmed.

Narrowing what the rules read is also the risk, so three guards follow it:

1. **No number may go missing.** If a number in the transcript sits outside
   every utterance the model cut, the medicine items go back to reading
   everything said. A test shows a span that hides "it's still 40mg" would
   otherwise be confirmed.
2. **No item may go missing.** Any item kind the rules found and the model
   didn't is added back with empty slots, so only `parse.ts` reads it.
3. **No question may go missing.** Questions the rules caught are kept.

## Fallback

| failure | HTTP from `/api/extract` | UI |
| --- | --- | --- |
| no `FEATHERLESS_API_KEY` | 503 `no_api_key` | "Checked by rules only" |
| no reply in 15 s | 504 `timeout` | same, with the reason |
| Featherless error (404, 401, 5xx) | 502 `http_error` | same |
| connection failed | 502 `network_error` | same |
| no JSON / cut off at the token limit | 502 `unparseable` | same |

The browser gives up after 18 s, so the server's reason normally arrives
first. With no route at all (a static host), it still falls back.

## Choosing the model

Featherless reports a live state per model at `GET /v1/models/{id}`
(`availability.tier`: warm, loading, cold or offline), refreshed roughly every
5 minutes. A cold model can take 5–60 minutes to load. These were benchmarked
on 4 Oct 2026 with the seven fixture transcripts and the final prompt:

| model | tier | loaded now | concurrency cost | $/M in / out | total for 7 | values rejected |
| --- | --- | --- | --- | --- | --- | --- |
| **Qwen/Qwen2.5-14B-Instruct** | warm | yes | 1 | 0.11 / 0.28 | 14.5–18.8 s | 2 |
| Qwen/Qwen2.5-32B-Instruct | warm | yes | 2 | 0.68 / 1.20 | 28.9 s | 2 |
| mistralai/Mistral-Small-3.2-24B-Instruct-2506 | warm | yes | 2 | 0.22 / 0.40 | 15.5 s | 3 |
| Qwen/Qwen2.5-7B-Instruct | warm | no | 1 | 0.17 / 0.20 | 14.8 s | 3 |
| deepseek-ai/DeepSeek-V3.2 | offline | no | 4 | — | — | — |

"Loaded now" is `is_hot_live`: a worker had the model in memory at that
moment.

**Qwen2.5-14B-Instruct** is the default because:

- it was warm and loaded;
- it costs one concurrency unit, so the plan's limit isn't used up;
- it was the cheapest loaded model;
- it is not a thinking model, so the token budget goes on the JSON;
- on the judge scenarios, its only rejected value was a phone number put in
  the `contact` enum. Mistral-Small turned "once a day" into a dose of
  1 tablet (rejected), and the 7B model had more rejected values.

Each call uses about 880 tokens, so a check costs about $0.0001. Single calls
took 1.4–5 s, with one at 10 s, which is why the timeout is 15 s.

`FEATHERLESS_MODEL` overrides the default without a deploy. Check that the
replacement is warm first:

```bash
curl -H "Authorization: Bearer $FEATHERLESS_API_KEY" \
  https://api.featherless.ai/v1/models/Qwen/Qwen2.5-14B-Instruct
```

## Tests and recordings

`npm test` runs 43 tests with no network:

- **`recorded.test.ts`** replays real Featherless replies
  (`lib/extract/fixtures/featherless/`) through the route handler, then grades
  them against Kwame's letter. It covers the four judge scenarios, a negated
  dose, an ASR-mangled drug name and a prompt injection. Two Mistral replies
  are kept as real examples of the gate refusing output. Across every
  recording the false-confirm count is 0 against hand labels.
- **`fallback.test.ts`** checks every failure mode, including Featherless's
  real 404 and 401 error bodies (`fixtures/featherless-errors/`).
- **`ground.test.ts`** and **`recall-guard.test.ts`** hold one hand-written
  reply per rule.

Each recording stores a hash of the prompt. When the prompt changes, a test
fails until you re-record:

```bash
npm run record:extraction                    # default model, all transcripts
npx tsx scripts/record-extraction-fixtures.ts --bench a/model,b/model   # compare, write nothing
```

## Known gaps

- **Negation.** "It's not eighty, he stays on forty" is not confirmed. It
  shows as "couldn't make this out" rather than as a clear mismatch, because
  guard 1 widens the medicine back to both numbers.
- **The rules-only path (`extractSpokenSlots`) is keyword-based** and only
  knows letter 1's medicine. Some of its slots come from the letter rather
  than the transcript (for example 40mg for "like before"); the comparator
  marks those `uncertain`, so they can't confirm anything. Guard 2 empties
  those slots when it borrows an item.
- **Recordings are one sample per transcript at temperature 0.** The tests
  pin today's behaviour; they are not an accuracy estimate.
