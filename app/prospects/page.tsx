"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { useProspects } from "@/lib/store/prospects-store";
import { useAnalysis } from "@/lib/store/analysis-store";
import { useToast } from "@/components/ui/Toast";
import { filterAndSortProspects, CrmFilterState } from "@/lib/crm/crm-service";
import { BusinessProspect, ProspectPipelineStatus } from "@/types/prospects";

import { CrmMetricsCards } from "@/components/crm/CrmMetricsCards";
import { CrmFilterBar } from "@/components/crm/CrmFilterBar";
import { ProspectsTable } from "@/components/crm/ProspectsTable";
import { ProspectsKanban } from "@/components/crm/ProspectsKanban";
import { ProspectsCardView } from "@/components/crm/ProspectsCardView";
import { AddProspectModal } from "@/components/crm/AddProspectModal";
import { ImportModal } from "@/components/crm/ImportModal";

import {
  RiListCheck,
  RiLayoutGridLine,
  RiKanbanView2,
  RiAddLine,
  RiDownload2Line,
  RiUpload2Line,
  RiCompass3Line,
} from "react-icons/ri";

export default function ProspectsPage() {
  const router = useRouter();
  const {
    prospects,
    crmMetrics,
    selectedView,
    setSelectedView,
    addProspect,
    deleteProspect,
    updateProspectStatus,
    bulkUpdateStatus,
    bulkAddTag,
    bulkDelete,
    importProspects,
    exportProspects,
  } = useProspects();

  const { analyses } = useAnalysis();
  const { showToast } = useToast();

  // Filter state
  const [filters, setFilters] = useState<CrmFilterState>({
    search: "",
    status: "All",
    industry: "All",
    opportunity: "All",
    source: "All",
    followUp: "All",
    sortBy: "updated_desc",
    analysisStatus: "All",
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "All",
      industry: "All",
      opportunity: "All",
      source: "All",
      followUp: "All",
      sortBy: "updated_desc",
      analysisStatus: "All",
    });
    showToast("Filter criteria cleared.", "info");
  };

  const isFilterActive =
    filters.search !== "" ||
    filters.status !== "All" ||
    filters.industry !== "All" ||
    filters.opportunity !== "All" ||
    filters.source !== "All" ||
    filters.followUp !== "All" ||
    (filters.analysisStatus !== "All" && !!filters.analysisStatus) ||
    filters.sortBy !== "updated_desc";

  // Build analysis status lookup map
  const analysisStatuses = useMemo(() => {
    const map: Record<string, string> = {};
    prospects.forEach((p) => {
      const a = analyses[p.id.toLowerCase()];
      if (!a) {
        map[p.id.toLowerCase()] = "Not Analyzed";
      } else {
        map[p.id.toLowerCase()] = a.status;
      }
    });
    return map;
  }, [prospects, analyses]);

  // Filter & sort prospects using service layer
  const filteredProspects = useMemo(() => {
    return filterAndSortProspects(prospects, filters, analysisStatuses);
  }, [prospects, filters, analysisStatuses]);

  // Handlers with toast feedback
  const handleCreateProspect = (data: Partial<BusinessProspect>) => {
    const created = addProspect(data);
    showToast(`Created prospect "${created.businessName}" in pipeline.`, "success");
  };

  const handleUpdateStatus = (id: string, newStatus: ProspectPipelineStatus) => {
    updateProspectStatus(id, newStatus);
    showToast(`Updated stage to ${newStatus}.`, "success");
  };

  const handleDeleteProspect = (id: string) => {
    deleteProspect(id);
    showToast("Prospect removed from pipeline.", "info");
  };

  const handleBulkUpdateStatus = (ids: string[], newStatus: ProspectPipelineStatus) => {
    bulkUpdateStatus(ids, newStatus);
    showToast(`Updated ${ids.length} prospects to ${newStatus}.`, "success");
  };

  const handleBulkAddTag = (ids: string[], tag: string) => {
    bulkAddTag(ids, tag);
    showToast(`Applied tag "${tag}" to ${ids.length} prospects.`, "success");
  };

  const handleBulkDelete = (ids: string[]) => {
    bulkDelete(ids);
    showToast(`Deleted ${ids.length} prospects from pipeline.`, "warning");
  };

  const handleExportCsv = () => {
    exportProspects(filteredProspects);
    showToast(`Exported ${filteredProspects.length} prospects to CSV.`, "success");
  };

  const handleImportCsv = (items: Array<Partial<BusinessProspect>>) => {
    const importedCount = importProspects(items);
    showToast(`Successfully imported ${importedCount} prospects into CRM.`, "success");
  };

  return (
    <AppLayout>
      {/* Header */}
      <PageHeader
        title="Prospects"
        subtitle="Manage businesses from first discovery to closed client."
        badge={
          <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full">
            {crmMetrics.totalProspects} Active Targets
          </span>
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Selector */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedView("table")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  selectedView === "table"
                    ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
                title="Table View"
              >
                <RiListCheck className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedView("kanban")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  selectedView === "kanban"
                    ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
                title="Kanban Pipeline View"
              >
                <RiKanbanView2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedView("cards")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  selectedView === "cards"
                    ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
                title="Card View"
              >
                <RiLayoutGridLine className="h-4 w-4" />
              </button>
            </div>

            {/* Import / Export */}
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
              onClick={handleExportCsv}
            >
              Export
            </Button>

            {/* Add Target */}
            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiAddLine className="h-4 w-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Prospect
            </Button>
          </div>
        }
      />

      <div className="space-y-5">
        {/* CRM Summary Metrics Cards */}
        <CrmMetricsCards metrics={crmMetrics} />

        {/* Global CRM Filter & Search Bar */}
        <CrmFilterBar
          filters={filters}
          onChange={(up) => setFilters((prev) => ({ ...prev, ...up }))}
          onClear={handleClearFilters}
          isFilterActive={isFilterActive}
          totalFiltered={filteredProspects.length}
          totalProspects={prospects.length}
        />

        {/* Main Content Area */}
        {filteredProspects.length > 0 ? (
          selectedView === "table" ? (
            <ProspectsTable
              prospects={filteredProspects}
              onUpdateStatus={handleUpdateStatus}
              onDeleteProspect={handleDeleteProspect}
              onBulkUpdateStatus={handleBulkUpdateStatus}
              onBulkAddTag={handleBulkAddTag}
              onBulkDelete={handleBulkDelete}
            />
          ) : selectedView === "kanban" ? (
            <ProspectsKanban
              prospects={filteredProspects}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <ProspectsCardView
              prospects={filteredProspects}
              onUpdateStatus={handleUpdateStatus}
              onDeleteProspect={handleDeleteProspect}
            />
          )
        ) : (
          <EmptyStateCard
            icon={<RiCompass3Line className="h-10 w-10 text-[#94A3B8]" />}
            title="No prospects match your search or filters"
            description={
              isFilterActive
                ? "Try clearing some filter criteria to broaden your results."
                : "Your CRM pipeline has no active prospects yet. Discover target businesses or click 'Add Prospect' above."
            }
            actionLabel={
              isFilterActive ? "Clear Filter Criteria" : "Discover Businesses"
            }
            onAction={
              isFilterActive
                ? handleClearFilters
                : () => router.push("/discover")
            }
          />
        )}
      </div>

      {/* Add Prospect Modal */}
      <AddProspectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateProspect}
      />

      {/* Import CSV Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportCsv}
      />
    </AppLayout>
  );
}
