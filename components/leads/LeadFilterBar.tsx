"use client";

import React from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ClientBusiness } from "@/types/leads";
import { RiRefreshLine, RiFilter3Line } from "react-icons/ri";

export interface LeadFilterState {
  search: string;
  clientId: string;
  source: string;
  status: string;
  channel: string;
  intent: string;
  qualification: string;
  followUp: string;
  sortBy: string;
}

interface LeadFilterBarProps {
  filters: LeadFilterState;
  clients: ClientBusiness[];
  onChange: (updated: Partial<LeadFilterState>) => void;
  onClear: () => void;
  isFilterActive: boolean;
  totalFiltered: number;
  totalLeads: number;
}

export function LeadFilterBar({
  filters,
  clients,
  onChange,
  onClear,
  isFilterActive,
  totalFiltered,
  totalLeads,
}: LeadFilterBarProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-3.5 space-y-3 shadow-xs">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Search leads by name, email, phone, client, intent, or tags..."
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 border-t border-[#F1F5F9]">
        {/* Client selector */}
        <Select
          label="Client"
          options={[
            { label: "All Clients", value: "All" },
            ...clients.map((c) => ({
              label: c.businessName,
              value: c.id,
            })),
          ]}
          value={filters.clientId}
          onChange={(e) => onChange({ clientId: e.target.value })}
        />

        {/* Status */}
        <Select
          label="Lead Status"
          options={[
            { label: "All Statuses", value: "All" },
            { label: "New", value: "NEW" },
            { label: "Contacted", value: "CONTACTED" },
            { label: "Qualifying", value: "QUALIFYING" },
            { label: "Qualified", value: "QUALIFIED" },
            { label: "Follow-Up", value: "FOLLOW_UP" },
            { label: "Human Handoff", value: "HUMAN_HANDOFF" },
            { label: "Converted", value: "CONVERTED" },
            { label: "Not Interested", value: "NOT_INTERESTED" },
            { label: "Lost", value: "LOST" },
          ]}
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value })}
        />

        {/* Channel */}
        <Select
          label="Channel"
          options={[
            { label: "All Channels", value: "All" },
            { label: "Website Chat", value: "Website Chat" },
            { label: "Instagram", value: "Instagram" },
            { label: "Facebook", value: "Facebook" },
            { label: "WhatsApp", value: "WhatsApp" },
            { label: "Email", value: "Email" },
            { label: "Phone", value: "Phone" },
            { label: "Manual", value: "Manual" },
          ]}
          value={filters.channel}
          onChange={(e) => onChange({ channel: e.target.value })}
        />

        {/* Source */}
        <Select
          label="Source"
          options={[
            { label: "All Sources", value: "All" },
            { label: "Website", value: "Website" },
            { label: "Instagram", value: "Instagram" },
            { label: "Facebook", value: "Facebook" },
            { label: "WhatsApp", value: "WhatsApp" },
            { label: "Email", value: "Email" },
            { label: "Referral", value: "Referral" },
            { label: "Demo", value: "Demo" },
            { label: "Manual", value: "Manual" },
          ]}
          value={filters.source}
          onChange={(e) => onChange({ source: e.target.value })}
        />

        {/* Intent */}
        <Select
          label="Buyer Intent"
          options={[
            { label: "All Intents", value: "All" },
            { label: "Admission", value: "Admission" },
            { label: "Booking", value: "Booking" },
            { label: "Appointment", value: "Appointment" },
            { label: "Pricing Inquiry", value: "Pricing Inquiry" },
            { label: "Service Inquiry", value: "Service Inquiry" },
            { label: "Product Inquiry", value: "Product Inquiry" },
            { label: "Demo Request", value: "Demo Request" },
            { label: "Support", value: "Support" },
            { label: "Complaint", value: "Complaint" },
            { label: "General Inquiry", value: "General Inquiry" },
          ]}
          value={filters.intent}
          onChange={(e) => onChange({ intent: e.target.value })}
        />

        {/* Qualification */}
        <Select
          label="Qualification"
          options={[
            { label: "All States", value: "All" },
            { label: "Not Started", value: "NOT_STARTED" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Qualified", value: "QUALIFIED" },
            { label: "Not Qualified", value: "NOT_QUALIFIED" },
            { label: "Needs Review", value: "NEEDS_HUMAN_REVIEW" },
          ]}
          value={filters.qualification}
          onChange={(e) => onChange({ qualification: e.target.value })}
        />

        {/* Follow-up */}
        <Select
          label="Follow-Up"
          options={[
            { label: "All Follow-Ups", value: "All" },
            { label: "Due Today", value: "Today" },
            { label: "Upcoming", value: "Upcoming" },
            { label: "No Follow-Up", value: "No Follow-Up" },
          ]}
          value={filters.followUp}
          onChange={(e) => onChange({ followUp: e.target.value })}
        />

        {/* Sort By */}
        <Select
          label="Sort By"
          options={[
            { label: "Recently Updated", value: "updated_desc" },
            { label: "Highest Deal Value", value: "value_desc" },
            { label: "Highest Qualification", value: "score_desc" },
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
            <strong>{totalLeads}</strong> customer leads
          </span>
        </div>
      </div>
    </div>
  );
}
