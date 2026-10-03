"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FilterPill } from "@/components/ui/FilterPill";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { MessageTemplate, FollowUpChannel, FollowUpTargetType } from "@/lib/follow-ups/types";
import { TemplateEditorModal } from "@/components/follow-ups/TemplateEditorModal";
import {
  RiBookletLine,
  RiAddLine,
  RiSettings4Line,
  RiEditLine,
  RiDeleteBinLine,
  RiWhatsappFill,
  RiInstagramLine,
  RiFacebookCircleFill,
  RiMailLine,
  RiGlobalLine,
  RiSparkling2Fill,
  RiFileCopyLine,
} from "react-icons/ri";

export default function MessageTemplatesPage() {
  const { templates, deleteTemplate, createTemplate } = useFollowUps();
  const { addToast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  const [activeTemplateForEdit, setActiveTemplateForEdit] = useState<MessageTemplate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const categories = [
    "all",
    "No-Reply Nudge",
    "Appointment & Reminders",
    "Demo & Proposal",
    "VIP & Objections",
    "Re-engagement",
  ];

  const filteredTemplates = templates.filter((t) => {
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (scopeFilter !== "all" && t.targetType !== scopeFilter) return false;
    if (channelFilter !== "all" && t.channel !== channelFilter) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setActiveTemplateForEdit(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (tmpl: MessageTemplate) => {
    setActiveTemplateForEdit(tmpl);
    setIsEditorOpen(true);
  };

  const handleClone = (tmpl: MessageTemplate) => {
    createTemplate({
      ...tmpl,
      id: undefined,
      name: `${tmpl.name} (Copy)`,
      isSystemDefault: false,
    });
    addToast({
      title: "Template Cloned",
      description: `Created copy of "${tmpl.name}".`,
      variant: "success",
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete template "${name}"?`)) {
      deleteTemplate(id);
      addToast({
        title: "Template Deleted",
        description: `Removed "${name}".`,
        variant: "info",
      });
    }
  };

  const getChannelIcon = (ch: FollowUpChannel) => {
    switch (ch) {
      case "whatsapp":
        return <RiWhatsappFill className="text-[#25D366]" />;
      case "instagram":
        return <RiInstagramLine className="text-[#E1306C]" />;
      case "facebook":
        return <RiFacebookCircleFill className="text-[#1877F2]" />;
      case "email":
        return <RiMailLine className="text-[#2563EB]" />;
      case "website":
        return <RiGlobalLine className="text-[#0D9488]" />;
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Message Template Library"
        subtitle="Manage parameterized follow-up copy with dynamic variable interpolation for WhatsApp, Instagram, Email, and Facebook."
        breadcrumbs={[
          { label: "Follow-Ups", href: "/follow-ups" },
          { label: "Templates" },
        ]}
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Template System Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/settings/automation">
              <Button variant="outline" size="sm" className="text-xs">
                <RiSettings4Line className="h-3.5 w-3.5 mr-1 text-[#64748B]" />
                Automation Rules
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs flex items-center gap-1 shadow-xs"
            >
              <RiAddLine className="h-4 w-4" /> New Template
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Category Filters */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center gap-2 flex-wrap border-b border-[#F1F5F9] pb-3">
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat === "all" ? "All Categories" : cat}
                count={
                  cat === "all"
                    ? templates.length
                    : templates.filter((t) => t.category === cat).length
                }
                isActive={categoryFilter === cat}
                onClick={() => setCategoryFilter(cat)}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B]">Scope:</span>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#334155]"
              >
                <option value="all">All Scopes</option>
                <option value="LEAD">Client Leads</option>
                <option value="PROSPECT">Nexus Prospects</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B]">Channel:</span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#334155] capitalize"
              >
                <option value="all">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="email">Email</option>
                <option value="website">Website</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((tmpl) => {
            const isLead = tmpl.targetType === "LEAD";
            return (
              <Card
                key={tmpl.id}
                padding="md"
                className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all bg-white shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{getChannelIcon(tmpl.channel)}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isLead
                            ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                            : "bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D5FF]"
                        }`}
                      >
                        {isLead ? "Client Lead" : "Prospect"}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#64748B] font-medium">
                      {tmpl.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0F172A] mb-1">
                    {tmpl.name}
                  </h3>

                  {tmpl.subject && (
                    <div className="text-[11px] font-semibold text-[#475569] mb-1.5 line-clamp-1">
                      Subject: {tmpl.subject}
                    </div>
                  )}

                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] text-xs text-[#334155] leading-relaxed font-mono whitespace-pre-wrap line-clamp-4 mb-3">
                    {tmpl.body}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {tmpl.variables.map((v) => (
                      <span
                        key={v}
                        className="text-[10px] font-mono bg-[#F1F5F9] text-[#475569] px-1.5 py-0.2 rounded border border-[#E2E8F0]"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <span className="text-[10px] text-[#94A3B8]">
                    {tmpl.isSystemDefault ? "System Default" : "Custom Template"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleClone(tmpl)}
                      className="p-1.5 text-[#64748B] hover:text-[#2563EB] rounded-lg transition-colors"
                      title="Clone template"
                    >
                      <RiFileCopyLine className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(tmpl)}
                      className="p-1.5 text-[#64748B] hover:text-[#2563EB] rounded-lg transition-colors"
                      title="Edit template"
                    >
                      <RiEditLine className="h-4 w-4" />
                    </button>
                    {!tmpl.isSystemDefault && (
                      <button
                        onClick={() => handleDelete(tmpl.id, tmpl.name)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg transition-colors"
                        title="Delete template"
                      >
                        <RiDeleteBinLine className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <TemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        templateToEdit={activeTemplateForEdit}
      />
    </AppLayout>
  );
}
