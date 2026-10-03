"use client";

import React from "react";
import { CrmMetrics } from "@/types/prospects";
import { formatCrmCurrency } from "@/lib/crm/crm-service";
import {
  RiBuilding4Line,
  RiFocus2Line,
  RiSendPlaneLine,
  RiReplyLine,
  RiCalendarLine,
  RiFileTextLine,
  RiTrophyLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

interface CrmMetricsCardsProps {
  metrics: CrmMetrics;
}

export function CrmMetricsCards({ metrics }: CrmMetricsCardsProps) {
  const items = [
    {
      label: "Total Prospects",
      value: metrics.totalProspects,
      icon: <RiBuilding4Line className="h-4 w-4 text-[#2563EB]" />,
      bg: "bg-[#EFF6FF]",
      border: "border-[#BFDBFE]",
      color: "text-[#2563EB]",
    },
    {
      label: "Active Opportunities",
      value: metrics.activeOpportunities,
      icon: <RiFocus2Line className="h-4 w-4 text-[#0284C7]" />,
      bg: "bg-[#F0F9FF]",
      border: "border-[#BAE6FD]",
      color: "text-[#0284C7]",
    },
    {
      label: "Contacted",
      value: metrics.contacted,
      icon: <RiSendPlaneLine className="h-4 w-4 text-[#D97706]" />,
      bg: "bg-[#FFFBEB]",
      border: "border-[#FDE68A]",
      color: "text-[#D97706]",
    },
    {
      label: "Replies",
      value: metrics.replies,
      icon: <RiReplyLine className="h-4 w-4 text-[#2563EB]" />,
      bg: "bg-[#EFF6FF]",
      border: "border-[#BFDBFE]",
      color: "text-[#2563EB]",
    },
    {
      label: "Demos",
      value: metrics.demos,
      icon: <RiCalendarLine className="h-4 w-4 text-[#9333EA]" />,
      bg: "bg-[#FAF5FF]",
      border: "border-[#E9D5FF]",
      color: "text-[#9333EA]",
    },
    {
      label: "Proposals",
      value: metrics.proposals,
      icon: <RiFileTextLine className="h-4 w-4 text-[#4F46E5]" />,
      bg: "bg-[#EEF2FF]",
      border: "border-[#C7D2FE]",
      color: "text-[#4F46E5]",
    },
    {
      label: "Won",
      value: metrics.won,
      icon: <RiTrophyLine className="h-4 w-4 text-[#16A34A]" />,
      bg: "bg-[#F0FDF4]",
      border: "border-[#BBF7D0]",
      color: "text-[#16A34A]",
    },
    {
      label: "Estimated Pipeline",
      value: formatCrmCurrency(metrics.pipelineValue, { compact: true }),
      icon: <RiMoneyDollarCircleLine className="h-4 w-4 text-[#059669]" />,
      bg: "bg-[#ECFDF5]",
      border: "border-[#A7F3D0]",
      color: "text-[#059669]",
      isHighlighted: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
      {items.map((it, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-xl border bg-white shadow-xs transition-all hover:shadow-sm ${
            it.isHighlighted ? "border-[#A7F3D0] bg-[#F0FDF4]/40" : "border-[#E2E8F0]"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-[#64748B] truncate">
              {it.label}
            </span>
            <div
              className={`p-1 rounded-md border ${it.bg} ${it.border} flex-shrink-0`}
            >
              {it.icon}
            </div>
          </div>
          <div
            className={`text-lg font-extrabold tracking-tight ${
              it.isHighlighted ? "text-[#059669]" : "text-[#0F172A]"
            }`}
          >
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
