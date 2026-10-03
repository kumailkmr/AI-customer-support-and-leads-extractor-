"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { StatusBadge } from "@/components/ui/Badge";
import { AIBadge } from "@/components/ui/AIBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterPill } from "@/components/ui/FilterPill";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { mockRecentLeads } from "@/lib/mock-data/leads";
import { Lead } from "@/types";
import {
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
  RiAddLine,
  RiCloseLine,
  RiArrowRightLine,
} from "react-icons/ri";

export default function LeadsPage() {
  const [leadsList, setLeadsList] = useState<Lead[]>(mockRecentLeads);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead form state
  const [newLeadName, setNewLeadName] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("Alpine Grand Hotel (Client)");
  const [newChannel, setNewChannel] = useState<Lead["channel"]>("Instagram");
  const [newInterest, setNewInterest] = useState("");

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      fullName: newLeadName,
      company: newClientCompany,
      role: "Inbound Customer",
      email: `${newLeadName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      channel: newChannel,
      status: "New",
      aiQualificationScore: 85,
      estimatedValue: 2500,
      primaryNeed: newInterest || "General Inquiry",
      lastContactedAt: "Just now",
      aiSummary: "Manually logged lead. AI qualification sequence queued.",
      tags: ["Manual Entry", "Queued"],
    };

    setLeadsList([newLead, ...leadsList]);
    setNewLeadName("");
    setNewInterest("");
    setIsAddModalOpen(false);
  };

  const filtered = leadsList.filter((lead) => {
    const matchesSearch =
      search === "" ||
      lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.primaryNeed.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || lead.status === selectedStatus;

    const matchesChannel =
      selectedChannel === "All" || lead.channel === selectedChannel;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  const getChannelIcon = (ch: Lead["channel"]) => {
    switch (ch) {
      case "Instagram":
        return <RiInstagramLine className="h-3.5 w-3.5 text-[#E1306C]" />;
      case "WhatsApp":
        return <RiWhatsappLine className="h-3.5 w-3.5 text-[#10B981]" />;
      case "Facebook":
        return <RiFacebookCircleLine className="h-3.5 w-3.5 text-[#1877F2]" />;
      case "Website":
        return <RiGlobalLine className="h-3.5 w-3.5 text-[#2563EB]" />;
      case "Email":
        return <RiMailLine className="h-3.5 w-3.5 text-[#64748B]" />;
    }
  };

  const counts = {
    total: 248,
    new: 96,
    qualified: 71,
    followup: 54,
    won: 8,
  };

  return (
    <AppLayout>
      <PageHeader
        title="Inbound Client Leads"
        subtitle="End-customer leads captured and qualified across your active client acquisition funnels."
        badge={
          <span className="text-xs font-semibold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Live Client Pipeline
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <AIActionButton label="Auto-Qualify Queue" size="sm" variant="solid" />
            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiAddLine className="h-3.5 w-3.5" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Top Distinction Banner */}
      <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
          <span>
            <strong>Client Acquisition Architecture:</strong> These are paying customer leads generated for your portfolio clients (e.g. Alpine Grand Hotel, PrimeCare).
          </span>
        </div>
        <span className="font-semibold text-[#2563EB]">Omnichannel Sync Active</span>
      </div>

      <div className="space-y-5 mt-4">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white">
            <span className="text-[11px] font-semibold text-[#64748B] block">Total Leads</span>
            <span className="text-xl font-bold text-[#0F172A] mt-1 block">{counts.total}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white">
            <span className="text-[11px] font-semibold text-[#64748B] block">New</span>
            <span className="text-xl font-bold text-[#2563EB] mt-1 block">{counts.new}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5]/50">
            <span className="text-[11px] font-semibold text-[#047857] block">Qualified</span>
            <span className="text-xl font-bold text-[#10B981] mt-1 block">{counts.qualified}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#DDD6FE] bg-[#F5F3FF]/50">
            <span className="text-[11px] font-semibold text-[#6D28D9] block">Follow-up</span>
            <span className="text-xl font-bold text-[#8B5CF6] mt-1 block">{counts.followup}</span>
          </div>
          <div className="p-3 rounded-xl border border-[#E2E8F0] bg-white">
            <span className="text-[11px] font-semibold text-[#64748B] block">Won</span>
            <span className="text-xl font-bold text-[#0F172A] mt-1 block">{counts.won}</span>
          </div>
        </div>

        {/* Filters & Search */}
        <Card padding="sm" className="border-[#E2E8F0] space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {["All", "New", "Qualified", "Follow-up", "Proposal", "Won", "Escalated"].map((st) => (
                <FilterPill
                  key={st}
                  label={st}
                  isActive={selectedStatus === st}
                  onClick={() => setSelectedStatus(st)}
                />
              ))}
            </div>

            <div className="w-full sm:w-72">
              <SearchInput
                placeholder="Search lead name, client, interest..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9] overflow-x-auto">
            <span className="text-[11px] font-semibold text-[#64748B] mr-1">Source:</span>
            {["All", "Instagram", "WhatsApp", "Facebook", "Website", "Email"].map((ch) => (
              <FilterPill
                key={ch}
                label={ch}
                isActive={selectedChannel === ch}
                onClick={() => setSelectedChannel(ch)}
              />
            ))}
          </div>
        </Card>

        {/* Leads Table */}
        <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lead Name</th>
                  <th className="py-3 px-4">Source Channel</th>
                  <th className="py-3 px-4">Client System</th>
                  <th className="py-3 px-4">Interest / Need</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Contact</th>
                  <th className="py-3 px-4">Next Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {lead.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={lead.avatarUrl}
                            alt={lead.fullName}
                            className="h-7 w-7 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="h-7 w-7 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-[10px] flex items-center justify-center">
                            {lead.fullName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-[#0F172A] block leading-tight">
                            {lead.fullName}
                          </span>
                          <span className="text-[10px] text-[#64748B]">{lead.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-medium text-[#475569]">
                        {getChannelIcon(lead.channel)}
                        {lead.channel}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#475569] font-medium">
                      {lead.company}
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-[#475569]">
                      {lead.primaryNeed}
                    </td>

                    <td className="py-3 px-4">
                      <AIBadge confidence={lead.aiQualificationScore} size="sm" />
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={lead.status} size="sm" />
                    </td>

                    <td className="py-3 px-4 text-[#94A3B8]">{lead.lastContactedAt}</td>
                    <td className="py-3 px-4 text-[#2563EB] font-medium">
                      {lead.nextFollowUpAt || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A]">Add Inbound Lead</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 py-4">
              <TextInput
                label="Customer Name"
                placeholder="e.g. Sarah Johnson"
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                required
              />

              <Select
                label="Client Portfolio Account"
                value={newClientCompany}
                onChange={(e) => setNewClientCompany(e.target.value)}
                options={[
                  { label: "Alpine Grand Hotel (Client)", value: "Alpine Grand Hotel (Client)" },
                  { label: "PrimeCare Clinic (Client)", value: "PrimeCare Clinic (Client)" },
                  { label: "Veloce Interiors (Client)", value: "Veloce Interiors (Client)" },
                  { label: "OmniLogistics (Client)", value: "OmniLogistics (Client)" },
                ]}
              />

              <Select
                label="Acquisition Channel Source"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as Lead["channel"])}
                options={[
                  { label: "Instagram DM", value: "Instagram" },
                  { label: "WhatsApp Cloud", value: "WhatsApp" },
                  { label: "Facebook Messenger", value: "Facebook" },
                  { label: "Website Chat", value: "Website" },
                  { label: "Email Inbound", value: "Email" },
                ]}
              />

              <TextInput
                label="Interest / Inquired Service"
                placeholder="e.g. Presidential Suite Anniversary Package"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
              />

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}
                >
                  Create Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
