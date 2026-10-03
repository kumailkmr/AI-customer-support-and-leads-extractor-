"use client";

import React, { useState } from "react";
import {
  BusinessObservation,
  BusinessProblem,
  Opportunity,
  RecommendedService,
} from "@/types";
import { Card } from "@/components/ui/Card";
import {
  RiGitMergeLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSparkling2Fill,
} from "react-icons/ri";

interface OpportunityMapProps {
  observations: BusinessObservation[];
  problems: BusinessProblem[];
  opportunities: Opportunity[];
  services: RecommendedService[];
}

export function OpportunityMap({
  observations,
  problems,
  opportunities,
  services,
}: OpportunityMapProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // Pair up opportunities into chains
  const chains = opportunities.map((opp, idx) => {
    const linkedProblem = problems.find((p) => opp.problemIds.includes(p.id)) || problems[idx] || problems[0];
    const linkedObs = linkedProblem
      ? observations.find((o) => linkedProblem.sourceObservationIds.includes(o.id)) || observations[0]
      : observations[0];
    const linkedService = services.find((s) => s.opportunityId === opp.id) || services[idx] || services[0];

    return {
      id: opp.id,
      index: idx + 1,
      opportunity: opp,
      problem: linkedProblem,
      observation: linkedObs,
      service: linkedService,
    };
  });

  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-[#F1F5F9] pb-4">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <RiGitMergeLine className="h-4 w-4 text-[#8B5CF6]" />
          Opportunity Progression Map
        </h3>
        <p className="text-xs text-[#64748B]">
          Direct traceability chain from raw research signal to recommended client solution.
        </p>
      </div>

      {/* Chains */}
      <div className="space-y-3">
        {chains.map((chain, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={chain.id}
              className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden transition-all shadow-2xs"
            >
              {/* Chain Summary Trigger */}
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] font-bold text-xs flex items-center justify-center shrink-0">
                    #{chain.index}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">
                      {chain.opportunity.title}
                    </h4>
                    <span className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                      <span className="text-[#10B981] font-semibold">
                        Service: {chain.service?.service || "NEXUS Core"}
                      </span>
                      <span>·</span>
                      <span className="text-[#2563EB] font-medium">
                        {chain.opportunity.priority}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#8B5CF6] hidden sm:inline">
                    {isExpanded ? "Collapse Chain" : "Inspect Chain"}
                  </span>
                  {isExpanded ? (
                    <RiArrowUpSLine className="h-4 w-4 text-[#64748B]" />
                  ) : (
                    <RiArrowDownSLine className="h-4 w-4 text-[#64748B]" />
                  )}
                </div>
              </button>

              {/* Expanded Progression Stepper */}
              {isExpanded && (
                <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                    {/* Node 1: Observation */}
                    <div className="p-3 bg-white rounded-xl border border-[#CBD5E1] space-y-1 relative">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-[#F0F9FF] px-1.5 py-0.5 rounded border border-[#BAE6FD]">
                        1. Observation
                      </span>
                      <p className="text-xs font-bold text-[#0F172A] line-clamp-2">
                        {chain.observation?.title || "Digital signal observed"}
                      </p>
                      <p className="text-[11px] text-[#64748B] line-clamp-3">
                        {chain.observation?.description}
                      </p>
                    </div>

                    {/* Node 2: Problem Hypothesis */}
                    <div className="p-3 bg-white rounded-xl border border-[#CBD5E1] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FFFBEB] px-1.5 py-0.5 rounded border border-[#FDE68A]">
                        2. Potential Problem
                      </span>
                      <p className="text-xs font-bold text-[#0F172A] line-clamp-2">
                        {chain.problem?.title || "Conversion drop-off risk"}
                      </p>
                      <p className="text-[11px] text-[#64748B] line-clamp-3">
                        {chain.problem?.description}
                      </p>
                    </div>

                    {/* Node 3: Opportunity */}
                    <div className="p-3 bg-white rounded-xl border border-[#CBD5E1] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded border border-[#DDD6FE]">
                        3. Opportunity
                      </span>
                      <p className="text-xs font-bold text-[#0F172A] line-clamp-2">
                        {chain.opportunity.title}
                      </p>
                      <p className="text-[11px] text-[#64748B] line-clamp-3">
                        {chain.opportunity.description}
                      </p>
                    </div>

                    {/* Node 4: Solution */}
                    <div className="p-3 bg-white rounded-xl border border-[#CBD5E1] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                        4. Solution
                      </span>
                      <p className="text-xs font-bold text-[#0F172A] line-clamp-2">
                        Automated Inbound Conversational System
                      </p>
                      <p className="text-[11px] text-[#64748B] line-clamp-3">
                        Provides instant 24/7 inquiry handling and staff routing.
                      </p>
                    </div>

                    {/* Node 5: NEXUS Service */}
                    <div className="p-3 bg-white rounded-xl border-2 border-[#2563EB] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE] flex items-center gap-1">
                        <RiSparkling2Fill className="h-2.5 w-2.5" />
                        5. NEXUS Service
                      </span>
                      <p className="text-xs font-bold text-[#1E40AF] line-clamp-2">
                        {chain.service?.service || "NEXUS Core Solution"}
                      </p>
                      <p className="text-[11px] text-[#475569] line-clamp-3">
                        {chain.service?.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                    <span>
                      Priority Rationale: {chain.opportunity.priorityReason}
                    </span>
                    <span className="font-semibold text-[#10B981]">
                      {chain.opportunity.potentialValue}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
