"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { StatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterPill } from "@/components/ui/FilterPill";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import {
  RiBuilding4Line,
  RiGlobalLine,
  RiListCheck,
  RiLayoutGridLine,
  RiAddLine,
  RiCloseLine,
  RiArrowRightLine,
} from "react-icons/ri";

export interface ProspectItem {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  website: string;
  opportunity: "High" | "Medium" | "Low";
  status: "Found" | "Researching" | "Qualified" | "Demo Ready" | "Contacted" | "Replied";
  lastActivity: string;
}

export default function ProspectsPage() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Editable local state list of prospects
  const [prospectsList, setProspectsList] = useState<ProspectItem[]>([
    {
      id: "p_1",
      businessName: "Alpine Grand Hotel",
      industry: "Hospitality",
      location: "Srinagar",
      website: "alpinegrandhotel.example.com",
      opportunity: "High",
      status: "Demo Ready",
      lastActivity: "2h ago",
    },
    {
      id: "p_2",
      businessName: "PrimeCare Clinic",
      industry: "Healthcare",
      location: "Delhi",
      website: "primecareclinic.example.com",
      opportunity: "Medium",
      status: "Contacted",
      lastActivity: "5h ago",
    },
    {
      id: "p_3",
      businessName: "Zenith Real Estate Group",
      industry: "Real Estate",
      location: "Mumbai",
      website: "zenithproperties.example.com",
      opportunity: "High",
      status: "Researching",
      lastActivity: "Yesterday",
    },
    {
      id: "p_4",
      businessName: "Catalyst Medical Aesthetics",
      industry: "Aesthetics",
      location: "Miami, FL",
      website: "catalystmed.example.com",
      opportunity: "High",
      status: "Qualified",
      lastActivity: "1d ago",
    },
    {
      id: "p_5",
      businessName: "Apex Solar Commercial",
      industry: "CleanTech",
      location: "Austin, TX",
      website: "apexsolar.example.com",
      opportunity: "Medium",
      status: "Replied",
      lastActivity: "2d ago",
    },
  ]);

  // Form state for new prospect
  const [newBizName, setNewBizName] = useState("");
  const [newIndustry, setNewIndustry] = useState("Hospitality");
  const [newLocation, setNewLocation] = useState("");

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;

    const newEntry: ProspectItem = {
      id: `p_${Date.now()}`,
      businessName: newBizName,
      industry: newIndustry,
      location: newLocation || "Remote / Online",
      website: `${newBizName.toLowerCase().replace(/\s+/g, "")}.example.com`,
      opportunity: "High",
      status: "Found",
      lastActivity: "Just now",
    };

    setProspectsList([newEntry, ...prospectsList]);
    setNewBizName("");
    setNewLocation("");
    setIsAddModalOpen(false);
  };

  const filtered = prospectsList.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.businessName.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || p.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statuses: ("All" | ProspectItem["status"])[] = [
    "All",
    "Found",
    "Researching",
    "Qualified",
    "Demo Ready",
    "Contacted",
    "Replied",
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Prospects"
        subtitle="Target businesses and organizations you want to acquire as NEXUS AI clients."
        badge={
          <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full">
            {prospectsList.length} Active Targets
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
                title="Table View"
              >
                <RiListCheck className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === "cards"
                    ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
                title="Card View"
              >
                <RiLayoutGridLine className="h-4 w-4" />
              </button>
            </div>

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

      <div className="space-y-4">
        {/* Search & Status Pill Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {statuses.map((st) => (
              <FilterPill
                key={st}
                label={st}
                count={
                  st === "All"
                    ? prospectsList.length
                    : prospectsList.filter((p) => p.status === st).length
                }
                isActive={selectedStatus === st}
                onClick={() => setSelectedStatus(st)}
              />
            ))}
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              placeholder="Filter prospects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
          </div>
        </div>

        {/* View Content: Table or Cards */}
        {viewMode === "table" ? (
          <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Business</th>
                    <th className="py-3 px-4">Industry</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Website</th>
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                            <RiBuilding4Line className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                            {item.businessName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">{item.industry}</td>
                      <td className="py-3.5 px-4 text-[#64748B]">{item.location}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-[#2563EB] flex items-center gap-1">
                          <RiGlobalLine className="h-3 w-3 text-[#64748B]" />
                          {item.website}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full font-semibold text-[10px] border ${
                            item.opportunity === "High"
                              ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                              : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                          }`}
                        >
                          {item.opportunity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          status={
                            item.status === "Demo Ready"
                              ? "Demo"
                              : item.status === "Replied"
                              ? "Qualified"
                              : item.status === "Contacted"
                              ? "Contacted"
                              : item.status === "Researching"
                              ? "Interested"
                              : "New"
                          }
                          size="sm"
                        >
                          {item.status}
                        </StatusBadge>
                      </td>
                      <td className="py-3.5 px-4 text-[#94A3B8]">{item.lastActivity}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <AIActionButton
                            size="sm"
                            variant="outline"
                            label="Pitch"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <Card
                key={item.id}
                padding="md"
                className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                      <RiBuilding4Line className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">
                        {item.businessName}
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        {item.industry} · {item.location}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.opportunity === "High"
                        ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                        : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                    }`}
                  >
                    {item.opportunity}
                  </span>
                </div>

                <div className="mt-3.5 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <StatusBadge
                    status={item.status === "Demo Ready" ? "Demo" : item.status === "Replied" ? "Qualified" : "New"}
                    size="sm"
                  >
                    {item.status}
                  </StatusBadge>
                  <AIActionButton size="sm" variant="solid" label="Generate Pitch" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Prospect Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A]">
                Add Target Prospect
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProspect} className="space-y-4 py-4">
              <TextInput
                label="Business Name"
                placeholder="e.g. Skyline Luxury Suites"
                value={newBizName}
                onChange={(e) => setNewBizName(e.target.value)}
                required
              />

              <Select
                label="Industry"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                options={[
                  { label: "Hospitality", value: "Hospitality" },
                  { label: "Healthcare", value: "Healthcare" },
                  { label: "Real Estate", value: "Real Estate" },
                  { label: "Aesthetics", value: "Aesthetics" },
                  { label: "CleanTech", value: "CleanTech" },
                ]}
              />

              <TextInput
                label="Location (City / Region)"
                placeholder="e.g. Srinagar, Delhi, Mumbai"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
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
                  Save Prospect
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
