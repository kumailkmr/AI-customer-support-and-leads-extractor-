"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { FollowUpChannelPreview } from "@/components/follow-ups/FollowUpChannelPreview";
import {
  RiArrowLeftLine,
  RiSendPlane2Fill,
  RiTimeLine,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiRestartLine,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiEditLine,
  RiCheckLine,
  RiShieldCheckLine,
  RiExternalLinkLine,
  RiSparkling2Fill,
  RiHistoryLine,
} from "react-icons/ri";

export default function FollowUpDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const {
    getFollowUp,
    updateFollowUp,
    sendFollowUpNow,
    pauseFollowUp,
    resumeFollowUp,
    cancelFollowUp,
    retryFollowUp,
    deleteFollowUp,
  } = useFollowUps();
  const { addToast } = useToast();

  const followUp = getFollowUp(id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedMsg, setEditedMsg] = useState(followUp?.message || "");
  const [editedSubject, setEditedSubject] = useState(followUp?.subject || "");

  if (!followUp) {
    return (
      <AppLayout>
        <div className="p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto text-xl">
            !
          </div>
          <h2 className="text-lg font-bold text-[#0F172A]">Follow-Up Not Found</h2>
          <p className="text-xs text-[#64748B]">
            The follow-up record &ldquo;{id}&rdquo; does not exist or has been removed.
          </p>
          <Link href="/follow-ups">
            <Button variant="outline" size="sm">
              <RiArrowLeftLine className="h-4 w-4 mr-1" /> Return to Follow-Ups
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isLead = followUp.targetType === "LEAD";

  const handleSaveEdit = () => {
    updateFollowUp(followUp.id, {
      message: editedMsg,
      subject: editedSubject || undefined,
    });
    setIsEditing(false);
    addToast({
      title: "Follow-Up Updated",
      description: "Custom message changes saved successfully.",
      variant: "success",
    });
  };

  const handleSend = () => {
    sendFollowUpNow(followUp.id);
    addToast({
      title: "Simulated Send Complete",
      description: `Dispatched message to ${followUp.targetName} via ${followUp.channel.toUpperCase()}.`,
      variant: "success",
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this follow-up record?")) {
      deleteFollowUp(followUp.id);
      addToast({
        title: "Record Deleted",
        description: "Follow-up was removed.",
        variant: "info",
      });
      router.push("/follow-ups");
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title={followUp.targetName}
        subtitle={`${isLead ? "Client Lead Follow-Up" : "Nexus Prospect Acquisition"} — Scheduled via ${followUp.channel.toUpperCase()}`}
        breadcrumbs={[
          { label: "Follow-Ups", href: "/follow-ups" },
          { label: followUp.targetName },
        ]}
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Simulation Mode
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/follow-ups">
              <Button variant="outline" size="sm">
                <RiArrowLeftLine className="h-4 w-4 mr-1" /> Back to Queue
              </Button>
            </Link>
            {followUp.status !== "SENT" && followUp.status !== "COMPLETED" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSend}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5 shadow-xs"
              >
                <RiSendPlane2Fill className="h-4 w-4" /> Send Now (Simulation)
              </Button>
            ) : (
              <span className="text-xs font-semibold text-[#059669] flex items-center gap-1 bg-[#ECFDF5] px-3 py-1.5 rounded-lg border border-[#A7F3D0]">
                <RiCheckDoubleLine className="h-4 w-4" /> Sent
              </span>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Profile Summary */}
          <Card padding="md" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    isLead
                      ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                      : "bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D5FF]"
                  }`}
                >
                  {isLead ? "Client Lead" : "Nexus Prospect"}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mt-1.5">
                  {followUp.targetName}
                </h3>
                {followUp.targetSubtext && (
                  <p className="text-xs text-[#64748B]">{followUp.targetSubtext}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    followUp.status === "DUE"
                      ? "warning"
                      : followUp.status === "SENT"
                      ? "success"
                      : "info"
                  }
                >
                  {followUp.status}
                </Badge>
                <Link
                  href={isLead ? `/leads/${followUp.targetId}` : `/prospects/${followUp.targetId}`}
                  className="text-xs text-[#2563EB] hover:underline flex items-center gap-1 font-medium bg-[#EFF6FF] px-2.5 py-1 rounded-lg"
                >
                  View CRM Profile <RiExternalLinkLine />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] text-xs">
              <div>
                <span className="text-[#64748B] block text-[11px]">Channel</span>
                <span className="font-semibold text-[#1E293B] capitalize mt-0.5 block">
                  {followUp.channel}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Priority</span>
                <span className="font-semibold text-[#1E293B] mt-0.5 block">
                  {followUp.priority}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Execution Mode</span>
                <span className="font-semibold text-[#059669] mt-0.5 flex items-center gap-1">
                  <RiShieldCheckLine /> {followUp.automationMode}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Due Date/Time</span>
                <span className="font-semibold text-[#1E293B] mt-0.5 flex items-center gap-1">
                  <RiTimeLine /> {new Date(followUp.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#FEF3C7]/40 border border-[#FDE68A] rounded-xl text-xs space-y-1">
              <span className="font-semibold text-[#92400E] block">Trigger Rationale:</span>
              <p className="text-[#78350F] leading-relaxed">{followUp.triggerReason}</p>
            </div>
          </Card>

          {/* Message Content & Preview */}
          <Card padding="md" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Follow-Up Message
              </h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditedMsg(followUp.message);
                    setEditedSubject(followUp.subject || "");
                    setIsEditing(true);
                  }}
                  className="text-xs h-7"
                >
                  <RiEditLine className="h-3.5 w-3.5 mr-1" /> Edit Message
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  className="text-xs h-7 bg-[#059669] hover:bg-[#047857] text-white"
                >
                  <RiCheckLine className="h-3.5 w-3.5 mr-1" /> Save
                </Button>
              )}
            </div>

            {isEditing && (
              <div className="space-y-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                {followUp.channel === "email" && (
                  <div>
                    <label className="text-xs font-semibold text-[#334155] block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1]"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-[#334155] block mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={4}
                    value={editedMsg}
                    onChange={(e) => setEditedMsg(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1]"
                  />
                </div>
              </div>
            )}

            <FollowUpChannelPreview
              channel={followUp.channel}
              message={isEditing ? editedMsg : followUp.message}
              subject={isEditing ? editedSubject : followUp.subject}
              targetName={followUp.targetName}
              clientName={followUp.clientName}
            />
          </Card>
        </div>

        {/* Right Column: Controls & History */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <Card padding="md" className="border-[#E2E8F0] bg-white shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Simulation Actions
            </h4>

            <div className="space-y-2">
              {followUp.status === "PAUSED" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resumeFollowUp(followUp.id)}
                  className="w-full justify-start text-xs text-[#059669]"
                >
                  <RiPlayCircleLine className="h-4 w-4 mr-2" /> Resume Schedule
                </Button>
              ) : (
                followUp.status !== "SENT" &&
                followUp.status !== "COMPLETED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pauseFollowUp(followUp.id)}
                    className="w-full justify-start text-xs text-[#D97706]"
                  >
                    <RiPauseCircleLine className="h-4 w-4 mr-2" /> Pause Schedule
                  </Button>
                )
              )}

              {followUp.status === "FAILED" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => retryFollowUp(followUp.id)}
                  className="w-full justify-start text-xs text-[#2563EB]"
                >
                  <RiRestartLine className="h-4 w-4 mr-2" /> Retry Dispatch
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="w-full justify-start text-xs text-[#EF4444] border-[#FCA5A5] hover:bg-[#FEF2F2]"
              >
                <RiDeleteBinLine className="h-4 w-4 mr-2" /> Delete Follow-Up
              </Button>
            </div>
          </Card>

          {/* History Timeline */}
          <Card padding="md" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <RiHistoryLine className="h-4 w-4 text-[#64748B]" />
              Event History
            </h4>

            <div className="border-l-2 border-[#E2E8F0] ml-2 pl-4 space-y-4 text-xs">
              {followUp.history.map((h) => (
                <div key={h.id} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#2563EB] border-2 border-white" />
                  <div className="font-semibold text-[#1E293B]">{h.action}</div>
                  {h.note && <p className="text-[#64748B] text-[11px] mt-0.5">{h.note}</p>}
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {h.performedBy}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
