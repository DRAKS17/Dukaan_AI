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
          <h1 className="text-[20px] font-extrabold text-[#18181B] tracking-tight">Sales Analytics</h1>
          <p className="text-[12px] text-[#71717A] font-medium">
            Observation Window: {startDate} to {endDate} ({daysInPeriod} calendar days)
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#71717A] bg-white border border-[#EBEBEF] px-3.5 py-1.5 rounded-full font-medium">
          <Info className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>Gross Margin % = (Gross Profit ÷ Net Revenue) × 100</span>
        </div>
      </div>

      {/* Headline Metric Badges (CollectiveOS Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Net Sales Revenue</p>
          <p className="text-[26px] font-extrabold text-[#18181B] tracking-tight mt-1">{formatINR(kpis.netSalesRevenue)}</p>
          <p className="text-[11px] font-medium text-[#71717A] mt-1">
            Prior: {formatINR(kpis.priorNetSalesRevenue)} ({formatPercent(kpis.salesChangePercent)})
          </p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Estimated Gross Profit</p>
          <p className="text-[26px] font-extrabold text-[#10B981] tracking-tight mt-1">{formatINR(kpis.estimatedGrossProfit)}</p>
          <p className="text-[11px] font-medium text-[#71717A] mt-1">
            Prior: {formatINR(kpis.priorEstimatedGrossProfit)} ({formatPercent(kpis.profitChangePercent)})
          </p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Average Order Value</p>
          <p className="text-[26px] font-extrabold text-[#0284C7] tracking-tight mt-1">{formatINR(kpis.averageOrderValue)}</p>
          <p className="text-[11px] font-medium text-[#71717A] mt-1">
            Completed Orders: {formatNumber(kpis.orderCount)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Gross Margin %</p>
          <p className="text-[26px] font-extrabold text-[#18181B] tracking-tight mt-1">{kpis.grossMarginPercent.toFixed(1)}%</p>
          <p className="text-[11px] font-medium text-[#71717A] mt-1">
            Prior: {kpis.priorGrossMarginPercent.toFixed(1)}% ({kpis.marginChangePoints >= 0 ? '+' : ''}{kpis.marginChangePoints.toFixed(1)} pts)
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-[20px] border border-[#EBEBEF]">
          <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight mb-1">
            Daily Revenue and Profit Breakdown
          </h3>
          <p className="text-[12px] text-[#71717A] font-medium mb-4">
            Daily cash flow movements across the selected time period
          </p>
          <SalesTrendChart data={dailySales} />
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-[20px] border border-[#EBEBEF]">
          <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight mb-1">
            Category Contribution
          </h3>
          <p className="text-[12px] text-[#71717A] font-medium mb-4">
            Which categories drive overall business volume
          </p>
          <CategoryBreakdownChart data={categories} />
        </div>
      </div>

      {/* Payment Modes & Sales Channels Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-[20px] border border-[#EBEBEF]">
          <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight mb-4 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-[#0284C7]" />
            Payment Mode Distribution
          </h3>
          <div className="space-y-3.5">
            {Array.from(paymentMethodMap.entries()).map(([method, data]) => {
              const pct = kpis.netSalesRevenue > 0 ? (data.total / kpis.netSalesRevenue) * 100 : 0;
              return (
                <div key={method} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#18181B]">{method}</span>
                    <span className="font-extrabold text-[#18181B]">
                      {formatINR(data.total)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        method.includes('UPI')
                          ? 'bg-[#0284C7]'
                          : method.includes('Cash')
                          ? 'bg-[#10B981]'
                          : method.includes('Khata')
                          ? 'bg-[#D97706]'
                          : 'bg-[#18181B]'
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
        <div className="bg-white p-6 rounded-[20px] border border-[#EBEBEF]">
          <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#18181B]" />
            Order Sales Channels
          </h3>
          <div className="space-y-3.5">
            {Array.from(channelMap.entries()).map(([channel, data]) => {
              const pct = kpis.orderCount > 0 ? (data.count / kpis.orderCount) * 100 : 0;
              return (
                <div key={channel} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#18181B]">{channel}</span>
                    <span className="font-extrabold text-[#18181B]">
                      {data.count} orders ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F4F4F6] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#18181B] h-full rounded-full"
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
      <div className="bg-white rounded-[20px] border border-[#EBEBEF] p-6">
        <h3 className="text-[15px] font-extrabold text-[#18181B] tracking-tight mb-1">
          Category Profitability Breakdown
        </h3>
        <p className="text-[12px] text-[#71717A] font-medium mb-4">
          Detailed margins and unit volumes across all product segments
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F6] text-[#71717A] border-y border-[#EBEBEF]">
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
            <tbody className="divide-y divide-[#EBEBEF]">
              {categories.map((c) => (
                <tr key={c.category} className="hover:bg-[#F9F9FB] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#18181B]">{c.category}</td>
                  <td className="py-3 px-3 text-right text-[#52525B] font-medium">{formatNumber(c.unitsSold)}</td>
                  <td className="py-3 px-3 text-right text-[#52525B] font-medium">{formatNumber(c.orderCount)}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-[#18181B]">{formatINR(c.revenue)}</td>
                  <td className="py-3 px-3 text-right text-[#71717A] font-medium">{c.revenueContributionPercent.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-right font-bold text-[#10B981]">{formatINR(c.profit)}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        c.marginPercent >= 20
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'
                          : c.marginPercent >= 10
                          ? 'bg-[#F4F4F6] text-[#52525B] border border-[#EBEBEF]'
                          : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
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
