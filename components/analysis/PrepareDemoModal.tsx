"use client";

import React from "react";
import { ReadinessCheck, BusinessProspect } from "@/types";
import { Button } from "@/components/ui/Button";
import {
  RiCloseLine,
  RiPresentationLine,
  RiCheckLine,
  RiAlertLine,
  RiShieldCheckLine,
  RiArrowRightLine,
} from "react-icons/ri";

interface PrepareDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: BusinessProspect;
  readiness: ReadinessCheck;
  onProceedToDemo: () => void;
}

export function PrepareDemoModal({
  isOpen,
  onClose,
  prospect,
  readiness,
  onProceedToDemo,
}: PrepareDemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#FAF5FF] text-[#8B5CF6]">
              <RiPresentationLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Prepare Demo Prototype
              </h3>
              <p className="text-xs text-[#64748B]">
                Pre-flight readiness quality check for {prospect.businessName}.
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

        {/* Readiness Warning / Confirmation */}
        {!readiness.isReadyForDemo ? (
          <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <RiAlertLine className="h-4 w-4 text-[#D97706] shrink-0" />
              Research is incomplete.
            </div>
            <p className="leading-relaxed">
              Add more research before preparing a high-confidence demo. While you can still proceed, having complete website and channel observations produces significantly more persuasive prototype screens.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#065F46] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <RiShieldCheckLine className="h-4 w-4 text-[#10B981] shrink-0" />
              Research completeness verified ({readiness.score}/5 areas).
            </div>
            <p className="leading-relaxed">
              All critical channel signals are captured. Ready to initialize interactive client demo specifications.
            </p>
          </div>
        )}

        {/* Areas Checklist */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            Research Completeness Checklist
          </span>
          <div className="space-y-1.5">
            {readiness.areas.map((area) => (
              <div
                key={area.name}
                className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  {area.complete ? (
                    <span className="h-4 w-4 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                      <RiCheckLine className="h-3 w-3" />
                    </span>
                  ) : (
                    <span className="h-4 w-4 rounded-full bg-[#F59E0B]/15 text-[#D97706] flex items-center justify-center">
                      <RiAlertLine className="h-3 w-3" />
                    </span>
                  )}
                  <span className="font-semibold text-[#0F172A]">{area.name}</span>
                </div>
                <span className="text-[11px] text-[#64748B] truncate max-w-[200px]">
                  {area.details}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            rightIcon={<RiArrowRightLine className="h-4 w-4" />}
            onClick={() => {
              onClose();
              onProceedToDemo();
            }}
          >
            {readiness.isReadyForDemo
              ? "Proceed to Demo Generator"
              : "Proceed Anyway"}
          </Button>
        </div>
      </div>
    </div>
  );
}
