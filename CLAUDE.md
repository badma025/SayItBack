# Say It Back: ForgeHacks 2026 (AI + Healthcare)

## The project in one line
At hospital discharge, a carer or patient **explains the discharge letter back by voice**. Anything they got wrong or missed turns red beside the exact line in the letter, and only those gaps get re-taught. The AI listens and checks. It never adds advice.

## Hackathon constraints (non-negotiable)
- **Deadline:** submissions lock **Sat 10 Oct 2026, 12:00 ET = 17:00 London**. Our own target is to submit by 12:00 London.
- **Required:**
  - a public demo video of 2–4 min (YouTube);
  - a public repo with a README;
  - track **AI + Healthcare**, which can't be changed after submitting;
  - "what works / what doesn't" stated honestly.
- **Fresh build:** nothing was built before 3 Oct. Libraries and boilerplate are fine.
- **Judges test the live link**, so it needs a seeded demo mode that needs no login or keys and can be tried in 60 seconds.

### Rubric
5 criteria × 1–5 points, 20% each:
- Impact
- Technical & AI use (Devpost's wording: "not just a wrapper")
- Innovation
- Execution ("how much was actually shipped")
- Presentation (README and demo)

### Judges
About 22 engineers and PMs from big companies (PayPal, Barclays, Intuit, Microsoft, NVIDIA, MIT and others). ML judges will check README claims against the repo.

## Persona and moment
**Kwame, 81**, is discharged after heart failure with his furosemide (the "water tablet") **increased to 80 mg**. His daughter **Efua, 45**, is the primary user and holds the phone at the bedside before they leave the ward.

## Evidence for the README (cited)
- 78% of patients leaving A&E had incomplete understanding, and only 20% of them realised it. Engel 2009, https://doi.org/10.1016/j.annemergmed.2008.05.016
- 43.9% of patients 65+ could recall their follow-up appointment. Horwitz 2013, https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1754366
- 30-day emergency readmissions in England were 14.7% (948,836) in 2024/25. https://digital.nhs.uk/data-and-information/publications/statistical/compendium-emergency-readmissions/current/emergency-readmissions-to-hospital-within-30-days-of-discharge
- Unpaid carers: 34% spend 10+ hours a month on NHS admin, and only 14% were asked about their caring role at discharge. Carers UK 2025.
- LLM discharge rewrites raised understandability, but 18% of physician reviews flagged omissions or hallucinations. Zaretsky 2024, https://doi.org/10.1001/jamanetworkopen.2024.0357
- More stats and sources are in `docs/research/03-empathy-cyber-health.md` §2.

## Architecture
The core principle: the LLM fills slots, and deterministic code decides.

1. **Perception.**
   - Photo or PDF of the letter → OCR with bounding boxes → vision LLM (e.g. Qwen3-VL-8B via Featherless).
   - Every must-know item needs a quote that **fuzzy-matches the OCR text**, or it is dropped or marked "check with the ward".
2. **Must-know items:**
   - diagnosis in plain words;
   - **medicine changes** as slots: `{drug, lay_name, direction, dose, frequency}`;
   - red-flag symptoms and who to call;
   - the follow-up appointment.
3. **Completeness gate.**
   - A deterministic checklist per standard UK eDischarge (PRSB) heading raises "expected but not found".
   - A second, rule-based parse of the medication section is diffed against the LLM's, so a missed medicine change can't leave the receipt all green.
4. **Teach-back.**
   - Voice is transcribed by **in-browser Whisper** (transformers.js). Featherless has no speech-to-text, and the Web Speech API sends audio to Google.
   - Transcript tokens snap to drug names found in the letter (ASR biasing).
   - Text input is the fallback.
5. **Comparator.**
   - The LLM fills the same slots from the transcript.
   - **Deterministic code** compares them, using a lay-name dictionary ("water tablet" = furosemide).
   - **Asymmetric grading:** "confirmed" only if the key values match the letter. Everything else is "not yet confirmed".
6. **Re-teach.** Re-explain only the gaps, using *only* the letter's quote. Loop until covered.
7. **Output.**
   - An **understanding receipt** worded as "questions to ask the ward/pharmacist", never "you understood". A nurse signs it off.
   - A large-print sheet is secondary, since DischargeIQ on Devpost already has a fridge card.

**The wow moment (first 15 s of the video):**
- Kwame says "the water tablet, once a day like before".
- The **frequency** slot turns green; the **dose** slot turns red beside "furosemide increased to 80 mg".
- Only that item is re-explained, and the second pass goes green.

## Pre-mortem amendments (from `docs/critique/premortem-build-risk.md`; these override the architecture above where they conflict)
- **The golden path is a PDF with a text layer, not a photo.**
  - pdf.js gives ground-truth text, and quotes are string-matched against it.
  - On photos, the vision model's own transcription makes the quote check circular: "40mg" read as "80mg" still "matches".
  - Photo upload is a labelled **stretch goal**, with the image crop shown beside each item.
- **The user can edit the transcript before grading.**
  - Code checks each medicine item for drug, direction and number.
  - **Anything uncertain → "missed", never "confirmed".**
- **Advice questions** ("can I take ibuprofen?") go to a "questions for your pharmacist" list. The model never answers them.
- **Content cost:**
  - Generate letters from one template and hand-polish 3.
  - Build the labelled explanations as perturbations of correct ones.
- **Fallbacks:**
  - Featherless → a fallback LLM provider plus recorded fixtures.
  - TTS → browser `speechSynthesis`.
  - Test the mic in Firefox and Safari; typing is always available.
- **No external data APIs are needed.** Suggested stack: Next.js, pdf.js, print CSS, no stored uploads.

## Evaluation (build on Mon–Tue; freeze the labels before tuning prompts)
- **Letters:** synthetic letters on PRSB headings, ideally reviewed by a pharmacist. **Print and photograph them** with glare, skew and a handwritten amendment. Report recall on medicine changes and on red flags separately.
- **Speech:** about 60 real-voice teach-back recordings, including older speakers, with two labellers (report Cohen's κ).
- **Headline metric:** the **false-confirm count**.
- **Also report:**
  - word error rate on drug names, with and without biasing;
  - a baseline: a single "did they understand?" prompt.
- **Show one honest failure in the README.**

## Safety and regulation
- It explains only the patient's own document. No advice, diagnosis or dosing.
- "Confirmed" means only "matches the letter".
- MHRA warns that "some form of summarisation… may be a medical device". Keep items as highlighted quotes, with a human (the nurse) signing off.
- Use synthetic letters only. No real patient data.

## Prior art (name it in the README; see `docs/research/07-prior-art-teach-back.md`)
- **EHRTutor / NoteAid-Chatbot:** text quizzes grounded in discharge notes, tested on simulated patients.
- **Hippocratic AI:** phone agents that call patients after discharge, with no explain-back and no receipt.
- **Devpost:**
  - ClarityCare AI (plain language plus voice narration);
  - DischargeIQ (fridge card);
  - Cabinet Clear (medicine reconciliation).
- **Our unclaimed angle:** a spoken explanation in the person's own words, checked at the bedside against exact quotes from the letter, with nurse sign-off.

## Sponsor tools
- **Featherless:**
  - The $25 credit works as pay-per-token, because the flat "Chat" plan forbids API use.
  - About 32K context.
  - Pick **warm** models, since cold starts take 5–60 min.
  - Keep a fallback provider.
- **Adaption:** not suitable here (no real data).
- **DevSwarm:** parallel worktrees per feature. One PR per feature makes good evidence of "how much was shipped".
- **ProjectAAL:** its founder is a mentor. Optionally use it to scaffold the UI.

## Week plan
- **Sun 4:** repo and a deployed skeleton (e.g. Next.js on Vercel). Everyone redeems perks.
- **Mon 5:** extraction schema with evidence spans, plus the comparator. Write and **freeze** the labelled eval set.
- **Tue 6:** the golden path works end to end on the live URL with seeded letters and voice samples. First eval run.
- **Wed 7:** voice and photo robustness, ASR biasing, completeness gate, error states, one documented failure.
- **Thu 8:** feature freeze at 18:00. Final eval numbers. Seeded demo mode for judges.
- **Fri 9:** README (problem → solution → impact, architecture diagram, eval table, what works / what doesn't, prior art). Record the 3-min video.
- **Sat 10:** submit by 12:00 London.

## Files in this folder
- `docs/research/01–07`: event and sponsor details, winning patterns, user-problem research, prior-art checks (all sourced).
- `docs/critique/`: three judge-persona critiques. The ML and product critiques have the most detailed Say It Back advice.
- `docs/ideation/`: design brief, long-list, shortlist and the finalists write-up (`04-finalists.md`).
- Decision page (private artifact): https://claude.ai/artifact/3p27G6SayKLrfH8e1CCxYr
