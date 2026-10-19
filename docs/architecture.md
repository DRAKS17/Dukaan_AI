# Technical Architecture — DukaanAI
## Paytm Build for India AI Hackathon (Merchant Growth AI Track)

DukaanAI is an AI-powered Business Growth Copilot engineered for Indian Kirana and small independent retail store owners. Unlike traditional chatbots that pass arbitrary merchant queries directly to an LLM (which inevitably hallucinate sales figures, phantom inventory, or unverified margins), DukaanAI implements a **deterministic, mathematically grounded analytical architecture**.

---

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 USER INTERFACE                                    |
|   Next.js 16 App Router | React 19 | Tailwind CSS v4 | Recharts | Lucide Icons   |
|                                                                                   |
|  [Overview Dashboard]  [Sales Analytics]  [Inventory Intel]  [Customer Retention] |
|  [AI Assistant Chat]   [Growth Recs]      [Data & CSV Ingestion]                  |
+---------------------------------------------------------+-------------------------+
                                                          |
                                                          v
+-----------------------------------------------------------------------------------+
|                        APPLICATION STATE & CONTEXT LAYER                          |
|             StoreContext: StoreDataset, TimeRange ('7d'|'30d'|'90d')              |
|             LocalStorage Status Persistence (to_do, in_progress, completed)       |
+---------------------------------------------------------+-------------------------+
                                                          |
                                                          v
+-----------------------------------------------------------------------------------+
|                          AUTHORITATIVE ANALYTICS ENGINE                           |
|       (Pure, audited TypeScript calculations in src/lib/analytics/engine.ts)      |
|                                                                                   |
|  - Net Sales Revenue: Σ (quantity * unitPrice - discount)                         |
|  - Estimated Gross Profit: Net Revenue - COGS                                     |
|  - Gross Margin %: (Gross Profit ÷ Net Revenue) * 100                             |
|  - Average Order Value (AOV): Net Revenue ÷ Completed Orders                      |
|  - Inventory Velocity & Stock Run-out: Stock ÷ Average Daily Sales                |
|  - Repeat Customer Rate: Unique Repeat Buyers ÷ Total Unique Buyers               |
|  - Product Affinity Co-occurrence: Market basket pairing analysis                 |
|  - Margin Leakage & Category Contribution Breakdowns                              |
+-------------------+-------------------------------------+-------------------------+
                    |                                     |
                    v                                     v
+-----------------------------------+   +-------------------------------------------+
|    GROWTH RECOMMENDATION ENGINE   |   |        CONVERSATIONAL AI COPILOT          |
|  (src/lib/recommendations/engine) |   |    (/api/chat & src/lib/ai/grounding)     |
|                                   |   |                                           |
|  - Critical Stockout Warning      |   |  1. Merchant Intent Classifier            |
|  - Sales Decline Investigation    |   |  2. Grounded Fact Extraction Layer        |
|  - Product Bundle / Cross-Sell    |   |  3. Multi-Provider AI Abstraction:        |
|  - Star Earner Margin Promotion   |   |     - Google Gemini 1.5/2.0 Flash         |
|  - Slow-Moving Liquidation        |   |     - OpenAI GPT-4o-mini                  |
|  - Margin Leakage Prevention      |   |     - DukaanAI Offline Deterministic      |
|  - Customer Retention Campaign    |   |       Engine (Zero-fail fallback)         |
+-----------------------------------+   +-------------------------------------------+
                    |                                     |
                    +------------------+------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                               DATA & STORAGE LAYER                                |
|  - Seeded 90-Day Indian Kirana Dataset (42 Products, ~420 Customers, ~3,100 Orders)|
|  - Client-side Zod Schema CSV Ingestion Engine with Row-Level Error Tracking       |
|  - Browser LocalStorage for merchant action states                                |
+-----------------------------------------------------------------------------------+
```

---

## 2. The Grounding Pipeline: Zero-Hallucination AI

Every merchant question flows through a 5-stage pipeline:

```
[Merchant Question]
        |
        v
1. INTENT UNDERSTANDING
   Classifies query into one of 9 business intents (SALES_SUMMARY, SALES_DECLINE, 
   RESTOCK_RECOMMENDATION, GROSS_MARGIN_ANALYSIS, SLOW_MOVING, PRODUCT_BUNDLE,
   MARGIN_LEAKAGE, CUSTOMER_RETENTION, PRIORITIZED_ACTIONS).
        |
        v
2. TIME RANGE & ENTITY EXTRACTION
   Resolves observation period (e.g. 7d, 30d, 90d) and prior comparison baseline of 
   identical calendar length.
        |
        v
3. AUTHORITATIVE ENGINE QUERY
   Invokes pure calculation functions from `src/lib/analytics/engine.ts`.
   Extracts verified numbers: current vs prior revenue, category drops, inventory days,
   unit margins, basket co-occurrences.
        |
        v
4. VERIFIED FACTS STRUCTURING
   Builds `GroundedAnalysis` containing exact numerical facts, evidence bullet points,
   action rationale, and explicitly declared assumptions & limitations.
        |
        v
5. MULTI-PROVIDER AI EXPLANATION
   - If an external LLM (Gemini / OpenAI) is configured: translates verified figures into 
     concise, respectful Kirana-friendly language, strictly forbidding hallucinated figures.
   - If offline or keys are restricted: generates the exact same structured answer via 
     the built-in deterministic analytical engine with 100% reliability.
```

---

## 3. Key Design & Privacy Principles

1. **Server-Side API Key Isolation**: All LLM credentials remain strictly on the backend (`/api/chat`). Never exposed to browser bundles.
2. **Pseudonymous Customer Identifiers**: Real customer PII (phone numbers, addresses) is never stored or transmitted. The dataset utilizes pseudonymous identifiers (e.g., `Customer #0042`, masked phone `+91 98XX XX142`).
3. **Deterministic Fallback Guarantee**: The application is 100% demonstrable in offline environments, conference Wi-Fi, or during API outages without degrading analytical accuracy.
4. **Transparent Labeling**: Demonstrates simulated/synthetic status visibly across all views with a single-click reset capability.
