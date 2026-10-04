# Pre-mortem: build risk and demo reliability (K2, E1, H4, CR1, CL4)

*Engineering-manager pre-mortem, written Sun 4 Oct 2026 as if it were 11 Oct and the project had failed. Assumptions: 2–4 students, heavy AI-assisted coding, feature freeze Thu 8 Oct, Fri 9 for video and README, submit Sat 10 by 14:00 London (3 h before the 17:00 lock). Scores show **as pitched → after the de-risked scope** below.*

## Verdict

| Concept | Feasibility | Demo reliability | F×R (de-risked) | Call |
|---|---|---|---|---|
| **E1** Stubborn Classmate | 3 → **4** | 4 → **4** | **16** | Build-ready |
| **H4** Say It Back | 3 → **4** | 3 → **4** | **16** | Build-ready if PDF-first; prior-art check still pending |
| **CR1** Cliché Radar | 3 → **3** | 3 → **4** | **12** | Its wow moment must be redesigned |
| **K2** Stand-in | 2 → **3** | 2 → **3** | **9** | Conditional: veto if Agentboxd fails Monday's go/no-go |
| **CL4** Quote X-ray | 2 → 3 | 2 → 3 | 9 (hollow) | **Veto** |

## Risks shared by all five

1. **Featherless is a single point of failure for every concept.**
   - The $25 perk may arrive as the Chat plan, which forbids API use.
   - Cold models return 400 for 5–60 min, 503 means no capacity, and calls are blocked at a $0 balance.
   - **Fix:** route every model call through one OpenAI-SDK wrapper whose base URL and model come from env vars, and keep a second provider as fallback. Use only always-warm models: Qwen3-8B, Llama-3.1-8B and Qwen3-VL-8B. Add a per-IP rate limit so judges, or abuse, can't drain the balance.
2. **Replay fixtures.** On Thursday, record every "Try sample" path as JSON. If a live call fails or takes more than ~20 s, serve the recording with a visible **"Replay: live call failed"** badge. Never fall back silently.
3. **Hosting.** Host on Vercel, which doesn't sleep. Streamlit Community Cloud, Render's free tier and HF Spaces all sleep when idle, so don't use them for the judge link. Precompute any Python work and ship it as JSON.
4. **Voice.** The Web Speech API works only in Chrome, Edge and Safari; Firefox lacks it and Brave blocks it. Chrome also sends the audio to Google. Always offer a textarea, and let the user edit the transcript before grading.
5. **Monitoring on 10–11 Oct.** Ping `/health` with a 1-token LLM call every 10 min. That tells you about cold models or a $0 balance before a judge finds out.

---

## K2 · Stand-in: F 2→3 · R 2→3
**Post-mortem:** a judge emailed the agent, as the README invited. The outbound reply waited for human approval and nobody was awake. The scrape of the SpareRoom URL was blocked, and two of the five checks were stubs.

**Top 3 ways it fails:**
1. **The loop needs a stranger to reply.** Only 48.7% of scammers replied in Siadati et al., and every outbound message needs human approval.
   - **Fix:** the judge plays the counterparty, through an in-app "Play the landlord" box and an inbound-only demo address that updates the dossier within ~30 s.
   - Show a real outbound round trip in the video only.
2. **Agentboxd beta limits.**
   - The service is new: its GitHub repo has 2 commits.
   - It allows 20 sends a day until Wed 7, and **10 inboxes on the Free plan**, so inbox-per-listing breaks after 10 judges.
   - It allows 1k triage calls a month. Running out returns a 402, which halts both sending and scoring.
   - Mail from homingbox.net may land in spam, and the enrichment scores arrive in a second webhook.
   - **Fix:** one shared inbox, routed by thread. A clearly labelled local fallback scorer (regex plus an LLM). Recorded Agentboxd JSON. Email hello@agentboxd.com today.
3. **Integration sprawl and false reassurance.**
   - TPO and PRS have no API, and SerpApi gives only 250 reverse-image searches a month.
   - A scammer can quote a real but unrelated Companies House number and still pass.
   - **Fix:** ship 3 checks: Companies House with the officer name matched, RDAP domain age, and rent anomaly against ONS. The agent asks about redress-scheme membership instead of looking it up. The output never says "safe", only "red flags" or "unverified".

**Dependencies → fallback:**
- Agentboxd → a simulated channel, the local scorer and replay.
- Companies House (600 requests per 5 min) → cached responses for the seeded firms.
- Listing scraping (Facebook and SpareRoom block bots and mask email) → paste the text instead. Reframe the pitch as "when they ask to move to email, give them your Stand-in address".

**Golden path:**
- Paste the listing. The agent drafts a disclosed-AI message and the user approves it; it only ever goes to team mailboxes.
- A reply comes in by email or "Play the landlord". It is scored for injection, the answers are extracted, and evasion rules are applied.
- A dossier with a citation on every flag, and seeded scam and legit threads.
- The 40-persona eval runs offline, never over email.

**Stretch:** reverse image search, scraping the redress-scheme registers, n8n, screenshot vision.

## E1 · Stubborn Classmate: F 3→4 · R 4→4
**Post-mortem:** a judge typed "0.5 is a half, so half of 8 is 4". The 8B extractor missed that paraphrase, so Sam stayed unconvinced. Meanwhile an Adaption fine-tune that nobody could serve ate two days.

**Top 3 ways it fails:**
1. **The root-cause gate misfires.** False negatives frustrate judges; false positives are the very sycophancy we claim to fix.
   - **Fix:** curate 8–10 misconceptions, each with 3 hand-written root-cause ideas and 5 paraphrases of each.
   - The extractor returns idea IDs with quotes, and code checks that each quote appears in the student's text. That blocks "ignore instructions".
   - Sam flips at 2 of 3 ideas, gives a hint after 3 failed turns, and shows a **"What Sam heard"** panel.
2. **Wrong maths in generated problems.** **Fix:** write the transfer problems and their answers in advance; the LLM only writes Sam's dialogue.
3. **The Adaption detour.** It needs at least 1,000 rows, runs take hours, and you must host the LoRA yourself.
   - **Fix:** run the SFS eval on ~120 LLM-generated pairs plus 30 written by hand. Use Adaption `invent` only after an `estimate=True` check.
   - Cut the fine-tune unless it is running by noon Tue 6.

**Dependencies → fallback:**
- Featherless → the fallback provider, plus fixtures.
- Web Speech → textarea.
- Eedi graph (CC BY) → bundled with attribution.

**Golden path:**
- The student picks a misconception, sees Sam's wrong answer and explains why it is wrong.
- The extractor runs, the confidence update is deterministic, and Sam pushes back or flips and then solves a transfer problem.
- A side-by-side toggle with the unguarded baseline.
- A gap map with one practice item, and the SFS chart.

**Stretch:** voice polish, the fine-tuned judge, a teacher view.

## H4 · Say It Back: F 3→4 · R 3→4
**Post-mortem:** a judge uploaded a photo of a letter, and the vision model read "40mg" as "80mg". The quote check passed anyway, because it compared against the model's own transcription, and the wrong dose was marked "confirmed". In Firefox the mic did nothing.

**Top 3 ways it fails:**
1. **The quote guarantee is circular on photos.** **Fix:** make **PDFs with a text layer** the golden path. pdf.js gives ground-truth text, and quotes are string-matched against it. Photos become a stretch goal, labelled, with the image crop shown beside each item.
2. **The grader marks "confirmed" by mistake.** Possible causes are speech recognition mangling numbers or drug names, older voices, and a lenient LLM. **Fix:**
   - Let the user edit the transcript before grading.
   - Code checks each medicine item for the drug, the direction of change and the number.
   - Anything uncertain becomes "missed", never "confirmed".
3. **Safety drift and content cost.** A judge asks "can I take ibuprofen?" and the model answers. Writing 20 letters and 60 labelled explanations would eat 2 days.
   - **Fix:** send advice questions to a "questions for your pharmacist" list.
   - Generate the letters from one template, polish 3, and create the explanations as perturbations of correct ones.
   - **Run the 30-minute prior-art check before committing.**

**Dependencies → fallback:** Featherless LLM → the fallback provider and fixtures. The vision model is a stretch goal. TTS → browser `speechSynthesis`. **There are no external data APIs.**

**Golden path:**
- "Try Kwame's letter" shows each must-know item with a verified quote; items without one are dropped by rule.
- Teach-back by text or voice → each item is marked confirmed, missed or misunderstood, with slot checks.
- Only the missed items are re-explained, looping until all are covered.
- An understanding receipt, a fridge sheet built with print CSS, and the two evals.

**Stretch:** photo upload, TTS, other languages.

## CR1 · Cliché Radar: F 3→3 · R 3→4
**Post-mortem:** in the video, the "drag your idea into empty space" moment moved a 2D dot without changing the idea, and a judge noticed. Every idea scored 70–90%. A custom brief took 90 s and hit 429 errors.

**Top 3 ways it fails:**
1. **The wow moment is incoherent.** Density lives in embedding space, so dragging a projected point changes nothing, and UMAP and PCA both distort neighbourhoods.
   - **Fix:** the user **rewrites** the idea, it is re-embedded and the dot animates to its new position.
   - Compute the score by k-nearest neighbours in full embedding space, and caption the map as approximate.
2. **Scores saturate**, because the samples share the brief's nouns.
   - **Fix:** normalise each idea to a one-line "core move" with the brief's terms stripped out, and report the score as a percentile.
   - **Run a spike with 2 briefs on Sunday, and kill the concept Monday if the clusters don't separate.**
3. **Live sampling is fragile:** ~200 samples across several models hit cold starts and 429s. **Fix:**
   - The default is **6 precomputed briefs**.
   - A custom brief takes 60 samples from 2 warm models and is cached by hash.
   - Code picks the sparse clusters to target; the LLM only phrases the provocation.
   - Keep one embedding model throughout.

**Golden path:**
- Choose a seeded brief and see its map.
- Type an idea and get a score plus its 3 nearest neighbours.
- Rewrite the idea and see it re-scored, with provocations.
- An eval against the Devpost counts.

**Stretch:** custom briefs, sketch photos, team mode.

## CL4 · Quote X-ray: F 2→3 · R 2→3 · **VETO**
**Post-mortem:** the registry checks *were* the product, and none had a usable API this week.
- **MCS** has no public installer API.
- **TrustMark** needs a data-sharing agreement, requested by email.
- **EPC** is in beta, requires a GOV.UK One Login bearer token and restricts its address fields.

The team hard-coded three installers. When a judge tested their real installer, the tool falsely said it wasn't on the MCS register.

**Top 3 ways it fails:**
1. **No registry access.** **Fix:** a dated MCS export, a link out to TrustMark, and seeded EPC records. This hollows out the core claim.
2. **Wrong rules on a £10k decision.** Nobody on the team knows MIS 3005-D, that PAS 2035 covers ECO and GBIS but not the Boiler Upgrade Scheme, or the current BUS rules. **Fix:** at most 5 rules, each citing its clause and worded as "ask your installer".
3. **No real quotes to test on**, because of PII, and vision models give unreliable bounding boxes for the overlay. **Fix:** PDF text with citations in a side panel.

The US-heavy judging panel won't connect with MCS, PAS or BUS, and the Climate prize is $10 in credits.

**Golden path:** a seeded quote PDF, the extracted fields, 5 cited checks, a comparison of two quotes, and questions to ask. **Stretch:** the photo overlay, live EPC lookups, CO₂ figures.

---

## Day-by-day plans

| Day | K2 | E1 | H4 | CR1 | CL4 |
|---|---|---|---|---|---|
| **Sun 4** | Redeem the perk and email the vendor. Send a test to Gmail. Get the Companies House key | Choose 10 misconceptions. Test the extractor on 20 explanations | Write 3 letters. Test pdf.js | Spike: 2 briefs × 200 samples | Request EPC and TrustMark access |
| **Mon 5** | **Go/no-go at 18:00.** Draft → approve → send | State machine, deployed | Upload → quoted items, deployed | **Go/no-go.** Precompute 6 briefs | Go/no-go on data |
| **Tue 6** | Webhooks, enrichment, rules | Gate, flip, transfer, baseline | Grader, slots, loop | Score an idea, rewrite | Extraction, rules |
| **Wed 7** | 3 checks, dossier, "Play the landlord" | Rubrics, gap map, voice | Receipt, fridge sheet, voice | Provocations | Comparison |
| **Thu 8** | Offline eval. **Freeze at 20:00.** Record fixtures | SFS eval. **Freeze** | Evals. **Freeze** | Devpost eval. **Freeze** | **Freeze** |

**All five, Fri 9:** record the video in the morning (aim for 2:30–3:00), write the README with a "what works / what doesn't" table, and harden the fallbacks. **Sat 10:** at 10:00, smoke-test in an incognito window, on a phone and in Firefox. Submit by 14:00 London. After that, only use Vercel's instant rollback.

## Suggested stack

| | Stack | Worth integrating | Liability |
|---|---|---|---|
| **K2** | Next.js on Vercel, the `agentboxd` TypeScript SDK, Vercel KV | Agentboxd (but behind a fallback), Featherless | n8n (scarce codes, another hosted system) |
| **E1** | Next.js on Vercel, client-side state, a Python eval notebook | Featherless, Adaption `invent` | Adaption fine-tuning |
| **H4** | Next.js, pdf.js, print CSS, no stored uploads | Featherless LLM (TTS as a stretch) | Agentboxd, Adaption |
| **CR1** | Python precompute → JSON → Next.js with a Plotly chart | Featherless multi-model plus embeddings: the best sponsor story of the five | — |
| **CL4** | Next.js, pdf.js, static snapshots | Featherless | — |

## Ranking (ship-ability × demo reliability)
1. **E1 (16):** only one runtime dependency, and the eval proves the mechanism.
2. **H4 (16):** more fragile input, medical exposure, and prior art not yet checked.
3. **CR1 (12):** only with the rewrite-not-drag redesign, and only if Sunday's spike works.
4. **K2 (9):** the highest upside (the cash track, a fintech-heavy judging panel), but it rests on a beta service with 2 commits. Build it only with the judge-as-counterparty scope, and only if Agentboxd passes the Monday go/no-go.
5. **CL4: veto.** Its deterministic core has no data access in the window, and wrong rules would mislead people on high-stakes decisions.
