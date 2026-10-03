"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { RiCloseLine, RiCalendarEventLine, RiCheckLine } from "react-icons/ri";

interface ScheduleFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  onSchedule: (dateTime: string, note?: string) => void;
}

export function ScheduleFollowUpModal({
  isOpen,
  onClose,
  leadName,
  onSchedule,
}: ScheduleFollowUpModalProps) {
  const [selectedPreset, setSelectedPreset] = useState("Tomorrow, 10:30 AM");
  const [customNote, setCustomNote] = useState("");

  if (!isOpen) return null;

  const presets = [
    "Today, 4:30 PM",
    "Tomorrow, 10:30 AM",
    "Tomorrow, 3:00 PM",
    "In 2 days, 11:00 AM",
    "Next Monday, 10:00 AM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule(selectedPreset, customNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
              <RiCalendarEventLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Schedule Follow-Up</h3>
              <p className="text-xs text-[#64748B]">Customer: {leadName}</p>
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

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Select
            label="Schedule Timeframe"
            options={presets.map((p) => ({ label: p, value: p }))}
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
          />

          <TextInput
            label="Follow-Up Objective / Note"
            placeholder="e.g. Confirm campus tour time or send quotation link"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" leftIcon={<RiCheckLine className="h-4 w-4" />}>
              Save Follow-Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
