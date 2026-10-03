"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useLeads } from "@/lib/store/leads-store";
import {
  ClientLeadChannel,
} from "@/types/leads";
import {
  LEAD_INTENT_LABELS,
} from "@/lib/leads/leads-config";
import { formatCurrency } from "@/lib/utils";

import {
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiPhoneLine,
  RiSparkling2Fill,
  RiUserVoiceLine,
  RiSendPlane2Fill,
  RiUserAddLine,
  RiCheckLine,
  RiArrowRightLine,
  RiAlertLine,
} from "react-icons/ri";

export default function InboxPage() {
  const {
    conversations,
    clients,
    leads,
    sendSimulatedCustomerMessage,
    triggerAiResponse,
    sendHumanReply,
    toggleAiMode,
    reviewExtractedInfo,
    acceptHumanHandoff,
    toggleAutoCapture,
    closeConversation,
    createLeadFromConversation,
  } = useLeads();

  const { showToast } = useToast();

  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ""
  );
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedClientId, setSelectedClientId] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [isSimulatingLead, setIsSimulatingLead] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<"list" | "chat" | "profile">("chat");

  const currentConv = useMemo(() => {
    return (
      conversations.find((c) => c.id === selectedConvId) ||
      conversations[0]
    );
  }, [conversations, selectedConvId]);

  const associatedLead = useMemo(() => {
    if (!currentConv?.leadId) return undefined;
    return leads.find((l) => l.id === currentConv.leadId);
  }, [leads, currentConv]);

  // Filtering conversations list
  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();

    return conversations.filter((c) => {
      const matchesSearch =
        !q ||
        c.leadName.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.lastMessageSnippet.toLowerCase().includes(q);

      const matchesClient =
        selectedClientId === "All" || c.clientId === selectedClientId;

      let matchesFilter = true;
      if (filterType === "Unread") matchesFilter = c.unreadCount > 0;
      else if (filterType === "AI Active") matchesFilter = c.aiMode === "autonomous";
      else if (filterType === "Human") matchesFilter = c.aiMode === "human_takeover";
      else if (filterType === "Needs Attention") matchesFilter = c.status === "Needs Attention";
      else if (filterType === "Closed") matchesFilter = c.status === "Closed";

      return matchesSearch && matchesClient && matchesFilter;
    });
  }, [conversations, search, selectedClientId, filterType]);

  const getChannelIcon = (ch: ClientLeadChannel) => {
    switch (ch) {
      case "Website Chat":
        return <RiGlobalLine className="h-3.5 w-3.5 text-[#2563EB]" />;
      case "Instagram":
        return <RiInstagramLine className="h-3.5 w-3.5 text-[#E1306C]" />;
      case "Facebook":
        return <RiFacebookCircleLine className="h-3.5 w-3.5 text-[#1877F2]" />;
      case "WhatsApp":
        return <RiWhatsappLine className="h-3.5 w-3.5 text-[#10B981]" />;
      case "Email":
        return <RiMailLine className="h-3.5 w-3.5 text-[#64748B]" />;
      case "Phone":
        return <RiPhoneLine className="h-3.5 w-3.5 text-[#D97706]" />;
      default:
        return <RiGlobalLine className="h-3.5 w-3.5 text-[#2563EB]" />;
    }
  };

  // Canned Customer Inquiries for Instant Dialogue Simulation
  const cannedInquiries = [
    { label: "Admission Fee?", text: "How much does admission cost for Grade 8?" },
    { label: "Book Room", text: "I'd like to book a suite for this weekend." },
    { label: "Talk to Human", text: "Can I please speak to a human manager?" },
    { label: "Doctor Slot", text: "Are there doctor consultation slots available tomorrow?" },
    { label: "Too Pricey", text: "Your rates seem a bit too expensive compared to others." },
  ];

  const handleSendSimulatedCustomer = async (textToSend: string) => {
    if (!currentConv || !textToSend.trim()) return;
    setIsSimulatingLead(true);
    await sendSimulatedCustomerMessage(currentConv.id, textToSend.trim());
    setInputText("");
    setIsSimulatingLead(false);
    showToast("Simulated customer message sent.", "info");
  };

  const handleSendHumanReply = () => {
    if (!currentConv || !inputText.trim()) return;
    sendHumanReply(currentConv.id, inputText.trim());
    setInputText("");
    showToast("Human agent reply sent.", "success");
  };

  const handleCreateLead = () => {
    if (!currentConv) return;
    const created = createLeadFromConversation(currentConv.id);
    showToast(`Created customer lead "${created.name}" for ${created.clientName}.`, "success");
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <PageHeader
        title="Omnichannel Conversation Center"
        subtitle="Simulated multi-channel customer communications with autonomous AI support, intent extraction & human takeover."
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
            AI Support Engine Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#64748B] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg shadow-xs">
              Simulation Mode
            </span>
          </div>
        }
      />

      {/* Mobile View Switcher */}
      <div className="flex lg:hidden items-center justify-around bg-white border border-[#E2E8F0] rounded-xl p-1 mb-3">
        <button
          type="button"
          onClick={() => setMobileActiveView("list")}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex-1 text-center ${
            mobileActiveView === "list" ? "bg-[#2563EB] text-white" : "text-[#64748B]"
          }`}
        >
          Conversations ({filteredConversations.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileActiveView("chat")}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex-1 text-center ${
            mobileActiveView === "chat" ? "bg-[#2563EB] text-white" : "text-[#64748B]"
          }`}
        >
          Chat Thread
        </button>
        <button
          type="button"
          onClick={() => setMobileActiveView("profile")}
          className={`py-1.5 px-3 rounded-lg text-xs font-bold flex-1 text-center ${
            mobileActiveView === "profile" ? "bg-[#2563EB] text-white" : "text-[#64748B]"
          }`}
        >
          Lead Dossier
        </button>
      </div>

      {/* 3-Column Responsive Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[780px] bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        {/* COLUMN 1: Conversations List (3.5 cols) */}
        <div
          className={`lg:col-span-4 border-r border-[#E2E8F0] flex flex-col h-full bg-[#F8FAFC] ${
            mobileActiveView === "list" ? "block" : "hidden lg:flex"
          }`}
        >
          {/* Top Search & Client Selector */}
          <div className="p-3 border-b border-[#E2E8F0] space-y-2 bg-white">
            <SearchInput
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              className="text-xs"
            />

            <div className="grid grid-cols-2 gap-2">
              <Select
                label=""
                options={[
                  { label: "All Clients", value: "All" },
                  ...clients.map((c) => ({
                    label: c.businessName,
                    value: c.id,
                  })),
                ]}
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              />

              <Select
                label=""
                options={[
                  { label: "All Streams", value: "All" },
                  { label: "Unread", value: "Unread" },
                  { label: "AI Active", value: "AI Active" },
                  { label: "Human Active", value: "Human" },
                  { label: "Needs Attention", value: "Needs Attention" },
                  { label: "Closed", value: "Closed" },
                ]}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === currentConv?.id;
              const intentCfg = LEAD_INTENT_LABELS[conv.intent] || { label: conv.intent, badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" };

              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setSelectedConvId(conv.id);
                    setMobileActiveView("chat");
                  }}
                  className={`w-full text-left p-3.5 transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-white border-l-4 border-l-[#2563EB] shadow-xs"
                      : "hover:bg-[#F1F5F9] border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <div className="flex items-center gap-1.5 truncate">
                      {getChannelIcon(conv.channel)}
                      <span className="font-bold text-xs text-[#0F172A] truncate">
                        {conv.leadName}
                      </span>
                    </div>

                    <span className="text-[10px] text-[#94A3B8] flex-shrink-0">
                      {conv.lastMessageAt}
                    </span>
                  </div>

                  {/* Client & Intent line */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <span className="truncate max-w-[130px] font-medium text-[#475569]">
                      {conv.clientName}
                    </span>
                    <span>·</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${intentCfg.badge}`}>
                      {intentCfg.label}
                    </span>
                  </div>

                  {/* Message snippet */}
                  <p className="text-[11px] text-[#64748B] line-clamp-1 leading-snug">
                    {conv.lastMessageSnippet}
                  </p>

                  {/* Badges footer */}
                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <div className="flex items-center gap-1">
                      {conv.aiMode === "autonomous" ? (
                        <span className="px-1.5 py-0.2 rounded bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE] font-semibold flex items-center gap-0.5">
                          <RiSparkling2Fill className="h-2.5 w-2.5" />
                          AI Active
                        </span>
                      ) : conv.aiMode === "human_takeover" ? (
                        <span className="px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] font-semibold flex items-center gap-0.5">
                          <RiUserVoiceLine className="h-2.5 w-2.5" />
                          Human Active
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] font-semibold">
                          Paused
                        </span>
                      )}

                      {conv.status === "Needs Attention" && (
                        <span className="px-1.5 py-0.2 rounded bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] font-bold">
                          Handoff
                        </span>
                      )}
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="h-4 w-4 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-[9px]">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-xs text-[#94A3B8]">
                No matching conversations.
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2: Chat Conversation Thread (5 cols) */}
        <div
          className={`lg:col-span-5 flex flex-col h-full bg-white ${
            mobileActiveView === "chat" ? "block" : "hidden lg:flex"
          }`}
        >
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                  {getChannelIcon(currentConv.channel)}
                  <span>{currentConv.leadName}</span>
                </h3>

                <span className="text-[10px] font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-0.5 rounded-full">
                  {currentConv.channel} · Simulated
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Client: <strong className="text-[#0F172A]">{currentConv.clientName}</strong>
              </p>
            </div>

            {/* Mode Toggle Controls */}
            <div className="flex items-center gap-1.5">
              {currentConv.aiMode === "autonomous" ? (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<RiUserVoiceLine className="h-3.5 w-3.5 text-[#2563EB]" />}
                  onClick={() => toggleAiMode(currentConv.id, "human_takeover")}
                >
                  Take Over
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />}
                  onClick={() => toggleAiMode(currentConv.id, "autonomous")}
                >
                  Return to AI
                </Button>
              )}

              <Button
                size="sm"
                variant="secondary"
                onClick={() => closeConversation(currentConv.id)}
              >
                Close
              </Button>
            </div>
          </div>

          {/* AI Extracted Info Banner (Human Oversight) */}
          {currentConv.extractedInfo && currentConv.extractedInfo.reviewStatus === "pending" && (
            <div className="p-3 bg-[#FAF5FF] border-b border-[#DDD6FE] space-y-1.5 text-xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#6D28D9] flex items-center gap-1">
                  <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  AI Extracted Lead Information ({currentConv.extractedInfo.confidence} Confidence)
                </span>
                <span className="text-[10px] text-[#7C3AED] bg-white px-2 py-0.5 rounded-full border border-[#DDD6FE]">
                  Pending Human Review
                </span>
              </div>
              <div className="text-[11px] text-[#475569] grid grid-cols-2 gap-1.5 bg-white p-2 rounded-lg border border-[#E9D5FF]">
                <div>Name: <strong>{currentConv.extractedInfo.name || "Unknown"}</strong></div>
                <div>Phone: <strong>{currentConv.extractedInfo.phone || "Unknown"}</strong></div>
                <div>Service: <strong>{currentConv.extractedInfo.requestedService || "General"}</strong></div>
                <div>Date: <strong>{currentConv.extractedInfo.preferredDate || "None"}</strong></div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[11px] py-1 h-7"
                    leftIcon={<RiCheckLine className="h-3 w-3" />}
                    onClick={() => reviewExtractedInfo(currentConv.id, "accept")}
                  >
                    Accept Details
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-[11px] py-1 h-7"
                    onClick={() => reviewExtractedInfo(currentConv.id, "ignore")}
                  >
                    Ignore
                  </Button>
                </div>

                {!currentConv.leadId && (
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-[11px] py-1 h-7"
                    leftIcon={<RiUserAddLine className="h-3 w-3" />}
                    onClick={handleCreateLead}
                  >
                    Create Lead
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Objection Detection Banner */}
          {currentConv.detectedObjection && (
            <div className="p-2.5 bg-[#FFFBEB] border-b border-[#FDE68A] text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[#B45309]">
                <RiAlertLine className="h-4 w-4 flex-shrink-0" />
                <span>
                  Objection Spotted: <strong>{currentConv.detectedObjection.category} Concern</strong> — &ldquo;{currentConv.detectedObjection.snippet}&rdquo;
                </span>
              </div>
              <span className="text-[10px] text-[#92400E] font-medium bg-white px-2 py-0.5 rounded border border-[#FDE68A]">
                Human Review Suggested
              </span>
            </div>
          )}

          {/* Human Handoff Banner */}
          {currentConv.handoff && currentConv.handoff.status === "pending" && (
            <div className="p-3 bg-[#FEF2F2] border-b border-[#FECACA] flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#B91C1C] flex items-center gap-1">
                  <RiAlertLine className="h-4 w-4" />
                  Human Handoff Requested
                </span>
                <p className="text-[11px] text-[#991B1B]">{currentConv.handoff.reason}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
                  onClick={() => acceptHumanHandoff(currentConv.id)}
                >
                  Accept Handoff
                </Button>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {currentConv.messages.map((m) => {
              const isLead = m.sender === "lead";
              const isAi = m.sender === "ai";

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isLead ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs space-y-1 shadow-2xs ${
                      isLead
                        ? "bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-xs"
                        : isAi
                        ? "bg-[#FAF5FF] border border-[#DDD6FE] text-[#4C1D95] rounded-tr-xs"
                        : "bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] rounded-tr-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] pb-1 border-b border-black/5">
                      <span className="font-bold flex items-center gap-1">
                        {isAi && <RiSparkling2Fill className="h-3 w-3 text-[#8B5CF6]" />}
                        {isLead ? currentConv.leadName : isAi ? "AI Support Agent" : "Human Agent (You)"}
                      </span>
                      <span className="text-[#94A3B8]">{m.timestamp}</span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canned Quick Prompts Bar */}
          <div className="p-2 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex-shrink-0">
              Simulate:
            </span>
            {cannedInquiries.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => handleSendSimulatedCustomer(q.text)}
                disabled={isSimulatingLead}
                className="text-[11px] px-2 py-1 bg-white hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] rounded-lg text-[#334155] whitespace-nowrap transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Composer */}
          <div className="p-3 border-t border-[#E2E8F0] bg-white space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  currentConv.aiMode === "human_takeover"
                    ? "Type human reply to customer..."
                    : "Type simulated customer message or use prompts above..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (currentConv.aiMode === "human_takeover") {
                      handleSendHumanReply();
                    } else {
                      handleSendSimulatedCustomer(inputText);
                    }
                  }
                }}
                className="flex-1 text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
              />

              {currentConv.aiMode === "human_takeover" ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleSendHumanReply}
                  disabled={!inputText.trim()}
                  leftIcon={<RiSendPlane2Fill className="h-3.5 w-3.5" />}
                >
                  Send
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSendSimulatedCustomer(inputText)}
                  disabled={!inputText.trim() || isSimulatingLead}
                  leftIcon={<RiSendPlane2Fill className="h-3.5 w-3.5" />}
                >
                  Simulate
                </Button>
              )}

              {currentConv.aiMode === "autonomous" && (
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-transparent"
                  onClick={() => triggerAiResponse(currentConv.id)}
                  leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5" />}
                >
                  AI Reply
                </Button>
              )}
            </div>

            {/* Helper Mode Indicators */}
            <div className="flex items-center justify-between text-[10px] text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    currentConv.aiMode === "autonomous"
                      ? "bg-[#8B5CF6] animate-pulse"
                      : "bg-[#2563EB]"
                  }`}
                />
                <span>
                  {currentConv.aiMode === "autonomous"
                    ? "AI Assistant Active — Autonomous Response"
                    : "Human Mode Active — AI Paused"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleAutoCapture(currentConv.id)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                  currentConv.autoCaptureEnabled
                    ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                    : "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]"
                }`}
              >
                Auto-Capture: {currentConv.autoCaptureEnabled ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Lead Profile & Client Dossier (3.5 cols) */}
        <div
          className={`lg:col-span-3 border-l border-[#E2E8F0] p-4 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto space-y-4 ${
            mobileActiveView === "profile" ? "block" : "hidden lg:flex"
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
              Customer Lead Profile
            </span>
            {associatedLead ? (
              <span className="text-[10px] font-bold text-[#047857] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                Registered Lead
              </span>
            ) : (
              <span className="text-[10px] font-bold text-[#B45309] bg-[#FFFBEB] px-2 py-0.5 rounded-full border border-[#FDE68A]">
                Unregistered
              </span>
            )}
          </div>

          {/* Lead Information Card */}
          {associatedLead ? (
            <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#E2E8F0] text-xs shadow-xs">
              <div>
                <Link
                  href={`/leads/${associatedLead.id}`}
                  className="font-bold text-sm text-[#0F172A] hover:text-[#2563EB] transition-colors"
                >
                  {associatedLead.name}
                </Link>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  {associatedLead.phone || associatedLead.email || "No direct phone"}
                </div>
              </div>

              <div className="py-1 border-y border-[#F1F5F9] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Client:</span>
                  <strong className="text-[#0F172A]">{associatedLead.clientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Intent:</span>
                  <span className="font-semibold text-[#2563EB]">{associatedLead.intent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Status:</span>
                  <span className="font-semibold text-[#047857]">{associatedLead.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Est. Value:</span>
                  <strong className="text-[#0F172A]">{formatCurrency(associatedLead.estimatedValue)}</strong>
                </div>
              </div>

              {/* Qualification score */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#64748B]">Qualification:</span>
                  <strong>{associatedLead.score}%</strong>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full"
                    style={{ width: `${Math.min(100, associatedLead.score)}%` }}
                  />
                </div>
              </div>

              <Link href={`/leads/${associatedLead.id}`} className="block pt-1">
                <Button size="sm" variant="outline" className="w-full" rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}>
                  Open Full Lead Dossier
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] text-xs space-y-3 text-center">
              <div className="h-10 w-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center mx-auto">
                <RiUserAddLine className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-[#0F172A]">Potential Lead Detected</div>
                <p className="text-[11px] text-[#64748B]">
                  Convert this inbound visitor inquiry into a formal CRM customer lead for {currentConv.clientName}.
                </p>
              </div>

              <Button
                size="sm"
                variant="primary"
                className="w-full"
                onClick={handleCreateLead}
                leftIcon={<RiCheckLine className="h-4 w-4" />}
              >
                Create Lead
              </Button>
            </div>
          )}

          {/* Client Details Box */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] text-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
              Client Business
            </span>
            <div className="font-bold text-[#0F172A]">{currentConv.clientName}</div>
            <div className="text-[11px] text-[#64748B]">
              Active Channels: {currentConv.channel}
            </div>
            <Link href="/clients" className="text-[11px] text-[#2563EB] hover:underline font-semibold block pt-1">
              View Client Account →
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
