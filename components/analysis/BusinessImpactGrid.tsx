"use client";

import React from "react";
import { BusinessImpact } from "@/types";
import { Card } from "@/components/ui/Card";
import {
  RiPulseLine,
  RiTimeLine,
  RiUserHeartLine,
  RiFlowChart,
  RiCheckboxCircleLine,
  RiCustomerService2Line,
  RiInformationLine,
} from "react-icons/ri";

interface BusinessImpactGridProps {
  impacts: BusinessImpact[];
}

export function BusinessImpactGrid({ impacts }: BusinessImpactGridProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Response Time":
        return <RiTimeLine className="h-4 w-4 text-[#2563EB]" />;
      case "Customer Experience":
        return <RiUserHeartLine className="h-4 w-4 text-[#8B5CF6]" />;
      case "Lead Capture":
        return <RiPulseLine className="h-4 w-4 text-[#10B981]" />;
      case "Conversion Flow":
        return <RiFlowChart className="h-4 w-4 text-[#F59E0B]" />;
      case "Operational Efficiency":
        return <RiCheckboxCircleLine className="h-4 w-4 text-[#06B6D4]" />;
      default:
        return <RiCustomerService2Line className="h-4 w-4 text-[#64748B]" />;
    }
  };

  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-[#F1F5F9] pb-4">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <RiPulseLine className="h-4 w-4 text-[#10B981]" />
          Estimated Business Transformation Impact ({impacts.length})
        </h3>
        <p className="text-xs text-[#64748B]">
          Qualitative operational benefits anticipated upon implementing recommended NEXUS touchpoints.
        </p>
      </div>

      {/* Impact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {impacts.map((item) => (
          <div
            key={item.category}
            className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                {getCategoryIcon(item.category)}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-[#0F172A]">
                  {item.title}
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed pt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Integrity Disclaimer */}
      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[11px] text-[#64748B] flex items-center gap-2">
        <RiInformationLine className="h-4 w-4 text-[#2563EB] shrink-0" />
        <span>
          NEXUS Integrity Standard: Projections are strictly qualitative operational assessments. No speculative percentages or guaranteed revenue metrics are manufactured.
        </span>
      </div>
    </Card>
  );
}
