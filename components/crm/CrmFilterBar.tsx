"use client";

import React from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CrmFilterState } from "@/lib/crm/crm-service";
import { RiRefreshLine, RiFilter3Line } from "react-icons/ri";

interface CrmFilterBarProps {
  filters: CrmFilterState;
  onChange: (updated: Partial<CrmFilterState>) => void;
  onClear: () => void;
  isFilterActive: boolean;
  totalFiltered: number;
  totalProspects: number;
}

export function CrmFilterBar({
  filters,
  onChange,
  onClear,
  isFilterActive,
  totalFiltered,
  totalProspects,
}: CrmFilterBarProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 space-y-3 shadow-xs">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Search prospects by name, industry, city, email, phone, tags, or notes..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            onClear={() => onChange({ search: "" })}
            className="text-xs"
          />
        </div>

        {isFilterActive && (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RiRefreshLine className="h-3.5 w-3.5" />}
            onClick={onClear}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Multi-Filter Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-[#F1F5F9]">
        <Select
          label="Pipeline Stage"
          options={[
            { label: "All Stages", value: "All" },
            { label: "Found", value: "FOUND" },
            { label: "Researching", value: "RESEARCHING" },
            { label: "Qualified", value: "QUALIFIED" },
            { label: "Demo Ready", value: "DEMO READY" },
            { label: "Contacted", value: "CONTACTED" },
            { label: "Replied", value: "REPLIED" },
            { label: "Demo", value: "DEMO" },
            { label: "Proposal", value: "PROPOSAL" },
            { label: "Negotiation", value: "NEGOTIATION" },
            { label: "Won", value: "WON" },
            { label: "Lost", value: "LOST" },
          ]}
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
        />

        <Select
          label="Industry"
          options={[
            { label: "All Industries", value: "All" },
            { label: "Hospitality", value: "Hospitality" },
            { label: "Restaurant", value: "Restaurant" },
            { label: "Travel", value: "Travel" },
            { label: "School", value: "School" },
            { label: "Clinic", value: "Clinic" },
            { label: "Healthcare", value: "Healthcare" },
            { label: "Real Estate", value: "Real Estate" },
            { label: "Professional Services", value: "Professional Services" },
            { label: "Other", value: "Other" },
          ]}
          value={filters.industry}
          onChange={(e) => onChange({ industry: e.target.value })}
        />

        <Select
          label="NEXUS Opportunity"
          options={[
            { label: "All Levels", value: "All" },
            { label: "High Opportunity", value: "High" },
            { label: "Medium Opportunity", value: "Medium" },
            { label: "Low Opportunity", value: "Low" },
          ]}
          value={filters.opportunity}
          onChange={(e) => onChange({ opportunity: e.target.value })}
        />

        <Select
          label="Acquisition Source"
          options={[
            { label: "All Sources", value: "All" },
            { label: "Manual", value: "Manual" },
            { label: "Website Research", value: "Website Research" },
            { label: "Referral", value: "Referral" },
            { label: "Social Media", value: "Social Media" },
            { label: "Directory", value: "Directory" },
            { label: "Other", value: "Other" },
          ]}
          value={filters.source}
          onChange={(e) => onChange({ source: e.target.value })}
        />

        <Select
          label="Follow-Up Status"
          options={[
            { label: "All Follow-Ups", value: "All" },
            { label: "Overdue", value: "Overdue" },
            { label: "Due Today", value: "Today" },
            { label: "Upcoming", value: "Upcoming" },
            { label: "No Follow-Up", value: "No Follow-Up" },
          ]}
          value={filters.followUp}
          onChange={(e) => onChange({ followUp: e.target.value })}
        />

        <Select
          label="Sort By"
          options={[
            { label: "Highest Deal Value", value: "value_desc" },
            { label: "Lowest Deal Value", value: "value_asc" },
            { label: "Highest Fit Score", value: "fit_desc" },
            { label: "Recently Updated", value: "updated_desc" },
            { label: "Alphabetical (A-Z)", value: "name_asc" },
          ]}
          value={filters.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value })}
        />
      </div>

      {/* Filter Status Summary Line */}
      <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
        <div className="flex items-center gap-1.5">
          <RiFilter3Line className="h-3.5 w-3.5 text-[#2563EB]" />
          <span>
            Showing <strong className="text-[#0F172A]">{totalFiltered}</strong> of{" "}
            <strong>{totalProspects}</strong> active CRM prospects
          </span>
        </div>
      </div>
    </div>
  );
}
