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
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { GrowthRecommendation, RecommendationCategory, RecommendationStatus } from '@/types';

export default function RecommendationsPage() {
  const { recommendations, updateRecommendationStatus, timeRange } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');

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
        return 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]';
      case 'HIGH':
        return 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]';
      case 'MEDIUM':
        return 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]';
      default:
        return 'bg-[#F4F4F6] text-[#71717A] border-[#EBEBEF]';
    }
  };

  const getCategoryBadge = (cat: RecommendationCategory) => {
    switch (cat) {
      case 'LOW_STOCK':
        return 'bg-[#FEF2F2] text-[#DC2626]';
      case 'SALES_DECLINE':
        return 'bg-[#FFFBEB] text-[#D97706]';
      case 'PRODUCT_BUNDLE':
        return 'bg-[#F0F9FF] text-[#0284C7]';
      case 'HIGH_MARGIN_PROMOTION':
        return 'bg-[#ECFDF5] text-[#059669]';
      case 'MARGIN_LEAKAGE':
        return 'bg-[#FEF2F2] text-[#DC2626]';
      case 'SLOW_MOVING':
        return 'bg-[#F3E8FF] text-[#7E22CE]';
      case 'CUSTOMER_RETENTION':
        return 'bg-[#ECFEFF] text-[#0891B2]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-extrabold text-[#18181B] tracking-tight">
            AI Growth Recommendations
          </h1>
          <p className="text-[12px] text-[#71717A] font-medium">
            Actionable interventions prioritized by financial risk and potential business impact
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#18181B] bg-white border border-[#EBEBEF] px-3.5 py-1.5 rounded-full font-medium">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Rules-backed • Verified Grounding</span>
        </div>
      </div>

      {/* Category Pills & Status Filter */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-[#18181B] text-white'
                  : 'bg-white text-[#71717A] border border-[#EBEBEF] hover:text-[#18181B]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-[#EBEBEF] text-[11px] font-semibold">
            {[
              { id: 'active', label: 'Active Pipeline' },
              { id: 'to_do', label: 'To Do' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
              { id: 'all', label: 'All' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1 rounded-full transition-colors ${
                  selectedStatus === st.id
                    ? 'bg-[#18181B] text-white'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <span className="text-[12px] text-[#71717A] font-medium">
            Showing {filteredRecs.length} opportunities
          </span>
        </div>
      </div>

      {/* Recommendation Cards List */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#EBEBEF] p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#10B981] mx-auto mb-2" />
            <h3 className="text-[15px] font-bold text-[#18181B]">All clear in this category!</h3>
            <p className="text-[12px] text-[#71717A] font-medium mt-1 max-w-md mx-auto">
              No outstanding issues match your current filters. Switch categories or check back after the next inventory restock.
            </p>
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className={`bg-white rounded-[20px] border border-[#EBEBEF] p-6 transition-colors ${
                rec.status === 'completed' ? 'opacity-70 bg-[#FAFAF8]' : ''
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                      rec.priority === 'CRITICAL'
                        ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]'
                        : rec.priority === 'HIGH'
                        ? 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]'
                        : 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getPriorityBadge(
                          rec.priority
                        )}`}
                      >
                        {rec.priority} Priority
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getCategoryBadge(
                          rec.category
                        )}`}
                      >
                        {rec.category.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-[#A1A1AA] font-semibold">{rec.id}</span>
                    </div>
                    <h3 className="text-[16px] font-extrabold text-[#18181B] tracking-tight mt-1.5">
                      {rec.title}
                    </h3>
                    <p className="text-[13px] text-[#52525B] font-medium mt-0.5">{rec.shortSummary}</p>
                  </div>
                </div>

                {/* Status Toggle Buttons (CollectiveOS Pill Style) */}
                <div className="flex items-center gap-1 bg-[#F4F4F6] border border-[#EBEBEF] p-1 rounded-full shrink-0 self-start">
                  {(['to_do', 'in_progress', 'completed', 'dismissed'] as RecommendationStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => updateRecommendationStatus(rec.id, status)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          rec.status === status
                            ? status === 'completed'
                              ? 'bg-[#10B981] text-white'
                              : status === 'in_progress'
                              ? 'bg-[#0284C7] text-white'
                              : status === 'dismissed'
                              ? 'bg-[#71717A] text-white'
                              : 'bg-[#18181B] text-white'
                            : 'text-[#71717A] hover:text-[#18181B]'
                        }`}
                      >
                        {status === 'to_do'
                          ? 'To Do'
                          : status === 'in_progress'
                          ? 'In Progress'
                          : status === 'completed'
                          ? 'Done'
                          : 'Dismiss'}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Verified Metrics Strip */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9F9FB] p-3.5 rounded-xl border border-[#EBEBEF] text-[12px]">
                {rec.metrics.map((m, idx) => (
                  <div key={idx}>
                    <p className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-wider">{m.label}</p>
                    <p className="font-extrabold text-[#18181B] text-[13px] mt-0.5">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Evidence Points */}
              <div className="mt-4 space-y-1">
                <p className="text-[12px] font-bold text-[#18181B]">Observed Store Evidence:</p>
                <ul className="text-[12px] text-[#52525B] font-medium space-y-1 list-disc list-inside leading-relaxed">
                  {rec.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Action Callout Box */}
              <div className="mt-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-3.5 text-[12px]">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#0284C7] text-white flex items-center justify-center mt-0.5 shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-[#0369A1]">Recommended Action: </span>
                    <span className="text-[#0C4A6E] font-medium">{rec.suggestedAction}</span>
                    <p className="text-[11px] text-[#0369A1]/90 mt-1 font-medium">
                      <span className="font-bold">Rationale: </span>
                      {rec.rationale}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer: Impact, Assumptions & AI Shortcut */}
              <div className="mt-4 pt-3.5 border-t border-[#EBEBEF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12px]">
                <div className="text-[#71717A] text-[11px] font-medium space-y-0.5">
                  {rec.estimatedImpact && (
                    <p className="text-[#059669] font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Estimated Impact: {rec.estimatedImpact}
                    </p>
                  )}
                  <p className="text-[#A1A1AA]">
                    Assumptions: {rec.assumptions.join(' ')}
                  </p>
                </div>

                <Link
                  href={`/assistant?q=${encodeURIComponent(
                    `Explain the recommendation "${rec.title}" and tell me what steps to take.`
                  )}`}
                  className="inline-flex items-center gap-1.5 text-[#18181B] hover:text-[#0284C7] font-bold self-start sm:self-auto hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                  <span>Discuss with Copilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
