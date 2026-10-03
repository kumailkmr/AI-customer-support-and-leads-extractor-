"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useProspects } from "@/lib/store/prospects-store";
import { useToast } from "@/components/ui/Toast";
import { formatCrmCurrency } from "@/lib/crm/crm-service";
import { PIPELINE_STAGES, getStageConfig } from "@/lib/crm/pipeline-config";
import {
  BusinessProspect,
  ProspectPipelineStatus,
  ActivityType,
  ProspectActivity,
  ProspectFollowUp,
} from "@/types/prospects";

import { EditProspectModal } from "@/components/crm/EditProspectModal";
import { AddActivityModal } from "@/components/crm/AddActivityModal";
import { AddNoteModal } from "@/components/crm/AddNoteModal";
import { ScheduleFollowUpModal } from "@/components/crm/ScheduleFollowUpModal";

import {
  RiArrowLeftLine,
  RiGlobalLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiGoogleLine,
  RiSparkling2Fill,
  RiTimeLine,
  RiChatSmile3Line,
  RiFilterLine,
  RiAlertLine,
  RiCheckLine,
  RiFileCopyLine,
  RiCalendarLine,
  RiAddLine,
  RiRecordCircleLine,
  RiFileTextLine,
  RiEditLine,
  RiPriceTag3Line,
  RiDeleteBinLine,
  RiUserVoiceLine,
} from "react-icons/ri";

type DetailTab =
  | "overview"
  | "pipeline"
  | "activities"
  | "notes"
  | "research"
  | "opportunity"
  | "presence"
  | "followups";

export default function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const {
    getProspectById,
    updateProspect,
    updateProspectStatus,
    addActivity,
    addProspectNote,
    deleteProspectNote,
    scheduleFollowUp,
    isLoaded,
  } = useProspects();

  const { showToast } = useToast();

  const business = getProspectById(resolvedParams.id);

  // Active tab state
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Inline note form state
  const [quickNoteTitle, setQuickNoteTitle] = useState("");
  const [quickNoteContent, setQuickNoteContent] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!business && isLoaded) {
    return (
      <AppLayout>
        <div className="py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-[#0F172A]">
            Prospect Not Found
          </h2>
          <p className="text-sm text-[#64748B]">
            Could not locate prospect with identifier &quot;{resolvedParams.id}&quot;.
          </p>
          <Link href="/prospects">
            <Button size="sm" variant="primary">
              Return to Prospects
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (!business) {
    return (
      <AppLayout>
        <div className="py-12 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Copied ${field} to clipboard.`, "info");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStageClick = (stage: ProspectPipelineStatus) => {
    updateProspectStatus(business.id, stage);
    showToast(`Pipeline transitioned to ${stage}.`, "success");
  };

  const handleSaveEdit = (id: string, updates: Partial<BusinessProspect>) => {
    updateProspect(id, updates);
    showToast("Prospect dossier updated.", "success");
  };

  const handleAddActivitySubmit = (actData: {
    type: ActivityType;
    title: string;
    description: string;
    actor?: string;
    channel?: ProspectActivity["channel"];
    contactPerson?: string;
  }) => {
    addActivity(business.id, actData);
    showToast(`Recorded activity: "${actData.title}".`, "success");
  };

  const handleAddNoteSubmit = (title: string, content: string, tag?: string) => {
    addProspectNote(
      business.id,
      content,
      "Kumail (You)",
      "Acquisition Lead",
      title,
      tag
    );
    showToast("Note recorded in dossier.", "success");
  };

  const handleDeleteNoteSubmit = (noteId: string) => {
    deleteProspectNote(business.id, noteId);
    showToast("Note deleted.", "info");
  };

  const handleScheduleFollowUpSubmit = (fUp: {
    date: string;
    time: string;
    channel: ProspectFollowUp["channel"];
    reminder: boolean;
    notes: string;
  }) => {
    scheduleFollowUp(business.id, fUp);
    showToast(`Follow-up scheduled for ${fUp.date}.`, "success");
  };

  const currentStageConfig = getStageConfig(business.status);

  const tabs: Array<{ id: DetailTab; label: string; count?: number }> = [
    { id: "overview", label: "Overview" },
    { id: "pipeline", label: "Pipeline Stepper" },
    { id: "activities", label: "Activity Timeline", count: business.activityHistory.length },
    { id: "notes", label: "Internal Notes", count: business.notes.length },
    { id: "followups", label: "Follow-Ups & Outreach" },
    { id: "opportunity", label: "NEXUS Opportunity" },
    { id: "research", label: "Research Audit" },
    { id: "presence", label: "Digital Presence" },
  ];

  return (
    <AppLayout>
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/prospects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Prospects CRM
        </Link>
        <span className="text-xs text-[#94A3B8]">
          Last Activity: {business.lastActivity}
        </span>
      </div>

      {/* Main Dossier Header */}
      <PageHeader
        title={business.businessName}
        subtitle={`${business.industry} · ${business.location}`}
        badge={
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                business.opportunityLevel === "High"
                  ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                  : business.opportunityLevel === "Medium"
                  ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                  : "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]"
              }`}
            >
              {business.opportunityLevel} Opportunity
            </span>

            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: currentStageConfig.bgColor,
                color: currentStageConfig.textColor,
                borderColor: currentStageConfig.borderColor,
              }}
            >
              {currentStageConfig.label}
            </span>

            <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
              Deal: {formatCrmCurrency(business.estimatedDealValue || 0)}
              {business.monthlyValue
                ? ` (+${formatCrmCurrency(business.monthlyValue)}/mo)`
                : ""}
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RiCalendarLine className="h-3.5 w-3.5" />}
              onClick={() => setIsFollowUpModalOpen(true)}
            >
              Schedule Follow-Up
            </Button>

            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RiFileTextLine className="h-3.5 w-3.5" />}
              onClick={() => setIsNoteModalOpen(true)}
            >
              Add Note
            </Button>

            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RiUserVoiceLine className="h-3.5 w-3.5" />}
              onClick={() => setIsActivityModalOpen(true)}
            >
              Log Activity
            </Button>

            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiEditLine className="h-3.5 w-3.5" />}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Prospect
            </Button>
          </div>
        }
      />

      {/* Tab Navigation Strip */}
      <div className="border-b border-[#E2E8F0] mb-6 overflow-x-auto">
        <nav className="flex items-center gap-1 min-w-[700px]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === tab.id
                      ? "bg-[#EFF6FF] text-[#2563EB]"
                      : "bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Panels */}
      <div className="space-y-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Pitch Angle Highlight */}
              <div className="p-4 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-2">
                <span className="text-xs font-bold text-[#7C3AED] flex items-center gap-1.5 uppercase tracking-wider">
                  <RiSparkling2Fill className="h-4 w-4" />
                  Strategic Acquisition Angle
                </span>
                <p className="text-xs text-[#5B21B6] font-medium leading-relaxed">
                  {business.suggestedAngle}
                </p>
              </div>

              {/* Core Commercials & Assignment */}
              <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#F1F5F9] pb-2">
                  Commercials & Acquisition Details
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block font-semibold uppercase">
                      One-Time Deal Value
                    </span>
                    <span className="text-base font-extrabold text-[#0F172A] mt-0.5 block">
                      {formatCrmCurrency(business.estimatedDealValue || 0)}
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block font-semibold uppercase">
                      Monthly Retainer
                    </span>
                    <span className="text-base font-extrabold text-[#059669] mt-0.5 block">
                      {formatCrmCurrency(business.monthlyValue || 0)}/mo
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block font-semibold uppercase">
                      Acquisition Source
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] mt-1 block">
                      {business.acquisitionSource || "Manual"}
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block font-semibold uppercase">
                      Lead Assigned To
                    </span>
                    <span className="text-xs font-bold text-[#2563EB] mt-1 block">
                      {business.assignedTo || "Kumail (You)"}
                    </span>
                  </div>
                </div>

                {/* Service Interests */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    Potential Service Interests:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {business.serviceInterest.map((svc) => (
                      <span
                        key={svc}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-medium"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#64748B] block">
                    Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {business.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#334155] font-medium flex items-center gap-1"
                      >
                        <RiPriceTag3Line className="h-3 w-3 text-[#64748B]" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recent Activity Highlight */}
              <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Recent Timeline Events
                  </h4>
                  <button
                    type="button"
                    onClick={() => setActiveTab("activities")}
                    className="text-xs text-[#2563EB] hover:underline font-semibold"
                  >
                    View All ({business.activityHistory.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {business.activityHistory.slice(0, 3).map((act) => (
                    <div
                      key={act.id}
                      className="p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl flex items-start justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#0F172A] block">
                          {act.title}
                        </span>
                        <p className="text-[#64748B] leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                      <span className="text-[10px] text-[#94A3B8] whitespace-nowrap ml-2">
                        {act.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column: Contact Dossier & Follow-Up Card */}
            <div className="space-y-6">
              {/* Follow-Up Card */}
              <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <RiCalendarLine className="h-4 w-4 text-[#2563EB]" />
                    Scheduled Follow-Up
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsFollowUpModalOpen(true)}
                    className="text-xs text-[#2563EB] hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>

                {business.followUp ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded font-bold text-[10px] border ${
                          business.followUp.status === "today"
                            ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                            : business.followUp.status === "overdue"
                            ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                            : "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                        }`}
                      >
                        {business.followUp.status === "today"
                          ? "Due Today"
                          : business.followUp.status === "overdue"
                          ? "Overdue"
                          : "Upcoming"}
                      </span>
                      <span className="font-semibold text-[#0F172A]">
                        {business.followUp.date} at {business.followUp.time}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                      <span className="text-[10px] text-[#64748B] block font-semibold uppercase">
                        Channel: {business.followUp.channel}
                      </span>
                      <p className="text-[#334155] mt-1 leading-relaxed">
                        {business.followUp.notes || "No notes entered."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-[#94A3B8] space-y-2">
                    <p>No follow-up scheduled currently.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsFollowUpModalOpen(true)}
                    >
                      Schedule Follow-Up
                    </Button>
                  </div>
                )}
              </Card>

              {/* Direct Contacts Card with Copy Buttons */}
              <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#F1F5F9] pb-2">
                  Direct Contact Dossier
                </h4>

                <div className="space-y-2.5 text-xs divide-y divide-[#F1F5F9]">
                  {business.phone && (
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Phone / Mobile</span>
                        <span className="font-medium text-[#0F172A]">{business.phone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(business.phone!, "phone")}
                        className="text-[#2563EB] hover:text-[#1D4ED8] p-1 text-xs"
                      >
                        {copiedField === "phone" ? (
                          <RiCheckLine className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <RiFileCopyLine className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {business.email && (
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Email</span>
                        <span className="font-medium text-[#0F172A] truncate max-w-[170px] block">
                          {business.email}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(business.email!, "email")}
                        className="text-[#2563EB] hover:text-[#1D4ED8] p-1 text-xs"
                      >
                        {copiedField === "email" ? (
                          <RiCheckLine className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <RiFileCopyLine className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}

                  {business.address && (
                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block">Address</span>
                        <span className="text-[#475569] leading-snug block">
                          {business.address}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(business.address!, "address")}
                        className="text-[#2563EB] hover:text-[#1D4ED8] p-1 text-xs flex-shrink-0"
                      >
                        {copiedField === "address" ? (
                          <RiCheckLine className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <RiFileCopyLine className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Contact Attempts Counter Widget */}
              <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Contact Attempts ({business.contactAttempts.total})
                  </h4>
                  <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                    Status: {business.contactAttempts.responseStatus}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block">Email</span>
                    <span className="font-extrabold text-[#0F172A] mt-0.5 block">
                      {business.contactAttempts.email}
                    </span>
                  </div>
                  <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block">WhatsApp</span>
                    <span className="font-extrabold text-[#0F172A] mt-0.5 block">
                      {business.contactAttempts.whatsapp}
                    </span>
                  </div>
                  <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block">Call</span>
                    <span className="font-extrabold text-[#0F172A] mt-0.5 block">
                      {business.contactAttempts.call}
                    </span>
                  </div>
                  <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                    <span className="text-[10px] text-[#64748B] block">IG DM</span>
                    <span className="font-extrabold text-[#0F172A] mt-0.5 block">
                      {business.contactAttempts.instagram}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-[#64748B] flex items-center justify-between">
                  <span>Last Contacted:</span>
                  <strong className="text-[#0F172A]">
                    {business.contactAttempts.lastContactedAt
                      ? new Date(business.contactAttempts.lastContactedAt).toLocaleDateString()
                      : "Not contacted yet"}
                  </strong>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: PIPELINE STEPPER */}
        {activeTab === "pipeline" && (
          <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">
                Acquisition Pipeline Progression
              </h4>
              <p className="text-xs text-[#64748B]">
                Click any stage to transition {business.businessName}&apos;s position in the sales cycle.
              </p>
            </div>

            <div className="overflow-x-auto pb-4">
              <div className="flex items-center min-w-[900px] gap-2 pt-2">
                {PIPELINE_STAGES.map((stage, idx) => {
                  const currentIdx = PIPELINE_STAGES.findIndex(
                    (s) => s.id === business.status
                  );
                  const isCurrent = stage.id === business.status;
                  const isPast = idx < currentIdx;

                  return (
                    <div key={stage.id} className="flex-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => handleStageClick(stage.id)}
                        className={`flex-1 py-3 px-2 text-center rounded-xl border transition-all ${
                          isCurrent
                            ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md font-bold text-xs"
                            : isPast
                            ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] font-medium text-xs hover:bg-[#DCFCE7]"
                            : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-xs hover:bg-white hover:text-[#0F172A]"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {isPast && <RiCheckLine className="h-4 w-4 text-[#166534]" />}
                          {isCurrent && (
                            <RiRecordCircleLine className="h-4 w-4 text-white animate-pulse" />
                          )}
                          <span>{stage.label}</span>
                        </div>
                      </button>
                      {idx < PIPELINE_STAGES.length - 1 && (
                        <div
                          className={`h-0.5 w-2 flex-shrink-0 mx-1 ${
                            isPast ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#0F172A] block">
                Current Stage Details: {currentStageConfig.label}
              </span>
              <p className="text-[#64748B]">{currentStageConfig.description}</p>
            </div>
          </Card>
        )}

        {/* TAB 3: ACTIVITIES */}
        {activeTab === "activities" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  Complete CRM Activity Timeline
                </h4>
                <p className="text-xs text-[#64748B]">
                  Every call, message, email, meeting, and milestone recorded for {business.businessName}.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<RiAddLine className="h-4 w-4" />}
                onClick={() => setIsActivityModalOpen(true)}
              >
                Log New Activity
              </Button>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
              {business.activityHistory.map((act) => (
                <div key={act.id} className="relative group">
                  <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center shadow-xs">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                  </div>
                  <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-xl shadow-xs space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{act.title}</span>
                        {act.channel && (
                          <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.2 rounded border border-[#BFDBFE]">
                            {act.channel}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#94A3B8]">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {act.description}
                    </p>
                    <div className="text-[10px] text-[#94A3B8] pt-1">
                      Logged by {act.actor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: NOTES */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  Confidential Internal Notes
                </h4>
                <p className="text-xs text-[#64748B]">
                  Team observations, objections, and negotiation strategies.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<RiAddLine className="h-4 w-4" />}
                onClick={() => setIsNoteModalOpen(true)}
              >
                Add Note
              </Button>
            </div>

            {/* Quick Inline Note Creator */}
            <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-3 bg-[#F8FAFC]">
              <span className="text-xs font-bold text-[#0F172A] block">
                Quick Note Entry
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Note Title (e.g. Call Objections, Pricing Requirement)..."
                  value={quickNoteTitle}
                  onChange={(e) => setQuickNoteTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
                <textarea
                  placeholder="Type internal note..."
                  value={quickNoteContent}
                  onChange={(e) => setQuickNoteContent(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 bg-white border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={!quickNoteContent.trim()}
                  onClick={() => {
                    handleAddNoteSubmit(
                      quickNoteTitle || "Internal Note",
                      quickNoteContent
                    );
                    setQuickNoteTitle("");
                    setQuickNoteContent("");
                  }}
                >
                  Save Quick Note
                </Button>
              </div>
            </Card>

            {/* Notes List */}
            <div className="space-y-3">
              {business.notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-white border border-[#E2E8F0] rounded-xl shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-xs text-[#0F172A]">
                        {note.title || "Note"}
                      </h5>
                      {note.tag && (
                        <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                          {note.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#94A3B8]">{note.timestamp}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteNoteSubmit(note.id)}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#EF4444]"
                        title="Delete note"
                      >
                        <RiDeleteBinLine className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
                    {note.content}
                  </p>
                  <div className="text-[10px] text-[#94A3B8]">
                    Author: {note.author} ({note.authorRole})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FOLLOW-UPS & OUTREACH */}
        {activeTab === "followups" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Upcoming Outreach Task
                </h4>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsFollowUpModalOpen(true)}
                >
                  Set New Date
                </Button>
              </div>

              {business.followUp ? (
                <div className="p-4 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E40AF]">
                      Target Date: {business.followUp.date} at {business.followUp.time}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        business.followUp.status === "today"
                          ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                          : business.followUp.status === "overdue"
                          ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                          : "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                      }`}
                    >
                      {business.followUp.status === "today"
                        ? "Due Today"
                        : business.followUp.status === "overdue"
                        ? "Overdue"
                        : "Upcoming"}
                    </span>
                  </div>
                  <p className="text-xs text-[#3B82F6] leading-relaxed">
                    Channel: <strong>{business.followUp.channel}</strong>
                  </p>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.followUp.notes}
                  </p>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#94A3B8]">
                  No upcoming follow-up scheduled.
                </div>
              )}
            </Card>

            <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#F1F5F9] pb-2">
                Contact Attempts Breakdown
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Email Dispatches</span>
                  <span className="text-lg font-bold text-[#0F172A]">
                    {business.contactAttempts.email}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">WhatsApp Messages</span>
                  <span className="text-lg font-bold text-[#0F172A]">
                    {business.contactAttempts.whatsapp}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Phone Calls Made</span>
                  <span className="text-lg font-bold text-[#0F172A]">
                    {business.contactAttempts.call}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] block">Instagram DMs</span>
                  <span className="text-lg font-bold text-[#0F172A]">
                    {business.contactAttempts.instagram}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Prospect Response Status:</span>
                  <span className="font-bold text-[#0F172A]">
                    {business.contactAttempts.responseStatus}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 6: OPPORTUNITY */}
        {activeTab === "opportunity" && (
          <div className="space-y-6">
            <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
                NEXUS Product Opportunity Alignment
              </h4>

              <div className="space-y-3">
                {Object.entries(business.opportunitySignals).map(([key, item]) => (
                  <div
                    key={key}
                    className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex items-start justify-between gap-3 hover:border-[#CBD5E1] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A]">
                          {item.label}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            item.impactPotential === "High"
                              ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                              : item.impactPotential === "Medium"
                              ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                              : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]"
                          }`}
                        >
                          {item.impactPotential} Impact
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <span
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1.5 ${
                        item.enabled ? "bg-[#10B981]" : "bg-[#CBD5E1]"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 7: RESEARCH */}
        {activeTab === "research" && (
          <div className="space-y-6">
            <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
                Audited Digital Gaps & Observations
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <RiTimeLine className="h-4 w-4 text-[#2563EB]" />
                    Contact & Inquiry Flow
                  </span>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.contactFlow}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <RiChatSmile3Line className="h-4 w-4 text-[#8B5CF6]" />
                    FAQ & Knowledge Access
                  </span>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.faqAccess}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <RiFilterLine className="h-4 w-4 text-[#10B981]" />
                    Lead Capture Mechanisms
                  </span>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.leadCapture}
                  </p>
                </div>

                <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                    <RiAlertLine className="h-4 w-4 text-[#F59E0B]" />
                    Follow-Up & Retention
                  </span>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.followUp}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TAB 8: DIGITAL PRESENCE */}
        {activeTab === "presence" && (
          <div className="space-y-6">
            <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
                Digital Presence & Channel Verification
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Website */}
                <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RiGlobalLine className="h-5 w-5 text-[#2563EB]" />
                    <div>
                      <span className="font-bold text-[#0F172A] block">Official Website</span>
                      <span className="text-[#64748B] text-[11px]">
                        {business.website || "No website"}
                      </span>
                    </div>
                  </div>
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline font-semibold text-xs"
                    >
                      Visit
                    </a>
                  )}
                </div>

                {/* Instagram */}
                <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RiInstagramLine className="h-5 w-5 text-[#E1306C]" />
                    <div>
                      <span className="font-bold text-[#0F172A] block">Instagram</span>
                      <span className="text-[#64748B] text-[11px]">
                        {business.socialPresence.instagram?.handle || "None"}
                      </span>
                    </div>
                  </div>
                  {business.socialPresence.instagram?.followers && (
                    <span className="text-[10px] font-bold text-[#9D174D] bg-[#FDF2F8] px-2 py-0.5 rounded border border-[#FBCFE8]">
                      {business.socialPresence.instagram.followers} Followers
                    </span>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RiWhatsappLine className="h-5 w-5 text-[#10B981]" />
                    <div>
                      <span className="font-bold text-[#0F172A] block">WhatsApp Business</span>
                      <span className="text-[#64748B] text-[11px]">
                        {business.socialPresence.whatsapp?.number || "None"}
                      </span>
                    </div>
                  </div>
                  {business.socialPresence.whatsapp?.businessVerified && (
                    <span className="text-[10px] font-bold text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">
                      Verified Business
                    </span>
                  )}
                </div>

                {/* Google Business */}
                <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <RiGoogleLine className="h-5 w-5 text-[#EA4335]" />
                    <div>
                      <span className="font-bold text-[#0F172A] block">Google Business Profile</span>
                      <span className="text-[#64748B] text-[11px]">
                        ★ {business.socialPresence.googleBusiness?.rating || "N/A"} (
                        {business.socialPresence.googleBusiness?.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                  {business.socialPresence.googleBusiness?.claimed && (
                    <span className="text-[10px] font-bold text-[#1E40AF] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      Claimed Profile
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Prospect Modal */}
      <EditProspectModal
        prospect={business}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSaveEdit}
      />

      {/* Add Activity Modal */}
      <AddActivityModal
        prospectId={business.id}
        businessName={business.businessName}
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={handleAddActivitySubmit}
      />

      {/* Add Note Modal */}
      <AddNoteModal
        prospectId={business.id}
        businessName={business.businessName}
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSubmit={handleAddNoteSubmit}
      />

      {/* Schedule Follow-Up Modal */}
      <ScheduleFollowUpModal
        prospectId={business.id}
        businessName={business.businessName}
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSubmit={handleScheduleFollowUpSubmit}
      />
    </AppLayout>
  );
}
