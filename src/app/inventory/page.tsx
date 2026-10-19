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

  // Filter products
  const filteredProducts = inventory.filter((item) => {
    const matchesFilter = filterStatus === 'All' || item.stockHealth === filterStatus;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Headline stats
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products & Inventory Intelligence</h1>
          <p className="text-xs text-slate-500">
            Real-time stock velocity, run-out estimates, and replenishment recommendations
          </p>
        </div>
        <Link
          href={`/assistant?q=${encodeURIComponent('Which products should I restock right now?')}`}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Restock Plan</span>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Products</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalItems}</p>
          <p className="text-xs text-slate-500 mt-1">Across 6 Indian FMCG categories</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Critical Stockouts</p>
          <p className="text-2xl font-black text-rose-600 mt-1">{criticalCount}</p>
          <p className="text-xs text-rose-700 mt-1 font-medium">Less than {2} days supply remaining</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Inventory Capital</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(totalCapitalTiedUp)}</p>
          <p className="text-xs text-slate-500 mt-1">Wholesale cost value on shelf</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Tied Up in Slow Movers</p>
          <p className="text-2xl font-black text-purple-600 mt-1">{formatINR(slowCapitalTiedUp)}</p>
          <p className="text-xs text-purple-700 mt-1 font-medium">{slowCount} products with &gt;45d supply</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Critical', 'Low Stock', 'Healthy', 'Slow Moving'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.category} • Unit: {p.unit}</p>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-600">{formatINR(p.costPrice)}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">{formatINR(p.sellingPrice)}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-800">
                    {p.currentStock} {p.unit}s
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-600">
                    {p.salesVelocity7Days.toFixed(1)} / day
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-semibold ${
                        p.daysOfStockRemaining <= 2
                          ? 'text-rose-600 font-bold'
                          : p.daysOfStockRemaining <= 5
                          ? 'text-amber-600'
                          : 'text-slate-700'
                      }`}
                    >
                      {p.daysOfStockRemaining >= 99 ? '>45 days' : `~${p.daysOfStockRemaining} days`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
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
                      {p.stockHealth}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sky-700">
                    {p.suggestedReorderQuantity > 0 ? (
                      <span className="bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                        +{p.suggestedReorderQuantity} {p.unit}s
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">
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
