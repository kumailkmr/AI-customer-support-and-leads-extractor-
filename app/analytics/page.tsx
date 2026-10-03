"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { FilterPill } from "@/components/ui/FilterPill";
import { mockChannels } from "@/lib/mock-data/channels";
import { mockPipelineStages } from "@/lib/mock-data/pipeline";
import { formatCurrency } from "@/lib/utils";
import {
  HiOutlineArrowTrendingUp,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineSparkles,
} from "react-icons/hi2";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"30d" | "quarter" | "year">("30d");

  const weeklyData = [
    { label: "W1", leads: 42, qualified: 14, height: "45%" },
    { label: "W2", leads: 58, qualified: 19, height: "60%" },
    { label: "W3", leads: 69, qualified: 22, height: "75%" },
    { label: "W4", leads: 79, qualified: 26, height: "90%" },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Analytics & Telemetry"
        subtitle="Full-funnel attribution, lead qualification yield, response velocity, and automated deal metrics."
        badge={
          <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            Real-time Telemetry
          </span>
        }
        actions={
          <div className="flex items-center gap-1.5">
            <FilterPill
              label="Last 30 Days"
              isActive={timeframe === "30d"}
              onClick={() => setTimeframe("30d")}
            />
            <FilterPill
              label="Quarter to Date"
              isActive={timeframe === "quarter"}
              onClick={() => setTimeframe("quarter")}
            />
            <FilterPill
              label="Year to Date"
              isActive={timeframe === "year"}
              onClick={() => setTimeframe("year")}
            />
          </div>
        }
      />

      <div className="space-y-6">
        {/* KPI Mini Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Inbound Velocity</span>
              <HiOutlineArrowTrendingUp className="h-4 w-4 text-[#2563EB]" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A] mt-2 block">248 Leads</span>
            <span className="text-[11px] text-[#10B981] font-semibold mt-0.5 block">+18.4% vs last period</span>
          </div>

          <div className="p-4 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#047857]">Qualification Yield</span>
              <HiOutlineCheckBadge className="h-4 w-4 text-[#10B981]" />
            </div>
            <span className="text-2xl font-bold text-[#10B981] mt-2 block">28.6%</span>
            <span className="text-[11px] text-[#047857] font-semibold mt-0.5 block">71 Qualified Deals</span>
          </div>

          <div className="p-4 rounded-xl border border-[#DDD6FE] bg-[#F5F3FF]/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6D28D9]">Avg Response Time</span>
              <HiOutlineClock className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <span className="text-2xl font-bold text-[#8B5CF6] mt-2 block">42 Sec</span>
            <span className="text-[11px] text-[#6D28D9] font-semibold mt-0.5 block">AI Instant Reply</span>
          </div>

          <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B]">Automated Follow-ups</span>
              <HiOutlineSparkles className="h-4 w-4 text-[#2563EB]" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A] mt-2 block">94.2%</span>
            <span className="text-[11px] text-[#10B981] font-semibold mt-0.5 block">Delivery & Read Rate</span>
          </div>
        </div>

        {/* Charts Split Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Chart: Leads & Qualification Trend (7 cols) */}
          <div className="lg:col-span-7">
            <Card padding="md" className="border-[#E2E8F0] h-full flex flex-col justify-between">
              <CardHeader
                title="Lead Inbound & Qualification Trend"
                subtitle="Weekly progression of captured and qualified customer leads"
                action={
                  <div className="flex items-center gap-3 text-xs text-[#64748B]">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-[#2563EB]" /> Total Leads
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded bg-[#10B981]" /> Qualified
                    </span>
                  </div>
                }
              />

              {/* Visual Bar Chart */}
              <div className="pt-6 pb-2">
                <div className="h-48 flex items-end justify-around gap-6 border-b border-[#E2E8F0] pb-2">
                  {weeklyData.map((d) => (
                    <div key={d.label} className="flex flex-col items-center gap-2 flex-1 max-w-[64px]">
                      <div className="w-full flex items-end justify-center gap-1.5 h-40">
                        {/* Total Leads Bar */}
                        <div
                          className="w-1/2 bg-[#2563EB] rounded-t-md transition-all duration-500 relative group"
                          style={{ height: d.height }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[9px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.leads}
                          </span>
                        </div>
                        {/* Qualified Leads Bar */}
                        <div
                          className="w-1/2 bg-[#10B981] rounded-t-md transition-all duration-500 relative group"
                          style={{ height: `${parseInt(d.height) * 0.35}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[9px] font-bold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.qualified}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#64748B]">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs text-[#64748B]">
                <span>248 Total Inbound Leads in period</span>
                <span>+24% Month-over-Month Growth</span>
              </div>
            </Card>
          </div>

          {/* Right Chart: Channel Yield (5 cols) */}
          <div className="lg:col-span-5">
            <Card padding="md" className="border-[#E2E8F0] h-full flex flex-col justify-between">
              <CardHeader
                title="Channel Conversion Performance"
                subtitle="Qualification yield percentage by inbound channel"
              />

              <div className="space-y-3.5 my-auto">
                {mockChannels.map((ch) => (
                  <div key={ch.channel} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F172A]">{ch.channel}</span>
                      <span className="text-[#64748B]">
                        {ch.totalConversations} leads · <strong className="text-[#10B981]">{ch.conversionRate}%</strong>
                      </span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                        style={{ width: `${ch.conversionRate * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                <span>Top Channel: <strong>WhatsApp (41.2%)</strong></span>
                <span>Instagram (38.7%)</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Funnel Stage Breakdown */}
        <Card padding="md" className="border-[#E2E8F0]">
          <CardHeader
            title="Full Acquisition Funnel Progression"
            subtitle="Stage-by-stage drop-off and velocity from discovery to closed deal"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {mockPipelineStages.map((st) => (
              <div key={st.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[11px] font-bold text-[#64748B] block">{st.name}</span>
                <span className="text-lg font-bold text-[#0F172A] mt-1 block">{st.count}</span>
                <span className="text-[10px] text-[#2563EB] font-semibold mt-0.5 block">
                  {formatCurrency(st.totalValue)} ({st.conversionRate}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
