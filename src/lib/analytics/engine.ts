/**
 * DukaanAI - Authoritative Analytics Engine
 * Reusable, mathematically grounded calculations across the dashboard, recommendations, and AI assistant.
 */

import {
  StoreDataset,
  TimeRange,
  KPISummary,
  CategoryBreakdown,
  TopProductMetric,
  DailySalesMetric,
  InventoryItem,
  ProductAffinityPair,
  ProductCategory,
  Order,
} from '@/types';

export interface DateRangeFilter {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  priorStartDate: string;
  priorEndDate: string;
  daysInPeriod: number;
}

/**
 * Compute the date ranges for current and prior comparison periods.
 */
export function resolveDateRange(
  orders: Order[],
  timeRange: TimeRange = '7d',
  customStart?: string,
  customEnd?: string
): DateRangeFilter {
  if (orders.length === 0) {
    const today = new Date().toISOString().split('T')[0];
    return {
      startDate: today,
      endDate: today,
      priorStartDate: today,
      priorEndDate: today,
      daysInPeriod: 1,
    };
  }

  // Find max date in dataset
  const sortedDates = [...orders].map((o) => o.orderDate).sort();
  const maxDateStr = sortedDates[sortedDates.length - 1];
  const maxDate = new Date(maxDateStr + 'T23:59:59Z');

  let days = 7;
  if (timeRange === '30d') days = 30;
  if (timeRange === '90d') days = 90;

  if (timeRange === 'custom' && customStart && customEnd) {
    const start = new Date(customStart + 'T00:00:00Z');
    const end = new Date(customEnd + 'T23:59:59Z');
    const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    const priorEnd = new Date(start);
    priorEnd.setDate(priorEnd.getDate() - 1);
    const priorStart = new Date(priorEnd);
    priorStart.setDate(priorStart.getDate() - diffDays + 1);

    return {
      startDate: customStart,
      endDate: customEnd,
      priorStartDate: priorStart.toISOString().split('T')[0],
      priorEndDate: priorEnd.toISOString().split('T')[0],
      daysInPeriod: diffDays,
    };
  }

  // Current period
  const curEnd = new Date(maxDate);
  const curStart = new Date(maxDate);
  curStart.setDate(curStart.getDate() - (days - 1));

  // Prior period of exactly equal length
  const priorEnd = new Date(curStart);
  priorEnd.setDate(priorEnd.getDate() - 1);
  const priorStart = new Date(priorEnd);
  priorStart.setDate(priorStart.getDate() - (days - 1));

  return {
    startDate: curStart.toISOString().split('T')[0],
    endDate: curEnd.toISOString().split('T')[0],
    priorStartDate: priorStart.toISOString().split('T')[0],
    priorEndDate: priorEnd.toISOString().split('T')[0],
    daysInPeriod: days,
  };
}

/**
 * Filter orders between two date strings (inclusive)
 */
export function filterOrdersBetween(orders: Order[], start: string, end: string): Order[] {
  return orders.filter(
    (o) => o.status === 'Completed' && o.orderDate >= start && o.orderDate <= end
  );
}

/**
 * Calculate KPI Summary comparing current period to prior equal period
 */
export function calculateKPISummary(
  dataset: StoreDataset,
  timeRange: TimeRange = '7d',
  customStart?: string,
  customEnd?: string
): KPISummary {
  const { startDate, endDate, priorStartDate, priorEndDate } = resolveDateRange(
    dataset.orders,
    timeRange,
    customStart,
    customEnd
  );

  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);
  const priorOrders = filterOrdersBetween(dataset.orders, priorStartDate, priorEndDate);

  // Current metrics
  const netSalesRevenue = currentOrders.reduce((sum, o) => sum + o.netTotal, 0);
  const orderCount = currentOrders.length;
  const averageOrderValue = orderCount > 0 ? netSalesRevenue / orderCount : 0;
  const estimatedGrossProfit = currentOrders.reduce((sum, o) => sum + o.grossProfit, 0);
  const grossMarginPercent =
    netSalesRevenue > 0 ? (estimatedGrossProfit / netSalesRevenue) * 100 : 0;

  let totalUnitsSold = 0;
  currentOrders.forEach((o) => {
    o.items.forEach((item) => {
      totalUnitsSold += item.quantity;
    });
  });

  // Prior metrics
  const priorNetSalesRevenue = priorOrders.reduce((sum, o) => sum + o.netTotal, 0);
  const priorOrderCount = priorOrders.length;
  const priorAverageOrderValue =
    priorOrderCount > 0 ? priorNetSalesRevenue / priorOrderCount : 0;
  const priorEstimatedGrossProfit = priorOrders.reduce((sum, o) => sum + o.grossProfit, 0);
  const priorGrossMarginPercent =
    priorNetSalesRevenue > 0 ? (priorEstimatedGrossProfit / priorNetSalesRevenue) * 100 : 0;

  // Percentage changes
  const salesChangePercent =
    priorNetSalesRevenue > 0
      ? ((netSalesRevenue - priorNetSalesRevenue) / priorNetSalesRevenue) * 100
      : 0;
  const salesChangeAbsolute = netSalesRevenue - priorNetSalesRevenue;

  const orderChangePercent =
    priorOrderCount > 0
      ? ((orderCount - priorOrderCount) / priorOrderCount) * 100
      : 0;

  const aovChangePercent =
    priorAverageOrderValue > 0
      ? ((averageOrderValue - priorAverageOrderValue) / priorAverageOrderValue) * 100
      : 0;

  const profitChangePercent =
    priorEstimatedGrossProfit > 0
      ? ((estimatedGrossProfit - priorEstimatedGrossProfit) / priorEstimatedGrossProfit) * 100
      : 0;

  const marginChangePoints = grossMarginPercent - priorGrossMarginPercent;

  // Inventory health counts
  const inventoryItems = calculateInventoryHealth(dataset, timeRange);
  const criticalStockProductCount = inventoryItems.filter(
    (i) => i.stockHealth === 'Critical' || i.stockHealth === 'Out of Stock'
  ).length;
  const lowStockProductCount = inventoryItems.filter((i) => i.stockHealth === 'Low Stock').length;

  // Repeat customer rate
  const curCustomerOrderCounts = new Map<string, number>();
  currentOrders.forEach((o) => {
    curCustomerOrderCounts.set(o.customerId, (curCustomerOrderCounts.get(o.customerId) || 0) + 1);
  });
  const uniqueActiveCustomers = curCustomerOrderCounts.size;
  let repeatCustomers = 0;
  curCustomerOrderCounts.forEach((count) => {
    if (count >= 2) repeatCustomers++;
  });
  const repeatCustomerRate =
    uniqueActiveCustomers > 0 ? (repeatCustomers / uniqueActiveCustomers) * 100 : 0;

  // Prior repeat rate
  const priorCustomerOrderCounts = new Map<string, number>();
  priorOrders.forEach((o) => {
    priorCustomerOrderCounts.set(o.customerId, (priorCustomerOrderCounts.get(o.customerId) || 0) + 1);
  });
  let priorRepeatCustomers = 0;
  priorCustomerOrderCounts.forEach((count) => {
    if (count >= 2) priorRepeatCustomers++;
  });
  const priorRepeatCustomerRate =
    priorCustomerOrderCounts.size > 0
      ? (priorRepeatCustomers / priorCustomerOrderCounts.size) * 100
      : 0;

  return {
    netSalesRevenue,
    priorNetSalesRevenue,
    salesChangePercent,
    salesChangeAbsolute,
    orderCount,
    priorOrderCount,
    orderChangePercent,
    averageOrderValue,
    priorAverageOrderValue,
    aovChangePercent,
    estimatedGrossProfit,
    priorEstimatedGrossProfit,
    profitChangePercent,
    grossMarginPercent,
    priorGrossMarginPercent,
    marginChangePoints,
    totalUnitsSold,
    lowStockProductCount,
    criticalStockProductCount,
    uniqueActiveCustomers,
    repeatCustomerRate,
    priorRepeatCustomerRate,
  };
}

/**
 * Breakdown revenue and margins by product category
 */
export function calculateCategoryBreakdown(
  dataset: StoreDataset,
  timeRange: TimeRange = '7d'
): CategoryBreakdown[] {
  const { startDate, endDate } = resolveDateRange(dataset.orders, timeRange);
  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);
  const totalRevenue = currentOrders.reduce((sum, o) => sum + o.netTotal, 0);

  const categoryMap = new Map<
    ProductCategory,
    { revenue: number; profit: number; unitsSold: number; orderCount: number }
  >();

  currentOrders.forEach((order) => {
    const seenCategoriesInOrder = new Set<ProductCategory>();
    order.items.forEach((item) => {
      const existing = categoryMap.get(item.category) || {
        revenue: 0,
        profit: 0,
        unitsSold: 0,
        orderCount: 0,
      };
      existing.revenue += item.netRevenue;
      existing.profit += item.estimatedGrossProfit;
      existing.unitsSold += item.quantity;
      categoryMap.set(item.category, existing);
      seenCategoriesInOrder.add(item.category);
    });

    seenCategoriesInOrder.forEach((cat) => {
      const catData = categoryMap.get(cat);
      if (catData) catData.orderCount += 1;
    });
  });

  const results: CategoryBreakdown[] = [];
  categoryMap.forEach((data, category) => {
    const marginPercent = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0;
    const revenueContributionPercent =
      totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0;
    results.push({
      category,
      revenue: data.revenue,
      profit: data.profit,
      unitsSold: data.unitsSold,
      orderCount: data.orderCount,
      marginPercent,
      revenueContributionPercent,
    });
  });

  return results.sort((a, b) => b.revenue - a.revenue);
}

/**
 * Top Products ranked by revenue
 */
export function calculateTopProducts(
  dataset: StoreDataset,
  timeRange: TimeRange = '7d',
  limit = 10
): TopProductMetric[] {
  const { startDate, endDate } = resolveDateRange(dataset.orders, timeRange);
  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);

  const productMap = new Map<
    string,
    { unitsSold: number; revenue: number; profit: number }
  >();

  currentOrders.forEach((o) => {
    o.items.forEach((item) => {
      const existing = productMap.get(item.productId) || {
        unitsSold: 0,
        revenue: 0,
        profit: 0,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += item.netRevenue;
      existing.profit += item.estimatedGrossProfit;
      productMap.set(item.productId, existing);
    });
  });

  const inventoryMap = new Map(calculateInventoryHealth(dataset, timeRange).map((i) => [i.id, i]));

  const metrics: TopProductMetric[] = [];
  productMap.forEach((stats, productId) => {
    const prod = dataset.products.find((p) => p.id === productId);
    if (!prod) return;
    const inv = inventoryMap.get(productId);
    const marginPercent = stats.revenue > 0 ? (stats.profit / stats.revenue) * 100 : 0;

    metrics.push({
      productId,
      productName: prod.name,
      category: prod.category,
      unitsSold: stats.unitsSold,
      revenue: stats.revenue,
      profit: stats.profit,
      marginPercent,
      currentStock: prod.currentStock,
      stockHealth: inv ? inv.stockHealth : 'Healthy',
      revenueRank: 0,
    });
  });

  metrics.sort((a, b) => b.revenue - a.revenue);
  metrics.forEach((m, idx) => {
    m.revenueRank = idx + 1;
  });

  return metrics.slice(0, limit);
}

/**
 * Daily sales trend for time-series charts
 */
export function calculateDailySales(
  dataset: StoreDataset,
  timeRange: TimeRange = '7d'
): DailySalesMetric[] {
  const { startDate, endDate } = resolveDateRange(dataset.orders, timeRange);
  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);

  const dailyMap = new Map<
    string,
    { revenue: number; profit: number; orderCount: number; unitsSold: number }
  >();

  // Initialize all dates in range
  const start = new Date(startDate + 'T00:00:00Z');
  const end = new Date(endDate + 'T00:00:00Z');
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    dailyMap.set(dateStr, { revenue: 0, profit: 0, orderCount: 0, unitsSold: 0 });
  }

  currentOrders.forEach((o) => {
    const entry = dailyMap.get(o.orderDate) || {
      revenue: 0,
      profit: 0,
      orderCount: 0,
      unitsSold: 0,
    };
    entry.revenue += o.netTotal;
    entry.profit += o.grossProfit;
    entry.orderCount += 1;
    o.items.forEach((item) => {
      entry.unitsSold += item.quantity;
    });
    dailyMap.set(o.orderDate, entry);
  });

  const result: DailySalesMetric[] = [];
  dailyMap.forEach((val, dateStr) => {
    const d = new Date(dateStr + 'T00:00:00Z');
    const formattedDate = d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
    result.push({
      date: dateStr,
      formattedDate,
      revenue: val.revenue,
      profit: val.profit,
      orderCount: val.orderCount,
      unitsSold: val.unitsSold,
    });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Compute inventory velocity, days of stock remaining, and stock health status
 */
export function calculateInventoryHealth(
  dataset: StoreDataset,
  timeRange: TimeRange = '7d'
): InventoryItem[] {
  const { startDate, endDate, daysInPeriod } = resolveDateRange(dataset.orders, timeRange);
  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);

  // Also calculate 30 days velocity for stable baseline
  const date30 = resolveDateRange(dataset.orders, '30d');
  const orders30 = filterOrdersBetween(dataset.orders, date30.startDate, date30.endDate);

  const unitsSoldCur = new Map<string, number>();
  currentOrders.forEach((o) => {
    o.items.forEach((i) => {
      unitsSoldCur.set(i.productId, (unitsSoldCur.get(i.productId) || 0) + i.quantity);
    });
  });

  const unitsSold30 = new Map<string, number>();
  orders30.forEach((o) => {
    o.items.forEach((i) => {
      unitsSold30.set(i.productId, (unitsSold30.get(i.productId) || 0) + i.quantity);
    });
  });

  return dataset.products.map((prod) => {
    const soldCur = unitsSoldCur.get(prod.id) || 0;
    const sold30 = unitsSold30.get(prod.id) || 0;

    const velocityCur = soldCur / Math.max(1, daysInPeriod);
    const velocity30 = sold30 / 30;

    // Use current velocity if active, else 30-day velocity
    const effectiveDailySales = velocityCur > 0 ? velocityCur : velocity30;

    let daysOfStockRemaining = 999;
    if (effectiveDailySales > 0) {
      daysOfStockRemaining = Math.max(0, prod.currentStock / effectiveDailySales);
    } else if (prod.currentStock === 0) {
      daysOfStockRemaining = 0;
    }

    // Health categorization
    let stockHealth: InventoryItem['stockHealth'] = 'Healthy';

    if (prod.currentStock <= 0) {
      stockHealth = 'Out of Stock';
    } else if (daysOfStockRemaining <= Math.max(1.5, prod.leadTimeDays)) {
      stockHealth = 'Critical';
    } else if (
      daysOfStockRemaining <= prod.leadTimeDays * 2 + prod.safetyStock / Math.max(1, effectiveDailySales) ||
      prod.currentStock <= prod.reorderLevel
    ) {
      stockHealth = 'Low Stock';
    } else if (effectiveDailySales === 0 && prod.currentStock > 0) {
      stockHealth = 'Slow Moving';
    } else if (daysOfStockRemaining > 45 && prod.currentStock > prod.safetyStock * 3) {
      stockHealth = 'Slow Moving';
    }

    // Reorder quantity formula:
    // Lead time demand + Safety Stock - Current Stock
    const leadTimeDemand = effectiveDailySales * prod.leadTimeDays;
    const targetInventory = leadTimeDemand + prod.safetyStock;
    const suggestedReorderQuantity = Math.max(0, Math.ceil(targetInventory - prod.currentStock));

    return {
      ...prod,
      salesVelocity7Days: Number(velocityCur.toFixed(2)),
      salesVelocity30Days: Number(velocity30.toFixed(2)),
      daysOfStockRemaining: Number(daysOfStockRemaining.toFixed(1)),
      stockHealth,
      suggestedReorderQuantity,
      capitalTiedUp: prod.currentStock * prod.costPrice,
    };
  });
}

/**
 * Identify product co-occurrence pairs for bundle promotions
 */
export function calculateProductAffinity(
  dataset: StoreDataset,
  timeRange: TimeRange = '30d'
): ProductAffinityPair[] {
  const { startDate, endDate } = resolveDateRange(dataset.orders, timeRange);
  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);

  const pairCounts = new Map<string, { count: number; prodA: string; prodB: string }>();
  const productOrderCounts = new Map<string, number>();

  currentOrders.forEach((o) => {
    const productIdsInOrder = Array.from(new Set(o.items.map((i) => i.productId)));
    productIdsInOrder.forEach((id) => {
      productOrderCounts.set(id, (productOrderCounts.get(id) || 0) + 1);
    });

    for (let i = 0; i < productIdsInOrder.length; i++) {
      for (let j = i + 1; j < productIdsInOrder.length; j++) {
        const id1 = productIdsInOrder[i];
        const id2 = productIdsInOrder[j];
        const key = id1 < id2 ? `${id1}___${id2}` : `${id2}___${id1}`;

        const existing = pairCounts.get(key) || {
          count: 0,
          prodA: id1 < id2 ? id1 : id2,
          prodB: id1 < id2 ? id2 : id1,
        };
        existing.count += 1;
        pairCounts.set(key, existing);
      }
    }
  });

  const pairs: ProductAffinityPair[] = [];
  pairCounts.forEach((val) => {
    if (val.count < 10) return; // Minimum frequency threshold
    const prodA = dataset.products.find((p) => p.id === val.prodA);
    const prodB = dataset.products.find((p) => p.id === val.prodB);
    if (!prodA || !prodB) return;

    const baseCountA = productOrderCounts.get(val.prodA) || 1;
    const affinityScore = Number(((val.count / baseCountA) * 100).toFixed(1));

    pairs.push({
      productAId: prodA.id,
      productAName: prodA.name,
      productBId: prodB.id,
      productBName: prodB.name,
      coOccurrenceCount: val.count,
      affinityScore,
      recommendedBundleName: `${prodA.name.split(' ')[0]} + ${prodB.name.split(' ')[0]} Value Pack`,
      combinedRevenue: prodA.sellingPrice + prodB.sellingPrice,
    });
  });

  return pairs.sort((a, b) => b.coOccurrenceCount - a.coOccurrenceCount);
}

/**
 * Identify products with falling sales in current vs prior period
 */
export function calculateDecliningProducts(
  dataset: StoreDataset,
  timeRange: TimeRange = '7d'
): Array<{
  product: TopProductMetric;
  currentRevenue: number;
  priorRevenue: number;
  revenueDrop: number;
  dropPercent: number;
  currentUnits: number;
  priorUnits: number;
}> {
  const { startDate, endDate, priorStartDate, priorEndDate } = resolveDateRange(
    dataset.orders,
    timeRange
  );

  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);
  const priorOrders = filterOrdersBetween(dataset.orders, priorStartDate, priorEndDate);

  const curMap = new Map<string, { revenue: number; units: number }>();
  currentOrders.forEach((o) => {
    o.items.forEach((item) => {
      const e = curMap.get(item.productId) || { revenue: 0, units: 0 };
      e.revenue += item.netRevenue;
      e.units += item.quantity;
      curMap.set(item.productId, e);
    });
  });

  const priorMap = new Map<string, { revenue: number; units: number }>();
  priorOrders.forEach((o) => {
    o.items.forEach((item) => {
      const e = priorMap.get(item.productId) || { revenue: 0, units: 0 };
      e.revenue += item.netRevenue;
      e.units += item.quantity;
      priorMap.set(item.productId, e);
    });
  });

  const topProducts = calculateTopProducts(dataset, timeRange, 50);
  const result: Array<{
    product: TopProductMetric;
    currentRevenue: number;
    priorRevenue: number;
    revenueDrop: number;
    dropPercent: number;
    currentUnits: number;
    priorUnits: number;
  }> = [];

  priorMap.forEach((priorData, productId) => {
    const curData = curMap.get(productId) || { revenue: 0, units: 0 };
    if (priorData.revenue > 300 && curData.revenue < priorData.revenue) {
      const revenueDrop = priorData.revenue - curData.revenue;
      const dropPercent = (revenueDrop / priorData.revenue) * 100;

      // Drop threshold > 15%
      if (dropPercent >= 15) {
        const prod = topProducts.find((p) => p.productId === productId);
        if (prod) {
          result.push({
            product: prod,
            currentRevenue: curData.revenue,
            priorRevenue: priorData.revenue,
            revenueDrop,
            dropPercent: Number(dropPercent.toFixed(1)),
            currentUnits: curData.units,
            priorUnits: priorData.units,
          });
        }
      }
    }
  });

  return result.sort((a, b) => b.revenueDrop - a.revenueDrop);
}
