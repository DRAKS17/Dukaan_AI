/**
 * DukaanAI - Merchant Intent Classifier
 * Accurately detects business questions from Indian Kirana shopkeepers.
 */

export type MerchantIntent =
  | 'SALES_SUMMARY'
  | 'SALES_DECLINE'
  | 'RESTOCK_RECOMMENDATION'
  | 'GROSS_MARGIN_ANALYSIS'
  | 'SLOW_MOVING'
  | 'PRODUCT_BUNDLE'
  | 'MARGIN_LEAKAGE'
  | 'CUSTOMER_RETENTION'
  | 'PRIORITIZED_ACTIONS'
  | 'GENERAL_HELP';

export interface ClassifiedIntent {
  intent: MerchantIntent;
  confidence: number;
  extractedEntity?: string;
  timeRange: '7d' | '30d' | '90d';
}

export function classifyMerchantQuestion(question: string): ClassifiedIntent {
  const q = question.toLowerCase().trim();

  // Detect time frame
  let timeRange: '7d' | '30d' | '90d' = '7d';
  if (q.includes('month') || q.includes('30 day') || q.includes('past month')) {
    timeRange = '30d';
  } else if (q.includes('quarter') || q.includes('90 day') || q.includes('3 month')) {
    timeRange = '90d';
  }

  // Priority Actions / What to do today
  if (
    q.includes('what should i do') ||
    q.includes('focus on today') ||
    q.includes('action today') ||
    q.includes('priorities') ||
    q.includes('what to do today') ||
    q.includes('today plan')
  ) {
    return { intent: 'PRIORITIZED_ACTIONS', confidence: 0.95, timeRange };
  }

  // Sales Decline / Why lower
  if (
    (q.includes('why') && (q.includes('decline') || q.includes('drop') || q.includes('fall') || q.includes('down') || q.includes('lower') || q.includes('fell'))) ||
    q.includes('falling sales') ||
    q.includes('sales lower') ||
    q.includes('revenue down') ||
    q.includes('why are sales') ||
    q.includes('loss in sales')
  ) {
    return { intent: 'SALES_DECLINE', confidence: 0.95, timeRange };
  }

  // Restock / Low stock / Inventory
  if (
    q.includes('restock') ||
    q.includes('out of stock') ||
    q.includes('low stock') ||
    q.includes('stock run out') ||
    q.includes('running low') ||
    q.includes('inventory health') ||
    q.includes('what to order') ||
    q.includes('items to reorder')
  ) {
    return { intent: 'RESTOCK_RECOMMENDATION', confidence: 0.95, timeRange };
  }

  // Margins / Gross profit / Highest profit
  if (
    q.includes('margin') ||
    q.includes('highest profit') ||
    q.includes('most profitable') ||
    q.includes('best margin') ||
    q.includes('high profit') ||
    q.includes('profitability')
  ) {
    return { intent: 'GROSS_MARGIN_ANALYSIS', confidence: 0.95, timeRange };
  }

  // Slow moving / Dead stock
  if (
    q.includes('slow') ||
    q.includes('not selling') ||
    q.includes('stuck') ||
    q.includes('dead stock') ||
    q.includes('tied up')
  ) {
    return { intent: 'SLOW_MOVING', confidence: 0.95, timeRange };
  }

  // Bundling / Frequently bought together
  if (
    q.includes('together') ||
    q.includes('bundle') ||
    q.includes('combo') ||
    q.includes('pair') ||
    q.includes('cross-sell') ||
    q.includes('bought together')
  ) {
    return { intent: 'PRODUCT_BUNDLE', confidence: 0.95, timeRange };
  }

  // Margin leakage / Discounting
  if (
    q.includes('discount') ||
    q.includes('leakage') ||
    q.includes('losing margin') ||
    q.includes('is offering a discount') ||
    q.includes('reduce price')
  ) {
    return { intent: 'MARGIN_LEAKAGE', confidence: 0.92, timeRange };
  }

  // Customer retention / Lapsed buyers
  if (
    q.includes('customer') ||
    q.includes('repeat') ||
    q.includes('stopped returning') ||
    q.includes('haven\'t visited') ||
    q.includes('lapsed') ||
    q.includes('retention') ||
    q.includes('regular buyer')
  ) {
    return { intent: 'CUSTOMER_RETENTION', confidence: 0.93, timeRange };
  }

  // Sales Summary / Total sales
  if (
    q.includes('how much') ||
    q.includes('sales') ||
    q.includes('revenue') ||
    q.includes('orders') ||
    q.includes('summary') ||
    q.includes('performance')
  ) {
    return { intent: 'SALES_SUMMARY', confidence: 0.9, timeRange };
  }

  return { intent: 'GENERAL_HELP', confidence: 0.5, timeRange };
}
