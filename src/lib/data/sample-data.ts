/**
 * DukaanAI - Seeded Realistic Kirana Store Dataset
 * "Shree Ganesh Kirana & General Store", Indira Nagar, Bengaluru
 * Includes 90 days of transactions, ~42 products, ~450 customers, ~3,100 orders
 * Built with purposeful business scenarios for realistic analytics and recommendations.
 */

import { Product, Customer, Order, OrderItem, StoreDataset } from '@/types';

// Deterministic Pseudo-Random Number Generator (Linear Congruential Generator)
class SeededRandom {
  private seed: number;

  constructor(seed = 123456789) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Staples & Grains
  {
    id: 'PROD-STP-01',
    name: 'Aashirvaad Shudh Chakki Atta 5kg',
    category: 'Staples & Grains',
    unit: 'bag',
    costPrice: 215,
    sellingPrice: 245,
    currentStock: 28,
    reorderLevel: 20,
    leadTimeDays: 2,
    safetyStock: 10,
    isActive: true,
  },
  {
    id: 'PROD-STP-02',
    name: 'Fortune Sunlite Refined Sunflower Oil 1L',
    category: 'Staples & Grains',
    unit: 'pouch',
    costPrice: 132,
    sellingPrice: 138, // Low margin item (4.3%) - Margin leak scenario
    currentStock: 35,
    reorderLevel: 25,
    leadTimeDays: 2,
    safetyStock: 12,
    isActive: true,
  },
  {
    id: 'PROD-STP-03',
    name: 'India Gate Feast Rozzana Basmati Rice 1kg',
    category: 'Staples & Grains',
    unit: 'pack',
    costPrice: 85,
    sellingPrice: 110,
    currentStock: 22,
    reorderLevel: 15,
    leadTimeDays: 3,
    safetyStock: 8,
    isActive: true,
  },
  {
    id: 'PROD-STP-04',
    name: 'Tata Salt Vacuum Evaporated 1kg',
    category: 'Staples & Grains',
    unit: 'pack',
    costPrice: 22,
    sellingPrice: 28,
    currentStock: 50,
    reorderLevel: 30,
    leadTimeDays: 2,
    safetyStock: 15,
    isActive: true,
  },
  {
    id: 'PROD-STP-05',
    name: 'Toor Dal Desi Unpolished 1kg',
    category: 'Staples & Grains',
    unit: 'kg',
    costPrice: 145,
    sellingPrice: 175,
    currentStock: 18,
    reorderLevel: 15,
    leadTimeDays: 3,
    safetyStock: 6,
    isActive: true,
  },
  {
    id: 'PROD-STP-06',
    name: 'Madhur Pure & Hygienic Sugar 1kg',
    category: 'Staples & Grains',
    unit: 'pack',
    costPrice: 44,
    sellingPrice: 52,
    currentStock: 40,
    reorderLevel: 25,
    leadTimeDays: 2,
    safetyStock: 10,
    isActive: true,
  },
  {
    id: 'PROD-STP-07',
    name: 'Rajma Chitra Premium 500g',
    category: 'Staples & Grains',
    unit: 'pack',
    costPrice: 80,
    sellingPrice: 110,
    currentStock: 45, // Slow mover with heavy tied-up stock
    reorderLevel: 10,
    leadTimeDays: 4,
    safetyStock: 5,
    isActive: true,
  },
  {
    id: 'PROD-STP-08',
    name: 'Fortune Besan 500g',
    category: 'Staples & Grains',
    unit: 'pack',
    costPrice: 48,
    sellingPrice: 65,
    currentStock: 19,
    reorderLevel: 12,
    leadTimeDays: 3,
    safetyStock: 6,
    isActive: true,
  },

  // 2. Packaged Foods & Snacks
  {
    id: 'PROD-SNK-01',
    name: 'Maggi 2-Minute Masala Noodles 280g (Pack of 4)',
    category: 'Packaged Foods & Snacks',
    unit: 'pack',
    costPrice: 50,
    sellingPrice: 60,
    currentStock: 4, // CRITICAL STOCKOUT ALERT!
    reorderLevel: 35,
    leadTimeDays: 2,
    safetyStock: 15,
    isActive: true,
  },
  {
    id: 'PROD-SNK-02',
    name: 'Parle-G Gold Biscuits 250g',
    category: 'Packaged Foods & Snacks',
    unit: 'pack',
    costPrice: 24,
    sellingPrice: 30,
    currentStock: 48,
    reorderLevel: 25,
    leadTimeDays: 2,
    safetyStock: 12,
    isActive: true,
  },
  {
    id: 'PROD-SNK-03',
    name: "Lay's India's Magic Masala 50g",
    category: 'Packaged Foods & Snacks',
    unit: 'pack',
    costPrice: 16,
    sellingPrice: 20,
    currentStock: 8, // Low Stock Alert
    reorderLevel: 30,
    leadTimeDays: 2,
    safetyStock: 10,
    isActive: true,
  },
  {
    id: 'PROD-SNK-04',
    name: 'Kurkure Masala Munch 85g',
    category: 'Packaged Foods & Snacks',
    unit: 'pack',
    costPrice: 16,
    sellingPrice: 20,
    currentStock: 12,
    reorderLevel: 25,
    leadTimeDays: 2,
    safetyStock: 10,
    isActive: true,
  },
  {
    id: 'PROD-SNK-05',
    name: 'Britannia Good Day Butter Cookies 200g',
    category: 'Packaged Foods & Snacks',
    unit: 'pack',
    costPrice: 36,
    sellingPrice: 45,
    currentStock: 26,
    reorderLevel: 20,
    leadTimeDays: 3,
    safetyStock: 8,
    isActive: true,
  },
  {
    id: 'PROD-SNK-06',
    name: "Haldiram's Nagpur Bhujia Sev 400g",
    category: 'Packaged Foods & Snacks',
    unit: 'pack',
    costPrice: 95,
    sellingPrice: 125,
    currentStock: 15,
    reorderLevel: 15,
    leadTimeDays: 3,
    safetyStock: 6,
    isActive: true,
  },
  {
    id: 'PROD-SNK-07',
    name: 'Kissan Mixed Fruit Jam 500g',
    category: 'Packaged Foods & Snacks',
    unit: 'bottle',
    costPrice: 120,
    sellingPrice: 160, // High margin (25%)
    currentStock: 14,
    reorderLevel: 10,
    leadTimeDays: 4,
    safetyStock: 4,
    isActive: true,
  },
  {
    id: 'PROD-SNK-08',
    name: "Kellogg's Corn Flakes Real Almond Honey 475g",
    category: 'Packaged Foods & Snacks',
    unit: 'box',
    costPrice: 240,
    sellingPrice: 315, // Slow mover, high ticket
    currentStock: 18,
    reorderLevel: 6,
    leadTimeDays: 5,
    safetyStock: 3,
    isActive: true,
  },

  // 3. Dairy & Bakery
  {
    id: 'PROD-DRY-01',
    name: 'Amul Taaza Homogenised Toned Milk 1L',
    category: 'Dairy & Bakery',
    unit: 'tetrapack',
    costPrice: 66,
    sellingPrice: 74,
    currentStock: 7, // CRITICAL STOCKOUT ALERT!
    reorderLevel: 40,
    leadTimeDays: 1,
    safetyStock: 15,
    isActive: true,
  },
  {
    id: 'PROD-DRY-02',
    name: 'Amul Butter Pasteurised 100g',
    category: 'Dairy & Bakery',
    unit: 'pack',
    costPrice: 50,
    sellingPrice: 58,
    currentStock: 25,
    reorderLevel: 20,
    leadTimeDays: 2,
    safetyStock: 8,
    isActive: true,
  },
  {
    id: 'PROD-DRY-03',
    name: 'Amul Malai Fresh Paneer 200g',
    category: 'Dairy & Bakery',
    unit: 'pack',
    costPrice: 78,
    sellingPrice: 95,
    currentStock: 14,
    reorderLevel: 12,
    leadTimeDays: 1,
    safetyStock: 5,
    isActive: true,
  },
  {
    id: 'PROD-DRY-04',
    name: 'Mother Dairy Classic Dahi 400g',
    category: 'Dairy & Bakery',
    unit: 'cup',
    costPrice: 32,
    sellingPrice: 40,
    currentStock: 16,
    reorderLevel: 15,
    leadTimeDays: 1,
    safetyStock: 6,
    isActive: true,
  },
  {
    id: 'PROD-DRY-05',
    name: 'Britannia 100% Whole Wheat Bread 400g',
    category: 'Dairy & Bakery',
    unit: 'loaf',
    costPrice: 38,
    sellingPrice: 50,
    currentStock: 9,
    reorderLevel: 14,
    leadTimeDays: 1,
    safetyStock: 5,
    isActive: true,
  },

  // 4. Beverages & Tea
  {
    id: 'PROD-BEV-01',
    name: 'Tata Tea Premium Desh Ki Chai 500g',
    category: 'Beverages & Tea',
    unit: 'pack',
    costPrice: 210,
    sellingPrice: 275, // High margin (23.6%) & high velocity
    currentStock: 6, // Low stock alert
    reorderLevel: 25,
    leadTimeDays: 3,
    safetyStock: 8,
    isActive: true,
  },
  {
    id: 'PROD-BEV-02',
    name: 'Brooke Bond Red Label Tea 500g',
    category: 'Beverages & Tea',
    unit: 'pack',
    costPrice: 220,
    sellingPrice: 285,
    currentStock: 20,
    reorderLevel: 20,
    leadTimeDays: 3,
    safetyStock: 8,
    isActive: true,
  },
  {
    id: 'PROD-BEV-03',
    name: 'Nescafe Classic Instant Coffee Jar 50g',
    category: 'Beverages & Tea',
    unit: 'jar',
    costPrice: 155,
    sellingPrice: 195, // High margin (20.5%)
    currentStock: 12,
    reorderLevel: 12,
    leadTimeDays: 4,
    safetyStock: 4,
    isActive: true,
  },
  {
    id: 'PROD-BEV-04',
    name: 'Bru Instant Coffee 100g Pouch',
    category: 'Beverages & Tea',
    unit: 'pouch',
    costPrice: 175,
    sellingPrice: 220,
    currentStock: 15,
    reorderLevel: 12,
    leadTimeDays: 4,
    safetyStock: 4,
    isActive: true,
  },
  {
    id: 'PROD-BEV-05',
    name: 'Frooti Fresh ' + "n' " + 'Juicy Mango 600ml',
    category: 'Beverages & Tea',
    unit: 'bottle',
    costPrice: 30,
    sellingPrice: 40,
    currentStock: 28,
    reorderLevel: 20,
    leadTimeDays: 2,
    safetyStock: 8,
    isActive: true,
  },
  {
    id: 'PROD-BEV-06',
    name: 'Cadbury Bournvita Pro-Health Drink 500g',
    category: 'Beverages & Tea',
    unit: 'jar',
    costPrice: 215,
    sellingPrice: 260,
    currentStock: 11,
    reorderLevel: 10,
    leadTimeDays: 3,
    safetyStock: 4,
    isActive: true,
  },

  // 5. Personal Care
  {
    id: 'PROD-PC-01',
    name: 'Dettol Original Germ Protection Soap 125g (Pack of 3)',
    category: 'Personal Care',
    unit: 'pack',
    costPrice: 125,
    sellingPrice: 165, // 24.2% margin
    currentStock: 22,
    reorderLevel: 15,
    leadTimeDays: 3,
    safetyStock: 6,
    isActive: true,
  },
  {
    id: 'PROD-PC-02',
    name: 'Colgate Strong Teeth Dental Cream 200g',
    category: 'Personal Care',
    unit: 'tube',
    costPrice: 92,
    sellingPrice: 120,
    currentStock: 26,
    reorderLevel: 18,
    leadTimeDays: 3,
    safetyStock: 6,
    isActive: true,
  },
  {
    id: 'PROD-PC-03',
    name: 'Head & Shoulders Cool Menthol Anti-Dandruff Shampoo 180ml',
    category: 'Personal Care',
    unit: 'bottle',
    costPrice: 160,
    sellingPrice: 210, // 23.8% margin
    currentStock: 14,
    reorderLevel: 10,
    leadTimeDays: 4,
    safetyStock: 4,
    isActive: true,
  },
  {
    id: 'PROD-PC-04',
    name: 'Parachute 100% Pure Coconut Hair Oil 200ml',
    category: 'Personal Care',
    unit: 'bottle',
    costPrice: 82,
    sellingPrice: 105,
    currentStock: 24,
    reorderLevel: 15,
    leadTimeDays: 3,
    safetyStock: 6,
    isActive: true,
  },
  {
    id: 'PROD-PC-05',
    name: 'Glow & Lovely Advanced Multivitamin Cream 50g',
    category: 'Personal Care',
    unit: 'tube',
    costPrice: 98,
    sellingPrice: 130, // 24.6% margin
    currentStock: 16,
    reorderLevel: 12,
    leadTimeDays: 4,
    safetyStock: 5,
    isActive: true,
  },

  // 6. Household Essentials
  {
    id: 'PROD-HH-01',
    name: 'Surf Excel Easy Wash Detergent Powder 1kg',
    category: 'Household Essentials',
    unit: 'pack',
    costPrice: 120,
    sellingPrice: 145,
    currentStock: 30,
    reorderLevel: 20,
    leadTimeDays: 3,
    safetyStock: 8,
    isActive: true,
  },
  {
    id: 'PROD-HH-02',
    name: 'Vim Dishwash Bar with Lemon 300g (Pack of 3)',
    category: 'Household Essentials',
    unit: 'pack',
    costPrice: 38,
    sellingPrice: 48,
    currentStock: 34,
    reorderLevel: 25,
    leadTimeDays: 2,
    safetyStock: 10,
    isActive: true,
  },
  {
    id: 'PROD-HH-03',
    name: 'Harpic Power Plus 10X Toilet Cleaner 500ml',
    category: 'Household Essentials',
    unit: 'bottle',
    costPrice: 82,
    sellingPrice: 105,
    currentStock: 18,
    reorderLevel: 12,
    leadTimeDays: 3,
    safetyStock: 5,
    isActive: true,
  },
  {
    id: 'PROD-HH-04',
    name: 'Lizol Disinfectant Surface Cleaner Citrus 500ml',
    category: 'Household Essentials',
    unit: 'bottle',
    costPrice: 88,
    sellingPrice: 115,
    currentStock: 15,
    reorderLevel: 12,
    leadTimeDays: 3,
    safetyStock: 5,
    isActive: true,
  },
  {
    id: 'PROD-HH-05',
    name: 'Good Knight Gold Flash Liquid Mosquito Vaporizer Refill 45ml',
    category: 'Household Essentials',
    unit: 'pack',
    costPrice: 72,
    sellingPrice: 95,
    currentStock: 22,
    reorderLevel: 15,
    leadTimeDays: 3,
    safetyStock: 6,
    isActive: true,
  },
];

/**
 * Generate 90 days of synthetic but realistic transactions.
 * Designed deterministically so repeated calls produce the exact same numbers.
 */
export function generateSyntheticStoreData(seed = 42): StoreDataset {
  const rng = new SeededRandom(seed);
  const products = INITIAL_PRODUCTS.map((p) => ({ ...p }));

  // Generate synthetic customers
  const customers: Customer[] = [];
  const customerCount = 420;
  const segments: Customer['segment'][] = [
    'VIP / Champion',
    'Loyal Regular',
    'Loyal Regular',
    'Occasional Buyer',
    'Occasional Buyer',
    'Occasional Buyer',
    'At-Risk / Lapsed',
    'New Buyer',
  ];

  for (let i = 1; i <= customerCount; i++) {
    const pad = String(i).padStart(4, '0');
    const segment = segments[i % segments.length];
    customers.push({
      id: `CUST-${pad}`,
      displayName: `Customer #${pad}`,
      phoneMasked: `+91 98${rng.range(10, 99)}X XX${rng.range(10, 99)}`,
      firstPurchaseDate: '2026-07-20',
      lastPurchaseDate: '2026-10-18',
      totalOrders: 0,
      totalSpend: 0,
      segment,
    });
  }

  // Anchor date: 2026-10-19 (90 days window starts ~2026-07-21)
  const anchorDate = new Date('2026-10-19T20:00:00Z');
  const orders: Order[] = [];
  let orderCounter = 1000;

  const channels: Order['channel'][] = [
    'In-Store Walk-in',
    'In-Store Walk-in',
    'In-Store Walk-in',
    'UPI QR Delivery',
    'WhatsApp / Phone Order',
  ];

  const paymentMethods: Order['paymentMethod'][] = [
    'Paytm UPI QR',
    'Paytm UPI QR',
    'Cash',
    'Paytm Card Machine',
    'Khata / Credit',
  ];

  // Specific affinity pairing: Parle-G + Tata Tea Premium
  const teaId = 'PROD-BEV-01';
  const biscuitId = 'PROD-SNK-02';

  // Specific decline product: Maggi (stockout caused severe drop in recent 7 days)
  const maggiId = 'PROD-SNK-01';

  for (let dayOffset = 89; dayOffset >= 0; dayOffset--) {
    const currentDate = new Date(anchorDate);
    currentDate.setDate(currentDate.getDate() - dayOffset);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Day of week factor: Saturday (6) and Sunday (0) have higher footfall
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseOrdersToday = isWeekend ? rng.range(38, 48) : rng.range(28, 36);

    // Purposeful Scenario: Recent 7 days had lower sales due to heavy rain & Maggi/Milk stockouts
    const isRecent7Days = dayOffset < 7;
    const dailyOrderTarget = isRecent7Days ? Math.floor(baseOrdersToday * 0.82) : baseOrdersToday;

    for (let o = 0; o < dailyOrderTarget; o++) {
      orderCounter++;
      const orderId = `ORD-${orderCounter}`;

      // Pick customer based on segment weights
      let customer = rng.choice(customers);
      // For At-Risk / Lapsed customers, ensure they haven't shopped in last 25 days
      if (customer.segment === 'At-Risk / Lapsed' && dayOffset < 25) {
        // Fallback to a loyal or regular customer
        customer = customers.find((c) => c.segment === 'Loyal Regular') || customers[0];
      }

      const channel = rng.choice(channels);
      const paymentMethod = rng.choice(paymentMethods);

      // Basket size: 1 to 5 items
      const basketSize = rng.range(1, 4);
      const selectedItems: OrderItem[] = [];
      const pickedProductIds = new Set<string>();

      // Pairing scenario: 40% chance of pairing Tea & Parle-G together in morning/afternoon baskets
      if (rng.next() < 0.38) {
        const teaProd = products.find((p) => p.id === teaId)!;
        const biscuitProd = products.find((p) => p.id === biscuitId)!;

        selectedItems.push({
          productId: teaProd.id,
          productName: teaProd.name,
          category: teaProd.category,
          quantity: 1,
          unitCost: teaProd.costPrice,
          unitPrice: teaProd.sellingPrice,
          itemDiscount: 0,
          netRevenue: teaProd.sellingPrice,
          estimatedGrossProfit: teaProd.sellingPrice - teaProd.costPrice,
        });
        pickedProductIds.add(teaProd.id);

        selectedItems.push({
          productId: biscuitProd.id,
          productName: biscuitProd.name,
          category: biscuitProd.category,
          quantity: rng.range(1, 2),
          unitCost: biscuitProd.costPrice,
          unitPrice: biscuitProd.sellingPrice,
          itemDiscount: 0,
          netRevenue: biscuitProd.sellingPrice * rng.range(1, 2),
          estimatedGrossProfit: (biscuitProd.sellingPrice - biscuitProd.costPrice) * rng.range(1, 2),
        });
        pickedProductIds.add(biscuitProd.id);
      }

      while (selectedItems.length < basketSize) {
        const prod = rng.choice(products);
        if (pickedProductIds.has(prod.id)) continue;

        // In recent 7 days, Maggi is out of stock / rarely purchased!
        if (isRecent7Days && prod.id === maggiId && rng.next() > 0.15) {
          continue;
        }

        // Rajma is a slow mover - rarely picked
        if (prod.id === 'PROD-STP-07' && rng.next() > 0.08) {
          continue;
        }

        // Kellogg's Almond Honey is a slow mover
        if (prod.id === 'PROD-SNK-08' && rng.next() > 0.12) {
          continue;
        }

        pickedProductIds.add(prod.id);
        const qty = rng.range(1, prod.category === 'Dairy & Bakery' ? 3 : 2);

        // Margin Leakage Scenario: Fortune Oil has occasional ₹5 discount
        let itemDiscount = 0;
        if (prod.id === 'PROD-STP-02' && rng.next() < 0.4) {
          itemDiscount = 5 * qty;
        }

        const netRev = Math.max(0, qty * prod.sellingPrice - itemDiscount);
        const grossProf = netRev - qty * prod.costPrice;

        selectedItems.push({
          productId: prod.id,
          productName: prod.name,
          category: prod.category,
          quantity: qty,
          unitCost: prod.costPrice,
          unitPrice: prod.sellingPrice,
          itemDiscount,
          netRevenue: netRev,
          estimatedGrossProfit: grossProf,
        });
      }

      const subtotal = selectedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const totalDiscount = selectedItems.reduce((sum, item) => sum + item.itemDiscount, 0);
      const netTotal = selectedItems.reduce((sum, item) => sum + item.netRevenue, 0);
      const grossProfit = selectedItems.reduce((sum, item) => sum + item.estimatedGrossProfit, 0);

      // Customer stats update
      customer.totalOrders += 1;
      customer.totalSpend += netTotal;
      if (customer.firstPurchaseDate > dateStr) {
        customer.firstPurchaseDate = dateStr;
      }
      if (customer.lastPurchaseDate < dateStr) {
        customer.lastPurchaseDate = dateStr;
      }

      orders.push({
        id: orderId,
        orderDate: dateStr,
        customerId: customer.id,
        customerName: customer.displayName,
        channel,
        status: 'Completed',
        paymentMethod,
        items: selectedItems,
        subtotal,
        orderDiscount: totalDiscount,
        netTotal,
        grossProfit,
      });
    }
  }

  return {
    storeName: 'Shree Ganesh Kirana & General Store',
    storeLocation: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038',
    storeType: 'Neighborhood Kirana & FMCG Retail',
    generatedDate: '2026-10-19',
    products,
    customers,
    orders,
  };
}

// Singleton cached demo dataset
let _cachedDataset: StoreDataset | null = null;

export function getDemoStoreData(): StoreDataset {
  if (!_cachedDataset) {
    _cachedDataset = generateSyntheticStoreData(42);
  }
  return _cachedDataset;
}

export function resetDemoStoreData(): StoreDataset {
  _cachedDataset = generateSyntheticStoreData(42);
  return _cachedDataset;
}
