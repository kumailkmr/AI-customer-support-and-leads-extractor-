"use client";

import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { useToast } from "@/components/ui/Toast";
import { useLeads } from "@/lib/store/leads-store";
import { ClientLead } from "@/types/leads";

import { LeadMetricsRow } from "@/components/leads/LeadMetricsRow";
import { LeadFilterBar, LeadFilterState } from "@/components/leads/LeadFilterBar";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadsCardGrid } from "@/components/leads/LeadsCardGrid";
import { AddLeadModal } from "@/components/leads/AddLeadModal";
import { ImportLeadsModal } from "@/components/leads/ImportLeadsModal";

import {
  RiUserAddLine,
  RiDownload2Line,
  RiUpload2Line,
  RiListCheck,
  RiLayoutGridLine,
  RiInboxArchiveLine,
} from "react-icons/ri";

export default function LeadsPage() {
  const {
    leads,
    clients,
    leadMetrics,
    addLead,
    updateLeadStatus,
    deleteLead,
  } = useLeads();

  const { showToast } = useToast();

  const [selectedView, setSelectedView] = useState<"table" | "cards">("table");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<LeadFilterState>({
    search: "",
    clientId: "All",
    source: "All",
    status: "All",
    channel: "All",
    intent: "All",
    qualification: "All",
    followUp: "All",
    sortBy: "updated_desc",
  });

  const handleClearFilters = () => {
    setFilters({
      search: "",
      clientId: "All",
      source: "All",
      status: "All",
      channel: "All",
      intent: "All",
      qualification: "All",
      followUp: "All",
      sortBy: "updated_desc",
    });
    showToast("Filter criteria cleared.", "info");
  };

  const isFilterActive =
    filters.search !== "" ||
    filters.clientId !== "All" ||
    filters.source !== "All" ||
    filters.status !== "All" ||
    filters.channel !== "All" ||
    filters.intent !== "All" ||
    filters.qualification !== "All" ||
    filters.followUp !== "All" ||
    filters.sortBy !== "updated_desc";

  // Filter & Sort Logic
  const filteredLeads = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return leads
      .filter((l) => {
        // Search matching
        const matchesSearch =
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          l.clientName.toLowerCase().includes(q) ||
          l.intent.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q));

        // Client filter
        const matchesClient =
          filters.clientId === "All" || l.clientId === filters.clientId;

        // Source filter
        const matchesSource =
          filters.source === "All" || l.source === filters.source;

        // Status filter
        const matchesStatus =
          filters.status === "All" || l.status === filters.status;

        // Channel filter
        const matchesChannel =
          filters.channel === "All" || l.channel === filters.channel;

        // Intent filter
        const matchesIntent =
          filters.intent === "All" || l.intent === filters.intent;

        // Qualification filter
        const matchesQualification =
          filters.qualification === "All" ||
          l.qualificationStatus === filters.qualification;

        // Follow-Up filter
        const matchesFollowUp =
          filters.followUp === "All" ||
          (filters.followUp === "Today" && l.nextFollowUpAt?.toLowerCase().includes("today")) ||
          (filters.followUp === "Upcoming" && !!l.nextFollowUpAt && !l.nextFollowUpAt.toLowerCase().includes("today")) ||
          (filters.followUp === "No Follow-Up" && !l.nextFollowUpAt);

        return (
          matchesSearch &&
          matchesClient &&
          matchesSource &&
          matchesStatus &&
          matchesChannel &&
          matchesIntent &&
          matchesQualification &&
          matchesFollowUp
        );
      })
      .sort((a, b) => {
        if (filters.sortBy === "value_desc") {
          return (b.estimatedValue || 0) - (a.estimatedValue || 0);
        }
        if (filters.sortBy === "score_desc") {
          return (b.score || 0) - (a.score || 0);
        }
        if (filters.sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        // default updated_desc
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [leads, filters]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLeads, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexus_client_leads_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Exported ${filteredLeads.length} leads as JSON.`, "success");
  };

  const handleCreateLead = (data: Partial<ClientLead>) => {
    const created = addLead(data);
    showToast(`Created customer lead "${created.name}" for ${created.clientName}.`, "success");
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <PageHeader
        title="Leads"
        subtitle="Manage and qualify customer opportunities generated for your clients."
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />
            Client Acquisition Engine
          </span>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RiUpload2Line className="h-3.5 w-3.5" />}
              onClick={() => setIsImportModalOpen(true)}
            >
              Import
            </Button>

            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RiDownload2Line className="h-3.5 w-3.5" />}
              onClick={handleExport}
            >
              Export
            </Button>

            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiUserAddLine className="h-3.5 w-3.5" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Lead
            </Button>
          </div>
        }
      />

      <div className="space-y-5">
        {/* Lead Lifecycle Metrics Row */}
        <section aria-label="Lead Metrics">
          <LeadMetricsRow metrics={leadMetrics} />
        </section>

        {/* Multi-Filter Bar */}
        <section aria-label="Lead Filters">
          <LeadFilterBar
            filters={filters}
            clients={clients}
            onChange={(upd) => setFilters((prev) => ({ ...prev, ...upd }))}
            onClear={handleClearFilters}
            isFilterActive={isFilterActive}
            totalFiltered={filteredLeads.length}
            totalLeads={leads.length}
          />
        </section>

        {/* View Switcher Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[#64748B]">
            Showing <strong className="text-[#0F172A]">{filteredLeads.length}</strong> active leads
          </div>

          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setSelectedView("table")}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                selectedView === "table"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title="Table view"
            >
              <RiListCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedView("cards")}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                selectedView === "cards"
                  ? "bg-white text-[#2563EB] shadow-xs"
                  : "text-[#64748B] hover:text-[#0F172A]"
              }`}
              title="Cards view"
            >
              <RiLayoutGridLine className="h-4 w-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
          </div>
        </div>

        {/* Main Content: Table or Cards or Empty State */}
        {filteredLeads.length > 0 ? (
          selectedView === "table" ? (
            <LeadsTable
              leads={filteredLeads}
              onUpdateStatus={updateLeadStatus}
              onDeleteLead={deleteLead}
            />
          ) : (
            <LeadsCardGrid
              leads={filteredLeads}
              onUpdateStatus={updateLeadStatus}
              onDeleteLead={deleteLead}
            />
          )
        ) : (
          <EmptyStateCard
            icon={<RiInboxArchiveLine className="h-10 w-10 text-[#94A3B8]" />}
            title="No customer leads match your filters"
            description="No customer leads match your current search query, client, channel, or qualification filters. Try adjusting your filter parameters."
            actionLabel="Reset All Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        clients={clients}
        onCreate={handleCreateLead}
      />

      {/* Import Modal */}
      <ImportLeadsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportDone={(count) => showToast(`Simulated import of ${count} customer leads.`, "success")}
      />
    </AppLayout>
  );
}
