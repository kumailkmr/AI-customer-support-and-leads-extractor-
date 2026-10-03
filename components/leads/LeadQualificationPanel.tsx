"use client";

import React from "react";
import { QualificationCriterion, QualificationValue, QualificationStatus } from "@/types/leads";
import { QUALIFICATION_STATUS_CONFIG } from "@/lib/leads/leads-config";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  RiCheckLine,
  RiCloseLine,
  RiQuestionLine,
  RiSubtractLine,
  RiShieldCheckLine,
} from "react-icons/ri";

interface LeadQualificationPanelProps {
  criteria: QualificationCriterion[];
  qualificationStatus: QualificationStatus;
  score: number;
  onUpdateCriterion: (id: string, value: QualificationValue, notes?: string) => void;
}

export function LeadQualificationPanel({
  criteria,
  qualificationStatus,
  score,
  onUpdateCriterion,
}: LeadQualificationPanelProps) {
  const statusCfg = QUALIFICATION_STATUS_CONFIG[qualificationStatus] || QUALIFICATION_STATUS_CONFIG.NOT_STARTED;

  const valueOptions: { value: QualificationValue; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "Yes", label: "Yes", icon: <RiCheckLine className="h-3 w-3" />, color: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]" },
    { value: "No", label: "No", icon: <RiCloseLine className="h-3 w-3" />, color: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]" },
    { value: "Unknown", label: "Unknown", icon: <RiQuestionLine className="h-3 w-3" />, color: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]" },
    { value: "Not Applicable", label: "N/A", icon: <RiSubtractLine className="h-3 w-3" />, color: "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]" },
  ];

  return (
    <Card padding="md" className="border-[#E2E8F0] space-y-4">
      <CardHeader
        title="Lead Qualification Framework"
        subtitle="Configured buying criteria evaluated through conversation & staff discovery"
        action={
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.badgeBorder}`}
            >
              {statusCfg.label}
            </span>
            <span className="text-xs font-bold text-[#0F172A] bg-[#F1F5F9] px-2 py-1 rounded-md border border-[#E2E8F0]">
              Score: {score}%
            </span>
          </div>
        }
      />

      {/* Progress Bar */}
      <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#475569]">Criteria Fulfillment</span>
          <span className="font-bold text-[#0F172A]">{score}% Confirmed</span>
        </div>
        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981] rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, score)}%` }}
          />
        </div>
        <p className="text-[11px] text-[#64748B]">
          Requires at least 4 confirmed criteria without active disqualifiers to achieve <strong>QUALIFIED</strong> status.
        </p>
      </div>

      {/* Criteria Checklist */}
      <div className="space-y-2.5">
        {criteria.map((c) => (
          <div
            key={c.id}
            className="p-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5 max-w-md">
              <div className="flex items-center gap-1.5 font-bold text-[#0F172A]">
                <RiShieldCheckLine className="h-4 w-4 text-[#2563EB] flex-shrink-0" />
                <span>{c.label}</span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-snug">{c.description}</p>
            </div>

            {/* Interactive Answer Buttons */}
            <div className="flex items-center gap-1 self-start sm:self-center">
              {valueOptions.map((opt) => {
                const isSelected = c.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onUpdateCriterion(c.id, opt.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                      isSelected
                        ? `${opt.color} shadow-xs scale-105`
                        : "bg-white text-[#94A3B8] border-[#E2E8F0] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
