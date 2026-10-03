"use client";

import React from "react";
import { ReadinessCheck } from "@/types";
import { Card } from "@/components/ui/Card";
import {
  RiCheckLine,
  RiInformationLine,
  RiShieldCheckLine,
  RiAlertLine,
} from "react-icons/ri";

interface ReadinessChecklistCardProps {
  readiness: ReadinessCheck;
}

export function ReadinessChecklistCard({ readiness }: ReadinessChecklistCardProps) {
  const percentage = Math.round((readiness.score / readiness.total) * 100);

  return (
    <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <RiShieldCheckLine className="h-4 w-4 text-[#2563EB]" />
              Analysis Research Readiness
            </h3>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                readiness.isReadyForDemo
                  ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                  : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
              }`}
            >
              {readiness.isReadyForDemo ? "Demo Ready" : "Needs Additional Audit"}
            </span>
          </div>
          <p className="text-xs text-[#64748B]">
            Measures NEXUS data completeness across key digital research dimensions.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-sm font-bold text-[#0F172A]">
            {readiness.score} / {readiness.total} Areas
          </span>
          <span className="text-xs text-[#64748B]">({percentage}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            percentage >= 80
              ? "bg-[#10B981]"
              : percentage >= 50
              ? "bg-[#2563EB]"
              : "bg-[#F59E0B]"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 5 Dimensions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
        {readiness.areas.map((area) => (
          <div
            key={area.name}
            className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
              area.complete
                ? "bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]"
                : "bg-[#FFFBEB]/50 border-[#FDE68A] text-[#92400E]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold truncate">{area.name}</span>
              {area.complete ? (
                <span className="h-4 w-4 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <RiCheckLine className="h-3 w-3" />
                </span>
              ) : (
                <span className="h-4 w-4 rounded-full bg-[#F59E0B]/15 text-[#D97706] flex items-center justify-center">
                  <RiAlertLine className="h-3 w-3" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
              {area.details}
            </p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] pt-1">
        <RiInformationLine className="h-3.5 w-3.5 shrink-0" />
        <span>
          Note: This score reflects internal NEXUS research depth, not an objective evaluation of the client&apos;s business quality.
        </span>
      </div>
    </Card>
  );
}
