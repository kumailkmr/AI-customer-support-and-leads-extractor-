"use client";

import React, { useState } from "react";
import { ChannelType } from "@/lib/channels/types";
import { useLeads } from "@/lib/store/leads-store";
import { useChannels } from "@/lib/store/channels-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import {
  RiCloseLine,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiSparkling2Fill,
  RiShieldCheckLine,
  RiErrorWarningLine,
} from "react-icons/ri";

interface EventSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChannel?: ChannelType;
  defaultConversationId?: string;
  defaultClientId?: string;
}

export function EventSimulatorModal({
  isOpen,
  onClose,
  defaultChannel = "whatsapp",
  defaultConversationId,
  defaultClientId,
}: EventSimulatorModalProps) {
  const { clients, conversations } = useLeads();
  const { simulateInboundMessage } = useChannels();
  const { addToast } = useToast();

  const [channelType, setChannelType] = useState<ChannelType>(defaultChannel);
  const [selectedClient, setSelectedClient] = useState<string>(
    defaultClientId || clients[0]?.id || ""
  );
  const [selectedConv, setSelectedConv] = useState<string>(
    defaultConversationId || ""
  );
  const [customerName, setCustomerName] = useState("Ayaan Khan");
  const [customerIdentifier, setCustomerIdentifier] = useState("+91 98765 43210");
  const [messageText, setMessageText] = useState(
    "Hi, I want to confirm our presidential suite reservation for this weekend."
  );
  const [customerEmail, setCustomerEmail] = useState("ayaan@example.com");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [customEventId, setCustomEventId] = useState("");
  const [shouldFail, setShouldFail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Preset Configurations for Quick Testing
  const handleApplyPreset = (preset: "ayaan_wa" | "sarah_ig" | "rahul_web" | "dup_test" | "fail_test") => {
    if (preset === "ayaan_wa") {
      setChannelType("whatsapp");
      setCustomerName("Ayaan Khan");
      setCustomerIdentifier("+91 98765 43210");
      setCustomerEmail("ayaan@example.com");
      setCustomerPhone("+91 98765 43210");
      setMessageText("Hi Bilal, can you share the booking confirmation voucher for the Presidential Suite?");
      setCustomEventId("");
      setShouldFail(false);
    } else if (preset === "sarah_ig") {
      setChannelType("instagram");
      setCustomerName("Sarah Johnson");
      setCustomerIdentifier("@sarahj_travels");
      setCustomerEmail("sarah.j@travelers.example.com");
      setMessageText("Could you please send the jacuzzi cottage photos and pricing?");
      setCustomEventId("");
      setShouldFail(false);
    } else if (preset === "rahul_web") {
      setChannelType("website");
      setCustomerName("Rahul Sharma");
      setCustomerIdentifier("sess_rahul_99120");
      setCustomerEmail("rahul.sharma@familymail.example.com");
      setCustomerPhone("+91 98765 43210");
      setMessageText("What documents are required for Grade 8 CBSE admission transfer?");
      setCustomEventId("");
      setShouldFail(false);
    } else if (preset === "dup_test") {
      setChannelType("whatsapp");
      setCustomerName("Ayaan Khan");
      setCustomerIdentifier("+91 98765 43210");
      setMessageText("I want to confirm the presidential suite booking for this weekend.");
      setCustomEventId("wamid_demo_99210_evt"); // Matches existing event #1!
      setShouldFail(false);
    } else if (preset === "fail_test") {
      setChannelType("instagram");
      setCustomerName("Test Error Lead");
      setCustomerIdentifier("@test_error_user");
      setMessageText("Simulating webhook processing error for retry validation.");
      setCustomEventId(`err_evt_${Date.now()}`);
      setShouldFail(true);
    }
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSubmitting(true);
    const result = await simulateInboundMessage({
      clientId: selectedClient,
      channelType,
      customerName,
      customerIdentifier,
      messageText,
      customerEmail: customerEmail.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      conversationId: selectedConv || undefined,
      externalEventId: customEventId.trim() || undefined,
      shouldFail,
    });
    setIsSubmitting(false);

    if (result.duplicate) {
      addToast({
        title: "Duplicate Event Ignored (Idempotency Active)",
        description: `External event ID "${result.event.externalEventId}" was already processed. No duplicate message created.`,
        variant: "warning",
      });
    } else if (!result.success) {
      addToast({
        title: "Simulated Webhook Failure",
        description: `Event marked FAILED: "${result.error}". Check Event Log to test retry.`,
        variant: "danger",
      });
    } else {
      addToast({
        title: "Inbound Message Simulated",
        description: `Message delivered via ${channelType.toUpperCase()} adapter into inbox!`,
        variant: "success",
      });
    }

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#DDD6FE]">
              <RiSparkling2Fill className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">Simulate Inbound Event</h3>
                <span className="text-[10px] font-bold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-0.5 rounded-full">
                  SIMULATION MODE
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Inject simulated webhook events across adapters to test normalization &amp; routing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="font-bold text-[#64748B] uppercase tracking-wider shrink-0 text-[10px]">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset("ayaan_wa")}
            className="px-2 py-1 bg-white hover:bg-[#ECFDF5] border border-[#E2E8F0] hover:border-[#A7F3D0] rounded-lg text-[#047857] shrink-0 font-medium"
          >
            WhatsApp (Ayaan Khan)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("sarah_ig")}
            className="px-2 py-1 bg-white hover:bg-[#FDF2F8] border border-[#E2E8F0] hover:border-[#FBCFE8] rounded-lg text-[#BE185D] shrink-0 font-medium"
          >
            Instagram DM (Sarah)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("rahul_web")}
            className="px-2 py-1 bg-white hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] rounded-lg text-[#1E40AF] shrink-0 font-medium"
          >
            Website Chat (Rahul)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("dup_test")}
            className="px-2 py-1 bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] rounded-lg shrink-0 font-semibold"
          >
            Test Duplicate (Idempotency)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("fail_test")}
            className="px-2 py-1 bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] text-[#B91C1C] rounded-lg shrink-0 font-semibold"
          >
            Simulate Failure
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSimulate} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Target Client */}
          <div>
            <label className="block font-semibold text-[#0F172A] mb-1">Target Client Business</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName} ({c.industry})
                </option>
              ))}
            </select>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block font-semibold text-[#0F172A] mb-1">Inbound Channel</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { type: "whatsapp", label: "WhatsApp", icon: RiWhatsappLine, color: "text-[#10B981]" },
                { type: "instagram", label: "Instagram", icon: RiInstagramLine, color: "text-[#E1306C]" },
                { type: "website", label: "Website", icon: RiGlobalLine, color: "text-[#2563EB]" },
                { type: "facebook", label: "Facebook", icon: RiFacebookCircleLine, color: "text-[#1877F2]" },
                { type: "email", label: "Email", icon: RiMailLine, color: "text-[#64748B]" },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = channelType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setChannelType(item.type as ChannelType)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "bg-[#EFF6FF] border-[#2563EB] text-[#1E3A8A] font-bold shadow-xs"
                        : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 mb-0.5 ${item.color}`} />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">Customer / Visitor Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">
                Identifier (Handle / Phone / Session)
              </label>
              <input
                type="text"
                value={customerIdentifier}
                onChange={(e) => setCustomerIdentifier(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">Optional Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">Optional Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Inbound Message */}
          <div>
            <label className="block font-semibold text-[#0F172A] mb-1">Inbound Message Content</label>
            <textarea
              rows={3}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              required
              className="w-full text-xs p-3 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB] leading-relaxed resize-none"
            />
          </div>

          {/* Advanced Test Parameters: Idempotency & Failure Simulation */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              Architectural Test Settings
            </span>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1 flex items-center justify-between">
                <span>Custom External Event ID (Idempotency Key Testing)</span>
                {customEventId && <span className="text-[10px] text-[#2563EB]">Manual Key Active</span>}
              </label>
              <input
                type="text"
                placeholder="Leave blank to auto-generate unique ID"
                value={customEventId}
                onChange={(e) => setCustomEventId(e.target.value)}
                className="w-full text-xs px-3 py-1.5 border border-[#CBD5E1] rounded-lg font-mono text-[11px]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">
                Reuse an existing event ID (e.g. <code>wamid_demo_99210_evt</code>) to verify &quot;Duplicate event ignored&quot;.
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-semibold text-[#0F172A] block">Simulate Adapter Failure</span>
                <span className="text-[10px] text-[#64748B]">
                  Marks event as FAILED to test retry error flow in Event Log.
                </span>
              </div>
              <input
                type="checkbox"
                checked={shouldFail}
                onChange={(e) => setShouldFail(e.target.checked)}
                className="h-4 w-4 rounded text-[#EF4444] border-[#CBD5E1] focus:ring-[#EF4444]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F1F5F9]">
            <Button size="sm" variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              disabled={isSubmitting || !messageText.trim()}
              leftIcon={<RiSparkling2Fill className="h-4 w-4" />}
            >
              {isSubmitting ? "Processing Pipeline..." : "Simulate Incoming Message"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
