"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FilterPill } from "@/components/ui/FilterPill";
import { SearchInput } from "@/components/ui/SearchInput";
import { useLeads } from "@/lib/store/leads-store";
import { formatCurrency } from "@/lib/utils";
import {
  RiBuilding4Line,
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
  RiChat1Line,
  RiArrowRightLine,
} from "react-icons/ri";

export default function ClientsPage() {
  const { clients, leads, conversations } = useLeads();
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) => {
    const matchesSearch =
      search === "" ||
      c.businessName.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || c.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const getSourceIcon = (channel: string) => {
    switch (channel) {
      case "Instagram":
        return <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />;
      case "WhatsApp":
        return <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />;
      case "Facebook":
        return <RiFacebookCircleLine className="h-4 w-4 text-[#1877F2]" />;
      case "Website":
      case "Website Chat":
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
      case "Email":
        return <RiMailLine className="h-4 w-4 text-[#64748B]" />;
      default:
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
    }
  };

  const totalMRR = clients.reduce((sum, c) => sum + c.mrr, 0);

  return (
    <AppLayout>
      <PageHeader
        title="Clients"
        subtitle="Active paying businesses using your deployed NEXUS AI acquisition and customer triage systems."
        badge={
          <span className="text-xs font-semibold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
            {formatCurrency(totalMRR)} Monthly MRR
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/settings/channels">
              <Button size="sm" variant="outline">
                Channels OS
              </Button>
            </Link>
            <span className="text-xs font-medium text-[#64748B] bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
              Demo Data
            </span>
          </div>
        }
      />

      <div className="space-y-5">
        {/* Status Filter & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <FilterPill
              label="All Clients"
              count={clients.length}
              isActive={selectedStatus === "All"}
              onClick={() => setSelectedStatus("All")}
            />
            <FilterPill
              label="Active"
              count={clients.filter((c) => c.status === "Active").length}
              isActive={selectedStatus === "Active"}
              onClick={() => setSelectedStatus("Active")}
            />
            <FilterPill
              label="Onboarding"
              count={clients.filter((c) => c.status === "Onboarding").length}
              isActive={selectedStatus === "Onboarding"}
              onClick={() => setSelectedStatus("Onboarding")}
            />
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search clients by name, industry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((client) => {
            const clientLeads = leads.filter((l) => l.clientId === client.id);
            const clientConvs = conversations.filter((c) => c.clientId === client.id);
            const qualifiedCount = clientLeads.filter((l) => l.status === "QUALIFIED").length;
            const handoffCount = clientLeads.filter((l) => l.status === "HUMAN_HANDOFF").length;

            return (
              <Card
                key={client.id}
                padding="md"
                className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] flex-shrink-0">
                        <RiBuilding4Line className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/clients/${client.id}`}
                            className="text-sm font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors"
                          >
                            {client.businessName}
                          </Link>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              client.status === "Active"
                                ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                                : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                            }`}
                          >
                            {client.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {client.industry} · {client.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-[#0F172A] block">
                        {formatCurrency(client.mrr)}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">Monthly Retainer</span>
                    </div>
                  </div>

                  {/* 4 Client Lead Performance Metrics */}
                  <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-[#F1F5F9] text-center">
                    <div className="p-2 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                      <span className="text-base font-bold text-[#0F172A] block leading-tight">
                        {clientLeads.length}
                      </span>
                      <span className="text-[10px] text-[#64748B]">Total Leads</span>
                    </div>

                    <div className="p-2 bg-[#ECFDF5] rounded-lg border border-[#A7F3D0]">
                      <span className="text-base font-bold text-[#047857] block leading-tight">
                        {qualifiedCount}
                      </span>
                      <span className="text-[10px] text-[#065F46]">Qualified</span>
                    </div>

                    <div className="p-2 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
                      <span className="text-base font-bold text-[#1D4ED8] block leading-tight">
                        {clientConvs.length}
                      </span>
                      <span className="text-[10px] text-[#1E40AF]">Conversations</span>
                    </div>

                    <div className="p-2 bg-[#FEF2F2] rounded-lg border border-[#FECACA]">
                      <span className="text-base font-bold text-[#B91C1C] block leading-tight">
                        {handoffCount}
                      </span>
                      <span className="text-[10px] text-[#991B1B]">Handoffs</span>
                    </div>
                  </div>

                  {/* Active Channels */}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
                    <span>Active Channels:</span>
                    <div className="flex items-center gap-1.5">
                      {client.activeChannels.map((ch, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[11px] font-medium text-[#475569]"
                          title={ch}
                        >
                          {getSourceIcon(ch)}
                          <span>{ch}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#64748B]">
                    Agent: <strong className="text-[#0F172A]">{client.assignedAgent}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <Link href={`/clients/${client.id}`}>
                      <Button size="sm" variant="outline" rightIcon={<RiArrowRightLine className="h-3 w-3" />}>
                        Workspace
                      </Button>
                    </Link>
                    <Link href={`/inbox`}>
                      <Button size="sm" variant="secondary" leftIcon={<RiChat1Line className="h-3 w-3" />}>
                        Inbox
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
