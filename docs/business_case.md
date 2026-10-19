# Business Case — DukaanAI
## Paytm Build for India AI Hackathon (Merchant Growth AI Track)

---

## 1. Executive Summary

India's retail landscape is anchored by over **12 to 15 million neighborhood Kirana stores**, accounting for more than 80% of India's $800B+ retail grocery market. Despite widespread adoption of digital UPI soundboxes, QR codes, and digital ledgers (Khatas), small merchants remain data-rich but insight-poor. 

A typical Kirana shopkeeper tracks sales receipts, supplier bills, and inventory scribbles, yet cannot answer simple growth questions:
- *Why did my sales drop this week compared to last week?*
- *Which products will run out before Saturday evening?*
- *Am I losing money by giving discounts on cooking oil?*
- *Which regular neighborhood customers haven't visited in 3 weeks?*
- *What should I prioritize doing today?*

**DukaanAI** is built specifically for this persona: **an Indian Kirana or neighborhood grocery merchant who needs accessible, evidence-backed growth intelligence without needing data analyst skills.**

---

## 2. Core Merchant Pain Points

### A. The "Silent Stockout" Revenue Leak
When a high-velocity staple item (such as Maggi Noodles, Amul Milk, or Atta) runs out of stock, Kirana shoppers don't wait—they walk 50 meters to the neighboring shop. Not only is the primary item sale lost, but the customer's entire basket (tea, biscuits, soap) walks away too. Small shopkeepers only realize an item is out when a customer asks for it and finds empty shelves.

### B. Unintentional Margin Bleed
Commodity staples (refined sunflower oil, sugar, wheat flour) carry razor-thin gross margins (2% to 5%). To match supermarket prices or appease vocal customers, shopkeepers frequently grant small ₹5 to ₹10 discounts. Without calculating gross margins, they do not realize that discounting a ₹138 oil packet with a ₹132 wholesale cost erodes 80%+ of their profit on that sale.

### C. Quiet Customer Churn
Kirana profitability depends on repeat buyers who purchase their daily milk, curd, and weekly rations. When a loyal regular stops visiting (due to a bad delivery, stockout, or competitor offer), the merchant rarely notices until weeks later, by which time the shopping habit has moved elsewhere.

### D. Analytical Overload
Existing analytics SaaS and enterprise BI tools require spreadsheet exports, SQL queries, pivot tables, and dashboard navigation that no busy shopkeeper operating a 14-hour daily counter has time or expertise to use.

---

## 3. The DukaanAI Solution

DukaanAI transforms raw transaction records into immediate actionable guidance through:

1. **Executive Dashboard**: Clean, responsive layout with INR formatting, Indian grocery categories, and comparison baselines of identical calendar length.
2. **Authoritative Analytics Engine**: Pure mathematical calculations for Net Sales, COGS, Gross Profit, Velocity, Days of Supply, and Repeat Buyer Rate.
3. **AI Growth Copilot**: A conversational assistant that answers natural language questions using verified store figures—refusing to hallucinate numbers or invent phantom products.
4. **Actionable Recommendations**: Prioritized opportunity cards (Low Stock, Sales Decline, High Margin, Bundling, Retention, Margin Leakage) equipped with explicit workflow status (`To Do`, `In Progress`, `Completed`, `Dismissed`).
5. **CSV Ingestion**: Clean client-side CSV validation with row-level error reporting, allowing merchants and hackathon judges to evaluate custom datasets instantly.

---

## 4. Potential Value & Merchant Impact

| Area of Intervention | Simulated Scenario | Projected Business Value |
|---|---|---|
| **Stockout Prevention** | Reordering Maggi 4-Pack & Milk before 48h stockout | Protects ~₹2,500 – ₹4,500 in weekly basket sales |
| **Margin Leakage** | Eliminating ₹5 discount on low-margin oil (4.3% margin) | Preserves ~₹600 – ₹1,200 in monthly net margin |
| **High-Margin Cross-Sell** | Eye-level counter placement of Tea + Parle-G bundle | Lifts weekly AOV by ₹10 – ₹15 across ~40 baskets |
| **Lapsed Buyer Retention** | Re-engaging 5 out of 18 lapsed regular buyers via WhatsApp | Recaptures ~₹5,000+ in monthly grocery spend |

*Note: Figures represent simulated scenario projections based on the 90-day Kirana dataset and do not represent claims of verified post-implementation audits.*
