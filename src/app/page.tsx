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
  Info,
  ArrowUpRight,
  ArrowDownRight,
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
    { text: 'Which products give highest profit?', intent: 'GROSS_MARGIN_ANALYSIS' },
    { text: 'Is offering a discount on oil smart?', intent: 'MARGIN_LEAKAGE' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Action Required Insight (CollectiveOS Card Style) */}
      {topRec && (
        <div className="bg-white border border-[#EBEBEF] rounded-[20px] p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 mt-0.5 border border-[#FDE68A]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#18181B] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Priority Action • {topRec.priority}
                </span>
                <span className="text-[12px] font-medium text-[#71717A]">
                  DukaanAI Diagnostic Finding
                </span>
              </div>
              <h2 className="text-[17px] font-extrabold text-[#18181B] tracking-tight">
                {topRec.title}
              </h2>
              <p className="text-[13px] text-[#52525B] font-medium mt-0.5 max-w-2xl leading-relaxed">
                {topRec.shortSummary}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/recommendations"
              className="text-[13px] font-bold text-[#18181B] bg-white border border-[#EBEBEF] hover:bg-[#F4F4F6] px-4 py-2 rounded-full transition-colors"
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
              className="text-[13px] font-bold bg-[#18181B] hover:bg-black text-white px-5 py-2 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
              <span>Ask Copilot</span>
            </Link>
          </div>
        </div>
      )}

      {/* KPI Cards Grid (CollectiveOS Refined Style) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-[18px] font-extrabold text-[#18181B] tracking-tight">
              Business Performance Overview
            </h2>
            <p className="text-[12px] text-[#71717A] font-medium">
              Comparing {startDate} – {endDate} with prior {daysInPeriod}-day period ({priorStartDate} – {priorEndDate})
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#71717A] bg-white border border-[#EBEBEF] px-3 py-1 rounded-full hidden sm:inline-block">
            Verified Store Data
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Net Sales Revenue */}
          <div className="bg-white rounded-[20px] border border-[#EBEBEF] p-5 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-[#71717A] flex items-center gap-1.5 uppercase tracking-wider">
                Total Revenue
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4F4F6] flex items-center justify-center border border-[#EBEBEF]">
                {kpis.salesChangePercent >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-[#EF4444]" />
                )}
              </div>
            </div>
            <div className="text-[26px] font-extrabold text-[#18181B] tracking-tight mb-2.5">
              {formatINR(kpis.netSalesRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              {kpis.salesChangePercent >= 0 ? (
                <span className="text-[#10B981] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded-full">
                  {formatPercent(kpis.salesChangePercent)}
                </span>
              ) : (
                <span className="text-[#EF4444] bg-[#FEF2F2] border border-[#FEE2E2] px-2 py-0.5 rounded-full">
                  {formatPercent(kpis.salesChangePercent)}
                </span>
              )}
              <span className="text-[#71717A] font-medium">vs prior period</span>
            </div>
          </div>

          {/* Card 2: Estimated Gross Profit & Margin */}
          <div className="bg-white rounded-[20px] border border-[#EBEBEF] p-5 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-[#71717A] flex items-center gap-1.5 uppercase tracking-wider">
                Gross Profit (Est.)
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4F4F6] flex items-center justify-center border border-[#EBEBEF]">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
            </div>
            <div className="text-[26px] font-extrabold text-[#18181B] tracking-tight mb-2.5">
              {formatINR(kpis.estimatedGrossProfit)}
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-[#10B981] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded-full">
                {kpis.grossMarginPercent.toFixed(1)}% Margin
              </span>
              <span className="text-[#71717A] font-medium">
                {kpis.marginChangePoints >= 0 ? '+' : ''}
                {kpis.marginChangePoints.toFixed(1)} pts
              </span>
            </div>
          </div>

          {/* Card 3: Orders & AOV */}
          <div className="bg-white rounded-[20px] border border-[#EBEBEF] p-5 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-[#71717A] flex items-center gap-1.5 uppercase tracking-wider">
                Completed Orders
              </span>
              <div className="w-7 h-7 rounded-full bg-[#F4F4F6] flex items-center justify-center border border-[#EBEBEF]">
                <ShoppingBag className="w-3.5 h-3.5 text-[#71717A]" />
              </div>
            </div>
            <div className="text-[26px] font-extrabold text-[#18181B] tracking-tight mb-2.5 flex items-baseline justify-between">
              <span>{formatNumber(kpis.orderCount)}</span>
              <span className="text-[12px] font-bold text-[#0284C7] bg-[#F0F9FF] border border-[#BAE6FD] px-2.5 py-0.5 rounded-full">
                AOV: {formatINR(kpis.averageOrderValue)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold">
              {kpis.orderChangePercent >= 0 ? (
                <span className="text-[#10B981] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded-full">
                  {formatPercent(kpis.orderChangePercent)}
                </span>
              ) : (
                <span className="text-[#EF4444] bg-[#FEF2F2] border border-[#FEE2E2] px-2 py-0.5 rounded-full">
                  {formatPercent(kpis.orderChangePercent)}
                </span>
              )}
              <span className="text-[#71717A] font-medium">order volume</span>
            </div>
          </div>

          {/* Card 4: Inventory Alerts */}
          <div className="bg-white rounded-[20px] border border-[#EBEBEF] p-5 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-[#71717A] flex items-center gap-1.5 uppercase tracking-wider">
                Stockout Alerts
              </span>
              <div className="w-7 h-7 rounded-full bg-[#FEE2E2] flex items-center justify-center border border-[#FECACA]">
                <Package className="w-3.5 h-3.5 text-[#DC2626]" />
              </div>
            </div>
            <div className="text-[26px] font-extrabold text-[#DC2626] tracking-tight mb-2.5 flex items-baseline justify-between">
              <span>{kpis.criticalStockProductCount + kpis.lowStockProductCount}</span>
              <span className="text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FEE2E2] px-2 py-0.5 rounded-full">
                {kpis.criticalStockProductCount} Critical
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <Link
                href="/inventory"
                className="text-[#0284C7] hover:text-[#0369A1] font-bold flex items-center gap-0.5"
              >
                <span>Restock list</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-[#71717A] font-medium">
                {kpis.repeatCustomerRate.toFixed(0)}% repeat buyers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Charts (Clean CollectiveOS Framing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales & Profit Trend */}
        <div className="lg:col-span-7 bg-white rounded-[20px] border border-[#EBEBEF] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight">
                Daily Sales & Gross Profit Trend
              </h3>
              <p className="text-[12px] text-[#71717A] font-medium">
                Observed cash & UPI sales volume day-by-day
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] inline-block"></span>
                <span className="text-[#52525B]">Net Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block"></span>
                <span className="text-[#52525B]">Gross Profit</span>
              </div>
            </div>
          </div>
          <SalesTrendChart data={dailySales} />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-[20px] border border-[#EBEBEF] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight">
                Revenue by Category
              </h3>
              <p className="text-[12px] text-[#71717A] font-medium">Contribution and margins</p>
            </div>
            <Link
              href="/sales"
              className="text-[12px] font-bold text-[#0284C7] hover:underline flex items-center gap-0.5"
            >
              <span>Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CategoryBreakdownChart data={categories} />
        </div>
      </div>

      {/* Bottom Section: Top Products Table & Conversational AI Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Products Table */}
        <div className="lg:col-span-8 bg-white rounded-[20px] border border-[#EBEBEF] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight">
                Top Revenue Drivers ({daysInPeriod} Days)
              </h3>
              <p className="text-[12px] text-[#71717A] font-medium">
                Ranked by net revenue contribution and inventory status
              </p>
            </div>
            <Link
              href="/inventory"
              className="text-[12px] font-bold text-[#0284C7] hover:underline flex items-center gap-1"
            >
              <span>All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F4F6] text-[#71717A] border-y border-[#EBEBEF]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Product Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Units</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Revenue</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Margin %</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEF]">
                {topProducts.map((p) => (
                  <tr key={p.productId} className="hover:bg-[#F9F9FB] transition-colors">
                    <td className="py-3 px-3 text-[#A1A1AA] font-semibold">{p.revenueRank}</td>
                    <td className="py-3 px-3 font-bold text-[#18181B] max-w-[200px] truncate">
                      {p.productName}
                    </td>
                    <td className="py-3 px-3 text-[#71717A] font-medium">{p.category}</td>
                    <td className="py-3 px-3 text-right font-medium text-[#52525B]">
                      {p.unitsSold}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-[#18181B]">
                      {formatINR(p.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`font-bold ${
                          p.marginPercent >= 20
                            ? 'text-[#10B981]'
                            : p.marginPercent >= 10
                            ? 'text-[#52525B]'
                            : 'text-[#EF4444]'
                        }`}
                      >
                        {p.marginPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stockHealth === 'Critical'
                            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                            : p.stockHealth === 'Low Stock'
                            ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'
                            : p.stockHealth === 'Slow Moving'
                            ? 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]'
                            : 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'
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

        {/* Quick Conversational AI Questions (CollectiveOS Dark Surface) */}
        <div className="lg:col-span-4 bg-[#18181B] text-white rounded-[20px] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 text-[#FDE047] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-[15px] font-bold tracking-tight text-white">
                DukaanAI Assistant
              </h3>
            </div>
            <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
              Every answer is grounded strictly in computed store records. Ask questions in ordinary language.
            </p>

            <div className="mt-5 space-y-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Common Shop Queries:
              </p>
              {quickPrompts.map((prompt, idx) => (
                <Link
                  key={idx}
                  href={`/assistant?q=${encodeURIComponent(prompt.text)}`}
                  className="block text-[12px] font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 px-3.5 py-2.5 rounded-xl transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span>"{prompt.text}"</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Grounded Analytics
            </span>
            <Link
              href="/assistant"
              className="font-bold text-white hover:text-zinc-300 flex items-center gap-1"
            >
              Open Copilot <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
