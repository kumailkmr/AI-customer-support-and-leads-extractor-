"use client";

import React, { useState } from "react";
import { ActivityType, ProspectActivity } from "@/types/prospects";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { RiCloseLine, RiAddLine } from "react-icons/ri";

interface AddActivityModalProps {
  prospectId: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: {
    type: ActivityType;
    title: string;
    description: string;
    actor?: string;
    channel?: ProspectActivity["channel"];
    contactPerson?: string;
  }) => void;
}

export function AddActivityModal({
  businessName,
  isOpen,
  onClose,
  onSubmit,
}: AddActivityModalProps) {
  const [activityType, setActivityType] = useState<ActivityType>("call_made");
  const [description, setDescription] = useState("");
  const [channel, setChannel] =
    useState<ProspectActivity["channel"]>("Call");
  const [contactPerson, setContactPerson] = useState("");
  const [actor, setActor] = useState("Kumail (You)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const titleMap: Record<ActivityType, string> = {
      prospect_added: "Prospect Created",
      research_started: "Research Started",
      research_completed: "Research Completed",
      qualified: "Opportunity Qualified",
      demo_prepared: "Demo Prepared",
      email_sent: "Email Dispatched",
      whatsapp_sent: "WhatsApp Message Sent",
      instagram_sent: "Instagram DM Sent",
      call_made: "Phone Call Completed",
      reply_received: "Prospect Reply Logged",
      demo_scheduled: "Demo Scheduled",
      demo_completed: "Demo Completed",
      proposal_sent: "Proposal Sent",
      negotiation_started: "Negotiation Started",
      follow_up_scheduled: "Follow-Up Scheduled",
      status_changed: "Status Updated",
      note_added: "Internal Note Added",
      deal_updated: "Deal Value Updated",
    };

    onSubmit({
      type: activityType,
      title: titleMap[activityType] || "CRM Activity",
      description: description.trim(),
      actor: actor.trim(),
      channel,
      contactPerson: contactPerson.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Log Activity: {businessName}
            </h3>
            <p className="text-xs text-[#64748B]">
              Record a call, message, outreach attempt, meeting, or outcome.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A]"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-1">
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Activity Type"
              value={activityType}
              onChange={(e) => {
                const val = e.target.value as ActivityType;
                setActivityType(val);
                if (val === "email_sent") setChannel("Email");
                if (val === "whatsapp_sent") setChannel("WhatsApp");
                if (val === "call_made") setChannel("Call");
                if (val === "instagram_sent") setChannel("Instagram");
              }}
              options={[
                { label: "Phone Call Completed", value: "call_made" },
                { label: "WhatsApp Message Sent", value: "whatsapp_sent" },
                { label: "Email Sent", value: "email_sent" },
                { label: "Instagram Message Sent", value: "instagram_sent" },
                { label: "Reply Received", value: "reply_received" },
                { label: "Demo Completed", value: "demo_completed" },
                { label: "Demo Scheduled", value: "demo_scheduled" },
                { label: "Proposal Sent", value: "proposal_sent" },
                { label: "Negotiation Discussion", value: "negotiation_started" },
                { label: "Research Completed", value: "research_completed" },
                { label: "Opportunity Qualified", value: "qualified" },
              ]}
            />

            <Select
              label="Communication Channel"
              value={channel || "Call"}
              onChange={(e) =>
                setChannel(e.target.value as ProspectActivity["channel"])
              }
              options={[
                { label: "Phone Call", value: "Call" },
                { label: "WhatsApp", value: "WhatsApp" },
                { label: "Email", value: "Email" },
                { label: "Instagram", value: "Instagram" },
                { label: "Website", value: "Website" },
                { label: "Other", value: "Other" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="Contact Person (Optional)"
              placeholder="e.g. Dr. Verma, Tariq, Manager"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />

            <TextInput
              label="Actor / Team Member"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
            />
          </div>

          <Textarea
            label="Activity Summary / Outcome *"
            placeholder="Describe what occurred, objections raised, client reaction, or next steps agreed upon..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />

          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              leftIcon={<RiAddLine className="h-4 w-4" />}
            >
              Add Activity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
