# Define: synthesis, key insights, shortlist

Inputs: research/01–04. Each concept below is tested against the requirements R1–R5 in [00-design-brief.md](00-design-brief.md).

## Strategic insights (from the research, not the ideas)
1. **The judges are a fraud and identity crowd.** PayPal, Intuit, Barclays, Microsoft AI Identity, U.S. Bank and Citi are all represented, and ML people (NVIDIA, MIT) will spot a wrapper. The Cyber track is the only one with a cash prize. → A strong Cyber entry has *two* paths to a prize and an expert audience. (01)
2. **The rules punish thin wrappers explicitly.** Devpost asks for "thoughtful integration of AI (not just a wrapper)" and judges "how much was actually shipped". → Each finalist needs at least one piece of AI work we can **measure** (an eval number, or a win-rate against a baseline) and show in the README. (01)
3. **In cyber, verify, don't detect.** Humans catch only 73% of fake voices. Open-source deepfake detectors lose about 48% of their accuracy on real-world fakes. Interventions that work involve **a human outside the scam, or a delay**, and all of them live inside banks. Yet 66% of UK scams start online and are groomed over days. (03)
4. **In cyber, the aftermath is a void.** Only 2–6.7% of victims report, 56% feel shame, and 45% most need "where do I go". Yet **88% of in-scope UK bank-transfer scam losses are refunded *once the victim claims*.** Fake "recovery lawyers" then target victims again. (03)
5. **In education, AI is the crutch.** With unrestricted GPT-4, practice scores rose 48% but exam scores fell 17% once access was removed. Every "study mode" still has the *AI* do the explaining. Simulated students are **sycophantic** and flip at any correction. That last point is a *measurable technical gap* we can claim to close. (04)
6. **In health, the safe zone is narrow.** Explain and organise documents the person already has, and route them to humans. Never diagnose, triage or give dosing advice. (03)
7. **In climate, the gap is between knowing and acting.** 41% of people who saw a heat alert did nothing, because they didn't believe they were at risk. Alerts are regional and aimed at professionals. (04)

## Shortlist (6 concepts → prior-art check → judge-panel critique → 3 finalists)

### K1 · Scam Playbook Forecaster ("Next Move") · Cyber
- **HMW:** How might we help someone being *coached* by an impersonator ("UKVI / police / bank, tell no one") see the con before they pay, and safely bring in one trusted person?
- **Persona:** Wei, 23, a Chinese MSc student in London. A "UKVI officer" has passed her to "Shanghai police" on video and told her to keep it secret. (Government-impersonation losses reported to the FBI hit $798m in 2025, nearly double 2024. There are 685k international students in the UK.)
- **Concept:** Wei shares screenshots or a transcript privately, in any language. The AI matches the conversation against a library of documented **scam playbooks**, built from FBI warnings, UK Finance typologies and Trading Standards cases. It shows which **stage** she's at and **forecasts the scammer's next move**. It then helps her break the isolation: a calm pre-written message to one trusted person, plus verification through official channels.
- **Paradigm:** forecasting the script, not classifying a message. The wow moment: *the prediction comes true on screen.*
- **Measurable AI:** stage-classification accuracy and next-move hit-rate on a held-out set of scam scripts. Optionally an Adaption fine-tuned small model for privacy.

### K2 · Stand-in: an AI proxy for risky first contact · Cyber
- **HMW:** How might we let a student vet a rental "landlord" or job "recruiter" *without* exposing themselves?
- **Persona:** Amara, 19, a first-year student searching for a London room. (18–29s are 3× more likely to lose money to rental scams. UK advance-fee fraud rose 65%, driven by deposits.)
- **Concept:** An agent with its own real inbox (Agentboxd) corresponds with the counterparty, asks the verification questions scammers can't satisfy, and runs tool checks: Companies House, domain age, reverse image search, price anomaly. It returns a cited **trust dossier**.
- **Paradigm:** proxy. The wow moment for judges: *"Try to scam our agent. Email it."*
- **Measurable AI:** evasion detection on a scripted set of scammer and legitimate-landlord personas.

### K3 · Golden Hour: post-scam recovery · Cyber
- **HMW:** How might we turn the first hour after a scam from shame into a complete, correctly ordered recovery that actually gets money back?
- **Persona:** Tunde, 27, a delivery rider who lost £2,300 in a WhatsApp "task" job scam. A "recovery lawyer" is now contacting him.
- **Concept:** Tunde drops in screenshots, chat exports and statement lines. The AI rebuilds the timeline and produces an ordered action plan, a **draft refund claim to his bank under the UK reimbursement rules** (from the Payment Systems Regulator), a Report Fraud draft and an evidence pack. It also shields him from recovery scams.
- **Paradigm:** proxy and paperwork agent. The wow moment: *40 chaotic screenshots become a submitted-ready claim in 60 seconds.*
- **Measurable AI:** extraction accuracy (amounts, dates, payees) on a synthetic evidence set.

### E1 · The Stubborn Classmate · Education
- **HMW:** How might we make students prove understanding by *teaching*, to an AI that is only convinced by a real explanation?
- **Persona:** Kayla, 17, on her third GCSE maths resit. (Only 15.3% of 219k resitters passed in 2026.) Or Jonah, 20, an engineering student who can solve problems but can't explain them.
- **Concept:** An AI classmate seeded with a **documented misconception** (from the Eedi dataset). Its belief is an explicit state that **flips only when the student's explanation hits the root cause**. Afterwards the student gets a gap map of what their teaching revealed.
- **Paradigm:** the student teaches the AI. The wow moment: *side by side, the generic AI caves to "you're wrong"; ours holds out until it hears a real explanation, then visibly has its "aha".*
- **Measurable AI:** a **selective-flip score** against a baseline LLM classmate. This directly addresses a gap documented in 2026 research.

### H2 · Care Inbox · Healthcare
- **HMW:** How might we give an unpaid carer one current, shared picture of a parent's medicines and appointments across GP, hospital and pharmacy?
- **Persona:** Efua, 45, a nurse manager caring for her father Kwame, 81. He takes 9 medicines from 3 prescribers, and his diuretic dose changed at discharge without anyone explaining it. (There are 5.0m carers in England and Wales; 34% spend 10+ hours a month on NHS admin.)
- **Concept:** The family forwards every letter to a shared AI inbox (Agentboxd). The AI keeps a living timeline and **reconciles medicines across documents**, flagging discrepancies for the pharmacist or GP. It never gives dosing advice itself.
- **Paradigm:** email-native, with no app to install. The wow moment: *"Dose changed in the 3 Oct discharge letter; the GP list still says 40mg."*
- **Measurable AI:** extraction and reconciliation precision and recall on synthetic letters.

### CL1 · Heat Check-in · Climate
- **HMW:** How might we turn a regional heat alert into a personal plan, and a check-in, for Margaret, 81, who lives in a top-floor flat?
- **Concept:** When a heat alert hits *her postcode*, the AI **reaches out** with a plan tailored to her home and medicines, checks in during the day, and escalates to her carer or a neighbour if she doesn't respond.
- **Paradigm:** the AI reaches out rather than waiting to be asked. Risks: it's off-season (October), and telephony adds complexity.
- **Measurable AI:** limited (the plan's quality is subjective). This is the weakest on criterion R2.

## Parked (kept as fallbacks)
- Teach-back discharge coach (H4): safety needs a clinician in the loop.
- NHS App result explainer (H1): safe and feasible, but likely saturated on Devpost.
- Art crit partner (Cr1).
- Market-stall copilot (B1): its problem is unvalidated.
- Misconception-sim generator (E1b): high risk of unreliable generated simulations.
