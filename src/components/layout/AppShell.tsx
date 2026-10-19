'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
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
  IndianRupee,
  AlertTriangle,
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
    { name: 'Overview', href: '/', icon: LayoutDashboard },
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            D
          </div>
          <div>
            <span className="font-bold tracking-tight text-white">DukaanAI</span>
            <span className="ml-2 text-[10px] bg-sky-950 text-sky-400 border border-sky-800 px-1.5 py-0.5 rounded font-mono">
              Paytm Track
            </span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-500/20">
              D
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-tight text-base">DukaanAI</span>
                <span className="text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1.5 py-0.2 rounded">
                  Copilot
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Kirana Growth Intelligence</p>
            </div>
          </div>
        </div>

        {/* Hackathon Track Tag */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Paytm Hackathon
          </span>
          <span className="text-sky-300 font-medium">Merchant Growth AI</span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                    : item.highlight
                    ? 'text-sky-400 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-sky-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[11px] font-semibold bg-rose-500 text-white px-2 py-0.2 rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Store Profile Card at Bottom */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {dataset.storeName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {dataset.storeLocation.split(',')[1] || 'Bengaluru'}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-slate-300">
                  {isCustomDataLoaded ? 'Custom CSV Loaded' : 'Simulated Kirana Data'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono">
              {dataset.products.length} Items • {dataset.orders.length} Orders
            </span>
            <button
              onClick={resetToDefaultDemo}
              title="Reset to default seeded demo"
              className="text-slate-400 hover:text-sky-400 p-1 flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
                {dataset.storeName}
                <span className="text-xs font-normal text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                  Kirana Store
                </span>
              </h1>
              <p className="text-xs text-slate-500">{dataset.storeLocation}</p>
            </div>
          </div>

          {/* Time Range Selector & AI Assistant Shortcut */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 ml-1.5 mr-1 text-slate-500" />
              {(['7d', '30d', '90d'] as TimeRange[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    timeRange === r
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                </button>
              ))}
            </div>

            <Link
              href="/assistant"
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span>Ask AI Copilot</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">DukaanAI</span>
            <span>— AI Business Growth Copilot for Small Merchants</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Paytm Build for India Hackathon</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Deterministic Analytics Grounded
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
