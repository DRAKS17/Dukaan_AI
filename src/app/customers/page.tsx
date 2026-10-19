'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  UserCheck,
  UserX,
  Sparkles,
  ShoppingBag,
  IndianRupee,
  ShieldCheck,
  MessageSquare,
  Search,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { calculateKPISummary } from '@/lib/analytics/engine';
import { formatINR, formatNumber } from '@/lib/utils/formatters';
import { Customer } from '@/types';

export default function CustomersPage() {
  const { dataset, timeRange } = useStore();
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const kpis = calculateKPISummary(dataset, timeRange);

  // Group customers by segment
  const segmentCounts: Record<string, number> = {
    'VIP / Champion': 0,
    'Loyal Regular': 0,
    'Occasional Buyer': 0,
    'At-Risk / Lapsed': 0,
    'New Buyer': 0,
  };

  dataset.customers.forEach((c) => {
    if (segmentCounts[c.segment] !== undefined) {
      segmentCounts[c.segment]++;
    }
  });

  const filteredCustomers = dataset.customers.filter((c) => {
    const matchesSegment = selectedSegment === 'All' || c.segment === selectedSegment;
    const matchesSearch =
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneMasked.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSegment && matchesSearch;
  });

  const atRiskCustomers = dataset.customers.filter((c) => c.segment === 'At-Risk / Lapsed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Retention Intelligence</h1>
          <p className="text-xs text-slate-500">
            Cohort loyalty, purchase repeat rate, and re-engagement campaign opportunities
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
          <span>Pseudonymized Data • Privacy Preserved</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Registered Buyers</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatNumber(dataset.customers.length)}</p>
          <p className="text-xs text-slate-500 mt-1">{kpis.uniqueActiveCustomers} active in {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Repeat Customer Rate</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{kpis.repeatCustomerRate.toFixed(1)}%</p>
          <p className="text-xs text-slate-500 mt-1">Placed 2+ orders in window</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">At-Risk Lapsed Buyers</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{atRiskCustomers.length}</p>
          <p className="text-xs text-amber-700 mt-1 font-medium">Inactive for &gt;21 days</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Average Order Value</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatINR(kpis.averageOrderValue)}</p>
          <p className="text-xs text-slate-500 mt-1">Per transaction average</p>
        </div>
      </div>

      {/* Re-engagement Opportunity Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded">
              Retention Campaign
            </span>
            <span className="text-xs text-slate-300">{atRiskCustomers.length} Eligible Kirana Customers</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Re-engage Regular Shoppers Before They Shift to Competitors
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            These buyers shopped 3+ times previously but haven't visited in over 3 weeks. A targeted reminder for staple goods or free doorstep delivery above ₹300 can recover regular shopping habits.
          </p>
        </div>
        <Link
          href={`/assistant?q=${encodeURIComponent('Which customers have stopped returning and what should I do?')}`}
          className="self-start md:self-auto flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI Campaign Strategy</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pseudonymous ID or phone..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-sky-500"
          />
        </div>

        {/* Segments Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'At-Risk / Lapsed', 'VIP / Champion', 'Loyal Regular', 'Occasional Buyer'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedSegment === seg
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Pseudonym Identifier</th>
                <th className="py-3 px-3 font-semibold">Masked Phone</th>
                <th className="py-3 px-3 font-semibold text-center">Segment</th>
                <th className="py-3 px-3 font-semibold text-right">Total Orders</th>
                <th className="py-3 px-3 font-semibold text-right">Lifetime Spend</th>
                <th className="py-3 px-3 font-semibold text-right">First Purchase</th>
                <th className="py-3 px-4 font-semibold text-right">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.slice(0, 50).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{c.displayName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{c.id}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono">{c.phoneMasked}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.segment === 'At-Risk / Lapsed'
                          ? 'bg-amber-100 text-amber-800'
                          : c.segment === 'VIP / Champion'
                          ? 'bg-purple-100 text-purple-800'
                          : c.segment === 'Loyal Regular'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-800">{c.totalOrders}</td>
                  <td className="py-3 px-3 text-right font-semibold text-slate-900">{formatINR(c.totalSpend)}</td>
                  <td className="py-3 px-3 text-right text-slate-500">{c.firstPurchaseDate}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">{c.lastPurchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
