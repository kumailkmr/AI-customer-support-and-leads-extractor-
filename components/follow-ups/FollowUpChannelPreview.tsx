"use client";

import React from "react";
import { FollowUpChannel } from "@/lib/follow-ups/types";
import {
  RiWhatsappFill,
  RiInstagramLine,
  RiFacebookCircleFill,
  RiMailLine,
  RiGlobalLine,
  RiCheckDoubleLine,
  RiSparkling2Fill,
  RiTimeLine,
} from "react-icons/ri";

interface FollowUpChannelPreviewProps {
  channel: FollowUpChannel;
  message: string;
  subject?: string;
  targetName: string;
  senderName?: string;
  clientName?: string;
  isSimulated?: boolean;
}

export function FollowUpChannelPreview({
  channel,
  message,
  subject,
  targetName,
  senderName = "NEXUS Agent",
  clientName = "NEXUS AI",
  isSimulated = true,
}: FollowUpChannelPreviewProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
      {/* Simulation Bar */}
      {isSimulated && (
        <div className="px-3 py-1.5 bg-[#F1F5F9] border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1 font-medium text-[#475569]">
            <RiSparkling2Fill className="h-3 w-3 text-[#8B5CF6]" />
            Simulation Mode — Channel Preview
          </span>
          <span className="uppercase text-[10px] font-semibold tracking-wider text-[#94A3B8]">
            {channel}
          </span>
        </div>
      )}

      {/* WHATSAPP PREVIEW */}
      {channel === "whatsapp" && (
        <div className="bg-[#EFEAE2] p-4 min-h-[170px] flex flex-col justify-between font-sans">
          <div className="flex items-center gap-2 mb-3 bg-white/80 backdrop-blur-xs py-1.5 px-3 rounded-lg border border-[#E2E8F0] w-fit shadow-xs">
            <RiWhatsappFill className="h-4 w-4 text-[#25D366]" />
            <span className="text-xs font-semibold text-[#1E293B]">To: {targetName}</span>
            <span className="text-[10px] text-[#64748B]">• via {clientName}</span>
          </div>

          <div className="max-w-[88%] ml-auto bg-[#DCF8C6] text-[#111827] rounded-xl rounded-tr-xs p-3 shadow-xs text-xs leading-relaxed space-y-1">
            <p className="whitespace-pre-wrap">{message}</p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-[#64748B] pt-1">
              <span>Just now</span>
              <RiCheckDoubleLine className="h-3.5 w-3.5 text-[#34B7F1]" />
            </div>
          </div>
        </div>
      )}

      {/* INSTAGRAM PREVIEW */}
      {channel === "instagram" && (
        <div className="bg-[#FAFAFA] p-4 min-h-[170px] flex flex-col justify-between font-sans">
          <div className="flex items-center gap-2 mb-3 bg-white py-1.5 px-3 rounded-lg border border-[#F1F5F9] w-fit shadow-xs">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white text-[11px]">
              <RiInstagramLine />
            </div>
            <span className="text-xs font-semibold text-[#1E293B]">{targetName}</span>
            <span className="text-[10px] text-[#64748B]">Instagram Direct</span>
          </div>

          <div className="max-w-[85%] ml-auto bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-2xl rounded-tr-xs p-3 shadow-xs text-xs leading-relaxed">
            <p className="whitespace-pre-wrap">{message}</p>
            <div className="flex items-center justify-end text-[10px] text-white/75 pt-1">
              <span>Sent via Instagram DM</span>
            </div>
          </div>
        </div>
      )}

      {/* EMAIL PREVIEW */}
      {channel === "email" && (
        <div className="bg-white p-4 min-h-[170px] flex flex-col font-sans space-y-2.5">
          <div className="border-b border-[#E2E8F0] pb-2 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">From: <strong className="text-[#1E293B] font-medium">{senderName} &lt;team@nexus-ai.local&gt;</strong></span>
              <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <RiMailLine className="h-3.5 w-3.5" /> Email Dispatch
              </span>
            </div>
            <div className="text-[#64748B]">To: <strong className="text-[#1E293B] font-medium">{targetName}</strong></div>
            {subject && (
              <div className="text-[#0F172A] font-semibold pt-1">
                Subject: {subject}
              </div>
            )}
          </div>

          <div className="text-xs text-[#334155] leading-relaxed whitespace-pre-wrap bg-[#F8FAFC] p-3 rounded-lg border border-[#F1F5F9]">
            {message}
          </div>
        </div>
      )}

      {/* FACEBOOK PREVIEW */}
      {channel === "facebook" && (
        <div className="bg-[#F0F2F5] p-4 min-h-[170px] flex flex-col justify-between font-sans">
          <div className="flex items-center gap-2 mb-3 bg-white py-1.5 px-3 rounded-lg border border-[#E2E8F0] w-fit shadow-xs">
            <RiFacebookCircleFill className="h-4 w-4 text-[#1877F2]" />
            <span className="text-xs font-semibold text-[#1E293B]">{targetName}</span>
            <span className="text-[10px] text-[#64748B]">Messenger</span>
          </div>

          <div className="max-w-[85%] ml-auto bg-[#0084FF] text-white rounded-2xl rounded-tr-xs p-3 shadow-xs text-xs leading-relaxed">
            <p className="whitespace-pre-wrap">{message}</p>
            <div className="flex items-center justify-end text-[10px] text-white/80 pt-1">
              <span>Delivered</span>
            </div>
          </div>
        </div>
      )}

      {/* WEBSITE CHAT PREVIEW */}
      {channel === "website" && (
        <div className="bg-[#F8FAFC] p-4 min-h-[170px] flex flex-col justify-between font-sans">
          <div className="flex items-center gap-2 mb-3 bg-white py-1.5 px-3 rounded-lg border border-[#E2E8F0] w-fit shadow-xs">
            <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />
            <span className="text-xs font-semibold text-[#1E293B]">Live Website Concierge</span>
            <span className="text-[10px] text-[#64748B]">• {targetName}</span>
          </div>

          <div className="max-w-[85%] ml-auto bg-[#2563EB] text-white rounded-xl rounded-tr-xs p-3 shadow-xs text-xs leading-relaxed">
            <p className="whitespace-pre-wrap">{message}</p>
            <div className="flex items-center justify-end text-[10px] text-white/80 pt-1">
              <span>Proactive Re-engagement</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
