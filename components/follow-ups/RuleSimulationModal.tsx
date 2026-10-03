"use client";

import React, { useState } from "react";
import { AutomationRule } from "@/lib/follow-ups/types";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useLeads } from "@/lib/store/leads-store";
import { useProspects } from "@/lib/store/prospects-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { evaluateRuleOnTarget } from "@/lib/follow-ups/automation-engine";
import {
  RiCloseLine,
  RiFlaskLine,
  RiCheckLine,
  RiCloseCircleLine,
  RiAlertLine,
  RiSparkling2Fill,
} from "react-icons/ri";

interface RuleSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  rule: AutomationRule | null;
}

export function RuleSimulationModal({
  isOpen,
  onClose,
  rule,
}: RuleSimulationModalProps) {
  const { runs, followUps, templates, triggerRuleSimulation } = useFollowUps();
  const { leads } = useLeads();
  const { prospects } = useProspects();
  const { addToast } = useToast();

  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [testResult, setTestResult] = useState<any | null>(null);

  if (!isOpen || !rule) return null;

  const isLeadRule = rule.targetType === "LEAD";
  const availableTargets = isLeadRule ? leads : prospects;

  const currentTargetId = selectedTargetId || availableTargets[0]?.id || "";
  const selectedTarget = availableTargets.find((t) => t.id === currentTargetId);

  const handleRunSimulation = () => {
    if (!selectedTarget) return;

    const targetPayload = isLeadRule
      ? {
          id: selectedTarget.id,
          name: (selectedTarget as any).name,
          targetType: "LEAD" as const,
          clientId: (selectedTarget as any).clientId,
          clientName: (selectedTarget as any).companyName,
          channel: (selectedTarget as any).channel,
          qualification_score: (selectedTarget as any).qualificationScore || 85,
          has_human_takeover: (selectedTarget as any).aiStatus === "HUMAN_HANDOFF",
          has_appointment: true,
          has_email: Boolean((selectedTarget as any).email),
          has_phone: Boolean((selectedTarget as any).phone),
        }
      : {
          id: selectedTarget.id,
          name: (selectedTarget as any).name,
          targetType: "PROSPECT" as const,
          industry: (selectedTarget as any).industry,
          status: (selectedTarget as any).status,
          has_email: true,
          has_phone: true,
          estimated_deal_value: (selectedTarget as any).dealValue || 6000,
        };

    // Run engine evaluation
    const template = rule.action.templateId
      ? templates.find((t) => t.id === rule.action.templateId)
      : undefined;

    const res = evaluateRuleOnTarget(
      rule,
      targetPayload,
      "SIMULATION_TEST_SUITE",
      runs,
      followUps,
      template?.body,
      template?.subject
    );

    setTestResult(res);

    if (res.run.status === "SUCCESS") {
      triggerRuleSimulation(rule.id, targetPayload);
      addToast({
        title: "Simulation Passed",
        description: `Rule triggered and scheduled follow-up for ${targetPayload.name}.`,
        variant: "success",
      });
    } else {
      addToast({
        title: `Simulation ${res.run.status}`,
        description: res.run.reason,
        variant: res.run.status === "SKIPPED" ? "info" : "warning",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <RiFlaskLine className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Rule Simulation Sandbox
              </h2>
              <p className="text-xs text-[#64748B]">
                Test trigger & condition evaluation against actual {isLeadRule ? "Leads" : "Prospects"}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Rule Overview */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0F172A] text-sm">{rule.name}</span>
              <span className="px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] uppercase">
                {rule.category}
              </span>
            </div>
            <p className="text-[#64748B] text-[11px]">{rule.description}</p>
          </div>

          {/* Target Selector */}
          <div>
            <label className="text-xs font-semibold text-[#334155] block mb-1">
              Select Test Subject ({isLeadRule ? "Lead" : "Prospect"})
            </label>
            <select
              value={currentTargetId}
              onChange={(e) => {
                setSelectedTargetId(e.target.value);
                setTestResult(null);
              }}
              className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white focus:outline-hidden focus:border-[#2563EB]"
            >
              {availableTargets.map((item) => {
                const label = isLeadRule ? (item as any).name : (item as any).businessName;
                const sub = isLeadRule ? (item as any).clientName : (item as any).industry;
                return (
                  <option key={item.id} value={item.id}>
                    {label} ({sub})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Condition Inspection */}
          <div className="space-y-1.5">
            <span className="font-semibold text-[#334155] block text-[11px]">
              Conditions to Evaluate ({rule.conditions.length}):
            </span>
            {rule.conditions.length === 0 ? (
              <div className="p-2 text-xs text-[#64748B] bg-[#F1F5F9] rounded-lg">
                No extra conditions. Rule triggers unconditionally on event.
              </div>
            ) : (
              <div className="space-y-1">
                {rule.conditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg flex items-center justify-between text-[11px]"
                  >
                    <code className="font-mono text-[#0F172A]">
                      {cond.field} {cond.operator} {String(cond.value)}
                    </code>
                    <span className="text-[#64748B]">Condition #{idx + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Evaluation Result View */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                testResult.run.status === "SUCCESS"
                  ? "bg-[#ECFDF5] border-[#A7F3D0]"
                  : testResult.run.status === "DUPLICATE"
                  ? "bg-[#FEF3C7] border-[#FDE68A]"
                  : "bg-[#FFF1F2] border-[#FECDD3]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-xs">
                  {testResult.run.status === "SUCCESS" ? (
                    <>
                      <RiCheckLine className="h-4 w-4 text-[#059669]" />
                      <span className="text-[#065F46]">EVALUATION PASSED: SUCCESS</span>
                    </>
                  ) : testResult.run.status === "DUPLICATE" ? (
                    <>
                      <RiAlertLine className="h-4 w-4 text-[#D97706]" />
                      <span className="text-[#92400E]">IDEMPOTENCY DUPLICATE GUARD</span>
                    </>
                  ) : (
                    <>
                      <RiCloseCircleLine className="h-4 w-4 text-[#E11D48]" />
                      <span className="text-[#9F1239]">EVALUATION SKIPPED / CONDITION UNMET</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {testResult.run.id}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-[#334155]">
                {testResult.run.reason}
              </p>

              {testResult.createdFollowUp && (
                <div className="pt-2 border-t border-[#A7F3D0] text-[11px] text-[#065F46] space-y-0.5">
                  <div className="font-semibold">
                    Simulated Follow-Up Generated: {testResult.createdFollowUp.id}
                  </div>
                  <div>Channel: {testResult.createdFollowUp.channel.toUpperCase()}</div>
                  <div className="italic line-clamp-2">
                    &ldquo;{testResult.createdFollowUp.message}&rdquo;
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B] flex items-center gap-1">
              <RiSparkling2Fill className="text-[#8B5CF6]" />
              Simulation Mode Only
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRunSimulation}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1"
              >
                <RiFlaskLine className="h-4 w-4 mr-1" /> Run Test Simulation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
