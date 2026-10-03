"use client";

import React from "react";
import { SolutionArchitecture } from "@/types";
import { Card } from "@/components/ui/Card";
import {
  RiFlowChart,
  RiArrowRightLine,
  RiSparkling2Fill,
  RiInformationLine,
} from "react-icons/ri";

interface SolutionArchitectureDiagramProps {
  architecture: SolutionArchitecture;
}

export function SolutionArchitectureDiagram({
  architecture,
}: SolutionArchitectureDiagramProps) {
  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-[#F1F5F9] pb-4">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <RiFlowChart className="h-4 w-4 text-[#2563EB]" />
          Adaptive Solution Architecture
        </h3>
        <p className="text-xs text-[#64748B]">
          {architecture.description}
        </p>
      </div>

      {/* Horizontal Scrollable Architecture Canvas */}
      <div className="overflow-x-auto pb-4 pt-2">
        <div className="min-w-[760px] flex items-center justify-between gap-3">
          {architecture.nodes.map((node, index) => {
            const isLast = index === architecture.nodes.length - 1;
            const isAiCore = node.channel?.toLowerCase().includes("ai") || node.id.includes("ai");

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  className={`w-44 p-3.5 rounded-xl border transition-all shrink-0 space-y-2 ${
                    isAiCore
                      ? "bg-gradient-to-b from-[#FAF5FF] to-white border-[#8B5CF6] shadow-sm ring-2 ring-[#8B5CF6]/10"
                      : "bg-white border-[#E2E8F0] shadow-2xs hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isAiCore
                          ? "bg-[#8B5CF6] text-white"
                          : "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      {node.role}
                    </span>
                    {node.channel && (
                      <span className="text-[9px] font-medium text-[#64748B] truncate">
                        {node.channel}
                      </span>
                    )}
                  </div>

                  <h5 className="text-xs font-bold text-[#0F172A] leading-snug flex items-center gap-1">
                    {isAiCore && (
                      <RiSparkling2Fill className="h-3 w-3 text-[#8B5CF6] shrink-0" />
                    )}
                    <span>{node.label}</span>
                  </h5>

                  <p className="text-[11px] text-[#475569] leading-relaxed line-clamp-3">
                    {node.description}
                  </p>
                </div>

                {/* Arrow Connector */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center shrink-0 px-1 text-[#94A3B8]">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#64748B] uppercase tracking-wider bg-[#F8FAFC] px-1.5 py-0.5 rounded border border-[#E2E8F0] mb-1">
                      <span>Flow</span>
                    </div>
                    <RiArrowRightLine className="h-5 w-5 text-[#2563EB]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Responsive scroll hint */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
        <RiInformationLine className="h-3.5 w-3.5 shrink-0" />
        <span>
          Tip: Scroll horizontally to review the end-to-end customer journey from inbound lead capture to staff handoff.
        </span>
      </div>
    </Card>
  );
}
