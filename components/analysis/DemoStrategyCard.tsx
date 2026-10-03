"use client";

import React from "react";
import { DemoStrategy } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  RiPresentationLine,
  RiArrowRightLine,
  RiLayoutMasonryLine,
  RiNodeTree,
  RiSparkling2Fill,
} from "react-icons/ri";

interface DemoStrategyCardProps {
  demoStrategy: DemoStrategy;
  onPrepareDemo: () => void;
}

export function DemoStrategyCard({
  demoStrategy,
  onPrepareDemo,
}: DemoStrategyCardProps) {
  return (
    <Card padding="lg" className="border-[#DDD6FE] bg-gradient-to-br from-white to-[#FAF5FF] shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE9FE] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <RiPresentationLine className="h-4 w-4 text-[#8B5CF6]" />
            Recommended Interactive Demo Strategy
          </h3>
          <p className="text-xs text-[#64748B]">
            Structured proof-of-concept concept to present during the discovery or pitch meeting.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          leftIcon={<RiSparkling2Fill className="h-4 w-4" />}
          rightIcon={<RiArrowRightLine className="h-4 w-4" />}
          onClick={onPrepareDemo}
        >
          Prepare Demo Prototype
        </Button>
      </div>

      {/* Demo Objective */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5CF6] block">
          Core Demonstration Objective
        </span>
        <p className="text-sm font-semibold text-[#0F172A] leading-relaxed">
          {demoStrategy.objective}
        </p>
      </div>

      {/* Screens Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
          <RiLayoutMasonryLine className="h-3.5 w-3.5 text-[#2563EB]" />
          Recommended Prototype Screens ({demoStrategy.screens.length})
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {demoStrategy.screens.map((screen, idx) => (
            <div
              key={screen.name}
              className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-md bg-[#EFF6FF] text-[#2563EB] font-bold text-[11px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h5 className="text-xs font-bold text-[#0F172A] truncate">
                  {screen.name}
                </h5>
              </div>

              <p className="text-[11px] text-[#475569] leading-relaxed line-clamp-2">
                {screen.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1 border-t border-[#F8FAFC]">
                {screen.keyFeatures.map((feat) => (
                  <span
                    key={feat}
                    className="text-[10px] font-medium text-[#1E40AF] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Workflow Timeline */}
      <div className="space-y-2 pt-2 border-t border-[#EDE9FE]">
        <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
          <RiNodeTree className="h-3.5 w-3.5 text-[#10B981]" />
          Demonstration Journey Sequence
        </h4>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {demoStrategy.workflow.map((step, idx) => (
            <React.Fragment key={step}>
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E2E8F0] text-[#334155] font-medium shadow-2xs">
                {idx + 1}. {step}
              </span>
              {idx < demoStrategy.workflow.length - 1 && (
                <RiArrowRightLine className="h-3 w-3 text-[#94A3B8] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Card>
  );
}
