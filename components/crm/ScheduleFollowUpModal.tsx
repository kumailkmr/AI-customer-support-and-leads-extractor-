"use client";

import React, { useState } from "react";
import { ProspectFollowUp } from "@/types/prospects";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { RiCloseLine, RiCalendarLine } from "react-icons/ri";

interface ScheduleFollowUpModalProps {
  prospectId: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (followUp: {
    date: string;
    time: string;
    channel: ProspectFollowUp["channel"];
    reminder: boolean;
    notes: string;
  }) => void;
}

export function ScheduleFollowUpModal({
  businessName,
  isOpen,
  onClose,
  onSubmit,
}: ScheduleFollowUpModalProps) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("11:00 AM");
  const [channel, setChannel] =
    useState<ProspectFollowUp["channel"]>("WhatsApp");
  const [reminder, setReminder] = useState(true);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    onSubmit({
      date,
      time,
      channel,
      reminder,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Schedule Follow-Up: {businessName}
            </h3>
            <p className="text-xs text-[#64748B]">
              Set date, time, and channel for next client outreach.
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
            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                Target Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0F172A] block mb-1">
                Time Slot
              </label>
              <input
                type="text"
                placeholder="11:00 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <Select
            label="Outreach Channel"
            value={channel}
            onChange={(e) =>
              setChannel(e.target.value as ProspectFollowUp["channel"])
            }
            options={[
              { label: "WhatsApp Direct", value: "WhatsApp" },
              { label: "Email Sequence", value: "Email" },
              { label: "Direct Phone Call", value: "Call" },
              { label: "Instagram Direct Message", value: "Instagram" },
              { label: "Facebook Message", value: "Facebook" },
              { label: "Other / In-Person", value: "Other" },
            ]}
          />

          <Textarea
            label="Follow-Up Agenda / Notes"
            placeholder="e.g. Inquire about proposal feedback, share demo recording, or discuss pricing discount..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          <div className="pt-1">
            <Checkbox
              checked={reminder}
              onChange={(e) => setReminder(e.target.checked)}
              label="Enable CRM notification reminder on day of follow-up"
            />
          </div>

          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              leftIcon={<RiCalendarLine className="h-4 w-4" />}
            >
              Set Follow-Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
