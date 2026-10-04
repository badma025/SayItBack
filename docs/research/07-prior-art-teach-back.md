# 07 · Prior-art check: H4 "Say It Back" (AI teach-back for discharge letters)

*Checked 4 Oct 2026. This was a quick scan of about 25 queries, not an exhaustive review. "Not found" means no hit came up in web search. It does not prove nothing exists.*

## TL;DR
- **Novelty: 3 / 5 overall, about 4 / 5 among Devpost projects.** Three things are already taken. Turning discharge letters into plain language is common, both in hackathons and in products. Outbound "post-discharge check-in" voice agents are already sold and deployed. Academic "AI quizzes the patient on their discharge note" systems have existed since 2023.
- **Not found anywhere:** a tool where the patient or carer explains the letter back in their own words (free recall, by voice) and the AI then labels each must-know item as *confirmed / missed / misunderstood* against a verbatim quote, re-teaches only the gaps, and produces a receipt the ward can check **before the patient leaves**.

## 1. Commercial and health-system products

| Product | What it does | Overlap with H4 |
|---|---|---|
| **Hippocratic AI × Universal Health Services** | Outbound voice agents that call patients after discharge to "review post-discharge and medication instructions, probe for new or worsening symptoms and answer questions". Average patient rating 9.0/10. [UHS](https://uhs.com/news/universal-health-services-launches-hippocratic-ais-generative-ai-healthcare-agents-to-assist-with-post-discharge-patient-engagement/), [Healthcare Dive](https://www.healthcaredive.com/news/uhs-partners-hippocratic-ai-launch-ai-agents/750892/) | **High on the voice-review part.** But the health system starts the call, it happens days after discharge, and it is a scripted review. No source said the patient explains back in their own words, and none mentioned a receipt. |
| **Simbie AI** | Voice agents for practices. Its marketing says they use "plain language with teach-back to verify retention" and do post-visit education. [Simbie](https://www.simbie.ai/ai-powered-patient-education-voice-agents/) | **The word "teach-back" is taken in marketing.** The product is aimed at outpatient practices and the claim is in vendor blog posts. No product evidence of item-level grading. |
| Plivo / Vapi / Artera discharge-call templates | Generic outbound calls to "confirm understanding" and book follow-ups. [Plivo](https://www.plivo.com/blog/voice-ai-for-patient-engagement-post-discharge-follow-up-that-scales/), [Vapi](https://vapi.ai/custom-agents/hospital-discharge-agent) | Low to medium. These are templates for call scripts. |
| **Epic** | Rewrites the After Visit Summary in plain language. Its "Emmie" assistant answers questions in MyChart. A discharge-planning agent is announced for 2026. [Epic AI](https://www.epic.com/software/ai-clinicians/), [Emmie](https://www.epic.com/software/emmie/) | Medium on simplification. **No teach-back or comprehension-check feature found.** |
| **NHS** | Chelsea & Westminster pilot (Aug 2025) where an LLM **drafts** discharge summaries for clinicians. [Digital Health](https://www.digitalhealth.net/2025/08/ai-assisted-tool-on-fdp-will-help-write-hospital-discharge-letters/) | Low. Built for clinicians. No patient-facing tool for understanding a discharge letter was found in the NHS App or elsewhere. |
| Memora, Lirio, Get Well, Wellpepper, HRS | Searched together with "teach-back". **Zero relevant hits.** | Unknown. Could not confirm either way. |

## 2. Research (the closest prior art)
Most of this comes from one lab, Hong Yu's group at UMass:
- **EHRTutor** (NeurIPS'23 GAIED workshop). An LLM writes questions from template categories (medications, tests, follow-ups) based on discharge instructions. A "verification chain" checks each question is grounded in the text, then the patient is quizzed one question at a time with hints. **This is the closest academic match.** It differs from H4 in being a quiz, text-only, and having no carer receipt. [arXiv 2310.19212](https://arxiv.org/abs/2310.19212)
- **NoteAid-Chatbot** (EMNLP Findings 2025). A 3B LLaMA model trained with RL, rewarded on how well simulated patients understand their discharge notes. The patient sits an exam at the end. [arXiv 2509.05818](https://arxiv.org/abs/2509.05818)
- **DischargeSim** (EMNLP 2025). A benchmark where a doctor agent educates a simulated patient, followed by a multiple-choice exam on comprehension. [arXiv 2509.07188](https://arxiv.org/abs/2509.07188)
- **"From Discharge Notes to Patient Understanding"** (July 2026). Virtual patients with different personas answer six open-ended comprehension questions. Factual consistency with MIMIC-IV notes is scored. Anxious or distrustful personas expose gaps in coverage. LLM-as-judge agreed only weakly with physicians. [arXiv 2609.20827](https://arxiv.org/html/2609.20827)
- **Healink** (June 2026). A post-discharge Q&A system whose answers are grounded in the prescription and traceable. It has no comprehension check. [arXiv 2606.25334](https://arxiv.org/abs/2606.25334)
- **Evidence base for teach-back itself:** after teach-back in the ED, the share of patients with a comprehension deficit fell from 49% to 11.9% ([EM-TeBa, PMC7513274](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7513274/)). An RCT in patients with limited health literacy also improved comprehension of medication and follow-up ([PubMed 26617669](https://pubmed.ncbi.nlm.nih.gov/26617669/)). A 2025 systematic review found that evaluation of LLM discharge education is inconsistent ([PMC12873150](https://pmc.ncbi.nlm.nih.gov/articles/PMC12873150/)).

**What the research has not done:** every paper uses closed or researcher-set questions and simulated patients in text. None grades **free-form spoken recall** for each item, and none separates *missed* from *confidently wrong*.

## 3. Devpost
**Near-matches found: 4 discharge-related health projects. 0 with patient teach-back.**

| Project | Event | Notes |
|---|---|---|
| [ClarityCare AI](https://devpost.com/software/claritycare-ai) | HackDuke 2026 (Mar) | Discharge notes become plain-language, multilingual instructions with ElevenLabs narration. Information goes one way only, with no check on understanding. No prize listed. |
| [DischargeIQ](https://devpost.com/software/dischargeiq) | Agents Assemble (May 2026) | Built for clinicians: a FHIR readiness dashboard plus a **"fridge-friendly" medication card** in the patient's language. **This overlaps H4's fridge sheet**, so the sheet should not be the headline. No prize listed. |
| [AtriaAI](https://devpost.com/software/atriaai) | TreeHacks 2026 | Voice agents and a dashboard that keep a family informed during an emergency and guide recovery after discharge. Prize not checked. |
| Cabinet Clear | USAII 2026 (already known) | Reconciles the discharge letter with what is in the medicine cabinet. **How H4 differs:** Cabinet Clear checks the *pills* against the letter, while H4 checks the *person's understanding* of the letter. The core problem is different (understanding vs. which physical medicines to keep), the input is different (the patient's voice vs. photos of the cabinet), and so is the output (a receipt for the ward vs. a keep/bin list). |

Teach-back projects on Devpost that are not about health: [Protégé](https://devpost.com/software/protege) (students teach the AI) and [Screenwise](https://devpost.com/software/screenwise-learn-from-anything-on-screen-by-conversation) (has a "teach back" mode for study). Neither is about health.

## 4. Verdict and the sharpest unclaimed angle
**3 / 5.** The pieces are each claimed somewhere: simplification, voice review, quizzing on the discharge note, fridge cards. **The combination is not.** The sharpest version:

> **"Catch the confident mistake before the patient leaves the ward."** The patient or carer says the plan back in their own words, by voice, at the bedside. The AI grades each must-know item as *confirmed / missed / **misunderstood***, where misunderstood means the patient said something that contradicts the letter's quote (for example "I keep taking the old dose"). It re-teaches only that item, using the exact quote, and loops. The result is a one-page **understanding receipt** the discharging nurse can sign.

Why this stands out:
- (a) Commercial agents call **after** discharge. H4 runs at the bedside, before the patient leaves.
- (b) Research systems use **quizzes**. H4 uses **free recall**, which is real teach-back.
- (c) The **"misunderstood" class** is a safety signal that nobody else has. Show it in the demo with a carer who mixes up the old and new doses.
- (d) The **carer** is the main user, and the letters follow the UK/NHS format (PRSB headings, "TTO" take-home medicines).

The fridge sheet should be a secondary output, since DischargeIQ already has one. Do not call it a "follow-up call agent", because Hippocratic owns that framing.

## 5. Regulatory line and test data
**MHRA:** The MHRA's stand-alone software guidance lists *patient medical education* among software that is unlikely to be a device ([GOV.UK](https://www.gov.uk/government/publications/medical-devices-software-applications-apps)). Its November 2025 flow-chart guidance says software that "only reproduces a paper document in digital format" is unlikely to be a device. The same guidance warns that *"some form of summarisation… may be a medical device"* ([MHRA v3 PDF](https://assets.publishing.service.gov.uk/media/69247ba05f7777c304ba7ee4/GB_Flow_Chart_Accompanying_Guidance_v3.pdf)). A disclaimer does not help if the product makes medical claims.

H4 is most defensible if its intended purpose is a **health-literacy and education aid that checks recall of the patient's own letter**, with these safeguards:
- every item is anchored to a verbatim quote, and extraction is shown as highlighting rather than rewriting;
- no triage, no dose calculation, no advice beyond the text;
- "misunderstood" means "contradicts the quote", not a clinical judgement;
- a human sign-off on the receipt.

Pulling out the red-flag items and the medicine changes is the part closest to the borderline. Present it as "highlighting" and keep a human in the loop. For a hackathon this is fine. A real deployment would need a written intended-purpose statement, and probably DCB0129/0160 clinical-safety cases if the NHS uses it.

**Synthetic data:**
1. Generate fake letters with an LLM using the **PRSB eDischarge headings** ([NHS Standards](https://standards.nhs.uk/published-standards/edischarge-summary), [heading list](https://nhsconnect.github.io/ITK-FHIR-eDischarge/explore_headings.html)), then render them as PDFs and photos (skewed, crumpled) to test OCR.
2. Use **Synthea** synthetic patients for consistent medicine and diagnosis data.
3. Script spoken explain-backs with deliberate errors (a dose swapped, a red flag left out, the wrong person named to call), recorded as TTS or by the team. These give a labelled test set for the grader.

**MIMIC-IV-Note** needs PhysioNet credentialing, and its data use agreement restricts sending notes to third-party LLM APIs. Avoid it for a 7-day build.

## Queries run
1. AI voice agent teach-back discharge instructions patient comprehension
2. large language model teach-back patient discharge comprehension study 2025
3. `site:devpost.com "teach-back"`: health 0, education 2
4. `site:devpost.com "discharge instructions" AI`: ClarityCare
5. EHRTutor discharge instructions LLM question generation arXiv
6. "teach-back" LLM chatbot patient comprehension randomized/pilot JAMA/npj/JAMIA: no LLM teach-back trial found
7. `site:devpost.com "discharge summary" patient explain`: DischargeIQ
8. `site:devpost.com "teach back" patient`: **0 health**
9. `site:devpost.com discharge patient "understanding" quiz voice AI hospital`
10. `site:devpost.com "explain back" OR "explain it back" health`: **0**
11. NoteAid-Chatbot learning as conversation
12. Epic MyChart AI discharge teach-back/comprehension 2026: no teach-back feature
13. "teach-back" AI startup patient voice agent 2025/2026: none specific
14. NHS AI discharge letter explain patient app pilot: only the clinician-side drafting pilot
15. MHRA SaMD patient education "not a medical device" guidance
16. `site:devpost.com discharge "teach" patient AI medication red flags follow-up`
17. `site:devpost.com discharge voice "comprehension" patient AI hackathon 2026`: AtriaAI, Cabinet Clear
18. AtriaAI TreeHacks 2026
19. Memora / Get Well / Lirio discharge "teach-back": **0 product hits**
20. PRSB eDischarge summary headings
21. Simbie AI teach-back voice agent
22. Hippocratic AI discharge follow-up teach-back
