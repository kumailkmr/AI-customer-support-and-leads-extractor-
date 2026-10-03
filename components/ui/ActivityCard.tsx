"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AIActivityItem } from "@/types";
import { AIBadge } from "./AIBadge";
import {
  RiCheckDoubleLine,
  RiQuestionAnswerLine,
  RiCalendarEventLine,
  RiAlarmWarningLine,
  RiShieldCheckLine,
  RiFileList3Line,
} from "react-icons/ri";

export interface ActivityCardProps {
  activity: AIActivityItem;
  className?: string;
}

export function ActivityCard({ activity, className }: ActivityCardProps) {
  const getTypeConfig = () => {
    switch (activity.type) {
      case "lead_qualified":
        return {
          icon: <RiCheckDoubleLine className="h-4 w-4 text-[#10B981]" />,
          bg: "bg-[#ECFDF5] border-[#A7F3D0]",
        };
      case "objection_handled":
        return {
          icon: <RiShieldCheckLine className="h-4 w-4 text-[#8B5CF6]" />,
          bg: "bg-[#F5F3FF] border-[#DDD6FE]",
        };
      case "follow_up_scheduled":
        return {
          icon: <RiCalendarEventLine className="h-4 w-4 text-[#2563EB]" />,
          bg: "bg-[#EFF6FF] border-[#BFDBFE]",
        };
      case "conversation_handled":
        return {
          icon: <RiQuestionAnswerLine className="h-4 w-4 text-[#0284C7]" />,
          bg: "bg-[#F0F9FF] border-[#BAE6FD]",
        };
      case "escalation":
        return {
          icon: <RiAlarmWarningLine className="h-4 w-4 text-[#EF4444]" />,
          bg: "bg-[#FEF2F2] border-[#FECACA]",
        };
      case "proposal_generated":
        return {
          icon: <RiFileList3Line className="h-4 w-4 text-[#F59E0B]" />,
          bg: "bg-[#FFFBEB] border-[#FDE68A]",
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-xl border border-[#E2E8F0] bg-white transition-all duration-150 hover:border-[#CBD5E1]",
        className
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5",
          config.bg
        )}
      >
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h4 className="text-xs font-bold text-[#0F172A] tracking-tight">
            {activity.title}
          </h4>
          <span className="text-[10px] text-[#94A3B8] font-medium">
            {activity.timestamp}
          </span>
        </div>

        <p className="text-xs text-[#475569] mt-1 leading-relaxed">
          {activity.description}
        </p>

        <div className="mt-2.5 flex items-center gap-2 flex-wrap">
          {activity.channel && (
            <span className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] text-[10px] font-medium">
              {activity.channel}
            </span>
          )}
          {activity.impactTag && (
            <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] text-[10px] font-semibold border border-[#BFDBFE]">
              {activity.impactTag}
            </span>
          )}
          <AIBadge confidence={activity.confidenceScore} size="sm" variant="subtle" />
        </div>
      </div>
    </div>
  );
}
