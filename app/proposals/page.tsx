"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { StatusBadge } from "@/components/ui/Badge";
import { AIBadge } from "@/components/ui/AIBadge";
import { FilterPill } from "@/components/ui/FilterPill";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { mockProposals, ExtendedProposal } from "@/lib/mock-data/proposals";
import { formatCurrency } from "@/lib/utils";
import {
  RiFileTextLine,
  RiAddLine,
  RiCloseLine,
  RiShareBoxLine,
  RiSparkling2Fill,
  RiArrowRightLine,
} from "react-icons/ri";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<ExtendedProposal[]>(mockProposals);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("8999");

  const filtered = proposals.filter((p) => {
    if (activeTab === "All") return true;
    return p.status === activeTab;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const newProposal: ExtendedProposal = {
      id: `prop_${Date.now()}`,
      title,
      clientName,
      companyName: companyName || "Client Enterprise",
      amount: Number(amount) || 8999,
      status: "Draft",
      createdAt: "Today",
      expiresAt: "In 14 days",
      aiGeneratedSummary: "AI-generated tailored acquisition scope with multi-channel routing setup.",
    };

    setProposals([newProposal, ...proposals]);
    setIsModalOpen(false);
    setTitle("");
    setClientName("");
    setCompanyName("");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Proposals & Agreements"
        subtitle="AI-tailored client proposals with automated ROI breakdowns and real-time viewing telemetry."
        badge={
          <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full">
            {proposals.length} Proposals Total
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <AIActionButton label="AI Pricing Optimizer" size="sm" variant="outline" />
            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiAddLine className="h-3.5 w-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              Create Proposal
            </Button>
          </div>
        }
      />

      <div className="space-y-5">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 overflow-x-auto">
          {["All", "Draft", "Sent", "Viewed", "Accepted", "Rejected"].map((st) => (
            <FilterPill
              key={st}
              label={st}
              count={
                st === "All"
                  ? proposals.length
                  : proposals.filter((p) => p.status === st).length
              }
              isActive={activeTab === st}
              onClick={() => setActiveTab(st)}
            />
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filtered.map((prop) => (
            <Card key={prop.id} padding="md" className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex-shrink-0">
                    <RiFileTextLine className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#0F172A]">{prop.title}</h4>
                      <StatusBadge
                        status={
                          prop.status === "Accepted"
                            ? "Won"
                            : prop.status === "Sent"
                            ? "Contacted"
                            : prop.status === "Viewed"
                            ? "Interested"
                            : prop.status === "Rejected"
                            ? "Lost"
                            : "New"
                        }
                        size="sm"
                      >
                        {prop.status}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">
                      Client: <strong className="text-[#0F172A]">{prop.clientName}</strong> ({prop.companyName}) · Created: {prop.createdAt}
                      {prop.lastViewedAt && ` · Viewed: ${prop.lastViewedAt}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-auto">
                  <div className="text-right">
                    <span className="text-base font-bold text-[#0F172A] block">
                      {formatCurrency(prop.amount)}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Monthly Value</span>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    rightIcon={<RiShareBoxLine className="h-3.5 w-3.5" />}
                  >
                    View
                  </Button>
                </div>
              </div>

              {/* AI Summary */}
              <div className="mt-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-2.5 flex items-start gap-2">
                <AIBadge label="AI Summary" size="sm" />
                <p className="text-xs text-[#475569] leading-relaxed">
                  {prop.aiGeneratedSummary}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Proposal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <RiSparkling2Fill className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Create AI Proposal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <TextInput
                label="Proposal Title"
                placeholder="e.g. Omnichannel Acquisition & 24/7 AI Guest Booking"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Client Decision Maker"
                  placeholder="e.g. Farooq Ahmed"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
                <TextInput
                  label="Company Name"
                  placeholder="e.g. Alpine Grand Hotel"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  label="Monthly Retainer Value (₹ / $)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <Select
                  label="Contract Term"
                  options={[
                    { label: "12 Months (Recommended)", value: "12m" },
                    { label: "6 Months", value: "6m" },
                    { label: "Monthly Flexible", value: "monthly" },
                  ]}
                />
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  type="submit"
                  rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}
                >
                  Generate Proposal
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
