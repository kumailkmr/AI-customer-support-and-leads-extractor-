"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { useLeads } from "@/lib/store/leads-store";
import {
  RiUserVoiceLine,
  RiCheckDoubleLine,
  RiAlertLine,
  RiTimeLine,
  RiSparkling2Fill,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiArrowRightLine,
} from "react-icons/ri";

export function ClientAcquisitionTelemetry() {
  const { leadMetrics, conversationMetrics } = useLeads();

  const channelItems = [
    { name: "Website Chat", count: conversationMetrics.channelBreakdown["Website Chat"] || 0, icon: RiGlobalLine, color: "text-[#2563EB]" },
    { name: "Instagram", count: conversationMetrics.channelBreakdown["Instagram"] || 0, icon: RiInstagramLine, color: "text-[#E1306C]" },
    { name: "Facebook", count: conversationMetrics.channelBreakdown["Facebook"] || 0, icon: RiFacebookCircleLine, color: "text-[#1877F2]" },
    { name: "WhatsApp", count: conversationMetrics.channelBreakdown["WhatsApp"] || 0, icon: RiWhatsappLine, color: "text-[#10B981]" },
    { name: "Email", count: conversationMetrics.channelBreakdown["Email"] || 0, icon: RiMailLine, color: "text-[#64748B]" },
  ];

  return (
    <Card padding="md" className="border-[#E2E8F0] space-y-5">
      <CardHeader
        title="Client Lead & AI Conversation Telemetry"
        subtitle="Real-time multi-channel customer acquisition generated across your clients"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <RiSparkling2Fill className="h-3 w-3" />
              Live AI Triage
            </span>
            <Link
              href="/leads"
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>Leads OS</span>
              <RiArrowRightLine className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
      />

      {/* Grid: Lead Activity on Left, Conversation Activity in Middle, Channel Breakdown on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Lead Activity */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            <span>Customer Lead Activity</span>
            <span className="text-[#2563EB] font-bold">{leadMetrics.totalLeads} Total</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiUserVoiceLine className="h-3.5 w-3.5 text-[#2563EB]" />
                New Inbound
              </span>
              <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                {leadMetrics.newLeads}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiCheckDoubleLine className="h-3.5 w-3.5 text-[#10B981]" />
                Qualified Leads
              </span>
              <span className="font-bold text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                {leadMetrics.qualified}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiAlertLine className="h-3.5 w-3.5 text-[#EF4444]" />
                Human Handoffs
              </span>
              <span className="font-bold text-[#B91C1C] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                {leadMetrics.humanHandoff}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiTimeLine className="h-3.5 w-3.5 text-[#F59E0B]" />
                Follow-Ups
              </span>
              <span className="font-bold text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded border border-[#FDE68A]">
                {leadMetrics.followUp}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiCheckDoubleLine className="h-3.5 w-3.5 text-[#059669]" />
                Converted
              </span>
              <span className="font-bold text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#6EE7B7]">
                {leadMetrics.converted}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Conversation Activity */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            <span>Conversation Activity</span>
            <span className="text-[#8B5CF6] font-bold">{conversationMetrics.totalConversations} Active</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
                AI Autonomous Mode
              </span>
              <span className="font-bold text-[#6D28D9] bg-[#F5F3FF] px-2 py-0.5 rounded border border-[#DDD6FE]">
                {conversationMetrics.aiActive}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiUserVoiceLine className="h-3.5 w-3.5 text-[#2563EB]" />
                Human Agent Active
              </span>
              <span className="font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                {conversationMetrics.humanActive}
              </span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-[#64748B] flex items-center gap-1.5">
                <RiAlertLine className="h-3.5 w-3.5 text-[#EF4444]" />
                Needs Specialist Attention
              </span>
              <span className="font-bold text-[#B91C1C] bg-[#FEF2F2] px-2 py-0.5 rounded border border-[#FECACA]">
                {conversationMetrics.needsAttention}
              </span>
            </div>

            <div className="pt-2">
              <Link
                href="/inbox"
                className="w-full py-1.5 px-3 bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#0F172A] flex items-center justify-center gap-1 transition-colors"
              >
                <span>Open Omnichannel Inbox</span>
                <RiArrowRightLine className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Omnichannel Channel Breakdown */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-2">
            <span>Inbound Channels</span>
            <span className="text-[10px] text-[#64748B]">Simulated Streams</span>
          </div>

          <div className="space-y-1 text-xs">
            {channelItems.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.name} className="flex items-center justify-between py-1">
                  <span className="text-[#475569] flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 ${ch.color}`} />
                    {ch.name}
                  </span>
                  <span className="font-bold text-[#0F172A] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    {ch.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
