"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { AIInsightCard } from "@/components/ui/AIInsightCard";
import { useProspects } from "@/lib/store/prospects-store";
import { useAnalysis } from "@/lib/store/analysis-store";
import {
  mockAiActivities,
  mockAiInsights,
  mockAiActivitySummary,
} from "@/lib/mock-data/ai-activity";
import { AIBadge } from "@/components/ui/AIBadge";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { RiBuilding4Line } from "react-icons/ri";

export function AIActivityFeed() {
  const { prospects } = useProspects();
  const { analyses, analysisMetrics } = useAnalysis();

  // Get recently analyzed prospects with dossiers
  const analyzedProspectsList = React.useMemo(() => {
    return prospects
      .filter((p) => analyses[p.id.toLowerCase()])
      .map((p) => {
        const a = analyses[p.id.toLowerCase()];
        return {
          prospect: p,
          analysis: a,
        };
      })
      .slice(0, 3);
  }, [prospects, analyses]);

  // Aggregate recent CRM prospect activities
  const recentProspectActivities = prospects
    .flatMap((p) =>
      p.activityHistory.map((act) => ({
        ...act,
        prospectId: p.id,
        businessName: p.businessName,
      }))
    )
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* AI Business Analysis Engine Highlight */}
      <Card padding="md" className="border-[#DDD6FE] bg-gradient-to-b from-[#FAF5FF] to-white shadow-xs">
        <CardHeader
          title="AI Business Analysis Engine"
          subtitle="Adaptive prospect research, opportunity mapping & demo strategies"
          action={
            <Link
              href="/prospects"
              className="text-xs font-semibold text-[#8B5CF6] hover:text-[#7C3AED] flex items-center gap-1"
            >
              <span>View Dossiers</span>
              <HiOutlineArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2.5 rounded-lg bg-white border border-[#E9D5FF] text-center shadow-xs">
            <span className="text-lg font-bold text-[#0F172A] block leading-tight">
              {analysisMetrics.totalAnalyzed}
            </span>
            <span className="text-[10px] text-[#64748B] font-medium">Total Analyzed</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-center shadow-xs">
            <span className="text-lg font-bold text-[#10B981] block leading-tight">
              {analysisMetrics.analysisReady}
            </span>
            <span className="text-[10px] text-[#047857] font-medium">Analysis Ready</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-center shadow-xs">
            <span className="text-lg font-bold text-[#D97706] block leading-tight">
              {analysisMetrics.needsReview}
            </span>
            <span className="text-[10px] text-[#B45309] font-medium">Needs Review</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-center shadow-xs">
            <span className="text-lg font-bold text-[#2563EB] block leading-tight">
              {analysisMetrics.demosReady}
            </span>
            <span className="text-[10px] text-[#1D4ED8] font-medium">Demos Ready</span>
          </div>
        </div>

        {/* Recent Analyzed Prospects */}
        {analyzedProspectsList.length > 0 && (
          <div className="space-y-2 pt-1 border-t border-[#F1F5F9]">
            <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider">
              Recent AI Analysis Dossiers
            </span>
            {analyzedProspectsList.map(({ prospect, analysis }) => (
              <Link
                key={prospect.id}
                href={`/prospects/${prospect.id}/analysis`}
                className="p-2.5 bg-white border border-[#E2E8F0] hover:border-[#8B5CF6] rounded-lg flex items-center justify-between text-xs transition-colors group block"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5 font-bold text-[#0F172A] group-hover:text-[#8B5CF6] transition-colors truncate">
                    <RiBuilding4Line className="h-3.5 w-3.5 text-[#8B5CF6] flex-shrink-0" />
                    <span className="truncate">{prospect.businessName}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-[#F1F5F9] text-[#475569]">
                      v{analysis.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {analysis.opportunities.length} opportunities · {analysis.recommendedServices.length} services
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    analysis.status === "Ready"
                      ? "bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]"
                      : "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]"
                  }`}
                >
                  {analysis.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
      {/* High-priority AI Recommendation */}
      {mockAiInsights.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Proactive AI Intelligence
            </span>
            <AIBadge label="Autonomous Copilot" size="sm" />
          </div>
          <AIInsightCard insight={mockAiInsights[0]} />
        </div>
      )}

      {/* Recent CRM Prospect Activity */}
      {recentProspectActivities.length > 0 && (
        <Card padding="md" className="border-[#E2E8F0]">
          <CardHeader
            title="Recent CRM Activity"
            subtitle="Live status transitions, notes, and outreach across prospects"
            action={
              <Link
                href="/prospects"
                className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
              >
                <span>CRM Dossier</span>
                <HiOutlineArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="space-y-2.5">
            {recentProspectActivities.map((act) => (
              <Link
                key={act.id}
                href={`/prospects/${act.prospectId}`}
                className="p-3 bg-[#F8FAFC] border border-[#F1F5F9] hover:border-[#2563EB] hover:bg-white rounded-xl flex items-start justify-between gap-3 text-xs transition-all block group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    <RiBuilding4Line className="h-3.5 w-3.5 text-[#2563EB] flex-shrink-0" />
                    <span>{act.businessName}</span>
                    <span className="text-[#94A3B8] font-normal">· {act.title}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-1 leading-snug">
                    {act.description}
                  </p>
                </div>
                <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                  {act.timestamp}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Autonomous AI Activity Card */}
      <Card padding="md" className="border-[#E2E8F0]">
        <CardHeader
          title="AI Activity"
          subtitle="Real-time autonomous client acquisition and conversation triage"
          action={
            <span className="text-xs font-medium text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
              Live Stream
            </span>
          }
        />

        {/* 4 Key Summary Pills */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2">
            <HiOutlineChatBubbleLeftRight className="h-4 w-4 text-[#2563EB]" />
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">
                {mockAiActivitySummary.conversationsHandled}
              </span>
              <span className="text-[10px] text-[#64748B]">handled</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-2">
            <HiOutlineCheckBadge className="h-4 w-4 text-[#10B981]" />
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">
                {mockAiActivitySummary.leadsQualified}
              </span>
              <span className="text-[10px] text-[#64748B]">qualified</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] flex items-center gap-2">
            <HiOutlineClock className="h-4 w-4 text-[#8B5CF6]" />
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">
                {mockAiActivitySummary.followUpsScheduled}
              </span>
              <span className="text-[10px] text-[#64748B]">scheduled</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2">
            <HiOutlineExclamationTriangle className="h-4 w-4 text-[#EF4444]" />
            <div>
              <span className="text-xs font-bold text-[#0F172A] block">
                {mockAiActivitySummary.escalations}
              </span>
              <span className="text-[10px] text-[#64748B]">escalations</span>
            </div>
          </div>
        </div>

        {/* Activity Items */}
        <div className="space-y-2.5">
          {mockAiActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </Card>
    </div>
  );
}
