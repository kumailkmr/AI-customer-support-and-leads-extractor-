"use client";

import React from "react";
import { Opportunity } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPriorityBadgeProps } from "@/lib/analysis/analysis-service";
import {
  RiFocus3Line,
  RiAddLine,
  RiInformationLine,
  RiMoneyDollarCircleLine,
  RiThumbUpLine,
} from "react-icons/ri";

interface OpportunityPriorityCardsProps {
  opportunities: Opportunity[];
  onAddOpportunity?: () => void;
}

export function OpportunityPriorityCards({
  opportunities,
  onAddOpportunity,
}: OpportunityPriorityCardsProps) {
  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <RiFocus3Line className="h-4 w-4 text-[#2563EB]" />
            Opportunity Prioritization ({opportunities.length})
          </h3>
          <p className="text-xs text-[#64748B]">
            Internal NEXUS acquisition priorities based on implementation ease and immediate commercial value.
          </p>
        </div>

        {onAddOpportunity && (
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RiAddLine className="h-4 w-4" />}
            onClick={onAddOpportunity}
          >
            Add Custom Opportunity
          </Button>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {opportunities.map((opp) => {
          const priorityProps = getPriorityBadgeProps(opp.priority);

          return (
            <div
              key={opp.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityProps.bg} ${priorityProps.text} ${priorityProps.border}`}
                  >
                    {opp.priority}
                  </span>
                  {opp.userEdited && (
                    <span className="text-[10px] font-semibold text-[#B45309] bg-[#FFFBEB] px-1.5 py-0.2 rounded border border-[#FDE68A]">
                      Custom
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                  {opp.title}
                </h4>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {opp.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#F8FAFC]">
                {/* Potential Value */}
                <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold">
                  <RiMoneyDollarCircleLine className="h-4 w-4 shrink-0" />
                  <span>{opp.potentialValue}</span>
                </div>

                {/* Priority Reason */}
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B] flex items-start gap-1.5">
                  <RiThumbUpLine className="h-3.5 w-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0F172A]">Why {opp.priority}: </span>
                    <span>{opp.priorityReason}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[11px] text-[#64748B] flex items-center gap-2">
        <RiInformationLine className="h-4 w-4 text-[#8B5CF6] shrink-0" />
        <span>
          Prioritization reflects operational rollout simplicity and demonstration speed, not an objective ranking of the prospect.
        </span>
      </div>
    </Card>
  );
}
