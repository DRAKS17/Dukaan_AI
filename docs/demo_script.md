# Hackathon Live Demonstration Script — DukaanAI
## Paytm Build for India AI Hackathon (Merchant Growth AI Track)
**Target Demo Duration: 3 to 5 Minutes**

---

## Demo Step 1: Opening & Merchant Persona (30 Seconds)
**Presenter Narration:**
> *"Namaste Judges. India is powered by over 12 million Kirana stores. They track payments through Paytm Soundboxes, QR codes, and register books, but they lack data analysts. A shopkeeper wants to know: Why did my sales dip this week? What will run out tomorrow? Am I losing money on discounts? And what should I do today?*  
> *This is **DukaanAI**—an AI Business Growth Copilot built specifically for Indian retail merchants."*

**Action:**
- Open `http://localhost:3000`
- Point out **"Shree Ganesh Kirana & General Store"** header, the **Time Range Selector** (Last 7 Days), and the **Simulated Kirana Store** badge.

---

## Demo Step 2: Executive Dashboard & Performance Grounding (45 Seconds)
**Presenter Narration:**
> *"Here on the home dashboard, the merchant instantly sees their business performance compared to an equal prior period. Net Sales Revenue, Estimated Gross Profit, Gross Margin % (21.3%), and Order Volume with AOV.*  
> *Notice that charts don't just show revenue—they show Gross Profit alongside sales. In Kirana retail, high sales with zero margin is a trap."*

**Action:**
- Hover over the **Daily Sales Trend Chart** to reveal the tooltip showing Net Sales, Gross Profit, and Completed Orders.
- Show the **Category Breakdown Chart** (Staples vs Packaged Foods vs Beverages).
- Point to the **Top Revenue Drivers** table showing unit sales, margins, and stock health chips.

---

## Demo Step 3: The "Aha!" AI Moment — "Why did my sales decline?" (60 Seconds)
**Presenter Narration:**
> *"Now let's test the conversational AI. A merchant notices sales dipped and asks: 'Why are my sales lower this week?'*  
> *In a generic chatbot, you get hallucinated nonsense. In DukaanAI, the query is classified, routed to our authoritative analytics engine, and evaluated against store records."*

**Action:**
- Click the prompt chip: **"Why did my sales decline?"** (or navigate to `/assistant`).
- Observe the instant grounded response.

**Presenter Narration:**
> *"Look at this response: It states the exact observation period (Oct 13 to Oct 19 vs prior 7 days). It computes the exact contraction (-19.0%, ₹21,645 drop). It identifies the primary culprit product and category, and diagnoses the root cause: stock depletion.*  
> *Notice the 'Verified Store Calculation Points' badge below. Every single claim is backed by mathematical facts."*

---

## Demo Step 4: Inventory Intelligence & Run-Out Predictions (45 Seconds)
**Presenter Narration:**
> *"Let's navigate to **Products & Inventory Intelligence** to see how DukaanAI prevents stockouts."*

**Action:**
- Click **"Products & Inventory"** in the sidebar.
- Filter by **"Critical"** status.
- Highlight **Maggi 2-Minute Masala Noodles 4-Pack** (Current Stock: 4 packs, Daily Velocity: ~12/day, Days Left: ~0.3 days).

**Presenter Narration:**
> *"Maggi noodles has only 4 packs remaining with 0.3 days of stock left. Replenishment lead time is 2 days. DukaanAI automatically calculates the suggested reorder quantity (+31 units) considering lead-time demand and safety stock."*

---

## Demo Step 5: Growth Recommendations & Action Workflow (45 Seconds)
**Presenter Narration:**
> *"DukaanAI doesn't just show data—it guides merchant actions. In the **Recommendations** view, we generate 7 distinct categories of growth opportunities."*

**Action:**
- Click **"Recommendations"** in the sidebar.
- Show the top **Critical Stockout Risk** card.
- Click the status toggle from **"To Do"** to **"In Progress"** then **"Done ✓"**.
- Refresh the page to demonstrate that the merchant's action state persists in `localStorage`.
- Highlight the **Product Pairing Combo** card (Parle-G + Tata Tea Premium: 38% basket affinity).

---

## Demo Step 6: Margin Leakage Detection (30 Seconds)
**Presenter Narration:**
> *"Let's ask the assistant a tricky financial question: 'Is offering a discount on oil a good idea?'"*

**Action:**
- Click **"Ask AI Copilot"** or type into `/assistant`: *"Is offering a discount on oil a good idea?"*

**Presenter Narration:**
> *"DukaanAI warns the merchant: 'Discounting cooking oil is NOT recommended. Gross margin is already razor-thin at 4.3% (cost ₹132, selling ₹138). Giving a ₹5 discount erodes 80%+ of gross profit.' This protects the merchant from accidental losses."*

---

## Demo Step 7: CSV Upload & Data Ingestion (30 Seconds)
**Presenter Narration:**
> *"Finally, judges or merchants can test their own store data. In **Data & CSV Upload**, you can download sample templates or upload a custom CSV."*

**Action:**
- Navigate to `/settings`.
- Click **"Download Products Template (.csv)"**.
- Show the client-side schema validation that catches invalid formats with row-level error reporting before applying.

---

## Demo Step 8: Closing Summary (15 Seconds)
**Presenter Narration:**
> *"DukaanAI bridges the gap between big retail analytics and small neighborhood Kiranas: Grounded AI, Zero Hallucinations, Actionable Recommendations, and Indian Merchant Context. Built for the Paytm Build for India AI Hackathon. Thank you!"*
