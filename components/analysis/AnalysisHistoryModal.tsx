"use client";

import React from "react";
import { AnalysisHistoryRecord } from "@/types";
import { Button } from "@/components/ui/Button";
import { getConfidenceBadgeProps } from "@/lib/analysis/analysis-service";
import {
  RiCloseLine,
  RiHistoryLine,
  RiCheckLine,
} from "react-icons/ri";

interface AnalysisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisHistoryRecord[];
  currentVersion: number;
}

export function AnalysisHistoryModal({
  isOpen,
  onClose,
  history,
  currentVersion,
}: AnalysisHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <RiHistoryLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Analysis Version History
              </h3>
              <p className="text-xs text-[#64748B]">
                Review historical generation snapshots and manual modification records.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* History Records List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {history.map((record) => {
            const isCurrent = record.version === currentVersion && !record.userEdited;
            const confidenceProps = getConfidenceBadgeProps(record.confidence);

            return (
              <div
                key={record.id}
                className={`p-4 rounded-xl border transition-all space-y-2 ${
                  isCurrent
                    ? "bg-[#EFF6FF]/40 border-[#BFDBFE]"
                    : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#334155] border border-[#E2E8F0]">
                      Version {record.version}
                    </span>
                    {record.userEdited && (
                      <span className="text-[10px] font-semibold text-[#B45309] bg-[#FFFBEB] px-1.5 py-0.2 rounded border border-[#FDE68A]">
                        Manual Edit
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE] flex items-center gap-1">
                        <RiCheckLine className="h-3 w-3" />
                        Active Current
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-[#94A3B8]">
                    {new Date(record.generatedAt).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${confidenceProps.bg} ${confidenceProps.text} ${confidenceProps.border}`}
                    >
                      {confidenceProps.label}
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] truncate">
                      {record.primaryOpportunity}
                    </span>
                  </div>

                  <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                    {record.summary}
                  </p>
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <div className="py-8 text-center text-xs text-[#94A3B8]">
              No previous version records found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#F1F5F9]">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close History
          </Button>
        </div>
      </div>
    </div>
  );
}
