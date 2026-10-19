'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  TrendingDown,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { calculateInventoryHealth } from '@/lib/analytics/engine';
import { formatINR, formatNumber } from '@/lib/utils/formatters';
import { InventoryItem } from '@/types';

export default function InventoryPage() {
  const { dataset, timeRange } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const inventory = calculateInventoryHealth(dataset, timeRange);

  const filteredProducts = inventory.filter((item) => {
    const matchesFilter = filterStatus === 'All' || item.stockHealth === filterStatus;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalItems = inventory.length;
  const criticalCount = inventory.filter((i) => i.stockHealth === 'Critical' || i.stockHealth === 'Out of Stock').length;
  const lowCount = inventory.filter((i) => i.stockHealth === 'Low Stock').length;
  const slowCount = inventory.filter((i) => i.stockHealth === 'Slow Moving').length;
  const totalCapitalTiedUp = inventory.reduce((sum, i) => sum + i.capitalTiedUp, 0);
  const slowCapitalTiedUp = inventory
    .filter((i) => i.stockHealth === 'Slow Moving')
    .reduce((sum, i) => sum + i.capitalTiedUp, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#18181B] tracking-tight">
            Products & Inventory Intelligence
          </h1>
          <p className="text-[12px] text-[#71717A] font-medium">
            Real-time stock velocity, run-out estimates, and replenishment recommendations
          </p>
        </div>
        <Link
          href={`/assistant?q=${encodeURIComponent('Which products should I restock right now?')}`}
          className="flex items-center gap-1.5 bg-[#18181B] hover:bg-black text-white text-[12px] font-bold px-4 py-2 rounded-full transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
          <span>Ask Restock Plan</span>
        </Link>
      </div>

      {/* Overview Cards (CollectiveOS Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Catalogued Items</p>
          <p className="text-[26px] font-extrabold text-[#18181B] tracking-tight mt-1">{totalItems}</p>
          <p className="text-[11px] text-[#71717A] font-medium mt-1">Across 6 FMCG categories</p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider">Critical Stockouts</p>
          <p className="text-[26px] font-extrabold text-[#DC2626] tracking-tight mt-1">{criticalCount}</p>
          <p className="text-[11px] text-[#DC2626] font-semibold mt-1">Less than 2 days supply</p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Total Inventory Capital</p>
          <p className="text-[26px] font-extrabold text-[#18181B] tracking-tight mt-1">{formatINR(totalCapitalTiedUp)}</p>
          <p className="text-[11px] text-[#71717A] font-medium mt-1">Wholesale cost on shelf</p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#7E22CE] uppercase tracking-wider">Tied Up in Slow Movers</p>
          <p className="text-[26px] font-extrabold text-[#7E22CE] tracking-tight mt-1">{formatINR(slowCapitalTiedUp)}</p>
          <p className="text-[11px] text-[#7E22CE] font-semibold mt-1">{slowCount} items with &gt;45d supply</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#EBEBEF] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product or category..."
            className="w-full pl-10 pr-4 py-2 text-[12px] rounded-full bg-[#F4F4F6] border border-[#EBEBEF] focus:outline-hidden focus:border-[#18181B] font-medium text-[#18181B]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Critical', 'Low Stock', 'Healthy', 'Slow Moving'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-[#18181B] text-white'
                  : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[20px] border border-[#EBEBEF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F6] text-[#71717A] border-b border-[#EBEBEF]">
              <tr>
                <th className="py-3 px-4 font-semibold">Product & Category</th>
                <th className="py-3 px-3 font-semibold text-right">Cost Price</th>
                <th className="py-3 px-3 font-semibold text-right">Selling Price</th>
                <th className="py-3 px-3 font-semibold text-right">Current Stock</th>
                <th className="py-3 px-3 font-semibold text-right">Daily Sales (7d)</th>
                <th className="py-3 px-3 font-semibold text-right">Days Left</th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Suggested Reorder</th>
                <th className="py-3 px-4 font-semibold text-right">Tied-Up Capital</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEF]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#F9F9FB] transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#18181B] text-[13px]">{p.name}</p>
                    <p className="text-[11px] text-[#71717A] font-medium">{p.category} • Unit: {p.unit}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-[#71717A]">{formatINR(p.costPrice)}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#18181B]">{formatINR(p.sellingPrice)}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-[#18181B]">
                    {p.currentStock} {p.unit}s
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-[#52525B]">
                    {p.salesVelocity7Days.toFixed(1)} / day
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-bold ${
                        p.daysOfStockRemaining <= 2
                          ? 'text-[#DC2626]'
                          : p.daysOfStockRemaining <= 5
                          ? 'text-[#D97706]'
                          : 'text-[#52525B]'
                      }`}
                    >
                      {p.daysOfStockRemaining >= 99 ? '>45 days' : `~${p.daysOfStockRemaining} days`}
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
                      {p.stockHealth}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold">
                    {p.suggestedReorderQuantity > 0 ? (
                      <span className="bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] px-2.5 py-0.5 rounded-full text-[11px]">
                        +{p.suggestedReorderQuantity} {p.unit}s
                      </span>
                    ) : (
                      <span className="text-[#A1A1AA] font-medium">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-[#18181B]">
                    {formatINR(p.capitalTiedUp)}
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
