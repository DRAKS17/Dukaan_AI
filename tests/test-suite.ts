/**
 * DukaanAI - Automated Verification & Test Suite
 * Tests analytical calculations, intent routing, grounding accuracy, and CSV validation.
 */

import { getDemoStoreData } from '../src/lib/data/sample-data';
import {
  calculateKPISummary,
  calculateInventoryHealth,
  calculateCategoryBreakdown,
  calculateTopProducts,
  resolveDateRange,
} from '../src/lib/analytics/engine';
import { classifyMerchantQuestion } from '../src/lib/ai/intent-classifier';
import { buildGroundedAnalysis } from '../src/lib/ai/grounding';
import { validateProductsCsv, SAMPLE_PRODUCTS_CSV } from '../src/lib/validation/csv-parser';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    throw new Error(`Assertion failed: ${testName}`);
  } else {
    console.log(`✅ PASSED: ${testName}`);
  }
}

async function runAllTests() {
  console.log('\n=============================================');
  console.log('🧪 DUKAANAI AUTOMATED ENGINE VERIFICATION');
  console.log('=============================================\n');

  const dataset = getDemoStoreData();

  // Test 1: Dataset Integrity
  console.log('[1/4] Verifying Demo Dataset Structure...');
  assert(dataset.products.length >= 30, 'Contains at least 30 distinct products');
  assert(dataset.orders.length >= 2000, 'Contains at least 2,000 synthetic orders');
  assert(dataset.customers.length >= 300, 'Contains at least 300 synthetic customers');

  // Test 2: Analytical Calculations
  console.log('\n[2/4] Verifying Core Business Calculations...');
  const kpis7d = calculateKPISummary(dataset, '7d');
  assert(kpis7d.netSalesRevenue > 0, 'Net sales revenue is strictly positive');
  assert(kpis7d.estimatedGrossProfit > 0, 'Estimated gross profit is positive');
  assert(
    kpis7d.grossMarginPercent > 5 && kpis7d.grossMarginPercent < 45,
    `Gross margin % is realistic (${kpis7d.grossMarginPercent.toFixed(1)}%)`
  );
  assert(kpis7d.orderCount > 0, 'Order count is greater than 0');
  assert(kpis7d.averageOrderValue > 0, 'AOV is greater than 0');
  assert(
    Math.abs(kpis7d.averageOrderValue - kpis7d.netSalesRevenue / kpis7d.orderCount) < 0.01,
    'AOV exactly matches Net Sales / Order Count formula'
  );
  assert(
    kpis7d.repeatCustomerRate > 0 && kpis7d.repeatCustomerRate <= 100,
    `Repeat customer rate is valid percentage (${kpis7d.repeatCustomerRate.toFixed(1)}%)`
  );

  // Test 3: Inventory Health & Stockout Alerts
  const inventory = calculateInventoryHealth(dataset, '7d');
  const criticalItems = inventory.filter((i) => i.stockHealth === 'Critical' || i.stockHealth === 'Out of Stock');
  assert(criticalItems.length > 0, 'Detects critical stockout risk items (e.g. Maggi/Milk)');
  assert(
    criticalItems.some((i) => i.daysOfStockRemaining <= 2),
    'Critical items accurately reflect <= 2 days of stock remaining'
  );

  // Test 4: Intent Classification Grounding
  console.log('\n[3/4] Verifying Intent Classifier & Grounding...');
  const intent1 = classifyMerchantQuestion('Why did my sales decline this week?');
  assert(intent1.intent === 'SALES_DECLINE', 'Routes decline query to SALES_DECLINE');

  const intent2 = classifyMerchantQuestion('Which products should I restock?');
  assert(intent2.intent === 'RESTOCK_RECOMMENDATION', 'Routes restock query to RESTOCK_RECOMMENDATION');

  const intent3 = classifyMerchantQuestion('What should I focus on today?');
  assert(intent3.intent === 'PRIORITIZED_ACTIONS', 'Routes daily plan query to PRIORITIZED_ACTIONS');

  const intent4 = classifyMerchantQuestion('Is offering a discount on oil a good idea?');
  assert(intent4.intent === 'MARGIN_LEAKAGE', 'Routes oil discount question to MARGIN_LEAKAGE');

  const groundedDecline = buildGroundedAnalysis(dataset, intent1);
  assert(groundedDecline.facts.length > 0, 'Grounded analysis contains verified facts');
  assert(groundedDecline.evidencePoints.length > 0, 'Grounded analysis contains evidence points');
  assert(groundedDecline.suggestedAction.length > 0, 'Grounded analysis contains actionable step');

  // Test 5: CSV Parsing & Schema Validation
  console.log('\n[4/4] Verifying CSV Parsing & Validation Engine...');
  const sampleValidation = validateProductsCsv(SAMPLE_PRODUCTS_CSV);
  assert(sampleValidation.success === true, 'Sample Products CSV passes 100% validation');
  assert(sampleValidation.validRowsCount === 7, 'Parsed all 7 sample products');

  const invalidCsv = `product_id,product_name,category,cost_price,selling_price,current_stock\nPROD-BAD,,InvalidCategory,-50,20,-10`;
  const invalidValidation = validateProductsCsv(invalidCsv);
  assert(invalidValidation.success === false, 'Detects invalid rows in bad CSV');
  assert(invalidValidation.errors.length >= 3, 'Reports multiple row-level validation errors');

  console.log('\n=============================================');
  console.log('🎉 ALL 15 VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('=============================================\n');
}

runAllTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
