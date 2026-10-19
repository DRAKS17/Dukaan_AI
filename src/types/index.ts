/**
 * DukaanAI - Unified Type Definitions
 * Covers Products, Inventory, Customers, Orders, Metrics, Recommendations, and AI Assistant
 */

export type ProductCategory =
  | 'Staples & Grains'
  | 'Packaged Foods & Snacks'
  | 'Dairy & Bakery'
  | 'Beverages & Tea'
  | 'Personal Care'
  | 'Household Essentials';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string; // e.g. "kg", "pack", "liter", "piece"
  costPrice: number; // in INR
  sellingPrice: number; // in INR
  currentStock: number;
  reorderLevel: number;
  leadTimeDays: number;
  safetyStock: number;
  barcode?: string;
  isActive: boolean;
}

export interface Customer {
  id: string; // Synthetic e.g. "CUST-1042"
  displayName: string; // Pseudonymous e.g. "Regular Buyer #42"
  phoneMasked: string; // e.g. "+91 98XXX XX142"
  firstPurchaseDate: string; // ISO date
  lastPurchaseDate: string; // ISO date
  totalOrders: number;
  totalSpend: number; // in INR
  segment: 'VIP / Champion' | 'Loyal Regular' | 'Occasional Buyer' | 'At-Risk / Lapsed' | 'New Buyer';
}

export interface OrderItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unitCost: number; // cost at time of sale
  unitPrice: number; // selling price at time of sale
  itemDiscount: number; // discount applied on this item in INR
  netRevenue: number; // (quantity * unitPrice) - itemDiscount
  estimatedGrossProfit: number; // netRevenue - (quantity * unitCost)
}

export interface Order {
  id: string; // e.g. "ORD-9021"
  orderDate: string; // ISO date string "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss"
  customerId: string;
  customerName?: string;
  channel: 'In-Store Walk-in' | 'WhatsApp / Phone Order' | 'UPI QR Delivery';
  status: 'Completed' | 'Refunded' | 'Cancelled';
  paymentMethod: 'Paytm UPI QR' | 'Paytm Card Machine' | 'Cash' | 'Khata / Credit';
  items: OrderItem[];
  subtotal: number;
  orderDiscount: number;
  netTotal: number;
  grossProfit: number;
}

export interface InventoryItem extends Product {
  salesVelocity7Days: number; // units sold / 7
  salesVelocity30Days: number; // units sold / 30
  daysOfStockRemaining: number;
  stockHealth: 'Healthy' | 'Low Stock' | 'Critical' | 'Out of Stock' | 'Slow Moving';
  suggestedReorderQuantity: number;
  capitalTiedUp: number; // currentStock * costPrice
}

export type TimeRange = '7d' | '30d' | '90d' | 'custom';

export interface KPISummary {
  netSalesRevenue: number;
  priorNetSalesRevenue: number;
  salesChangePercent: number;
  salesChangeAbsolute: number;

  orderCount: number;
  priorOrderCount: number;
  orderChangePercent: number;

  averageOrderValue: number;
  priorAverageOrderValue: number;
  aovChangePercent: number;

  estimatedGrossProfit: number;
  priorEstimatedGrossProfit: number;
  profitChangePercent: number;

  grossMarginPercent: number;
  priorGrossMarginPercent: number;
  marginChangePoints: number; // percentage points change

  totalUnitsSold: number;
  lowStockProductCount: number;
  criticalStockProductCount: number;
  
  uniqueActiveCustomers: number;
  repeatCustomerRate: number; // 0 - 100%
  priorRepeatCustomerRate: number;
}

export interface CategoryBreakdown {
  category: ProductCategory;
  revenue: number;
  profit: number;
  unitsSold: number;
  orderCount: number;
  marginPercent: number;
  revenueContributionPercent: number;
}

export interface TopProductMetric {
  productId: string;
  productName: string;
  category: ProductCategory;
  unitsSold: number;
  revenue: number;
  profit: number;
  marginPercent: number;
  currentStock: number;
  stockHealth: 'Healthy' | 'Low Stock' | 'Critical' | 'Out of Stock' | 'Slow Moving';
  revenueRank: number;
}

export interface DailySalesMetric {
  date: string; // YYYY-MM-DD
  formattedDate: string; // e.g. "12 Oct"
  revenue: number;
  profit: number;
  orderCount: number;
  unitsSold: number;
}

export type RecommendationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type RecommendationCategory =
  | 'LOW_STOCK'
  | 'SALES_DECLINE'
  | 'HIGH_MARGIN_PROMOTION'
  | 'SLOW_MOVING'
  | 'CUSTOMER_RETENTION'
  | 'PRODUCT_BUNDLE'
  | 'MARGIN_LEAKAGE';

export type RecommendationStatus = 'to_do' | 'in_progress' | 'completed' | 'dismissed';

export interface GrowthRecommendation {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  priorityScore: number; // 0 to 100 for deterministic sorting
  title: string;
  shortSummary: string;
  evidence: string[];
  metrics: {
    label: string;
    value: string;
    delta?: string;
  }[];
  suggestedAction: string;
  rationale: string;
  assumptions: string[];
  estimatedImpact?: string;
  targetEntityId?: string; // e.g. productId or customerId
  targetEntityName?: string;
  status: RecommendationStatus;
  updatedAt: string;
}

export interface ProductAffinityPair {
  productAId: string;
  productAName: string;
  productBId: string;
  productBName: string;
  coOccurrenceCount: number;
  affinityScore: number; // percentage of orders containing A that also contain B
  recommendedBundleName: string;
  combinedRevenue: number;
}

export interface MerchantChatContext {
  timeRange: TimeRange;
  kpis: KPISummary;
  topDecliningProducts: Array<{ name: string; dropPercent: number; revenueLoss: number }>;
  topGrowingProducts: Array<{ name: string; growthPercent: number; revenueGain: number }>;
  criticalInventoryItems: Array<{ name: string; daysLeft: number; currentStock: number }>;
  topMarginOpportunities: Array<{ name: string; marginPercent: number; revenue: number }>;
  atRiskCustomerCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: string;
  groundedFacts?: Array<{ label: string; value: string }>;
  suggestedFollowUps?: string[];
  recommendedActionId?: string;
  isFallback?: boolean;
}

export interface StoreDataset {
  storeName: string;
  storeLocation: string;
  storeType: string;
  generatedDate: string;
  products: Product[];
  customers: Customer[];
  orders: Order[];
}
