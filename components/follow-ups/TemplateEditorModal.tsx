"use client";

import React, { useState, useEffect } from "react";
import { MessageTemplate, FollowUpTargetType, FollowUpChannel } from "@/lib/follow-ups/types";
import { AVAILABLE_VARIABLES, extractTemplateVariables, resolveTemplateVariables } from "@/lib/follow-ups/variable-resolver";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { FollowUpChannelPreview } from "./FollowUpChannelPreview";
import { RiCloseLine, RiAddLine, RiCheckLine, RiCodeSSlashLine } from "react-icons/ri";

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateToEdit?: MessageTemplate | null;
}

export function TemplateEditorModal({
  isOpen,
  onClose,
  templateToEdit,
}: TemplateEditorModalProps) {
  const { createTemplate, updateTemplate } = useFollowUps();
  const { addToast } = useToast();

  const [name, setName] = useState("");
  const [targetType, setTargetType] = useState<FollowUpTargetType>("LEAD");
  const [category, setCategory] = useState<MessageTemplate["category"]>("No-Reply Nudge");
  const [channel, setChannel] = useState<FollowUpChannel>("whatsapp");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (templateToEdit) {
      setName(templateToEdit.name);
      setTargetType(templateToEdit.targetType);
      setCategory(templateToEdit.category);
      setChannel(templateToEdit.channel);
      setSubject(templateToEdit.subject || "");
      setBody(templateToEdit.body);
    } else {
      setName("");
      setTargetType("LEAD");
      setCategory("No-Reply Nudge");
      setChannel("whatsapp");
      setSubject("");
      setBody("Hi {{lead.first_name}}! Checking in from {{client.name}} regarding your inquiry.");
    }
  }, [templateToEdit, isOpen]);

  if (!isOpen) return null;

  const insertVariable = (varKey: string) => {
    setBody((prev) => `${prev} {{${varKey}}}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const vars = extractTemplateVariables(body);

    if (templateToEdit) {
      updateTemplate(templateToEdit.id, {
        name,
        targetType,
        category,
        channel,
        subject: channel === "email" ? subject : undefined,
        body,
        variables: vars,
      });
      addToast({
        title: "Template Saved",
        description: `Updated template "${name}".`,
        variant: "success",
      });
    } else {
      createTemplate({
        name,
        targetType,
        category,
        channel,
        subject: channel === "email" ? subject : undefined,
        body,
        variables: vars,
      });
      addToast({
        title: "Template Created",
        description: `Created new template "${name}".`,
        variant: "success",
      });
    }

    onClose();
  };

  // Live preview rendered mock
  const previewRendered = resolveTemplateVariables(
    body,
    {
      lead: { first_name: "Sarah", name: "Sarah Johnson" },
      client: { name: "Alpine Grand Hotel" },
      prospect: { contact: "Tariq Ahmad", name: "Srinagar Heritage Crafts", industry: "Artisans" },
      agent: { name: "Kumail" },
      appointment: { date: "Friday", time: "3:30 PM" },
      offer: { expiration_date: "5:00 PM today" },
      demo: { link: "https://nexus-ai.local/demo" },
    },
    targetType
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">
              {templateToEdit ? "Edit Message Template" : "Create New Message Template"}
            </h2>
            <p className="text-xs text-[#64748B]">
              Standardized messaging with safe deterministic variable injection.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Template Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VIP Urgent Room Lock Nudge"
                className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Target Entity Scope
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as FollowUpTargetType)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
              >
                <option value="LEAD">Client Lead (Your client's customer)</option>
                <option value="PROSPECT">Nexus Prospect (Business you acquire)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] bg-white"
              >
                <option value="No-Reply Nudge">No-Reply Nudge</option>
                <option value="Appointment & Reminders">Appointment & Reminders</option>
                <option value="Demo & Proposal">Demo & Proposal</option>
                <option value="VIP & Objections">VIP & Objections</option>
                <option value="Re-engagement">Re-engagement</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Channel
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
          </div>

          {channel === "email" && (
            <div>
              <label className="text-xs font-semibold text-[#334155] block mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Next steps for {{prospect.name}}"
                className="w-full text-xs p-2.5 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB]"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#334155]">
                Template Body
              </label>
              <span className="text-[11px] text-[#64748B] flex items-center gap-1">
                <RiCodeSSlashLine /> Click variable below to insert
              </span>
            </div>
            <textarea
              rows={4}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB] font-mono leading-relaxed"
            />

            {/* Variable Chips */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {AVAILABLE_VARIABLES.filter(
                (v) => v.targetScope === targetType || v.targetScope === "BOTH"
              ).map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => insertVariable(v.key)}
                  className="text-[11px] font-mono bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] px-2 py-0.5 rounded-md border border-[#CBD5E1] transition-colors"
                >
                  +{`{{${v.key}}}`}
                </button>
              ))}
            </div>
          </div>

          {/* Real Live Preview */}
          <div>
            <span className="text-[11px] font-semibold text-[#64748B] block mb-1">
              Interpolated Live Preview
            </span>
            <FollowUpChannelPreview
              channel={channel}
              message={previewRendered}
              subject={subject}
              targetName={targetType === "LEAD" ? "Sarah Johnson" : "Srinagar Heritage Crafts"}
              clientName={targetType === "LEAD" ? "Alpine Grand Hotel" : "NEXUS AI"}
            />
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
            >
              <RiCheckLine className="h-4 w-4 mr-1" />
              {templateToEdit ? "Save Changes" : "Create Template"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
