# ForgeHacks 2026: Design Brief (Define phase input)

Source: ForgeHacks 2026 Participant Packet (13 pp.), with the judging slide (p.11) as the governing document.

## Hard constraints
| Constraint | Value | Design implication |
|---|---|---|
| Deadline | Sat 10 Oct 2026, 12:00 PM ET (17:00 BST) | ~5.5 build days from 4 Oct. Scope for 4 build days + 1 polish/record day. |
| Team | Solo to 4 | Idea must decompose into ~3 parallel workstreams (frontend / AI pipeline / content+demo). |
| Track | Pick exactly one | Idea must sit squarely inside one track prompt. A hybrid is fine only if one track clearly owns it. |
| Fresh build | Nothing started before 3 Oct | Libraries and boilerplate are OK. |
| Honesty | "A half-working project is okay. Overstating it isn't." | README must have a "what works / what doesn't" table. Never fake a capability in the demo. |
| Judges test it | "Judges will test what you submit." | Needs a **live link** with zero-setup paths ("Try sample", no login, no API key needed), plus a video. |

## Rubric → design requirements (5 × 20%)
| Criterion | What a 5/5 needs (our interpretation) | Requirement for every candidate idea |
|---|---|---|
| **Real-World Impact & Relevance**: "a real problem with clear beneficiaries" | A named persona, a quantified harm (cited, recent), and an obvious "who is better off and how" | R1: one primary persona plus a cited headline stat in the first README paragraph |
| **Technical Implementation & AI Use**: "AI does useful work; explain how and why" | AI does work a non-AI app *couldn't*. It's multi-step (reasoning + tools + structured output), not one prompt in, prose out. The architecture diagram explains *why AI* at each step | R2: at least 2 distinct AI jobs (e.g. perceive → reason → act/generate), at least 1 real external tool/data call, and an explicit "why AI here" table |
| **Innovation & Creativity**: "a fresh angle beyond a generic app or chatbot" | The core interaction **is not a chat box**. A recognisable paradigm flip (AI as adversary, proxy, student, simulator, or instrument) | R3: the primary UI is not a chat thread, and the one-sentence pitch contains a twist a judge hasn't seen 10 times |
| **Execution & Completeness**: "works end to end and delivers what it claims" | A narrow, fully working golden path beats a broad, half-working one. Deployed, fast, graceful on failure | R4: one golden path a judge can complete in under 2 minutes on the live link, with seeded examples |
| **Presentation & Communication**: "clear README and demo: problem, solution, impact" | A 2–3 min video with a story arc (persona → pain → "wow" moment → impact), plus a README with problem, solution, impact, architecture, and what works and what doesn't | R5: a single "wow moment" that can be shown in under 20 seconds of video |

Bonus levers (not scored, but they tilt close calls):
- **Audience Favorite** (public Devpost vote): shareable, emotional, "try it yourself" virality.
- **Cybersecurity track prize** ($100 + Agentboxd Team): a fallback prize if we miss the top 3.
- **Meaningful sponsor-tool use**: sponsors are likely in the judging loop. A tool that does visible work beats a token logo.
- "Judging is calibrated for first-time project builders." A polished, well-communicated, *focused* project will stand out sharply against beginner entries. Polish and storytelling are disproportionately valuable here.

## Scoring rubric we'll use to critique candidates (internal)
Each idea gets scored 1–5 on the 5 official criteria, plus 3 internal risk factors:
- **Feasibility** (can a small team ship the golden path in 4 days?)
- **Saturation** (how many near-identical Devpost projects exist? 5 = none found)
- **Demo-ability** (is there a sub-20s "wow" moment?)

An idea is a finalist only if: official total ≥ 21/25 (projected), and feasibility ≥ 4, and saturation ≥ 3.
