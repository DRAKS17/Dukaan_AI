'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  TrendingUp,
  Package,
  Users,
  Sparkles,
  CheckCircle2,
  UploadCloud,
  Menu,
  X,
  Store,
  Clock,
  ShieldCheck,
  RotateCcw,
  Search,
  Bell,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { TimeRange } from '@/types';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { dataset, timeRange, setTimeRange, resetToDefaultDemo, isCustomDataLoaded, recommendations } =
    useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingRecsCount = recommendations.filter(
    (r) => r.status === 'to_do' || r.status === 'in_progress'
  ).length;

  const navItems = [
    { name: 'Overview', href: '/', icon: LayoutGrid },
    { name: 'Sales Analytics', href: '/sales', icon: TrendingUp },
    { name: 'Products & Inventory', href: '/inventory', icon: Package },
    { name: 'Customer Retention', href: '/customers', icon: Users },
    {
      name: 'AI Growth Copilot',
      href: '/assistant',
      icon: Sparkles,
      highlight: true,
      badge: 'AI Powered',
    },
    {
      name: 'Recommendations',
      href: '/recommendations',
      icon: CheckCircle2,
      count: pendingRecsCount,
    },
    { name: 'Data & CSV Upload', href: '/settings', icon: UploadCloud },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9FB] text-[#18181B] flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#18181B] text-white px-4 py-3.5 flex items-center justify-between border-b border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white text-zinc-950 flex items-center justify-center font-black text-sm shadow-xs">
            D
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-white text-sm">DukaanAI</span>
              <span className="text-[10px] font-semibold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                Copilot
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#FCFCFA] text-[#18181B] border-r border-[#EBEBEF] flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-[#EBEBEF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#18181B] text-white flex items-center justify-center font-black text-base shadow-xs">
              D
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#18181B] tracking-tight text-base">DukaanAI</span>
                <span className="text-[10px] font-bold bg-[#EBEBEF] text-[#52525B] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  OS
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#71717A]">Merchant Growth Copilot</p>
            </div>
          </div>
        </div>

        {/* Paytm Track Badge */}
        <div className="px-6 py-2.5 bg-[#F4F4F6] border-b border-[#EBEBEF] flex items-center justify-between text-[11px] font-medium text-[#52525B]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Paytm Hackathon
          </span>
          <span className="font-semibold text-[#18181B]">Merchant Growth</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest px-3 mb-2 pt-2">
            Workspace
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : item.highlight
                    ? 'text-[#0284C7] bg-[#F0F9FF] hover:bg-[#E0F2FE]'
                    : 'text-[#52525B] hover:bg-[#F4F4F6] hover:text-[#18181B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : item.highlight ? 'text-[#0284C7]' : 'text-[#71717A]'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-zinc-800 text-white' : 'bg-[#E0F2FE] text-[#0284C7]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold bg-[#EF4444] text-white px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Store Profile Card at Bottom */}
        <div className="p-4 border-t border-[#EBEBEF] bg-[#FAFAF8]">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#EBEBEF] text-[#52525B] flex items-center justify-center shrink-0 mt-0.5">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-[#18181B] truncate">
                {dataset.storeName}
              </p>
              <p className="text-[10px] font-medium text-[#71717A] truncate">
                {dataset.storeLocation.split(',')[1] || 'Bengaluru'}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="text-[10px] font-semibold text-[#52525B]">
                  {isCustomDataLoaded ? 'Custom CSV' : 'Simulated Kirana'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#EBEBEF] flex items-center justify-between text-[11px]">
            <span className="text-[#71717A] font-medium">
              {dataset.products.length} Items • {dataset.orders.length} Orders
            </span>
            <button
              onClick={resetToDefaultDemo}
              title="Reset to default seeded demo"
              className="text-[#71717A] hover:text-[#18181B] flex items-center gap-1 font-semibold hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Header */}
        <header className="bg-white border-b border-[#EBEBEF] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-30">
          {/* Store Info & Breadcrumb */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[15px] font-bold text-[#18181B] tracking-tight flex items-center gap-2">
                {dataset.storeName}
                <span className="text-[11px] font-semibold text-[#71717A] bg-[#F4F4F6] border border-[#EBEBEF] px-2.5 py-0.5 rounded-full">
                  Retail POS
                </span>
              </h1>
              <p className="text-[11px] font-medium text-[#71717A]">{dataset.storeLocation}</p>
            </div>
          </div>

          {/* Controls: Time Range Selector, Notification, & Ask AI Action */}
          <div className="flex items-center gap-3">
            {/* Time Range Pill Switcher */}
            <div className="flex items-center bg-[#F4F4F6] p-1 rounded-full border border-[#EBEBEF] text-[12px] font-semibold">
              <Clock className="w-3.5 h-3.5 ml-2 mr-1 text-[#71717A]" />
              {(['7d', '30d', '90d'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-3 py-1 rounded-full transition-colors ${
                    timeRange === r
                      ? 'bg-white text-[#18181B] shadow-2xs font-bold'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>

            {/* Quick Ask AI Button */}
            <Link
              href="/assistant"
              className="flex items-center gap-2 bg-[#18181B] hover:bg-black text-white text-[12px] font-bold px-4 py-2 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
              <span>Ask Copilot</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-[#EBEBEF] bg-white px-6 py-4 text-center text-xs text-[#71717A] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#18181B]">DukaanAI OS</span>
            <span>— AI Business Growth Copilot for Small Merchants</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Paytm Build for India Hackathon</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#10B981] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Deterministic Analytics Grounded
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
