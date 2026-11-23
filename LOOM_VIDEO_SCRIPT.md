# OneAtlas — Complete Loom Video Presentation Script
**Author:** Vidhi Yadav  
**Role:** Frontend Engineer  
**Project:** OneAtlas AI Model Discovery & Intelligence Platform  
**Target Duration:** 6 to 8 minutes  

---

## 🎬 Screen Setup Checklist Before Recording

1. **Browser Tab 1:** `http://localhost:3000` (or your live deployed Vercel URL).
2. **Browser Tab 2:** Your GitHub repository: `https://github.com/VidhiYadav13/oneatlas`.
3. **Editor / IDE:** VS Code / Antigravity with `oneatlas` open.
4. **Loom Settings:** Screen + Camera (circle in bottom corner). Turn on microphone and ensure your audio is clear.

---

## ⏱️ Minute-by-Minute Walkthrough & Word-for-Word Script

---

### **0:00 – 1:00 | Introduction & Project Motivation**
**Screen to Show:** OneAtlas Homepage (`/`) with Hero Section visible.

> *"Hi everyone, my name is Vidhi Yadav, and today I’m presenting **OneAtlas**, an AI model discovery and intelligence platform that I built for this internship evaluation task.*
>
> *I chose **Role 1 — Frontend Engineer**, focusing on UI architecture, reactive state management, responsive design, fluid micro-animations, and end-to-end product experience.*
>
> *Before building, I studied the reference platforms: **OpenRouter** for its comprehensive catalog and routing ecosystem, **RouterPlus** for performance and latency trade-offs, and **LiteLLM** for unified developer proxy specifications. My goal was to synthesize these workflows into a cohesive, high-performance web experience for engineers and researchers evaluating frontier LLMs."*

---

### **1:00 – 2:30 | Model Discovery, Multi-Faceted Filtering & Dual Views**
**Screen to Show:** Scroll slightly to the Catalog section. Interact with the Filter Sidebar.

> *"Let’s look at the core **Model Discovery** experience.*
>
> *On the left, we have a multi-faceted filter sidebar built with instant reactive updates:*
> - *We can filter across categories like **Multimodal**, **Deep Reasoning**, **Text-Only**, or **Code Specialists**.*
> - *We have instant filters for **Open Weights** versus **Proprietary** models.*
> - *We can filter by research labs like **Anthropic, OpenAI, DeepSeek, Meta, and Google**, as well as specific inference clouds like **Groq, Together AI, and Fireworks**.*
> - *We also have capability checklists—for example, filtering models that support native **Tool Calling**, **Structured JSON**, or **1M+ Long Context**.*
> - *And we have interactive range sliders for **Maximum Input Price** and **Minimum Context Window**.*
>
> *(Click the view toggle icon)*  
> *For power users and data-dense workflows, I implemented a **Dual-View System**: users can toggle between this **Visual Card Grid** and a **Dense Table View**, complete with latency indicators, throughput metrics, and context sparklines, similar to Airtable and OpenRouter."*

---

### **2:30 – 3:45 | Floating Compare Drawer & Comparison Matrix (`/compare`)**
**Screen to Show:** Click the Compare button on 2 or 3 cards (e.g. Claude 3.7 Sonnet, OpenAI o1, DeepSeek R1). Watch the drawer slide up. Then click "Compare Models".

> *"Next is one of the centerpiece features: the **Model Comparison Workflow**.*
>
> *Notice that whenever I select a model, this floating **Compare Drawer** slides up smoothly from the bottom using **Framer Motion spring physics**. It persists across navigation and lets users queue up to 4 models from anywhere on the platform.*
>
> *(Click 'Compare Models' button to navigate to `/compare`)*  
> *Here on the `/compare` page, we have a comprehensive side-by-side matrix:*
> - *We compare token pricing, context limits, maximum output tokens, verified benchmark scores, throughput, and supported modalities.*
> - *(Toggle the 'Highlight Best Specs' switch)*: *Notice this dynamic toggle that automatically identifies and highlights the best specifications in green—such as the lowest input price ($0.55/M on DeepSeek R1) or the highest Arena Elo (Claude 3.7 Sonnet at 1385).*
> - *We also built quick preset buttons—like 'Reasoning Titans' or 'Cost Disruptors'—and full URL query parameter syncing so engineers can easily share comparison links with teammates."*

---

### **3:45 – 5:00 | Deep-Dive Model Detail Page (`/models/[slug]`)**
**Screen to Show:** Click on **Claude 3.7 Sonnet** to open `/models/claude-3-7-sonnet`.

> *"Now let's examine a **Model Detail Page**.*
>
> *Here on the Claude 3.7 Sonnet page, we provide deep technical transparency:*
> 1. *First, the **Multi-Provider Inference Matrix**: instead of showing one generic price, we list actual hosting providers—like OpenRouter and AWS Bedrock—along with their verified **P50 and P95 latency percentiles**, **throughput in tokens per second**, and uptime SLA.*
> 2. *Second, empirical **Benchmark Performance**: visual progress bars for Chatbot Arena Elo, MMLU-Pro, HumanEval, and SWE-bench Verified.*
> 3. *Third, the **Developer Integration Hub**: inspired by LiteLLM, we offer 5 copy-pasteable tabs for **LiteLLM, cURL, Python SDK, Node.js SDK, and the Next.js Vercel AI SDK**, automatically configured with this model's identifiers.*
> 4. *And fourth, an embedded **Token Cost Simulator** calculated specifically for this model."*

---

### **5:00 – 6:15 | Rankings, Command Palette & Interactive Playground**
**Screen to Show:** Open `/rankings`, then press `Cmd+K` / `Ctrl+K`, then open the Playground.

> *"Let’s look at three high-impact platform tools:*
>
> 1. ***Leaderboard & Rankings (`/rankings`)**: Developers can rank models across human preference (Arena Elo), reasoning (MMLU-Pro), code generation (HumanEval), and **Cost Efficiency** (calculated as Arena Elo points delivered per dollar spent).*
>
> 2. *(Press Ctrl+K / Cmd+K)*: *We built a **Global Command Palette** that lets users jump to any model, research lab, or cloud provider instantly using keyboard navigation.*
>
> 3. *(Click 'Launch Playground' or the Playground button)*: *Here is the **Interactive Model Sandbox**. We can select any model, type a prompt or choose a preset, and click 'Run Simulation'. It simulates real-time token streaming at authentic hardware speeds—for instance, 420 tokens per second on Groq LPU versus 88 on Claude—while displaying live telemetry for latency, throughput, and estimated USD cost."*

---

### **6:15 – 7:30 | Technical Decisions, Architecture & Challenges Solved**
**Screen to Show:** Switch to VS Code / code editor. Briefly highlight `src/lib/store/useStore.ts`, `src/lib/data/db.ts`, and `prisma/schema.prisma`.

> *"To wrap up, I’d like to highlight the technical architecture and key decisions behind the implementation:*
>
> 1. ***Framework & Styling**: Built on **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**, designed with an obsidian dark theme, custom glassmorphism, and subtle glowing accents.*
> 2. ***State Management**: Used **Zustand** with `localStorage` persistence for managing the comparison tray, active filter states, view modes, and bookmarks, ensuring zero layout shift and instantaneous UI reactivity without prop drilling.*
> 3. ***Data Architecture & APIs**: While focusing on frontend excellence, I ensured the application is fully backed by clean architecture:*
>    - *Created a complete **Prisma ORM** schema in `prisma/schema.prisma` with PostgreSQL models for Labs, Providers, Models, and Benchmarks.*
>    - *Implemented RESTful route handlers in `src/app/api/` for models, comparison, benchmarks, and cost calculations.*
> 4. ***Engineering Challenges Solved**: Synchronizing client-side Zustand state with URL search parameters for shareable compare links required wrapping search params in React Suspense boundaries to maintain static page optimization without hydration mismatches.*
>
> *Thank you for reviewing OneAtlas! The complete codebase is available on GitHub, and the live application is ready for testing."*
