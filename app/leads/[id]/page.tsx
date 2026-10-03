"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { useToast } from "@/components/ui/Toast";
import { useLeads } from "@/lib/store/leads-store";
import { useChannels } from "@/lib/store/channels-store";
import { ClientLeadStatus, QualificationValue } from "@/types/leads";
import {
  LEAD_STATUS_CONFIG,
  LEAD_INTENT_LABELS,
  QUALIFICATION_STATUS_CONFIG,
} from "@/lib/leads/leads-config";
import { formatCurrency } from "@/lib/utils";

import { LeadQualificationPanel } from "@/components/leads/LeadQualificationPanel";
import { ScheduleFollowUpModal } from "@/components/leads/ScheduleFollowUpModal";
import { AddNoteModal } from "@/components/leads/AddNoteModal";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { CreateFollowUpModal } from "@/components/follow-ups/CreateFollowUpModal";

import {
  RiArrowLeftLine,
  RiBuilding4Line,
  RiMailLine,
  RiPhoneLine,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiChat1Line,
  RiCalendarEventLine,
  RiFileTextLine,
  RiSparkling2Fill,
} from "react-icons/ri";

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { showToast } = useToast();

  const {
    getLead,
    getConversation,
    conversations: allConversations,
    updateLeadStatus,
    updateQualificationCriterion,
    addLeadNote,
    scheduleLeadFollowUp,
  } = useLeads();
  const { getIdentitiesForLead } = useChannels();
  const { followUps } = useFollowUps();

  const lead = getLead(resolvedParams.id);
  const conversation = lead?.conversationId ? getConversation(lead.conversationId) : undefined;
  const identities = lead ? getIdentitiesForLead(lead.id) : [];
  const crossChannelConversations = React.useMemo(() => {
    if (!lead) return [];
    return allConversations.filter(
      (c) => c.leadId === lead.id || (c.clientName === lead.clientName && c.leadName === lead.name)
    );
  }, [allConversations, lead]);

  const leadFollowUps = React.useMemo(() => {
    if (!lead) return [];
    return followUps.filter(
      (f) => f.targetId === lead.id || f.targetName.toLowerCase() === lead.name.toLowerCase()
    );
  }, [followUps, lead]);

  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isEngineFollowUpModalOpen, setIsEngineFollowUpModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  if (!lead) {
    return (
      <AppLayout>
        <div className="py-12">
          <EmptyStateCard
            icon={<RiBuilding4Line className="h-10 w-10 text-[#94A3B8]" />}
            title="Customer Lead Not Found"
            description="The requested customer lead could not be located in your local client database."
            actionLabel="Back to Leads"
            onAction={() => router.push("/leads")}
          />
        </div>
      </AppLayout>
    );
  }

  const statusCfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG.NEW;
  const intentCfg = LEAD_INTENT_LABELS[lead.intent] || { label: lead.intent, badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" };
  const qualCfg = QUALIFICATION_STATUS_CONFIG[lead.qualificationStatus] || QUALIFICATION_STATUS_CONFIG.NOT_STARTED;

  const getChannelIcon = (ch: typeof lead.channel) => {
    switch (ch) {
      case "Website Chat":
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
      case "Instagram":
        return <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />;
      case "Facebook":
        return <RiFacebookCircleLine className="h-4 w-4 text-[#1877F2]" />;
      case "WhatsApp":
        return <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />;
      case "Email":
        return <RiMailLine className="h-4 w-4 text-[#64748B]" />;
      case "Phone":
        return <RiPhoneLine className="h-4 w-4 text-[#D97706]" />;
      default:
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
    }
  };

  const handleStatusChange = (newStatus: ClientLeadStatus) => {
    updateLeadStatus(lead.id, newStatus);
    showToast(`Updated status to ${newStatus}.`, "success");
  };

  const handleUpdateCriterion = (criterionId: string, value: QualificationValue, notes?: string) => {
    updateQualificationCriterion(lead.id, criterionId, value, notes);
    showToast(`Qualification updated.`, "info");
  };

  const handleScheduleFollowUp = (dateTime: string, note?: string) => {
    scheduleLeadFollowUp(lead.id, dateTime, note);
    showToast(`Follow-up scheduled for ${dateTime}.`, "success");
  };

  const handleAddNote = (content: string) => {
    addLeadNote(lead.id, content);
    showToast(`Internal note recorded.`, "success");
  };

  return (
    <AppLayout>
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          href="/leads"
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1.5 transition-colors"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          <span>Back to All Leads</span>
        </Link>

        <div className="flex items-center gap-2">
          {lead.conversationId && (
            <Link href={`/inbox?conversationId=${lead.conversationId}`}>
              <Button size="sm" variant="primary" leftIcon={<RiChat1Line className="h-4 w-4" />}>
                Open Conversation
              </Button>
            </Link>
          )}

          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RiCalendarEventLine className="h-4 w-4" />}
            onClick={() => setIsFollowUpModalOpen(true)}
          >
            Schedule Follow-Up
          </Button>

          <Button
            size="sm"
            variant="outline"
            leftIcon={<RiFileTextLine className="h-4 w-4" />}
            onClick={() => setIsNoteModalOpen(true)}
          >
            Add Note
          </Button>
        </div>
      </div>

      {/* Page Header */}
      <PageHeader
        title={lead.name}
        subtitle={`Inbound customer lead generated for client ${lead.clientName}`}
        badge={
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.badgeBorder}`}
            >
              {statusCfg.label}
            </span>

            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${qualCfg.badgeBg} ${qualCfg.badgeText} ${qualCfg.badgeBorder}`}
            >
              {qualCfg.label} ({lead.score}%)
            </span>

            <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <RiBuilding4Line className="h-3.5 w-3.5" />
              {lead.clientName}
            </span>
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#64748B]">Change Status:</label>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value as ClientLeadStatus)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#CBD5E1] bg-white cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFYING">Qualifying</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="FOLLOW_UP">Follow-Up</option>
              <option value="HUMAN_HANDOFF">Human Handoff</option>
              <option value="CONVERTED">Converted</option>
              <option value="NOT_INTERESTED">Not Interested</option>
              <option value="LOST">Lost</option>
            </select>
          </div>
        }
      />

      {/* Main 2-Column Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column (8 cols): Overview, Qualification, Conversation, AI Summary */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Summary Card */}
          <Card padding="md" className="border-[#DDD6FE] bg-gradient-to-b from-[#FAF5FF] to-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6D28D9]">
                <RiSparkling2Fill className="h-4 w-4 text-[#8B5CF6]" />
                <span>AI Conversation Summary</span>
              </div>
              <span className="text-[10px] font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-0.5 rounded-full">
                Simulation Mode
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              {lead.aiSummary}
            </p>
          </Card>

          {/* Lead Qualification Panel */}
          <LeadQualificationPanel
            criteria={lead.qualificationCriteria}
            qualificationStatus={lead.qualificationStatus}
            score={lead.score}
            onUpdateCriterion={handleUpdateCriterion}
          />

          {/* Cross-Channel Conversation History */}
          <Card padding="md" className="border-[#E2E8F0] space-y-3">
            <CardHeader
              title="Cross-Channel Conversation History"
              subtitle={`Unified customer dialogue across ${crossChannelConversations.length} channel threads`}
              action={
                <Link
                  href="/inbox"
                  className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span>Open in Live Inbox</span>
                  <RiChat1Line className="h-3.5 w-3.5" />
                </Link>
              }
            />

            {crossChannelConversations.length > 0 ? (
              <div className="space-y-3">
                {crossChannelConversations.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#E2E8F0]">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-white border border-[#CBD5E1]">
                          {getChannelIcon(c.channel)}
                        </span>
                        <strong className="text-[#0F172A]">{c.channel}</strong>
                        {c.channelHandle && (
                          <span className="font-mono text-[10px] text-[#64748B]">
                            ({c.channelHandle})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-[#94A3B8]">{c.lastMessageAt}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white text-[#0F172A] border border-[#CBD5E1]">
                          {c.status}
                        </span>
                      </div>
                    </div>

                    {/* Messages snippet */}
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {c.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-2 rounded-lg text-xs max-w-[90%] ${
                            m.sender === "lead"
                              ? "bg-white border border-[#E2E8F0] text-[#0F172A] mr-auto"
                              : m.sender === "ai"
                              ? "bg-[#FAF5FF] border border-[#DDD6FE] text-[#5B21B6] ml-auto"
                              : "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] ml-auto"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[9px] text-[#94A3B8] mb-0.5">
                            <span className="font-bold">
                              {m.sender === "lead" ? lead.name : m.sender === "ai" ? "AI Agent" : "Specialist"}
                            </span>
                            <span>{m.timestamp}</span>
                          </div>
                          <p className="leading-snug">{m.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#94A3B8]">
                No cross-channel conversations recorded yet.
              </div>
            )}
          </Card>

          {/* Internal Notes */}
          <Card padding="md" className="border-[#E2E8F0] space-y-3">
            <CardHeader
              title="Internal Staff Notes"
              subtitle="Private collaboration records for client acquisition specialists"
              action={
                <Button size="sm" variant="outline" onClick={() => setIsNoteModalOpen(true)}>
                  Add Note
                </Button>
              }
            />

            {lead.notes.length > 0 ? (
              <div className="space-y-2">
                {lead.notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                      <span className="font-bold text-[#0F172A]">{n.author}</span>
                      <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#334155] leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#94A3B8]">
                No internal notes recorded yet.
              </div>
            )}
          </Card>
        </div>

        {/* Right Column (4 cols): Profile Details, Follow-Up, Activity Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Contact Details Card */}
          <Card padding="md" className="border-[#E2E8F0] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Customer Profile
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Client Business</span>
                <span className="font-bold text-[#0F172A]">{lead.clientName}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Inbound Channel</span>
                <span className="font-semibold text-[#0F172A] flex items-center gap-1">
                  {getChannelIcon(lead.channel)}
                  {lead.channel}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Acquisition Source</span>
                <span className="font-semibold text-[#0F172A]">{lead.source}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Buyer Intent</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${intentCfg.badge}`}>
                  {intentCfg.label}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Phone Number</span>
                <span className="font-semibold text-[#0F172A]">{lead.phone || "Not provided"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Email Address</span>
                <span className="font-semibold text-[#0F172A] truncate max-w-[150px]">{lead.email || "Not provided"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Estimated Value</span>
                <span className="font-bold text-[#10B981]">{formatCurrency(lead.estimatedValue)}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9]">
                <span className="text-[#64748B]">Assigned Specialist</span>
                <span className="font-semibold text-[#0F172A]">{lead.assignedTo}</span>
              </div>

              {/* Tags */}
              <div className="pt-2">
                <span className="text-[11px] text-[#64748B] block mb-1.5 font-medium">Categorized Tags:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Channel Identities (Unified Omnichannel Mapping) */}
          <Card padding="md" className="border-[#E2E8F0] space-y-3">
            <CardHeader
              title="Channel Identities"
              subtitle="Unified customer accounts mapped across platforms"
            />

            <div className="space-y-2 text-xs">
              {identities.length > 0 ? (
                identities.map((idnt) => (
                  <div
                    key={idnt.id}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0F172A] flex items-center gap-1.5 capitalize">
                        {getChannelIcon(
                          idnt.channelType === "instagram"
                            ? "Instagram"
                            : idnt.channelType === "whatsapp"
                            ? "WhatsApp"
                            : idnt.channelType === "website"
                            ? "Website Chat"
                            : idnt.channelType === "email"
                            ? "Email"
                            : "Facebook"
                        )}
                        <span>{idnt.channelType}</span>
                      </span>
                      <span className="text-[10px] text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.2 rounded font-bold">
                        Linked
                      </span>
                    </div>

                    <div className="font-mono text-xs text-[#2563EB] font-bold">
                      {idnt.identifier}
                    </div>

                    <div className="text-[10px] text-[#94A3B8] flex items-center justify-between pt-0.5">
                      <span>ID: {idnt.externalUserId}</span>
                      <span>Seen: {new Date(idnt.lastSeenAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                      {getChannelIcon(lead.channel)}
                      <span>{lead.channel}</span>
                    </span>
                    <span className="text-[10px] text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.2 rounded font-bold">
                      Primary
                    </span>
                  </div>
                  <div className="font-mono text-xs text-[#2563EB] font-bold">
                    {lead.phone || lead.email || "Web Visitor"}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Follow-Up Card */}
          <Card padding="md" className="border-[#E2E8F0] space-y-3">
            <CardHeader
              title="Automated Follow-Ups"
              subtitle="Scheduled engagement pipeline"
              action={
                <Button size="sm" variant="secondary" onClick={() => setIsEngineFollowUpModalOpen(true)}>
                  Schedule
                </Button>
              }
            />

            {leadFollowUps.length > 0 ? (
              <div className="space-y-2 text-xs">
                {leadFollowUps.map((fu) => (
                  <div
                    key={fu.id}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#0F172A] capitalize">
                        {fu.channel} • {fu.type.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          fu.status === "DUE"
                            ? "bg-[#FEF3C7] text-[#B45309]"
                            : fu.status === "SENT"
                            ? "bg-[#ECFDF5] text-[#047857]"
                            : "bg-[#EFF6FF] text-[#2563EB]"
                        }`}
                      >
                        {fu.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#64748B] line-clamp-2">
                      &ldquo;{fu.message}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1">
                      <span>Due: {new Date(fu.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <Link
                        href={`/follow-ups/${fu.id}`}
                        className="text-[#2563EB] hover:underline font-bold"
                      >
                        Inspect →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#B45309]">
                  <RiCalendarEventLine className="h-4 w-4" />
                  <span>{lead.nextFollowUpAt || "No follow-up active"}</span>
                </div>
                <p className="text-[11px] text-[#92400E]">
                  {lead.nextFollowUpAt
                    ? "Automated reminder pending."
                    : "No automated follow-up scheduled. Click Schedule to set one up."}
                </p>
              </div>
            )}
          </Card>

          {/* Activity Timeline */}
          <Card padding="md" className="border-[#E2E8F0] space-y-3">
            <CardHeader
              title="Activity Timeline"
              subtitle="Audit log of conversations & qualification events"
            />

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {lead.activities.map((act) => (
                <div key={act.id} className="relative pl-5 border-l-2 border-[#E2E8F0] space-y-0.5 text-xs">
                  <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-[#2563EB]" />
                  <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                    <span className="font-semibold text-[#0F172A]">{act.actor}</span>
                    <span>{act.timestamp}</span>
                  </div>
                  <div className="font-bold text-[#0F172A] text-[11px]">{act.title}</div>
                  <p className="text-[11px] text-[#64748B] leading-snug">{act.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <ScheduleFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        leadName={lead.name}
        onSchedule={handleScheduleFollowUp}
      />

      <CreateFollowUpModal
        isOpen={isEngineFollowUpModalOpen}
        onClose={() => setIsEngineFollowUpModalOpen(false)}
        defaultTargetType="LEAD"
        defaultTargetId={lead.id}
      />

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        leadName={lead.name}
        onAdd={handleAddNote}
      />
    </AppLayout>
  );
}
