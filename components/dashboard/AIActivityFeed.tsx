"use client";

import React from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { AIInsightCard } from "@/components/ui/AIInsightCard";
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
} from "react-icons/hi2";

export function AIActivityFeed() {
  return (
    <div className="space-y-6">
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
