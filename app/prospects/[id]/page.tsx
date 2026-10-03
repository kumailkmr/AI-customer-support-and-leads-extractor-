"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { StatusBadge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { useProspects } from "@/lib/store/prospects-store";
import { ProspectPipelineStatus } from "@/types/prospects";
import {
  RiArrowLeftLine,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
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
  RiCloseLine,
  RiShieldCheckLine,
  RiRecordCircleLine,
  RiFileTextLine,
  RiExternalLinkLine,
} from "react-icons/ri";

const PIPELINE_STAGES: ProspectPipelineStatus[] = [
  "Found",
  "Researching",
  "Qualified",
  "Demo Ready",
  "Contacted",
  "Replied",
  "Demo",
  "Proposal",
  "Negotiation",
  "Won",
];

export default function ProspectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getProspectById, updateProspectStatus, addProspectNote, isLoaded } =
    useProspects();

  const business = getProspectById(resolvedParams.id);

  // Local interactive states
  const [newNote, setNewNote] = useState("");
  const [noteAuthor, setNoteAuthor] = useState("Growth Specialist");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Fallback while loading
  if (!business) {
    return (
      <AppLayout>
        <div className="py-12 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast(`Copied ${field} to clipboard.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStageClick = (stage: ProspectPipelineStatus) => {
    updateProspectStatus(business.id, stage);
    showToast(`Pipeline stage transitioned to "${stage}".`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addProspectNote(business.id, newNote, noteAuthor, "Acquisition Specialist");
    setNewNote("");
    showToast("Observation note recorded into prospect dossier.");
  };

  const currentStageIndex = PIPELINE_STAGES.indexOf(
    business.status === "Research Complete" || business.status === "Needs Review"
      ? "Researching"
      : business.status === "Lost" || business.status === "Rejected"
      ? "Found"
      : business.status
  );

  return (
    <AppLayout>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#334155] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="p-1 rounded-full bg-[#10B981] text-white">
            <RiCheckLine className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#94A3B8] hover:text-white p-1"
          >
            <RiCloseLine className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb & Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/prospects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Active Prospects
        </Link>
        <span className="text-xs text-[#94A3B8]">
          Last Activity: {business.lastActivity}
        </span>
      </div>

      {/* Main Prospect Header */}
      <PageHeader
        title={business.businessName}
        subtitle={`${business.category} · ${business.location}`}
        badge={
          <div className="flex items-center gap-2">
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
            <StatusBadge
              status={
                business.status === "Demo Ready"
                  ? "Demo"
                  : business.status === "Qualified" ||
                    business.status === "Research Complete"
                  ? "Qualified"
                  : business.status === "Researching"
                  ? "Interested"
                  : business.status === "Contacted"
                  ? "Contacted"
                  : "New"
              }
              size="sm"
            >
              {business.status}
            </StatusBadge>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RiCalendarLine className="h-4 w-4 text-[#2563EB]" />}
              onClick={() => setIsDemoModalOpen(true)}
            >
              Create Demo
            </Button>
            <AIActionButton
              label="Analyze Business"
              size="sm"
              variant="solid"
              onClick={() => setIsAnalyzeModalOpen(true)}
            />
          </div>
        }
      />

      {/* Quick Actions Bar */}
      <div className="mb-6 p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />}
            onClick={() => setIsAnalyzeModalOpen(true)}
          >
            AI Audit
          </Button>
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RiGlobalLine className="h-3.5 w-3.5 text-[#2563EB]" />}
              rightIcon={<RiExternalLinkLine className="h-3 w-3 text-[#94A3B8]" />}
            >
              Visit Website
            </Button>
          </a>
          {business.socialPresence.whatsapp && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RiWhatsappLine className="h-3.5 w-3.5 text-[#10B981]" />}
              onClick={() =>
                copyToClipboard(
                  business.socialPresence.whatsapp!.number,
                  "WhatsApp"
                )
              }
            >
              WhatsApp
            </Button>
          )}
          {business.socialPresence.instagram && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<RiInstagramLine className="h-3.5 w-3.5 text-[#E1306C]" />}
              onClick={() =>
                copyToClipboard(
                  business.socialPresence.instagram!.handle,
                  "Instagram"
                )
              }
            >
              Instagram
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#64748B]">
            NEXUS Potential Score:
          </span>
          <span className="text-sm font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-lg border border-[#BFDBFE]">
            {business.nexusFitScore} / 100
          </span>
        </div>
      </div>

      {/* Interactive Acquisition Pipeline Stepper */}
      <Card padding="md" className="border-[#E2E8F0] mb-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Client Acquisition Pipeline Stage
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              Click any stage below to transition this prospect through the client acquisition lifecycle.
            </p>
          </div>
          <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#BFDBFE]">
            Current: {business.status}
          </span>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-[700px]">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage} className="flex-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => handleStageClick(stage)}
                    className={`flex-1 py-2 px-1 text-center rounded-lg border transition-all ${
                      isCurrent
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs font-bold text-xs"
                        : isPast
                        ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] font-medium text-xs hover:bg-[#DCFCE7]"
                        : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-xs hover:bg-white hover:text-[#0F172A]"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isPast && <RiCheckLine className="h-3.5 w-3.5 text-[#166534]" />}
                      {isCurrent && (
                        <RiRecordCircleLine className="h-3.5 w-3.5 text-white animate-pulse" />
                      )}
                      <span>{stage}</span>
                    </div>
                  </button>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div
                      className={`h-0.5 w-2 flex-shrink-0 ${
                        isPast ? "bg-[#10B981]" : "bg-[#E2E8F0]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Core Intelligence, Observations & Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Strategic Pitch Angle */}
          <div className="p-4 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7C3AED] flex items-center gap-1.5 uppercase tracking-wider">
                <RiSparkling2Fill className="h-4 w-4" />
                Strategic Acquisition Angle
              </span>
              <span className="text-[11px] font-semibold text-[#8B5CF6] bg-white px-2 py-0.5 rounded border border-[#DDD6FE]">
                Phase 3 Ready
              </span>
            </div>
            <p className="text-xs text-[#5B21B6] font-medium leading-relaxed">
              {business.suggestedAngle}
            </p>
          </div>

          {/* Research Observations & Website Experience */}
          <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  Research Observations & Digital Gaps
                </h4>
                <p className="text-xs text-[#64748B]">
                  Factual observations audited from public touchpoints.
                </p>
              </div>
              <span className="text-[11px] text-[#2563EB] font-semibold bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                4 Gaps Identified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <RiTimeLine className="h-4 w-4 text-[#2563EB]" />
                  Contact & Inquiry Flow
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {business.researchObservations.contactFlow}
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <RiChatSmile3Line className="h-4 w-4 text-[#8B5CF6]" />
                  FAQ & Knowledge Access
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {business.researchObservations.faqAccess}
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <RiFilterLine className="h-4 w-4 text-[#10B981]" />
                  Lead Capture Mechanisms
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {business.researchObservations.leadCapture}
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                  <RiAlertLine className="h-4 w-4 text-[#F59E0B]" />
                  Follow-up & Retention
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {business.researchObservations.followUp}
                </p>
              </div>
            </div>
          </Card>

          {/* NEXUS Opportunity Signals */}
          <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">
                  NEXUS Product Opportunity Signals
                </h4>
                <p className="text-xs text-[#64748B]">
                  Specific NEXUS modules that directly address this business&apos;s friction.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
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

          {/* Activity Timeline */}
          <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-[#0F172A] border-b border-[#F1F5F9] pb-3">
              Prospect Activity Timeline
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
              {business.activityHistory.map((act) => (
                <div key={act.id} className="relative group">
                  <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-white border-2 border-[#2563EB] flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F172A]">
                        {act.title}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        {act.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Contact Dossier, Fit Breakdown & Interactive Notes */}
        <div className="space-y-6">
          {/* Fit Score Card */}
          <Card padding="md" className="border-[#BFDBFE] bg-[#F0F7FF] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider">
                NEXUS Fit Score
              </span>
              <span className="text-xl font-extrabold text-[#1E40AF]">
                {business.nexusFitScore} / 100
              </span>
            </div>
            <p className="text-xs text-[#2563EB] font-medium leading-relaxed">
              {business.nexusFitRationale}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#60A5FA] pt-1 border-t border-[#BFDBFE]/60">
              <RiShieldCheckLine className="h-4 w-4 flex-shrink-0" />
              <span>Observational match rating based on channel footprint.</span>
            </div>
          </Card>

          {/* Contact Details Card with Copy Buttons */}
          <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#F1F5F9] pb-2">
              Contact & Location Dossier
            </h4>

            <div className="space-y-2.5 text-xs divide-y divide-[#F1F5F9]">
              {business.phone && (
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Direct Telephone</span>
                    <span className="font-medium text-[#0F172A]">{business.phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(business.phone!, "phone")}
                    className="text-[#2563EB] hover:text-[#1D4ED8] p-1 text-xs"
                    title="Copy phone"
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
                    <span className="text-[10px] text-[#94A3B8] block">Email Address</span>
                    <span className="font-medium text-[#0F172A] truncate max-w-[170px] block">
                      {business.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(business.email!, "email")}
                    className="text-[#2563EB] hover:text-[#1D4ED8] p-1 text-xs"
                    title="Copy email"
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
                    <span className="text-[10px] text-[#94A3B8] block">Headquarters / Physical</span>
                    <span className="text-[#475569] leading-snug block">
                      {business.address}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(business.address!, "address")}
                    className="text-[#2563EB] hover:text-[#1D4ED8] p-1 text-xs flex-shrink-0"
                    title="Copy address"
                  >
                    {copiedField === "address" ? (
                      <RiCheckLine className="h-4 w-4 text-[#10B981]" />
                    ) : (
                      <RiFileCopyLine className="h-4 w-4" />
                    )}
                  </button>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#94A3B8] block">Company Size</span>
                  <span className="font-medium text-[#0F172A]">
                    {business.companySize || "15-50 Employees"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Social Channels Card */}
          <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider border-b border-[#F1F5F9] pb-2">
              Social Presence
            </h4>

            <div className="space-y-2 text-xs">
              {business.socialPresence.instagram && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#FDF2F8] border border-[#FBCFE8]">
                  <div className="flex items-center gap-2">
                    <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />
                    <span className="font-semibold text-[#9D174D]">
                      {business.socialPresence.instagram.handle}
                    </span>
                  </div>
                  {business.socialPresence.instagram.followers && (
                    <span className="text-[10px] font-bold text-[#9D174D]">
                      {business.socialPresence.instagram.followers}
                    </span>
                  )}
                </div>
              )}

              {business.socialPresence.whatsapp && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]">
                  <div className="flex items-center gap-2">
                    <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />
                    <span className="font-semibold text-[#047857]">
                      {business.socialPresence.whatsapp.number}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#047857]">
                    Verified
                  </span>
                </div>
              )}

              {business.socialPresence.facebook && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]">
                  <div className="flex items-center gap-2">
                    <RiFacebookCircleLine className="h-4 w-4 text-[#2563EB]" />
                    <span className="font-semibold text-[#1E40AF]">
                      {business.socialPresence.facebook.page}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#1E40AF]">Active</span>
                </div>
              )}

              {business.socialPresence.googleBusiness && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
                  <div className="flex items-center gap-2">
                    <RiGoogleLine className="h-4 w-4 text-[#EA4335]" />
                    <span className="font-semibold text-[#991B1B]">
                      ★ {business.socialPresence.googleBusiness.rating} (
                      {business.socialPresence.googleBusiness.reviewCount} reviews)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#991B1B]">Claimed</span>
                </div>
              )}
            </div>
          </Card>

          {/* Interactive Notes Section */}
          <Card padding="md" className="border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <RiFileTextLine className="h-4 w-4 text-[#2563EB]" />
                Prospect Notes ({business.notes.length})
              </h4>
            </div>

            {/* Note Submission Form */}
            <form onSubmit={handleAddNote} className="space-y-2.5">
              <Textarea
                placeholder="Record observation, meeting outcome, or custom acquisition requirement..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="text-xs"
              />

              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  placeholder="Author"
                  className="text-[11px] px-2 py-1 border border-[#E2E8F0] rounded text-[#64748B] w-32 focus:outline-none focus:border-[#2563EB]"
                />
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  leftIcon={<RiAddLine className="h-3.5 w-3.5" />}
                  disabled={!newNote.trim()}
                >
                  Save Note
                </Button>
              </div>
            </form>

            {/* Note List */}
            <div className="space-y-2.5 pt-2 divide-y divide-[#F1F5F9]">
              {business.notes.map((note) => (
                <div key={note.id} className="pt-2 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0F172A]">{note.author}</span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {note.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9]">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* AI Business Analysis Modal (Phase 3 Preparation) */}
      {isAnalyzeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsAnalyzeModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F5F3FF] text-[#8B5CF6]">
                  <RiSparkling2Fill className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    AI Business Analysis Engine
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Phase 3 System · Ready for Automated Teardown
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnalyzeModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs space-y-1.5 text-[#166534]">
              <span className="font-bold block">
                Target Data Synchronized & Prepared:
              </span>
              <p className="leading-relaxed">
                NEXUS has indexed {business.businessName}&apos;s digital footprint across{" "}
                {Object.keys(business.socialPresence).join(", ")}. In Phase 3, this
                engine will automatically compile:
              </p>
              <ul className="list-disc list-inside space-y-0.5 pt-1 text-[11px]">
                <li>Competitive omnichannel response benchmark</li>
                <li>Live simulated customer chat transcripts</li>
                <li>Tailored 60-second interactive client demo</li>
                <li>One-click proposal generation</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsAnalyzeModalOpen(false)}
              >
                Done
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  handleStageClick("Qualified");
                  setIsAnalyzeModalOpen(false);
                }}
              >
                Mark as Qualified for Demo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsDemoModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Create Personalized Demo
                </h3>
                <p className="text-xs text-[#64748B]">
                  Prepare an interactive preview for {business.businessName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-[#475569] leading-relaxed">
                Generating an interactive demo link with pre-loaded hospitality/clinic
                knowledge base and simulated WhatsApp booking assistant.
              </p>
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-mono text-[11px] text-[#2563EB]">
                nexusai.app/demo/{business.id}?mode=preview
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsDemoModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  handleStageClick("Demo Ready");
                  setIsDemoModalOpen(false);
                }}
              >
                Set Stage to Demo Ready
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
