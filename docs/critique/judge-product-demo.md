# Judge critique: the product and demo lens

**Persona:** an AI PM / engineering director, modelled on the panel (T-Mobile AI agents, EA, AgentStatus, Parahelp). I score from the README and video. Three of those four build **agents in production**, so they reward agent reliability (sycophancy, hostile input, evals) and smell staged demos.

## Scores (projected for a well-executed version by a competent team in 5 days)

| | Impact | Tech & AI | Innovation | Execution | Presentation | **Total** | Audience Fav | Verdict |
|---|---|---|---|---|---|---|---|---|
| **H4 Say It Back** | 5 | 4 | 3 | 4 | 5 | **21** | 4 | **Champion** |
| **E1 Stubborn Classmate** | 4 | 5 | 4 | 4 | 4 | **21** | 3 | Contender |
| **K2 Stand-in** | 4 | 5 | 4 | 3 | 4 | **20** | 4 | Contender (highest ceiling) |
| **CR1 Cliché Radar** | 2 | 4 | 5 | 4 | 4 | **19** | 4 | Also-ran (most memorable 10 s) |
| **CL4 Quote X-ray** | 3 | 3 | 3 | 3 | 3 | **15** | 2 | Also-ran |

---

## H4 · Say It Back
**The 10-second pitch:** "Grandad explains his discharge letter back to the phone, and anything he got wrong turns red next to the exact line in the letter."
- **Does the wow land in under 20 s?** Yes, and it's the best in the set. "Once a day like before" against "furosemide increased to 80mg" needs no explanation, and every judge has a Kwame.

**Most damaging objection: false reassurance.** If the grader marks Kwame "confirmed" when he's wrong, you've built a machine that puts a green tick on misunderstanding, the exact failure behind your own stat (78% misunderstand, only 20% know it). Also: at home after discharge, the "questions for the ward" go nowhere.
- **Fix:** asymmetric grading. "Confirmed" only if the explanation matches the quote's key values (drug, dose, frequency); everything else defaults to *not confirmed*. Make the **false-confirm rate** the headline eval number. Cast Efua as the operator holding the phone.

**Innovation is a 3.** To a judge on project 30 it can read as "AI explains your document" or "a quiz on your PDF". Put the reframe (the AI *listens*, it doesn't explain) in the README's first line. Run the prior-art check today: Cabinet Clear is adjacent.

**Demo video (about 3 min):**
1. **0:00–0:15:** Kwame's real voice (a real older person, not TTS) says the line; the item turns red; the quote is highlighted.
2. **0:15–0:45:** Efua and Kwame; 78%/20%, 14.7% readmissions; "teach-back is standard, but nurses don't have time".
3. **0:45–1:45:** Letter photo → must-know items with quotes (show one **dropped for having no quote**) → Kwame explains back → only the missed item is re-explained → second pass goes green.
4. **1:45–2:20:** Receipt and fridge sheet. Kwame asks "can I skip it if I'm up all night?"; it routes him to the pharmacist.
5. **2:20–3:00:** Eval (false-confirm rate first), what doesn't work, architecture.

**Audience Favorite: 4.** The most emotional clip; families share it. No "try it yourself" hook.

---

## E1 · The Stubborn Classmate
**The 10-second pitch:** "An AI classmate with a real maths misconception that changes its mind only when you explain *why*, not when you tell it it's wrong."
- **Does the wow land in under 20 s?** Yes, if the toggle opens the video. Type "you're wrong, it's 4" into both: the plain LLM grovels and Sam pushes back. It's funny, and it is the Remembrance pattern that already won.

**Most damaging objection: who is the user?** Two personas means no persona. The learner who most needs this (Kayla, third resit) is the one who *can't* explain why 0.5 × 8 = 4; the one who can (Jonah) doesn't need it. And nobody demoralised voluntarily opens an app to tutor a bot.
- **Fix:** pick Kayla; frame it as a teacher-set five-minute exit ticket in an FE resit class, so the teacher is the channel. Sam's pushback must scaffold ("what does 0.5 *mean*?") so a weak learner can still win.

**Other risks:** judges *will* try to break it with confident nonsense; a 20% false-flip rate fails one judge in five, live. Tuva won Best Use of Featherless (a sponsor here) as a reverse tutor, so name it and state the difference: runtime belief state plus a selective-flip metric.

**A pitch for this panel:** selective flip is what you want in a support agent that a pushy customer can't talk out of policy. Parahelp and AgentStatus will feel that sentence.

**Demo video (about 3 min):**
1. **0:00–0:20:** Split screen: the plain LLM caves, Sam holds. "Most AI agrees with you. Sam doesn't."
2. **0:20–0:45:** −17% once AI is removed (PNAS); 15.3% resit pass rate.
3. **0:45–1:50:** Kayla teaches by voice; root-cause chips light up and Sam's confidence moves only when they do; Sam flips and solves 0.25 × 12 unprompted.
4. **1:50–2:20:** Gap map, one practice question, a 15-second "LLM extracts, rules decide" diagram.
5. **2:20–3:00:** Flip-rate chart against the baseline, one honest failure, credit to Eedi.

**Audience Favorite: 3.** "An AI that won't just agree with you" is a good 2026 meme; maths has low emotional pull.

---

## K2 · Stand-in
**The 10-second pitch:** "Before you pay a deposit, your AI emails the 'landlord' and makes him prove he's real, and every red flag quotes his own words back."
- **Does the wow land in under 20 s?** No, as designed. The injection catch needs about 60 s of setup: what the agent is, the inbox, the reply.
- **Fix:** cold-open on the finished dossier. A red flag reads "Dodged deposit-protection question (legally required)" next to the quoted reply line. Then cut to the injected reply being quarantined.

**Most damaging objection: channel and urgency.** Amara's "landlord" lives on Messenger, WhatsApp or SpareRoom DMs, not email, and wants the money *today*; Stand-in needs an email address and hours of back-and-forth. Worse, the hero scam ("I'm abroad, deposit before viewing") is caught by one free rule.
- **Fix:** demo the *hard* scammer, who agrees to a viewing and names an agency whose Companies House and redress numbers don't match. That's where provoking evidence beats a checklist.
- Frame injection as "once you send an agent, the other side can talk to your agent". Don't claim rental scammers do it today.

**Execution is the weak score:** five integrations, no free reverse-image API, Agentboxd capped at 20 emails a day. Cut reverse image, hard-code the redress lookup, run the 40-persona eval offline, and it reaches 21–22. Best panel fit, and the only cash track prize (Agentboxd-funded).

**Demo video (about 3 min):**
1. **0:00–0:20:** Dossier lights up, then the injection is quarantined. "The verdict is made by rules, not the model."
2. **0:20–0:50:** Amara, £1,200, 3× more likely to lose, advance-fee +65%.
3. **0:50–1:50:** Paste listing → AI-disclosed draft → Amara approves → clock time-skip → reply → extracted answers → Companies House mismatch.
4. **1:50–2:20:** Evasion rules fire, each with its citation.
5. **2:20–3:00:** Eval (detection, false positives, time to first flag), what doesn't work (WhatsApp), "Try to scam our agent."

**Audience Favorite: 4.** "Try to scam our agent" is a great viral mechanic, but beta email limits could break it mid-vote.

---

## CR1 · Cliché Radar
**The 10-second pitch:** "Type your idea and see how many AIs already had it, then get pushed somewhere none of them went."
- **Does the wow land in under 20 s?** Yes, but the "drag your idea" beat makes no sense: moving a dot doesn't change an idea.
- **Fix:** the user *rewrites* the idea and the dot jumps live from the red cluster to empty space.

**Most damaging objection: no user with a stake, and a metric I don't trust.** Leah's real pain is lost income, and this doesn't touch it. Homogenisation is a societal statistic, not a moment. Embedding distance also measures *wording*: an original idea phrased in common words lands in the crowd.

**Demo video (about 3 min):**
1. **0:00–0:20:** "Melting Earth poster" lands where 61% of AI answers sit.
2. **0:20–0:45:** The Nature Human Behaviour result: 94% overlap.
3. **0:45–1:45:** Provocations, a rewrite, and the jump.
4. **1:45–2:20:** A sketch photo lands on the map.
5. **2:20–3:00:** The killer beat: "here's the map of 2,234 hackathon projects, and the scam-detector cluster you're judging right now", plus predicted-against-actual saturation.

**Audience Favorite: 4.** It's the most "try it yourself" of the five. On the rubric, though, Impact caps it.

---

## CL4 · Quote X-ray
**The 10-second pitch:** "Photograph your heat-pump quote and see the red flags the installer hoped you'd miss."
- **Does the wow land in under 20 s?** It lands, but it's unreadable: MCS, PAS 2035, TrustMark and EPC mean nothing to a US panel.
- **Fix:** translate it into money: "This installer isn't MCS-certified, so you lose the £7,500 grant."

**Most damaging objection: the evidence doesn't support the product.** The 98% figure counts *installation* defects, which you can't see in a quote. Gareth also buys a heat pump once a decade, and the ECO4 cold-call victims won't upload PDFs. The AI does one job (extraction), and registry access is uncertain (MCS has no public API).

**Demo video (about 3 min):** an overlay cold open, then Gareth and the grant, then two quotes uploaded with an EPC pull, then a side-by-side with "questions to ask", then the eval and its limits.

**Audience Favorite: 2.**

---

## Ranking and the one I'd fight for
1. **H4 (21):** clearest harm, best 10-second moment, LLM boxed in by quotes. Wins the two criteria judges score by gut from video (Impact, Presentation).
2. **E1 (21):** deepest technical story; fuzzy user and live-test fragility.
3. **K2 (20):** highest ceiling, best panel and prize fit; most execution risk and an async demo.
4. **CR1 (19):** I'd remember it; I wouldn't place it.
5. **CL4 (15):** worthy, dry, UK-only.

**I'd fight for H4**, on two conditions: a clean prior-art check, and false-confirm rate as the headline metric. If its prior art is crowded, switch to **K2 with the scope cut**, not E1 (a Featherless judge has seen Tuva).

**Build note:** H4 and E1 share an engine: grade a spoken explanation against a rubric of must-know ideas, mark it with deterministic rules, re-explain the gaps. Build that first, whichever you pick.
