"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { RiCloseLine, RiFileTextLine } from "react-icons/ri";

interface AddNoteModalProps {
  prospectId: string;
  businessName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, tag?: string) => void;
}

export function AddNoteModal({
  businessName,
  isOpen,
  onClose,
  onSubmit,
}: AddNoteModalProps) {
  const [title, setTitle] = useState("Acquisition Opportunity");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("High Potential");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit(title.trim(), content.trim(), tag);
    setContent("");
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
              Add Internal Note: {businessName}
            </h3>
            <p className="text-xs text-[#64748B]">
              Record insights, research findings, or requirements.
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
          <TextInput
            label="Note Title *"
            placeholder="e.g. Website Friction Finding, Pitch Angle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Categorization Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            options={[
              { label: "High Potential", value: "High Potential" },
              { label: "Needs Demo", value: "Needs Demo" },
              { label: "Website Needed", value: "Website Needed" },
              { label: "Automation Opportunity", value: "Automation Opportunity" },
              { label: "AI Opportunity", value: "AI Opportunity" },
              { label: "Hot", value: "Hot" },
              { label: "Warm", value: "Warm" },
              { label: "Cold", value: "Cold" },
            ]}
          />

          <Textarea
            label="Note Content *"
            placeholder="Type confidential internal observation, meeting note, or customer requirement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
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
              leftIcon={<RiFileTextLine className="h-4 w-4" />}
            >
              Save Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
