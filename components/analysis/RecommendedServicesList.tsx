"use client";

import React from "react";
import { RecommendedService, Opportunity } from "@/types";
import { Card } from "@/components/ui/Card";
import {
  RiShieldCheckLine,
  RiCheckDoubleLine,
  RiSparkling2Fill,
} from "react-icons/ri";

interface RecommendedServicesListProps {
  services: RecommendedService[];
  opportunities: Opportunity[];
}

export function RecommendedServicesList({
  services,
  opportunities,
}: RecommendedServicesListProps) {
  const oppMap = React.useMemo(() => {
    const map = new Map<string, Opportunity>();
    opportunities.forEach((o) => map.set(o.id, o));
    return map;
  }, [opportunities]);

  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header */}
      <div className="border-b border-[#F1F5F9] pb-4">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
          <RiShieldCheckLine className="h-4 w-4 text-[#10B981]" />
          Recommended NEXUS Services ({services.length})
        </h3>
        <p className="text-xs text-[#64748B]">
          Targeted solutions selected to solve the prospect&apos;s specific inquiry and communication bottlenecks.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((svc) => {
          const linkedOpp = oppMap.get(svc.opportunityId);

          return (
            <div
              key={svc.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <RiSparkling2Fill className="h-2.5 w-2.5" />
                    {svc.category || "Service Package"}
                  </span>
                  {svc.userEdited && (
                    <span className="text-[10px] font-semibold text-[#B45309] bg-[#FFFBEB] px-1.5 py-0.2 rounded border border-[#FDE68A]">
                      Edited
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                  {svc.service}
                </h4>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    Strategic Rationale:
                  </span>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {svc.reason}
                  </p>
                </div>
              </div>

              {/* Linked Opportunity */}
              <div className="pt-2 border-t border-[#F8FAFC]">
                <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#64748B] space-y-0.5">
                  <span className="font-semibold text-[#0F172A] flex items-center gap-1">
                    <RiCheckDoubleLine className="h-3 w-3 text-[#2563EB]" />
                    Addresses Opportunity:
                  </span>
                  <p className="text-[#1E40AF] font-medium line-clamp-1">
                    {linkedOpp?.title || "Lead Capture & Conversion"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
