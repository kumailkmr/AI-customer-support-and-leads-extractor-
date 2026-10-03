"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { FilterPill } from "@/components/ui/FilterPill";
import { SearchInput } from "@/components/ui/SearchInput";
import { mockClients, ExtendedClient } from "@/lib/mock-data/clients";
import { formatCurrency } from "@/lib/utils";
import {
  RiBuilding4Line,
  RiAddLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
  RiCheckLine,
} from "react-icons/ri";

export default function ClientsPage() {
  const [clients] = useState<ExtendedClient[]>(mockClients);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) => {
    const matchesSearch =
      search === "" ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContact.toLowerCase().includes(search.toLowerCase()) ||
      c.acquisitionChannel.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Active" && c.onboardingStatus === "complete") ||
      (selectedStatus === "Onboarding" && c.onboardingStatus === "in_progress") ||
      (selectedStatus === "Inactive" && c.onboardingStatus === "pending");

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
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
      case "Email":
        return <RiMailLine className="h-4 w-4 text-[#64748B]" />;
      default:
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
    }
  };

  const totalMRR = clients.reduce((sum, c) => sum + c.monthlyRevenue, 0);

  return (
    <AppLayout>
      <PageHeader
        title="Clients"
        subtitle="Manage active paying businesses using your NEXUS AI client acquisition systems."
        badge={
          <span className="text-xs font-semibold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
            {formatCurrency(totalMRR)} Monthly MRR
          </span>
        }
        actions={
          <Button size="sm" variant="primary" leftIcon={<RiAddLine className="h-3.5 w-3.5" />}>
            Add Client
          </Button>
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
              count={clients.filter((c) => c.onboardingStatus === "complete").length}
              isActive={selectedStatus === "Active"}
              onClick={() => setSelectedStatus("Active")}
            />
            <FilterPill
              label="Onboarding"
              count={clients.filter((c) => c.onboardingStatus === "in_progress").length}
              isActive={selectedStatus === "Onboarding"}
              onClick={() => setSelectedStatus("Onboarding")}
            />
            <FilterPill
              label="Inactive"
              count={clients.filter((c) => c.onboardingStatus === "pending").length}
              isActive={selectedStatus === "Inactive"}
              onClick={() => setSelectedStatus("Inactive")}
            />
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((client) => (
            <Card
              key={client.id}
              padding="md"
              className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] flex-shrink-0">
                      <RiBuilding4Line className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          {client.companyName}
                        </h4>
                        <StatusBadge
                          status={
                            client.onboardingStatus === "complete"
                              ? "Active"
                              : client.onboardingStatus === "in_progress"
                              ? "Contacted"
                              : "Inactive"
                          }
                          size="sm"
                        >
                          {client.onboardingStatus === "complete"
                            ? "Active"
                            : client.onboardingStatus === "in_progress"
                            ? "Onboarding"
                            : "Inactive"}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {client.primaryContact} · {client.contactEmail}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-[#0F172A] block">
                      {formatCurrency(client.monthlyRevenue)}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">per month</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Acquisition Channel</span>
                    <span className="font-semibold text-[#0F172A] flex items-center gap-1.5 mt-0.5">
                      {getSourceIcon(client.acquisitionChannel)}
                      {client.acquisitionChannel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Customer Deals Generated</span>
                    <span className="font-bold text-[#10B981] mt-0.5 block">
                      {client.totalDeals} Deals Won
                    </span>
                  </div>
                </div>

                {/* Deployed Services */}
                <div className="mt-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                    Deployed Services:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {client.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[11px] font-medium text-[#475569]"
                      >
                        <RiCheckLine className="h-3 w-3 text-[#10B981]" />
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                <span>Health Score: <strong className="text-[#10B981]">{client.healthScore}%</strong></span>
                <span className="text-[11px] text-[#94A3B8]">Signed {client.signedAt}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
