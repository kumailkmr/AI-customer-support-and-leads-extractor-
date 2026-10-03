"use client";

import React, { useState } from "react";
import {
  FollowUp,
  FollowUpTargetType,
  FollowUpChannel,
  FollowUpType,
  FollowUpPriority,
  AutomationMode,
} from "@/lib/follow-ups/types";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useLeads } from "@/lib/store/leads-store";
import { useProspects } from "@/lib/store/prospects-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { FollowUpChannelPreview } from "./FollowUpChannelPreview";
import {
  RiCloseLine,
  RiAddLine,
  RiSparkling2Fill,
  RiTimeLine,
  RiCalendarEventLine,
} from "react-icons/ri";

interface CreateFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTargetType?: FollowUpTargetType;
  defaultTargetId?: string;
}

export function CreateFollowUpModal({
  isOpen,
  onClose,
  defaultTargetType = "LEAD",
  defaultTargetId,
}: CreateFollowUpModalProps) {
  const { createFollowUp, templates } = useFollowUps();
  const { leads } = useLeads();
  const { prospects } = useProspects();
  const { addToast } = useToast();

  const [targetType, setTargetType] = useState<FollowUpTargetType>(defaultTargetType);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    defaultTargetId || (defaultTargetType === "LEAD" ? leads[0]?.id || "" : prospects[0]?.id || "")
  );
  const [channel, setChannel] = useState<FollowUpChannel>("whatsapp");
  const [type, setType] = useState<FollowUpType>("NO_REPLY_NUDGE");
  const [priority, setPriority] = useState<FollowUpPriority>("HIGH");
  const [automationMode, setAutomationMode] = useState<AutomationMode>("AUTONOMOUS");
  const [delayPreset, setDelayPreset] = useState<"immediate" | "2h" | "tomorrow" | "3d">("2h");
  const [message, setMessage] = useState(
    "Hi {{lead.first_name}}! Just checking in regarding your recent inquiry. Would you still like us to assist you?"
  );
  const [subject, setSubject] = useState("Following up on our conversation");

  if (!isOpen) return null;

  // Selected object info
  const selectedLead = leads.find((l) => l.id === selectedTargetId);
  const selectedProspect = prospects.find((p) => p.id === selectedTargetId);

  const targetName =
    targetType === "LEAD"
      ? selectedLead?.name || "Client Lead"
      : selectedProspect?.businessName || "Prospect Business";

  const targetSubtext =
    targetType === "LEAD"
      ? selectedLead?.clientName || "Client Lead"
      : selectedProspect?.industry || "Prospect Business";

  const handleTemplateSelect = (templateId: string) => {
    const tmpl = templates.find((t) => t.id === templateId);
    if (!tmpl) return;
    setMessage(tmpl.body);
    if (tmpl.subject) setSubject(tmpl.subject);
    setChannel(tmpl.channel);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let delayHours = 2;
    if (delayPreset === "immediate") delayHours = 0;
    if (delayPreset === "tomorrow") delayHours = 24;
    if (delayPreset === "3d") delayHours = 72;

    const scheduledTime = new Date().toISOString();
    const dueTime = new Date(Date.now() + delayHours * 3600 * 1000).toISOString();

    const created = createFollowUp({
      targetType,
      targetId: selectedTargetId || `target_${Date.now()}`,
      targetName,
      targetSubtext,
      clientId: targetType === "LEAD" ? selectedLead?.clientId : undefined,
      clientName: targetType === "LEAD" ? selectedLead?.clientName : undefined,
      type,
      priority,
      channel,
      status: delayHours === 0 ? "DUE" : "SCHEDULED",
      automationMode,
      scheduledAt: scheduledTime,
      dueAt: dueTime,
      triggerReason: `Manual follow-up creation by operator (${priority} priority)`,
      message,
      subject: channel === "email" ? subject : undefined,
    });

    addToast({
      title: "Follow-Up Scheduled",
      description: `Follow-up created for ${targetName} via ${channel.toUpperCase()}.`,
      variant: "success",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <RiTimeLine className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">Schedule New Follow-Up</h2>
              <p className="text-xs text-[#64748B]">
                Configure manual or autonomous re-engagement for a Lead or Prospect.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Target Type Selector */}
          <div>
            <label className="text-xs font-semibold text-[#334155] block mb-1.5">
              Target Entity Scope
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTargetType("LEAD");
                  if (leads[0]) setSelectedTargetId(leads[0].id);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetType === "LEAD"
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#1E3A8A] ring-1 ring-[#2563EB]"
                    : "border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569]"
                }`}
              >
                <span className="block text-xs font-bold">Client Lead</span>
                <span className="text-[11px] opacity-80">
                  Potential customer of your onboarded client
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetType("PROSPECT");
                  if (prospects[0]) setSelectedTargetId(prospects[0].id);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  targetType === "PROSPECT"
                    ? "border-[#7C3AED] bg-[#FAF5FF] text-[#581C87] ring-1 ring-[#7C3AED]"
                    : "border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#475569]"
                }`}
              >
                <span className="block text-xs font-bold">Nexus Prospect</span>
                <span className="text-[11px] opacity-80">
                  Business you are acquiring as a client
                </span>
              </button>
            </div>
          </div>

          {/* 2. Select Specific Target */}
          <div>
            <label className="text-xs font-semibold text-[#334155] block mb-1.5">
              Select {targetType === "LEAD" ? "Client Lead" : "Prospect"}
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => setSelectedTargetId(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white focus:outline-hidden focus:border-[#2563EB]"
            >
              {targetType === "LEAD"
                ? leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.clientName} ({l.channel})
                    </option>
                  ))
                : prospects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.businessName} — {p.industry} ({p.status})
                    </option>
                  ))}
            </select>
          </div>

          {/* 3. Follow-up Type, Channel, Priority, Mode */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1">
                Category
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FollowUpType)}
                className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1] bg-white"
              >
                <option value="NO_REPLY_NUDGE">No-Reply Nudge</option>
                <option value="POST_BOOKING_REMINDER">Booking Reminder</option>
                <option value="DEMO_PREPARATION">AI Demo Follow-Up</option>
                <option value="QUOTE_EXCLUSIVITY_EXPIRATION">Quote Expiration</option>
                <option value="RE_ENGAGEMENT">Re-engagement</option>
                <option value="FEEDBACK_CHECKIN">Feedback Check-in</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1">
                Channel
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as FollowUpChannel)}
                className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1] bg-white capitalize"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="email">Email</option>
                <option value="website">Website</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as FollowUpPriority)}
                className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1] bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#334155] block mb-1">
                Execution
              </label>
              <select
                value={automationMode}
                onChange={(e) => setAutomationMode(e.target.value as AutomationMode)}
                className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1] bg-white"
              >
                <option value="AUTONOMOUS">Autonomous</option>
                <option value="MANUAL_APPROVAL">Manual Approval</option>
              </select>
            </div>
          </div>

          {/* 4. Timing presets */}
          <div>
            <label className="text-xs font-semibold text-[#334155] block mb-1.5">
              Schedule Timing
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "immediate", label: "Immediate (Due Now)" },
                { id: "2h", label: "+2 Hours" },
                { id: "tomorrow", label: "Tomorrow Morning" },
                { id: "3d", label: "+3 Days" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDelayPreset(p.id as any)}
                  className={`text-xs py-2 px-2.5 rounded-lg border transition-all text-center ${
                    delayPreset === p.id
                      ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold"
                      : "border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Message Content & Template Auto-Fill */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#334155]">
                Message Content
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[#64748B]">Insert Template:</span>
                <select
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  className="text-xs py-1 px-2 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] text-[#334155]"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Choose template...
                  </option>
                  {templates
                    .filter((t) => t.targetType === targetType)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {channel === "email" && (
              <div>
                <input
                  type="text"
                  placeholder="Subject line..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] mb-2 focus:outline-hidden focus:border-[#2563EB]"
                />
              </div>
            )}

            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB]"
              required
            />
          </div>

          {/* Live Mockup */}
          <div>
            <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
              Live Preview
            </span>
            <FollowUpChannelPreview
              channel={channel}
              message={message}
              subject={channel === "email" ? subject : undefined}
              targetName={targetName}
            />
          </div>

          {/* Submit / Cancel Footer */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              <RiAddLine className="h-4 w-4 mr-1" /> Schedule Follow-Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
