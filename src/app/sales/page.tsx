'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  QrCode,
  Banknote,
  BookOpen,
  Filter,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import {
  calculateKPISummary,
  calculateDailySales,
  calculateCategoryBreakdown,
  resolveDateRange,
  filterOrdersBetween,
} from '@/lib/analytics/engine';
import { formatINR, formatPercent, formatNumber } from '@/lib/utils/formatters';
import { SalesTrendChart } from '@/components/charts/SalesTrendChart';
import { CategoryBreakdownChart } from '@/components/charts/CategoryBreakdownChart';

export default function SalesAnalyticsPage() {
  const { dataset, timeRange } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const kpis = calculateKPISummary(dataset, timeRange);
  const dailySales = calculateDailySales(dataset, timeRange);
  const categories = calculateCategoryBreakdown(dataset, timeRange);
  const { startDate, endDate, priorStartDate, priorEndDate, daysInPeriod } = resolveDateRange(
    dataset.orders,
    timeRange
  );

  const currentOrders = filterOrdersBetween(dataset.orders, startDate, endDate);

  // Payment method breakdown
  const paymentMethodMap = new Map<string, { count: number; total: number }>();
  currentOrders.forEach((o) => {
    const existing = paymentMethodMap.get(o.paymentMethod) || { count: 0, total: 0 };
    existing.count += 1;
    existing.total += o.netTotal;
    paymentMethodMap.set(o.paymentMethod, existing);
  });

  // Channel breakdown
  const channelMap = new Map<string, { count: number; total: number }>();
  currentOrders.forEach((o) => {
    const existing = channelMap.get(o.channel) || { count: 0, total: 0 };
    existing.count += 1;
    existing.total += o.netTotal;
    channelMap.set(o.channel, existing);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales Analytics</h1>
          <p className="text-xs text-slate-500">
            Observation Window: {startDate} to {endDate} ({daysInPeriod} calendar days)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <Info className="w-3.5 h-3.5 text-sky-600" />
          <span>Formula: Gross Margin % = (Gross Profit ÷ Net Revenue) × 100</span>
        </div>
      </div>

      {/* Headline Metric Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Net Sales Revenue</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(kpis.netSalesRevenue)}</p>
          <p className="text-xs mt-1 text-slate-500">
            Prior Period: {formatINR(kpis.priorNetSalesRevenue)} ({formatPercent(kpis.salesChangePercent)})
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Estimated Gross Profit</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatINR(kpis.estimatedGrossProfit)}</p>
          <p className="text-xs mt-1 text-slate-500">
            Prior Period: {formatINR(kpis.priorEstimatedGrossProfit)} ({formatPercent(kpis.profitChangePercent)})
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Average Order Value (AOV)</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{formatINR(kpis.averageOrderValue)}</p>
          <p className="text-xs mt-1 text-slate-500">
            Completed Orders: {formatNumber(kpis.orderCount)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Gross Margin %</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{kpis.grossMarginPercent.toFixed(1)}%</p>
          <p className="text-xs mt-1 text-slate-500">
            Prior: {kpis.priorGrossMarginPercent.toFixed(1)}% ({kpis.marginChangePoints >= 0 ? '+' : ''}{kpis.marginChangePoints.toFixed(1)} pts)
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Daily Revenue and Profit Breakdown</h3>
          <p className="text-xs text-slate-500 mb-4">Daily cash flow movements across the selected time period</p>
          <SalesTrendChart data={dailySales} />
        </div>

        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-1">Category Contribution</h3>
          <p className="text-xs text-slate-500 mb-4">Which categories drive the business</p>
          <CategoryBreakdownChart data={categories} />
        </div>
      </div>

      {/* Payment Modes & Sales Channels Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-sky-600" />
            Payment Mode Distribution
          </h3>
          <div className="space-y-3">
            {Array.from(paymentMethodMap.entries()).map(([method, data]) => {
              const pct = kpis.netSalesRevenue > 0 ? (data.total / kpis.netSalesRevenue) * 100 : 0;
              return (
                <div key={method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{method}</span>
                    <span className="font-semibold text-slate-900">
                      {formatINR(data.total)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        method.includes('UPI')
                          ? 'bg-sky-500'
                          : method.includes('Cash')
                          ? 'bg-emerald-500'
                          : method.includes('Khata')
                          ? 'bg-amber-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales Channels */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Order Sales Channels
          </h3>
          <div className="space-y-3">
            {Array.from(channelMap.entries()).map(([channel, data]) => {
              const pct = kpis.orderCount > 0 ? (data.count / kpis.orderCount) * 100 : 0;
              return (
                <div key={channel} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{channel}</span>
                    <span className="font-semibold text-slate-900">
                      {data.count} orders ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Performance Details Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Category Profitability Breakdown</h3>
        <p className="text-xs text-slate-500 mb-4">Detailed margins and unit volumes across all product segments</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold text-right">Units Sold</th>
                <th className="py-2.5 px-3 font-semibold text-right">Order Count</th>
                <th className="py-2.5 px-3 font-semibold text-right">Net Revenue</th>
                <th className="py-2.5 px-3 font-semibold text-right">Revenue Share</th>
                <th className="py-2.5 px-3 font-semibold text-right">Gross Profit</th>
                <th className="py-2.5 px-3 font-semibold text-right">Gross Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.category} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">{c.category}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{formatNumber(c.unitsSold)}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{formatNumber(c.orderCount)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">{formatINR(c.revenue)}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{c.revenueContributionPercent.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right font-semibold text-emerald-700">{formatINR(c.profit)}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-semibold text-[11px] ${
                        c.marginPercent >= 20
                          ? 'bg-emerald-50 text-emerald-700'
                          : c.marginPercent >= 10
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {c.marginPercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
