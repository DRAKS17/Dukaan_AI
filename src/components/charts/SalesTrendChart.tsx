'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailySalesMetric } from '@/types';
import { formatCompactINR, formatINR } from '@/lib/utils/formatters';

interface SalesTrendChartProps {
  data: DailySalesMetric[];
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#71717A] text-xs font-medium">
        No sales data available for this range
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBEF" />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={{ stroke: '#EBEBEF' }}
            tick={{ fill: '#71717A', fontSize: 11, fontWeight: 500 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatCompactINR(val)}
            tick={{ fill: '#71717A', fontSize: 11, fontWeight: 500 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as DailySalesMetric;
                return (
                  <div className="bg-white p-3 rounded-[16px] border border-[#EBEBEF] text-xs">
                    <p className="font-bold text-[#18181B] mb-1.5">{item.formattedDate}</p>
                    <div className="space-y-1">
                      <p className="text-[#0284C7] flex justify-between gap-4 font-bold">
                        <span>Net Sales:</span>
                        <span>{formatINR(item.revenue)}</span>
                      </p>
                      <p className="text-[#059669] flex justify-between gap-4 font-bold">
                        <span>Gross Profit:</span>
                        <span>{formatINR(item.profit)}</span>
                      </p>
                      <p className="text-[#71717A] flex justify-between gap-4 font-medium">
                        <span>Completed Orders:</span>
                        <span>{item.orderCount}</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0284c7"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#revenueGrad)"
            name="Net Sales"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#profitGrad)"
            name="Gross Profit"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
