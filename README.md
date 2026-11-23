# OneAtlas — AI Model Discovery & Intelligence Platform

> **Live Product Demo & Evaluation Submission for AI Software Engineer Internship**  
> Role: **Frontend Engineer**  
> Reference Platforms: [OpenRouter](https://openrouter.ai/), [RouterPlus](https://routerplus.com/), [LiteLLM](https://www.litellm.ai/)

---

## 🚀 Overview

**OneAtlas** (`https://oneatlas.dev/`) is a unified AI model discovery and intelligence platform designed for developers, AI engineers, and researchers. It bridges the gap between frontier foundation models, specialized inference providers, and developer workflows by providing real-time model telemetry, benchmark evaluations, transparent multi-provider pricing, and side-by-side comparison matrices.

---

## 🛠️ Mandatory Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18, TypeScript, Tailwind CSS
- **Motion & Animations**: Framer Motion (spring transitions, layout animations, floating comparison dock)
- **Icons**: Lucide React
- **State Management**: Zustand with persistent storage (`localStorage`)
- **Database & Data Layer**: Prisma ORM (`prisma/schema.prisma`), PostgreSQL schema with zero-config standalone DataService
- **Backend & APIs**: Next.js Route Handlers (`/api/models`, `/api/compare`, `/api/benchmarks`, `/api/labs`, `/api/providers`, `/api/calculate`)
- **Deployment Ready**: Vercel, Neon, Railway, Render, Cloudflare

---

## ✨ Core Features & Product Experience

### 1. Model Discovery & Search (`/`)
- **Global Search**: Search instantly across model names, organizations, architectures, and descriptions.
- **Multi-Faceted Filtering**:
  - **Category**: Multimodal, Reasoning, Text Only, Code Specialist.
  - **Weights**: Open Weights vs Proprietary.
  - **AI Labs**: Anthropic, OpenAI, Google DeepMind, Meta AI, DeepSeek, Mistral, xAI, Alibaba Qwen.
  - **Inference Providers**: OpenRouter, Groq LPU, Fireworks AI, Together AI, AWS Bedrock, Azure AI Foundry.
  - **Modalities**: Text, Vision, Audio, Code.
  - **Capabilities**: Deep Reasoning, Tool/Function Calling, Structured JSON Output, 1M+ Long Context, Real-time Web Search.
  - **Range Sliders**: Maximum input price ($/1M tokens) and minimum context window slider.
- **Dual View Modes**:
  - **Interactive Card Grid**: Visual gauges, badges, provider chips, and quick comparison toggles.
  - **Dense Table View**: Power user table with sortable columns, throughput metrics, and sparkline context indicators.
- **Sorting Options**: Trending & Usage, Highest Arena Elo, Highest MMLU-Pro, Price (Low to High), Price (High to Low), Largest Context Window, Newest Releases.

### 2. Model Detail Pages (`/models/[slug]`)
- **Comprehensive Overview**: Architectural notes, release timeline, license classification, and organization badge.
- **Transparent Multi-Provider Matrix**: Table comparing latency (P50 and P95), throughput (tokens/second), uptime SLA (99.9%), and input/output pricing per provider.
- **Benchmark Evaluations**: Progress bars and category rankings for Chatbot Arena Elo, MMLU-Pro, HumanEval (Python), SWE-bench Verified, and MATH-500.
- **Capabilities Matrix**: Verified feature checklists for tool calling, JSON schema, reasoning, and context processing.
- **Developer Integration Hub**: Tabbed code snippets for **LiteLLM**, **Universal cURL**, **Python (OpenAI SDK)**, **Node.js (OpenAI SDK)**, and **Next.js (Vercel AI SDK)** with one-click copy.
- **Model Cost Simulator**: Embedded token usage slider tuned specifically to the selected model.

### 3. Model Comparison Matrix (`/compare`)
- **Side-by-Side Comparison**: Compare 2 to 4 models across 15+ dimensions simultaneously.
- **Highlight Best Specs**: One-click toggle that automatically highlights the winning value (lowest input/output price, largest context window, highest benchmark score, highest throughput).
- **Quick Comparison Presets**:
  - *Reasoning Titans*: Claude 3.7 Sonnet vs OpenAI o1 vs DeepSeek R1
  - *Cost Disruptors*: DeepSeek V3 vs Gemini 2.0 Flash vs Llama 3.3 70B
  - *Coding Champions*: Claude 3.5 Sonnet vs Claude 3.7 Sonnet vs Codestral
- **Shareable URLs**: Compare state automatically synced to query parameters (e.g. `/compare?models=claude-3-7-sonnet,o1,deepseek-r1`).

### 4. Floating Comparison Dock (`CompareTray`)
- Persistent floating dock at the bottom of the screen.
- Smooth spring entry/exit animations powered by Framer Motion.
- Add or remove models with one click from any card or table row.
- Shows thumbnail pills, pricing, and count badge with minimize/expand controls.

### 5. Rankings & Leaderboards (`/rankings`)
- Empirical leaderboards sorted by **Chatbot Arena Elo**, **MMLU-Pro**, **HumanEval**, **SWE-bench Verified**, **MATH-500**, or **Cost Efficiency (Elo per $)**.
- Filterable by Open Weights vs Proprietary.
- Visual ranking podium with gold, silver, and bronze badges.

### 6. AI Labs Directory (`/labs` & `/labs/[slug]`)
- Directory of AI research companies and labs.
- Metadata: bio, headquarters, founding year, verified badge, and cataloged model counts.
- Dedicated lab page showing their entire foundation model family.

### 7. Inference Provider Directory (`/providers` & `/providers/[slug]`)
- Directory of inference providers and cloud routing engines.
- Telemetry profiles: P50 latency, throughput (tok/s), uptime, regions, and compliance standards (SOC2 Type II, HIPAA, GDPR).

### 8. Interactive Token Cost Simulator (`/calculator`)
- Interactive sliders for monthly input and output tokens.
- Instant recalculation of monthly bills across all 17 models.
- Highlights savings when switching to open-weights or cost-disruptive models.

### 9. Interactive Model Sandbox (`PlaygroundModal`)
- Launchable from any card, table row, or navigation header.
- Simulates real-time token streaming at realistic model speeds (e.g., Groq at 420 tok/s vs Claude at 88 tok/s).
- Live telemetry indicators: Time to first token, elapsed generation time, generated token count, and computed prompt/completion cost in USD.

### 10. Command Palette (`Cmd+K` / `Ctrl+K`)
- Fast keyboard-driven command center.
- Fuzzy search models, AI labs, providers, and quick actions with keyboard navigation (arrows, Enter, Esc).

---

## 🔌 API Endpoints Reference

All application data is served through standard RESTful Next.js API route handlers:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/models` | `GET` | Filter, search, and sort all indexed AI models with facet counts |
| `/api/models/[slug]` | `GET` | Get full specifications, benchmarks, and providers for a model |
| `/api/compare?models=...` | `GET` | Side-by-side comparison with calculated best-value diffs |
| `/api/benchmarks?metric=...` | `GET` | Leaderboard rankings across benchmark metrics |
| `/api/labs` | `GET` | AI labs and research organizations directory |
| `/api/labs/[slug]` | `GET` | Lab detail and full catalog of models |
| `/api/providers` | `GET` | Inference cloud providers and telemetry specs |
| `/api/providers/[slug]` | `GET` | Provider detail and supported models |
| `/api/calculate` | `POST` | Calculate monthly token spend across all models |

---

## 📦 Getting Started Locally

### Prerequisites
- Node.js 18+ or 20+ (Node v22.19.0 recommended)
- npm or pnpm

### 1. Installation
```bash
git clone <your-repo-url>
cd oneatlas
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm start
```

---

## 📹 Loom Video Walkthrough Guide (5–10 Minutes)

1. **Introduction (1 min)**:
   - Introduce yourself, the selected role (**Frontend Engineer**), and the objective: building **OneAtlas** inspired by OpenRouter, RouterPlus, and LiteLLM.
2. **Product Architecture (1.5 min)**:
   - Walk through the Next.js 14 App Router structure, TypeScript typing, Tailwind CSS design system, and Zustand state management.
   - Show `prisma/schema.prisma` and explain how the database schema and API routes power the frontend data cleanly without hardcoding.
3. **Core Features Demo (4-5 min)**:
   - **Model Discovery**: Search, multi-facet filtering (labs, providers, reasoning, open weights), price slider, and switching between Card Grid and Dense Table views.
   - **Floating Compare Tray & Comparison Matrix (`/compare`)**: Add models to the drawer, slide up, navigate to compare, toggle "Highlight Best Specs", and show preset comparisons.
   - **Model Detail Page (`/models/[slug]`)**: Walk through Claude 3.7 Sonnet or DeepSeek R1, the multi-provider latency table, verified benchmarks, and the 5-tab developer code snippet generator.
   - **Rankings & Leaderboard (`/rankings`)**: Toggle Chatbot Arena Elo, MMLU-Pro, and Cost-Efficiency (Elo per dollar).
   - **Command Palette (`Cmd+K`)**: Quick fuzzy jump to models and providers.
   - **Interactive Playground**: Test a prompt and show live streaming token simulation with latency and cost telemetry.
   - **Token Cost Calculator (`/calculator`)**: Adjust sliders to demonstrate infrastructure cost estimation.
4. **Engineering Challenges & Technical Decisions (1.5 min)**:
   - Discuss handling fast client-side filtering while syncing state with URL parameters for shareability.
   - Discuss performance considerations (memoization, component modularity, fluid animations with Framer Motion).
   - Conclude with potential future extensions (real LLM API key proxying, custom router fallbacks).
