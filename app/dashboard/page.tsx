"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricsRow } from "@/components/dashboard/MetricsRow";
import { PipelineOverview } from "@/components/dashboard/PipelineOverview";
import { ChannelPerformance } from "@/components/dashboard/ChannelPerformance";
import { AIActivityFeed } from "@/components/dashboard/AIActivityFeed";
import { RecentLeadsSection } from "@/components/dashboard/RecentLeadsSection";
import { RecentConversationsSection } from "@/components/dashboard/RecentConversationsSection";
import { QuickActionsSection } from "@/components/dashboard/QuickActionsSection";
import { ClientAcquisitionTelemetry } from "@/components/dashboard/ClientAcquisitionTelemetry";
import { FilterPill } from "@/components/ui/FilterPill";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { RiSparkling2Fill } from "react-icons/ri";

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<"today" | "7days" | "30days">("today");

  return (
    <AppLayout>
      {/* Dashboard Top Header */}
      <PageHeader
        title="Good morning, Kumail 👋"
        subtitle="Here's what's happening with your client acquisition today."
        badge={
          <span className="text-xs font-semibold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Live Sync Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Timeframe Controls */}
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
              <FilterPill
                label="Today"
                isActive={timeframe === "today"}
                onClick={() => setTimeframe("today")}
              />
              <FilterPill
                label="Last 7 days"
                isActive={timeframe === "7days"}
                onClick={() => setTimeframe("7days")}
              />
              <FilterPill
                label="Last 30 days"
                isActive={timeframe === "30days"}
                onClick={() => setTimeframe("30days")}
              />
            </div>

            <AIActionButton
              size="sm"
              variant="solid"
              icon={<RiSparkling2Fill className="h-3.5 w-3.5 text-white" />}
            >
              Run AI Lead Scan
            </AIActionButton>
          </div>
        }
      />

      {/* Main Dashboard Layout */}
      <div className="space-y-6">
        {/* Quick Actions Shortcuts */}
        <section aria-label="Quick Actions">
          <QuickActionsSection />
        </section>

        {/* KPI Metrics Row */}
        <section aria-label="Key Performance Indicators">
          <MetricsRow timeframe={timeframe} />
        </section>

        {/* Sales Pipeline Funnel Progression */}
        <section aria-label="Sales Pipeline Progression">
          <PipelineOverview />
        </section>

        {/* Client-Facing Acquisition & AI Support Telemetry */}
        <section aria-label="Client Acquisition Telemetry">
          <ClientAcquisitionTelemetry />
        </section>

        {/* Split Grid: Channels & Conversations (Left) + AI Activity (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Top Lead Sources & Live Conversations (7 cols) */}
          <section className="lg:col-span-7 space-y-6" aria-label="Lead Sources & Conversations">
            <ChannelPerformance />
            <RecentConversationsSection />
          </section>

          {/* Right Column: AI Activity Feed (5 cols) */}
          <section className="lg:col-span-5 space-y-6" aria-label="AI Activity Stream">
            <AIActivityFeed />
          </section>
        </div>

        {/* Full-width Recent Leads Grid */}
        <section aria-label="Recent High-Intent Leads">
          <RecentLeadsSection />
        </section>
      </div>
    </AppLayout>
  );
}
