# 06 — Prior-art check: E1 (stubborn classmate), H2 (care inbox), CL1 (heat check-in)

*Researched 4 Oct 2026 for ForgeHacks 2026. Sources are web pages and papers. Nothing was signed up for, installed or submitted. Devpost's own search page renders client-side, so the WebFetch tool could not read it. Devpost coverage therefore comes from `site:devpost.com` web searches, which miss some projects. Treat "found nothing" as "found nothing in the index".*

## TL;DR verdict table

| Concept | Novelty (1–5) | Closest competitor(s) | Sharpest unclaimed angle |
|---|---|---|---|
| **E1 Stubborn classmate** | **3** (the "teach-the-AI" frame is crowded, but the gated belief state with selective-flip evaluation is not) | Research: AlgoBo/TeachYou (CHI 2024), Do–Sonkar–Sachan SFS paper (May 2026). Hackathon: **MIMIR** (Aug 2026, misconceptions taken from documented human errors) and **Tuva** (won a sponsor prize, Feb 2026) | A **belief-state engine** that flips only when the student's explanation addresses the misconception's root cause, built on Eedi's CC BY misconception graph. Ship a **live SFS scoreboard** comparing it with a vanilla-LLM classmate. That puts the May 2026 finding into a product at inference time, with no fine-tuning. Nobody found does this. |
| **H2 Care inbox** | **2** if the inbox is the hero, **3** if reconciliation is the hero | **Loved One** (one shared @lovedone.app inbox per parent, AI classifies messages, US). **KeptWell** (email forwarding, tracks medicine changes, US). ElderCare (photographs discharge papers, US) | **Family-side cross-document medicines reconciliation for the NHS.** It diffs the discharge letter, the GP repeat list and pharmacy messages, normalised to dm+d codes, and shows the source quote for each discrepancy, plus "questions for your pharmacist". Clinician tools (Corti, Virtual Pharmacist) do this; no consumer or carer product found does. |
| **CL1 Heat check-in** | **2** | **Care-Cast**, which won **1st place** at the Health in Climate NYC Hackathon 2025: WhatsApp via Twilio, NWS heat triggers, personalised by medications, check-ins, escalation. **CLOVA CareCall** (Korea, 128 municipalities, gives heatwave guidance on AI calls). Kassel "Heat Telephone" (human) | **UK home-overheating personalisation.** Use top floor, window orientation and so on, plus the hourly forecast, to estimate indoor risk without sensors (Ethos does it with sensors). Make it **voice-first for landline-only elders** and design the call to close the "I'm not at risk" belief gap. The UKHSA alert season ended on 30 Sept, so the demo has to replay summer-2026 alerts. |

---

## E1 — "The stubborn classmate" (AI + Education)

### 1. Direct competitors and products
- **Teach-the-AI products are common, but they are Feynman-style feedback tools, not misconception-holding peers.** Examples include Feynman AI (Play Store, updated Aug 2026), GetFeynman and feynmanai.net. You explain, then the AI grades you. None of them has an AI learner with an explicit wrong belief ([Play](https://play.google.com/store/apps/details?id=com.learning.feynmanai&hl=en_US), [getfeynman.app](https://getfeynman.app/), [feynmanai.net](https://feynmanai.net/)).
- **ALTER-Math** (U. Florida, Utah, Vanderbilt, Stanford and Duke, with Accelerate Learning/Math Nation) is the closest product at scale. Middle-schoolers teach an AI agent and correct its errors. It has reached more than 50k students since Oct 2023, has $10M funding, and reports 1.56× learning gains. It uses intentionally "weak" models, but the public material does not describe an explicit misconception state or a root-cause gate ([U. Utah](https://attheu.utah.edu/research/ai-paves-the-way-for-kids-to-learn-math-by-teaching-it/), [arXiv 2409.06721](https://arxiv.org/abs/2409.06721)).
- **Eedi** offers the Eedi Tutor, a Socratic AI that fires after a diagnostic question reveals a misconception. There the AI tutors the student; there is **no** learning-by-teaching mode ([Eedi Tutor](https://www.eedi.com/eedi-tutor), [eedi.com](https://www.eedi.com/)).
- **Khanmigo**: searched for a "student teaches Khanmigo" mode and found none. It is a Socratic tutor ([search: `Khanmigo "teach" mode student teaches AI misconception`]; e.g. [CBS](https://www.cbsnews.com/news/khanmigo-ai-powered-tutor-teaching-assistant-tested-at-schools-60-minutes-transcript/)).
- **Betty's Brain** (Vanderbilt) is the classic pre-LLM teachable agent. Students teach it through a causal concept map ([Wikipedia](https://en.wikipedia.org/wiki/Betty's_Brain)). The protégé effect comes from Chase et al. ([Stanford AAA Lab PDF](https://aaalab.stanford.edu/papers/Protege_Effect_Teachable_Agents.pdf)).

### 2. Research prototypes (the real competition)
- **AlgoBo / TeachYou** (Jin et al., KAIST, **CHI 2024**). An LLM tutee keeps a JSON knowledge state through a "Reflect-Respond" pipeline, aiming for *reconfigurability, persistence and adaptability*. Incorrect or random input had little effect on it. The domain is algorithms, not maths, and it updates on *any* correct teaching rather than requiring the root cause to be addressed ([arXiv 2309.14534](https://arxiv.org/html/2309.14534v3)).
- **MatlabTutee**, "Playing Dumb to Get Smart" (Rogers et al., **CHI 2025**). A feigned-ignorance tutee in university CS, tested with 119 students ([ACM](https://dl.acm.org/doi/10.1145/3706598.3713644)). **Explique / Algorithm Apprentice** was a semester-long deployment with 546 students ([ACM](https://doi.org/10.1145/3774398.3811623)).
- **Do, Sonkar & Sachan (12 May 2026)** introduce the Selective Flip Score. LLM simulators score close to zero: they abandon the misconception under *any* corrective signal. The authors fix this with SFT, preference optimisation and RL, gaining up to +0.56 SFS. **The fix is training-time and the use case is simulation for tutor training, not a learning-by-teaching product** ([arXiv 2605.12748](https://arxiv.org/abs/2605.12748)).
- **AgentSchool** (May 2026) has student agents whose misconceptions are stored as structured objects that persist until teaching targets them. It is **simulation-only**, not for human learners ([arXiv 2605.30144](https://arxiv.org/html/2605.30144v1)).
- Other related work: **Chrysalis** compares an LLM tutor with a teachable agent (36 participants) ([arXiv 2510.05271](https://arxiv.org/abs/2510.05271)). **StudentSim** (Microsoft, Sept 2026) trains simulators for "guidance responsiveness", but the abstract does not mention selective flip ([arXiv 2609.01591](https://arxiv.org/abs/2609.01591)). Sonkar et al. 2024 built misconception-faithful cognitive models with MalAlgoPy ([arXiv 2410.12294](https://arxiv.org/abs/2410.12294)). An AIED-track paper teaches AI literacy to a low-competence teachable agent with an evaluator agent ([Springer](https://link.springer.com/chapter/10.1007/978-3-032-29794-5_40)).

### 3. Prior hackathon projects
Queries run: `site:devpost.com "teach the AI" student misconception`, `devpost "learn by teaching" AI student Feynman`, `site:devpost.com AI "confused student"…`, `site:devpost.com "misconception" AI student "teach" math`, `site:devpost.com "protégé effect" AI`, `site:devpost.com Feynman "teach" AI student winner`, `site:devpost.com "AI student" … sycophantic OR stubborn`.

**About 15 teach-the-AI projects turned up.** Among them were EchoLearn, Lectern, Feynman AI, Feynman.ai, The Duck You Mean?, pedagogue.ai, Study Buddy, Code Tutor, LearniAI, KitabDost, Protégé (HackIllinois 2021) and Retain. The five closest:
1. **MIMIR** (SPEED August AI Challenge, Aug 2026). The apprentice "Ada" makes mistakes "seeded from documented human misconceptions" and uses BKT. **No evidence that she checks whether a correction addresses the root cause.** No prize shown ([Devpost](https://devpost.com/software/mimir-the-inverted-ai-cognitive-apprentice)).
2. **Tuva** (GDG McMaster Mac-a-Thon 2026). A reverse tutor that plays "a confused student" and uses "Socratic Sabotage". It **won Best Use of Featherless.ai**. It has no explicit misconception state ([Devpost](https://devpost.com/software/tuva-multimodal-feynman-ai)).
3. **Dasko** (Gemini Live Agent Challenge, Mar 2026). Voice and vision classroom of AI students that "sometimes get things wrong". No belief model is described ([Devpost](https://devpost.com/software/dasko)).
4. **The Tutor Trainer** (HackSocial, Aug 2025). Generates a simulated student for tutors to practise on ([Devpost](https://devpost.com/software/the-tutor-trainer)).
5. **Protégé** (HackIllinois 2021). Students explain concepts to GPT-3, and the teacher sees comprehension clusters ([Devpost](https://devpost.com/software/protege)).

**Not found:** any Devpost project with an explicit belief state that is gated on root cause, or any that measures selective flipping against a baseline.

### 4. Verdict: 3/5
Judges will have seen "teach the AI" before: it is crowded in research and on Devpost, and one version won a sponsor prize this year. MIMIR already claims "misconceptions from a real catalogue". The part still open is the **mechanism and the proof**. (a) The flip is gated by a checker that tests whether the explanation addresses the misconception's *causal claim*, not merely the right answer. (b) A **side-by-side live SFS demo** shows a vanilla LLM classmate caving to "no, the answer is 6" while yours does not. That demonstrates the AI doing real work, not acting as a wrapper. (c) The **gap map** goes to the student or teacher afterwards. Ground everything in the Eedi graph, and cite the May 2026 paper as the motivating finding.

### 5. Feasibility (5 days)
- **Data:** the **Eedi Misconceptions Graph v1.0** is on Hugging Face under **CC BY 4.0**, with commercial use allowed and no gating. It has 8,117 misconceptions and 2,258 constructs across Number, Algebra, Geometry and Statistics, but **no question text or distractors** ([HF](https://huggingface.co/datasets/Eedi/Eedi-Misconceptions-Graph), [Eedi](https://www.eedi.com/news/eedis-misconception-graph-is-now-a-public-good)). The Kaggle competition files (`train.csv` with questions and distractors, `misconception_mapping.csv`) are reported as **CC BY-NC 4.0**, which is fine for a non-commercial hackathon ([eth-lre README](https://github.com/eth-lre/llm-student-modeling-strategies), [Kaggle](https://www.kaggle.com/competitions/eedi-mining-misconceptions-in-mathematics)).
- **Build:** misconception state (belief, root-cause rubric, flip threshold) → LLM-as-judge checks whether the explanation targets the rubric → only then the state flips → generate the answer from the state. Evaluate on roughly 30 Eedi items × 3 feedback types (targeted, generic, answer-only) for both systems. That gives a credible SFS chart in about a day.
- **Minors:** if the product is aimed at under-18s, the DfE *Generative AI: product safety expectations* apply to edtech for schools (filtering, monitoring, data protection) ([GOV.UK](https://www.gov.uk/government/publications/generative-ai-product-safety-expectations)). For the demo, use synthetic users and collect no personal data.

---

## H2 — "Care inbox" (AI + Healthcare)

### 1. Direct competitors
- **Loved One** (formerly Sandwich Care Circle, US) is **almost the same as the inbox half.** Each parent gets a private `@lovedone.app` address for doctors and pharmacies, there is a shared family inbox with comments and task assignment, and "AI summarizes each message and classifies it (appointment, pharmacy, billing, discharge…)". No medicines reconciliation is mentioned ([lovedone.app](https://lovedone.app/)).
- **KeptWell** (US) accepts uploads and forwarded emails, tracks medications "with dosages, changes, and dates", flags abnormal labs and shares with a family circle ([keptwell.org](https://keptwell.org/)).
- **ElderCare** (Georgia, US, Sept 2026) photographs discharge papers and labels, extracts medications and appointments next to the source image, and states it gives no medical advice. It does not reconcile across documents ([article](https://lifestyle.middletownlifemagazine.com/story/697822/eldercare-website-offers-a-home-for-discharge-papers/)).
- **Neela** (US) is an AI caregiver app with a scribe, medication tracking and a vault. No document reconciliation is described ([neelacares.com](https://www.neelacares.com/for-caregivers)). "CarePath AI" is only a **startup-idea listing**, not a product ([TurboStarter](https://www.turbostarter.dev/ideas/ai/carepath-ai)).
- **UK incumbents:**
  - **Jointly** (Carers UK) offers circle-of-care messaging, a calendar and a *manually entered* medication list ([Play](https://play.google.com/store/apps/details?id=org.carersuk.jointlyapp&hl=en_GB)).
  - **Patients Know Best** lets carers be invited to view letters and discharge summaries, and is integrated with the NHS App ([PKB](https://patientsknowbest.com/patients-and-carers/)).
  - **NHS App proxy access** is being piloted in 68 practices and rolls out more widely during 2026 ([digitalhealth.net](https://www.digitalhealth.net/2025/09/gp-surgeries-pilot-proxy-access-for-families-on-nhs-app/), [NHS England](https://digital.nhs.uk/services/national-proxy-service)). It covers the "GP list" source but does no reconciliation.
  - **Medisafe** Medfriend alerts a carer about missed doses ([Medisafe](https://medisafe.com/education-resources/the-impact-of-medisafes-medfriend-caregiver-feature-on-adherence)).
  - **CareZone** scanned pill bottles. Walmart bought it in 2020 and accounts were deactivated in Jan 2023 ([MobiHealthNews](https://www.mobihealthnews.com/news/walmart-snaps-digital-health-company-carezones-medication-management-tool), [Tech-enhanced Life](https://www.techenhancedlife.com/reviews/carezone-medication-app)).
- **Clinician-side reconciliation (proof that the problem is real):**
  - **Corti's Medication Reconciliation Agent** compares home, inpatient and discharge lists and outputs a Continue/Stop/Change/Start plan *for clinicians* ([Corti](https://www.corti.ai/agents/medication-reconciliation-agent)).
  - **Virtual Pharmacist** (UK) has pharmacists reconcile discharge summaries into GP records for practices and PCNs ([site](https://virtualpharmacist.co.uk/solution/discharge-medication-reconciliation/)).
  - **NHS England's Discharge Medicines Service** has community pharmacies reconcile the discharge list against the GP repeat ([PPETS summary](https://ppets.co.uk/medicines-reconciliation)).

### 2. Research
A 2026 JMIR scoping review of AI medication reconciliation found studies that flag discrepancies between AI-extracted lists and patient-entered lists ([JMIR](https://www.jmir.org/2026/1/e86760/PDF)). There is also an RCT of the MedBook portal ([BMC](https://link.springer.com/article/10.1186/s12875-025-02904-z)). Everything found is clinician- or patient-portal-centred; none of it is a family email inbox.

### 3. Prior hackathon projects
Queries run: `site:devpost.com "medication reconciliation"`, `…caregiver discharge summary AI extracts medications family`, `…carer NHS letters AI timeline medications parent`, `…caregiver email inbox forward medical documents AI agent`, `…"medication list" "discharge" caregiver changed dose compare documents`.

**About 8 near-matches turned up, and none reconciles across documents for families:**
- **DischargeIQ**: clinician dashboard plus "fridge-friendly" med schedules (Agents Assemble, May 2026) ([Devpost](https://devpost.com/software/dischargeiq)).
- **ClarityCare AI**: discharge notes rewritten as multilingual instructions, with caregiver mode only as future work ([Devpost](https://devpost.com/software/claritycare-ai)).
- **CareGuide**: discharge notes plus EHR turned into care plans (UC Berkeley AI Hackathon 2024) ([Devpost](https://devpost.com/software/careguide-oda6fq)).
- **Intake agent**: extracts referral packets and validates medication dosages, for home-health agencies ([Devpost](https://devpost.com/software/intake-agent)).
- **Medic-Mate**: interaction checker ([Devpost](https://devpost.com/software/medic-mate)).

No prizes were visible on these pages. **Zero results for "medication reconciliation" in a Devpost project body.**

### 4. Verdict: 2 for the inbox, 3 for reconciliation
"Forward everything to one family address and let AI organise it" already exists (Loved One, KeptWell), so leading with that will look derivative. The open ground is the **UK-specific, family-side medicines diff**:
- Parse NHS discharge letters, GP repeat lists from NHS App screenshots, and pharmacy messages.
- Normalise drugs to dm+d.
- Show each discrepancy with **verbatim source quotes from both documents and the date order**, for example "Discharge 12/09: furosemide 40 mg twice a day / GP list 20/08: 40 mg once a day".
- Produce a printable "questions for the pharmacist" sheet for the DMS follow-up.

Keep Agentboxd as the plumbing, not the pitch.

### 5. Feasibility and red flags
- **APIs:**
  - **Agentboxd** is free during beta, hosted in the EU (France), with webhooks, attachments as JSON, and prompt-injection scoring on inbound mail ([agentboxd.com](https://agentboxd.com/), [GitHub](https://github.com/agentboxd/agentboxd)).
  - **dm+d** is under the Open Government Licence via TRUD (free registration) or the NHS Terminology Server FHIR API ([NHS England](https://digital.nhs.uk/services/terminology-and-classifications/dm-d)).
  - **The BNF is not available through the free NICE API.** Access goes through Pharmaceutical Press ([NICE](https://www.nice.org.uk/reusing-our-content/nice-syndication-api)), so do not depend on it.
  - **openFDA** is free (no key at 40 requests/min; 120k/day with a key), but its names are US ones ([guide](https://rxlabelguard.com/blog/openfda-drug-label-api-developer-guide)).
- **MHRA (main red flag):** the guidance says software that "makes it possible to use patient-specific data for the purposes… of **detecting contraindications, drug interactions and excessive doses**" is a medical device for that function. Software that only "stores or transmits medical data without change", or an EPR that "simply replaces a patient's paper file", is not. Reminder apps are "unlikely to be devices" ([MHRA guidance v1.10, pp. 9–19](https://assets.publishing.service.gov.uk/media/64a7d22d7a4c230013bba33c/Medical_device_stand-alone_software_including_apps__including_IVDMDs_.pdf)).
  - **Design rule:** flag *document disagreement* only, never "this dose is too high" or interaction alerts. Always route to the pharmacist or GP.
  - Any NHS deployment would also need **DCB0129** clinical-safety work ([NHS England](https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0129-clinical-risk-management-its-application-in-the-manufacture-of-health-it-systems)).
- **Data:** use synthetic letters only. Health data is special-category under UK GDPR.
- **Stats check:** the "34% spend 10+ hrs/month on NHS admin" figure is confirmed in Carers UK's NHS 10-Year-Plan vision report ([PDF](https://www.carersuk.org/media/stxp5zaf/cuk-nhs-10-year-plan-vision-report.pdf)).

---

## CL1 — "Heat check-in" (AI + Climate)

### 1. Direct competitors and analogues
- **CLOVA CareCall** (Naver, Korea) makes AI phone calls to elderly people living alone, escalates warning signs to local government and **"delivers heat wave and cold wave forecasts during wellness calls"**. It runs in 128 municipalities. In summer 2026, fainting-symptom alerts rose 417% year on year ([Seoul Economic Daily](https://en.sedaily.com/technology/2026/08/13/ai-care-services-catch-more-elderly-health-warnings-in), [Naver](https://www.navercorp.com/en/media/pressReleasesDetail?seq=30782)).
- **US AI daily wellness calls with family escalation:**
  - CheckWellCall (mid-2026, voice agent "Ava", alerts family) ([HomeCare](https://www.homecaremag.com/news/checkwellcall-launches-ai-wellness-platform-seniors)).
  - AloneAssist ($14.99/month; alerts the care circle if there is no pick-up) ([AgeInPlaceTech](https://www.ageinplacetech.com/pressrelease/aloneassist-launches-ai-powered-daily-wellness-call-older-adults-1499-month)).
  - Callie Care ([AI Journal](https://aijourn.com/callie-care-raises-500k-pre-seed-to-tackle-americas-senior-care-gap-with-phone-first-ai/)).
  - None of these is heat-triggered.
- **Human versions of the same idea:**
  - Kassel's **"Heat Telephone Parasol"** (since 2010): volunteers phone registered over-65s on German Weather Service level-2 heat warnings ([Climate-ADAPT PDF](https://climate-adapt.eea.europa.eu/en/mission/external-content/pdfs/mission-story_heat-telephone_june24_final-1.pdf/@@download/file)).
  - France's **registre canicule**: town halls must call registered vulnerable people when the heat plan triggers, by law since 2004 ([example](https://www.le-procrastinateur.com/vie-quotidienne/canicule-registre-mairie-personnes-vulnerables)).
  - **Maricopa County**: courtesy calls during NWS heat warnings ([Maricopa](https://www.maricopa.gov/m/newsflash/home/detail/2970)).
  - **NYC Be A Buddy**: volunteer heat check-ins ([NY1](https://ny1.com/nyc/all-boroughs/weather/2022/03/25/be-a-buddy-and-help-your-neighbors-during-severe-weather)).
- **Personalised heat risk:**
  - **HeatWatch** (U. Sydney) gives personalised risk by postcode, age, medical conditions and **medications** ([U. Sydney](https://www.sydney.edu.au/news-opinion/news/2023/12/14/heatwatch-app-to-be-trialled-over-summer-as-temperatures-soar.html)).
  - **Ethos** (Griffith, *npj Digital Medicine* 2025) uses *indoor* sensors and a core-temperature model, and gives tailored cooling advice. About 90% of alerts were acted on. It **does not contact carers** ([Springer Nature summary](https://communities.springernature.com/posts/rethinking-heat-early-warning-systems-a-personalised-approach-for-older-adults)).
  - Harvard C-CHANGE and Climate Central send location-specific heat alerts **to clinicians** ([Americares](https://www.americares.org/news/climate-and-health-equity-program-launches-with-frontline-health-clinics-in-arizona-florida-and-louisiana/)).
- **UK:** Age UK and the Red Cross urge people to check on neighbours but run no heat-triggered calling service that we found ([Age UK](https://www.ageuk.org.uk/latest-press/articles/age-uk-responds-to-heat-health-alerts/), [Red Cross 2023](https://www.redcross.org.uk/about-us/news-and-media/media-centre/press-releases/cultural-shift-needed-on-heatwave-action-warns-british-red-cross)). Tunstall's "heat alarm" is a 58 °C fire-type sensor, not ambient heat risk ([Tunstall](https://www.tunstall.co.uk/products/environmental-sensors/heat-alarm/)). Searched for council telecare heatwave welfare-call schemes and found no specific programme ([search: `council telecare "heatwave" "welfare calls"…`]).
- **Problem stats confirmed:** UNU-INWEH (Aug 2026) found that 41% of people who saw an alert took no action, mainly because they did not see themselves at risk, and about 30% never saw alerts ([UNU](https://unu.edu/inweh/news/uk-heatwave-four-ten-adults-england-take-no-action-protect-themselves-response-heat), [Euronews](https://www.euronews.com/2026/08/17/heat-alerts-no-action)).

### 2. Research
- Ethos (above).
- A 2026 scoping review of heat-risk communication for community-dwelling older adults ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC13184485/)).
- An LLM-enhanced agent-based model of a heatwave, which found that adoption follows "complex contagion" through social networks. That supports escalating through neighbours (arXiv 2605.15918, via [search result](https://letsdatascience.com/news/researchers-simulate-heatwave-health-effects-with-llm-enhanc-9471ff33)).
- A German RCT of automated phone heat warnings for vulnerable groups ([PMC6121297](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6121297/); the full text was CAPTCHA-blocked, so only the search abstract was seen).

### 3. Prior hackathon projects
Queries run: `site:devpost.com heatwave elderly alert call check-in`, `…"heat wave" vulnerable seniors AI voice call Twilio`, `…extreme heat personalised risk elderly medications`, `…heat alert SMS WhatsApp elderly neighbour escalate`, `…"heat" "check-in" seniors climate AI calls forecast`. I also browsed the Health in Climate NYC 2025 gallery.

**About 6 near-matches turned up, including one winner that is essentially this concept:**
1. **Care-Cast** ("Forecasting Health, not just Weather") won **1st place at the Health in Climate NYC Hackathon 2025**. It messages elderly and vulnerable patients over **WhatsApp via Twilio**, triggers on National Weather Service heat alerts, personalises by "age… medications and chronic conditions", runs daily and weather-triggered check-ins, and has **risk-based escalation** ([Devpost](https://devpost.com/software/care-cast), [GitHub](https://github.com/ahsantahseen/Storm-Logic)).
2. **CuraVias**: SMS heat alerts personalised by medical risk, plus a clinician dashboard. Same hackathon, no prize ([Devpost](https://devpost.com/software/curavias)).
3. **Horizon / My Buddy**: heat-alert chatbot with medication guidance ([Devpost](https://devpost.com/software/horizon-3na50b)).
4. **ClaraCare** and **VoiceCare**: daily Twilio AI calls to seniors with family dashboards or SOS. Not heat-triggered ([ClaraCare](https://devpost.com/software/claracare), [VoiceCare](https://devpost.com/software/voicecare-ai-companion-for-elderly)).

### 4. Verdict: 2/5
The core loop (heat alert → personalised outreach to an elderly person → check-ins → escalation) **has already won a hackathon**, and Naver runs it nationally in Korea. To compete, the team needs a clearly different mechanism:
- **(a) Home-specific indoor-heat estimate** without sensors. Use floor level, window orientation, the overnight minimum from the hourly forecast and occupant medications to produce an hour-by-hour "close curtains at 10:00, open windows at 22:00" plan. This is Ethos's idea delivered by voice.
- **(b) Belief-gap dialogue**: the call is designed and evaluated to shift "I'm not at risk", the main cause of inaction according to UNU.
- **(c) Voice to landlines** for people who have no smartphone or WhatsApp.
- **(d) A neighbour-network escalation ladder** rather than only "notify family".

### 5. Feasibility and red flags
- **Alerts:**
  - The UKHSA dashboard API is open (`/api/proxy/alerts/v1/heat`, by region code). It returned all-Green for the nine English regions when fetched ([UKHSA API](https://ukhsa-dashboard.data.gov.uk/api/proxy/alerts/v1/heat), [docs](https://ukhsa-dashboard.data.gov.uk/access-our-data)).
  - Alerts are issued **by region, not postcode**, and are aimed mainly at the health and social care sector. **The heat-health alert season runs 1 June to 30 September**, so nothing will be live during 3–10 Oct and the demo must replay a summer-2026 alert ([UKHSA user guide](https://assets.publishing.service.gov.uk/media/6a048558ee62840dba48a207/WHA_User_Guide.pdf)).
- **Forecast:**
  - **Open-Meteo** is free for non-commercial use with no key (<10k calls/day, CC BY 4.0) and serves the UK Met Office model ([terms](https://open-meteo.com/en/terms), [UKMO API](https://open-meteo.com/en/docs/ukmo-api)).
  - **Met Office DataHub** site-specific free tier allows 360 calls/day ([pricing](https://datahub.metoffice.gov.uk/pricing/site-specific)).
- **Voice:**
  - Twilio UK outbound costs about $0.0158/min to landlines and $0.0305/min to mobiles; a local number is $3.50/month ([Twilio](https://www.twilio.com/en-us/voice/pricing/gb)).
  - **Trial accounts can only call or text up to 5 verified numbers, play a trial message, and limit calls to 10 minutes. The WhatsApp sandbox requires recipients to opt in** ([Twilio help](https://support.twilio.com/hc/en-us/articles/360036052753-Twilio-Free-Trial-Limitations), [sandbox](https://www.twilio.com/docs/whatsapp/sandbox)). That is fine for a demo using team phones.
- **Regulation and safeguarding:**
  - PECR reg. 19 bans automated *marketing* calls without specific consent. A welfare call is not marketing, but collecting explicit opt-in (ideally from the older person, not only the family) avoids grey areas ([ICO](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/telephone-marketing/)).
  - Safeguarding: never present the service as an emergency service. Symptom keywords should prompt 999/111, not just a carer text. Log every escalation, and get consent for sharing health data, which is special-category under UK GDPR.
  - Medication heat-risk content should come from published lists ([Minneapolis list](https://www2.minneapolismn.gov/media/content-assets/www2-documents/residents/Medications-That-May-Increase-Effects-of-Extreme-Heat.pdf)) and must not change doses, which would raise MHRA "treatment" issues ([MHRA guidance](https://assets.publishing.service.gov.uk/media/64a7d22d7a4c230013bba33c/Medical_device_stand-alone_software_including_apps__including_IVDMDs_.pdf)).

---

## Cross-concept recommendation
**E1 has the most defensible novelty.** Its differentiator is a measurable mechanism (selective flip versus baseline) backed by a May 2026 paper and an open CC BY dataset. It is also the easiest to demo honestly in 5 days with no live-season or regulatory dependencies.

**H2 is viable only if reconciliation is the headline.**

**CL1 is the weakest on novelty.** A near-identical project won 1st place in 2025, and the UK alert season is closed during the build.

---

## Sources (primary, grouped)
**E1:**
- [arXiv 2605.12748](https://arxiv.org/abs/2605.12748) · [AlgoBo arXiv 2309.14534](https://arxiv.org/html/2309.14534v3) · [MatlabTutee CHI'25](https://dl.acm.org/doi/10.1145/3706598.3713644) · [Explique](https://doi.org/10.1145/3774398.3811623) · [AgentSchool](https://arxiv.org/html/2605.30144v1) · [Chrysalis](https://arxiv.org/abs/2510.05271) · [StudentSim](https://arxiv.org/abs/2609.01591) · [MalAlgoPy](https://arxiv.org/abs/2410.12294)
- [ALTER-Math](https://attheu.utah.edu/research/ai-paves-the-way-for-kids-to-learn-math-by-teaching-it/) · [Eedi Tutor](https://www.eedi.com/eedi-tutor) · [Eedi graph HF](https://huggingface.co/datasets/Eedi/Eedi-Misconceptions-Graph) · [Eedi Kaggle licence via eth-lre](https://github.com/eth-lre/llm-student-modeling-strategies) · [DfE GenAI expectations](https://www.gov.uk/government/publications/generative-ai-product-safety-expectations)
- Devpost: [MIMIR](https://devpost.com/software/mimir-the-inverted-ai-cognitive-apprentice) · [Tuva](https://devpost.com/software/tuva-multimodal-feynman-ai) · [Dasko](https://devpost.com/software/dasko) · [Tutor Trainer](https://devpost.com/software/the-tutor-trainer) · [Protégé](https://devpost.com/software/protege)

**H2:**
- [Loved One](https://lovedone.app/) · [KeptWell](https://keptwell.org/) · [ElderCare](https://lifestyle.middletownlifemagazine.com/story/697822/eldercare-website-offers-a-home-for-discharge-papers/) · [Neela](https://www.neelacares.com/for-caregivers) · [Jointly](https://play.google.com/store/apps/details?id=org.carersuk.jointlyapp&hl=en_GB) · [PKB](https://patientsknowbest.com/patients-and-carers/) · [NHS proxy](https://digital.nhs.uk/services/national-proxy-service)
- [Corti](https://www.corti.ai/agents/medication-reconciliation-agent) · [Virtual Pharmacist](https://virtualpharmacist.co.uk/solution/discharge-medication-reconciliation/) · [JMIR review](https://www.jmir.org/2026/1/e86760/PDF)
- [MHRA guidance](https://assets.publishing.service.gov.uk/media/64a7d22d7a4c230013bba33c/Medical_device_stand-alone_software_including_apps__including_IVDMDs_.pdf) · [DCB0129](https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0129-clinical-risk-management-its-application-in-the-manufacture-of-health-it-systems) · [dm+d](https://digital.nhs.uk/services/terminology-and-classifications/dm-d) · [Agentboxd](https://agentboxd.com/) · [Carers UK 34%](https://www.carersuk.org/media/stxp5zaf/cuk-nhs-10-year-plan-vision-report.pdf)
- Devpost: [DischargeIQ](https://devpost.com/software/dischargeiq) · [ClarityCare](https://devpost.com/software/claritycare-ai) · [CareGuide](https://devpost.com/software/careguide-oda6fq) · [Intake agent](https://devpost.com/software/intake-agent)

**CL1:**
- [Care-Cast](https://devpost.com/software/care-cast) / [repo](https://github.com/ahsantahseen/Storm-Logic) · [NYC hackathon gallery](https://health-in-climate-ai-hackathon.devpost.com/project-gallery) · [CuraVias](https://devpost.com/software/curavias) · [Horizon](https://devpost.com/software/horizon-3na50b)
- [CLOVA CareCall heat](https://en.sedaily.com/technology/2026/08/13/ai-care-services-catch-more-elderly-health-warnings-in) · [Kassel Heat Telephone](https://climate-adapt.eea.europa.eu/en/mission/external-content/pdfs/mission-story_heat-telephone_june24_final-1.pdf/@@download/file) · [HeatWatch](https://www.sydney.edu.au/news-opinion/news/2023/12/14/heatwatch-app-to-be-trialled-over-summer-as-temperatures-soar.html) · [Ethos](https://communities.springernature.com/posts/rethinking-heat-early-warning-systems-a-personalised-approach-for-older-adults) · [CheckWellCall](https://www.homecaremag.com/news/checkwellcall-launches-ai-wellness-platform-seniors)
- [UNU 41%](https://unu.edu/inweh/news/uk-heatwave-four-ten-adults-england-take-no-action-protect-themselves-response-heat) · [UKHSA guide](https://assets.publishing.service.gov.uk/media/6a048558ee62840dba48a207/WHA_User_Guide.pdf) · [UKHSA API](https://ukhsa-dashboard.data.gov.uk/access-our-data) · [Open-Meteo terms](https://open-meteo.com/en/terms) · [Met Office DataHub](https://datahub.metoffice.gov.uk/pricing/site-specific) · [Twilio GB pricing](https://www.twilio.com/en-us/voice/pricing/gb) · [Twilio trial limits](https://support.twilio.com/hc/en-us/articles/360036052753-Twilio-Free-Trial-Limitations) · [ICO PECR](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/telephone-marketing/)
