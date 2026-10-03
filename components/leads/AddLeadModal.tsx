"use client";

import React, { useState } from "react";
import {
  ClientBusiness,
  ClientLead,
  ClientLeadChannel,
  ClientLeadSource,
  ClientLeadIntent,
} from "@/types/leads";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { RiCloseLine, RiUserAddLine, RiCheckLine } from "react-icons/ri";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientBusiness[];
  onCreate: (data: Partial<ClientLead>) => void;
}

export function AddLeadModal({
  isOpen,
  onClose,
  clients,
  onCreate,
}: AddLeadModalProps) {
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState<ClientLeadChannel>("Website Chat");
  const [source, setSource] = useState<ClientLeadSource>("Website");
  const [intent, setIntent] = useState<ClientLeadIntent>("General Inquiry");
  const [estimatedValue, setEstimatedValue] = useState("25000");
  const [tags, setTags] = useState("Customer Inbound");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      clientId: clientId || clients[0]?.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      channel,
      source,
      intent,
      estimatedValue: Number(estimatedValue) || 15000,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
              <RiUserAddLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Add Customer Lead</h3>
              <p className="text-xs text-[#64748B]">Register a customer inquiry for an active client</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Client */}
          <Select
            label="Assigned Client"
            options={clients.map((c) => ({
              label: `${c.businessName} (${c.industry})`,
              value: c.id,
            }))}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />

          {/* Lead Name */}
          <TextInput
            label="Customer Full Name *"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="Contact Phone"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextInput
              label="Contact Email"
              type="email"
              placeholder="rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Channel & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Inbound Channel"
              options={[
                { label: "Website Chat", value: "Website Chat" },
                { label: "Instagram", value: "Instagram" },
                { label: "WhatsApp", value: "WhatsApp" },
                { label: "Facebook", value: "Facebook" },
                { label: "Email", value: "Email" },
                { label: "Phone", value: "Phone" },
                { label: "Manual", value: "Manual" },
              ]}
              value={channel}
              onChange={(e) => setChannel(e.target.value as ClientLeadChannel)}
            />

            <Select
              label="Inbound Source"
              options={[
                { label: "Website", value: "Website" },
                { label: "Instagram", value: "Instagram" },
                { label: "WhatsApp", value: "WhatsApp" },
                { label: "Facebook", value: "Facebook" },
                { label: "Email", value: "Email" },
                { label: "Referral", value: "Referral" },
                { label: "Manual", value: "Manual" },
              ]}
              value={source}
              onChange={(e) => setSource(e.target.value as ClientLeadSource)}
            />
          </div>

          {/* Intent & Estimated Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Buyer Intent"
              options={[
                { label: "Admission", value: "Admission" },
                { label: "Booking", value: "Booking" },
                { label: "Appointment", value: "Appointment" },
                { label: "Pricing Inquiry", value: "Pricing Inquiry" },
                { label: "Service Inquiry", value: "Service Inquiry" },
                { label: "Product Inquiry", value: "Product Inquiry" },
                { label: "Demo Request", value: "Demo Request" },
                { label: "General Inquiry", value: "General Inquiry" },
              ]}
              value={intent}
              onChange={(e) => setIntent(e.target.value as ClientLeadIntent)}
            />

            <TextInput
              label="Estimated Deal Value (₹)"
              type="number"
              placeholder="25000"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
            />
          </div>

          {/* Tags */}
          <TextInput
            label="Tags (comma-separated)"
            placeholder="High Intent, VIP, Inbound"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" leftIcon={<RiCheckLine className="h-4 w-4" />}>
              Create Lead
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
