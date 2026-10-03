"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConversationCard } from "@/components/ui/ConversationCard";
import { StatusBadge } from "@/components/ui/Badge";
import { AIBadge } from "@/components/ui/AIBadge";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { FilterPill } from "@/components/ui/FilterPill";
import { mockRecentConversations } from "@/lib/mock-data/conversations";
import { Conversation, ConversationMessage } from "@/types";
import {
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
  RiSendPlane2Fill,
  RiSparkling2Fill,
  RiCheckDoubleLine,
  RiCalendarEventLine,
  RiShieldUserLine,
} from "react-icons/ri";

export default function InboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockRecentConversations);
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedConv, setSelectedConv] = useState<Conversation>(mockRecentConversations[0]);
  const [replyText, setReplyText] = useState("");

  const filtered = conversations.filter((c) => {
    const matchesChannel =
      selectedChannel === "All" || c.channel === selectedChannel;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "AI Handling" && c.aiHandled) ||
      (selectedStatus === "Human Required" && !c.aiHandled) ||
      c.status === selectedStatus;
    return matchesChannel && matchesStatus;
  });

  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    const newMessage: ConversationMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      content: replyText,
      timestamp: "Just now",
      sentiment: "positive",
    };

    const updatedConv: Conversation = {
      ...selectedConv,
      lastMessageSnippet: replyText,
      lastMessageAt: "Just now",
      messages: [...selectedConv.messages, newMessage],
    };

    setSelectedConv(updatedConv);
    setConversations((prev) =>
      prev.map((c) => (c.id === updatedConv.id ? updatedConv : c))
    );
    setReplyText("");
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "Instagram":
        return <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />;
      case "WhatsApp":
        return <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />;
      case "Facebook":
        return <RiFacebookCircleLine className="h-4 w-4 text-[#1877F2]" />;
      case "Website":
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
      case "Email":
        return <RiMailLine className="h-4 w-4 text-[#64748B]" />;
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Omnichannel Acquisition Inbox"
        subtitle="Live multi-channel customer conversations with autonomous AI responses and human handoff."
        badge={
          <span className="text-xs font-semibold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            5 Channels Synced
          </span>
        }
      />

      {/* 3-Column Responsive Inbox Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[780px] rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
        {/* Column 1: Conversations List (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-full border-r border-[#E2E8F0] overflow-hidden bg-white">
          <div className="p-3 border-b border-[#F1F5F9] space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {["All", "Instagram", "WhatsApp", "Facebook", "Website", "Email"].map((ch) => (
                <FilterPill
                  key={ch}
                  label={ch}
                  isActive={selectedChannel === ch}
                  onClick={() => setSelectedChannel(ch)}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <FilterPill
                label="All Status"
                isActive={selectedStatus === "All"}
                onClick={() => setSelectedStatus("All")}
              />
              <FilterPill
                label="AI Handling"
                isActive={selectedStatus === "AI Handling"}
                onClick={() => setSelectedStatus("AI Handling")}
              />
              <FilterPill
                label="Human Required"
                isActive={selectedStatus === "Human Required"}
                onClick={() => setSelectedStatus("Human Required")}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {filtered.map((conv) => (
              <ConversationCard
                key={conv.id}
                conversation={conv}
                isSelected={selectedConv.id === conv.id}
                onSelect={setSelectedConv}
              />
            ))}
          </div>
        </div>

        {/* Column 2: Active Chat Thread (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full border-r border-[#E2E8F0] overflow-hidden bg-white">
          {/* Thread Header */}
          <div className="p-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedConv.avatarUrl}
                  alt={selectedConv.contactName}
                  className="h-9 w-9 rounded-full object-cover border"
                />
                <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white shadow-xs border">
                  {getChannelIcon(selectedConv.channel)}
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#0F172A] truncate">
                  {selectedConv.contactName}
                </h4>
                <span className="text-[11px] text-[#64748B] truncate block">
                  {selectedConv.companyName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {selectedConv.aiHandled ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
                  <RiSparkling2Fill className="h-3 w-3" />
                  AI Handling
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA]">
                  <RiShieldUserLine className="h-3 w-3" />
                  Human Required
                </span>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]/30">
            {selectedConv.messages.map((msg) => {
              const isMe = msg.sender === "user";
              const isAi = msg.sender === "ai_agent";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe || isAi ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#94A3B8]">
                    <span>
                      {isAi ? "NEXUS AI Engine" : isMe ? "You (Agent)" : selectedConv.contactName} · {msg.timestamp}
                    </span>
                    {isAi && <AIBadge size="sm" label="Auto" />}
                  </div>

                  <div
                    className={`max-w-sm sm:max-w-md rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isAi
                        ? "bg-[#F5F3FF] text-[#4C1D95] border border-[#DDD6FE] rounded-tr-xs"
                        : isMe
                        ? "bg-[#2563EB] text-white rounded-tr-xs"
                        : "bg-white text-[#172033] border border-[#E2E8F0] shadow-xs rounded-tl-xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Quick Response Suggestion */}
          <div className="p-2.5 bg-[#F5F3FF]/80 border-t border-[#EDE9FE] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#7C3AED] min-w-0">
              <RiSparkling2Fill className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate text-[11px] font-medium">
                AI Suggests: &ldquo;We have availability held for you this weekend. Shall I send the booking link?&rdquo;
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setReplyText("We have availability held for you this weekend. Shall I send the booking link?")
              }
              className="text-[10px] font-bold text-[#7C3AED] hover:underline flex-shrink-0 cursor-pointer"
            >
              Insert
            </button>
          </div>

          {/* Reply Box */}
          <div className="p-3 border-t border-[#E2E8F0] bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder={`Type a reply to ${selectedConv.contactName} on ${selectedConv.channel}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              className="flex-1 rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-xs text-[#172033] placeholder:text-[#94A3B8] outline-none focus:border-[#2563EB]"
            />
            <Button
              size="sm"
              variant="primary"
              rightIcon={<RiSendPlane2Fill className="h-3.5 w-3.5" />}
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </div>
        </div>

        {/* Column 3: Lead Details & CRM Intelligence (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col h-full overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]/50">
          <div className="border-b border-[#E2E8F0] pb-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedConv.avatarUrl}
              alt={selectedConv.contactName}
              className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm mx-auto mb-2"
            />
            <h4 className="text-sm font-bold text-[#0F172A]">
              {selectedConv.contactName}
            </h4>
            <span className="text-xs text-[#64748B]">{selectedConv.channelHandle}</span>
          </div>

          {/* Lead Qualification & Intent */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                Qualification & Score
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A]">AI Match Score</span>
                <AIBadge label="92% Score" size="sm" variant="solid" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Lifecycle Status</span>
                <StatusBadge status={selectedConv.status} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#64748B]">Intent Type</span>
                <span className="font-mono text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                  {selectedConv.aiIntent}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                Client Acquisition Funnel
              </span>
              <span className="text-xs font-bold text-[#0F172A] block">
                {selectedConv.companyName}
              </span>
              <span className="text-[11px] text-[#64748B] block">
                Source: {selectedConv.channel} Direct Inbound
              </span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                Triage Actions
              </span>
              <Button
                size="sm"
                variant="secondary"
                className="w-full justify-start text-xs"
                leftIcon={<RiCheckDoubleLine className="h-3.5 w-3.5 text-[#10B981]" />}
              >
                Mark as Qualified
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-full justify-start text-xs"
                leftIcon={<RiCalendarEventLine className="h-3.5 w-3.5 text-[#2563EB]" />}
              >
                Schedule Follow-up
              </Button>
              <AIActionButton
                size="sm"
                variant="outline"
                className="w-full justify-start"
                label="Generate Objection Pitch"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
