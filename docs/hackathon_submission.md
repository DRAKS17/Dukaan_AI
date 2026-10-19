# Hackathon Submission Package — DukaanAI
## Paytm Build for India AI Hackathon — Merchant Growth AI Track

---

## 1. Project Overview

- **Project Name**: DukaanAI — AI Business Growth Copilot for Small Merchants
- **Hackathon Track**: Merchant Growth AI Track
- **Primary Persona**: Indian Kirana & Neighborhood Retail Store Owner
- **Live Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Recharts, Zod, Lucide React, Google Gemini API / Deterministic Grounded Engine

---

## 2. Problem Statement

India is powered by over 12 million Kirana stores accounting for more than 80% of retail grocery commerce. While merchants have widely adopted Paytm Soundboxes, QR codes, and digital ledgers to collect payments, they lack dedicated data analysts to interpret their transaction, inventory, and margin data.

Small merchants struggle with:
1. **Unexplained Revenue Drops**: Unable to determine why weekly sales dipped or which items drove the decline.
2. **Silent Stockouts**: Fast-moving items exhaust unnoticed, leading to lost customer visits and basket abandonment.
3. **Margin Bleeding**: Giving well-intentioned ₹5–₹10 discounts on commodity staples (cooking oil, sugar) with 2–4% margins, eroding store profits.
4. **Quiet Customer Churn**: Regular weekly shoppers stopping their visits without the merchant noticing.
5. **Analytics Intimidation**: Existing SaaS BI tools require complex dashboards, spreadsheet formulas, and pivot tables that a busy counter shopkeeper cannot navigate.

---

## 3. The DukaanAI Solution

DukaanAI is an intelligent, conversational business growth copilot that allows merchants to understand their shop performance in plain language and receive evidence-backed, actionable recommendations.

### Key Capabilities:
- **Executive Business Dashboard**: Real-time calculated KPIs (Net Sales, Gross Profit, Gross Margin %, Orders, AOV, Critical Stockouts, Repeat Customer Rate) comparing equal prior observation windows.
- **Authoritative Analytics Engine**: Audited pure mathematical functions for sales velocity, days of stock remaining, product affinity pairing, and margin leakage.
- **Grounded Conversational AI Assistant**: Answers natural language merchant questions (e.g., *"Why did my sales decline?"*, *"What should I restock today?"*, *"Is discounting oil a good idea?"*) grounded strictly in computed store records.
- **Growth Recommendation Engine**: Prioritizes 7 categories of retail actions (Low Stock, Sales Decline, High Margin, Bundling, Slow Movers, Margin Leaks, Retention) with status workflow (`To Do`, `In Progress`, `Completed`, `Dismissed`) and local storage persistence.
- **Customer & Inventory Intelligence Views**: Dedicated modules for stock health and pseudonymous customer retention cohorts.
- **CSV Ingestion & Schema Validation**: Client-side Zod validation with row-level error reporting, allowing merchants and judges to evaluate custom store datasets.

---

## 4. Key Differentiators

| Feature | Generic AI Chatbot | DukaanAI Copilot |
|---|---|---|
| **Numerical Grounding** | Guesses or invents numbers (Hallucinates metrics) | Computed directly by authoritative TypeScript formulas |
| **Observation Context** | Vague comparisons without dates | Cites exact observation window and comparison periods |
| **Reliability / Offline** | Fails completely if API key is missing or offline | 100% resilient deterministic offline engine fallback |
| **Indian Retail Relevance** | Generic Western e-commerce concepts | Kirana FMCG categories, INR currency, lead-time demand, bundling |
| **Actionability** | Long theoretical essays | Structured cards with title, priority, evidence, rationale, and status toggle |

---

## 5. Verification & Test Suite Results

An automated 15-point verification suite (`npm test`) confirms:
- ✅ **Dataset Integrity**: 35+ products, 420 customers, ~3,100 synthetic orders.
- ✅ **Mathematical Accuracy**: Net Sales, Gross Profit, Gross Margin %, and AOV verified against standard definitions.
- ✅ **Inventory Logic**: Days of stock remaining and lead-time safety reorders accurately calculated.
- ✅ **Intent Classifier**: Correct routing of decline, restock, margin leakage, and priority action queries.
- ✅ **Grounding Integrity**: Non-empty verified numerical facts generated for every supported query.
- ✅ **CSV Validation**: 100% valid parsing on templates; strict row-level error reporting on malformed CSVs.

---

## 6. Future Roadmap

1. **Regional Voice Input & TTS**: Speech-to-speech in Hindi, Hinglish, Kannada, and Tamil for voice-first counter interaction.
2. **Paytm Soundbox Integration**: Daily morning audio briefing of top restock priorities delivered through the smart audio device.
3. **Automated WhatsApp Re-engagement**: One-click broadcast dispatch for weekly staple arrival alerts to regular buyers.
