# 02 — What wins student AI hackathons (2025–2026), and which ideas are saturated

_Researched 2026-10-04 for ForgeHacks Online 2026. Sources are mostly primary: Devpost galleries, project pages and rules, Devpost/MLH guidance, and a few named judge write-ups (labelled **[secondary]**). Each claim carries its URL. Read this alongside `01-event-and-sponsors.md`._

**Method.**
- **(a) Winner pages.** I read 29 winning project pages across 17 events (2025–2026, almost all online and student-only).
- **(b) Gallery corpus.** I scraped every title and tagline from 18 Devpost galleries, **2,234 projects**, and tagged archetypes with keyword regexes over title and tagline. Win rates leave out The Merge 2026 (34 of 72 projects got a ribbon), Zero Origin (no winners yet) and GenLink (gallery shows winners only).
- **(c) Devpost-wide counts.** These come from `devpost.com/software/search`. Search returns newest first, so I estimated "since ≈Jan 2025" by bisecting on the upload ID in each result's photo URL. For calibration, IDs sit around 3.20–3.24M for a gallery closing 21 Jan 2025 ([gallery](https://snowflake-mistral-rag.devpost.com/project-gallery)), around 3.85M for EduHacks in Oct 2025, and 5.50M today.

**Caveats.**
- Regex tags are noisy, and winner counts per cell are small.
- "is:winner" counts *any* prize, sponsor prizes included.
- Devpost's firewall rate-limited me (HTTP 403), so some keyword counts are missing.
- I used AI-summarised page reads (WebFetch), which can miss embedded videos, so I make no claims about whether winners had videos.

---

## TL;DR

1. **2026 winners keep the LLM in a box.** In 14 of the 29 winners I read, the safety-critical decision is made by deterministic code, rules or a human, and the LLM only handles language. Examples: [NoScam](https://devpost.com/software/noscam-vni3o5), [Cabinet Clear](https://devpost.com/software/cardiolensv2), [Zen](https://devpost.com/software/fd-7g0sbo), [Remembrance](https://devpost.com/software/remembrance-odsj6l), [SmartOptic](https://devpost.com/software/smartoptic) and [Mulder](https://devpost.com/software/mulder). This matches the ForgeHacks brief: a half-working project is fine, overstating it is not.
2. **Winners publish honest numbers, including bad ones.** 9 of 29 report quantitative results, and 3 more report real-user pilots. Examples:
   - [NoScam](https://devpost.com/software/noscam-vni3o5) stopped 18 of 18 test scams but slowed 5 of 15 legitimate actions.
   - [SmartOptic](https://devpost.com/software/smartoptic) cut confident misclassification by 29.8 pp but declined to score 41% of sessions.
   - [Mulder](https://devpost.com/software/mulder) scored 90% against the NIST answer key, with 1 false positive in 33 findings.
3. **Most winners (~25/29) name a narrow person in a specific moment.** Examples: refugees in their first 90 days ([Wayfinder](https://devpost.com/software/wayfinder-1y4xbe)), families after hospital discharge ([Cabinet Clear](https://devpost.com/software/cardiolensv2)), people whose speech was slurred by stroke or ALS ([ember](https://devpost.com/software/ember-mldi8r)), and ADHD students who can't start homework ([TinyStep](https://devpost.com/software/tinystep)).
4. **Camera and sensor input beats chat.** In general (multi-track) events, projects whose tagline mentions camera, vision, photo, scan or OCR won **7 of 53 (13%)**. Chatbot or assistant taglines won **1 of 97 (1%)**. The baseline is 3.6% (§4).
5. **Saturation is extreme, track by track.**
   - Cybersecurity: phishing/scam/fraud projects are **30%** of cyber-event projects (2 wins, neither a classifier).
   - Healthcare: symptom checkers and diagnosis/triage chat are **24%** of health-event projects (1 win). Mental-health companions are 22%.
   - Education: tutors are 16% and quiz/flashcard apps 16% of education-event projects.
   - Climate: carbon trackers and weather dashboards are 13% each.
   - Creativity: music/playlist apps are 11% and won 0 times.
6. **The ones that win reframe the problem.** Examples:
   - [NoScam](https://devpost.com/software/noscam-vni3o5) holds back irreversible transfers instead of classifying messages.
   - [Aegis](https://devpost.com/software/aegis-clk40a) trains seniors instead of filtering for them.
   - [Saathi](https://devpost.com/software/saathi-f291s5) *reduces* reliance on AI.
   - [SlopGuard](https://devpost.com/software/slopguard-qwbydo) defends against packages that AI tools invent.
7. **Most winners ship a live link.** 19 of 29 winner pages carry a live link. Devpost-run rules let judges skip testing and score only the description, images and video ([Amazon Nova rules](https://amazon-nova.devpost.com/rules)). So the video and README must stand on their own, and ForgeHacks also says judges will test the build.
8. **Judges score the whole package.** They reward balance across *all* criteria. They mark down a slick video over thin code, backend-only builds, and the same project resubmitted under a new name ([Devpost, 5 judges](https://info.devpost.com/blog/hackathon-judging-tips)). Judges audit README claims against the repo ([Devfolio](https://devfolio.co/blog/the-discerning-machine/)).
9. **Documentation is often a third or more of the score.** Impact Forge gives 20 of 60 points to pitch, demo and docs ([rules](https://impactforge26.devpost.com/)). CS Girlies has a dedicated Best Documentation prize, which [Saathi](https://devpost.com/software/saathi-f291s5) won.

---

## 1. Winner table (17 events, 2025–2026)

Criteria key: **I** = Impact, **T** = Technical/AI, **N** = Innovation, **E** = Execution, **P** = Presentation.

| Event (format, size) | Project → prize | What it does | Why it plausibly won |
|---|---|---|---|
| [EduHacks AI Fest 2025](https://eduhacks-ai-fest-2025.devpost.com/) (online, students; 429 registered, ~99 projects) | [SpeaKoach](https://devpost.com/software/speakoach) → 1st | Communication coach that fuses OpenCV/dlib face and posture data with an LLM to give objective scores | **T**: multimodal fusion. **I**: measurable progress. **N**: not a quiz app in an edu event |
| [CS Girlies Nov 2025](https://cs-girlies-november.devpost.com/) (online, 1,210 registered, 93 projects) | [The Voyage](https://devpost.com/software/the-voyage) → Overall Winner | 3D cockpit for exploring the planets, live on Vercel | **E/P**: immersive polish. Shows how much "wow" can weigh, even with no AI emphasis |
| same | [Signify](https://devpost.com/software/signify-hya82t) → Runner-Up | Chrome extension that turns YouTube captions into ASL clips (WLASL dataset) | **I**: a named Deaf/ASL audience. **N**: accessibility angle in a field of tutors |
| same | [Saathi](https://devpost.com/software/saathi-f291s5) → Best Documentation | Gemini guides you through a problem instead of answering it; GitBook docs | **N**: anti-dependency design. **P**: docs site plus live app |
| [HealTech Innovators 2025](https://health-hackx-27285.devpost.com/) (online, college, 191 registered) | [ember](https://devpost.com/software/ember-mldi8r) → Overall Best | Gemini turns slurred speech fragments into full sentences, and ElevenLabs speaks them in the user's own cloned voice. Claims 87%+ accuracy and under 2 s latency | **I**: aimed at ~50M people with speech disabilities. **P**: understood in 5 seconds. **T**: multimodal |
| same | [SafeMother](https://devpost.com/software/safemother) → Accessibility & Patient Support | Offline maternal-risk triage for rural Nigerian nurses, deliberately with no ML | **I**: specific frontline user. **E**: works on legacy hardware |
| [Global Innovation Build Challenge V1](https://global-innovation-challenge-v1.devpost.com/) (online, students, 551 registered) | [SAKHI AI](https://devpost.com/software/sakhi-ai) → 3rd Overall (also won at The Merge 2026) | OCR, then LLM simplification, then multilingual speech for medical reports over WhatsApp | **T**: a real pipeline. **I**: multilingual India. **E**: live on Railway |
| [Hack-Earth](https://arforearth.devpost.com/) (online, students, 343 registered) | [GreenGain](https://devpost.com/software/greengain-fpozv1) → Best Sustainability Impact | LangGraph agent plus RAG over rebate data builds a home-retrofit plan with CO₂ *and cash* savings | **I**: climate turned into a money decision. **T**: agent with a source-credibility check |
| [GenLink Hacks](https://genlink-hacks.devpost.com/) (online, students, 251 registered) | [Sage](https://devpost.com/software/sage-9rxzey) → 1st; [Aegis](https://devpost.com/software/aegis-clk40a) → 2nd | Sage is a plain-language tech companion for seniors built to WCAG AAA. Aegis trains seniors with scam simulations | **I**: named persona. **N**: Aegis *trains* rather than detects |
| [ML Empowerment](https://ml-empowerment-build-challenge.devpost.com/) (online, students, 599 registered) | [AnemiaLens](https://devpost.com/software/anemialens-c72ruj) → AI for Health; [LocalPulse](https://devpost.com/software/bizinsight) → Productivity Booster | AnemiaLens screens anemia risk from an eyelid photo and says it is a screening aid, not a diagnosis. LocalPulse turns 6.99M Yelp reviews into alerts for small shops at 86.2% accuracy | **T**: vision model and real data at scale. **I**: honest limits. Business-track template: data in, alert out |
| [USAII Global AI 2026](https://usaii-global-ai-hackathon-2026.devpost.com/) (online, students, 6,064 registered, 629 projects) | [Zen](https://devpost.com/software/fd-7g0sbo) → Undergrad Grand; [Alyosha](https://devpost.com/software/alyosha) → HS Grand; [Wayfinder](https://devpost.com/software/wayfinder-1y4xbe) → HS Runner-Up; [Cabinet Clear](https://devpost.com/software/cardiolensv2) → HS 3rd | Benefit, re-entry and refugee navigators, plus a discharge-letter and medicine-cabinet reconciler. Rules engines or RAG make the decisions and humans handle escalation. Zen passes 19/19 tests and doubles underserved access (30%→60%). Wayfinder was piloted with 5 refugees | Rubric includes a "Responsibility, Ethics & Limits" criterion. Every winner made that visible |
| [Impact Forge Summer 2026](https://impactforge26.devpost.com/) (online, students, 535 registered) | [SmartOptic](https://devpost.com/software/smartoptic) → 1st; [Remembrance](https://devpost.com/software/remembrance-odsj6l) → 2nd | SmartOptic: an AI co-scientist where code checks every factual claim, reported with 95% confidence intervals. Remembrance: a dementia memory aid with a side-by-side "unguarded" mode that shows the raw model inventing details | **N/T**: refusing to make things up, engineered and measured. **P**: a demo that proves the guardrail works |
| [IncludAI 2026](https://includai-2026.devpost.com/) (online, students, 383 registered) | [TinyStep](https://devpost.com/software/tinystep) → K-12 track | Breaks an assignment into a two-minute first step, tuned to *why* you're stuck | **I**: tested with a real ADHD user. **N**: helps you *start*, not plan |
| [CS Girlies Wellness 2026](https://cs-girlies-wellness-hackathon.devpost.com/) (online, 776 registered, 97 projects) | [Pawse](https://devpost.com/software/pawse-hevf32) → 1st Overall | Privacy-first focus app with a pixel cat. The LLM only re-chunks tasks, speech bubbles are curated, and it falls back to deterministic code | **N**: no-shame design. **E**: a full desktop app |
| [Hack the Arts 2026](https://hackthearts.devpost.com/) (online, high school, 398 registered, 77 projects) | [Boxing Canvas](https://devpost.com/software/boxing-canvas) → Best Overall; [Echo Canvas](https://devpost.com/software/echo-canvas-paint-with-your-voice-and-face) → Most Unique | In Boxing Canvas, every punch paints and every combo plays a note. In Echo Canvas, voice plus face expression drive generative painting for artists who can't hold a brush | **N**: the body is the brush. **P**: obvious in 10 seconds. Both are live |
| [TLN Hackathon 2026](https://tln-cybersecurity-challenge.devpost.com/) (online, students, 487 registered, 91 projects) | [HIVE](https://devpost.com/software/hive-security-for-what-happens-between-agents) → Grand; [NoScam](https://devpost.com/software/noscam-vni3o5) → 2nd; [SlopGuard](https://devpost.com/software/slopguard-qwbydo) → 3rd | HIVE spots risky combinations of agent permissions (231 tests, no LLM at runtime). NoScam requires second-device approval for irreversible actions; its Gemini call writes only one sentence of advice. SlopGuard blocks AI-hallucinated packages (70-case labelled corpus) | **N**: threats new to the AI era. **T**: deterministic and tested. Each states its limits |
| [SANS AI Cybersecurity 2025](https://ai-cybersecurity-hackathon.devpost.com/) (online, 925 registered; not student-only) | [Agentic Security](https://devpost.com/software/agentic-security) → Grand (Individual) | LLM red-teaming kit with multimodal jailbreak fuzzing | **T** depth. Security *for* AI, not a phishing classifier |
| [FIND EVIL! 2026](https://findevil.devpost.com/) (online, 4,397 registered, 291 projects; open, students welcome) | [Mulder](https://devpost.com/software/mulder) → 1st | Autonomous forensic investigator in which every finding must cite a tool-call ID; scored 90% against the NIST answer key | Rubric explicitly rewards guardrails built into the architecture over prompt-only guardrails |

Medi-Hack 2025 ([gallery](https://medi-hacks.devpost.com/project-gallery)) and IEEE OC AI Dev Hack 2025 ([gallery](https://ieee-ai-dev-hack-2025.devpost.com/project-gallery)) were used only in the corpus. FutureHacks 7 (high school, 15 of 75 projects won) was left out of the win-rate maths: it [rewarded generic study buddies](https://futurehacks-7.devpost.com/project-gallery), which isn't representative of an 18+ panel of industry judges.

---

## 2. Cross-cutting patterns (counts out of the 29 winners read)

1. **A specific persona and moment (~25/29).** The tagline says who and when, e.g. people leaving US prisons each year ([Alyosha](https://devpost.com/software/alyosha)) or refugees in their first 90 days ([Wayfinder](https://devpost.com/software/wayfinder-1y4xbe)).
2. **A deterministic core with a contained LLM (14/29).** Safety-relevant verdicts come from rules, schemas or graph analysis. The LLM explains, extracts or chats. See [Cabinet Clear](https://devpost.com/software/cardiolensv2) (CNN photo-quality gate, Claude for extraction, a rules engine on FDA data decides), [HIVE](https://devpost.com/software/hive-security-for-what-happens-between-agents), [Wayfinder](https://devpost.com/software/wayfinder-1y4xbe) (SSN fields blocked in code) and [Mulder](https://devpost.com/software/mulder).
3. **Measured and honest (9/29 quantitative, plus 3 pilots).** Small labelled test sets, test counts, confidence intervals and friction costs, *with* stated limits. Cabinet Clear says outright that its 100% validation score reflects augmented photos ([page](https://devpost.com/software/cardiolensv2)).
4. **Live and testable (19/29).** A deployed URL is the norm (e.g. [SlopGuard](https://devpost.com/software/slopguard-qwbydo), [Zen](https://devpost.com/software/fd-7g0sbo), [The Voyage](https://devpost.com/software/the-voyage)).
5. **Multimodal input (≈10/29).** Camera, face, voice, document photos and gestures. The gallery numbers back this up (13% vs 1%, §4).
6. **A visceral 10-second moment.**
   - A broken phrase becomes a sentence in your own voice ([ember](https://devpost.com/software/ember-mldi8r)).
   - A punch paints ([Boxing Canvas](https://devpost.com/software/boxing-canvas)).
   - A toggle shows the raw model making things up next to the guarded one ([Remembrance](https://devpost.com/software/remembrance-odsj6l)).
7. **A reframe instead of a detector.** The winners change *where* in the workflow AI acts. NoScam acts at the irreversible step, Aegis trains people, Saathi withholds answers.
8. **An AI-era problem.** Agent permissions, slopsquatting, AI over-reliance, model confabulation. These read as fresh to judges in 2026 ([TLN gallery](https://tln-cybersecurity-challenge.devpost.com/project-gallery)).
9. **Sponsor tools: a weak signal.** Sponsor tools showed up where the sponsor also funded the top prize. Both Impact Forge top-two used Featherless, which supplied the 1st-place credit ([SmartOptic](https://devpost.com/software/smartoptic), [Remembrance](https://devpost.com/software/remembrance-odsj6l)). Otherwise I saw no consistent sponsor effect.

---

## 3. Judge's-eye view, by ForgeHacks criterion

**How scoring works.**
- Devpost online judging is 1–5 stars per criterion, with all criteria equally weighted and no comment box ([Help: how to judge](https://help.devpost.com/article/103-how-to-judge-an-online-hackathon), [Help: judging & voting](https://help.devpost.com/article/64-judging-public-voting)).
- Devpost-run rules let judges skip testing and score from text, images and video alone ([Amazon Nova rules](https://amazon-nova.devpost.com/rules)). For any judge who doesn't click through, the video plus README *is* the project.

| Criterion | Looks like a 5 | Looks like a 3 | Evidence |
|---|---|---|---|
| **Impact** | A named user and a quantified gap (e.g. 600k people a year, the first 90 days), plus some contact with real users (5 pilot refugees; a real ADHD user) | "Students", "patients", "everyone" | Research the problem area so you can state the impact ([Devpost criteria](https://info.devpost.com/blog/understanding-hackathon-submission-and-judging-criteria)); the best teams could explain the product in one sentence without saying "AI" ([Banik, LinkedIn, Aug 2026] **[secondary]**](https://www.linkedin.com/pulse/what-judging-3-ai-hackathons-taught-me-actually-works-paramita-banik-ycxmf)) |
| **Technical & AI use** | AI does a job a rule couldn't (vision, speech, extraction), sits inside an architecture with guardrails and an eval, and you can say *why AI* | A single prompt to an API; claims the code can't back up | ForgeHacks asks for depth, correctness and thoughtful integration, not surface use ([overview](https://forgehacks-2026.devpost.com/)); judges check README claims against the repo and ask whether the hard part is actually solved ([Devfolio, May 2026](https://devfolio.co/blog/the-discerning-machine/)) |
| **Innovation** | Moves the intervention point, or targets an AI-era problem | The genre's default app (tutor, symptom bot, phishing classifier) | Rehashed or already-on-the-market ideas score low ([Atlassian judge](https://info.devpost.com/blog/hackathon-judging-tips)); a barely changed template scores low (Google judge, same post); anticipate what competitors will build ([Nathan, 22 wins](https://info.devpost.com/blog/user-story-nathan)) |
| **Execution** | One core flow that works end to end, live, with stated limits. Something the judge would actually install ([Atlassian judge](https://info.devpost.com/blog/hackathon-judging-tips)) | Many half-features; backend with no UI | Scope down to one feature done well (same post); treat it as a prototype with 2–3 must-have features ([Devpost winners](https://info.devpost.com/blog/tips-from-hackathon-winners)); judges ask whether it really works or only looks like it does ([Banik] **[secondary]**](https://www.linkedin.com/pulse/what-judging-3-ai-hackathons-taught-me-actually-works-paramita-banik-ycxmf)) |
| **Presentation** | Problem → solution → demo → how it works → impact, with the point made in the first seconds; a README with architecture diagram, setup and known limits | Long intro, no voiceover, thin README | Say what the app does in the opening seconds ([Devpost video tips](https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video)); storytelling in video and text helps ([Databricks judge](https://info.devpost.com/blog/hackathon-judging-tips)); spend about 60% explaining and 40% demoing, and ≥15% of total time on the submission ([Nathan](https://info.devpost.com/blog/user-story-nathan)); budget a full day for video and docs ([Oleksandr](https://info.devpost.com/blog/user-story-oleksandr)); a before/after story plus known limitations stood out ([judge on dev.to, Jun 2026] **[secondary]**](https://dev.to/amising6/what-i-learned-after-reviewing-many-ai-and-developer-projects-as-a-hackathon-judge-2g06)) |

**Two more signals.**
- **Say what you built versus what was generated.** MLH tells organisers to make teams state, in a detailed README, what they made versus what was generated ([MLH guide](https://guide.mlh.com/general-information/judging-and-submissions/rules-for-your-hackathon)). One judge counts a claim that AI built the whole project as a red flag ([dev.to] **[secondary]**](https://dev.to/amising6/what-i-learned-after-reviewing-many-ai-and-developer-projects-as-a-hackathon-judge-2g06)).
- **MLH's own four criteria** are Technology, Design, Completion and Learning ([MLH standard rules](https://github.com/MLH/mlh-policies/blob/main/standard-hackathon-rules.md)), and MLH steers judges away from business viability ([MLH judging plan](https://guide.mlh.com/general-information/judging-and-submissions/judging-plan)).

---

## 4. Saturation map per track

The gallery numbers below are share of projects in 2025–26 themed galleries, with wins in brackets. The Devpost-wide numbers are keyword hits as all-time / since ≈2025 ([search](https://devpost.com/software/search?query=phishing)). For scale, "ai" matches 191,740 all-time and ≈146k since 2025, with ≈5.2% winner-tagged. Most of these archetypes sit *at or above* that winner rate, so Devpost-wide counts measure crowding, not losing. Use the within-event gallery win rates for "does it lose?".

| Track | Overdone (evidence) | Under-explored angles that won |
|---|---|---|
| **Healthcare** | <ul><li>Symptom checker or diagnosis/triage chat: **24%** of [Medi-Hack](https://medi-hacks.devpost.com/project-gallery) + [HealTech](https://health-hackx-27285.devpost.com/project-gallery) projects (44/184), **1 win**</li><li>Mental-health companion: 22% (41/184), 2 wins</li><li>MRI/skin/X-ray/EEG classifiers: 11%, 1 win</li><li>Devpost-wide: "symptom checker" 550 / ≈420; "mental health chatbot" 2,107 / ≈1,200; "medication reminder" 809 / ≈510</li></ul> | <ul><li>Assistive communication ([ember](https://devpost.com/software/ember-mldi8r))</li><li>Frontline offline triage ([SafeMother](https://devpost.com/software/safemother))</li><li>Medication reconciliation after discharge ([Cabinet Clear](https://devpost.com/software/cardiolensv2))</li><li>Camera screening with honest limits ([AnemiaLens](https://devpost.com/software/anemialens-c72ruj))</li><li>A memory aid that won't make things up ([Remembrance](https://devpost.com/software/remembrance-odsj6l))</li></ul> |
| **Education** | <ul><li>AI tutor or study buddy: **16%** of [EduHacks](https://eduhacks-ai-fest-2025.devpost.com/project-gallery) + [CS Girlies Nov](https://cs-girlies-november.devpost.com/project-gallery) projects (30/190)</li><li>Quiz/flashcard generators: 16% (31/190)</li><li>Summarisers: 11%; XP/gamified: 11%</li><li>Devpost-wide: "ai tutor" 4,007 / ≈3,510 (88% since 2025); "flashcards" 2,827 / ≈2,030; "study buddy" 1,104 / ≈640; "quiz generator" 755 / ≈594</li></ul> Caveat: tutors and quizzes still took 3 wins each, but every winner had a twist | <ul><li>Withholding answers / Socratic guidance ([Saathi](https://devpost.com/software/saathi-f291s5))</li><li>Task *initiation* ([TinyStep](https://devpost.com/software/tinystep))</li><li>Objective skill coaching from video ([SpeaKoach](https://devpost.com/software/speakoach))</li><li>Accessibility ([Signify](https://devpost.com/software/signify-hya82t))</li><li>Immersive 3D ([The Voyage](https://devpost.com/software/the-voyage))</li></ul> These match ForgeHacks' "beyond memorization" brief |
| **Climate** | <ul><li>Carbon-footprint trackers: **13%** of [Hack-Earth](https://arforearth.devpost.com/project-gallery) (9/71), 1 win</li><li>Air-quality/weather/climate dashboards: 13%, 0 wins</li><li>Waste/recycling apps: 10%; in general events they are 5% (49/1,036) with 1 win</li><li>Generic "platform": 18%</li></ul> | <ul><li>Climate framed as money with a credible source of truth ([GreenGain](https://devpost.com/software/greengain-fpozv1): rebates RAG)</li><li>Crop-waste-to-cash marketplace ([StubbleX](https://devpost.com/software/agri-loop))</li><li>Human-reviewed data collection ([eco-mapping](https://devpost.com/software/eco-eoin))</li></ul> |
| **Business** | <ul><li>Resume, interview and career tools: 6% of general-event projects (61/1,036), **0 wins**</li><li>Generic analytics dashboards: 49 projects, 2 wins</li><li>Finance/budget/investing apps: 48 projects, 3 wins</li><li>Sources: [USAII](https://usaii-global-ai-hackathon-2026.devpost.com/project-gallery), [GIBC](https://global-innovation-challenge-v1.devpost.com/project-gallery), [ML Empowerment](https://ml-empowerment-build-challenge.devpost.com/project-gallery), [IEEE OC](https://ieee-ai-dev-hack-2025.devpost.com/project-gallery)</li></ul> | <ul><li>Real data in, a specific alert out ([LocalPulse](https://devpost.com/software/bizinsight))</li><li>Document extraction for under-served languages ([DocuRec](https://devpost.com/software/docurec-ai-intelligent-indian-document-processing-mhvj65))</li><li>Allocating scarce resources with measured fairness ([Zen](https://devpost.com/software/fd-7g0sbo))</li></ul> |
| **Cybersecurity** | <ul><li>Phishing/scam/fraud projects, mostly message and URL checkers: **30%** of [TLN](https://tln-cybersecurity-challenge.devpost.com/project-gallery) + [SANS](https://ai-cybersecurity-hackathon.devpost.com/project-gallery) projects (44/145), 2 wins, neither a classifier. 0 of 13 won at SANS</li><li>Devpost-wide: "phishing" 1,930 / ≈1,450; "scam" 2,455 / ≈1,860; "voice clone" 1,257 / ≈1,090 (86% since 2025); "deepfake" 759 / ≈610; "misinformation" 2,674 / ≈1,610; "fake news" 1,732 / ≈585 (mostly pre-2025)</li></ul> | <ul><li>Stopping the irreversible action ([NoScam](https://devpost.com/software/noscam-vni3o5))</li><li>Training people over filtering ([Aegis](https://devpost.com/software/aegis-clk40a))</li><li>AI supply chain ([SlopGuard](https://devpost.com/software/slopguard-qwbydo))</li><li>Multi-agent permissions ([HIVE](https://devpost.com/software/hive-security-for-what-happens-between-agents))</li><li>Evidence-grounded investigation (TRACE X, [gallery](https://tln-cybersecurity-challenge.devpost.com/project-gallery))</li><li>LLM red-teaming ([Agentic Security](https://devpost.com/software/agentic-security))</li></ul> |
| **Creativity** | <ul><li>In [CS Girlies AI vs HI 2025](https://csgirlies.devpost.com/project-gallery) + [Hack the Arts 2026](https://hackthearts.devpost.com/project-gallery) (214 projects): music/playlist apps **11%, 0 wins**; story/poem/writing apps 5%, 0 wins</li><li>Image/drawing tools: 21%, 3 wins, *all* of them with body or data input</li><li>The AI-vs-HI brief drifted into mood/wellness apps (59 of 214)</li></ul> | <ul><li>Body, voice or gesture as the instrument ([Boxing Canvas](https://devpost.com/software/boxing-canvas), [Echo Canvas](https://devpost.com/software/echo-canvas-paint-with-your-voice-and-face), [Airloom](https://devpost.com/software/airloom))</li><li>Live data turned into art ([Hostile Bloom](https://devpost.com/software/hostile-bloom) renders honeypot traffic as a living organism)</li></ul> |

**Across all tracks**, chatbot/assistant/companion taglines are 9% of general-event projects (97/1,036) and won 1 of 97. "All-in-one platform" taglines are 7%.

**Not verified.** Devpost-wide counts for climate, business and creativity keywords: the search endpoint rate-limited me (HTTP 403), so those rows rely on gallery data only.

---

## 5. Anti-patterns (what reliably loses)

- **Chat-first wrappers.** 1/97 wins in general events (§4). The ForgeHacks rubric asks for a fresh angle beyond a generic app or chatbot.
- **Over-claiming.**
  - A flashy intro over a thin codebase is a known letdown ([Databricks judge](https://info.devpost.com/blog/hackathon-judging-tips)).
  - Inflated pitches that the repo contradicts get caught ([Devfolio](https://devfolio.co/blog/the-discerning-machine/)).
  - The ForgeHacks brief penalises overstating.
- **Missing or untestable artifacts.** Missing video or code makes a ForgeHacks entry ineligible ([overview](https://forgehacks-2026.devpost.com/)). Links must be accessible to judges ([Devpost criteria](https://info.devpost.com/blog/understanding-hackathon-submission-and-judging-criteria)). Many entries fail basic requirements ([Databricks judge](https://info.devpost.com/blog/hackathon-judging-tips)).
- **Recycled projects.** Resubmitting the same project under a new label is a red flag ([NEAR judge](https://info.devpost.com/blog/hackathon-judging-tips)). ForgeHacks requires work to be substantially built during the event ([rules](https://forgehacks-2026.devpost.com/rules)). Note that [SAKHI AI](https://devpost.com/software/sakhi-ai) and [Aegis](https://devpost.com/software/aegis-clk40a) each won at two events, so cross-submission happens. It is risky here.
- **Lopsided builds.** Backend-heavy with almost no frontend ([Square judge](https://info.devpost.com/blog/hackathon-judging-tips)). Over-indexing on one criterion (same).
- **Over-scoping and late submission.** One feature done well, submitted a day or two early ([Devpost](https://info.devpost.com/blog/hackathon-judging-tips)). Video and docs need a full day ([Oleksandr](https://info.devpost.com/blog/user-story-oleksandr)).
- **Health or legal overreach without limits.** Winners state their limits plainly: AnemiaLens is screening only ([page](https://devpost.com/software/anemialens-c72ruj)), and Alyosha refuses legal and parole questions and requires caseworker approval ([page](https://devpost.com/software/alyosha)).

---

## 6. Implications for our idea selection

1. **Skip the default archetype in every track.** That means tutor, quiz or flashcards; symptom checker; mental-health chatbot; phishing or deepfake classifier; carbon calculator; resume tool; text-to-story or text-to-music.
2. **Run each idea through a four-part filter:**
   - (a) one named user at one high-stakes moment;
   - (b) AI does perception or language work that rules can't;
   - (c) deterministic code or a human makes the consequential call;
   - (d) a 10-second visual demo.
3. **Build an evaluation in from day 2.** Use a 20–70-case labelled set and report hits, misses and friction in a README table. Show one honest failure, e.g. a guarded-vs-unguarded toggle like [Remembrance](https://devpost.com/software/remembrance-odsj6l). This scores on Technical, Execution and Presentation at once.
4. **Prefer camera, voice or document input to a chat box** (13% vs 1% win rate in general events).
5. **Ship a public URL** with a seeded demo state that a judge can try in 60 seconds. Write the video assuming nobody clicks.
6. **White-space angles the evidence supports:**
   - Cyber: intervene at the moment of action, not a classifier. It is also the only track with cash ([01](./01-event-and-sponsors.md)), and the judges lean towards payments and identity.
   - Education: tutors that refuse to give answers, or help with starting.
   - Health: medication, documents and communication at handoff points.
   - Climate: money-framed decisions grounded in real rebate or price data.
   - Business: messy SMB data to a specific alert, with a stated accuracy.
   - Creativity: embodied input, or live data as the medium.
7. **Audience Favorite.** It is a public vote (10–11 Oct, [overview](https://forgehacks-2026.devpost.com/)), and Devpost notes it rewards teams who rally their networks ([Help](https://help.devpost.com/article/64-judging-public-voting)). Plan a 30-second emotional clip and a clear thumbnail, but never at the expense of the judged criteria.
