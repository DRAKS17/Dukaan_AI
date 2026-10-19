'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Package,
  Layers,
  ShieldCheck,
  Check,
  XCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { GrowthRecommendation, RecommendationCategory, RecommendationStatus } from '@/types';

export default function RecommendationsPage() {
  const { recommendations, updateRecommendationStatus, timeRange } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('active'); // 'active' = to_do + in_progress

  const categories: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Opportunities' },
    { id: 'LOW_STOCK', label: 'Stock Warnings' },
    { id: 'SALES_DECLINE', label: 'Sales Decline' },
    { id: 'PRODUCT_BUNDLE', label: 'Product Combos' },
    { id: 'HIGH_MARGIN_PROMOTION', label: 'High Margin' },
    { id: 'MARGIN_LEAKAGE', label: 'Margin Leaks' },
    { id: 'SLOW_MOVING', label: 'Slow Movers' },
    { id: 'CUSTOMER_RETENTION', label: 'Retention' },
  ];

  const filteredRecs = recommendations.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    let matchesStatus = true;
    if (selectedStatus === 'active') {
      matchesStatus = r.status === 'to_do' || r.status === 'in_progress';
    } else if (selectedStatus !== 'all') {
      matchesStatus = r.status === selectedStatus;
    }
    return matchesCategory && matchesStatus;
  });

  const getPriorityBadge = (priority: GrowthRecommendation['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryBadge = (cat: RecommendationCategory) => {
    switch (cat) {
      case 'LOW_STOCK':
        return 'bg-rose-50 text-rose-700';
      case 'SALES_DECLINE':
        return 'bg-amber-50 text-amber-700';
      case 'PRODUCT_BUNDLE':
        return 'bg-indigo-50 text-indigo-700';
      case 'HIGH_MARGIN_PROMOTION':
        return 'bg-emerald-50 text-emerald-700';
      case 'MARGIN_LEAKAGE':
        return 'bg-red-50 text-red-700';
      case 'SLOW_MOVING':
        return 'bg-purple-50 text-purple-700';
      case 'CUSTOMER_RETENTION':
        return 'bg-cyan-50 text-cyan-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Growth Recommendations</h1>
          <p className="text-xs text-slate-500">
            Actionable interventions prioritized by financial risk and potential business impact
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Rules-backed • Verified Evidence Grounding</span>
        </div>
      </div>

      {/* Category and Status Filter Pills */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            {[
              { id: 'active', label: 'Active (To Do & In Progress)' },
              { id: 'to_do', label: 'To Do' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
              { id: 'all', label: 'All Statuses' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedStatus === st.id
                    ? 'bg-sky-100 text-sky-800 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredRecs.length} recommendations
          </span>
        </div>
      </div>

      {/* Recommendation Cards List */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">All clear in this category!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No outstanding issues match your current filters. Check back after next inventory restock or switch filters.
            </p>
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className={`bg-white rounded-xl border transition-all p-5 shadow-xs ${
                rec.status === 'completed'
                  ? 'border-emerald-200 bg-emerald-50/20 opacity-80'
                  : rec.priority === 'CRITICAL'
                  ? 'border-rose-200 hover:border-rose-300'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 shrink-0 ${
                      rec.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : rec.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(
                          rec.priority
                        )}`}
                      >
                        {rec.priority} Priority
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${getCategoryBadge(rec.category)}`}>
                        {rec.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {rec.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{rec.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{rec.shortSummary}</p>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-lg shrink-0 self-start">
                  {(['to_do', 'in_progress', 'completed', 'dismissed'] as RecommendationStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateRecommendationStatus(rec.id, status)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                        rec.status === status
                          ? status === 'completed'
                            ? 'bg-emerald-600 text-white font-semibold'
                            : status === 'in_progress'
                            ? 'bg-sky-600 text-white font-semibold'
                            : status === 'dismissed'
                            ? 'bg-slate-700 text-white font-semibold'
                            : 'bg-amber-600 text-white font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {status === 'to_do'
                        ? 'To Do'
                        : status === 'in_progress'
                        ? 'In Progress'
                        : status === 'completed'
                        ? 'Done ✓'
                        : 'Dismiss'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Metrics Strip */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                {rec.metrics.map((m, idx) => (
                  <div key={idx}>
                    <p className="text-slate-400 text-[10px] uppercase font-semibold">{m.label}</p>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Evidence Points */}
              <div className="mt-3.5 space-y-1">
                <p className="text-xs font-semibold text-slate-700">Observed Store Evidence:</p>
                <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                  {rec.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Action Box */}
              <div className="mt-3.5 bg-sky-50/70 border border-sky-100 rounded-lg p-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-sky-600 text-white mt-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-sky-950">Recommended Action: </span>
                    <span className="text-sky-900">{rec.suggestedAction}</span>
                    <p className="text-[11px] text-sky-800/80 mt-1">
                      <span className="font-semibold">Rationale: </span>
                      {rec.rationale}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer: Impact, Assumptions & AI Shortcut */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-500 text-[11px] space-y-0.5">
                  {rec.estimatedImpact && (
                    <p className="text-emerald-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Estimated Impact: {rec.estimatedImpact}
                    </p>
                  )}
                  <p className="text-slate-400">
                    Assumptions: {rec.assumptions.join(' ')}
                  </p>
                </div>

                <Link
                  href={`/assistant?q=${encodeURIComponent(
                    `Explain the recommendation "${rec.title}" and tell me what steps to take.`
                  )}`}
                  className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold self-start sm:self-auto hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discuss with AI Assistant</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
