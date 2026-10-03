"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { RiCloseLine, RiFileTextLine, RiCheckLine } from "react-icons/ri";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadName: string;
  onAdd: (content: string) => void;
}

export function AddNoteModal({
  isOpen,
  onClose,
  leadName,
  onAdd,
}: AddNoteModalProps) {
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content.trim());
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
              <RiFileTextLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Add Internal Note</h3>
              <p className="text-xs text-[#64748B]">Lead: {leadName}</p>
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
          <Textarea
            label="Internal Note Content *"
            rows={4}
            placeholder="Log call takeaways, customer preferences, or special arrangements..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" leftIcon={<RiCheckLine className="h-4 w-4" />}>
              Save Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
