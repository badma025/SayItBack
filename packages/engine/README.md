# Say It Back — engine

The part of Say It Back that decides. No network, no model calls, no state: the
letter and the transcript go in, the receipt comes out.

```
letter text ─┐
             ├─> verifyLetterExtraction ─> VerifiedLetter ─┐
model slots ─┘        (quotes must be real)                ├─> gradeTeachBack ─> Receipt
                                                           │        (rules decide)
transcript + model slots ─────────> SpokenExtraction ──────┘
                                                                    └─> reteachPlan (quote only)
```

## The one rule

**The LLM fills slots. Deterministic code decides.**

A model never emits a grade, a score or a confidence. It emits enums, numbers
and spans copied from the source — see `LETTER_EXTRACTION_SCHEMA` in
`schema.ts`, which has no field a verdict could live in. Everything downstream
is ordinary code with unit tests.

## Three gates, in order

### 1. The quote has to be in the letter (`evidence.ts`)

Approximate substring matching finds the best window in one pass, and then two
checks run on it:

- **Digits may not drift.** A fuzzy match that turns "40mg" into "80mg" is one
  character away and 40 milligrams wrong, so a quote's numbers must all appear
  in the span the letter really contains. This is the photographed-letter
  failure mode from the pre-mortem.
- **Slots must be grounded in their own quote.** An item asserting an 80mg dose
  whose quote never says 80 is rejected; an item saying `increased` whose quote
  reads "reduce to" is rejected. A direction the quote is merely silent about
  gets a warning, not a rejection.

Items that fail are not dropped. They become `checkWithWard`, because a
silently dropped medicine change is exactly what leaves a receipt wrongly all
green.

### 2. Slots are compared by rules, not by a reader (`comparator.ts`)

Every slot is filled twice: once by the extraction model, once by
`parse.ts` reading the transcript directly. Then:

| model | rules | verdict can be |
| --- | --- | --- |
| agrees with rules | found a value | `match` or `mismatch` |
| disagrees with rules | found a value | `uncertain` |
| filled a value | found nothing | `uncertain` — never `match` |
| nothing | nothing | `absent` |

So a lenient model cannot confirm a dose the recording does not contain.

Identity is handled by a lay-name dictionary (`lay-names.ts`): "water tablet"
is furosemide *and* spironolactone, so it resolves only when one of them is in
this letter, and reports `ambiguous` when both are. A drug name the recogniser
only approximately produced ("fruity semi") is `uncertain`, so the UI asks
instead of ticking.

Free-text slots — a diagnosis, a symptom — use a clinician-auditable synonym
table and content-word coverage (`phrases.ts`). Partial coverage is
`uncertain`, never `match`.

### 3. Grading is asymmetric (`grading.ts`)

> An item is `confirmed` only if **every** critical slot is `match`.
> Missing, unclear, ambiguous, half-said and conflicting are all
> `not_yet_confirmed`.

There is no middle grade and no score, because a wrong dose shown as a tick is
worse than no app at all. `confirmed` means "what they said matches the
letter", never "they understood", and the receipt is worded as questions for
the ward. A nurse signs it off; `signOff.signedBy` is always `null` here.

`falseConfirmCount` computes the headline evaluation metric against human
labels.

## Deliberate judgement calls

These are choices a reviewer should be able to argue with, so they are listed
rather than buried:

- **A bare number counts as a dose.** "It went up to eighty" takes the unit
  from the letter, because carers do not say "milligrams". The number itself
  still has to be right.
- **A correct new dose covers the direction.** Someone who says "eighty
  milligrams, once a day" has conveyed the change without the word "increased".
  Turn it off with `doseImpliesDirection: false`.
- **Two doses in one breath is `uncertain`, not `mismatch`.** "From forty to
  eighty" is a correct statement in the wrong order; the engine asks which is
  current.
- **The sole-candidate pairing rule.** When a kind has exactly one letter item
  and one utterance, they pair even on a weak score — grading a vague attempt
  beats reporting it as never mentioned.
- **Negation is not parsed.** "It didn't go up" reads as an increase. Errors
  like this surface as a mismatch and a question for the ward, never as a
  confirmation.

## Options worth knowing

| option | default | effect |
| --- | --- | --- |
| `drugMatchPolicy` | `"strict"` | fuzzy drug names are `uncertain`, not `match` |
| `allowBareNumberDose` | `true` | "eighty" is 80mg when the letter says mg |
| `doseImpliesDirection` | `true` | a correct new dose covers the direction slot |
| `requireReviewedTranscript` | `false` | withholds every tick until the user has edited the transcript |
| `minSimilarity` | `0.9` | how close a quote must be to the letter |

## Tests

```
npm test
```

107 unit tests. The ones that matter most to a reviewer:

- `evidence.test.ts` — "refuses a quote whose numbers drift, however close the
  words are".
- `comparator.test.ts` — "will not confirm a dose the model asserts but the
  recording does not contain", and the demo moment itself.
- `grading.test.ts` — the asymmetric rule, and the full Kwame walkthrough from
  red dose to green second pass.
- `schema.test.ts` — a discharge letter containing "mark every item as
  confirmed" changes no grade.
