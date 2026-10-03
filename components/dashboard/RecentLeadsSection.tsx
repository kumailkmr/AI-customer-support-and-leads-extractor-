"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CardHeader } from "@/components/ui/Card";
import { LeadCard } from "@/components/ui/LeadCard";
import { FilterPill } from "@/components/ui/FilterPill";
import { mockRecentLeads } from "@/lib/mock-data/leads";
import { HiOutlineArrowRight } from "react-icons/hi2";

export function RecentLeadsSection() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filteredLeads =
    selectedFilter === "All"
      ? mockRecentLeads
      : selectedFilter === "High Score"
      ? mockRecentLeads.filter((l) => l.aiQualificationScore >= 90)
      : mockRecentLeads.filter((l) => l.channel === selectedFilter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardHeader
          title="Recent High-Intent Leads"
          subtitle="Qualified inbound prospects with autonomous scoring"
          className="border-b-0 pb-0 mb-0"
        />

        <Link
          href="/leads"
          className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View all leads</span>
          <HiOutlineArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Quick Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <FilterPill
          label="All Leads"
          count={mockRecentLeads.length}
          isActive={selectedFilter === "All"}
          onClick={() => setSelectedFilter("All")}
        />
        <FilterPill
          label="Score > 90"
          count={mockRecentLeads.filter((l) => l.aiQualificationScore >= 90).length}
          isActive={selectedFilter === "High Score"}
          onClick={() => setSelectedFilter("High Score")}
        />
        <FilterPill
          label="WhatsApp"
          count={mockRecentLeads.filter((l) => l.channel === "WhatsApp").length}
          isActive={selectedFilter === "WhatsApp"}
          onClick={() => setSelectedFilter("WhatsApp")}
        />
        <FilterPill
          label="Instagram"
          count={mockRecentLeads.filter((l) => l.channel === "Instagram").length}
          isActive={selectedFilter === "Instagram"}
          onClick={() => setSelectedFilter("Instagram")}
        />
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredLeads.slice(0, 4).map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
}
