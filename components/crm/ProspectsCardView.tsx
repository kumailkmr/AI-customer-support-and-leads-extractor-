"use client";

import React from "react";
import Link from "next/link";
import { BusinessProspect, ProspectPipelineStatus } from "@/types/prospects";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCrmCurrency } from "@/lib/crm/crm-service";
import { getStageConfig, PIPELINE_STAGES } from "@/lib/crm/pipeline-config";
import {
  RiBuilding4Line,
  RiMapPin2Line,
  RiGlobalLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiCalendarLine,
  RiArrowRightLine,
  RiSparkling2Fill,
  RiTimeLine,
} from "react-icons/ri";

interface ProspectsCardViewProps {
  prospects: BusinessProspect[];
  onUpdateStatus: (id: string, status: ProspectPipelineStatus) => void;
  onDeleteProspect: (id: string) => void;
}

export function ProspectsCardView({
  prospects,
  onUpdateStatus,
}: ProspectsCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prospects.map((item) => {
        const stageConfig = getStageConfig(item.status);

        return (
          <Card
            key={item.id}
            padding="md"
            className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] flex-shrink-0 mt-0.5">
                    <RiBuilding4Line className="h-4 w-4" />
                  </div>
                  <div>
                    <Link
                      href={`/prospects/${item.id}`}
                      className="text-sm font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors leading-snug line-clamp-1"
                    >
                      {item.businessName}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-0.5">
                      <span>{item.industry}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <RiMapPin2Line className="h-3 w-3 text-[#94A3B8]" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    item.opportunityLevel === "High"
                      ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                      : item.opportunityLevel === "Medium"
                      ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                      : "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]"
                  }`}
                >
                  {item.opportunityLevel}
                </span>
              </div>

              {/* Deal Value & Opportunity Score */}
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase tracking-wider font-semibold">
                    Estimated Deal
                  </span>
                  <span className="text-sm font-extrabold text-[#0F172A]">
                    {formatCrmCurrency(item.estimatedDealValue || 0)}
                  </span>
                  {item.monthlyValue && (
                    <span className="text-[10px] text-[#059669] font-medium ml-1">
                      +{formatCrmCurrency(item.monthlyValue)}/mo
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block uppercase tracking-wider font-semibold">
                    NEXUS Fit
                  </span>
                  <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] inline-flex items-center gap-1">
                    <RiSparkling2Fill className="h-3 w-3" />
                    {item.nexusFitScore}%
                  </span>
                </div>
              </div>

              {/* Channels & Tags */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-2">
                  {item.hasWebsite && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#475569]">
                      <RiGlobalLine className="h-3 w-3 text-[#2563EB]" />
                      Web
                    </span>
                  )}
                  {item.socialPresence.instagram?.active && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#9D174D]">
                      <RiInstagramLine className="h-3 w-3 text-[#E1306C]" />
                      IG
                    </span>
                  )}
                  {item.socialPresence.whatsapp && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#047857]">
                      <RiWhatsappLine className="h-3 w-3 text-[#10B981]" />
                      WA
                    </span>
                  )}
                </div>

                {item.followUp ? (
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                      item.followUp.status === "today"
                        ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                        : item.followUp.status === "overdue"
                        ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                        : "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                    }`}
                  >
                    <RiCalendarLine className="h-3 w-3" />
                    {item.followUp.status === "today"
                      ? "Due Today"
                      : item.followUp.date}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <RiTimeLine className="h-3 w-3" />
                    {item.lastActivity}
                  </span>
                )}
              </div>
            </div>

            {/* Footer with Stage Selector & View Link */}
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
              <select
                value={stageConfig.id}
                onChange={(e) =>
                  onUpdateStatus(
                    item.id,
                    e.target.value as ProspectPipelineStatus
                  )
                }
                className="text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition-colors cursor-pointer max-w-[130px] truncate"
                style={{
                  backgroundColor: stageConfig.bgColor,
                  color: stageConfig.textColor,
                  borderColor: stageConfig.borderColor,
                }}
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              <Link href={`/prospects/${item.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}
                >
                  View Dossier
                </Button>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
