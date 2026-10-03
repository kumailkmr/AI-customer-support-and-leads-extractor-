"use client";

import React, { useState } from "react";
import { FollowUp } from "@/lib/follow-ups/types";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FollowUpChannelPreview } from "./FollowUpChannelPreview";
import {
  RiCloseLine,
  RiSendPlane2Fill,
  RiTimeLine,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiCloseCircleLine,
  RiRestartLine,
  RiDeleteBinLine,
  RiEditLine,
  RiCheckLine,
  RiShieldCheckLine,
  RiHistoryLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import Link from "next/link";

interface FollowUpDetailDrawerProps {
  followUp: FollowUp | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FollowUpDetailDrawer({
  followUp,
  isOpen,
  onClose,
}: FollowUpDetailDrawerProps) {
  const {
    updateFollowUp,
    sendFollowUpNow,
    pauseFollowUp,
    resumeFollowUp,
    cancelFollowUp,
    retryFollowUp,
    deleteFollowUp,
  } = useFollowUps();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editedMsg, setEditedMsg] = useState("");
  const [editedSubject, setEditedSubject] = useState("");

  if (!isOpen || !followUp) return null;

  const handleStartEdit = () => {
    setEditedMsg(followUp.message);
    setEditedSubject(followUp.subject || "");
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateFollowUp(followUp.id, {
      message: editedMsg,
      subject: editedSubject || undefined,
    });
    setIsEditing(false);
    addToast({
      title: "Follow-Up Updated",
      description: "Message template was successfully saved.",
      variant: "success",
    });
  };

  const handleSendNow = () => {
    sendFollowUpNow(followUp.id);
    addToast({
      title: "Simulated Send Complete",
      description: `Dispatched message to ${followUp.targetName} via ${followUp.channel}.`,
      variant: "success",
    });
  };

  const handlePause = () => {
    pauseFollowUp(followUp.id);
    addToast({
      title: "Follow-Up Paused",
      description: "Automated schedule suspended.",
      variant: "info",
    });
  };

  const handleResume = () => {
    resumeFollowUp(followUp.id);
    addToast({
      title: "Follow-Up Resumed",
      description: "Item returned to scheduled queue.",
      variant: "success",
    });
  };

  const handleCancel = () => {
    cancelFollowUp(followUp.id);
    addToast({
      title: "Follow-Up Cancelled",
      description: "Action has been cancelled.",
      variant: "warning",
    });
  };

  const handleRetry = () => {
    retryFollowUp(followUp.id);
    addToast({
      title: "Retry Triggered",
      description: "Simulating delivery retry...",
      variant: "info",
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this follow-up record?")) {
      deleteFollowUp(followUp.id);
      onClose();
      addToast({
        title: "Follow-Up Deleted",
        description: "Record removed from database.",
        variant: "info",
      });
    }
  };

  const isLead = followUp.targetType === "LEAD";

  const getStatusBadgeVariant = (st: string) => {
    switch (st) {
      case "DUE":
        return "warning";
      case "SCHEDULED":
        return "info";
      case "SENT":
      case "COMPLETED":
        return "success";
      case "PAUSED":
        return "neutral";
      case "FAILED":
        return "error";
      case "CANCELLED":
        return "neutral";
      default:
        return "neutral";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isLead
                    ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                    : "bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D5FF]"
                }`}
              >
                {isLead ? "Client Lead Follow-Up" : "Nexus Prospect Acquisition"}
              </span>
              <Badge variant={getStatusBadgeVariant(followUp.status)} size="sm">
                {followUp.status}
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              {followUp.targetName}
            </h2>
            {followUp.targetSubtext && (
              <p className="text-xs text-[#64748B]">{followUp.targetSubtext}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-5 space-y-6 flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
            <div>
              <span className="text-[#64748B] block text-[11px]">Channel</span>
              <span className="font-semibold text-[#1E293B] capitalize flex items-center gap-1.5 mt-0.5">
                {followUp.channel}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px]">Priority</span>
              <span
                className={`font-semibold mt-0.5 inline-block ${
                  followUp.priority === "URGENT"
                    ? "text-[#DC2626]"
                    : followUp.priority === "HIGH"
                    ? "text-[#EA580C]"
                    : "text-[#2563EB]"
                }`}
              >
                {followUp.priority}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px]">Execution Mode</span>
              <span className="font-semibold text-[#1E293B] mt-0.5 flex items-center gap-1">
                <RiShieldCheckLine className="h-3.5 w-3.5 text-[#059669]" />
                {followUp.automationMode === "AUTONOMOUS" ? "Autonomous Dispatch" : "Manual Approval Required"}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px]">Scheduled / Due</span>
              <span className="font-semibold text-[#1E293B] mt-0.5 flex items-center gap-1">
                <RiTimeLine className="h-3.5 w-3.5 text-[#64748B]" />
                {new Date(followUp.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {/* Trigger Rationale */}
          <div className="p-3 bg-[#FEF3C7]/40 border border-[#FDE68A] rounded-xl text-xs space-y-1">
            <span className="font-semibold text-[#92400E] block">Trigger Rationale:</span>
            <p className="text-[#78350F] leading-relaxed">{followUp.triggerReason}</p>
          </div>

          {/* Target Direct Link */}
          <div className="flex items-center justify-between text-xs p-2.5 bg-white border border-[#E2E8F0] rounded-lg">
            <span className="text-[#64748B]">View Target Profile:</span>
            <Link
              href={isLead ? `/leads/${followUp.targetId}` : `/prospects/${followUp.targetId}`}
              className="text-[#2563EB] hover:underline font-medium flex items-center gap-1"
            >
              Open {isLead ? "Lead Details" : "Prospect CRM"}
              <RiExternalLinkLine className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Message Content & Live Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Message & Preview
              </h3>
              {!isEditing ? (
                <button
                  onClick={handleStartEdit}
                  className="text-xs text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 font-medium"
                >
                  <RiEditLine className="h-3.5 w-3.5" /> Edit Message
                </button>
              ) : (
                <button
                  onClick={handleSaveEdit}
                  className="text-xs text-[#059669] hover:text-[#047857] flex items-center gap-1 font-semibold"
                >
                  <RiCheckLine className="h-3.5 w-3.5" /> Save Changes
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                {followUp.channel === "email" && (
                  <div>
                    <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={editedSubject}
                      onChange={(e) => setEditedSubject(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB]"
                    />
                  </div>
                )}
                <div>
                  <label className="text-[11px] font-semibold text-[#475569] block mb-1">
                    Message Body
                  </label>
                  <textarea
                    rows={4}
                    value={editedMsg}
                    onChange={(e) => setEditedMsg(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>
            ) : null}

            {/* Realistic Channel Mockup */}
            <FollowUpChannelPreview
              channel={followUp.channel}
              message={isEditing ? editedMsg : followUp.message}
              subject={isEditing ? editedSubject : followUp.subject}
              targetName={followUp.targetName}
              clientName={followUp.clientName}
            />
          </div>

          {/* History Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
              <RiHistoryLine className="h-4 w-4 text-[#64748B]" />
              Activity & Dispatch History
            </h3>
            <div className="border-l-2 border-[#E2E8F0] ml-2 pl-4 space-y-3 text-xs">
              {followUp.history.map((h) => (
                <div key={h.id} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#94A3B8] border-2 border-white" />
                  <div className="font-semibold text-[#1E293B]">{h.action}</div>
                  {h.note && <p className="text-[#64748B] text-[11px] mt-0.5">{h.note}</p>}
                  <div className="text-[10px] text-[#94A3B8] mt-0.5">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {h.performedBy}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-2 sticky bottom-0">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-[#EF4444] hover:bg-[#FEF2F2] border-[#FCA5A5]"
            >
              <RiDeleteBinLine className="h-4 w-4" />
            </Button>

            {followUp.status === "PAUSED" ? (
              <Button variant="outline" size="sm" onClick={handleResume}>
                <RiPlayCircleLine className="h-4 w-4 mr-1 text-[#059669]" /> Resume
              </Button>
            ) : (
              followUp.status !== "SENT" &&
              followUp.status !== "COMPLETED" &&
              followUp.status !== "CANCELLED" && (
                <Button variant="outline" size="sm" onClick={handlePause}>
                  <RiPauseCircleLine className="h-4 w-4 mr-1 text-[#D97706]" /> Pause
                </Button>
              )
            )}

            {followUp.status === "FAILED" && (
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RiRestartLine className="h-4 w-4 mr-1 text-[#2563EB]" /> Retry
              </Button>
            )}

            {followUp.status !== "CANCELLED" &&
              followUp.status !== "SENT" &&
              followUp.status !== "COMPLETED" && (
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <RiCloseCircleLine className="h-4 w-4 mr-1 text-[#64748B]" /> Cancel
                </Button>
              )}
          </div>

          <div>
            {followUp.status !== "SENT" && followUp.status !== "COMPLETED" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendNow}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center gap-1.5 shadow-xs"
              >
                <RiSendPlane2Fill className="h-4 w-4" /> Send Now (Simulation)
              </Button>
            ) : (
              <span className="text-xs font-semibold text-[#059669] flex items-center gap-1 bg-[#ECFDF5] px-3 py-1.5 rounded-lg border border-[#A7F3D0]">
                <RiCheckLine className="h-4 w-4" /> Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
