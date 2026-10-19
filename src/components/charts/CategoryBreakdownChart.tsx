'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CategoryBreakdown } from '@/types';
import { formatCompactINR, formatINR } from '@/lib/utils/formatters';

interface CategoryBreakdownChartProps {
  data: CategoryBreakdown[];
}

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
        No category data available
      </div>
    );
  }

  // Shorten category names for mobile/chart readability
  const chartData = data.map((d) => ({
    ...d,
    shortName: d.category
      .replace(' & Grains', '')
      .replace('Foods & ', '')
      .replace(' & Bakery', '')
      .replace(' & Tea', ''),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatCompactINR(val)}
            tick={{ fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            type="category"
            dataKey="shortName"
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
            tick={{ fill: '#334155', fontSize: 11, fontWeight: 500 }}
            width={75}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as CategoryBreakdown;
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-900">{item.category}</p>
                    <div className="mt-1.5 space-y-1">
                      <p className="text-sky-700 flex justify-between gap-4 font-medium">
                        <span>Revenue:</span>
                        <span>{formatINR(item.revenue)} ({item.revenueContributionPercent.toFixed(1)}%)</span>
                      </p>
                      <p className="text-emerald-700 flex justify-between gap-4 font-medium">
                        <span>Gross Profit:</span>
                        <span>{formatINR(item.profit)}</span>
                      </p>
                      <p className="text-indigo-700 flex justify-between gap-4">
                        <span>Gross Margin:</span>
                        <span>{item.marginPercent.toFixed(1)}%</span>
                      </p>
                      <p className="text-slate-500 flex justify-between gap-4">
                        <span>Units Sold:</span>
                        <span>{item.unitsSold}</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="revenue" fill="#38bdf8" radius={[0, 4, 4, 0]} name="Revenue" />
          <Bar dataKey="profit" fill="#10b981" radius={[0, 4, 4, 0]} name="Gross Profit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
