"use client";

import React, { useState } from "react";
import { ChannelType } from "@/lib/channels/types";
import { useLeads } from "@/lib/store/leads-store";
import { useChannels } from "@/lib/store/channels-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import {
  RiCloseLine,
  RiAddLine,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
} from "react-icons/ri";

interface AddChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddChannelModal({ isOpen, onClose }: AddChannelModalProps) {
  const { clients } = useLeads();
  const { addChannel } = useChannels();
  const { addToast } = useToast();

  const [selectedClient, setSelectedClient] = useState(clients[0]?.id || "");
  const [channelType, setChannelType] = useState<ChannelType>("whatsapp");
  const [accountName, setAccountName] = useState("");
  const [accountIdentifier, setAccountIdentifier] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClient);
    if (!client) return;

    const defaultNames: Record<ChannelType, string> = {
      website: "Website Live Chat Widget",
      instagram: "Instagram Direct Messaging",
      facebook: "Facebook Messenger",
      whatsapp: "WhatsApp Business Line",
      email: "Client Inbound Email Relay",
      phone: "Phone Call Logging",
      manual: "Manual Desk Intake",
    };

    addChannel({
      clientId: client.id,
      clientName: client.businessName,
      type: channelType,
      name: accountName.trim() || defaultNames[channelType],
      accountName: accountName.trim() || client.businessName,
      accountIdentifier: accountIdentifier.trim() || `demo_${channelType}_${Date.now()}`,
      status: "MOCK",
    });

    addToast({
      title: "Channel Added",
      description: `${defaultNames[channelType]} configured for ${client.businessName} in Simulation Mode.`,
      variant: "success",
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Add Communication Channel</h3>
            <p className="text-xs text-[#64748B]">Connect a simulated channel to a client workspace</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
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

          <div>
            <label className="block font-semibold text-[#0F172A] mb-1.5">Channel Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: "whatsapp", label: "WhatsApp", icon: RiWhatsappLine, color: "text-[#10B981]" },
                { type: "instagram", label: "Instagram", icon: RiInstagramLine, color: "text-[#E1306C]" },
                { type: "website", label: "Website Chat", icon: RiGlobalLine, color: "text-[#2563EB]" },
                { type: "email", label: "Email Relay", icon: RiMailLine, color: "text-[#64748B]" },
                { type: "facebook", label: "Facebook", icon: RiFacebookCircleLine, color: "text-[#1877F2]" },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = channelType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setChannelType(item.type as ChannelType)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left font-medium transition-all ${
                      isSelected
                        ? "bg-[#EFF6FF] border-[#2563EB] text-[#1E3A8A] shadow-xs"
                        : "bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#0F172A] mb-1">Channel Label / Display Name</label>
            <input
              type="text"
              placeholder="e.g. VIP Concierge Line or Admissions Desk"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#0F172A] mb-1">
              Account Identifier (Handle, Phone, or URL)
            </label>
            <input
              type="text"
              placeholder="e.g. @client_brand or +91 98000 12345"
              value={accountIdentifier}
              onChange={(e) => setAccountIdentifier(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#F1F5F9]">
            <Button size="sm" variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" leftIcon={<RiAddLine className="h-4 w-4" />}>
              Add Channel (Simulation Mode)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
