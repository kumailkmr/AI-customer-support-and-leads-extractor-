"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { useToast } from "@/components/ui/Toast";
import { useLeads } from "@/lib/store/leads-store";
import { useChannels } from "@/lib/store/channels-store";
import { ClientLeadChannel } from "@/types/leads";
import { LEAD_INTENT_LABELS } from "@/lib/leads/leads-config";
import { formatCurrency } from "@/lib/utils";
import { EventSimulatorModal } from "@/components/channels/EventSimulatorModal";

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
  RiCheckDoubleLine,
  RiArrowRightLine,
  RiAlertLine,
  RiAttachment2,
  RiEmotionLine,
  RiSettings4Line,
  RiCheckDoubleFill,
  RiTimeLine,
  RiInformationLine,
  RiShieldCheckLine,
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

  const { addToast } = useToast();

  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ""
  );
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("All");
  const [selectedClientId, setSelectedClientId] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [isSimulatingLead, setIsSimulatingLead] = useState(false);
  const [isSendingOutbound, setIsSendingOutbound] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<"list" | "chat" | "profile">("chat");
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  // Filtering conversations list across multi-channel criteria
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

      // Channel Filter
      let matchesChannel = true;
      if (selectedChannelFilter !== "All") {
        if (selectedChannelFilter === "Website") matchesChannel = c.channel === "Website Chat";
        else matchesChannel = c.channel === selectedChannelFilter;
      }

      // Status Filter
      let matchesStatus = true;
      if (statusFilter === "Unread") matchesStatus = c.unreadCount > 0;
      else if (statusFilter === "AI Handling") matchesStatus = c.aiMode === "autonomous";
      else if (statusFilter === "Human Handling") matchesStatus = c.aiMode === "human_takeover";
      else if (statusFilter === "Waiting") matchesStatus = c.status === "Needs Attention";
      else if (statusFilter === "Resolved") matchesStatus = c.status === "Closed";

      // Lead Status Filter
      let matchesLeadStatus = true;
      if (leadStatusFilter !== "All" && c.leadId) {
        const lead = leads.find((l) => l.id === c.leadId);
        matchesLeadStatus = lead?.status === leadStatusFilter;
      }

      return matchesSearch && matchesClient && matchesChannel && matchesStatus && matchesLeadStatus;
    });
  }, [conversations, search, selectedClientId, selectedChannelFilter, statusFilter, leadStatusFilter, leads]);

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
        return <RiPhoneLine className="h-3.5 w-3.5 text-[#F59E0B]" />;
      default:
        return <RiGlobalLine className="h-3.5 w-3.5 text-[#2563EB]" />;
    }
  };

  // Quick canned customer test inquiries
  const cannedInquiries = [
    { label: "Ask Pricing", text: "How much do your services cost and what packages are available?" },
    { label: "Book Slot", text: "I would like to book an appointment for tomorrow afternoon." },
    { label: "Budget Objection", text: "That is quite expensive. Do you have any discounts or basic tiers?" },
    { label: "Provide Phone", text: "Sure, my phone number is +91 98765 43210 and email is rahul@example.com." },
    { label: "Request Human", text: "Can I please speak to an actual manager or specialist directly?" },
  ];

  const handleSendSimulatedCustomer = async (msg: string) => {
    if (!msg.trim() || !currentConv) return;
    setIsSimulatingLead(true);
    setInputText("");
    await sendSimulatedCustomerMessage(currentConv.id, msg);
    setIsSimulatingLead(false);
  };

  const handleSendHumanReply = async () => {
    if (!inputText.trim() || !currentConv) return;
    const textToSend = inputText;
    setInputText("");
    setIsSendingOutbound(true);

    // Simulate outbound delivery lifecycle: SENDING -> SENT -> DELIVERED
    sendHumanReply(currentConv.id, textToSend);

    setTimeout(() => {
      setIsSendingOutbound(false);
      addToast({
        title: "Message Delivered",
        description: `Delivered to customer via ${currentConv.channel} adapter (Simulation Mode).`,
        variant: "success",
      });
    }, 600);
  };

  const handleCreateLead = () => {
    if (!currentConv) return;
    const newLead = createLeadFromConversation(currentConv.id);
    addToast({
      title: "Lead Created",
      description: `${newLead.name} successfully registered in CRM for ${currentConv.clientName}.`,
      variant: "success",
    });
  };

  const handleAttachSimulatedFile = () => {
    addToast({
      title: "Attachment Ready (Simulation)",
      description: "Attached 'Brochure_2026.pdf' ready to dispatch via simulated adapter.",
      variant: "neutral",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-6rem)] -mt-2 -mx-4 lg:-mx-6 -mb-6 bg-white overflow-hidden">
        {/* Top Omnichannel Header & Filter Strip */}
        <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-[#0F172A]">Unified Omnichannel Inbox</h1>
                <span className="text-[10px] font-bold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <RiSparkling2Fill className="h-3 w-3" />
                  SIMULATION MODE
                </span>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Ingesting website chat, Instagram DMs, WhatsApp, Messenger, and Email into unified customer threads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings/channels">
              <Button size="sm" variant="outline" leftIcon={<RiSettings4Line className="h-3.5 w-3.5" />}>
                Manage Channels
              </Button>
            </Link>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsSimulatorOpen(true)}
              leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5" />}
            >
              Simulate Inbound Event
            </Button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="lg:hidden flex border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs">
          <button
            type="button"
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
              mobileActiveView === "list"
                ? "border-[#2563EB] text-[#2563EB] bg-white"
                : "border-transparent text-[#64748B]"
            }`}
            onClick={() => setMobileActiveView("list")}
          >
            Conversations ({filteredConversations.length})
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
              mobileActiveView === "chat"
                ? "border-[#2563EB] text-[#2563EB] bg-white"
                : "border-transparent text-[#64748B]"
            }`}
            onClick={() => setMobileActiveView("chat")}
          >
            Chat Thread
          </button>
          <button
            type="button"
            className={`flex-1 py-2 font-semibold text-center border-b-2 transition-colors ${
              mobileActiveView === "profile"
                ? "border-[#2563EB] text-[#2563EB] bg-white"
                : "border-transparent text-[#64748B]"
            }`}
            onClick={() => setMobileActiveView("profile")}
          >
            Customer Dossier
          </button>
        </div>

        {/* 3-COLUMN INBOX LAYOUT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* =========================================================================
              COLUMN 1: Omnichannel Filters & Conversation List (3.5 cols)
              ========================================================================= */}
          <div
            className={`lg:col-span-4 border-r border-[#E2E8F0] flex flex-col h-full bg-white overflow-hidden ${
              mobileActiveView === "list" ? "block" : "hidden lg:flex"
            }`}
          >
            {/* Search & Client Filter */}
            <div className="p-3 border-b border-[#E2E8F0] space-y-2 bg-[#F8FAFC]">
              <SearchInput
                placeholder="Search conversations, names, or messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full text-[11px] px-2 py-1.5 border border-[#CBD5E1] rounded-lg bg-white text-[#0F172A] font-medium focus:outline-hidden"
                >
                  <option value="All">All Clients ({clients.length})</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.businessName}
                    </option>
                  ))}
                </select>

                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="w-full text-[11px] px-2 py-1.5 border border-[#CBD5E1] rounded-lg bg-white text-[#0F172A] font-medium focus:outline-hidden"
                >
                  <option value="All">All Lead Statuses</option>
                  <option value="NEW">New</option>
                  <option value="QUALIFYING">Qualifying</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="FOLLOW_UP">Follow-Up</option>
                  <option value="HUMAN_HANDOFF">Human Handoff</option>
                  <option value="CONVERTED">Converted</option>
                </select>
              </div>

              {/* Channel Selector Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 pt-1 text-[11px]">
                {[
                  { id: "All", label: "All Channels" },
                  { id: "Website", label: "Web", icon: RiGlobalLine },
                  { id: "Instagram", label: "IG", icon: RiInstagramLine },
                  { id: "Facebook", label: "FB", icon: RiFacebookCircleLine },
                  { id: "WhatsApp", label: "WA", icon: RiWhatsappLine },
                  { id: "Email", label: "Email", icon: RiMailLine },
                ].map((item) => {
                  const isSelected = selectedChannelFilter === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedChannelFilter(item.id)}
                      className={`px-2 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : "bg-white text-[#64748B] border-[#CBD5E1] hover:bg-[#F1F5F9]"
                      }`}
                    >
                      {Icon && <Icon className="h-3 w-3" />}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {["All", "Unread", "AI Handling", "Human Handling", "Waiting", "Resolved"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? "bg-[#0F172A] text-white"
                        : "text-[#64748B] hover:text-[#0F172A] bg-transparent"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B] space-y-2">
                  <p>No conversations match your filters.</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedChannelFilter("All");
                      setStatusFilter("All");
                      setSelectedClientId("All");
                      setSearch("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === currentConv?.id;
                  const lead = leads.find((l) => l.id === conv.leadId);

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setSelectedConvId(conv.id);
                        setMobileActiveView("chat");
                      }}
                      className={`p-3 cursor-pointer transition-all border-l-4 ${
                        isSelected
                          ? "bg-[#EFF6FF] border-l-[#2563EB]"
                          : "hover:bg-[#F8FAFC] border-l-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {/* Avatar with Channel Icon Badge */}
                          <div className="relative">
                            <div className="h-8 w-8 rounded-full bg-[#E2E8F0] text-[#0F172A] font-bold text-xs flex items-center justify-center">
                              {conv.leadName.charAt(0)}
                            </div>
                            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white border border-[#E2E8F0] shadow-2xs">
                              {getChannelIcon(conv.channel)}
                            </span>
                          </div>

                          <div className="leading-tight">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#0F172A] truncate max-w-[130px]">
                                {conv.leadName}
                              </span>
                              {conv.unreadCount > 0 && (
                                <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                              )}
                            </div>
                            <span className="text-[10px] text-[#64748B] truncate max-w-[140px] block">
                              {conv.clientName}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                          {conv.lastMessageAt}
                        </span>
                      </div>

                      {/* Last Message Snippet */}
                      <p className="text-xs text-[#475569] line-clamp-1 mt-1.5 pl-10">
                        {conv.lastMessageSnippet}
                      </p>

                      {/* Badges row */}
                      <div className="flex items-center justify-between gap-1 mt-2 pl-10">
                        <span className="text-[10px] font-semibold text-[#64748B] flex items-center gap-1">
                          {getChannelIcon(conv.channel)}
                          <span>{conv.channel}</span>
                        </span>

                        <div className="flex items-center gap-1">
                          {conv.aiMode === "autonomous" ? (
                            <span className="text-[9px] font-bold text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <RiSparkling2Fill className="h-2.5 w-2.5" />
                              AI
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                              <RiUserVoiceLine className="h-2.5 w-2.5" />
                              Human
                            </span>
                          )}

                          {lead && (
                            <span className="text-[9px] font-bold text-[#047857] bg-[#ECFDF5] border border-[#A7F3D0] px-1.5 py-0.2 rounded">
                              {lead.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* =========================================================================
              COLUMN 2: Live Conversation & Message Composer (5 cols)
              ========================================================================= */}
          <div
            className={`lg:col-span-5 flex flex-col h-full bg-white overflow-hidden ${
              mobileActiveView === "chat" ? "block" : "hidden lg:flex"
            }`}
          >
            {currentConv ? (
              <>
                {/* Conversation Header */}
                <div className="px-4 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] font-bold text-sm flex items-center justify-center">
                        {currentConv.leadName.charAt(0)}
                      </div>
                      <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white border border-[#E2E8F0]">
                        {getChannelIcon(currentConv.channel)}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-[#0F172A]">{currentConv.leadName}</h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] flex items-center gap-1">
                          {getChannelIcon(currentConv.channel)}
                          {currentConv.channel}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                        <span>{currentConv.clientName}</span>
                        {currentConv.channelHandle && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-[#2563EB]">
                              {currentConv.channelHandle}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions / AI Mode Switch */}
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-[#E2E8F0] p-0.5 bg-[#F8FAFC]">
                      <button
                        type="button"
                        onClick={() => toggleAiMode(currentConv.id, "autonomous")}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                          currentConv.aiMode === "autonomous"
                            ? "bg-[#8B5CF6] text-white shadow-2xs"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <RiSparkling2Fill className="h-3 w-3" />
                        AI Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAiMode(currentConv.id, "human_takeover")}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                          currentConv.aiMode === "human_takeover"
                            ? "bg-[#2563EB] text-white shadow-2xs"
                            : "text-[#64748B] hover:text-[#0F172A]"
                        }`}
                      >
                        <RiUserVoiceLine className="h-3 w-3" />
                        Human Takeover
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => closeConversation(currentConv.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                        currentConv.status === "Closed"
                          ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                          : "bg-white text-[#64748B] hover:bg-[#F1F5F9] border-[#CBD5E1]"
                      }`}
                    >
                      {currentConv.status === "Closed" ? "Resolved" : "Resolve"}
                    </button>
                  </div>
                </div>

                {/* Information Review Banner (if extracted info needs review) */}
                {currentConv.extractedInfo && currentConv.extractedInfo.reviewStatus === "pending" && (
                  <div className="p-3 bg-[#EFF6FF] border-b border-[#BFDBFE] flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#1E40AF] flex items-center gap-1">
                        <RiSparkling2Fill className="h-3.5 w-3.5 text-[#2563EB]" />
                        Customer Information Extracted by AI Assistant
                      </span>
                      <p className="text-[11px] text-[#1E3A8A]">
                        Name: <strong>{currentConv.extractedInfo.name || "N/A"}</strong> • Phone:{" "}
                        <strong>{currentConv.extractedInfo.phone || "N/A"}</strong> • Email:{" "}
                        <strong>{currentConv.extractedInfo.email || "N/A"}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => reviewExtractedInfo(currentConv.id, "accept")}
                        className="px-2.5 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                      >
                        Verify &amp; Update
                      </button>
                      <button
                        type="button"
                        onClick={() => reviewExtractedInfo(currentConv.id, "ignore")}
                        className="px-2 py-1 text-[#64748B] hover:text-[#0F172A] text-xs font-medium"
                      >
                        Dismiss
                      </button>
                    </div>
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
                    <Button
                      size="sm"
                      variant="primary"
                      className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
                      onClick={() => acceptHumanHandoff(currentConv.id)}
                    >
                      Accept Takeover
                    </Button>
                  </div>
                )}

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]">
                  {/* Channel Banner Indicator */}
                  <div className="text-center my-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#64748B] bg-white border border-[#E2E8F0] px-3 py-1 rounded-full shadow-2xs">
                      {getChannelIcon(currentConv.channel)}
                      <span>Unified thread on {currentConv.channel} • Simulation Mode</span>
                    </span>
                  </div>

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
                          {/* Message Header */}
                          <div className="flex items-center justify-between gap-3 text-[10px] pb-1 border-b border-black/5">
                            <span className="font-bold flex items-center gap-1">
                              {isAi && <RiSparkling2Fill className="h-3 w-3 text-[#8B5CF6]" />}
                              {isLead
                                ? currentConv.leadName
                                : isAi
                                ? "AI Support Agent"
                                : "Human Agent (You)"}
                            </span>
                            <span className="text-[#94A3B8]">{m.timestamp}</span>
                          </div>

                          {/* Email metadata header if email channel */}
                          {currentConv.channel === "Email" && isLead && (
                            <div className="bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0] text-[10px] text-[#64748B] space-y-0.5">
                              <div>From: {currentConv.leadContact || "customer@example.com"}</div>
                              <div>To: support@{currentConv.clientId}.nexusai.io</div>
                            </div>
                          )}

                          {/* Message Body */}
                          <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                          {/* Delivery status indicator for outbound messages */}
                          {!isLead && (
                            <div className="flex items-center justify-end gap-1 text-[10px] pt-0.5 text-[#64748B]">
                              <span>Delivered</span>
                              <RiCheckDoubleFill className="h-3 w-3 text-[#10B981]" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Simulation Prompts Bar */}
                <div className="p-2 border-t border-[#F1F5F9] bg-[#F8FAFC] flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider shrink-0">
                    Simulate:
                  </span>
                  {cannedInquiries.map((q) => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => handleSendSimulatedCustomer(q.text)}
                      disabled={isSimulatingLead}
                      className="text-[11px] px-2 py-1 bg-white hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] rounded-lg text-[#334155] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>

                {/* Upgraded Omnichannel Message Composer */}
                <div className="p-3 border-t border-[#E2E8F0] bg-white space-y-2">
                  {/* Channel Notification Tag */}
                  <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                    <div className="flex items-center gap-1">
                      {getChannelIcon(currentConv.channel)}
                      <span className="font-medium">
                        Sending via {currentConv.channel} — Simulation Mode
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handleAttachSimulatedFile}
                        className="p-1 text-[#64748B] hover:text-[#0F172A] rounded hover:bg-[#F1F5F9]"
                        title="Attach simulated file"
                      >
                        <RiAttachment2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1 text-[#64748B] hover:text-[#0F172A] rounded hover:bg-[#F1F5F9]"
                        title="Emoji tray"
                      >
                        <RiEmotionLine className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Emoji Quick Tray */}
                  {showEmojiPicker && (
                    <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-1.5 text-sm">
                      {["👍", "✅", "👋", "🎉", "📅", "📍", "🤝", "⭐"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setInputText((prev) => prev + emoji);
                            setShowEmojiPicker(false);
                          }}
                          className="hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Text Input Row */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={
                        currentConv.aiMode === "human_takeover"
                          ? `Reply to ${currentConv.leadName} via ${currentConv.channel}...`
                          : "Type message or use prompts above..."
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
                        disabled={!inputText.trim() || isSendingOutbound}
                        leftIcon={<RiSendPlane2Fill className="h-3.5 w-3.5" />}
                      >
                        {isSendingOutbound ? "Sending..." : "Send"}
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
                          ? "AI Autonomous Mode — Responding automatically"
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
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-[#64748B]">
                Select a conversation from the left to view messages.
              </div>
            )}
          </div>

          {/* =========================================================================
              COLUMN 3: Customer Lead Dossier & Cross-Channel Identities (3.5 cols)
              ========================================================================= */}
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

            {/* Lead Card */}
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

                {/* Qualification Score Progress */}
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
                    Convert this inbound inquiry into a formal CRM customer lead for {currentConv?.clientName}.
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

            {/* Client Business Affiliation Card */}
            {currentConv && (
              <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] text-xs space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Client Business
                </span>
                <div className="font-bold text-[#0F172A]">{currentConv.clientName}</div>
                <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                  <span>Channel:</span>
                  <strong className="text-[#0F172A]">{currentConv.channel}</strong>
                </div>
                <Link
                  href={`/clients/${currentConv.clientId}`}
                  className="text-[11px] text-[#2563EB] hover:underline font-semibold block pt-1"
                >
                  View Client Workspace →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulator Modal */}
      <EventSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        defaultChannel={
          currentConv?.channel === "Instagram"
            ? "instagram"
            : currentConv?.channel === "WhatsApp"
            ? "whatsapp"
            : currentConv?.channel === "Website Chat"
            ? "website"
            : currentConv?.channel === "Email"
            ? "email"
            : "facebook"
        }
        defaultConversationId={currentConv?.id}
        defaultClientId={currentConv?.clientId}
      />
    </AppLayout>
  );
}
