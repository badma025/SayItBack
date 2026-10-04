# 05 · Prior-art check: AI + Cybersecurity concepts (K1–K3)

Researched 4 Oct 2026. I read Devpost projects through Devpost's own search JSON (`/software/search?query=…`, which returns `total_count` and a `winner` flag) and by opening each project page. Commercial and research claims link to the product page, the paper or the press release. Devpost's search totals are fuzzy-match counts. They show how crowded a space is. They do not count exact clones.

> **Headline risk:** a project called **ScamPoint** has already been submitted to **ForgeHacks Online 2026**, our own event. It is pitched to "break the psychological isolation of a cyber extortion attempt" with a family SOS ([Devpost](https://devpost.com/software/scampoint)). It is close to K1, but it is offline keyword heuristics for India's "digital arrest" scam.

## TL;DR verdict table

| Concept | Novelty (1–5) | Closest competitor(s) | Angle that still looks unclaimed |
|---|---|---|---|
| **K1 Scam playbook forecaster / isolation-breaker** | **2** | Rakshak (playbook stage tracking, family "war room", "golden-hour pack"); CyberShield ("predicts the likely next step"); Jenova Scam Detector ("scammer's likely next ask"); PreScam benchmark (next-action prediction); ScamPoint (same hackathon) | **Falsifiable, time-stamped forecasts used as proof**: a sealed "prediction card" that the victim and one trusted person can see. When the scammer makes the predicted move, the script is exposed. Aimed at slow, multi-day text/video coercion of UK international students (UKVI, Chinese/HK police) in Mandarin or Cantonese, not live calls. |
| **K2 Stand-in: AI proxy for risky first contact** | **4** (the proxy) / 2 (the checks) | DepositCheck (reverse image, prize winner); Bye! Buy! (seller-side agent that filters scammers, TreeHacks 2026 winner); Betty (AI answers calls for your listing); Scam Mirror (agent calls the suspect line and the official line); Apify "cited risk report" rental checker | **Outbound challenge-and-response vetting from the buyer, renter or job-seeker side.** An AI with its own disclosed inbox sends verification challenges that a scammer structurally cannot meet: viewing slot, redress-scheme membership, Companies House number, a callback from the published switchboard. It scores how the counterparty responds and joins that with tool checks in a cited dossier. I found no product or Devpost project that does this. |
| **K3 Golden Hour: post-scam recovery co-pilot** | **2** globally / **3** UK | Munshi (first hour after a UPI scam, pre-filled forms); Recourse (IC3 draft, freeze letters, recovery-scam screening); Rakshak "golden-hour pack"; Fifty (US/UK dispute rules); UK: Start My Claim (self-serve APP/FOS claims, £49–£399), Refundee (human claims firm) | **A UK PSR claim-strength auditor.** It rebuilds the timeline from screenshots and statement lines, then checks the evidence against the PSR exceptions (gross negligence and the "consumer standard of caution") so the claim answers the bank's likely refusal reasons before they come up. It runs the 13-month, 5-business-day and FOS clocks and puts up a recovery-scam firewall. |

---

## K1 — Scam playbook forecaster / isolation-breaker

### 1. Commercial and official products
- **Norton Genie** analyses whole emails, texts, images and links for a scam verdict. It is now inside ChatGPT (Mar 2026) and Claude (Jun 2026) ([Gen, Mar 2026](https://newsroom.gendigital.com/2026-03-04-The-Worlds-First-AI-Powered-Scam-Detector,-Norton-Genie,-Now-in-ChatGPT); [Gen, Jun 2026](https://newsroom.gendigital.com/2026-06-30-Norton-Genie-Expands-to-Claude,-Bringing-AI-Powered-Scam-Detection-into-Everyday-Conversations)). It is a one-shot classifier with no stage model and no trusted-person flow.
- **Bitdefender Scamio** is a free chatbot on the web, WhatsApp and Messenger. You describe the scenario and get a verdict plus advice ([Bitdefender](https://www.bitdefender.com/en-us/consumer/scamio)). One-shot.
- **Ask Silver** checks screenshots over WhatsApp, says "safe" or "Red Flag", and auto-reports scams. Metro Bank partnered with it as the first UK bank to do so ([Metro Bank](https://www.metrobankonline.co.uk/about-us/press-releases/news/metro-bank-launches-first-ai-scam-detection-tool--with-ask-silver/)). One-shot.
- **Trend Micro ScamCheck, McAfee Scam Detector**: verdicts on screenshots, URLs and texts, plus deepfake checks on video calls ([Trend Micro](https://newsroom.trendmicro.com/2026-06-25-TrendLife-TM-Awarded-AI-Safety-Solution-of-the-Year-for-ScamCheck-App-in-2026-Artificial-Intelligence-Breakthrough-Awards-Program); [McAfee](https://www.mcafee.com/blogs/mcafee-news/introducing-mcafees-scam-detector-now-included-in-all-core-plans/)).
- **Google Messages Scam Detection** runs on the device and flags *conversational* scams that "turn dangerous over time" ([Google](https://blog.google/security/new-ai-powered-scam-detection-features/)). It covers SMS and RCS only, gives a warning and does not forecast.
- **Starling Scam Intelligence** (24 Jun 2026) adds romance and investment-scam questioning inside the banking app, on Gemini ([Crowdfund Insider](https://www.crowdfundinsider.com/2026/06/287477-uks-starling-bank-introduces-ai-enabled-solution-to-combat-romance-scams-and-other-frauds/)). It does not analyse a conversation over time, predict the next move or involve a trusted contact.
- **Apple Impersonation Risk Detection** (iOS 27, Sep 2026) is on-device risk scoring of "interaction patterns, timing, context" during payments, made available to apps ([Engadget](https://engadget.com/2271157/apple-iphone-ipad-impersonator-risk-detection-new-security-feature)). **BioCatch** gives banks a signal for an active call or coaching during a session ([BioCatch](https://www.biocatch.com/social-engineering-scam-detection)). Both work on the bank side and never talk to the victim about the script.
- **Monzo Trusted Contacts** lets a friend approve large transfers ([Which?](https://www.which.co.uk/news/article/monzo-unveils-three-fraud-fighting-tools-apcKC2k65mSl)). It brings in a trusted person but has no AI.
- **Jenova "Scam & Fraud Detector"** advertises "escalation-stage analysis that shows the scammer's likely next ask" for romance and investment fraud ([Jenova](https://www.jenova.ai/en/resources/scam-fraud-detector)). **This means the "forecast" claim already exists commercially**, but only as a paragraph of output, without a playbook library or a trusted-person flow.

### 2. Research prototypes (the forecasting idea is well covered)
- **PreScam** (May 2026): 11,573 scam conversations across 20 categories, built on a "scam kill chain". Its tasks include **"scammer action prediction, which forecasts the scammer's subsequent actions."** Finding: next-action prediction "remains only moderately successful even for strong LLMs" ([arXiv 2605.12243](https://arxiv.org/abs/2605.12243)).
- **SCRIPTMIND** (EACL 2026 Industry): crime-script inference trained on Korean phone scams. It measures **scammer utterance prediction** and raised users' suspicion in simulations ([arXiv 2601.13581](https://arxiv.org/abs/2601.13581)).
- **Wood et al. 2023** pulled scam *stages and scripts* out of scam-baiting calls ([arXiv 2307.01965](https://arxiv.org/abs/2307.01965)). **Anatomy of Scam Scenarios** (Jun 2026) built a taxonomy from 102k reports: 18 scenarios, 6 tactics ([arXiv 2606.16052](https://arxiv.org/abs/2606.16052)). **ConScamBench** (Jul 2026) does conversation-level detection with summary memory ([arXiv 2607.11707](https://arxiv.org/abs/2607.11707)).

### 3. Devpost
Fuzzy totals: "scam stage" 114, "scam playbook" 22, "digital arrest scam" 41, "scam family alert" 90, "scam" 2,456. At least **8 near-matches**, most from Sep–Oct 2026:
- **Rakshak** (BunnieX, Sep 2026). It matches the call to a scam family and "tracks the exact stage of the playbook (authority pretext → accusation → isolation → video surveillance → fund verification → extraction)". It also alerts a family war room, runs a decoy counter-agent and builds a **"golden-hour pack"** ([Devpost](https://devpost.com/software/rakshak-dsgi3q)). No prize shown. **This is the closest match to K1 and K3 combined.**
- **CyberShield** (DSOC Summer, Jun 2026): "predicts the likely next step in the attack… generates an impact forecast" ([Devpost](https://devpost.com/software/cybershield-wvk7h3)). No prize.
- **Raksha** (YC × Moss sprint, Sep 2026): a 409-line playbook, live call analysis, "bring in someone you trust", and a guardian who follows the call ([Devpost](https://devpost.com/software/raksha-0g1hyf)).
- **ScamPoint** (submitted to **ForgeHacks Online 2026**, plus ImpactHack and Multimodal AI Hackathon on 4 Oct). Offline script database, statutory-law rebuttals, and a silent SOS with GPS sent to a guardian ([Devpost](https://devpost.com/software/scampoint)).
- **Thamba**: live "digital arrest" script detection in Marathi and Hindi ([Devpost](https://devpost.com/software/thamba)). **RedFlagged**: fake police and legal notices, with guidance to verify through official channels ([Devpost](https://devpost.com/software/redflagged)). **TrajAudit**: stage-trajectory detection (Rapport → Extraction → …) that won a Frostbyte participation recognition ([Devpost](https://devpost.com/software/trajaudit)). **ScamShield**: auto-alerts family members ([Devpost](https://devpost.com/software/scamshield-v4)).
- **Searched with no K1-specific hit:** "scam forecast" (15, of which only CyberShield was relevant), "scam next move", "pig butchering stage tracker", "virtual kidnapping / visa scam students" (no Devpost hit). **None of the projects targets UK international students, UKVI or Chinese-police scripts, or multi-day async chat in Mandarin.**

### 4. Verdict: 2/5
Every element has been claimed: playbook stages, next-move prediction, isolation-breaking and the trusted-person alert. The overlap is mostly with India-focused, live-call Devpost projects and with peer-reviewed benchmarks. One competitor is in our own hackathon. Judges have probably seen "scam detector + family alert" many times ("scam detector" returns 275 projects).

**Sharpest unclaimed angle: forecasts as falsifiable evidence.** The AI publishes one to three time-stamped predictions ("within 24 h they will (a) ask you to move to a 'safe' account or crypto 'bail', (b) forbid you from telling your university"). When a prediction comes true, it becomes an "I told you so" moment that breaks the spell. That matters because coached victims distrust generic warnings. Other parts of the angle:
- UK international students (UKVI "Alien Unique Identity Number", Chinese/HK police), in their own language.
- Asynchronous WeChat and WhatsApp screenshots over several days, rather than live calls.
- Report forecast accuracy honestly against held-out case studies, since PreScam shows this is hard.

### 5. Feasibility in 5 days
- **Playbook sources:**
  - FBI Chinese-police impersonation notice, covering spoofed calls, transfer to fake police, coerced video surveillance, and crypto or wire "bail" ([FBI](https://www.fbi.gov/wanted/seeking-info/chinese-police-impersonation-scam); [FBI Philadelphia](https://www.fbi.gov/contact-us/field-offices/philadelphia/news/fbi-philadelphia-warns-international-students-of-law-enforcement-impersonation-scam)).
  - UKCISA Home Office scam guidance ([UKCISA](https://www.ukcisa.org.uk/student-advice/life-in-the-uk/frauds-and-scams/)) and the Exeter "Alien Unique Identity Number" case ([Exeter](https://www.exeter.ac.uk/students/international/livingintheuk/fraudtricksandscams/)).
  - Report Fraud university students booklet ([Report Fraud](https://www.reportfraud.police.uk/university-students-booklet/)) and Avon & Somerset advice for Chinese students ([Police](https://www.avonandsomerset.police.uk/crime-prevention-advice/fraud-prevention-advice-for-chinese-students/)).
  - UK Finance Annual Fraud Report 2026 typologies ([UK Finance](https://www.ukfinance.org.uk/system/files/2026-06/UK%20Finance%20Fraud%20Report%202026.pdf)).
  - The PreScam kill-chain schema ([arXiv](https://arxiv.org/abs/2605.12243)).
- **Red flags:**
  - The victim may be under live video surveillance, so the trusted-person handoff has to be covert.
  - Don't give false reassurance when the system says "not a match".
  - Screenshots contain third parties' personal data (UK GDPR), so process them transiently.
  - Never advise confronting the scammer.

---

## K2 — "Stand-in": AI proxy for risky first contact

### 1. Commercial products
- **Agentboxd** is real. It offers "real email inboxes for AI agents" with a JEV triage model that scores injection, phishing and urgency, and labels mail `ai:injection-risk`. It is hosted in France, free for 3,000 emails a month during beta, and $15/month afterwards ([Agentboxd](https://agentboxd.com/); [GitHub](https://github.com/agentboxd/agentboxd)). The alternative is **AgentMail** (free: 3 inboxes, 3,000 emails a month) ([AgentMail](https://www.agentmail.to/)). Neither is a scam-vetting product.
- **Listing checkers that do not contact anyone:**
  - **FlagMyListing**: free, 20+ sites including Rightmove, Zoopla and SpareRoom, 40+ patterns, price comparison, no reverse image ([site](https://flagmylisting.com/)).
  - **Apify "AI Rental Listing Scam Checker — Cited Risk Report"**: $0.12 per listing, price vs. market, landlord complaint search, source URLs. It "does not reach out to landlords" ([Apify](https://apify.com/rumi7911/rental-scam-checker)).
  - **Starling Scam Intelligence**: marketplace screenshot analysis, with a reported 300% rise in cancelled suspicious payments ([Starling help](https://help.starlingbank.com/personal/topics/scam-intelligence/how-does-scam-intelligence-work/); [The Paypers](https://thepaypers.com/fraud-and-fincrime/news/starling-bank-adds-ai-agent-to-detect-romance-and-investment-fraud)).
- **AI acting for the seller:** Meta AI auto-replies to buyers on Facebook Marketplace (US and Canada, Mar 2026) ([TechCrunch](https://techcrunch.com/2026/03/12/facebook-marketplace-now-lets-meta-ai-respond-to-buyers-messages/)). This is the opposite side of the trade from K2.
- **AI talking to scammers (scambaiting):**
  - O2 "Daisy" ([CBS](https://www.cbsnews.com/news/ai-grandma-daisy-uk-anti-fraud-scammers-virgin-media-o2/)).
  - Apate.ai with CommBank ([CommBank](https://www.commbank.com.au/articles/newsroom/2025/06/apate-ai.html)).

  Their goal is to waste scammers' time or gather intelligence, not to vet a counterparty who might be legitimate for one user.

### 2. Research
- **Siadati et al.** ran a live LLM scambaiter with a human approving each message: 2,600 engagements, about 32% information disclosure, and only 48.7% of scammers replied to the first message ([arXiv 2509.08493](https://arxiv.org/abs/2509.08493)). This is useful evidence about how many counterparties will reply to a proxy at all.
- **Agent-to-agent consumer negotiation risks** ([arXiv 2506.00073](https://arxiv.org/abs/2506.00073)) and **AgenticPay** ([arXiv 2602.06008](https://arxiv.org/abs/2602.06008)) study agents negotiating, not verifying.
- **LLMail-Inject**: 208k prompt-injection attacks on an email agent, which shows that the threat to a K2 inbox is real ([arXiv 2506.09956](https://arxiv.org/abs/2506.09956)).
- **No paper found** on an LLM proxy that questions an unknown counterparty to verify them on a user's behalf.

### 3. Devpost
Fuzzy totals: "rental scam" 45, "listing verify scam" 40, "verify seller scam" 17, "job offer scam verify" 35. These match **only on the tool checks**:
- **DepositCheck**: Google Lens via SerpApi on listing photos, with corroborated / contradicted verdicts. **Winner: SerpApi Best AI Use Case**, DevNetwork 2026 ([Devpost](https://devpost.com/software/depositcheck)).
- **RentLens**: a verified-listing marketplace. **Honourable Mention**, Build With AI × Hackday FUTMINNA ([Devpost](https://devpost.com/software/rentlens-r6bl4v)). **Resify**: proof-of-ownership certificates. **Winner**, IrvineHacks 2024 ([Devpost](https://devpost.com/software/resify)).
- **Bye! Buy!**: seller-side "negotiation agents handle all buyer messages, filter out scammers". **Winner, TreeHacks 2026** (Google Cloud AI track, Browserbase) ([Devpost](https://devpost.com/software/bye-buy)). This proves judges like the "agent does the messaging" idea, but it works for sellers.
- **Betty — Picks Up for You**: an AI receptionist answers calls about your listing and flags scams ([Devpost](https://devpost.com/software/betty-picks-up-for-you)). **Scam Mirror**: agents call the suspect number *and* the official hotline and compare the answers ([Devpost](https://devpost.com/software/scam-mirror)). These are the closest to an outbound proxy, but they use voice and only check a callback.
- Also: ActionReceipt (verifies a seller before payment), TrueCompany Shield (checks employers against government APIs), ScamBaitAI (honeypot, prize winner).
- **Searched with zero relevant hits:** "agentmail scam" (0), "agentboxd" (0), "scambaiting agent" (0), "contacts landlord on your behalf" (1, not relevant), "burner email scam" (2, not relevant).

### 4. Verdict: 4/5 for the proxy, 2/5 for the dossier
The tool layer is commodity and partly already wins prizes: reverse image, WHOIS/RDAP, price checks, company registry lookups. **Outbound correspondence from the buyer, renter or job-seeker side, by an agent with its own inbox, that applies verification challenges and scores the replies, does not appear anywhere I searched.** It also makes good use of Agentboxd's injection scoring, which suits identity- and fintech-minded judges.

**Sharpest angle: challenge–response vetting.** The agent's questions are built so a legitimate party can answer them cheaply and a scammer cannot:
- An in-person viewing at an address that matches the listing photos.
- The letting agent's redress-scheme membership. Every English letting agent must belong to TPO or PRS, and must belong to a CMP scheme if it holds client money ([Bristol/NTSELAT](https://www.bristol.gov.uk/ntslat/letting-agency/cmp-scheme-membership); [Consumer Rights Act 2015 s.83](https://www.legislation.gov.uk/ukpga/2015/15/section/83/enacted)).
- A Companies House number that matches the officer named.
- A callback from the published switchboard.

The dossier then cites both the tool evidence and *how they answered*: evasion, urgency, payment before viewing.

### 5. Feasibility in 5 days
- **APIs:**
  - Companies House: free key, 600 requests per 5 minutes, Open Government Licence ([CH guidelines](https://developer.company-information.service.gov.uk/developer-guidelines)).
  - RDAP via IANA bootstrap `data.iana.org/rdap/dns.json`, free ([overview](https://apify.com/pappy-dev/domain-rdap-lookup/api)).
  - SerpApi Google Lens: 250 free searches a month ([SerpApi](https://serpapi.com/pricing)).
  - Google Vision Web Detection: 1,000 free units a month, billing account required ([Google](https://cloud.google.com/vision/pricing)).
  - ONS Price Index of Private Rents by local authority, monthly ([ONS](https://www.ons.gov.uk/peoplepopulationandcommunity/housing/methodologies/priceindexofprivaterentsqmi)).
- **Legal and ethical red flags:**
  - **Always disclose that it is an AI acting for an anonymous prospective tenant.** EU AI Act Art. 50 transparency duties for AI that interacts with people applied from 2 Aug 2026 ([EC FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)), and Agentboxd is EU-hosted. Never pose as the user or as a human.
  - Have a human approve every outbound message, as in Siadati et al.
  - UK GDPR applies to the counterparty's data, so keep it minimal and short-lived.
  - Don't scrape or auto-message inside platform UIs. Work from listings the user pastes.
  - Treat replies as hostile input (LLMail-Inject).
  - Avoid baiting or provoking criminals.
  - A new domain has deliverability limits.

---

## K3 — "Golden Hour": post-scam recovery co-pilot

### 1. Commercial and official
- **Start My Claim** is self-serve case management for "Scam and APP fraud refunds" and FOS complaints, with a flat £49–£399 fee ([site](https://www.startmyclaim.ai/); [scam page](https://www.startmyclaim.ai/scam-recovery)). **It is the closest UK competitor.** It does document templates, not timeline reconstruction from evidence.
- **Refundee** is an FCA-authorised claims management company (FRN 937096). It runs fraud claims to banks and the FOS with human staff on a no-win-no-fee basis ([Refundee](https://www.refundee.com/)).
- **Jenova Scam Detector** outputs "time-ranked recovery steps" ([Jenova](https://www.jenova.ai/en/resources/scam-fraud-detector)). The **Citizens Advice Scams Action Service** offers human advice ([Citizens Advice](https://www.citizensadvice.org.uk/about-us/information/scams-awareness-campaign/)). The FBI has warned about AI-powered fake-IC3 recovery scams ([Bitdefender](https://www.bitdefender.com/en-us/blog/hotforsecurity/fbi-warning-fake-ai-powered-recovery-scams)).
- **Verified facts for the pitch:**
  - 88% (£316m) of in-scope APP losses were reimbursed between 7 Oct 2024 and 31 Mar 2026, and 82% of claims closed within 5 business days ([PSR dashboard](https://www.psr.org.uk/information-for-consumers/app-scams-reimbursement-dashboard/)).
  - The 13-month limit and £85k cap ([PSR PS25/5](https://www.psr.org.uk/media/rhelv4op/ps25-5-app-scams-reimbursement-consolidated-policy-statement-may-2025.pdf)).
  - Report Fraud replaced Action Fraud on 4 Dec 2025, with full launch in Jan 2026 ([City of London Police](https://www.cityoflondon.police.uk/news/city-of-london/news/2025/december/report-fraud-service-goes-live-with-full-public-launch-in-january-2026/)).
  - 159 connects to more than 99% of UK retail current accounts ([Stop Scams UK](https://stopscamsuk.org.uk/campaign/get-help-now/)).

### 2. Research
- **Counter-Scam** (IJCAI 2026): a multi-agent system that runs from detection through "emergency response (reporting and account freezing)" to investigation, using 185k cases ([arXiv 2606.01475](https://arxiv.org/abs/2606.01475)). This is the research version of K3, built for Korea.

### 3. Devpost
Fuzzy totals: "scam recovery" 66, "scam recovery plan" 19, "APP fraud reimbursement" 18, "scam golden hour" 7. At least **6 near-matches**:
- **Munshi**: "the first hour after a UPI scam". It reads the bank's SMS, pre-fills the 1930 / bank / UPI forms and runs a countdown ([Devpost](https://devpost.com/software/munshi-the-first-hour-after-a-upi-scam-handled)).
- **Recourse**: story in, then a case file, an IC3 draft, an exchange freeze letter and an ordered plan. It "screens the 'we can get your money back'" pitch ([Devpost](https://devpost.com/software/recourse-9xpjnm)).
- **Rakshak**'s golden-hour pack (above). **RecoveryPath**: a French victim action plan ([Devpost](https://devpost.com/software/recoverypath)).
- **Fifty**: US/UK dispute rules with deadlines. It explicitly keeps UK help free because charging is "regulated claims management activity" ([Devpost](https://devpost.com/software/fifty)).
- No prizes shown on any of them.
- **No Devpost project** targets the UK PSR reimbursement regime or Report Fraud. I searched "authorised push payment" (7, none relevant) and "Report Fraud UK" (29, only Fifty relevant).

### 4. Verdict: 2/5 globally, 3/5 UK
"First-hour victim co-pilot with pre-filled reports" was built at least four times in Sep 2026, with the same "golden hour" framing. The UK regime is the gap, but Start My Claim already covers APP/FOS paperwork commercially.

**Sharpest angle: a claim-strength auditor.** Map the reconstructed timeline against the PSR exceptions: gross negligence, and the consumer standard of caution (heeding interventions, prompt reporting, sharing information, reporting to police) ([PS25/5](https://www.psr.org.uk/media/rhelv4op/ps25-5-app-scams-reimbursement-consolidated-policy-statement-may-2025.pdf)). The aim is to pre-empt the bank's denial. Add the FOS escalation path and a recovery-scam firewall. This would suit the Barclays and Citi judges.

### 5. Feasibility in 5 days
- Inputs are screenshots and CSV statement lines; no Open Banking is needed. Sources are PS25/5, the PSR dashboard, Report Fraud, 159/7726 and the FOS.
- **Red flags:**
  - FCA regulated claims management covers "seeking out… identification of claims" for financial services claims ([FCA glossary](https://handbook.fca.org.uk/glossary/G3567r)), so keep it free, informational and DIY.
  - Bank statements are sensitive: redact client-side.
  - The tool must never contact victims itself, because that is exactly what recovery scams do.

---

## Queries run (Devpost JSON search unless noted)
- **K1:** scam stage, scam next move, scam playbook, scam forecast, digital arrest scam, impersonation scam, scam script, police scam, scam family alert, is:winner scam / scam family. Google `site:devpost.com`: scam playbook stage; pig butchering stage tracker (none); virtual kidnapping / visa scam students (none).
- **K2:** rental scam, landlord scam verify, scam proxy agent, AI email agent scam, agentmail, agentmail scam (0), agentboxd (0), burner email scam, contacts landlord on your behalf, AI replies to scammer, scambaiting agent (0), scam baiting, scambait, verify seller scam, job offer scam verify, listing verify scam, reverse image listing, domain age whois scam, is:winner rental scam.
- **K3:** scam recovery, scam recovery plan, fraud report assistant, scam victim, APP fraud reimbursement, authorised push payment, APP scam, Report Fraud UK, after scam, recovery scam, action fraud report, bank dispute letter fraud, scam timeline evidence, fraud evidence pack, scam golden hour, is:winner scam victim.
- **Web:** product, research and regulatory searches, as cited inline.

## Key sources (all cited inline above)
- **Devpost:**
  - [ScamPoint (ForgeHacks 2026)](https://devpost.com/software/scampoint)
  - [Rakshak](https://devpost.com/software/rakshak-dsgi3q)
  - [CyberShield](https://devpost.com/software/cybershield-wvk7h3)
  - [Raksha](https://devpost.com/software/raksha-0g1hyf)
  - [DepositCheck](https://devpost.com/software/depositcheck)
  - [Bye! Buy!](https://devpost.com/software/bye-buy)
  - [Scam Mirror](https://devpost.com/software/scam-mirror)
  - [Munshi](https://devpost.com/software/munshi-the-first-hour-after-a-upi-scam-handled)
  - [Recourse](https://devpost.com/software/recourse-9xpjnm)
  - [Fifty](https://devpost.com/software/fifty)
- **Research:**
  - [PreScam](https://arxiv.org/abs/2605.12243)
  - [SCRIPTMIND](https://arxiv.org/abs/2601.13581)
  - [Counter-Scam](https://arxiv.org/abs/2606.01475)
  - [Siadati et al.](https://arxiv.org/abs/2509.08493)
  - [LLMail-Inject](https://arxiv.org/abs/2506.09956)
- **Products:**
  - [Norton Genie](https://newsroom.gendigital.com/2026-06-30-Norton-Genie-Expands-to-Claude,-Bringing-AI-Powered-Scam-Detection-into-Everyday-Conversations)
  - [Scamio](https://www.bitdefender.com/en-us/consumer/scamio)
  - [Starling](https://www.crowdfundinsider.com/2026/06/287477-uks-starling-bank-introduces-ai-enabled-solution-to-combat-romance-scams-and-other-frauds/)
  - [Jenova](https://www.jenova.ai/en/resources/scam-fraud-detector)
  - [Agentboxd](https://agentboxd.com/)
  - [Start My Claim](https://www.startmyclaim.ai/)
- **Regulatory:**
  - [PSR dashboard](https://www.psr.org.uk/information-for-consumers/app-scams-reimbursement-dashboard/)
  - [PSR PS25/5](https://www.psr.org.uk/media/rhelv4op/ps25-5-app-scams-reimbursement-consolidated-policy-statement-may-2025.pdf)
  - [Report Fraud](https://www.cityoflondon.police.uk/news/city-of-london/news/2025/december/report-fraud-service-goes-live-with-full-public-launch-in-january-2026/)
  - [EU AI Act Art. 50](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
