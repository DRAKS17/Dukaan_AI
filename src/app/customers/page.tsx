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
  Search,
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
          <h1 className="text-[20px] font-extrabold text-[#18181B] tracking-tight">
            Customer Retention Intelligence
          </h1>
          <p className="text-[12px] text-[#71717A] font-medium">
            Cohort loyalty, purchase repeat rate, and re-engagement campaign opportunities
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-[#059669] bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1.5 rounded-full font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Pseudonymized Data • Privacy Preserved</span>
        </div>
      </div>

      {/* KPI Cards (CollectiveOS Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Registered Buyers</p>
          <p className="text-[26px] font-extrabold text-[#18181B] tracking-tight mt-1">
            {formatNumber(dataset.customers.length)}
          </p>
          <p className="text-[11px] text-[#71717A] font-medium mt-1">
            {kpis.uniqueActiveCustomers} active in {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">Repeat Buyer Rate</p>
          <p className="text-[26px] font-extrabold text-[#0284C7] tracking-tight mt-1">
            {kpis.repeatCustomerRate.toFixed(1)}%
          </p>
          <p className="text-[11px] text-[#71717A] font-medium mt-1">Placed 2+ orders in window</p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider">Lapsed Regular Buyers</p>
          <p className="text-[26px] font-extrabold text-[#D97706] tracking-tight mt-1">
            {atRiskCustomers.length}
          </p>
          <p className="text-[11px] text-[#D97706] font-semibold mt-1">Inactive for &gt;21 days</p>
        </div>

        <div className="bg-white p-5 rounded-[20px] border border-[#EBEBEF]">
          <p className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider">Average Order Value</p>
          <p className="text-[26px] font-extrabold text-[#18181B] tracking-tight mt-1">
            {formatINR(kpis.averageOrderValue)}
          </p>
          <p className="text-[11px] text-[#71717A] font-medium mt-1">Per transaction average</p>
        </div>
      </div>

      {/* Re-engagement Campaign Banner (CollectiveOS Dark Surface) */}
      <div className="bg-[#18181B] text-white rounded-[20px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-0.5 rounded-full">
              Retention Campaign
            </span>
            <span className="text-[12px] text-zinc-400 font-medium">
              {atRiskCustomers.length} Eligible Kirana Customers
            </span>
          </div>
          <h3 className="text-[17px] font-extrabold text-white tracking-tight">
            Re-engage Regular Shoppers Before They Shift to Competitors
          </h3>
          <p className="text-[12px] text-zinc-400 max-w-2xl leading-relaxed font-medium">
            These buyers shopped 3+ times previously but haven't visited in over 3 weeks. A targeted reminder for staple goods or free doorstep delivery above ₹300 can recover regular shopping habits.
          </p>
        </div>
        <Link
          href={`/assistant?q=${encodeURIComponent('Which customers have stopped returning and what should I do?')}`}
          className="self-start md:self-auto flex items-center gap-2 bg-white text-[#18181B] text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-zinc-100 transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
          <span>Ask Campaign Strategy</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-[20px] border border-[#EBEBEF] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pseudonym ID or phone..."
            className="w-full pl-10 pr-4 py-2 text-[12px] rounded-full bg-[#F4F4F6] border border-[#EBEBEF] focus:outline-hidden focus:border-[#18181B] font-medium text-[#18181B]"
          />
        </div>

        {/* Segments Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'At-Risk / Lapsed', 'VIP / Champion', 'Loyal Regular', 'Occasional Buyer'].map((seg) => (
            <button
              key={seg}
              onClick={() => setSelectedSegment(seg)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                selectedSegment === seg
                  ? 'bg-[#18181B] text-white'
                  : 'bg-[#F4F4F6] text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              {seg}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-[20px] border border-[#EBEBEF] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F4F6] text-[#71717A] border-b border-[#EBEBEF]">
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
            <tbody className="divide-y divide-[#EBEBEF]">
              {filteredCustomers.slice(0, 50).map((c) => (
                <tr key={c.id} className="hover:bg-[#F9F9FB] transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-[#18181B] text-[13px]">{c.displayName}</p>
                    <p className="text-[11px] text-[#A1A1AA] font-semibold">{c.id}</p>
                  </td>
                  <td className="py-3 px-3 text-[#52525B] font-medium">{c.phoneMasked}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.segment === 'At-Risk / Lapsed'
                          ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'
                          : c.segment === 'VIP / Champion'
                          ? 'bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]'
                          : c.segment === 'Loyal Regular'
                          ? 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]'
                          : 'bg-[#F4F4F6] text-[#71717A] border border-[#EBEBEF]'
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#18181B]">{c.totalOrders}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-[#18181B]">{formatINR(c.totalSpend)}</td>
                  <td className="py-3 px-3 text-right text-[#71717A] font-medium">{c.firstPurchaseDate}</td>
                  <td className="py-3 px-4 text-right font-semibold text-[#18181B]">{c.lastPurchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
