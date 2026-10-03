"use client";

import React from "react";
import Link from "next/link";
import { BusinessProspect, ProspectPipelineStatus } from "@/types/prospects";
import { formatCrmCurrency } from "@/lib/crm/crm-service";
import { PIPELINE_STAGES, normalizePipelineStatus } from "@/lib/crm/pipeline-config";
import {
  RiMapPin2Line,
  RiCalendarLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiSparkling2Fill,
  RiTimeLine,
} from "react-icons/ri";

interface ProspectsKanbanProps {
  prospects: BusinessProspect[];
  onUpdateStatus: (id: string, newStatus: ProspectPipelineStatus) => void;
}

export function ProspectsKanban({
  prospects,
  onUpdateStatus,
}: ProspectsKanbanProps) {
  return (
    <div className="overflow-x-auto pb-6 pt-1">
      <div className="flex items-start gap-4 min-w-[2800px] px-1">
        {PIPELINE_STAGES.map((stage, stageIdx) => {
          const stageProspects = prospects.filter(
            (p) => normalizePipelineStatus(p.status) === stage.id
          );
          const stageTotalValue = stageProspects.reduce(
            (acc, curr) => acc + (curr.estimatedDealValue || 0),
            0
          );

          const canMovePrev = stageIdx > 0;
          const canMoveNext = stageIdx < PIPELINE_STAGES.length - 1;

          return (
            <div
              key={stage.id}
              className="w-72 flex-shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col max-h-[calc(100vh-280px)] shadow-xs"
            >
              {/* Column Header */}
              <div
                className="p-3 border-b border-[#E2E8F0] rounded-t-xl bg-white flex items-center justify-between"
                style={{ borderTop: `3px solid ${stage.color}` }}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h4 className="text-xs font-bold text-[#0F172A] tracking-tight">
                      {stage.label}
                    </h4>
                    <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.2 rounded-full border border-[#E2E8F0]">
                      {stageProspects.length}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#64748B] font-medium block mt-0.5">
                    {formatCrmCurrency(stageTotalValue, { compact: true })} value
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                {stageProspects.length > 0 ? (
                  stageProspects.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] p-3 rounded-xl shadow-xs transition-all hover:shadow-sm space-y-2.5"
                    >
                      {/* Business Header */}
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/prospects/${item.id}`}
                          className="font-bold text-xs text-[#0F172A] hover:text-[#2563EB] transition-colors leading-snug line-clamp-2"
                        >
                          {item.businessName}
                        </Link>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border flex-shrink-0 ${
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

                      {/* Industry & Location */}
                      <div className="flex items-center gap-1.5 text-[10px] text-[#64748B]">
                        <span>{item.industry}</span>
                        <span>·</span>
                        <span className="flex items-center gap-0.5 truncate">
                          <RiMapPin2Line className="h-3 w-3 text-[#94A3B8]" />
                          {item.location}
                        </span>
                      </div>

                      {/* Deal Value & Opportunity Fit */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#F1F5F9]">
                        <span className="font-extrabold text-[#0F172A]">
                          {formatCrmCurrency(item.estimatedDealValue || 0)}
                        </span>
                        <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.2 rounded border border-[#BFDBFE] flex items-center gap-0.5">
                          <RiSparkling2Fill className="h-2.5 w-2.5" />
                          {item.nexusFitScore}% Fit
                        </span>
                      </div>

                      {/* Key Opportunity Tag */}
                      {item.serviceInterest && item.serviceInterest.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[9px] text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-1.5 py-0.5 rounded truncate max-w-[180px]">
                            {item.serviceInterest[0]}
                          </span>
                        </div>
                      )}

                      {/* Follow-Up Status */}
                      {item.followUp ? (
                        <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-semibold border ${
                              item.followUp.status === "today"
                                ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                                : item.followUp.status === "overdue"
                                ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                                : "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                            }`}
                          >
                            <RiCalendarLine className="h-2.5 w-2.5" />
                            {item.followUp.status === "today"
                              ? "Today"
                              : item.followUp.date}
                          </span>
                          <span className="truncate max-w-[100px]">
                            {item.followUp.channel}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                          <RiTimeLine className="h-2.5 w-2.5" />
                          <span>{item.lastActivity}</span>
                        </div>
                      )}

                      {/* Quick Move Stepper Actions */}
                      <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-1">
                        <button
                          type="button"
                          disabled={!canMovePrev}
                          onClick={() =>
                            onUpdateStatus(
                              item.id,
                              PIPELINE_STAGES[stageIdx - 1].id
                            )
                          }
                          className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title={
                            canMovePrev
                              ? `Move back to ${PIPELINE_STAGES[stageIdx - 1].label}`
                              : "Initial stage"
                          }
                        >
                          <RiArrowLeftSLine className="h-4 w-4" />
                        </button>

                        <select
                          value={stage.id}
                          onChange={(e) =>
                            onUpdateStatus(
                              item.id,
                              e.target.value as ProspectPipelineStatus
                            )
                          }
                          className="text-[10px] text-[#64748B] bg-transparent border-0 focus:outline-none cursor-pointer max-w-[120px] truncate font-medium text-center"
                        >
                          {PIPELINE_STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          disabled={!canMoveNext}
                          onClick={() =>
                            onUpdateStatus(
                              item.id,
                              PIPELINE_STAGES[stageIdx + 1].id
                            )
                          }
                          className="p-1 rounded text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title={
                            canMoveNext
                              ? `Advance to ${PIPELINE_STAGES[stageIdx + 1].label}`
                              : "Final stage"
                          }
                        >
                          <RiArrowRightSLine className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-[#94A3B8]">
                    <span>No prospects in this stage</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
