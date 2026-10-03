"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AIBadge } from "@/components/ui/AIBadge";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { formatCurrency } from "@/lib/utils";
import {
  RiAddLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
} from "react-icons/ri";

export type PipelineStage =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export interface DealCardItem {
  id: string;
  customerName: string;
  companyName: string;
  value: number;
  source: "Instagram" | "WhatsApp" | "Facebook" | "Website" | "Email";
  score: number;
  lastActivity: string;
  stage: PipelineStage;
}

export default function SalesPage() {
  const [deals, setDeals] = useState<DealCardItem[]>([
    {
      id: "deal_1",
      customerName: "Sarah Johnson",
      companyName: "Alpine Grand Hotel (Client)",
      value: 3400,
      source: "Instagram",
      score: 92,
      lastActivity: "4m ago",
      stage: "QUALIFIED",
    },
    {
      id: "deal_2",
      customerName: "Michael Brown",
      companyName: "PrimeCare Clinic (Client)",
      value: 1200,
      source: "WhatsApp",
      score: 78,
      lastActivity: "18m ago",
      stage: "NEW",
    },
    {
      id: "deal_3",
      customerName: "Emma Davis",
      companyName: "Veloce Interiors (Client)",
      value: 18500,
      source: "Facebook",
      score: 85,
      lastActivity: "42m ago",
      stage: "INTERESTED",
    },
    {
      id: "deal_4",
      customerName: "David Miller",
      companyName: "Apex Solar Commercial",
      value: 36000,
      source: "Email",
      score: 94,
      lastActivity: "2h ago",
      stage: "PROPOSAL",
    },
    {
      id: "deal_5",
      customerName: "James Wilson",
      companyName: "OmniLogistics (Client)",
      value: 28000,
      source: "Website",
      score: 89,
      lastActivity: "1h ago",
      stage: "NEGOTIATION",
    },
    {
      id: "deal_6",
      customerName: "Priya Sharma",
      companyName: "Catalyst Medical (Client)",
      value: 4800,
      source: "WhatsApp",
      score: 96,
      lastActivity: "3h ago",
      stage: "WON",
    },
    {
      id: "deal_7",
      customerName: "Marcus Vance",
      companyName: "Vance Logistics Group",
      value: 18500,
      source: "WhatsApp",
      score: 94,
      lastActivity: "5h ago",
      stage: "CONTACTED",
    },
  ]);

  const stages: { key: PipelineStage; label: string; color: string }[] = [
    { key: "NEW", label: "New", color: "border-[#64748B] text-[#64748B]" },
    { key: "CONTACTED", label: "Contacted", color: "border-[#2563EB] text-[#2563EB]" },
    { key: "INTERESTED", label: "Interested", color: "border-[#8B5CF6] text-[#8B5CF6]" },
    { key: "QUALIFIED", label: "Qualified", color: "border-[#10B981] text-[#10B981]" },
    { key: "PROPOSAL", label: "Proposal", color: "border-[#F59E0B] text-[#F59E0B]" },
    { key: "NEGOTIATION", label: "Negotiation", color: "border-[#D97706] text-[#D97706]" },
    { key: "WON", label: "Won", color: "border-[#059669] text-[#059669]" },
    { key: "LOST", label: "Lost", color: "border-[#EF4444] text-[#EF4444]" },
  ];

  const moveStage = (dealId: string, nextStage: PipelineStage) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d))
    );
  };

  const getSourceIcon = (src: DealCardItem["source"]) => {
    switch (src) {
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

  const totalPipelineValue = deals
    .filter((d) => d.stage !== "LOST")
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <AppLayout>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Visual deal progression across acquisition stages with automated deal velocity."
        badge={
          <span className="text-xs font-semibold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
            {formatCurrency(totalPipelineValue)} Active Value
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <AIActionButton label="AI Win Probability" size="sm" variant="solid" />
            <Button size="sm" variant="primary" leftIcon={<RiAddLine className="h-3.5 w-3.5" />}>
              Add Deal
            </Button>
          </div>
        }
      />

      {/* Kanban Board Container */}
      <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 min-h-[620px]">
        {stages.map((st) => {
          const stageDeals = deals.filter((d) => d.stage === st.key);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={st.key}
              className="flex-shrink-0 w-72 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex flex-col justify-between"
            >
              {/* Column Header */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase">
                      {st.label}
                    </span>
                    <span className="h-5 w-5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-bold text-[#475569] flex items-center justify-center">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#64748B]">
                    {formatCurrency(stageTotal)}
                  </span>
                </div>

                {/* Deal Cards in Column */}
                <div className="space-y-2.5">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white shadow-xs hover:border-[#CBD5E1] transition-all space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                            {deal.customerName}
                          </h4>
                          <span className="text-[10px] text-[#64748B] block truncate max-w-[160px]">
                            {deal.companyName}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#0F172A]">
                          {formatCurrency(deal.value)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-[#475569]">
                          {getSourceIcon(deal.source)}
                          {deal.source}
                        </span>
                        <AIBadge confidence={deal.score} size="sm" />
                      </div>

                      {/* Stage Mover Selector */}
                      <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[10px]">
                        <span className="text-[#94A3B8]">{deal.lastActivity}</span>
                        <select
                          value={deal.stage}
                          onChange={(e) => moveStage(deal.id, e.target.value as PipelineStage)}
                          className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] rounded px-1.5 py-0.5 outline-none cursor-pointer"
                        >
                          {stages.map((s) => (
                            <option key={s.key} value={s.key}>
                              → {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column Footer */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    const newDeal: DealCardItem = {
                      id: `deal_${Date.now()}`,
                      customerName: "New Inbound Lead",
                      companyName: "Acquisition System",
                      value: 5000,
                      source: "Instagram",
                      score: 88,
                      lastActivity: "Just now",
                      stage: st.key,
                    };
                    setDeals([...deals, newDeal]);
                  }}
                  className="w-full py-1.5 rounded-lg border border-dashed border-[#CBD5E1] text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors flex items-center justify-center gap-1"
                >
                  <RiAddLine className="h-3.5 w-3.5" />
                  Add to {st.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
