# 03 · Empathize: AI + Cybersecurity and AI + Healthcare pain points

*ForgeHacks 2026 · compiled 4 Oct 2026 · London team, global judges*

**How to read this.** Each citation looks like `[Org pub-year · data-year](URL)`. The labels in caps mean:

- **SECONDARY**: only a news article or search snippet was reachable.
- **VENDOR**: a commercial survey.
- **UNVERIFIED**: could not be confirmed.

I spot-checked the load-bearing numbers against the primary PDFs: IC3 2025, UK Finance 2026, PSR, the FTC 2026 spotlight and Kidney Care UK.

---

## TL;DR

- **Scale.** Reported fraud losses (2025):
  - US: **$15.9bn**, up about 25% ([FTC 2026](https://www.ftc.gov/system/files/ftc_gov/pdf/ftc-testimony-jec-hearing-on-the-rising-scam-economy.pdf)); FBI IC3 logged $20.9bn ([IC3 2026](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)).
  - UK: **£1.28bn**, including authorised push payment (APP) fraud of £576m, up 19% ([UK Finance 2026](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)). APP fraud is when victims are tricked into sending the money themselves.
- **AI fraud can now be counted.**
  - The FBI's first "AI-related" tag covers 22,364 complaints and **$893m** (IC3 2026).
  - AI spear-phishing got a **54% click rate**, the same as human experts ([Heiding 2024](https://arxiv.org/abs/2412.00586)).
  - People catch only **73%** of speech deepfakes ([PLOS ONE 2023](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0285333)). Detectors lose about 48% of their accuracy on real-world audio ([arXiv 2025](https://arxiv.org/abs/2503.02857)).
  - **Implication: build verification, not detection.**
- **Young adults lose money more often.**
  - 44% of reports from 20–29s involved a loss, vs 24% for 70–79s ([FTC 2025](https://www.ftc.gov/system/files/ftc_gov/pdf/csn-annual-data-book-2024.pdf)).
  - 40% of their loss reports started on social media ([FTC 2026](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2026/04/reported-losses-scams-social-media-eight-times-higher-2020)).
  - They are 3x more likely to lose money to rental scams.
- **Defences sit in the wrong place.**
  - 66% of UK APP scams start online, but working interventions (Banking Protocol, payment delays) live inside banks.
  - Victims who trust the payee "proceed… regardless of warnings" (UK Finance 2026).
- **After a scam, victims are left alone.**
  - Only 2–6.7% of victims report ([FTC 2025](https://www.ftc.gov/system/files/ftc_gov/pdf/P144400-OlderAdultsReportDec2025.pdf)). 56% feel shame, and 45% most need "where to go" advice ([Home Office 2025](https://www.gov.uk/government/publications/experiences-of-victims-of-fraud-and-cyber-crime/experiences-of-victims-of-fraud-and-cyber-crime)).
  - Yet 88% of in-scope APP losses are reimbursed *once claimed* ([PSR 2026](https://www.psr.org.uk/information-for-consumers/app-scams-reimbursement-dashboard/)).
- **Health: patients get information before anyone explains it.**
  - 43% of adults in England struggle with health text; 61% once numbers are involved ([BJGP 2015](https://eprints.ncl.ac.uk/245102)).
  - 39m NHS App users now see results and letters automatically. NHS England told trusts to stop serious diagnoses arriving that way (Mar 2026) ([Kidney Care UK](https://kidneycareuk.org/about-us/policy-updates/nhs-organisations-told-to-stop-unexpected-diagnoses-via-the-nhs-app/)).
- **The safe zone for health AI is narrow.**
  - Members of the public using LLMs did no better than controls ([Bean, Nat Med 2026](https://arxiv.org/abs/2504.18919)).
  - LLM discharge rewrites drew safety flags in 18% of physician reviews ([Zaretsky 2024](https://doi.org/10.1001/jamanetworkopen.2024.0357)).
  - So **explain and structure documents the patient already has**. Don't diagnose or triage.
- **Top opportunities.**
  - Cyber: an impersonation "isolation-breaker" (C1) and a post-scam recovery co-pilot (C2).
  - Health: an NHS App result and letter explainer (H1) and a carer's shared view of care (H2).

---

## 1. Cyber findings

### 1.1 Scale and fastest-growing types

| Metric | Figure | Source |
|---|---|---|
| US reported fraud losses | $15.9bn (2025) vs ~$12.5–12.8bn (2024); up ~430% since 2020 | [FTC 2026](https://www.ftc.gov/system/files/ftc_gov/pdf/ftc-testimony-jec-hearing-on-the-rising-scam-economy.pdf), [FTC press 2026](https://www.ftc.gov/news-events/news/press-releases/2026/06/ftc-data-show-people-reported-losing-3-point-5-billion-imposter-scams-2025) |
| US investment scams | $7.9bn, about half of all losses (2025) | FTC 2026 |
| US imposter scams | over 1m reports, $3.5bn (2025); business impersonators ~$1bn, government ~$920m | FTC press 2026 |
| IC3 totals | 1,008,597 complaints; $20.877bn; crypto $11.4bn; BEC $3.05bn; tech support $2.13bn; government impersonation $798m (nearly double 2024's $406m) | [IC3 2026 · 2025](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf) |
| UK total | £1,279.8m (+4%), a record 4.06m cases | [UK Finance 2026 · 2025](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf) |
| UK APP by type | Investment £221.5m (+40%); purchase £118.1m, 175,809 cases (71% of APP cases, average £671); advance fee £58.4m (+65%, driven by fake vehicle and **holiday-rental deposits**); romance £39.2m (+23%) | UK Finance 2026 |
| England and Wales prevalence | 4.5m incidents; 7.8% of adults (YE Mar 2026) | [ONS 2026](https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/bulletins/crimeinenglandandwales/yearendingmarch2026) |

**Fastest growers:**
- Investment fraud (UK +40%).
- Advance fee (UK +65%).
- Government impersonation (IC3, nearly 2x).
- Task scams: about 20k US reports in the first half of 2024 vs about 5k in all of 2023 ([FTC 2024](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2024/12/paying-get-paid-gamified-job-scams-drive-record-losses)).
- Scams starting on social media: **$2.1bn**, 8x the 2020 level ([FTC 2026](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2026/04/reported-losses-scams-social-media-eight-times-higher-2020)).

### 1.2 Who loses, and through which channel

**Contact method, US 2024** ([FTC Data Book](https://www.ftc.gov/system/files/ftc_gov/pdf/csn-annual-data-book-2024.pdf)):

| Channel | Total lost | Median loss | Note |
|---|---|---|---|
| Social media | **$1.86bn** | $409 | Highest total; 70% of reports involved a loss |
| Phone | $948m | **$1,500** | Highest median |
| Email | $502m | $600 | 11% of reports involved a loss |

- Text was the most-reported contact method in 2025 ([FTC 2026](https://www.ftc.gov/system/files/ftc_gov/pdf/ftc-testimony-jec-hearing-on-the-rising-scam-economy.pdf)).
- The top text scams of 2024 were fake delivery, fake jobs, fake fraud alerts, **toll notices** and "wrong number" openers ([FTC 2025](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/04/top-text-scams-2024)).
- In the UK, **66% of APP cases start online** (32% of losses); 17% start on telecoms but account for 28% of losses ([UK Finance 2026](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)).
- Meta platforms were involved in 54% of UK APP incidents ([PSR 2024 · 2023](https://www.psr.org.uk/information-for-consumers/unmasking-how-fraudsters-target-uk-consumers-in-the-digital-age/)).

**By age:**
- **Young adults lose often but small.** 20–29s: 44% of reports involved a loss, median $417. 70–79s: 24% involved a loss, median $1,000 ([FTC 2025 · 2024](https://www.ftc.gov/system/files/ftc_gov/pdf/csn-annual-data-book-2024.pdf)).
- **Older adults lose big.**
  - IC3: people 60+ lost **$7.75bn** in 2025 (+59%) ([IC3 2026](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)).
  - FTC: losses over $100k were 5% of older adults' loss reports but **68% of their losses** ([FTC 2025](https://www.ftc.gov/system/files/ftc_gov/pdf/P144400-OlderAdultsReportDec2025.pdf)).
  - Reports of $10k+ losses to impersonators rose more than 4x, 2020→2024; the first contact was a phone call in 41% of cases ([FTC 2025](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/08/false-alarm-real-scam-how-scammers-are-stealing-older-adults-life-savings)).
- **Students and renters.**
  - US: 18–29s filed 46% of rental-scam loss reports; ~50% involved Facebook ([FTC 2025](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/12/rental-scams-hit-home-65-million-reported-losses)).
  - UK: Action Fraud says rental fraud cost £4.2m in 2023 at **£1,720 per victim**, is a top-5 fraud for 11–29s, and peaks in September (**SECONDARY**, via [council repost 2024](https://www.highleyparish.gov.uk/news/2024/09/10)).
  - Fraud education is coming to university campuses from 2026 ([Home Office 2026](https://www.gov.uk/government/publications/fraud-strategy-2026-to-2029/fraud-strategy-2026-to-2029-disrupting-crime-supporting-economic-resilience-and-delivering-justice-accessible)).
- **International students and migrants.**
  - The UK has **685,565** non-UK students ([HESA 2026 · 2024/25](https://www.hesa.ac.uk/news/27-01-2026/sb273-higher-education-student-statistics)).
  - The FBI warns of scammers posing as immigration, university or home-government officials who threaten deportation ([FBI PSA May 2025](https://www.ic3.gov/PSA/2025/PSA250513)).
  - It also warns of fake **Chinese police** scams that demand "bail" and impose 24-hour video surveillance ([FBI PSA Nov 2025](https://www.ic3.gov/PSA/2025/PSA251113)).
  - UK case: one victim lost £29k after signing "confidentiality agreements" and being told "your life will be in danger" if she told anyone ([Trading Standards South West 2024](https://www.tssw.org.uk/student-scams-toolkit/scammed-by-the-fake-chinese-police/)).
  - Imperial and UCL have issued similar warnings (**SECONDARY**, [Felix 2025](https://felixonline.co.uk/articles/new-fraud-tactic-targets-chinese-students-in-the-uk/)). There are no UK loss totals for this scam (**UNVERIFIED**).
- **Small businesses.**
  - BEC: $3.05bn ([IC3 2026](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)).
  - UK CEO fraud averages more than £28k per case ([UK Finance 2026](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)).

### 1.3 AI-enabled fraud, quantified

- **Voice cloning.**
  - 28% of UK adults say they were targeted in the past year; 46% didn't know these scams exist; 8% would send money even if the call seemed odd (survey of 3,010) ([Starling 2024](https://www.starlingbank.com/news/starling-bank-launches-safe-phrases-campaign/)).
  - IC3 2025: AI "distress" (grandparent-type) scams cost over $5m in reported losses, and the FBI notes victims often don't realise AI was involved ([IC3 2026](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)).
- **Deepfake video calls.** At Arup, a Hong Kong employee paid HK$200m (~US$25.6m) in 15 transfers after a video call with deepfaked colleagues, including the CFO (**SECONDARY**, [CNN 2024](https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk)).
- **AI phishing.** Fully automated AI spear-phishing reached a 54% click rate, the same as human experts ([Heiding et al. 2024](https://arxiv.org/abs/2412.00586)). Europol says LLMs are "improving the efficacy of social engineering" ([IOCTA 2025](https://www.europol.europa.eu/cms/sites/default/files/documents/Steal-deal-repeat-IOCTA_2025.pdf)).
- **FBI public service announcements (PSAs).**
  - Generative-AI fraud, advising a family "secret word or phrase" ([I-120324, Dec 2024](https://www.ic3.gov/PSA/2024/PSA241203)).
  - AI voice messages impersonating senior US officials ([May 2025](https://www.ic3.gov/PSA/2025/PSA250515)).
  - Altered "proof-of-life" media in virtual kidnapping ([Dec 2025](https://www.ic3.gov/PSA/2025/PSA251205)).
  - Toll smishing: 2,000+ complaints in its first weeks ([Apr 2024](https://www.ic3.gov/PSA/2024/PSA240412)).
- **AI and job scams.** Gamified "task" scams typically start with an unexpected text or WhatsApp message ([FTC 2024](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2024/12/paying-get-paid-gamified-job-scams-drive-record-losses)). IC3 employment-fraud losses were $363m in 2025.
- **Sextortion.**
  - IC3 received over 75,000 submissions in 2025; 20–29s were the largest group (22,061) ([IC3 2026](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)).
  - NCMEC averages **137 financial-sextortion reports a day** (2025) ([NCMEC](https://www.missingkids.org/gethelpnow/cybertipline/cybertiplinedata)).
  - In the UK, 91% of 2023 victims were male, mostly boys aged 14–18 ([NCA 2024](https://www.nationalcrimeagency.gov.uk/news/nca-issues-urgent-warning-about-sextortion)).
- **Humans can't reliably detect fakes.**
  - Listeners identified speech deepfakes 73% of the time, and training barely helped ([UCL/PLOS ONE 2023](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0285333)).
  - 0.1% of 2,000 people identified all real and fake stimuli correctly (**VENDOR**, [iProov 2025](https://www.businesswire.com/news/home/20250211131029/en/iProov-Study-Reveals-Deepfake-Blindspot-Only-0.1-of-People-Can-Accurately-Detect-AI-Generated-Deepfakes)).
  - Open-source detectors drop 45–50% in AUC on real-world 2024 fakes ([arXiv 2025](https://arxiv.org/abs/2503.02857)).
- **Forecast.** Generative AI could take US fraud losses to $40bn by 2027 ([Deloitte 2024](https://www.deloitte.com/us/en/insights/industry/financial-services/deepfake-banking-fraud-risk-on-the-rise.html)).

### 1.4 The moment of failure: why victims comply

- **The mechanics are well known.** Classic scam principles include authority, time pressure, distraction, and need and greed ([Stajano & Wilson, Cambridge 2009](https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-754.pdf)).
  - The FTC finds that threats of legal action push older victims to act "before they could reach out to consult with family" ([FTC 2025](https://www.ftc.gov/system/files/ftc_gov/pdf/P144400-OlderAdultsReportDec2025.pdf)).
  - Chinese-police scams enforce secrecy with "confidentiality agreements" and surveillance apps ([TSSW 2024](https://www.tssw.org.uk/student-scams-toolkit/scammed-by-the-fake-chinese-police/)).
- **Victims often don't know it is a scam.** When the FBI notified crypto-investment victims, **78% didn't know** they were being scammed, and 38 were referred for suicide intervention ([IC3 2026 · Operation Level Up](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)).
- **Warnings stop working once trust is built.** UK Finance says victims in investment scams "are likely to proceed with a payment regardless of warnings" ([2026](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)).
  - Only 30% know what to look for in a voice-clone scam ([Starling 2024](https://www.starlingbank.com/news/starling-bank-launches-safe-phrases-campaign/)).
  - Of those who saw a scam and did nothing, 29% thought reporting wouldn't help and 29% didn't know who to tell ([Ofcom 2023 · 2022](https://www.ofcom.org.uk/online-safety/online-fraud/scale-and-impact-of-online-fraud-revealed)).
- **What measurably works.**

| Intervention | Evidence |
|---|---|
| **Banking Protocol** (branch staff call police) | £58.8m prevented and 136 arrests in 2025; **£433m** prevented and 1,662 arrests since launch ([UK Finance 2026](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)) |
| In-payment warnings and Take Five | Police/bank impersonation fell to record lows: −18% value, −23% cases. Correlation only. (UK Finance 2026) |
| Rapid fund freezing | US "Kill Chain": $679m frozen of $1.16bn attempted, 58% ([IC3 2026](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)) |
| Payment delay | UK banks may hold a suspicious payment up to 4 business days ([SI 2024/1013](https://www.legislation.gov.uk/uksi/2024/1013/made)) |
| Reimbursement | 88% (£316m) of in-scope APP losses reimbursed; 82% of claims closed within 5 days ([PSR 2026 · to Mar 2026](https://www.psr.org.uk/information-for-consumers/app-scams-reimbursement-dashboard/)) |
| Bank call verification | Monzo "call status" shows in-app whether Monzo is really calling you ([Monzo 2023](https://monzo.com/blog/2023/09/06/making-it-clear-when-were-on-a-call-with-you)) |
| Trusted contacts | US FINRA Rule 4512 (trusted contact) and Rule 2165 (temporary holds) ([FINRA](https://www.finra.org/rules-guidance/rulebooks/finra-rules/4512)). No outcome data found. |
| Confirmation of Payee | Over 2m checks a day ([Pay.UK](https://www.wearepay.uk/what-we-do/overlay-services/confirmation-of-payee/)). Measured effect **UNVERIFIED**. |

- **The pattern.** Interventions that work involve **a human outside the scam** (branch staff, police, a bank agent) or **a delay**. All of them live inside the bank. None reaches the victim during the days of grooming on WhatsApp, Telegram, video calls or social media, which is where 66% of cases start.

### 1.5 Under-reporting and aftermath

- **Few victims report.** US estimates are 4.8% overall, and 2.0% (under $1k) to 6.7% (over $1k) of victims. Adjusted for this, true 2024 US losses could be **$195.9bn** ([FTC 2025](https://www.ftc.gov/system/files/ftc_gov/pdf/P144400-OlderAdultsReportDec2025.pdf)). The UK "1 in 7 reported" figure is **UNVERIFIED**.
- **It hurts.**
  - 71% of England and Wales fraud victims report an emotional impact ([ONS 2026 · YE Mar 2025](https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/articles/natureoffraudandcomputermisuseinenglandandwales/yearendingmarch2025)).
  - Among people who reported to Action Fraud: 86% anger, 63% anxiety, **56% shame or self-blame**, 3% suicidal thoughts. Satisfaction was 61% overall but **47% for online reporting**. Only 24% were later contacted by police. Their top need was immediate "where to go" advice (45%) ([Home Office 2025 · 2017–18](https://www.gov.uk/government/publications/experiences-of-victims-of-fraud-and-cyber-crime/experiences-of-victims-of-fraud-and-cyber-crime)).
- **The reporting system is changing.** Action Fraud was replaced by **Report Fraud** on 4 Dec 2025 ([ONS 2026](https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/bulletins/crimeinenglandandwales/yearendingmarch2026)).
  - Victims now navigate several separate channels: their bank (claim within 13 months, £85k cap), the 159 hotline (1m+ calls; [Stop Scams UK](https://stopscamsuk.org.uk/159)), Report Fraud, 7726 for texts, and the NCSC email reporting service (58m reports; [NCSC](https://www.ncsc.gov.uk/information/report-suspicious-emails)).
  - Each platform also has its own reporting flow.
- **Victims get hit twice.** Fake "recovery" law firms target scam victims, use detailed knowledge of their earlier transfers, and demand crypto or gift cards ([FBI PSA Aug 2025](https://www.ic3.gov/PSA/2025/PSA250813)).

### 1.6 Existing tools and what they miss

| Tool | Covers | Clear gaps |
|---|---|---|
| Google Scam Detection (Messages and Phone) | On-device Gemini flags conversational scams, now including job and romance-bait patterns ([Google 2026](https://blog.google/security/staying-one-step-ahead-strengthening-androids-lead-in-scam-protection/)) | Calls: Pixel and select Galaxy only, **off by default**, **"never used in calls with your contacts"**. Messages: only in Google Messages, 6 languages. Doesn't cover WhatsApp, Telegram or iPhone ([Google 2025](https://blog.google/security/new-ai-powered-scam-detection-features/)) |
| Norton Genie (app, and in ChatGPT since Mar 2026) | Paste or screenshot a message or link for a verdict ([Gen 2026](https://newsroom.gendigital.com/2026-03-04-The-Worlds-First-AI-Powered-Scam-Detector,-Norton-Genie,-Now-in-ChatGPT)) | Single message only. The user must already be suspicious. English-first (the page lists only EN/CZ). Nothing after a loss |
| Bitdefender Scamio | Chatbot on web, WhatsApp, Messenger and Discord; checks texts, links, QR codes and screenshots ([Bitdefender](https://www.bitdefender.com/en-us/consumer/scamio)) | Same "already suspicious" assumption. Generic advice |
| Truecaller AI Call Scanner | Detects AI voices by merging the call with Truecaller's line (**SECONDARY**, [MediaNama 2024](https://www.medianama.com/2024/05/223-truecaller-ai-voice-scanner-spam-call/)) | Premium, Android, US-first. Detection-based, and detectors degrade on real-world audio |
| iOS 26 Call Screening | Asks unknown callers why they're calling (**SECONDARY**, [PIRG](https://pirg.org/edfund/articles/call-screening-in-iphone-ios26-nice-effort-to-combat-robocalls-but/)) | No content analysis. Spoofed or known numbers pass through |
| O2 "Daisy" | AI granny that wastes scammers' time, up to 40 minutes a call ([VMO2 2024](https://news.virginmediao2.co.uk/o2-unveils-daisy-the-ai-granny-wasting-scammers-time/)) | Publicity and disruption only; doesn't protect a specific victim |
| Bank tools (Starling Scam Intelligence, Revolut, Monzo) | Starling: upload a marketplace listing; cancellations of suspicious marketplace payments **up 300%** in testing (**SECONDARY**, [The Paypers 2026](https://thepaypers.com/fraud-and-fincrime/news/starling-bank-adds-ai-agent-to-detect-romance-and-investment-fraud)). Revolut: card-scam AI with **−30%** investment-scam losses (**SECONDARY**, [Tech.eu 2024](https://tech.eu/2024/02/15/revolut-launches-ai-scam-features-to-break-scammers-spell/)) | Only that bank's customers, and only when paying. Blind to crypto, cash, gift cards and the grooming phase |
| Which? Scam Alerts | Weekly emails; over 500k subscribers (search snippet; [Which?](https://www.which.co.uk/news/article/the-latest-scam-alerts-from-which-aBRLy2b02WkC)) | Broadcast, not personal; English only |

**White space (my inference from the table above):**
- Help across **multi-day, multi-channel coached scams** (the "you're under investigation, tell no one" pattern).
- Support in the **victim's own language**.
- **Breaking isolation** by bringing in a trusted human.
- **Verifying people rather than detecting fakes.**
- **Post-loss recovery**: routing to the right channels, building an evidence pack, and shielding against recovery scams.

---

## 2. Health findings

### 2.1 Health literacy

- **UK.**
  - 43% of working-age adults can't understand health text; **61%** once numeracy is needed ([Rowlands, BJGP 2015](https://eprints.ncl.ac.uk/245102)).
  - 18% of adults in England have low literacy and 21% low numeracy ([DfE PIAAC 2024 · 2023](https://assets.publishing.service.gov.uk/media/675330e020bcf083762a6d48/Survey_of_Adult_Skills_2023__PIAAC__National_Report_for_England.pdf)).
  - The NHS toolkit recommends about grade 6 text. It notes that at Entry Level 1 numeracy, people are "unable to read medicine doses and schedules" ([NHS Health Literacy Toolkit 2023](https://library.nhs.uk/wp-content/uploads/sites/4/2023/06/Health-Literacy-Toolkit.pdf)).
- **US.**
  - Only 12% of adults have proficient health literacy; 36% are basic or below ([NAAL, NCES 2006 · 2003](https://nces.ed.gov/pubs2006/2006483.pdf)).
  - Low health literacy costs $106–238bn a year ([Vernon 2007](https://hsrc.himmelfarb.gwu.edu/cgi/viewcontent.cgi?article=1173&context=sphhs_policy_facpubs)).
  - It is linked to more hospitalisations and emergency visits, poorer medication use and higher mortality in older people ([Berkman, Ann Intern Med 2011](https://www.acpjournals.org/doi/10.7326/0003-4819-155-2-201107190-00005)).

### 2.2 High-friction moments

| Moment | Evidence | Stake |
|---|---|---|
| **Results and letters in the NHS App** | 39.1m registered users; 36.5m messages a month, only 42% read within 24 hours ([NHS England Digital 2026 · Aug 2026](https://digital.nhs.uk/data-and-information/publications/statistical/nhs-app-statistics/august-2026)). Automatic access to new GP record entries since 31 Oct 2023 ([Healthwatch 2025](https://www.healthwatch.co.uk/advice-and-information/2025-10-03/can-i-access-my-gp-records-online)). 11% of CKD patients learned their diagnosis via the App; NHS England letter of 26 Mar 2026 ([Kidney Care UK 2025/26](https://kidneycareuk.org/about-us/policy-updates/nhs-organisations-told-to-stop-unexpected-diagnoses-via-the-nhs-app/)). US: 96% want immediate results, but worry rose to **16.5% with abnormal results** vs 5% with normal (Steitz, JAMA Netw Open 2023, DOI 10.1001/jamanetworkopen.2023.3572) | Anxiety, unanswered questions, more calls to the GP; no support out of hours |
| **Hospital discharge** | Patients 65+: 59.6% could describe their diagnosis; **43.9% recalled their follow-up appointment** ([Horwitz, JAMA IM 2013](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1754366)). After A&E: 78% had incomplete understanding, and only 20% of them realised it (Engel, Ann Emerg Med 2009). UK: 51% got no contact information; 32% felt unprepared (44% of carers) ([Healthwatch 2023](https://www.healthwatch.co.uk/blog/2023-11-20/nhs-urged-do-more-help-patients-leave-hospital-safely)) | 30-day emergency readmissions **14.7% (948,836)** in 2024/25 ([NHS England Digital 2025](https://digital.nhs.uk/data-and-information/publications/statistical/compendium-emergency-readmissions/current/emergency-readmissions-to-hospital-within-30-days-of-discharge)) |
| **Medicines and polypharmacy** | 15% of people in England take 5+ medicines a day, 7% take 8+; ≥10% of prescription items unnecessary ([DHSC Overprescribing Review 2021](https://assets.publishing.service.gov.uk/media/614a10fed3bf7f05ab786551/good-for-you-good-for-us-good-for-everybody.pdf)). 237m medication errors a year, 1,708 deaths (Elliott, BMJ Qual Saf 2021). Adherence averages about 50% ([WHO 2003](https://www.paho.org/sites/default/files/WHO-Adherence-Long-Term-Therapies-Eng-2003.pdf)) | 6.5% of admissions are caused by adverse drug effects, **up to 20% in over-65s**; two-thirds preventable (DHSC 2021) |
| **Consent** | Of 5,239 consent forms, 91% were above US grade 8 (mean 10.99) ([Zai 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11428065/)). The *Montgomery* ruling requires information to be "comprehensible", not just a signature ([UKSC 2015](https://supremecourt.uk/uploads/uksc_2013_0136_judgment_fd5635b4cd.pdf)) | Legal and ethical exposure; uninformed choices |
| **Limited English** | **1.04m** people in England and Wales can't speak English well or at all ([ONS Census 2021](https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/language/bulletins/languageenglandandwales/census2021)). NHS spends ~£75.5m on interpreting vs **£250–300m** estimated need; in 73% of maternity cases involving migrant women, interpreting wasn't documented ([NHS England 2025](https://www.england.nhs.uk/long-read/improvement-framework-community-language-translation-and-interpreting-services/)) | Patients with limited English: 49.1% of adverse events caused physical harm vs 29.5% for English speakers (Divi, IJQHC 2007) |
| **Unpaid carers** | 5.0m carers in England and Wales ([ONS 2023](https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandwellbeing/bulletins/unpaidcareenglandandwales/census2021)). **34% spend 10+ hours a month on NHS admin**; only 14% were asked about their caring role at discharge ([Carers UK 2025](https://www.carersuk.org/media/stxp5zaf/cuk-nhs-10-year-plan-vision-report.pdf)) | 44% of cared-for people had an unplanned hospital visit in the past year |
| **GP appointment** | UK average consultation **9.22 minutes** ([Irving, BMJ Open 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5695512/)); the BMA wants 15 ([BMA 2026](https://www.bma.org.uk/media/agfcxgkj/bma-safe-working-in-general-practice-a-summary.pdf)). Contacting the practice is easy for only 56.9% by phone and 54.3% by the App ([GP Patient Survey 2026](https://www.ipsos.com/en-uk/2026-gp-patient-survey-results-released)) | Multiple concerns squeezed into one slot |
| **NHS 111** | 1.65m calls in July 2026; answered within 60 seconds fell to 75.6% (from 86.3%); 14.5% advised self-care ([NHS England 2026](https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Statistical-Note-IUCADC-Jul-2026-f414g.pdf)) | Usage of 111 online **UNVERIFIED** |
| **Pharmacy** | Pharmacy First covers 7 conditions (since Jan 2024) ([NHS England](https://www.england.nhs.uk/primary-care/pharmacy/pharmacy-services/pharmacy-first/)). Prescription tracking in the App is live at only 31% of pharmacies (NHS App MI, Aug 2026) | Public awareness of Pharmacy First **UNVERIFIED** |

### 2.3 Accessibility

- **The Accessible Information Standard isn't being met.** It has been mandatory since 2016 and was revised in Jun 2025; organisations must publish compliance by Mar 2027 ([NHS England](https://www.england.nhs.uk/long-read/accessible-information-standard/)). Yet **two-thirds** of people with sensory or communication needs were never asked how they want information ([Healthwatch 2025](https://www.healthwatch.co.uk/response/2025-07-10/our-response-gp-patient-survey-2025)).
- **Deaf patients.** 8 in 10 want BSL in consultations; 3 in 10 get it ([SignHealth 2014](https://signhealth.org.uk/resources/report-sick-of-it/), dated).
- **People with learning disabilities.** Median age at death is 62.8 vs 81.8; treatable mortality is 25.0% vs 7.6% ([LeDeR 2026 · 2024](https://www.kcl.ac.uk/ioppn/leder/leder2024/leder-2024-report.pdf)).
- **Blind and partially sighted people.** RNIB figures on letters people can't read are **UNVERIFIED**.

### 2.4 Safety and regulatory guardrails (what's safe to build)

- **MHRA.**
  - Whether software is a medical device depends on its intended purpose. It is likely a device if it "results in a diagnosis or prognosis" or influences treatment ([MHRA guidance](https://www.gov.uk/government/publications/medical-devices-software-applications-apps)).
  - Purely administrative tools (booking, repeat prescriptions) are unlikely to be devices.
  - Disclaimers **do not** override medical claims.
  - General-purpose LLMs become devices only if marketed or built for a medical purpose ([MHRA blog 2023](https://medregs.blog.gov.uk/2023/03/03/large-language-models-and-software-as-a-medical-device/)).
- **NICE Evidence Standards Framework.**
  - Tier B ("understanding and communicating") has lower evidence requirements than Tier C (diagnosis, treatment, guiding care) ([NICE ESF](https://www.nice.org.uk/corporate/ecd7/chapter/section-b-classification-of-digital-health-technologies); page blocked to fetch, tiers confirmed from NICE's indexed text).
  - NHS deployment needs DTAC v2.0 and DCB0129 clinical-safety documentation ([NHS England Digital](https://digital.nhs.uk/services/digital-technology-assessment-criteria-dtac)).
- **Evidence on LLMs with the public.**
  - LLMs alone identified conditions 94.9% of the time; members of the public using them managed **under 34.5%**, no better than controls ([Bean et al., Nature Medicine 2026](https://arxiv.org/abs/2504.18919)).
  - LLM discharge rewrites raised understandability from 13% to 81%, but 18% of reviews flagged omissions or hallucinations ([Zaretsky 2024](https://doi.org/10.1001/jamanetworkopen.2024.0357)).
  - UK clinic letters rewritten by GPT-4 showed no hallucinations and better comprehension in a small study ([Cork & Hopcroft, BJGP Open 2025](https://bjgpopen.org/content/early/2025/07/15/BJGPO.2024.0300)).
- **Machine translation fails for less widely used languages.**
  - Clinically impactful errors vs professional translation: Chinese **52% vs 20%**, Vietnamese 41% vs 14%, Somali **92% vs 13%**. Spanish was roughly equal ([Martos et al., JAMA Netw Open 2025](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2839035)).
  - NHS England warns that translation apps carry patient-safety risk ([2025](https://www.england.nhs.uk/long-read/improvement-framework-community-language-translation-and-interpreting-services/)).
- **The safe hackathon zone.**
  - Do build: tools that explain or restructure text the patient already has, grounded in that source and linked back to it; prepare questions; route people to humans and official services; handle admin and coordination.
  - Avoid: symptom triage, diagnosis, dose advice, and unreviewed translation of clinical instructions.

### 2.5 Existing tools and gaps

- **NHS App.** Large reach, but it doesn't explain what it shows.
  - Planned features include "My NHS GP" (AI navigation), My Medicines, **My Carer**, and **My Companion** (explains conditions, supports translation), most of them **by 2028** ([10 Year Health Plan 2025](https://assets.publishing.service.gov.uk/media/6888a0b1a11f859994409147/fit-for-the-future-10-year-health-plan-for-england.pdf)).
  - That leaves a gap of two to three years.
- **ChatGPT Health** (Jan 2026). 230m people a week ask ChatGPT health questions; the product is not for diagnosis and is **not available in the UK** ([OpenAI 2026](https://openai.com/index/introducing-chatgpt-health/)). In the US, 56% of chatbot users are not confident in its accuracy ([KFF 2024](https://www.kff.org/health-information-trust/poll-finding/kff-health-misinformation-tracking-poll-artificial-intelligence-and-health-information/)).
- **Ada Health.** A symptom checker with medical-device certification ([Ada](https://about.ada.com/about)); this is diagnosis-adjacent.
- **Babylon.** Collapsed in 2023 (**SECONDARY**, [Wikipedia](https://en.wikipedia.org/wiki/Babylon_Health)).
- **AI scribes.** Clinician-side, governed by NHS England guidance ([2025/26](https://www.england.nhs.uk/long-read/guidance-on-the-use-of-ai-enabled-ambient-scribing-products-in-health-and-care-settings/)).
- **Gaps.**
  - Nothing patient-side explains *my* letter or result, grounded in the source document.
  - No carer-side single view of the cared-for person.
  - No accessible-format conversion for the Accessible Information Standard.

---

## 3. Personas (composite, evidence-based)

**Cyber**
- **Wei, 23, Chinese MSc student in London.**
  - Gets a call "from UKVI", is passed to "Shanghai police" on video, and is told to keep it secret and stay on camera.
  - Needs a private, Mandarin second opinion and a way to involve someone without "breaking the agreement".
  - Evidence: [FBI 2025](https://www.ic3.gov/PSA/2025/PSA251113), [TSSW 2024](https://www.tssw.org.uk/student-scams-toolkit/scammed-by-the-fake-chinese-police/).
- **Amara, 19, Nigerian first-year searching for a London room.**
  - Pays a £1,200 deposit to a Facebook "landlord" who can't do viewings.
  - Needs to vet the listing before paying.
  - Evidence: [FTC 2025](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/12/rental-scams-hit-home-65-million-reported-losses), UK average £1,720 (SECONDARY).
- **Margaret, 74, retired teacher in Croydon.**
  - Her "grandson" calls crying from a police station and needs bail now.
  - Needs to verify him in seconds without relying on her ears.
  - Evidence: [Starling 2024](https://www.starlingbank.com/news/starling-bank-launches-safe-phrases-campaign/), [FTC 2025](https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/08/false-alarm-real-scam-how-scammers-are-stealing-older-adults-life-savings).
- **Tunde, 27, delivery rider.** Lost £2,300 in a WhatsApp "task" job scam and feels stupid. He doesn't know whether his bank, the police or the platform comes first, and is now being contacted by a "recovery lawyer".

**Health**
- **Grace, 58, dinner lady in Lewisham.**
  - On a Friday night the NHS App shows "eGFR 52, CKD G3a" with no explanation, and the GP is closed until Monday.
  - Evidence: [Kidney Care UK](https://kidneycareuk.org/about-us/policy-updates/nhs-organisations-told-to-stop-unexpected-diagnoses-via-the-nhs-app/).
- **Efua, 45, full-time nurse manager, caring for her father Kwame, 81.**
  - Kwame takes 9 medicines across 3 prescribers. He was discharged after heart failure with a changed diuretic dose that no one explained to her.
  - Evidence: [Carers UK 2025](https://www.carersuk.org/media/stxp5zaf/cuk-nhs-10-year-plan-vision-report.pdf), [DHSC 2021](https://assets.publishing.service.gov.uk/media/614a10fed3bf7f05ab786551/good-for-you-good-for-us-good-for-everybody.pdf).
- **Fatima, 41, Somali speaker in Tower Hamlets.**
  - Her 10-year-old interprets at GP visits. She doesn't know she has a right to a free interpreter.
  - Evidence: [NHS England 2018](https://www.england.nhs.uk/wp-content/uploads/2018/09/guidance-for-commissioners-interpreting-and-translation-services-in-primary-care.pdf), [Healthwatch 2022](https://www.healthwatch.co.uk/blog/2022-03-22/lost-words-improving-access-healthcare-ethnic-minority-communities).
- **Tom, 66, registered blind after glaucoma.** Still receives printed appointment letters and consent forms ([Healthwatch 2025](https://www.healthwatch.co.uk/response/2025-07-10/our-response-gp-patient-survey-2025)).

---

## 4. Ranked "How Might We" statements

Scores are 1–5 for **S**everity, **U**nder-served-ness and **F**easibility of a convincing 6-day AI prototype. Score = S×U×F. Ties are broken by fit to the track wording.

### AI + Cybersecurity

| # | How Might We… | Persona · pain point · stake | S | U | F | Score |
|---|---|---|---|---|---|---|
| C1 | …help someone in the middle of an impersonation scam ("police / UKVI / bank, tell no one") get a private second opinion in their own language, and safely bring in one trusted person, *before* they pay? | **Wei.** Isolation and secrecy are the mechanism ([TSSW](https://www.tssw.org.uk/student-scams-toolkit/scammed-by-the-fake-chinese-police/), [FTC](https://www.ftc.gov/system/files/ftc_gov/pdf/P144400-OlderAdultsReportDec2025.pdf)). IC3 government impersonation **$798m** (nearly double 2024); UK impersonation APP **£92.4m**; 685k international students. Existing checkers are English-first and single-message | 5 | 5 | 4 | **100** |
| C2 | …turn the first hour after a scam from shame and confusion into a complete, correctly ordered recovery: bank recall, Report Fraud, 159 or 7726, platform reports, an evidence pack, and a shield against recovery scams? | **Tunde.** Only 2–6.7% report; 56% feel shame; 45% need "where to go" advice; 47% satisfaction with online reporting; 88% reimbursed *if claimed*; 58% of funds frozen when reported quickly; fake recovery lawyers ([Home Office](https://www.gov.uk/government/publications/experiences-of-victims-of-fraud-and-cyber-crime/experiences-of-victims-of-fraud-and-cyber-crime), [PSR](https://www.psr.org.uk/information-for-consumers/app-scams-reimbursement-dashboard/), [FBI](https://www.ic3.gov/PSA/2025/PSA250813)) | 4 | 5 | 5 | **100** |
| C3 | …let a family confirm "is this really you?" in seconds when a loved one calls in distress, without relying on human ears or unreliable deepfake detectors? | **Margaret.** 28% targeted, 46% unaware; listeners catch only 73%; detectors lose ~48% AUC; Google call detection is never used with contacts; $10k+ older-adult impersonation reports up 4x ([Starling](https://www.starlingbank.com/news/starling-bank-launches-safe-phrases-campaign/), [arXiv](https://arxiv.org/abs/2503.02857)) | 4 | 4 | 5 | **80** |
| C4 | …help a student vet a rental listing, "landlord" and deposit request before paying? | **Amara.** 18–29s 3x more likely to lose; UK average £1,720 (SECONDARY); advance-fee fraud +65%, driven by rental deposits; Starling's listing checker raised cancellations 300% but only for Starling customers | 4 | 4 | 5 | **80** |
| C5 | …help job-seekers spot a recruiter or "task" scam that unfolds over days on WhatsApp or Telegram? | Task scams up 4x+ in 2024; employment losses $363m ([IC3](https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf)); Google's job-scam detection doesn't reach WhatsApp; 12,438 UK money mules disrupted | 4 | 3 | 4 | 48 |
| C6 | …help a micro-business finance person verify a "CEO" payment request that arrives by voice, video or email? | BEC $3.05bn; UK CEO fraud averages over £28k; Arup $25.6m; AI phishing 54% click rate. Enterprise tools exist, but small firms lack them | 4 | 3 | 4 | 48 |
| C7 | …support a teen in the first minutes of a sextortion threat? | IC3 75k+ submissions; NCMEC 137 a day. **Safeguarding and minors'-data risk makes a 6-day build ethically fraught.** Meta's nudity blur and NCMEC Take It Down already exist | 5 | 3 | 2 | 30 |

### AI + Healthcare

| # | How Might We… | Persona · pain point · stake | S | U | F | Score |
|---|---|---|---|---|---|---|
| H1 | …help someone who has just seen a result or letter in the NHS App understand what it says (and doesn't say), what's urgent, and who to ask, while explaining only the source and never diagnosing? | **Grace.** 39m App users; 11% of CKD patients learned via the App; NHS England letter of Mar 2026; worry 16.5% with abnormal results; GPT-4 letter rewrites improved comprehension ([Cork 2025](https://bjgpopen.org/content/early/2025/07/15/BJGPO.2024.0300)). NICE Tier B | 4 | 4 | 5 | **80** |
| H2 | …give an unpaid carer one shared, current picture of a parent's medicines, appointments and letters across GP, hospital and pharmacy? | **Efua.** 5.0m carers; 34% spend 10+ hours a month on NHS admin; 14% consulted at discharge; 7% of people take 8+ medicines; adverse drug effects cause up to 20% of over-65 admissions; NHS "My Carer" not due until 2028 | 4 | 5 | 4 | **80** |
| H3 | …turn consent forms, leaflets and letters into the format each person needs (easy-read, audio, large print, BSL-ready summary), meeting the Accessible Information Standard? | **Tom.** Two-thirds of people with sensory needs were never asked; compliance reporting due Mar 2027; consent forms average US grade 10.99; *Montgomery* "comprehensible" duty | 4 | 4 | 4 | 64 |
| H4 | …make discharge instructions stick, so patients and carers can teach back the diagnosis, medicine changes, red flags and follow-up? | **Kwame/Efua.** 43.9% recall follow-up; 78% incomplete understanding, and only 20% aware of it; readmissions 14.7% (948,836). Must keep a clinician in the loop (18% safety flags) | 5 | 3 | 4 | 60 |
| H5 | …help someone fit their concerns, history and questions into a 9-minute GP slot and leave with a plain record of what was agreed? | 9.22-minute consultations; 61% struggle with numbers. Tool must structure, not diagnose ([Bean 2026](https://arxiv.org/abs/2504.18919)) | 3 | 4 | 5 | 60 |
| H6 | …make sure patients with limited English know they're entitled to a free professional interpreter, can request one, and get verified pre-translated basics, without unsafe machine translation? | **Fatima.** 1.04m people; £75.5m spent vs £250–300m need; Somali machine translation has 92% clinically impactful errors; 49.1% vs 29.5% physical harm | 5 | 4 | 3 | 60 |
| H7 | …help people pick the right NHS door (Pharmacy First, GP, 111, A&E)? | 111 answered within 60 seconds fell to 75.6%. But triage is likely a **medical device** (MHRA), and NHS "My NHS GP" is coming | 3 | 2 | 3 | 18 |

**Recommendation for the team:** C1 or C2 for the Cyber prize. Both have a clear demo moment, are under-served, and rely on verification and routing rather than fragile detection. In Health, H1 is the most demoable and lowest-risk build.

---

## 5. Sources

**Cyber: primary**
- FTC, JEC testimony (2026 · 2025): https://www.ftc.gov/system/files/ftc_gov/pdf/ftc-testimony-jec-hearing-on-the-rising-scam-economy.pdf
- FTC, imposter press release (2026): https://www.ftc.gov/news-events/news/press-releases/2026/06/ftc-data-show-people-reported-losing-3-point-5-billion-imposter-scams-2025
- FTC, social media spotlight (2026): https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2026/04/reported-losses-scams-social-media-eight-times-higher-2020
- FTC, Data Book (2025 · 2024): https://www.ftc.gov/system/files/ftc_gov/pdf/csn-annual-data-book-2024.pdf
- FTC, Protecting Older Consumers (2025): https://www.ftc.gov/system/files/ftc_gov/pdf/P144400-OlderAdultsReportDec2025.pdf
- FTC spotlights:
  - https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/08/false-alarm-real-scam-how-scammers-are-stealing-older-adults-life-savings
  - https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2024/12/paying-get-paid-gamified-job-scams-drive-record-losses
  - https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/04/top-text-scams-2024
  - https://www.ftc.gov/news-events/data-visualizations/data-spotlight/2025/12/rental-scams-hit-home-65-million-reported-losses
- FBI IC3 Annual Report (2026 · 2025): https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf
- FBI PSAs:
  - https://www.ic3.gov/PSA/2024/PSA241203
  - https://www.ic3.gov/PSA/2025/PSA250515
  - https://www.ic3.gov/PSA/2025/PSA251205
  - https://www.ic3.gov/PSA/2024/PSA240412
  - https://www.ic3.gov/PSA/2025/PSA250513
  - https://www.ic3.gov/PSA/2025/PSA251113
  - https://www.ic3.gov/PSA/2025/PSA250813
- UK Finance Annual Fraud Report (2026 · 2025): https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf
- PSR:
  - https://www.psr.org.uk/information-for-consumers/app-scams-reimbursement-dashboard/
  - https://www.psr.org.uk/information-for-consumers/unmasking-how-fraudsters-target-uk-consumers-in-the-digital-age/
- ONS:
  - https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/bulletins/crimeinenglandandwales/yearendingmarch2026
  - https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/articles/natureoffraudandcomputermisuseinenglandandwales/yearendingmarch2025
- Home Office:
  - Fraud Strategy 2026: https://www.gov.uk/government/publications/fraud-strategy-2026-to-2029/fraud-strategy-2026-to-2029-disrupting-crime-supporting-economic-resilience-and-delivering-justice-accessible
  - Victims' experiences (2025): https://www.gov.uk/government/publications/experiences-of-victims-of-fraud-and-cyber-crime/experiences-of-victims-of-fraud-and-cyber-crime
- Ofcom (2023): https://www.ofcom.org.uk/online-safety/online-fraud/scale-and-impact-of-online-fraud-revealed
- Starling (2024): https://www.starlingbank.com/news/starling-bank-launches-safe-phrases-campaign/
- Heiding et al. (2024): https://arxiv.org/abs/2412.00586
- Europol IOCTA (2025): https://www.europol.europa.eu/cms/sites/default/files/documents/Steal-deal-repeat-IOCTA_2025.pdf
- Mai et al., PLOS ONE (2023): https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0285333
- Deepfake-Eval-2024: https://arxiv.org/abs/2503.02857
- NCA (2024): https://www.nationalcrimeagency.gov.uk/news/nca-issues-urgent-warning-about-sextortion
- NCMEC: https://www.missingkids.org/gethelpnow/cybertipline/cybertiplinedata
- Stajano & Wilson: https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-754.pdf
- SI 2024/1013: https://www.legislation.gov.uk/uksi/2024/1013/made
- Pay.UK: https://www.wearepay.uk/what-we-do/overlay-services/confirmation-of-payee/
- FINRA 4512: https://www.finra.org/rules-guidance/rulebooks/finra-rules/4512
- Stop Scams UK 159: https://stopscamsuk.org.uk/159
- NCSC: https://www.ncsc.gov.uk/information/report-suspicious-emails
- HESA (2026): https://www.hesa.ac.uk/news/27-01-2026/sb273-higher-education-student-statistics
- Trading Standards South West (2024): https://www.tssw.org.uk/student-scams-toolkit/scammed-by-the-fake-chinese-police/
- Deloitte (2024): https://www.deloitte.com/us/en/insights/industry/financial-services/deepfake-banking-fraud-risk-on-the-rise.html
- Tools:
  - https://blog.google/security/new-ai-powered-scam-detection-features/
  - https://blog.google/security/staying-one-step-ahead-strengthening-androids-lead-in-scam-protection/
  - https://newsroom.gendigital.com/2026-03-04-The-Worlds-First-AI-Powered-Scam-Detector,-Norton-Genie,-Now-in-ChatGPT
  - https://www.bitdefender.com/en-us/consumer/scamio
  - https://news.virginmediao2.co.uk/o2-unveils-daisy-the-ai-granny-wasting-scammers-time/
  - https://monzo.com/blog/2023/09/06/making-it-clear-when-were-on-a-call-with-you
  - https://www.which.co.uk/news/article/the-latest-scam-alerts-from-which-aBRLy2b02WkC

**Cyber: secondary or vendor**
- CNN, Arup case (2024): https://www.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk
- Action Fraud rental figures via council repost (2024): https://www.highleyparish.gov.uk/news/2024/09/10
- Felix (2025): https://felixonline.co.uk/articles/new-fraud-tactic-targets-chinese-students-in-the-uk/
- iProov (VENDOR, 2025): https://www.businesswire.com/news/home/20250211131029/en/iProov-Study-Reveals-Deepfake-Blindspot-Only-0.1-of-People-Can-Accurately-Detect-AI-Generated-Deepfakes
- MediaNama, Truecaller: https://www.medianama.com/2024/05/223-truecaller-ai-voice-scanner-spam-call/
- The Paypers, Starling: https://thepaypers.com/fraud-and-fincrime/news/starling-bank-adds-ai-agent-to-detect-romance-and-investment-fraud
- Tech.eu, Revolut: https://tech.eu/2024/02/15/revolut-launches-ai-scam-features-to-break-scammers-spell/
- PIRG, iOS 26: https://pirg.org/edfund/articles/call-screening-in-iphone-ios26-nice-effort-to-combat-robocalls-but/

**Health: primary**
- Rowlands, BJGP (2015): https://eprints.ncl.ac.uk/245102
- NHS Health Literacy Toolkit (2023): https://library.nhs.uk/wp-content/uploads/sites/4/2023/06/Health-Literacy-Toolkit.pdf
- DfE PIAAC (2024): https://assets.publishing.service.gov.uk/media/675330e020bcf083762a6d48/Survey_of_Adult_Skills_2023__PIAAC__National_Report_for_England.pdf
- NAAL: https://nces.ed.gov/pubs2006/2006483.pdf
- Vernon (2007): https://hsrc.himmelfarb.gwu.edu/cgi/viewcontent.cgi?article=1173&context=sphhs_policy_facpubs
- Berkman (2011): https://www.acpjournals.org/doi/10.7326/0003-4819-155-2-201107190-00005
- Horwitz (2013): https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1754366
- Healthwatch:
  - https://www.healthwatch.co.uk/blog/2023-11-20/nhs-urged-do-more-help-patients-leave-hospital-safely
  - https://www.healthwatch.co.uk/advice-and-information/2025-10-03/can-i-access-my-gp-records-online
  - https://www.healthwatch.co.uk/response/2025-07-10/our-response-gp-patient-survey-2025
  - https://www.healthwatch.co.uk/blog/2022-03-22/lost-words-improving-access-healthcare-ethnic-minority-communities
- NHS England Digital:
  - Readmissions: https://digital.nhs.uk/data-and-information/publications/statistical/compendium-emergency-readmissions/current/emergency-readmissions-to-hospital-within-30-days-of-discharge
  - NHS App statistics: https://digital.nhs.uk/data-and-information/publications/statistical/nhs-app-statistics/august-2026
- Kidney Care UK: https://kidneycareuk.org/about-us/policy-updates/nhs-organisations-told-to-stop-unexpected-diagnoses-via-the-nhs-app/
- Picker (2025): https://picker.org/research_insights/cancer-diagnoses-and-the-nhs-app/
- Cork & Hopcroft (2025): https://bjgpopen.org/content/early/2025/07/15/BJGPO.2024.0300
- DHSC Overprescribing Review (2021): https://assets.publishing.service.gov.uk/media/614a10fed3bf7f05ab786551/good-for-you-good-for-us-good-for-everybody.pdf
- WHO (2003): https://www.paho.org/sites/default/files/WHO-Adherence-Long-Term-Therapies-Eng-2003.pdf
- Montgomery (UKSC 2015): https://supremecourt.uk/uploads/uksc_2013_0136_judgment_fd5635b4cd.pdf
- Zai (2024): https://pmc.ncbi.nlm.nih.gov/articles/PMC11428065/
- ONS language (Census 2021): https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/language/bulletins/languageenglandandwales/census2021
- ONS unpaid care (Census 2021): https://www.ons.gov.uk/peoplepopulationandcommunity/healthandsocialcare/healthandwellbeing/bulletins/unpaidcareenglandandwales/census2021
- NHS England interpreting:
  - 2025: https://www.england.nhs.uk/long-read/improvement-framework-community-language-translation-and-interpreting-services/
  - 2018: https://www.england.nhs.uk/wp-content/uploads/2018/09/guidance-for-commissioners-interpreting-and-translation-services-in-primary-care.pdf
- Khoong (2019): https://pmc.ncbi.nlm.nih.gov/articles/PMC6450297/
- Martos (2025): https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2839035
- Carers UK (2025): https://www.carersuk.org/media/stxp5zaf/cuk-nhs-10-year-plan-vision-report.pdf
- Irving (2017): https://pmc.ncbi.nlm.nih.gov/articles/PMC5695512/
- BMA: https://www.bma.org.uk/media/agfcxgkj/bma-safe-working-in-general-practice-a-summary.pdf
- GP Patient Survey 2026: https://www.ipsos.com/en-uk/2026-gp-patient-survey-results-released
- NHS 111 statistical note: https://www.england.nhs.uk/statistics/wp-content/uploads/sites/2/2026/09/Statistical-Note-IUCADC-Jul-2026-f414g.pdf
- Pharmacy First: https://www.england.nhs.uk/primary-care/pharmacy/pharmacy-services/pharmacy-first/
- Accessible Information Standard: https://www.england.nhs.uk/long-read/accessible-information-standard/
- SignHealth: https://signhealth.org.uk/resources/report-sick-of-it/
- LeDeR: https://www.kcl.ac.uk/ioppn/leder/leder2024/leder-2024-report.pdf
- MHRA:
  - https://www.gov.uk/government/publications/medical-devices-software-applications-apps
  - https://medregs.blog.gov.uk/2023/03/03/large-language-models-and-software-as-a-medical-device/
- NICE ESF: https://www.nice.org.uk/corporate/ecd7/chapter/section-b-classification-of-digital-health-technologies
- DTAC: https://digital.nhs.uk/services/digital-technology-assessment-criteria-dtac
- NHS England AI scribing: https://www.england.nhs.uk/long-read/guidance-on-the-use-of-ai-enabled-ambient-scribing-products-in-health-and-care-settings/
- Bean et al.: https://arxiv.org/abs/2504.18919 (Nature Medicine 2026, DOI 10.1038/s41591-025-04074-y)
- Zaretsky (2024): https://doi.org/10.1001/jamanetworkopen.2024.0357
- 10 Year Health Plan (2025): https://assets.publishing.service.gov.uk/media/6888a0b1a11f859994409147/fit-for-the-future-10-year-health-plan-for-england.pdf
- OpenAI (2026): https://openai.com/index/introducing-chatgpt-health/
- KFF (2024): https://www.kff.org/health-information-trust/poll-finding/kff-health-misinformation-tracking-poll-artificial-intelligence-and-health-information/
- Ada: https://about.ada.com/about
- DOI-only sources: Engel 2009 (10.1016/j.annemergmed.2008.05.016); Steitz 2023 (10.1001/jamanetworkopen.2023.3572); Elliott 2021 (10.1136/bmjqs-2019-010206); Divi 2007 (PMID 17277013).

**Still UNVERIFIED:**
- McAfee "Artificial Imposter" (2023)
- UK "1 in 7 frauds reported" figure
- Measured effect of Confirmation of Payee
- HMICFRS fraud inspection figures
- RNIB letter statistics
- NHS 111 online volumes
- Pharmacy First awareness
- Medicines-leaflet readability
