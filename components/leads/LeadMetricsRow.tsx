"use client";

import React from "react";
import { ClientLeadMetrics } from "@/types/leads";
import { formatCurrency } from "@/lib/utils";
import {
  RiUserVoiceLine,
  RiSparkling2Fill,
  RiCheckDoubleLine,
  RiTimeLine,
  RiAlertLine,
  RiMoneyDollarCircleLine,
  RiInboxArchiveLine,
} from "react-icons/ri";

interface LeadMetricsRowProps {
  metrics: ClientLeadMetrics;
}

export function LeadMetricsRow({ metrics }: LeadMetricsRowProps) {
  const cards = [
    {
      label: "Total Leads",
      value: metrics.totalLeads,
      icon: RiInboxArchiveLine,
      color: "text-[#0F172A]",
      bg: "bg-[#F8FAFC]",
      border: "border-[#E2E8F0]",
      badge: "Inbound Pipeline",
    },
    {
      label: "New Leads",
      value: metrics.newLeads,
      icon: RiUserVoiceLine,
      color: "text-[#2563EB]",
      bg: "bg-[#EFF6FF]",
      border: "border-[#BFDBFE]",
      badge: "Action Required",
    },
    {
      label: "Qualifying",
      value: metrics.qualifying,
      icon: RiSparkling2Fill,
      color: "text-[#7C3AED]",
      bg: "bg-[#F5F3FF]",
      border: "border-[#DDD6FE]",
      badge: "AI Triage Active",
    },
    {
      label: "Qualified",
      value: metrics.qualified,
      icon: RiCheckDoubleLine,
      color: "text-[#047857]",
      bg: "bg-[#ECFDF5]",
      border: "border-[#A7F3D0]",
      badge: "Booking Ready",
    },
    {
      label: "Follow-Up",
      value: metrics.followUp,
      icon: RiTimeLine,
      color: "text-[#B45309]",
      bg: "bg-[#FFFBEB]",
      border: "border-[#FDE68A]",
      badge: "Scheduled",
    },
    {
      label: "Human Handoff",
      value: metrics.humanHandoff,
      icon: RiAlertLine,
      color: "text-[#B91C1C]",
      bg: "bg-[#FEF2F2]",
      border: "border-[#FECACA]",
      badge: "Needs Specialist",
    },
    {
      label: "Converted",
      value: metrics.converted,
      icon: RiCheckDoubleLine,
      color: "text-[#065F46]",
      bg: "bg-[#ECFDF5]",
      border: "border-[#6EE7B7]",
      badge: "Won Customers",
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(metrics.pipelineValue),
      icon: RiMoneyDollarCircleLine,
      color: "text-[#0F172A]",
      bg: "bg-[#F1F5F9]",
      border: "border-[#CBD5E1]",
      badge: "Client Revenue Est.",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`p-3 rounded-xl border ${c.border} ${c.bg} transition-all hover:shadow-xs`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-semibold text-[#64748B] truncate uppercase tracking-wider">
                {c.label}
              </span>
              <Icon className={`h-3.5 w-3.5 ${c.color} flex-shrink-0`} />
            </div>
            <div className="text-lg font-bold text-[#0F172A] leading-tight">
              {c.value}
            </div>
            <div className="text-[10px] font-medium text-[#64748B] mt-0.5 truncate">
              {c.badge}
            </div>
          </div>
        );
      })}
    </div>
  );
}
