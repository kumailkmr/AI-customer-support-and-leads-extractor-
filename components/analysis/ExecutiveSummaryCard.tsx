"use client";

import React from "react";
import { BusinessAnalysis } from "@/types";
import { Card } from "@/components/ui/Card";
import {
  RiSparkling2Fill,
  RiInformationLine,
  RiFocus3Line,
  RiShieldCheckLine,
} from "react-icons/ri";

interface ExecutiveSummaryCardProps {
  analysis: BusinessAnalysis;
}

export function ExecutiveSummaryCard({ analysis }: ExecutiveSummaryCardProps) {
  return (
    <Card padding="lg" className="border-[#DDD6FE] bg-gradient-to-br from-white to-[#FAF5FF] shadow-xs space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
            <RiSparkling2Fill className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              NEXUS Executive Analysis
              <span className="text-[10px] font-bold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-0.5 rounded-full">
                NEXUS AI Model v{analysis.version}
              </span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Synthesized from active digital presence and observed customer inquiry friction.
            </p>
          </div>
        </div>

        {/* Source Distinction Tags */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#0369A1] bg-[#F0F9FF] border border-[#BAE6FD] px-2.5 py-1 rounded-md flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
            Research Data
          </span>
          <span className="text-[11px] font-semibold text-[#6D28D9] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-1 rounded-md flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
            NEXUS Analysis
          </span>
          {analysis.userEdited && (
            <span className="text-[11px] font-semibold text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1 rounded-md">
              Manually Edited
            </span>
          )}
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
        <p className="text-sm text-[#334155] leading-relaxed font-normal">
          {analysis.summary}
        </p>
      </div>

      {/* Primary Opportunity & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Primary Opportunity */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            <RiFocus3Line className="h-4 w-4 text-[#2563EB]" />
            Primary Opportunity Area
          </div>
          <p className="text-sm font-semibold text-[#1E40AF]">
            {analysis.primaryOpportunity}
          </p>
          <p className="text-xs text-[#64748B] pt-0.5">
            Highest leverage transformation to capture immediate inbound inquiries.
          </p>
        </div>

        {/* Recommended Solution */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            <RiShieldCheckLine className="h-4 w-4 text-[#10B981]" />
            Recommended NEXUS Architecture
          </div>
          <p className="text-sm font-semibold text-[#065F46]">
            {analysis.recommendedSolution}
          </p>
          <p className="text-xs text-[#64748B] pt-0.5">
            Turnkey package combining conversational AI triage with automated staff dispatch.
          </p>
        </div>
      </div>

      {/* Confidence Rationale Note */}
      <div className="flex items-start gap-2.5 text-xs text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg">
        <RiInformationLine className="h-4 w-4 text-[#8B5CF6] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-[#0F172A]">
            Confidence Basis ({analysis.confidence}):{" "}
          </span>
          <span>{analysis.confidenceReason}</span>
        </div>
      </div>
    </Card>
  );
}
