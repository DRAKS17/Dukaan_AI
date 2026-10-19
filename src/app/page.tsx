'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  IndianRupee,
  Package,
  AlertTriangle,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  calculateKPISummary,
  calculateDailySales,
  calculateCategoryBreakdown,
  calculateTopProducts,
  resolveDateRange,
} from '@/lib/analytics/engine';
import { formatINR, formatPercent, formatNumber } from '@/lib/utils/formatters';
import { SalesTrendChart } from '@/components/charts/SalesTrendChart';
import { CategoryBreakdownChart } from '@/components/charts/CategoryBreakdownChart';

export default function OverviewDashboardPage() {
  const { dataset, timeRange, recommendations } = useStore();

  const kpis = calculateKPISummary(dataset, timeRange);
  const dailySales = calculateDailySales(dataset, timeRange);
  const categories = calculateCategoryBreakdown(dataset, timeRange);
  const topProducts = calculateTopProducts(dataset, timeRange, 6);
  const { startDate, endDate, priorStartDate, priorEndDate, daysInPeriod } = resolveDateRange(
    dataset.orders,
    timeRange
  );

  const topRec = recommendations[0];

  const quickPrompts = [
    { text: 'Why did my sales decline?', intent: 'SALES_DECLINE' },
    { text: 'What should I restock today?', intent: 'RESTOCK_RECOMMENDATION' },
    { text: 'Which products give the highest profit?', intent: 'GROSS_MARGIN_ANALYSIS' },
    { text: 'Is offering a discount on oil a good idea?', intent: 'MARGIN_LEAKAGE' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: AI Growth Alert & Quick Prompt Trigger */}
      {topRec && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-800 px-2 py-0.5 rounded-md">
                  Action Required • {topRec.priority}
                </span>
                <span className="text-xs text-slate-500">DukaanAI Diagnostic</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                {topRec.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
                {topRec.shortSummary}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/recommendations"
              className="text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-3 py-2 rounded-lg transition-all shadow-xs"
            >
              View Evidence
            </Link>
            <Link
              href={`/assistant?q=${encodeURIComponent(
                topRec.category === 'LOW_STOCK'
                  ? 'Which products should I restock right now?'
                  : topRec.category === 'SALES_DECLINE'
                  ? 'Why did my sales decline?'
                  : 'What should I focus on today?'
              )}`}
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Copilot</span>
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Business Performance Overview
            </h2>
            <p className="text-xs text-slate-500">
              Comparing {startDate} – {endDate} with prior {daysInPeriod}-day period ({priorStartDate} – {priorEndDate})
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md hidden sm:inline-block">
            Verified Store Calculations
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Net Sales Revenue */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Net Sales Revenue</span>
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatINR(kpis.netSalesRevenue)}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs">
              {kpis.salesChangePercent >= 0 ? (
                <span className="flex items-center text-emerald-600 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {formatPercent(kpis.salesChangePercent)}
                </span>
              ) : (
                <span className="flex items-center text-rose-600 font-semibold">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {formatPercent(kpis.salesChangePercent)}
                </span>
              )}
              <span className="text-slate-400">vs prior period</span>
            </div>
          </div>

          {/* Card 2: Estimated Gross Profit & Margin */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Gross Profit (Est.)</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatINR(kpis.estimatedGrossProfit)}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {kpis.grossMarginPercent.toFixed(1)}% Margin
              </span>
              <span className="text-slate-400">
                {kpis.marginChangePoints >= 0 ? '+' : ''}
                {kpis.marginChangePoints.toFixed(1)} pts
              </span>
            </div>
          </div>

          {/* Card 3: Orders & AOV */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Orders & Avg Value</span>
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatNumber(kpis.orderCount)}
              </span>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                AOV: {formatINR(kpis.averageOrderValue)}
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs">
              {kpis.orderChangePercent >= 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {formatPercent(kpis.orderChangePercent)}
                </span>
              ) : (
                <span className="text-rose-600 font-semibold flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {formatPercent(kpis.orderChangePercent)}
                </span>
              )}
              <span className="text-slate-400">order volume</span>
            </div>
          </div>

          {/* Card 4: Inventory Health Risk */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Inventory Stock Alerts</span>
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                {kpis.criticalStockProductCount + kpis.lowStockProductCount}
              </span>
              <span className="text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold">
                {kpis.criticalStockProductCount} Critical
              </span>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href="/inventory"
                className="text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-0.5"
              >
                <span>Restock list</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-400 font-medium">
                {kpis.repeatCustomerRate.toFixed(0)}% repeat buyers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Sales Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Profit Trend */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Daily Sales & Gross Profit Trend
              </h3>
              <p className="text-xs text-slate-500">
                Observed cash & UPI sales volume day-by-day
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-sky-600 inline-block"></span>
                <span className="text-slate-600">Net Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                <span className="text-slate-600">Gross Profit</span>
              </div>
            </div>
          </div>
          <SalesTrendChart data={dailySales} />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Revenue by Category</h3>
              <p className="text-xs text-slate-500">Contribution and estimated margins</p>
            </div>
            <Link
              href="/sales"
              className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-0.5"
            >
              <span>Details</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <CategoryBreakdownChart data={categories} />
        </div>
      </div>

      {/* Bottom Section: Top Products Table & Conversational AI Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Products Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Top Revenue Drivers ({daysInPeriod} Days)
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by net revenue contribution and inventory status
              </p>
            </div>
            <Link
              href="/inventory"
              className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1"
            >
              <span>All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Product Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Units Sold</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Revenue</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Margin %</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{p.revenueRank}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[200px] truncate">
                      {p.productName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{p.category}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                      {p.unitsSold}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                      {formatINR(p.revenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`font-semibold ${
                          p.marginPercent >= 20
                            ? 'text-emerald-700'
                            : p.marginPercent >= 10
                            ? 'text-slate-700'
                            : 'text-rose-600'
                        }`}
                      >
                        {p.marginPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.stockHealth === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : p.stockHealth === 'Low Stock'
                            ? 'bg-amber-100 text-amber-800'
                            : p.stockHealth === 'Slow Moving'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stockHealth} ({p.currentStock})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Conversational AI Questions */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold tracking-tight text-white">
                DukaanAI Business Assistant
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask your shop assistant natural language questions. Every answer is grounded directly in your verified store transaction records.
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Common Merchant Questions:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <Link
                  key={idx}
                  href={`/assistant?q=${encodeURIComponent(prompt.text)}`}
                  className="block text-xs bg-slate-800/80 hover:bg-sky-900/60 text-slate-200 hover:text-white border border-slate-700/60 p-2.5 rounded-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span>"{prompt.text}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> No Hallucinated Metrics
            </span>
            <Link
              href="/assistant"
              className="font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
            >
              Open Full Chat <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
