# Judge critique: the ML research and AI infrastructure lens

_Persona: an ML researcher and AI infrastructure engineer, modelled on the NVIDIA, MIT Critical Data, Intuit and Walmart judges. Hostile but fair. Scores are projected for a well-executed 5-day student build._

| Concept | Impact | Tech & AI | Innovation | Execution | Presentation | **Total** | Verdict |
|---|---|---|---|---|---|---|---|
| **E1** Stubborn Classmate | 4 | 5 | 4 | 4 | 4 | **21** | Champion |
| **H4** Say It Back | 5 | 4 | 4 | 3 | 5 | **21** | Contender (highest ceiling) |
| **K2** Stand-in | 4 | 4 | 4 | 3 | 4 | **19** | Contender |
| **CR1** Cliché Radar | 3 | 3 | 4 | 4 | 4 | **18** | Also-ran |
| **CL4** Quote X-ray | 4 | 3 | 3 | 4 | 4 | **18** | Also-ran |

**A problem that applies to all five.** Four of the five use the same design: an LLM extracts, then rules decide. That is right, but it moves all the risk into the extractor, and **no card plans to measure the extractor on its own.** What I'd expect from every team as the minimum report:
- a test set that is human-labelled and frozen *before* prompt tuning (tuning prompts on it is leakage);
- two labellers, with Cohen's κ on an overlapping subset;
- a **strong** baseline: the same model, prompted well. A straw man doesn't count;
- n per cell, with bootstrap CIs;
- three named failure cases.

---

## E1 · Stubborn Classmate: Champion (21)

**The most damaging objection.** "Your 'deterministic' update is only as selective as the LLM that decides whether a root-cause idea is present. You've moved the sycophancy into the grader, and LLM graders reward confident text with the right vocabulary." A reply like "No, it's 4, because of place value" ticks boxes. The toggle also attacks a **straw man**: that a vanilla LLM caves is already the published finding. The fair baseline is the same model *prompted with the misconception and rubric*. If the engine doesn't beat that, the state machine is decoration.

**Eval critique.** The split leaves out the paper's own hard control: **misaligned feedback**, meaning a correct-sounding explanation of a *different* misconception ([arXiv 2605.12748](https://arxiv.org/abs/2605.12748)). If the explanations come from `invent` or the grader's model family, and the generation prompt doubles as the label, the eval is circular.

The minimum credible version:
- **Items:** 30 Eedi misconceptions × 4 feedback types (root-cause, misaligned, generic, bare assertion) × 2 sources = 240 items. One source is written by the team in a messy resit-student voice, the other by a *different* model family.
- **Labels:** human gold labels on every item.
- **Arms:** vanilla, prompted-rubric, and the belief engine.
- **Report:**
  - SFS per arm with CIs;
  - the extractor's precision and recall against the gold labels;
  - the **false-refusal rate** (valid explanations Sam rejects) as the headline cost, since that failure is what hurts a learner on her third resit.

**Model and architecture.**
- **LLM extraction:** a yes/no per rubric item, each with a **verbatim evidence span** from the student's text; a rule rejects spans that don't appear. Add 3-sample majority voting on a warm Qwen3-8B.
- **Rules:** the confidence update and the choice of pushback.
- **LLM dialogue:** goes from state → text, never text → state.
- **Transfer problem:** the LLM writes it, and sympy checks both the correct answer and that the misconception would give a different one.
- **Speech:** Featherless has no ASR, and the Web Speech API sends audio to Google. Use in-browser Whisper.
- **Adaption:** a background bet only. Fine-tune a 0.8B–4B judge on 1,000+ examples from another model family and score it on the human-labelled 240, never on Adaption's own LLM-judged win-rate. Start by 6 Oct or skip it. You have to self-host the weights.

**What would make it a 5:**
- a three-arm SFS chart;
- extractor κ;
- the false-refusal rate;
- an ablation showing that with the gate off, the engine collapses to the baseline;
- one honest failure, e.g. Sam rejects a valid "half of 8" explanation.

---

## H4 · Say It Back: Contender (21; Champion if the prior art is clean and ASR works by Day 2)

**The most damaging objection.** Requiring a quote guards *precision*. The dangerous failures are **recall** and **false confirmation**:
1. The extractor misses a medicine change, so the receipt shows all green.
2. ASR hears "furosemide eighty" as "fruity semi eighteen", or the LLM leniently matches "water tablet once a day" to "increased to 80 mg".

LLM judges are weakest at deciding whether paraphrases agree on numbers and direction of change. A green tick on a wrong dose is worse than no app. Phrase the output as "questions to ask", never "you understood", or it drifts towards clinical decision support.

**Eval critique.** Clean synthetic letters make extraction accuracy meaningless. Instead:
- **Letters:** build them on PRSB headings, print them, and **photograph** them with glare, skew and a handwritten amendment. Report recall on medicine changes and red flags separately.
- **Teach-back:** 60 real-voice recordings, including older speakers, with two labellers per slot.
- **Headline metric:** the **false-confirm count**.
- **Also report:** word error rate (WER) on drug names, and a single-prompt "did they understand?" baseline.

**Model and architecture.**
- **Perception:** OCR with bounding boxes plus Qwen3-VL-8B. Quotes must fuzzy-match the OCR text; when they disagree, show "check with the ward".
- **Medicine changes as slots:** {drug, lay name, direction, dose, frequency}. The LLM fills the slots on both the letter and the transcript, and a **deterministic comparator** with a lay-name dictionary decides.
- **ASR biasing:** snap transcript tokens to the drug names already found in the letter. It's cheap and legitimate.
- **Recall guard:** a second, rule-based parse of the medication section, diffed against the LLM's.
- **Adaption:** no. Real letters are patient data, and synthetic ones would only teach the model your template.

**What would make it a 5:** an honestly reported false-confirm rate, an eval on photographed letters, the recall guard, and an ablation of the ASR biasing.

---

## K2 · Stand-in: Contender (19)

**The most damaging objection.** "Your questions don't verify identity." Scammers clone real agents. They can quote a genuine Companies House number, redress-scheme (TPO) membership and deposit scheme. A registry lookup proves that a number **exists**, not that the correspondent **controls** it. The commonest real reply, silence or "use WhatsApp", makes the AI conversation moot. **The fix:** bind identity. Check that the DKIM-aligned sending domain (Agentboxd exposes it) matches the agent's registered website. A Gmail address claiming to be "Foxtons" is a hard flag.

**Eval critique.** As designed, the eval is circular. The scam scripts and the rules come from the same typology list written by the same team, and LLM-played landlords will all be cooperative, which understates false positives.

The minimum credible version:
- **Real text:** 30 real scam replies and 30 real legitimate replies (public sources, plus the team's own rental messages), run single-turn.
- **Blind personas:** written by someone blind to the rules and played by another model family. Include a "clone" scammer and a legitimate landlord who really is abroad.
- **Injection:** report the **verdict-flip rate**, the share of attacks that change the verdict, for an LLM-verdict baseline against schema-plus-rules.
- **Baselines:** a zero-shot "is this a scam?" prompt, and Agentboxd's phishing score on its own.

**Model and architecture.**
- **LLM:** fills an enum-only schema with evidence spans. It has no tools and no say in the verdict, so an injection can corrupt at most one field.
- **Vision:** Qwen3-VL-8B for the listing screenshot.
- **Rules:** everything else.
- **Reverse image search:** drop it rather than fake it.
- **Adaption:** no. There is no real labelled corpus.
- **Infrastructure risks:**
  - A public "try to scam us" inbox will burn through the beta quotas (20 sends a day for the first 3 days, 1k triage calls a month).
  - It also lets the LLM email strangers, so allow-list recipients and give judges a recorded thread.

**What would make it a 5:** identity binding, the real-text eval, and a line like "unguarded: 12/26 verdicts flipped; ours: 0/26, because the LLM never computes the verdict." It has the best systems story of the five and the thinnest ML.

---

## CR1 · Cliché Radar: Also-ran (18; Contender if the validation lands)

**The most damaging objection.** "Embedding density ≠ originality, and your crowd isn't the crowd." Three problems:
1. **Topic dominates the embeddings**, so every lighthouse story sits near the other lighthouse stories, whatever its twist.
2. **The crowd is the model.** 200 temperature samples measure distance from the *LLM's mode*, which shifts with the prompt, the temperature and the model mix.
3. **Dragging the dot is fake.** UMAP doesn't preserve density and has no inverse.

The measurement also has prior art: semantic distance, which Ocsai's fine-tuned LLMs beat (r≈.81 against .12–.26) ([Organisciak 2023](https://www.researchgate.net/publication/363456838_Beyond_Semantic_Distance_Automated_Scoring_of_Divergent_Thinking_Greatly_Improves_with_Large_Language_Models)), and rarity scoring ([MuseScorer](https://arxiv.org/abs/2505.16232)).

**Eval critique.** The proposed eval correlates density on Devpost titles with regex counts on *the same titles*, which is near-circular, and it has n≈15 archetypes. The minimum credible version:
- **Data:** human-rated Alternative Uses Task responses (Ocsai's ~27k; check the licence).
- **Test:** Spearman ρ against human originality ratings.
- **Baselines:** distance from the prompt, and rarity within the human pool.
- **Stability:** a test-retest across 5 crowd re-samples. If ρ is below 0.7, a figure like "61%" is noise.

**Model and architecture.**
- **Scoring:** kNN density in the full embedding space, with HDBSCAN for clusters. Use UMAP for display only.
- **LLM:** writes the labels and provocations, with a rule that provocations must be questions, never proposals.
- **Sketches:** a VLM caption flattens every sketch into a cliché, so demo with text.
- **Adaption:** **this is the one concept where fine-tuning is legitimate**, because there are 1,000+ real human-rated rows. Fine-tune a 0.8B scorer and report held-out ρ against the base model and against embedding distance.
- **Featherless:** precompute the seeded briefs on 3 warm models.

**What would make it a 5:** the validation above. Impact stays weak.

---

## CL4 · Quote X-ray: Also-ran (18)

**The most damaging objection.** "One VLM call turns the quote into JSON, and a checklist does the rest." It reads as a wrapper. The NAO figure (98% of external wall insulation jobs had major problems) is about **workmanship**, which no quote can reveal, so a judge will catch the overreach. As far as I know, MCS and TrustMark are search interfaces, not APIs. Verify before building on them.

**Eval critique.** Fifteen quotes with planted flaws make "red-flag precision" tautological. The minimum credible version:
- **Data:** 15–20 real, anonymised, photographed quotes.
- **Extraction:** accuracy per field: price, kW, flow temperature, heat-loss calculation, MCS number.
- **Flags:** labelled by someone blind to the output.
- **Baseline:** VLM-only "list red flags".

**Model and architecture.** OCR with bounding boxes, a VLM and rules. No fine-tuning, because there is no data. **The move to a 5:** a physics check. Estimate heat loss from the EPC floor area, a W/m² benchmark and the design temperature, then flag an oversized or undersized heat pump.

---

## Ranking

1. **E1, the one I'd fight for.** It is the only concept whose core claim is a **measurable mechanism against a baseline**, with a published metric, open CC BY data and no fragile dependencies. The condition: a prompted-rubric baseline, a frozen human-labelled test set and a reported false-refusal rate. Without them it is "a role-play prompt with extra steps", worth about 18.
2. **H4.** The best impact, emotional moment and real perception, held back by the risk of false confirmation and ASR errors.
3. **K2.** A strong systems story and the only cash track, but it has the cloning hole, a circular eval and beta infrastructure.
4. **CR1.** The best use of Adaption, but the metric is unvalidated.
5. **CL4.** The thinnest AI.

E1 and H4 share one engine: a person explains back, an LLM extracts span-grounded slots, a deterministic comparator scores coverage, and the system re-explains what was missed. Whichever you pick, build that engine and **its extractor eval on Days 1–2**.
