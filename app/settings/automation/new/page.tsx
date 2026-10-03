"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import {
  FollowUpTargetType,
  AutomationTriggerType,
  AutomationActionType,
  AutomationCondition,
  ConditionOperator,
  FollowUpChannel,
  FollowUpPriority,
  AutomationMode,
  FollowUpType,
} from "@/lib/follow-ups/types";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiAddLine,
  RiDeleteBinLine,
  RiSparkling2Fill,
  RiThunderstormsLine,
  RiShieldCheckLine,
  RiSendPlane2Fill,
} from "react-icons/ri";

export default function NewAutomationRulePage() {
  const router = useRouter();
  const { createRule, templates } = useFollowUps();
  const { addToast } = useToast();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetType, setTargetType] = useState<FollowUpTargetType>("LEAD");
  const [category, setCategory] = useState<any>("Client Lead Capture");

  // Trigger
  const [triggerType, setTriggerType] = useState<AutomationTriggerType>("NO_REPLY_HOURS");
  const [delayMinutes, setDelayMinutes] = useState(120);

  // Conditions
  const [conditions, setConditions] = useState<AutomationCondition[]>([
    { field: "channel", operator: "equals", value: "whatsapp" },
  ]);

  // Action
  const [actionType, setActionType] = useState<AutomationActionType>("SCHEDULE_FOLLOW_UP");
  const [followUpType, setFollowUpType] = useState<FollowUpType>("NO_REPLY_NUDGE");
  const [channel, setChannel] = useState<FollowUpChannel>("whatsapp");
  const [priority, setPriority] = useState<FollowUpPriority>("HIGH");
  const [automationMode, setAutomationMode] = useState<AutomationMode>("AUTONOMOUS");
  const [templateId, setTemplateId] = useState<string>("");
  const [delayHours, setDelayHours] = useState(2);

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      { field: "qualification_score", operator: "greater_than", value: 60 },
    ]);
  };

  const removeCondition = (idx: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateCondition = (idx: number, updates: Partial<AutomationCondition>) => {
    setConditions((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...updates } : c))
    );
  };

  const handleFinish = () => {
    createRule({
      name: name || "Custom Automation Rule",
      description: description || "Automated trigger follow-up workflow",
      targetType,
      category,
      enabled: true,
      trigger: {
        type: triggerType,
        delayMinutes,
      },
      conditions,
      action: {
        type: actionType,
        followUpType,
        channel,
        priority,
        automationMode,
        templateId: templateId || undefined,
        delayHours,
      },
    });

    addToast({
      title: "Automation Rule Created",
      description: `Rule "${name}" is now live in Simulation Mode.`,
      variant: "success",
    });

    router.push("/settings/automation");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Visual Automation Builder"
        subtitle="Create automated follow-up triggers and conditional workflows."
        breadcrumbs={[
          { label: "Follow-Ups", href: "/follow-ups" },
          { label: "Rules", href: "/settings/automation" },
          { label: "New Rule" },
        ]}
        actions={
          <Link href="/settings/automation">
            <Button variant="outline" size="sm">
              <RiArrowLeftLine className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </Link>
        }
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Step Progress Tracker */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center justify-between text-xs">
          {[
            { id: 1, label: "Basics" },
            { id: 2, label: "Trigger" },
            { id: 3, label: "Conditions" },
            { id: 4, label: "Action & Channel" },
            { id: 5, label: "Review & Activate" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 font-medium transition-colors ${
                step === s.id
                  ? "text-[#2563EB] font-bold"
                  : step > s.id
                  ? "text-[#059669]"
                  : "text-[#94A3B8]"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === s.id
                    ? "bg-[#2563EB] text-white"
                    : step > s.id
                    ? "bg-[#ECFDF5] text-[#059669]"
                    : "bg-[#F1F5F9] text-[#94A3B8]"
                }`}
              >
                {step > s.id ? <RiCheckLine /> : s.id}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* STEP 1: BASICS */}
        {step === 1 && (
          <Card padding="lg" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#0F172A]">Step 1: Rule Details</h3>
            <p className="text-xs text-[#64748B]">
              Define the rule identity and target audience scope.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client Lead 2-Hour WhatsApp Check-in"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain what this automation accomplishes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-[#334155] block mb-1">
                    Target Entity Scope
                  </label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as FollowUpTargetType)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="LEAD">Client Lead (Your client&apos;s customer)</option>
                    <option value="PROSPECT">Nexus Prospect (Business you acquire)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#334155] block mb-1">
                    Workflow Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
                  >
                    <option value="Client Lead Capture">Client Lead Capture</option>
                    <option value="Prospect Acquisition">Prospect Acquisition</option>
                    <option value="Omnichannel Handoff">Omnichannel Handoff</option>
                    <option value="Re-engagement">Re-engagement</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(2)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              >
                Continue to Trigger &rarr;
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2: TRIGGER */}
        {step === 2 && (
          <Card padding="lg" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
              <RiThunderstormsLine className="text-[#2563EB]" />
              Step 2: Event Trigger
            </h3>
            <p className="text-xs text-[#64748B]">
              What event causes this automation rule to activate?
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Trigger Event Type
                </label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value as AutomationTriggerType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
                >
                  <option value="NO_REPLY_HOURS">Inactivity / No Reply Duration</option>
                  <option value="LEAD_QUALIFIED">Lead Qualified</option>
                  <option value="APPOINTMENT_SCHEDULED">Appointment Booked</option>
                  <option value="APPOINTMENT_UPCOMING">Appointment Upcoming</option>
                  <option value="QUOTE_SENT">Quote / Proposal Delivered</option>
                  <option value="HUMAN_HANDOFF_ACTIVATED">Human Takeover Initiated</option>
                  <option value="PROSPECT_STATUS_CHANGED">Prospect Status Changed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Trigger Delay Buffer (Minutes)
                </label>
                <input
                  type="number"
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1]"
                />
                <span className="text-[11px] text-[#64748B] mt-1 block">
                  e.g. 120 minutes = 2 hours after last inbound message
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                &larr; Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(3)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              >
                Continue to Conditions &rarr;
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3: CONDITIONS */}
        {step === 3 && (
          <Card padding="lg" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
                  <RiShieldCheckLine className="text-[#059669]" />
                  Step 3: Condition Criteria
                </h3>
                <p className="text-xs text-[#64748B]">
                  Only run this action when all criteria match.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={addCondition} className="text-xs">
                <RiAddLine className="h-4 w-4 mr-1" /> Add Condition
              </Button>
            </div>

            <div className="space-y-2.5 pt-2">
              {conditions.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#64748B] border border-dashed rounded-xl">
                  No conditions set. Rule will execute unconditionally on trigger event.
                </div>
              ) : (
                conditions.map((cond, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center gap-2 flex-wrap"
                  >
                    <select
                      value={cond.field}
                      onChange={(e) => updateCondition(idx, { field: e.target.value })}
                      className="text-xs p-2 rounded-lg border border-[#CBD5E1] bg-white min-w-[140px]"
                    >
                      <option value="channel">channel</option>
                      <option value="qualification_score">qualification_score</option>
                      <option value="has_human_takeover">has_human_takeover</option>
                      <option value="has_appointment">has_appointment</option>
                      <option value="status">status</option>
                      <option value="estimated_deal_value">estimated_deal_value</option>
                    </select>

                    <select
                      value={cond.operator}
                      onChange={(e) =>
                        updateCondition(idx, { operator: e.target.value as ConditionOperator })
                      }
                      className="text-xs p-2 rounded-lg border border-[#CBD5E1] bg-white"
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="greater_than">&gt; greater than</option>
                      <option value="less_than">&lt; less than</option>
                      <option value="contains">contains</option>
                    </select>

                    <input
                      type="text"
                      value={cond.value}
                      onChange={(e) => updateCondition(idx, { value: e.target.value })}
                      placeholder="Value"
                      className="text-xs p-2 rounded-lg border border-[#CBD5E1] flex-1 min-w-[120px]"
                    />

                    <button
                      type="button"
                      onClick={() => removeCondition(idx)}
                      className="p-2 text-[#94A3B8] hover:text-[#EF4444]"
                    >
                      <RiDeleteBinLine className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                &larr; Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(4)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              >
                Continue to Action &rarr;
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: ACTION & CHANNEL */}
        {step === 4 && (
          <Card padding="lg" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#0F172A] flex items-center gap-2">
              <RiSendPlane2Fill className="text-[#7C3AED]" />
              Step 4: Action & Dispatch Channel
            </h3>
            <p className="text-xs text-[#64748B]">
              Configure what follow-up action to create upon trigger match.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#334155] block mb-1">
                  Action Type
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as AutomationActionType)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
                >
                  <option value="SCHEDULE_FOLLOW_UP">Schedule Follow-Up Task</option>
                  <option value="PAUSE_EXISTING_FOLLOW_UPS">Pause Existing Follow-Ups (Safety)</option>
                  <option value="NOTIFY_AGENT">Notify Human Staff</option>
                </select>
              </div>

              {actionType === "SCHEDULE_FOLLOW_UP" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#334155] block mb-1">
                        Dispatch Channel
                      </label>
                      <select
                        value={channel}
                        onChange={(e) => setChannel(e.target.value as FollowUpChannel)}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white capitalize"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="email">Email</option>
                        <option value="website">Website</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#334155] block mb-1">
                        Execution Mode
                      </label>
                      <select
                        value={automationMode}
                        onChange={(e) => setAutomationMode(e.target.value as AutomationMode)}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
                      >
                        <option value="AUTONOMOUS">Autonomous Dispatch</option>
                        <option value="MANUAL_APPROVAL">Manual Operator Approval</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#334155] block mb-1">
                        Priority Level
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as FollowUpPriority)}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#334155] block mb-1">
                        Message Template
                      </label>
                      <select
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
                      >
                        <option value="">Default AI Prompt</option>
                        {templates
                          .filter((t) => t.targetType === targetType)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.channel})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setStep(3)}>
                &larr; Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStep(5)}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              >
                Review & Activate &rarr;
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 5: REVIEW & ACTIVATE */}
        {step === 5 && (
          <Card padding="lg" className="border-[#E2E8F0] bg-white shadow-xs space-y-5">
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">
                Step 5: Review & Activate Automation
              </h3>
              <p className="text-xs text-[#64748B]">
                Verify your rule definition before enabling it in the runtime engine.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                <span className="font-bold text-sm text-[#0F172A]">{name || "Untitled Rule"}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-[#EFF6FF] text-[#2563EB]">
                  {targetType}
                </span>
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">Trigger:</span>
                <span className="font-semibold text-[#1E293B]">
                  {triggerType} (after {delayMinutes} minutes)
                </span>
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">Conditions ({conditions.length}):</span>
                {conditions.map((c, i) => (
                  <code key={i} className="block text-[11px] font-mono text-[#334155]">
                    • {c.field} {c.operator} {String(c.value)}
                  </code>
                ))}
              </div>

              <div>
                <span className="text-[#64748B] block text-[11px]">Action Config:</span>
                <span className="font-semibold text-[#1E293B]">
                  {actionType} via {channel.toUpperCase()} ({automationMode}, {priority} Priority)
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-2 text-xs text-[#065F46]">
              <RiSparkling2Fill className="h-4 w-4 shrink-0" />
              <span>
                Idempotency guard and human takeover safety checks are automatically attached to this rule.
              </span>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setStep(4)}>
                &larr; Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleFinish}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5"
              >
                <RiCheckLine className="h-4 w-4" /> Save & Activate Rule
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
