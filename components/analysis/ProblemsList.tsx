"use client";

import React from "react";
import { BusinessProblem, BusinessObservation } from "@/types";
import { Card } from "@/components/ui/Card";
import { getConfidenceBadgeProps } from "@/lib/analysis/analysis-service";
import {
  RiAlertLine,
  RiInformationLine,
  RiLinkM,
} from "react-icons/ri";

interface ProblemsListProps {
  problems: BusinessProblem[];
  observations: BusinessObservation[];
}

export function ProblemsList({ problems, observations }: ProblemsListProps) {
  const obsMap = React.useMemo(() => {
    const map = new Map<string, BusinessObservation>();
    observations.forEach((o) => map.set(o.id, o));
    return map;
  }, [observations]);

  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-[#F1F5F9] pb-4">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <RiAlertLine className="h-4 w-4 text-[#F59E0B]" />
          Potential Business Problems & Hypotheses ({problems.length})
        </h3>
        <p className="text-xs text-[#64748B]">
          Inferred conversion bottlenecks based on observed digital friction points. Stated as hypotheses rather than verified facts.
        </p>
      </div>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map((prob) => {
          const confidenceProps = getConfidenceBadgeProps(prob.confidence);

          return (
            <div
              key={prob.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-2 py-0.5 rounded-full">
                    Problem Hypothesis
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${confidenceProps.bg} ${confidenceProps.text} ${confidenceProps.border}`}
                  >
                    {confidenceProps.label}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                  {prob.title}
                </h4>

                <p className="text-xs text-[#475569] leading-relaxed">
                  {prob.description}
                </p>
              </div>

              {/* Supporting Observations */}
              <div className="pt-2 border-t border-[#F8FAFC] space-y-1.5">
                <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                  <RiLinkM className="h-3.5 w-3.5 text-[#2563EB]" />
                  Inferred from Research Signals:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {prob.sourceObservationIds.map((obsId) => {
                    const linkedObs = obsMap.get(obsId);
                    return (
                      <span
                        key={obsId}
                        className="text-[10px] font-medium text-[#1E40AF] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-md truncate max-w-full"
                        title={linkedObs?.description || obsId}
                      >
                        {linkedObs?.title || obsId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footnote */}
      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[11px] text-[#64748B] flex items-center gap-2">
        <RiInformationLine className="h-4 w-4 text-[#8B5CF6] shrink-0" />
        <span>
          NEXUS Principle: Hypotheses serve as talking points for discovery conversations, not confirmed operational facts.
        </span>
      </div>
    </Card>
  );
}
