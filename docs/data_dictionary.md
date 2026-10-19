# Data Dictionary & Synthetic Dataset Documentation — DukaanAI
## Paytm Build for India AI Hackathon (Merchant Growth AI Track)

---

## 1. Overview

To provide an authentic, realistic demonstration without compromising any merchant's private data, DukaanAI incorporates a **deterministic, reproducible 90-day synthetic dataset** modeled after an authentic Indian Kirana store:

- **Store Name**: Shree Ganesh Kirana & General Store
- **Location**: 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038
- **Category**: Neighborhood Kirana & FMCG Retail
- **Time Horizon**: 90 Days (July 21, 2026 – October 19, 2026)
- **Scope**: ~35 Products, 420 Customers, ~3,100 Orders, ~6,500 Order Items

---

## 2. Product Categories & Catalog

Products are divided into 6 traditional Indian neighborhood FMCG categories:

| Category | Typical Products | Margin Profile | Velocity Profile |
|---|---|---|---|
| **Staples & Grains** | Aashirvaad Atta 5kg, Fortune Sunflower Oil 1L, India Gate Basmati Rice 1kg, Tata Salt 1kg, Toor Dal 1kg, Sugar 1kg, Rajma Chitra 500g, Besan 500g | Low-to-Medium (4% – 18%) | High daily rotation |
| **Packaged Foods & Snacks** | Maggi 2-Min Noodles 4-Pack, Parle-G Gold 250g, Lay's Magic Masala 50g, Kurkure 85g, Good Day Butter 200g, Haldiram's Bhujia 400g, Kissan Jam 500g, Kellogg's Corn Flakes 475g | Medium-to-High (15% – 26%) | Impulse & high velocity |
| **Dairy & Bakery** | Amul Taaza Milk 1L, Amul Butter 100g, Amul Fresh Paneer 200g, Mother Dairy Dahi 400g, Whole Wheat Bread 400g | Low-to-Medium (10% – 18%) | Daily morning demand |
| **Beverages & Tea** | Tata Tea Premium 500g, Red Label Tea 500g, Nescafe Classic 50g, Bru Instant Coffee 100g, Frooti 600ml, Bournvita 500g | High (20% – 25%) | Stable weekly rotation |
| **Personal Care** | Dettol Soap 3-Pack, Colgate Strong Teeth 200g, Head & Shoulders 180ml, Parachute Coconut Oil 200ml, Glow & Lovely 50g | High (22% – 26%) | Bi-weekly / Monthly |
| **Household Essentials** | Surf Excel 1kg, Vim Bar 3-Pack, Harpic 500ml, Lizol Floor Cleaner 500ml, Good Knight Mosquito Refill 45ml | High (17% – 24%) | Monthly household restock |

---

## 3. Deliberate Explainable Scenarios

The dataset is seeded with intentional, explainable retail business patterns designed to test analytical correctness:

### Scenario 1: Critical Stockout of Maggi Masala Noodles
- **Condition**: Only 4 packs remaining in inventory against an average sales velocity of 12 packs/day.
- **Run-out Estimate**: ~0.3 days of inventory remaining.
- **Root Cause**: High weekend sales paired with delayed distributor delivery.
- **Detection**: Flagged in Overview banner, Inventory table, and AI Assistant.

### Scenario 2: Recent 7-Day Sales Decline in Packaged Snacks
- **Condition**: Sales in Packaged Foods & Snacks fell by 18-20% in the last 7 days compared to the prior 7 days.
- **Root Cause**: Stock exhaustion of Maggi Noodles and reduced footfall during rainy weekdays.
- **Detection**: Triggered when merchant asks *"Why did my sales decline?"*.

### Scenario 3: Parle-G + Tata Tea Premium Basket Affinity
- **Condition**: Parle-G Gold Biscuits (PROD-SNK-02) and Tata Tea Premium 500g (PROD-BEV-01) appear together in 38% of morning grocery orders.
- **Recommendation**: Bundled as a "Chai-Nashta Morning Combo" at ₹300 with a ₹5 token discount.

### Scenario 4: Margin Leakage on Cooking Oil
- **Condition**: Fortune Sunlite Sunflower Oil 1L (PROD-STP-02) has a wholesale cost of ₹132 and selling price of ₹138 (4.3% margin). Several orders contain ₹5 promotional discounts, reducing unit profit to ₹1.
- **Recommendation**: Discontinue discounting commodity cooking oil; maintain market pricing.

### Scenario 5: Slow-Moving Working Capital Lockup
- **Condition**: Rajma Chitra Premium 500g (PROD-STP-07) holds 45 packs (₹3,600 tied up) with only 0.2 units/day sales velocity (>45 days of supply).
- **Recommendation**: Stop reordering; offer a clearance bundle with spices to unlock liquidity.

### Scenario 6: Lapsed Regular Customer Retention
- **Condition**: ~18 customers who visited 3+ times historically have had zero purchases in the last 21+ days.
- **Recommendation**: Targeted WhatsApp re-engagement campaign offering free doorstep delivery on orders above ₹300.

---

## 4. Mathematical Formula Standards

All computations adhere to rigorous definitions:

1. **Net Item Revenue**:
   $$\text{Net Revenue} = (\text{Quantity} \times \text{Unit Selling Price}) - \text{Item Discount}$$

2. **Cost of Goods Sold (COGS)**:
   $$\text{COGS} = \text{Quantity} \times \text{Unit Cost Price}$$

3. **Estimated Gross Profit**:
   $$\text{Gross Profit} = \text{Net Revenue} - \text{COGS}$$

4. **Gross Margin Percentage**:
   $$\text{Gross Margin \%} = \frac{\text{Estimated Gross Profit}}{\text{Net Sales Revenue}} \times 100$$

5. **Average Order Value (AOV)**:
   $$\text{AOV} = \frac{\text{Net Sales Revenue}}{\text{Count of Completed Orders}}$$

6. **Days of Stock Remaining**:
   $$\text{Days Remaining} = \frac{\text{Current Stock}}{\text{Average Daily Units Sold (Observation Period)}}$$
   *(If sales = 0 and stock > 0, set to 999 days; if stock <= 0, set to 0 days)*

7. **Suggested Reorder Quantity**:
   $$\text{Target} = (\text{Average Daily Sales} \times \text{Lead Time Days}) + \text{Safety Stock}$$
   $$\text{Reorder Qty} = \max(0, \lceil\text{Target} - \text{Current Stock}\rceil)$$
