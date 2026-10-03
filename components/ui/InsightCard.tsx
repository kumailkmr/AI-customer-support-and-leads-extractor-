"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { RiLightbulbLine } from "react-icons/ri";

export interface InsightCardProps {
  title: string;
  description: string;
  metric?: string;
  trend?: string;
  category?: string;
  className?: string;
}

export function InsightCard({
  title,
  description,
  metric,
  trend,
  category = "Growth Insight",
  className,
}: InsightCardProps) {
  return (
    <Card padding="md" className={cn("border-[#E2E8F0] hover:border-[#CBD5E1] transition-all", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
          <RiLightbulbLine className="h-3.5 w-3.5" />
          {category}
        </span>
        {metric && (
          <span className="text-xs font-bold text-[#0F172A] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded">
            {metric}
          </span>
        )}
      </div>

      <h4 className="text-sm font-bold text-[#0F172A] mt-2.5 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
        {description}
      </p>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-xs font-medium text-[#10B981]">
          {trend}
        </div>
      )}
    </Card>
  );
}
