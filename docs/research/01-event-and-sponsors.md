# ForgeHacks 2026: event intel and sponsor capability map

_Researched 2026-10-04. Primary sources only (Devpost, forgehacks.dev, vendor sites/docs). Every claim carries its source URL. "Not verified" means I looked and could not confirm it._

## TL;DR

- **Redeem perks today.** n8n codes go to the first 300 people only, Agentboxd 800, YouCam and Kariaa 1,000, and there are 1,247 registrants. Devpost lists the bundle *per participant*, so each teammate may be able to claim their own. ([Devpost](https://forgehacks-2026.devpost.com))
- **Track prizes are now announced:** $10 ProjectAAL credits plus a certificate for 5 tracks. **Only AI+Cybersecurity has cash** ($100 + 6 months Agentboxd Team), and top-3 overall can't also take a track prize. ([Devpost](https://forgehacks-2026.devpost.com))
- **Rules the packet omits:** video 2–4 min, public (YouTube); repo plus README required; track locked at submission; missing video or code means not judged. Sponsor usage is **not required**. ([Devpost](https://forgehacks-2026.devpost.com), [updates](https://forgehacks-2026.devpost.com/updates))
- **The judges** are big-company engineers and PMs, and no sponsor staff are among them. The panel is heavy on fintech, payments and identity (PayPal, Intuit, Barclays, Microsoft AI-Identity). **The ProjectAAL founder is a mentor**, and mentors may score. ([forgehacks.dev](https://www.forgehacks.dev/), [rules](https://forgehacks-2026.devpost.com/rules))
- **This is the first edition**, so there are no past winners to study. ([forgehacks.dev](https://www.forgehacks.dev/))
- **What Adaption actually is:** a data-optimization plus automated fine-tuning platform (Python SDK). It gives you your *own* small model (0.8B–120B, incl. VLMs) and a base-vs-adapted win-rate. Limits: at least 1,000 rows, multi-hour runs, and no hosted inference. Winners get +$1,000 per member. ([docs](https://docs.adaptionlabs.ai/autoscientist/supported-models/), [claim page](https://forgehacksandadaption.netlify.app/))
- **Agentboxd exposes its prompt-injection, phishing and SPF/DKIM verdicts** to developers (`ai.risk.injection` and `ai.risk.phishing`, 0–1) and supports human-approved drafts. It is the natural centrepiece for the Cyber track. **But the beta runs every workspace on Free limits (1k AI triage calls/mo), so confirm the perk lifts them.** ([API docs](https://agentboxd.com/docs/api), [pricing](https://agentboxd.com/pricing))
- **Featherless:**
  - The flat $25 "Chat" plan **forbids app/API traffic**, so plan on the $25 being a per-token balance (≈50–100M tokens on 8B models).
  - Most models are served at **32K context, not 256K**.
  - It has vision, embeddings and TTS, but **no speech-to-text and no image generation**.
  - Cold models can take 5 min to 1 h to warm up.

  ([billing](https://featherless.ai/docs/billing), [models](https://api.featherless.ai/v1/models))
- **YouCam:** $27.50 ≈ **500 units** (≈22 HD skin analyses, or 500 background removals or face swaps). Its terms **ban using outputs to train neural networks.** ([pricing](https://yce.perfectcorp.com/ai-api/api-pricing), [ToS](https://www.perfectcorp.com/perfectbeauty/youcam/terms-of-service-api))

---

## 1. Event intel (things the packet omits or gets differently)

### Submission rules not in the packet
- **Demo video: 2–4 minutes max, public, "posted online like on YouTube."** Also required: GitHub repo with README; written description covering problem/target users, technical approach and AI/ML components, real-world impact; plus screenshots, an architecture diagram **or** a deployment link. "Incomplete submissions (missing video or code) will not be eligible for judging." ([Devpost overview](https://forgehacks-2026.devpost.com))
- **Track is locked at submission:** "Your track must be selected when you submit your project and cannot be changed afterward." ([Devpost updates](https://forgehacks-2026.devpost.com/updates))
- Teams of 1–4; students only; one submission per team (if you submit more than one, only the most recent is judged); code must be publicly viewable (or privately shared with organizers). ([Devpost rules](https://forgehacks-2026.devpost.com/rules))
- Project must be "substantially created during the hackathon period"; open-source libraries, public datasets, pre-trained models and AI coding tools (Copilot/ChatGPT/Claude) are explicitly allowed. ([Devpost rules](https://forgehacks-2026.devpost.com/rules)) FAQ: "The core logic of your submission needs to be your own." AI is "not mandatory, but it is strongly encouraged." ([forgehacks.dev](https://www.forgehacks.dev/))
- **Sponsor-tool usage is not required** by any rule I found, and there is no sponsor bonus criterion. ([Devpost rules](https://forgehacks-2026.devpost.com/rules), [Devpost overview](https://forgehacks-2026.devpost.com))
- **Who scores:** "A panel of mentors and industry/academic judges will score submissions," judging Oct 10–11. ([Devpost rules](https://forgehacks-2026.devpost.com/rules)) Schedule: judging starts Oct 10 1:00 PM, public gallery opens Oct 10 5:00 PM, winners announced **Oct 12 3:00 PM**. ([forgehacks.dev](https://www.forgehacks.dev/))
- **Devpost's criterion wording is sharper than the packet's:** Technical = "thoughtful integration of AI (not just a wrapper)"; Execution = "how much was actually shipped during the hackathon"; Impact = "Must answer the prompt accordingly." No weights are published on Devpost; the 20% split is packet-only. ([Devpost overview](https://forgehacks-2026.devpost.com))

### Prizes (now partly announced)
- 1st: $6,935 total value incl. **$100 cash**; 2nd: $2,090 incl. $50 cash; 3rd: $1,330 incl. $25 cash, plus credits from Featherless, Momen, Adaption, ProjectAAL, AoPS, Saily, CodeCrafters, DevSwarm, CleanShot. ([Devpost overview](https://forgehacks-2026.devpost.com))
- **Track prizes are announced and small:** each of the 5 non-cyber tracks gets **$10 ProjectAAL credits + certificate + website recognition**. Projects that place top-3 overall cannot also win their track, so the track prize goes to the next-highest project. ([Devpost overview](https://forgehacks-2026.devpost.com))
- **AI + Cybersecurity:** $470 total value = $100 cash + 6-month Agentboxd Team plan + ProjectAAL credits. This is the only track with cash. ([Devpost overview](https://forgehacks-2026.devpost.com))
- Audience Favorite: 1 winner, certificate + recognition, public vote Oct 10–11. ([Devpost overview](https://forgehacks-2026.devpost.com))
- **Adaption adds +$1,000 in credits per member of "winning teams."** ([Adaption claim page](https://forgehacksandadaption.netlify.app/))
- Inconsistency: the Rules tab still says "Prize money amounts are currently TBD." ([Devpost rules](https://forgehacks-2026.devpost.com/rules))

### Perks: act today
- Devpost lists the perk bundle as a **per-participant** prize ($785.50 each, 1,193 "winners"): Adaption $500, Momen $100, n8n $65, Kariaa $40, YouCam $27.50, Featherless $25, Agentboxd $15, DevSwarm $8, ProjectAAL $5. That suggests **each teammate can claim their own set**, which would multiply the credits. Confirm in Discord. ([Devpost overview](https://forgehacks-2026.devpost.com))
- **Scarcity:** "Some codes are limited and first come, first served: n8n (first 300 redemptions), Agentboxd (first 800), YouCam API (first 1,000) and Kariaa (first 1,000)." With 1,247 registrants, **n8n will run out**, so redeem now. ([Devpost overview](https://forgehacks-2026.devpost.com))
- Tin Computer: "$299 in credits" Growth plan for "All Teams," but listed as **100 winners**, so it may only go to the first 100 teams. ([Devpost overview](https://forgehacks-2026.devpost.com))
- Perks are redeemed in the ForgeHacks Discord. ([Devpost overview](https://forgehacks-2026.devpost.com))

### Judges and mentors: who will read your README
Engineers and PMs from big companies. **No judge is a sponsor employee.** Judges: Aditya Shrivastava (SWE, Barclays), Sashank Agarwal (Sr Cloud/Infra Eng, NVIDIA), Prakshal Doshi (SRE, Apple), Eesha Tariq (AI Researcher, MIT Critical Data), Saylee Mhatre (Dir. Eng, Electronic Arts), Sharath Chandra Kampili (Staff Ent. Architect, Cockroach Labs), Dwijen Kirtania (Sr Staff SWE / AI Architect, Intuit), RatnaKumar Bonagiri (Staff Eng, Macy's), **Tamim Sangrar (Sr PM, AI Identity Governance, Microsoft)**, Aishwarya Kannoth Putlumbath (BA, AMD), Aditi Patodiya (Sr SWE, Amazon), Oleksandr Tkachenko (Sr SWE, Playtech), Pratik Ghawate (Sr Analytics Eng), Aman Goyal (AI Agent/AI PM, T-Mobile), Abdulrasaq Amolegbe (CoFounder/CEO, AgentStatus), Ivan Tesolkin (independent business consultant), Diksha Thakur (SWE, Reddit), Xihao Cao (Sr Data Scientist, Walmart Global Tech), Satya Veerendra Vegulla (Sr Eng Mgr, Enact Systems), **Ravi Shanker Thadishetti (Sr SWE, PayPal)**, Lucas Marinus (Commercial Lead, Parahelp), Nevasini Sasikumar (no affiliation listed). ([forgehacks.dev](https://www.forgehacks.dev/), [Devpost overview](https://forgehacks-2026.devpost.com))
- **One sponsor insider is on the mentor panel:** **Karthik Uppala, Founder, ProjectAAL.** Mentors may score submissions (see "Who scores" above). Other mentors come from U.S. Bank (incl. a Principal ML Engineer), Citi, Meta, T-Mobile, Cognizant, Cruze Maps and others. ([forgehacks.dev](https://www.forgehacks.dev/), [Devpost rules](https://forgehacks-2026.devpost.com/rules))
- Takeaway: the panel is dominated by fintech, payments and identity people (PayPal, Intuit, Barclays, U.S. Bank, Citi, Microsoft AI Identity), so they are well placed to judge a fraud or impersonation project credibly. ML-literate judges (NVIDIA, MIT, U.S. Bank ML) will spot a thin wrapper.

### Previous editions
- **None. This is the first edition:** "This is the first edition of ForgeHacks." ([forgehacks.dev](https://www.forgehacks.dev/)) There are no past winners to study, and the 2026 gallery is not public yet. It opens Oct 10 5 PM. ([Devpost gallery](https://forgehacks-2026.devpost.com/project-gallery), [forgehacks.dev](https://www.forgehacks.dev/)) The Devpost Resources tab is empty. ([Devpost resources](https://forgehacks-2026.devpost.com/resources))

---

## 2. Sponsor capability table

| Sponsor | What it is | Ships inside the product? | Integration | Demo-constraining limits |
|---|---|---|---|---|
| **Adaption** | Data optimization plus automated fine-tuning (Adaptive Data, AutoScientist) | Yes: datasets, and your own fine-tuned model weights | Python SDK `pip install adaption`, REST | SFT needs at least 1,000 rows; runs take hours; **no hosted inference** (download weights) |
| **Featherless** | OpenAI-compatible inference over ~22k–51k open HF models | Yes: the LLM brain (chat, vision, embeddings, TTS) | OpenAI SDK drop-in | Per-token on Developer terms; most models 32K context; cold-start 400s; no ASR |
| **YouCam API** | Perfect Corp beauty/skin/face/fashion vision APIs plus gen-image/video | Yes: vision features | Async REST (upload → task → poll / webhook), MCP | ≈500 units; 250 req per 5 min; files under 10 MB; result URLs expire after 2 h |
| **Agentboxd** | Email inboxes for AI agents, with per-message threat triage ("Customs") | Yes: inbound/outbound email plus security verdicts | TS SDK, REST, webhooks, WebSocket, MCP, n8n node | **During beta all workspaces run on Free limits** (3k emails, 1k AI triage calls/mo; 20 sends/day for first 3 days) |
| **n8n** | Visual workflow and agent orchestration | Yes: backend glue, hosted form/chat UI | No-code + JS/Python Code node | Pro: 10k executions/mo, 50 concurrent; Cloud Code node can't import libraries |
| **Momen** | No-code full-stack builder (DB, UI, workflows, AI agents); usable headless | Yes: whole app, or just the backend (GraphQL) | No-code; GraphQL + WebSocket | Free = 1 agent, 100k AI points (~115 summaries); 60 s AI timeout |
| **ProjectAAL** | AI prompt-to-React app builder | Builds the frontend; doesn't run in it | Web app only, no API; BYO OpenAI/Gemini key = $0 credits | 250 credits ≈ 5 app generations / 12 chats |
| **Kariaa** | WhatsApp/Telegram job-matching plus HR tools | No | **No developer API** | Unclear what $40 buys |
| **DevSwarm** | Desktop app that runs parallel AI coding agents in git worktrees | No: dev tool only | Install app | Real limit = your own LLM quota |
| **Tin Computer** | Growth/marketing agent (MCP) | No | MCP | Arrives post-event; irrelevant to the build |

---

## 3. Per-sponsor detail

### Adaption (largest credit, $500/person)
- **What it is:** Adaption Labs ("Adaption makes it easy to build your own frontier AI") sells two tools. **Adaptive Data** turns PDFs, spreadsheets or "half-scraped JSON" into clean training datasets "across 242 languages." **AutoScientist** "runs the training loop end to end … download the weights or push to Hugging Face or Kaggle." ([Adaption claim page](https://forgehacksandadaption.netlify.app/)) Co-founders are Sara Hooker and Sudip Roy. ([Tiny AutoScientist post](https://adaptionlabs.ai/blog/tiny-autoscientist))
- **API/SDK:** Install with `pip install adaption`. Create an API key in Settings and set `ADAPTION_API_KEY`. ([Getting started](https://docs.adaptionlabs.ai/introduction/getting-started/)) Endpoints:
  - datasets: create/upload, **invent** (generate a dataset from a prompt), adapt, augment, **translate, localize**, evaluate, download, publish
  - autoscientist: create, recommend_hyperparams, list_models, download

  ([Docs index](https://docs.adaptionlabs.ai/))
- **Adaptive Data features:**
  - Inputs: CSV, JSON, JSONL, Parquet, PDF, DOCX, PPTX, XLSX, HTML, ZIP and TXT, or a Hugging Face/Kaggle URL. ([Overview](https://docs.adaptionlabs.ai/adaptive-data/overview/))
  - Recipes: dedupe, rephrase and **reasoning traces**.
  - "Brand controls": length, safety categories, `hallucination_mitigation` (grounds with web search first), and a free-text `blueprint` system prompt. ([Configure](https://docs.adaptionlabs.ai/adaptive-data/configure-adaptive-data/), [FAQ](https://docs.adaptionlabs.ai/resources/faq/))
  - Quality evaluation returns **before/after scores (0–10), letter grades and improvement %**. ([Evaluate](https://docs.adaptionlabs.ai/adaptive-data/evaluate-dataset-quality/))
  - Unstructured docs (including scanned PDFs) can be split per document or per page. ([Unstructured tutorial](https://docs.adaptionlabs.ai/tutorials/processing-unstructured-documents/))
- **AutoScientist:**
  - Loop: augment data → SFT or SFT→DPO → evaluate vs. `target_win_rate` → adjust hyperparameters, for 1–5 iterations. ([Overview](https://docs.adaptionlabs.ai/autoscientist/overview/), [Running](https://docs.adaptionlabs.ai/autoscientist/running-autoscientist/))
  - Base models include Qwen3.5-0.8B/9B, Llama-3.2-3B, gemma-3-4b, Mistral-7B, gpt-oss-20b/120b, Llama-3.3-70B, plus **VLM variants** (gemma-3-4b/27b-VLM, gemma-4-31B-VLM). Most need **at least 1,000 rows**; some large models need 10,000; **DPO needs 12,000 pairs**. ([Supported models](https://docs.adaptionlabs.ai/autoscientist/supported-models/))
  - The output is a LoRA checkpoint `.tgz` you **download and host yourself**. "The weights are yours to download and deploy anywhere." ([Download](https://docs.adaptionlabs.ai/autoscientist/download-the-model/), [AutoScientist API post](https://adaptionlabs.ai/blog/autoscientist-api))
  - The SDK's `wait_for_completion` has a 4-hour default timeout, so budget **hours per run**. ([Running](https://docs.adaptionlabs.ai/autoscientist/running-autoscientist/))
- **Credit limits:** No public price list (`/pricing` returns 404). Every call accepts `estimate=True` and returns estimated credits **without charging**, so use that to budget. ([Invent](https://docs.adaptionlabs.ai/adaptive-data/invent-a-dataset/), [FAQ](https://docs.adaptionlabs.ai/resources/faq/)) "Credits don't expire." ([claim page](https://forgehacksandadaption.netlify.app/))
- **Non-obvious, judge-visible uses:**
  1. **Train a small, owned specialist model.** Example: a 0.8B–4B scam-message or health-leaflet explainer. Use `invent` to generate the training set, AutoScientist to fine-tune, and show the **base-vs-adapted win-rate chart** in the README. That directly answers "not just a wrapper." Run it locally or on-device for a privacy angle.
  2. **Use Adaptive Data as a pipeline, not for training.** Turn messy PDFs into a grounded, multilingual Q&A corpus with `translate`/`localize` and `hallucination_mitigation`. Show the before/after quality scores as evidence.
- **Caution:** The claim page is a Netlify page that posts to a Google Form, not an adaptionlabs.ai page. It only asks for your registration email. ([page source](https://forgehacksandadaption.netlify.app/))

### Featherless AI ($25)
- **What it is:** Inference with "One OpenAI-compatible endpoint and the full catalogue on every plan" over "40,000+ open models." ([pricing](https://featherless.ai/pricing)) Base URL is `https://api.featherless.ai/v1`. ([quickstart](https://featherless.ai/docs/quickstart-guide))
- **Plans:**
  - **Chat $25/mo:** flat, 32K context, 4 concurrent units. It is "limited to human typed interactive chat use only," which **excludes app or API traffic**.
  - **Developer, from $50/mo:** per-token billing, up to 256K context, 100 concurrent units. Credits roll over, and calls are blocked at a $0 balance.

  ([pricing](https://featherless.ai/pricing), [billing](https://featherless.ai/docs/billing), [plans](https://featherless.ai/docs/plans)) How the $25 sponsor credit is applied is undocumented, so assume a per-token balance.
- **Prices, per million tokens in/out:** Qwen3-8B $0.117/$0.455; Llama-3.1-8B $0.20/$0.32; gemma-3-4b $0.05/$0.10; Qwen3-VL-8B $0.18/$1.35; DeepSeek-V4-Flash $0.14/$0.28 at 262K context. That makes $25 ≈ 50–100M+ tokens on small models. ([/v1/models](https://api.featherless.ai/v1/models))
- **Concurrency:** models under 16B use 1 unit, under 34B use 2, 70B+ use 4. Over the limit returns 429. ([concurrency](https://featherless.ai/docs/concurrency-limits))
- **Endpoints:** chat/completions, completions, **embeddings** (Qwen3-Embedding 0.6/4/8B), **audio/speech** (8 TTS models incl. Kokoro and Orpheus), tokenize, and a classifier API. ([docs](https://featherless.ai/docs), [embeddings](https://featherless.ai/docs/embeddings), [TTS](https://featherless.ai/docs/audio-speech))
- **Vision:** 737 models, e.g. Qwen3-VL-8B and gemma-4-31B, take `image_url` input. ([vision](https://featherless.ai/docs/vision))
- **Not available:** speech-to-text and image generation.
- **Tool calling:** native only on Kimi-K2 and the Qwen3 family. ([tool-calling](https://featherless.ai/docs/tool-calling))
- **Streaming is not documented**, so test it.
- **Context reality:** most models are served at 32K and about 7.5k at 8K or less. Mistral-7B-v0.3 is at 4K. Only about 33 large models reach 200K or more. ([/v1/models](https://api.featherless.ai/v1/models))
- **Cold starts:** a cold model returns 400 and takes about 5 min (small) to 1 h (large) to warm. A 503 means no capacity. **Use "warm" models.** ([errors](https://featherless.ai/docs/api-reference-error-codes))
- **Licence gates:** Llama/Gemma gated models return 403 until you accept the licence.
- **Privacy:** "does not log chats, prompts, or completions." ([privacy](https://featherless.ai/docs/privacy-and-logging))
- **Serving your own fine-tune:**
  - Requirements: public Hugging Face repos with 100+ downloads appear automatically; otherwise request via email or Discord. Weights must be **merged full weights, "not LoRA or QLoRA"**, in safetensors FP16. ([compatibility](https://featherless.ai/docs/model-compatibility))
  - Consequence: an Adaption LoRA must be merged before upload, and onboarding time is undocumented. **Don't plan on Featherless hosting it within the week.**
- **Integration:** OpenAI SDK swap. There are official guides for LangChain, LlamaIndex, LiteLLM and n8n. ([guides](https://featherless.ai/docs/application-guides))
- **Non-obvious use:** a cheap "model jury" of 3 model families (1 unit each) plus a classifier model, cross-checking a verdict. Or whole-document analysis on DeepSeek-V4-Flash at 262K context (≈$0.035 per 250K-token prompt).

### YouCam API / Perfect Corp ($27.50; first 1,000 redemptions)
- **What it is:** A REST catalogue of beauty, face, fashion and generative vision APIs, with an MCP integration. ([AI API](https://yce.perfectcorp.com/ai-api), [docs](https://docs.perfectcorp.com/develop/introduction))
- **Every API listed:**
  - **Health-adjacent:** AI Skin Analysis (14 skin concerns, "dermatologist-verified"), Skin Simulation, **Fitzpatrick Skin Type** (I–VI UV response), Facial Color Tones, Face Attributes & Ratio Analyzer (50+ attributes, 11 ratios), and hair analysis (Type, Length, **Frizziness 4-degree**, **Density 4-grade**).
  - **Face/body edits:** Face Lift, Face Reshape, Body Reshape, Breast Augmentation Simulator, Smile, Teeth Whitening, Abs.
  - **Hair try-on:** color, hairstyle, extension, bangs, volume, wavy, beard.
  - **Makeup:** transfer, try-on, look, nail transfer/try-on, eye-color lens.
  - **Fashion/jewelry try-on:** clothes, fabric, bag, scarf, shoes, hat, ring, bracelet, earrings, watch, necklace.
  - **Photo:** image generator (text/image-to-image), enhance, replace, object removal, colorize, extender, lighting, color correction, background remove/change/blur, **Face Swap**.
  - **Avatars/headshots:** headshot, avatar, studio, watermark removal.
  - **Video:** generator (image-to-video), enhancer, **Video Face Swap**, style transfer, background replace, object removal.

  ([AI API](https://yce.perfectcorp.com/ai-api))
- **Not offered:** lip-sync/talking avatars, and any scalp or hair-loss API beyond Hair Density.
- **Pricing:** pay-as-you-go is **$27.50 = 500 units** ($0.055/unit), valid for 1 year, so the perk is most likely exactly 500 units. Failed tasks cost nothing. ([pricing](https://yce.perfectcorp.com/ai-api/api-pricing), [docs](https://docs.perfectcorp.com/reference/makeup_vto)) Units per call:
  - **Skin Analysis:** 9–16 units (SD) or 12–22 units (HD), depending on the number of concerns.
  - **Other analysis:** Fitzpatrick 10, Face Attributes 10–30, Facial Color Tones 20.
  - **Hair detection:** 1–2 units.
  - **Image edits:** 1 unit for most edits, including background removal and Face Swap; 2 for clothes try-on.
  - **Video:** Video Face Swap 1 unit per 5 s; image-to-video 1–3 units per second.

  ([pricing](https://yce.perfectcorp.com/ai-api/api-pricing))
- **Health-adjacent outputs:**
  - Skin Analysis covers acne, wrinkles, pores, redness, oiliness, moisture, age spots, dark circles, eye bags, firmness, texture, radiance, tear trough, droopy eyelids and skin type.
  - It returns a `raw_score` (1–100), a `ui_score` that is deliberately adjusted upward, `skin_age`, an overall score, and **PNG masks** for overlays. ([skin docs](https://docs.perfectcorp.com/reference/ai_skin_analysis/section/overview/inputs-and-outputs))
  - Hair Density is a 4-level "trichoscopy-inspired" score. ([docs](https://docs.perfectcorp.com/reference/ai_hair_density_detection))
  - **No medical disclaimer was found in the docs or API terms**, so add your own. ([API ToS](https://www.perfectcorp.com/perfectbeauty/youcam/terms-of-service-api))
- **API shape:**
  - Async REST at `yce-api-01.makeupar.com` with a Bearer key: `POST /s2s/v2.0/file` → `POST /s2s/v2.0/task/<feature>` → poll, or use signed webhooks. ([quick start](https://docs.perfectcorp.com/develop/quick_start_guide), [webhook](https://docs.perfectcorp.com/develop/webhook))
  - Rate limit: 250 requests per 300 s. ([rate limit](https://docs.perfectcorp.com/develop/rate_limit))
  - Files must be under 10 MB. Skin HD needs a short side of at least 1080 px.
  - **Result URLs expire after 2 h.** ([retention](https://docs.perfectcorp.com/develop/file_retention_period))
  - No language SDKs and no real-time AR SDK. The JS Camera Kit only does guided capture, and analysis stays server-side. ([camera kit](https://docs.perfectcorp.com/reference/ai_skin_analysis/section/overview/js-camera-kit))
- **ToS warning:** the terms ban using the service "to create datasets to train neural networks" (clause 8.6(t)). ([API ToS](https://www.perfectcorp.com/perfectbeauty/youcam/terms-of-service-api))
- **Non-obvious uses:**
  - **Cybersecurity:** use Face Swap / Video Face Swap to generate deepfakes for a **live red-team demo or evaluation set** of an impersonation-verification flow. Evaluation only, not training (ToS).
  - **Healthcare:** a non-diagnostic skin/hair diary that tracks masks and `raw_score` over time, with an LLM explaining the changes and **results stratified by Fitzpatrick type** as a bias audit.

### Agentboxd ($15 Builder; first 800 redemptions; Cyber prize sponsor)
- **What it is:** "Real email for AI agents." Agents get addresses on homingbox.net "with one API call." ([agentboxd.com](https://agentboxd.com/))
- **API:**
  - REST at `https://api.agentboxd.com` with a Bearer key. ([API docs](https://agentboxd.com/docs/api))
  - Inboxes: create, list and pause/resume (a kill switch). **Temporary inboxes** delete themselves after a TTL of 60 s–24 h. ([API docs](https://agentboxd.com/docs/api))
  - Messages: send/reply, long-poll `messages/wait`, threads, search, raw MIME.
  - Attachments: OCR text extraction (up to 200k characters) and schema-based structured extraction.
  - Drafts and scheduled sends; a claim/ack work queue. ([API docs](https://agentboxd.com/docs/api))
  - Webhooks are HMAC-signed, with 8 retries over about 24 h. ([webhooks](https://agentboxd.com/docs/webhooks)) There is also a WebSocket `/v1/stream` with 1 h replay.
  - SDKs: TypeScript `npm i agentboxd` ([npm](https://registry.npmjs.org/agentboxd/latest)). The Python SDK is **not on PyPI** yet. ([python-sdk](https://agentboxd.com/docs/python-sdk))
  - MCP: `npx -y @agentboxd/mcp` (48 tools) or hosted with OAuth. ([mcp](https://agentboxd.com/docs/mcp))
  - An **n8n community node** whose trigger exposes the risk fields. ([GitHub](https://github.com/agentboxd/n8n-nodes-agentboxd))
- **Threat signals are fully exposed:**
  - Each message carries `ai.risk.injection` and `ai.risk.phishing` (0–1), `ai.needs_human`, `ai.urgency`, `ai.category` with confidence, and `ai.verification` (the code or magic link).
  - Labels are added at fixed cut-offs (≥0.8 injection/phishing, ≥0.7 needs-human), and the raw scores are kept, so you can set your own thresholds. ([API docs](https://agentboxd.com/docs/api), [Customs](https://agentboxd.com/customs))
  - Scores arrive seconds later, via a separate `message.enriched` webhook. ([webhooks](https://agentboxd.com/docs/webhooks))
  - It also detects SPF/DKIM/DMARC failures and viruses.
  - The classifier is "JEV" from TypeSafe AI. It has only been checked on English, has no published accuracy, and Agentboxd calls it "not a guarantee." ([JEV post](https://agentboxd.com/blog/classifying-inbound-email-for-ai-agents-jev), [Customs](https://agentboxd.com/customs))
  - Content is wrapped as "UNTRUSTED MESSAGE CONTENT." ([agentboxd.com](https://agentboxd.com/))
- **Plans:**

  | | Free | Builder ($15) | Team ($60) |
  |---|---|---|---|
  | Inboxes | 10 | 100 | 1,000 |
  | Emails/month | 3k | 25k | 150k |
  | AI triage calls/month | 1k | 25k | 150k |

  - **During the beta every workspace runs on Free limits.** Email hello@agentboxd.com to have them raised.
  - New workspaces can send only **20 emails a day for their first 3 days**.
  - When the quota runs out, sends fail with a 402 error **and AI scoring pauses**, which would kill the demo.
  - The startups/hackathon page says **Builder for 3 months**, not 1.

  ([pricing](https://agentboxd.com/pricing), [startups](https://agentboxd.com/startups))
- **Maturity:** the GitHub repo has 0 stars and 2 commits, so this is very new. ([GitHub](https://github.com/agentboxd/agentboxd))
- **Non-obvious uses:**
  - A **"forward-me-the-suspicious-email" inbox** for elderly or student users. Agentboxd's verdicts plus your own LLM explanation feed a plain-language reply, sent via a human-approved draft.
    - Caveat: forwarding replaces the original sender's SPF/DKIM results. Have users forward the email as an attachment and parse it via `/raw`.
  - A **live red-team console** for judges. Fire Agentboxd's own six injection attacks (hidden text, buried thread history, borrowed authority, data request, action by link, plain instruction) and show the scores next to whether the agent was fooled. ([injection test](https://agentboxd.com/blog/prompt-injection-test-for-agent-inboxes))
  - A **honeypot of temporary inboxes** that charts incoming phishing scores over time.

### n8n (1 month Cloud Pro; first 300 redemptions)
- **What it is:** Visual automation with LangChain AI nodes. The AI Agent (tools agent) supports structured output and streaming. ([docs](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/))
- **Relevant AI nodes:**
  - Text Classifier, Information Extractor, Sentiment, Summarization. ([docs](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.text-classifier))
  - **Guardrails** checks for jailbreak, PII, secrets, topic and URLs. ([docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.guardrails.md))
  - **Human approval before tool calls**. ([docs](https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/))
  - MCP Server/Client.
  - Hosted **Chat Trigger** and **Form Trigger** UIs. ([chat](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chattrigger/), [form](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger.md))
  - Metric-based evaluations (Pro). ([docs](https://docs.n8n.io/advanced-ai/evaluations/metric-based-evaluations/))
- **Pro plan:** €50/mo, 10K executions/mo, unlimited active workflows, up to 50 concurrent executions. ([pricing](https://n8n.io/pricing/)) The Cloud Code node can't import npm modules beyond `crypto`/`moment`, and Python can't import libraries. ([docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code.md)) Model calls need your own keys; the included Assistant credits are only for n8n's builder assistant. ([docs](https://docs.n8n.io/deploy/use-n8n-cloud/assistant-credits))
- **Non-obvious use:**
  - Wire Agentboxd webhook → Guardrails → Classifier → Featherless agent → human-approved reply.
  - Show the live execution canvas in the demo video as the architecture diagram.

### DevSwarm (1 month Pro)
- Desktop app that runs 19 coding agents (Claude Code, Codex, Gemini, Copilot, Cursor CLI…) in parallel, branch-isolated workspaces. Pro ($8/mo) adds in-app GitHub PR review and removes ads. "Students get Pro for free" with a .edu email. ([pricing](https://devswarm.ai/pricing), [how it works](https://github.com/devswarm-ai/devswarm/blob/main/docs/how-it-works.md))
- It is a dev tool only, with no product API. ([GitHub](https://github.com/devswarm-ai/devswarm))
- **Visible use:** one PR per feature built in parallel workspaces, with screenshots in the README. That is process evidence for "how much was actually shipped."

### ProjectAAL ($5 / 250 credits; founder is a mentor)
- Prompt-to-React/TypeScript full-stack app builder. It has a "Clone V2" URL-to-app engine, Git, one-click deploy to Vercel/Netlify, BYO OpenAI/Gemini keys, and per-file "receipts" showing which model, tokens and cost. ([projectaal.com](https://projectaal.com/))
- It is a web app only: **no public API or MCP**. ([docs](https://projectaal.com/docs))
- **Credits:**
  - The site's own ratio is 150 credits ≈ 7 conversations or 3 app generations, so 250 ≈ 12 conversations or 5 generations.
  - Using your own key costs $0 in credits.
  - Credits from failed builds are not refunded automatically.

  ([pricing](https://projectaal.com/pricing), [FAQ](https://projectaal.com/faq))
- The student discount accepts **.edu emails only**, so it won't work with .ac.uk addresses. ([pricing](https://projectaal.com/pricing))
- **Visible use:** scaffold the frontend with it and export the receipts CSV as an AI-provenance audit trail. Karthik Uppala (Founder) is a mentor. ([forgehacks.dev](https://www.forgehacks.dev/))

### Kariaa ($40)
- Job matching over WhatsApp/Telegram, plus HR/rota tools for employers and the "DataHouse" paid-task marketplace. ([kariaa.com](https://www.kariaa.com/), [DataHouse](https://www.kariaa.com/datahouse))
- **No developer API, docs, pricing or credit system is published**: `/api`, `/docs` and `/pricing` return 404, and none appear in the sitemap or llms.txt. ([sitemap](https://www.kariaa.com/sitemap.xml), [FAQ](https://www.kariaa.com/faq)) What $40 buys is **not verified**.
- **Cyber angle:** its group bot's `/kariaa check <posting>` command flags **job-scam** markers: upfront fees, contact only through messaging apps, requests for ID or bank details before an offer, and urgency. It works only inside Telegram, Discord or Slack groups, with no API. ([communities](https://www.kariaa.com/communities))

### Momen ($100)
- **What it is:** an all-in-one no-code builder (database, UI, workflows, AI agents) that can also be used **headless as a backend**. ([momen.app](https://momen.app/))
- **AI agents:**
  - Inputs: text, image, video and PDF.
  - Outputs: streamed text or **structured output with your own schema**.
  - "Contexts" act as retrieval (RAG) over database tables or APIs.
  - Agents can call Actionflows and APIs as tools.
  - Bring your own model (OpenAI or self-hosted).
  - **Every AI request times out after 60 s.**

  ([AI docs](https://docs.momen.app/actions/ai/overview/))
- **Headless use:** PostgreSQL behind a GraphQL API with real-time WebSocket subscriptions, and guest/user/admin tokens. ([headless docs](https://docs.momen.app/docs/developers/headless/))
- **Plans** ([pricing](https://momen.app/pricing)):
  - Free: 1 agent, preview only, 20 MB DB, 100k AI points/mo (roughly 115 budget-model summaries).
  - Basic: $33/project/mo, billed annually.
  - Pro: $85/project/mo, billed annually; required for payments.
- **[kit.momen.cloud](https://kit.momen.cloud/)** is an "Event code" page that unlocks workshop material and a reward code. You redeem the code in the Momen Wallet and upgrade a project with it. This comes from the page's JS; I didn't redeem anything.
- **Visible use:** a real-time backend for a "live threat feed" UI, with agent verdicts stored as structured JSON fields.

### Tin Computer (post-event)
- An Apache-2.0 growth/marketing agent delivered as an MCP server. "Unlimited Growth" costs $299/mo; there is no plan named just "Growth." ([pricing](https://tin.computer/pricing), [GitHub](https://github.com/tin-computer/tin)) The credit arrives after the event, so it doesn't matter for the build.

---

## 4. Best-leverage shortlist
1. **Agentboxd, in the AI+Cybersecurity track.** It is the only cash track prize and is *sponsored by Agentboxd*. Its exposed injection/phishing scores and human-approval drafts give a judge-visible security layer. The judges include PayPal, Intuit, Barclays, U.S. Bank and Microsoft AI-Identity people. **Risk:** the beta Free limits (1k triage calls/mo, slow sends for the first 3 days). Redeem and email the sponsor today.
2. **Adaption, used for real fine-tuning.** It is the biggest credit and gives winners +$1,000 per member. A small owned model with a base-vs-adapted win-rate chart is the strongest available answer to "not just a wrapper." Watch the 1,000-row minimum and the multi-hour runs. **You must host the weights yourself**: Featherless only serves merged weights from public HF repos with 100+ downloads, so plan local or Hugging Face hosting. Start a run by **Oct 6–7**.
3. **Featherless** as the cheap LLM backbone (multi-model jury). **n8n** as visible orchestration plus a free hosted UI.
4. **YouCam Face/Video Swap** as a deepfake red-team or evaluation generator for Cyber (not for training, per the ToS). Or skin/Fitzpatrick analysis for Healthcare, non-diagnostic, with ≈22 HD analyses in the budget.
5. **Kariaa's `/kariaa check` job-scam heuristics** as an expert baseline to compare against, if you pick a job-scam Cyber angle. It is a bot only, with no API.
6. **ProjectAAL:** its founder is a mentor who may score, so cheap goodwill comes from using it for scaffolding and showing its receipts.

## 5. Open questions / couldn't verify
- Can **each teammate** claim the full perk bundle (Devpost lists it per participant)? Is Tin Computer limited to the first 100 teams?
- Featherless: how the $25 sponsor credit is applied (per-token balance vs the Chat plan, which forbids API use). Whether streaming works. How long onboarding a merged Adaption fine-tune would take.
- YouCam: the skin-analysis page says results are kept 24 h, which conflicts with the 30-day file retention. The Aging Simulation cost is 1 or 2 units, depending on the page.
- Adaption: dollars-to-credits rate and cost per AutoScientist run. Use `estimate=True` after the credits land.
- YouCam: units per call and the $ value of a unit. Response format of skin analysis (scores/masks).
- Agentboxd: does the ForgeHacks code lift the beta Free limits (1k AI triage calls/mo; 20 sends/day for the first 3 days)? Is it 1 month or 3 months of Builder? Ask hello@agentboxd.com or Discord **before** building on it.
- Kariaa: what $40 buys (there's no public API). Momen: the dollars-to-AI-points mapping for the $100 credit.
- Devpost rules say prizes "TBD" while the overview lists amounts. The 20% weights come only from the packet.
- Do mentors (including the ProjectAAL founder) actually score? The rules say "a panel of mentors and industry/academic judges will score."
