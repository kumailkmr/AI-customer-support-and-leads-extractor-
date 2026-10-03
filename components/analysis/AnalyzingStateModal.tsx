"use client";

import React from "react";
import { RiSparkling2Fill } from "react-icons/ri";

interface AnalyzingStateModalProps {
  isOpen: boolean;
  stage: string;
  percent: number;
  businessName: string;
}

export function AnalyzingStateModal({
  isOpen,
  stage,
  percent,
  businessName,
}: AnalyzingStateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Animated AI Icon */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center text-white shadow-lg animate-pulse">
              <RiSparkling2Fill className="h-8 w-8" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-[#8B5CF6]/30 blur-sm -z-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#0F172A]">
              Analyzing {businessName}
            </h3>
            <p className="text-xs text-[#64748B]">
              Synthesizing digital presence, audit signals, and opportunity recommendations.
            </p>
          </div>
        </div>

        {/* Current Stage Indicator */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#8B5CF6] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-ping" />
              {stage || "Processing business audit..."}
            </span>
            <span className="text-[#0F172A]">{percent}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] h-full transition-all duration-300 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-[#94A3B8] text-center">
          Deterministic local analysis engine running. Results will be saved automatically.
        </p>
      </div>
    </div>
  );
}
