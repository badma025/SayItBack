# ForgeHacks 2026 Empathize phase: Education, Climate, Creativity, Business pain points

_Researched 4 Oct 2026. I checked sources against the publisher's own page or paper where I could; every claim has its URL inline._

**Labels used below:**
- **(secondary)**: the figure comes from a write-up, not the publisher.
- **(snippet)**: I saw it in a search summary but couldn't fetch the page.
- **Unverified**: I looked and couldn't confirm it.

**Effort split:** Education ~40%, Climate ~30%, Creativity ~15%, Business ~15%.

---

## TL;DR

1. **The sharpest Education pain is about AI tools themselves.**
   - Unrestricted GPT-4 raised practice scores by 48% but cut exam scores by 17% once access was removed ([PNAS 2025](https://www.pnas.org/doi/10.1073/pnas.2422633122)).
   - Meanwhile, 95% of UK undergraduates now use AI, and "explain concepts to me" is the top use ([HEPI 2026](https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/)).
   - Every major "study mode" still has the AI do the explaining.
   - **No mainstream tool makes the student do the generating (teach, explain, map) while the AI diagnoses the specific misconception.**
   - Learning-by-teaching has effect sizes of d ≈ 0.5–0.6, and self-explanation g = 0.55.
2. **Misconception diagnosis is unsolved and measurable.**
   - Only 15.3% of 219,135 GCSE maths resitters passed in 2026 ([FE Week](https://feweek.co.uk/gcse-resits-2026-english-and-maths-pass-rates-fall-as-entries-surge/), secondary).
   - AI classifiers catch only 57% of hidden misconceptions behind *correct* answers ([arXiv 2026](https://arxiv.org/abs/2606.23205)).
   - LLMs role-playing confused students are "sycophantic": they drop their misconception after any correction, relevant or not ([arXiv 2026](https://arxiv.org/abs/2605.12748)).
   - Solving that last problem is exactly the "not just a wrapper" depth judges want.
3. **The strongest Climate pain is heat, and it's a knowledge-to-action gap.**
   - May–June 2026 alone saw 2,877 heat-associated deaths in England, nearly twice the 1,504 for all of 2025 ([UKHSA](https://www.gov.uk/government/publications/interim-heat-mortality-monitoring-report-england-may-and-june-2026/interim-heat-mortality-monitoring-report-england-may-and-june-2026)).
   - 41% of people who saw a heat alert did nothing, and about 30% never saw one ([UNU 2026](https://unu.edu/inweh/news/uk-heatwave-four-ten-adults-england-take-no-action-protect-themselves-response-heat)).
   - Alerts are regional and aimed at professionals; nothing turns them into a plan for *this* person in *this* flat.
4. **Floods show the same gap.**
   - 6.3 million properties in England are at risk ([Environment Agency 2024](https://www.gov.uk/government/news/environment-agency-publishes-major-update-to-national-flood-and-coastal-erosion-risk-assessment)).
   - Only 1 in 6 UK adults have signed up for flood warnings, and 41% wouldn't know what to do if their home flooded ([British Red Cross 2024](https://assets.redcross.org.uk/82b1e254-5524-0172-0612-9ce813c7824c/d3ea670d-733a-416b-a928-b9eed2138ec1/Vulnerability-and-Resilience-Public-awareness-and-perceptions-of-flood-risk-in-the-UK.pdf)).
5. **Creativity: AI makes ideas converge.**
   - With ChatGPT, 94% of brainstormed ideas overlapped, and idea diversity fell in 37 of 45 comparisons ([Nature Human Behaviour 2025](https://www.nature.com/articles/s41562-025-02173-x)).
   - 26% of illustrators have already lost work to AI ([Society of Authors 2024](https://www.thebookseller.com/news/a-third-of-translators-report-losing-work-to-generative-ai-systems-soa-survey-reveals), secondary).
   - The opening is **AI as critic or provocateur, not generator**.
6. **Business:**
   - 4.27 million UK businesses have no employees ([DBT 2025](https://www.gov.uk/government/statistics/business-population-estimates-2025/business-population-estimates-for-the-uk-and-regions-2025-statistical-release)).
   - Late payment closes 38 businesses a day ([DBT 2025](https://assets.publishing.service.gov.uk/media/688a1b428b3a37b63e739040/late_payments_tackling_poor_payment_practices.pdf)).
   - Don't use the "82% of businesses fail from cash flow" statistic: it has no traceable study behind it.
7. **Top 3 ideas across all tracks:**
   1. E1, a "teach-back" tutor where the student teaches a stubborn AI novice.
   2. C1, a personal heat-plan coach.
   3. E2, a misconception X-ray for maths resitters.

---

## 1. AI + Education

### 1.1 What builds understanding rather than memorisation

| Technique | Effect | Source (year) |
|---|---|---|
| Retrieval / practice tests | g = 0.61 vs restudying (272 effects, n = 15,472) | Adesope et al. ([SAGE](https://journals.sagepub.com/doi/abs/10.3102/0034654316689306), 2017) |
| Ten study techniques compared | Only practice testing and spaced practice rated "high utility"; rereading and highlighting "low" | Dunlosky et al. ([PDF](https://iverson.cm.utexas.edu/courses/310M/Handouts/Dunlosky%20et%20al.%20-%202013%20-%20Improving%20Students%E2%80%99%20Learning%20With%20Effective%20Learni.pdf), 2013) |
| Self-explanation | g = 0.55 (69 effects) | Bisra et al. ([Springer](https://link.springer.com/article/10.1007/s10648-018-9434-x), 2018) |
| Interleaving | g = 0.42 (238 effects) | Brunmair & Richter ([PDF](https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf), 2019) |
| Concept mapping | g = 0.58 overall; **building** a map g = 0.72 vs studying a given one g = 0.43 | Schroeder et al. ([Springer](https://link.springer.com/article/10.1007/s10648-017-9403-9), 2018) |
| Productive failure (attempt the problem before instruction) | g = 0.36 on conceptual knowledge and transfer; up to 0.58 when done faithfully; no loss on procedures | Sinha & Kapur ([ERIC](https://eric.ed.gov/?id=EJ1308129), 2021) |
| Refutation texts (directly confronting a misconception) | g = 0.41 (n = 3,869) | Schroeder & Kucera ([ERIC](https://eric.ed.gov/?id=EJ1334754), 2022) |
| Teacher knows the misconception | 9,556 students: on questions with a popular wrong answer, gains were larger only when the teacher could *name the misconception*, not just the right answer | Sadler et al. ([MSPnet](https://mspnet.org/projects/mosart2/29256.html), 2013) |
| Learning by teaching | d ≈ 0.3–0.4 when preparing to teach; d ≈ 0.5–0.6 when actually teaching | Kobayashi ([ResearchGate](https://www.researchgate.net/publication/327072375_Learning_by_Preparing-to-Teach_and_Teaching_A_Meta-Analysis_Learning_by_Preparing-to-Teach_and_Teaching), 2019; snippet) |
| Teachable agents (the "protégé effect") | Students "make greater effort to learn for their TAs than they do for themselves"; strongest for lower achievers | Chase et al. ([PDF](https://aaalab.stanford.edu/papers/Protege_Effect_Teachable_Agents.pdf), 2009) |
| Metacognition (planning, monitoring, evaluating one's own learning) | +8 months' progress at very low cost | EEF Toolkit ([EEF](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation); snippet, page blocked) |
| STEM active learning vs lecturing | Failure rates 55% higher under lecturing | Freeman et al. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/24821756/), 2014) |
| Physics concept test (Force Concept Inventory) | Normalised gain 0.23 with traditional teaching vs 0.48 with interactive engagement (6,542 students) | Hake ([PDF](https://web.mit.edu/jrankin/www/Active_Learning/hake_active_phys.pdf), 1998) |

**The behaviour gap** (Karpicke et al. 2009, [PDF](https://learninglab.psych.purdue.edu/downloads/2009/2009_Karpicke_Butler_Roediger.pdf), verified in the full text):
- 84% of students reread their notes, and 55% say rereading is their main strategy.
- Only 11% practise recall.
- Students choose what *feels* fluent over what works.

### 1.2 Students outsourcing their thinking (2025–26)

**How widespread it is**
- **UK undergraduates** (HEPI surveys of n = 1,041 and 1,054): 92% used AI in 2025 and 95% in 2026; 94% use it for assessed work.
  - "Explain concepts to me" is the top use: 58% in 2025, "almost two-thirds" in 2026.
  - Pasting AI text straight into assessed work has risen from 3% (2024) to 8% (2025) to 12% (2026).
  - Only 37% feel their institution encourages AI use.
  - Students in the 2026 free-text answers wrote "My grades have dropped because AI is mitigating my ability to think critically" and "I'm not using my brain at all."
  - Sources: [HEPI 2025](https://www.hepi.ac.uk/reports/student-generative-ai-survey-2025/); [HEPI 2026 PDF](https://www.hepi.ac.uk/wp-content/uploads/2026/03/HEPI-Report-199-Gen-AI-Survey-2026.pdf) (12 Mar 2026).
- **13–18-year-olds** (National Literacy Trust, n = 40,543, 18 Aug 2026, [link](https://literacytrust.org.uk/research-services/research-reports/young-people-teachers-and-parents-use-of-ai-to-support-literacy-in-2026/)):
  - 79.0% used generative AI.
  - 24.1% simply copied AI output for homework, rising to **31.6% among pupils on free school meals**.
  - 62.8% agree that "AI should help you think, not think for you."
- **Teachers** (same survey): worry about pupils' AI use rose from 43.2% to **60.1%**; only 32.6% have been trained in critical AI literacy.
- **What students ask Claude** (574,740 conversations): 47% were "Direct", meaning answer-seeking with minimal engagement. The AI was doing the higher-order thinking: "Creating" was 39.8% of its work and "Analyzing" 30.2%. ([Anthropic, Apr 2025](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude))

**Evidence of harm**
- **Bastani et al., PNAS, Jun 2025** (randomised field trial, about 1,000 students; abstract verified via [Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1073/pnas.2422633122&resultType=core&format=json)):
  - Practice scores rose 48% with plain GPT-4 and 127% with a version designed to tutor.
  - With access removed, the plain-GPT group scored **17% worse than students who never had it**. Students had used it as a "crutch".
  - The tutor version's guardrails "largely mitigated" the harm.
- **Fan et al., British Journal of Educational Technology, 2025** ([Wiley](https://bera-journals.onlinelibrary.wiley.com/doi/10.1111/bjet.13544)): the ChatGPT group's essays improved most, but their knowledge gain and transfer were no different. The authors call this "metacognitive laziness".
- **OECD Digital Education Outlook 2026** ([OECD](https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html); snippet): general-purpose AI boosts how well students do a task "but not necessarily" how much they learn; purpose-built educational tools do better.
- **MIT "Your Brain on ChatGPT"** ([arXiv](https://arxiv.org/abs/2506.08872), 2025): in 54 participants, ChatGPT users showed the weakest brain connectivity on EEG and "struggled to accurately quote their own work." **This is a small, non-peer-reviewed preprint; cite it carefully.**
- **Microsoft Research and Carnegie Mellon, CHI 2025** ([PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf); 319 knowledge workers): more confidence in AI went with less critical thinking. This is self-reported, by adults.
- **UK Department for Education** (Aug 2025, [link](https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education/generative-artificial-intelligence-ai-in-education)): "evidence is still emerging"; pupils should use AI only "with appropriate safeguards".

**What works in randomised trials**
- **Harvard physics** (Kestin et al., *Scientific Reports*, Jun 2025; [Nature](https://www.nature.com/articles/s41598-025-97652-6); full text checked via [Europe PMC](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12179260/fullTextXML)):
  - 194 students. The AI-tutor group's median post-test was 4.5, against 3.5 for an *active-learning* class.
  - Learning gains more than doubled; effect size 0.73–1.3 standard deviations; 49 minutes versus 60.
  - **Design:** expert step-by-step solutions written into the prompt; one step at a time; never gives the answer away; manages cognitive load.
- **Nigeria (World Bank)** ([working paper 11125](https://ideas.repec.org/p/wbk/wbrwps/11125.html), 2025):
  - 6 weeks of GPT-4 use in pairs, with a teacher present: +0.31 standard deviations, roughly 1.5–2 years of normal schooling.
- **Khanmigo** (Oreopoulos & Low, Aug 2026, [EdWorkingPaper 26-1551](https://edworkingpapers.com/ai26-1551)):
  - A two-year trial gave +0.06–0.08 standard deviations a year, the same as Khan Academy without the AI.
  - 96% of students tried it, but they used it in only **17% of sessions where they made a mistake**. Their messages were "mostly bare answers or clicks on suggested prompts."
  - The authors' verdict: "The binding constraint appears to be engagement."
- **The pattern:** guardrails, expert-seeded content and a social frame work. Open chat that waits for the student to ask doesn't.

### 1.3 Under-served learner moments

| Moment | Number | Source |
|---|---|---|
| **GCSE maths resits** (age 17+, England) | **15.3%** of 219,135 got grade 4+ in 2026 (17.1% in 2025; 21.2% in 2019). That's about 185,000 failing each year. | Ofqual/JCQ data via [FE Week](https://feweek.co.uk/gcse-resits-2026-english-and-maths-pass-rates-fall-as-entries-surge/) (secondary, Aug 2026) |
| Correct answer, wrong reasoning | 20,964 responses on the Eedi maths platform: classifiers caught 57% of hidden misconceptions; reasoning models 84%, but with more false alarms than true catches | [arXiv 2606.23205](https://arxiv.org/abs/2606.23205) (AIED 2026) |
| Pupils with special educational needs (SEND, England) | Over 1.8 million (+5.2%); 6.0% have an education, health and care plan; 14.8% get SEN support | [DfE](https://explore-education-statistics.service.gov.uk/find-statistics/special-educational-needs-in-england) (Jun 2026) |
| English as an additional language (EAL) | 21.6% of pupils in England | [DfE](https://explore-education-statistics.service.gov.uk/find-statistics/school-pupils-and-their-characteristics/2025-26) (2026) |
| University students with dyslexia, dyspraxia or ADHD | 145,860 (about 6.7%) | [HESA Table 15](https://www.hesa.ac.uk/data-and-analysis/students/table-15) (2024/25; snippet) |
| Adults in learning | Only 21% are currently learning (30% in 2024) | [Learning and Work Institute](https://learningandwork.org.uk/resources/research-and-reports/adult-participation-in-learning-survey-2025/) (Nov 2025) |
| Apprentices | 65.4% complete, so about 1 in 3 don't | [FE Week](https://feweek.co.uk/apprenticeship-achievement-rate-falls-just-short-of-67-target/) (secondary, 2026) |

I found no primary data on gaps in understanding lab or practical work.

### 1.4 Existing tools and what none of them do

| Tool | What it does | Gap |
|---|---|---|
| ChatGPT study mode ([Jul 2025](https://openai.com/index/chatgpt-study-mode/)) / Claude learning mode ([Apr 2025](https://www.anthropic.com/news/introducing-claude-for-education)) / Gemini Guided Learning ([Aug 2025](https://techcrunch.com/2025/08/06/google-takes-on-chatgpts-study-mode-with-new-guided-learning-tool-in-gemini/), secondary) | Socratic hints and scaffolding | Opt-in and one click to leave; **the AI still explains**; no model of what this learner misunderstands; no view for the teacher |
| NotebookLM ([Sept 2025](https://workspaceupdates.googleblog.com/2025/09/flashcards-quizzes-reports-notebook-lm-google-education.html)) | Flashcards, quizzes, audio overviews, mind maps made from your sources | Builds the mind map *for* you: studying a ready-made map has g = 0.43 vs 0.72 for building your own. Mostly recall. |
| Khanmigo | A coach that won't give answers | Students rarely use it (above) |
| Duolingo Max / "Explain My Answer" (free since Jan 2026; [secondary](https://duoplanet.com/duolingo-max-review/)) | Explains after a mistake | Doesn't diagnose the rule the learner holds |

**The gaps:**
1. Diagnosing the *specific wrong mental model*, including when the answer is right.
2. Making the **learner generate**: teach, explain, map.
3. Reaching out to the learner instead of waiting to be asked.
4. A believable confused learner for students to teach:
   - Across 7 LLMs, simulated students showed near-zero "selective flip" scores: they changed their answers equally often whether or not the feedback was relevant ([Do, Sonkar & Sachan, 2026](https://arxiv.org/abs/2605.12748)).
5. Evidence of the student's reasoning for teachers: 65% of students say assessment has changed significantly ([HEPI 2026](https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/)).

**Early signals for "the student teaches the AI":** two small studies found gains with LLMs as teachable agents, in music theory (n = 28, [arXiv 2504.00636](https://arxiv.org/abs/2504.00636)) and computer science ([arXiv 2508.05979](https://arxiv.org/abs/2508.05979)). Treat these as promising, not proven.

---

## 2. AI + Climate

### 2.1 Person-scale pain points (UK)

**Heat**
- Heat-associated deaths in England: 2,985 (2022), 2,295 (2023), 1,311 (2024) and 1,504 (2025), the last across 5 heat episodes ([UKHSA 2025 report](https://www.gov.uk/government/statistics/heat-mortality-monitoring-report-england-2025/heat-mortality-monitoring-report-england-2025), Apr 2026).
- Who died in 2025:
  - People aged 85+ died at 364 per million.
  - 677 deaths were in care homes.
  - London had 317 deaths.
- The **interim figure for May–June 2026 is 2,877** ([UKHSA](https://www.gov.uk/government/publications/interim-heat-mortality-monitoring-report-england-may-and-june-2026/interim-heat-mortality-monitoring-report-england-may-and-june-2026), Jul 2026).
- Summer 2026 was the UK's hottest on record ([Met Office](https://www.metoffice.gov.uk/about-us/news-and-media/media-centre/weather-and-climate-news/2026/summer-2026-provisionally-hottest-on-record-for-the-uk), Sept 2026, verified):
  - The mean temperature was 16.5°C, and it reached 38.2°C on 13 August.
  - Climate change made it about 130 times more likely: it's now roughly a 1-in-9-year summer, against about 1-in-1,148 without warming.
- Homes are not built for this ([Climate Change Committee, *A Well-Adapted UK*](https://www.theccc.org.uk/publication/a-well-adapted-uk/), May 2026):
  - **92% of existing homes would overheat** with 2°C of warming.
  - Heat deaths are projected to rise to **3,000–10,000 a year by 2050**.
- Only 12% of households *report* uncomfortable heat ([English Housing Survey 2024-25](https://assets.publishing.service.gov.uk/media/697a0f35005d288bf850deb2/2024-25_EHS_Headline_Report_on_Housing_Quality_and_Energy_Efficiency.pdf)), so people under-perceive the risk.

**Floods**
- 6.3 million properties in England are at risk, 4.6 million of them from surface water. That surface-water figure is up 43%, mostly because modelling improved. About 8 million (1 in 4) will be at risk by 2050 ([Environment Agency](https://www.gov.uk/government/news/environment-agency-publishes-major-update-to-national-flood-and-coastal-erosion-risk-assessment), Dec 2024, verified).
- British Red Cross / Opinium survey (n = 3,306, Sept 2024; [PDF](https://assets.redcross.org.uk/82b1e254-5524-0172-0612-9ce813c7824c/d3ea670d-733a-416b-a928-b9eed2138ec1/Vulnerability-and-Resilience-Public-awareness-and-perceptions-of-flood-risk-in-the-UK.pdf), verified in the PDF text):
  - **Only 16% have signed up for flood warnings**, against 66% of people flooded in the past 5 years.
  - Sign-up is 7% among people aged 55+ and 9% among the lowest-income households.
  - Among people who say they live in a high-risk area but haven't signed up: 33% think warnings aren't relevant to them; 42% hadn't heard of them or didn't know how to sign up.
  - **41% wouldn't know what to do if their home started flooding.**
  - **72% of renters say they can't adapt their home** because they don't own it.
  - 49% know a neighbour who couldn't evacuate without help, and 48% wouldn't know how to help them.
- 45% of the public have never checked their home's flood risk ([Environment Agency](https://www.gov.uk/government/news/public-urged-to-get-flood-ready-as-environment-agency-launches-flood-action-week), Oct 2025).

**Energy**
- The Ofgem price cap for Oct–Dec 2026 is **£1,723 a year (+4%)** ([Ofgem](https://www.ofgem.gov.uk/press-release/energy-price-cap-will-rise-4-october-2026), Aug 2026).
- Fuel poverty in England ([DESNZ 2026](https://assets.publishing.service.gov.uk/media/69c3af123ed0546101e0dc3e/Main_Report__2026_Fuel_Poverty_Statistics_Publication_.pdf)):
  - 2.36 million households (9.4%) are fuel poor.
  - Private renters are 34.1% of fuel-poor households but only 18.7% of all households.
  - Single parents have the highest rate: 18.1%.
- Damp affects 10% of privately rented homes ([English Housing Survey](https://assets.publishing.service.gov.uk/media/697a0f35005d288bf850deb2/2024-25_EHS_Headline_Report_on_Housing_Quality_and_Energy_Efficiency.pdf)).
- **98% of external wall insulation jobs** under the government's ECO4 and Great British Insulation Scheme schemes have major problems ([National Audit Office](https://www.nao.org.uk/wp-content/uploads/2025/10/energy-efficiency-installations.pdf), Oct 2025).
- Heat pumps ([DESNZ Public Attitudes Tracker](https://www.gov.uk/government/statistics/desnz-public-attitudes-tracker-spring-2026/desnz-public-attitudes-tracker-heat-and-energy-use-in-the-home-spring-2026-uk), Spring 2026):
  - **78% are aware of them, but only 28% know a fair amount.**
  - 46% of homeowners say they're unlikely to install one.

**Food and water**
- Food waste ([WRAP](https://www.wrap.ngo/sites/default/files/2025-06/WRAP-UK-Food-Waste-and-Food-Surplus-Key-Facts-July-2025-v5.pdf), 2025; 2022 data):
  - Households waste 6.0 million tonnes a year, 4.36 million tonnes of it edible.
  - That's **£1,000 a year for a family of four**.
  - **80% believe they waste less than average** ([WRAP press release](https://www.wrap.ngo/media-centre/press-releases/sunday-15-march-average-uk-household-four-will-have-already-wasted), Mar 2026).
- Drought ([Environment Agency weekly report](https://www.gov.uk/government/publications/dry-weather-and-drought-in-england-2026-summary-reports/dry-weather-and-drought-in-england-31-july-to-6-august-2026), 2026):
  - July 2026 was England's driest on record.
  - 7 Environment Agency areas, including London, are in drought.
- 23 million customers are under hosepipe bans ([National Drought Group](https://www.gov.uk/government/news/national-drought-group-steps-up-response-after-third-heatwave), Jul 2026).
- Water use is 136.5 litres per person per day, against a 2038 target of 122 ([Environment Agency](https://www.gov.uk/government/publications/water-resources-2024-2025-analysis-of-the-water-industrys-annual-water-resources-performance), Nov 2025).

**Wildfire**
- About 48,000 hectares burned in 2025, a UK record ([NHESS](https://nhess.copernicus.org/articles/26/3761/2026/), 2026).
- I found **no data** on whether people know about smoke or air-quality alerts.

### 2.2 The gap between knowing and acting

| Domain | People who know or care | People who act |
|---|---|---|
| Heat (UNU, survey of 1,097 people, Aug 2025; [release](https://unu.edu/inweh/news/uk-heatwave-four-ten-adults-england-take-no-action-protect-themselves-response-heat), [paper](https://www.sciencedirect.com/science/article/pii/S2214629626001568)) | About 70% saw an alert | **41% of them took no action.** The main reason: "did not believe heat put them at risk". Only 18% see their heat risk as high. |
| Flood | 47% know how to look up their risk | 16% have signed up for warnings |
| Heat pumps | 78% aware | 28% know a fair amount |
| Food | Most are concerned | 80% think they're below average |

**Gaps in existing tools** (the "my analysis" notes are mine, not from a source):
- **UKHSA weather-health alerts** are aimed at "the health and social care sector" ([UKHSA dashboard](https://ukhsa-dashboard.data.gov.uk/weather-health-alerts)). They are regional and colour-coded, with no advice for a specific home or person.
- **Environment Agency flood tools:** warnings are opt-in, and the Red Cross recommends "push" alerts instead. A risk lookup doesn't produce a plan, and nothing is written for renters (my analysis).
- **Google Flood Hub** ([link](https://sites.research.google/gr/floodforecasting/)) forecasts river levels, with no household actions.
- **Retrofit advice** is generic and assumes the reader owns their home. After the insulation failures above, there's no easy way to know whom to trust (my analysis).

---

## 3. AI + Creativity

**Artists' fears about AI**
- 26% of illustrators and 36% of translators have already lost work to AI ([Society of Authors 2024](https://www.thebookseller.com/news/a-third-of-translators-report-losing-work-to-generative-ai-systems-soa-survey-reveals), secondary).
- Over 93% of artists want to be asked, credited and paid before their work is used for AI training ([DACS via CISAC, 2024](https://www.cisac.org/Newsroom/society-news/new-survey-shows-89-uk-artists-want-government-better-protect-their-work), secondary).
- Among 258 UK novelists, 59% know their work was used to train AI without permission, and 39% say their income has already fallen ([Cambridge, Nov 2025](https://www.cam.ac.uk/stories/generative-ai-novelists)).
- UK copyright policy:
  - In the 2024–25 copyright consultation, only 3% backed the government's then-preferred "train unless you opt out" option ([gov.uk, Dec 2025](https://www.gov.uk/government/publications/copyright-and-artificial-intelligence-progress-report/copyright-and-artificial-intelligence-statement-of-progress-under-section-137-data-use-and-access-act)).
  - In March 2026 the government dropped that preference and made no immediate reforms ([gov.uk, Mar 2026](https://www.gov.uk/government/publications/report-and-impact-assessment-on-copyright-and-artificial-intelligence/report-on-copyright-and-artificial-intelligence)).

**People who don't get to create**
- Arts GCSE entries fell 42% between 2009/10 and 2023/24 ([Cultural Learning Alliance 2025](https://www.culturallearningalliance.org.uk/wp-content/uploads/2025/03/CLA-2025-Report-Card_AW.pdf)).
- 54% of schools in the most deprived areas have no GCSE Music entries ([Cultural Learning Alliance 2026](https://www.culturallearningalliance.org.uk/report-card-and-rers-published-today/)).
- Only 41% of adults call themselves creative ([Adobe State of Create, 2016](https://www.digitaltrends.com/photography/2016-state-of-create/); secondary and old).

**AI as collaborator vs replacement**
- AI ideas made individual stories more creative but made stories more alike, so collective diversity fell ([Doshi & Hauser, *Science Advances* 2024](https://www.science.org/doi/10.1126/sciadv.adn5290)).
- With ChatGPT, 94% of brainstormed ideas overlapped, and diversity fell in 37 of 45 comparisons ([Meincke et al., *Nature Human Behaviour* 2025](https://www.nature.com/articles/s41562-025-02173-x); verified via [Wharton](https://mackinstitute.wharton.upenn.edu/2025/new-in-nature-chatgpt-decreases-idea-diversity-in-brainstorming/)).
- Users felt less responsible for ideas made with AI ([Anderson et al., Creativity & Cognition 2024](https://dl.acm.org/doi/10.1145/3635636.3656204)).
- AI writing suggestions nudged Indian writers towards Western styles ([CHI 2025](https://arxiv.org/pdf/2409.11360)).

**Emerging designs that put the human first**
- "AI should challenge, not obey" ([Sarkar, *Communications of the ACM*, 2024](https://cacm.acm.org/opinion/ai-should-challenge-not-obey/)).
- Short AI "provocations" that critique a suggestion brought back critical thinking ([arXiv 2501.17247](https://arxiv.org/abs/2501.17247), n = 24).
- Live AI feedback from different personas was valued by designers ([FeedQUAC, 2025](https://arxiv.org/abs/2504.16416)).
- Sketch plus speech used to build interactive worlds ([DrawTalking, UIST 2024](https://arxiv.org/abs/2401.05631)).
- Image generation guided by sketches ([ControlNet](https://arxiv.org/abs/2302.05543)).

**Accessibility**
- In-person arts engagement is 89% for disabled adults vs 91% for non-disabled adults; the bigger gap is deprivation, 81% vs 95% ([DCMS Participation Survey 2024/25](https://www.gov.uk/government/statistics/participation-survey-2024-25-annual-publication/main-report-for-the-participation-survey-april-2024-to-march-2025)). This measures engagement, not making art.
- Tools exist that help blind and low-vision creators check whether AI images match what they asked for ([GenAssist, UIST 2023](https://dl.acm.org/doi/10.1145/3586183.3606735); [AltCanvas, ASSETS 2024](https://arxiv.org/pdf/2408.10240)).
- Blind and low-vision artists set firm limits on authorship when using AI ([ASSETS 2025](https://doi.org/10.1145/3663547.3759727)).

**Unverified, don't cite:** the Design Council's "76% of designers need AI skills".

---

## 4. AI + Business

**The population**
- 5.7 million UK private-sector businesses; **4.27 million (75%) have no employees**, and 3.2 million are sole proprietorships ([DBT](https://www.gov.uk/government/statistics/business-population-estimates-2025/business-population-estimates-for-the-uk-and-regions-2025-statistical-release), Oct 2025).

**Cash flow**
- Late payment costs about £11bn a year and **closes 38 businesses a day** ([DBT](https://assets.publishing.service.gov.uk/media/688a1b428b3a37b63e739040/late_payments_tackling_poor_payment_practices.pdf), Jul 2025).
- 52% of small businesses write off late payments rather than chase them, and 36% then can't pay their own suppliers ([FSB/GoCardless](https://gocardless.com/blog/gocardless-fsb-late-payments-report-2025/), Mar 2025; co-publisher's page).
- UK small businesses are paid 8.3 days late on average ([Xero](https://www.xero.com/uk/resources/small-business-insights/latest-united-kingdom/), Jul 2026).

**Survival**
- Only 38.4% of businesses started in 2019 survived five years ([ONS](https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/businessdemography/2024), Nov 2025).
- CB Insights' "29% ran out of cash" is about investor-backed startups and dates from about 2014 ([PDF](https://s3-us-west-2.amazonaws.com/cbi-content/research-reports/The-20-Reasons-Startups-Fail.pdf)).
- **The "82% fail from cash flow" figure is a zombie statistic** with no traceable study behind it ([SMB Compass](https://www.smbcompass.com/small-businesses-fail-cash-flow-data/), secondary). Don't use it.

**Data and AI adoption**
- 28% of businesses with 0–9 staff use any AI, vs 49% of those with 250+. The top barrier is "difficulty identifying business use cases" ([ONS](https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/articles/artificialintelligenceinukbusinesses/2023to2026), Jul 2026, verified).
- 64% of businesses are worried about energy prices, rising to **90% in accommodation and food**, and 17% plan October price rises ([ONS business survey](https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/bulletins/businessinsightsandimpactontheukeconomy/latest), Sept 2026).
- Hospitality and food service waste 1.1 million tonnes of food a year ([WRAP](https://www.wrap.ngo/resources/report/uk-food-waste-food-surplus-key-facts), 2025).

**Not found:** primary data on market traders, student societies or micro-cafés, or the share of small businesses that don't forecast cash flow. **The team should validate these by interview.**

---

## 5. Personas

Each persona is tied to the figures cited above.

**Education**
- **Jonah, 20, first-year engineering student.** He can solve the textbook problems but can't explain why. He uses ChatGPT for every problem sheet.
  - The plain-GPT group scored 17% worse once AI was removed (Bastani); 95% of students use AI.
- **Kayla, 17, at an FE college in Lewisham, on her third GCSE maths resit.** She gets "the method" right some days and wrong on others.
  - 15.3% pass rate; 57% detection of hidden misconceptions.
- **Bilal, 15, Year 10, arrived from Syria two years ago.** He understands photosynthesis in Arabic but can't show it in English.
  - 21.6% of pupils have English as an additional language.
- **Ms Okafor, secondary science teacher.** She can't tell whether homework shows understanding.
  - 60.1% of teachers are worried; only 32.6% have had training.
- **Sana, 19, nursing student with dyslexia.** She drowns in lecture slides and rereads them.
  - 84% of students reread; about 6.7% of students report a learning difference.

**Climate**
- **Margaret, 81, lives alone in a top-floor flat in Hackney**, and her carer **Joy, 45**, who visits 8 clients.
  - People aged 85+ die from heat at 364 per million; 41% take no action on alerts.
- **Tunde and Aisha, private renters in a basement flat in Newham** in a surface-water flood area, with a toddler.
  - Warning sign-up is 9% among the lowest-income households; 72% of renters can't adapt their home.
- **Priya, 34, single parent renting an EPC-E flat in Croydon.** She has damp and a £1,723 bill.
  - Single parents have an 18.1% fuel-poverty rate.
- **Gareth, 58, homeowner in Kent who doesn't trust retrofit quotes.**
  - 98% of external wall insulation jobs had major defects; 28% know a fair amount about heat pumps.

**Creativity**
- **Leah, 24, freelance illustrator.** She wants critique, not imitation.
  - 26% of illustrators have lost work; over 93% of artists want consent and credit.
- **A student design collective whose AI brainstorms all converge.**
  - 94% of ideas overlapped.

**Business**
- **Rosa, 52, runs a street-food stall at a Brixton market.** She guesses each day's prep and prices.
  - 90% of food businesses are worried about energy prices. *This segment is unvalidated: interview to confirm.*
- **Femi, 27, freelance motion designer.** He's chasing three invoices.
  - Payments are 8.3 days late on average; 52% write them off.

---

## 6. Ranked "How Might We" statements

**How the scores work:** each idea is scored 1–5 on four factors and the scores are multiplied:
- Sev = how severe the problem is;
- Under = how under-served it is;
- Feas = how feasible a convincing prototype is in 6 days;
- Wow = demo impact.

### Education

| # | How might we… | Grounding | Sev | Under | Feas | Wow | Score |
|---|---|---|---|---|---|---|---|
| **E1** | …let **Jonah** prove he understands by *teaching* a stubborn AI classmate? The classmate is seeded with real misconceptions and changes its mind **only when his explanation addresses the misconception**. Afterwards he gets a map of the gaps his teaching revealed. | Learning by teaching d ≈ 0.5–0.6; self-explanation g = 0.55; simulated students are sycophantic (the technical depth); −17% once AI is removed | 5 | 5 | 4 | 5 | **500** |
| **E2** | …diagnose the *specific wrong rule* behind **Kayla's** answers, including the right ones, in 5 minutes, then give her a refutation and targeted practice? | 15.3% resit pass rate; 57–84% detection; refutation g = 0.41; Sadler; Eedi's public diagnostic-question dataset | 5 | 4 | 4 | 4 | **320** |
| **E3** | …let **Bilal** explain a concept in his home language and get feedback on the *concept* separately from his English? | 21.6% of pupils have English as an additional language; self-explanation | 4 | 4 | 4 | 4 | **256** |
| **E4** | …have **Sana** *build* the concept map herself (by voice or drag-and-drop) while the AI critiques missing or wrong links instead of drawing the map for her? | Building a map g = 0.72 vs studying one 0.43; NotebookLM draws maps for you | 3 | 4 | 4 | 4 | **192** |
| **E5** | …give **Ms Okafor** a "thinking receipt" showing which reasoning was the pupil's and which was the AI's? | 60.1% of teachers worried; 12% of students paste AI text; 65% say assessment has changed | 4 | 4 | 3 | 3 | **144** |
| **E6** | …make students commit to a prediction before any AI explanation unlocks (productive failure)? | g = 0.36–0.58; but study modes partly cover this | 4 | 2 | 5 | 3 | **120** |

### Climate

| # | How might we… | Grounding | Sev | Under | Feas | Wow | Score |
|---|---|---|---|---|---|---|---|
| **C1** | …turn a regional heat alert into a plan for **Margaret's** flat: which room, which hours, which medicines? Joy and a neighbour would get check-in prompts, in plain or spoken language. | 2,877 deaths in May–June 2026; 41% take no action; 30% never see an alert; 92% of homes would overheat by 2050 | 5 | 5 | 4 | 4 | **400** |
| **C2** | …turn **Tunde and Aisha's** address into a one-page flood plan for renters, and nudge them to sign up for warnings? | Only 16% have signed up; 41% wouldn't know what to do; 72% of renters can't adapt their home | 4 | 4 | 4 | 4 | **256** |
| **C3** | …help **Priya** turn her damp and her bill into evidence and the next step to take with her landlord? | Private renters are 34.1% of fuel-poor households; 10% of private rentals have damp | 4 | 4 | 3 | 3 | **144** |
| **C4** | …let **Gareth** upload a retrofit quote and his energy certificate (EPC) and get the red flags explained? | 98% of external wall insulation jobs had defects; 28% know a fair amount about heat pumps | 3 | 4 | 3 | 4 | **144** |
| **C5** | …show flatmates the food and water they *actually* waste compared with what they *think* they waste? | 80% think they're below average; 136.5 vs 122 litres per person per day; crowded app market | 2 | 2 | 5 | 3 | **60** |

### Creativity

| # | How might we… | Grounding | Sev | Under | Feas | Wow | Score |
|---|---|---|---|---|---|---|---|
| **Cr1** | …give **Leah** an AI *critic* that reacts live to her sketch with questions and a "how generic is this?" score, but never makes the art? | 26% of illustrators have lost work; over 93% want consent; "provocation" research | 3 | 4 | 5 | 5 | **300** |
| **Cr2** | …show a group in real time when its ideas are converging, and push it towards unexplored ground? | 94% overlap; diversity fell in 37 of 45 comparisons | 3 | 5 | 4 | 4 | **240** |
| **Cr3** | …let blind or low-vision makers direct AI images and check them by sound or touch? | GenAssist and AltCanvas exist only as research; firm limits on authorship | 4 | 5 | 2 | 4 | **160** |
| **Cr4** | …let "I can't draw" adults co-create a piece in which their own marks stay visible and theirs? | Arts GCSE entries down 42%; crowded sketch-to-image market | 2 | 2 | 4 | 4 | **64** |

### Business

| # | How might we… | Grounding | Sev | Under | Feas | Wow | Score |
|---|---|---|---|---|---|---|---|
| **B1** | …turn **Rosa's** photographed sales notebook into tomorrow's prep list and a "what if I charge 50p more?" simulation, explained aloud? | 4.27 million businesses with no employees; 90% of food businesses worried about energy; 1.1 million tonnes of hospitality food waste; *unvalidated* | 3 | 4 | 4 | 4 | **192** |
| **B2** | …predict when each of **Femi's** clients will actually pay, and show his cash runway? | 38 closures a day; payments 8.3 days late; incumbent accounting tools already compete (not verified) | 4 | 2 | 4 | 3 | **96** |
| **B3** | …turn a student society's ticket and spending exports into pricing and budget calls? | No data, an assumption to test | 2 | 4 | 5 | 2 | **80** |
| **B4** | …help a micro-café owner find their first real AI use case from their own data? | "Difficulty identifying use cases" is the top AI barrier (ONS) | 2 | 3 | 4 | 2 | **48** |

**Overall top 5:**
1. E1, 500
2. C1, 400
3. E2, 320
4. Cr1, 300
5. C2, 256

**Combining E1 and E2** (using the same misconception set to seed the teachable AI and to diagnose the student) is the most defensible Education build. It is clearly more than a wrapper, and Jonah or Kayla is a strong two-minute demo story.

---

## 7. Sources

All URLs are cited inline above. The core primary sources by track:

- **Education:**
  - [PNAS Bastani 2025](https://www.pnas.org/doi/10.1073/pnas.2422633122)
  - [Sci. Rep. Kestin 2025](https://www.nature.com/articles/s41598-025-97652-6)
  - [World Bank WP 11125](https://ideas.repec.org/p/wbk/wbrwps/11125.html)
  - [EdWorkingPaper 26-1551](https://edworkingpapers.com/ai26-1551)
  - [HEPI 2025](https://www.hepi.ac.uk/reports/student-generative-ai-survey-2025/), [HEPI 2026](https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/)
  - [National Literacy Trust 2026](https://literacytrust.org.uk/research-services/research-reports/young-people-teachers-and-parents-use-of-ai-to-support-literacy-in-2026/)
  - [Anthropic Education Report](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude)
  - [BJET Fan 2025](https://bera-journals.onlinelibrary.wiley.com/doi/10.1111/bjet.13544)
  - [OECD DEO 2026](https://www.oecd.org/en/publications/oecd-digital-education-outlook-2026_062a7394-en.html)
  - [MIT preprint](https://arxiv.org/abs/2506.08872)
  - [MSR/CMU CHI 2025](https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf)
  - [DfE AI guidance](https://www.gov.uk/government/publications/generative-artificial-intelligence-in-education/generative-artificial-intelligence-ai-in-education)
  - [DfE SEN 2026](https://explore-education-statistics.service.gov.uk/find-statistics/special-educational-needs-in-england)
  - [arXiv 2606.23205](https://arxiv.org/abs/2606.23205), [arXiv 2605.12748](https://arxiv.org/abs/2605.12748)
  - The meta-analyses in the §1.1 table
- **Climate:**
  - [UKHSA 2025](https://www.gov.uk/government/statistics/heat-mortality-monitoring-report-england-2025/heat-mortality-monitoring-report-england-2025), [UKHSA interim 2026](https://www.gov.uk/government/publications/interim-heat-mortality-monitoring-report-england-may-and-june-2026/interim-heat-mortality-monitoring-report-england-may-and-june-2026)
  - [Met Office 2026](https://www.metoffice.gov.uk/about-us/news-and-media/media-centre/weather-and-climate-news/2026/summer-2026-provisionally-hottest-on-record-for-the-uk)
  - [CCC A Well-Adapted UK](https://www.theccc.org.uk/publication/a-well-adapted-uk/)
  - [Environment Agency flood assessment](https://www.gov.uk/government/news/environment-agency-publishes-major-update-to-national-flood-and-coastal-erosion-risk-assessment)
  - [British Red Cross](https://assets.redcross.org.uk/82b1e254-5524-0172-0612-9ce813c7824c/d3ea670d-733a-416b-a928-b9eed2138ec1/Vulnerability-and-Resilience-Public-awareness-and-perceptions-of-flood-risk-in-the-UK.pdf)
  - [UNU heat-alert study](https://unu.edu/inweh/news/uk-heatwave-four-ten-adults-england-take-no-action-protect-themselves-response-heat)
  - [Ofgem](https://www.ofgem.gov.uk/press-release/energy-price-cap-will-rise-4-october-2026)
  - [DESNZ fuel poverty](https://assets.publishing.service.gov.uk/media/69c3af123ed0546101e0dc3e/Main_Report__2026_Fuel_Poverty_Statistics_Publication_.pdf), [DESNZ Public Attitudes Tracker](https://www.gov.uk/government/statistics/desnz-public-attitudes-tracker-spring-2026/desnz-public-attitudes-tracker-heat-and-energy-use-in-the-home-spring-2026-uk)
  - [NAO](https://www.nao.org.uk/wp-content/uploads/2025/10/energy-efficiency-installations.pdf)
  - [WRAP](https://www.wrap.ngo/sites/default/files/2025-06/WRAP-UK-Food-Waste-and-Food-Surplus-Key-Facts-July-2025-v5.pdf)
  - [Environment Agency drought report](https://www.gov.uk/government/publications/dry-weather-and-drought-in-england-2026-summary-reports/dry-weather-and-drought-in-england-31-july-to-6-august-2026)
- **Creativity:**
  - [Science Advances 2024](https://www.science.org/doi/10.1126/sciadv.adn5290)
  - [Nature Human Behaviour 2025](https://www.nature.com/articles/s41562-025-02173-x)
  - [Cambridge novelists](https://www.cam.ac.uk/stories/generative-ai-novelists)
  - [gov.uk copyright report 2026](https://www.gov.uk/government/publications/report-and-impact-assessment-on-copyright-and-artificial-intelligence/report-on-copyright-and-artificial-intelligence)
  - [Cultural Learning Alliance 2025](https://www.culturallearningalliance.org.uk/wp-content/uploads/2025/03/CLA-2025-Report-Card_AW.pdf)
  - [CACM Sarkar](https://cacm.acm.org/opinion/ai-should-challenge-not-obey/)
- **Business:**
  - [DBT business population](https://www.gov.uk/government/statistics/business-population-estimates-2025/business-population-estimates-for-the-uk-and-regions-2025-statistical-release), [DBT late payments](https://assets.publishing.service.gov.uk/media/688a1b428b3a37b63e739040/late_payments_tackling_poor_payment_practices.pdf)
  - [ONS AI adoption](https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/articles/artificialintelligenceinukbusinesses/2023to2026), [ONS business demography](https://www.ons.gov.uk/businessindustryandtrade/business/activitysizeandlocation/bulletins/businessdemography/2024)
  - [Xero](https://www.xero.com/uk/resources/small-business-insights/latest-united-kingdom/)

**How this was checked:**
- **Climate, Creativity and Business** were gathered by two research sub-agents. I re-checked these myself:
  - UNU heat-alert figures, Environment Agency flood figures, Met Office summer 2026, Red Cross flood survey (in the PDF text);
  - Meincke's brainstorming figures, ONS AI adoption.
- **Education** I checked myself. Karpicke and HEPI 2026 were verified in the PDF text; Bastani and Kestin via Europe PMC.
