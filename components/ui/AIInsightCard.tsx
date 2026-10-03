"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AIInsight } from "@/types";
import { Card } from "./Card";
import { AIBadge } from "./AIBadge";
import { AIActionButton } from "./AIActionButton";
import { RiSparkling2Line, RiArrowRightLine } from "react-icons/ri";

export interface AIInsightCardProps {
  insight: AIInsight;
  onApplyAction?: (insight: AIInsight) => void;
  className?: string;
}

export function AIInsightCard({
  insight,
  onApplyAction,
  className,
}: AIInsightCardProps) {
  return (
    <Card
      variant="ai"
      padding="md"
      className={cn(
        "border-[#DDD6FE] hover:border-[#C4B5FD] transition-all duration-150 relative overflow-hidden",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center text-[#8B5CF6]">
            <RiSparkling2Line className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
            AI Recommendation
          </span>
        </div>
        <AIBadge confidence={insight.confidence} size="sm" variant="solid" />
      </div>

      <div className="mt-3">
        <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">
          {insight.title}
        </h4>
        <p className="text-xs text-[#475569] mt-1.5 leading-relaxed">
          {insight.summary}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#EDE9FE] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <span className="text-xs font-semibold text-[#6D28D9] flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
          {insight.suggestedAction}
        </span>
        <AIActionButton
          size="sm"
          variant="solid"
          onClick={() => onApplyAction?.(insight)}
          className="self-start sm:self-auto"
        >
          <span>Execute</span>
          <RiArrowRightLine className="h-3 w-3 ml-1" />
        </AIActionButton>
      </div>
    </Card>
  );
}
