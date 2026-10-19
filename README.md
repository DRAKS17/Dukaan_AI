# DukaanAI — AI Business Growth Copilot for Small Merchants
> **Paytm Build for India AI Hackathon** — *Merchant Growth AI Track*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-15%2F15%20Passing-emerald)](https://github.com/)

[![Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-black?logo=vercel)](https://dukaanai-seven.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/DRAKS17/Dukaan_AI.git)

**"Understand your shop, discover growth opportunities, and know what to do next — with AI."**

🌐 **Live Demo:** [https://dukaanai-seven.vercel.app](https://dukaanai-seven.vercel.app)  
💻 **GitHub:** [https://github.com/DRAKS17/Dukaan_AI.git](https://github.com/DRAKS17/Dukaan_AI.git)

DukaanAI is an intelligent business growth copilot engineered for Indian Kirana and small independent retail store owners. Rather than relying on generic chatbots that hallucinate numbers, DukaanAI couples an authoritative analytical engine with conversational AI to deliver mathematically grounded explanations, inventory risk warnings, and actionable recommendations.

---

## 🌟 Key Product Capabilities

### 1. Executive Business Dashboard
- Real-time calculated KPIs: **Net Sales Revenue**, **Estimated Gross Profit**, **Gross Margin %**, **Order Count**, **Average Order Value (AOV)**, **Critical Stockouts**, and **Repeat Customer Rate**.
- Prior-period comparisons using equal calendar day baselines (e.g. 7-day vs previous 7-day).
- Recharts visualizations: Daily Sales & Gross Profit trend, and Category Revenue vs Margin distribution.
- Top Revenue Drivers table with real-time stock health badges.

### 2. Conversational AI Merchant Assistant
- Named **DukaanAI Business Assistant**.
- Answers merchant questions in natural language:
  - *"Why are my sales lower this week?"*
  - *"Which products should I restock right now?"*
  - *"Which products generate the highest profit?"*
  - *"Is offering a discount on cooking oil a good idea?"*
  - *"Which products are often bought together?"*
  - *"What should I focus on today?"*
- **Strict Grounding Guarantee**: Every answer is formulated from verified calculations performed by the underlying TypeScript analytical engine. Cites exact observation dates, revenue deltas, and product names.
- Multi-provider architecture with **100% offline deterministic fallback** for uninterrupted hackathon demonstrations.

### 3. Growth Recommendations Engine
- Generates 7 categories of prioritized interventions:
  1. **Critical Low Stock Warnings** (Days remaining, daily velocity, suggested reorder qty).
  2. **Sales Decline Investigation** (Segment drops and stockout root-cause identification).
  3. **High-Margin Star Promotions** (Promote 22%+ margin items like tea, jam, and paneer).
  4. **Product Affinity Bundles** (e.g. Parle-G + Tata Tea Premium with 38% co-occurrence).
  5. **Slow-Moving Working Capital Release** (Flagging >45-day inventory lockups).
  6. **Margin Leakage Prevention** (Alerts against discounting razor-thin 4% margin cooking oils).
  7. **Customer Retention Campaigns** (Targeting lapsed regular shoppers inactive for >21 days).
- Interactive status workflow: `To Do` → `In Progress` → `Completed` → `Dismissed` with browser `localStorage` persistence.

### 4. Products & Inventory Intelligence
- Comprehensive stock health classification: `Critical`, `Low Stock`, `Healthy`, `Slow Moving`, and `Out of Stock`.
- Dynamic replenishment formula accounting for average daily demand, lead-time days, and safety stock.
- Tied-up capital tracking at wholesale purchase cost.

### 5. Customer Retention Intelligence
- Cohort loyalty segmentation: `VIP / Champion`, `Loyal Regular`, `Occasional Buyer`, `At-Risk / Lapsed`, and `New Buyer`.
- Repeat customer rate tracking and re-engagement campaign triggers without exposing personal customer data.

### 6. Data Ingestion & CSV Validation
- Client-side Zod schema validation with row-level error reporting.
- Downloadable sample CSV templates for products and orders.
- Safe preview before applying uploaded inventory to the live dashboard.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend**: React 19, Tailwind CSS v4, Lucide React icons
- **Charts**: Recharts
- **Data Validation**: Zod, TypeScript 5
- **AI Integration**: Google Gemini API (`@google/generative-ai`), OpenAI (`gpt-4o-mini`), and DukaanAI Deterministic Analytical Engine
- **State & Storage**: React Context + Browser `localStorage`

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your `GEMINI_API_KEY` or `OPENAI_API_KEY`. If omitted, the application seamlessly operates in offline deterministic mode.

### 3. Run the Automated Test Suite
```bash
npm test
```
Executes 15 comprehensive verification checks across calculations, formulas, intent classification, grounding, and CSV parsing.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 📚 Documentation Index

- [Technical Architecture](docs/architecture.md) — System diagrams, grounding pipeline, and privacy design.
- [Business Case & Kirana Context](docs/business_case.md) — Market context, merchant pain points, and unit economics.
- [Data Dictionary & Scenarios](docs/data_dictionary.md) — Documentation of the 90-day Indian Kirana dataset and explainable patterns.
- [Live Demo Script](docs/demo_script.md) — Step-by-step 3-minute judge demonstration walkthrough.
- [Hackathon Submission Package](docs/hackathon_submission.md) — Official submission details for the Paytm Build for India AI Hackathon.

---

## 👥 Built For
**Paytm Build for India AI Hackathon — Merchant Growth AI Track**
