"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterPill } from "@/components/ui/FilterPill";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { ResearchDrawer } from "@/components/prospects/ResearchDrawer";
import { DiscoveryBusinessCard } from "@/components/prospects/DiscoveryBusinessCard";
import { useProspects } from "@/lib/store/prospects-store";
import { BusinessProspect, ProspectPipelineStatus } from "@/types/prospects";
import {
  RiBuilding4Line,
  RiGlobalLine,
  RiListCheck,
  RiLayoutGridLine,
  RiAddLine,
  RiCloseLine,
  RiArrowRightLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGoogleLine,
  RiCompass3Line,
} from "react-icons/ri";

export default function ProspectsPage() {
  const router = useRouter();
  const { prospects, createCustomProspect, addProspect } = useProspects();

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [researchingBusiness, setResearchingBusiness] =
    useState<BusinessProspect | null>(null);

  // Form state for manual new prospect
  const [newBizName, setNewBizName] = useState("");
  const [newIndustry, setNewIndustry] = useState("Hospitality");
  const [newLocation, setNewLocation] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newOpportunity, setNewOpportunity] = useState<"High" | "Medium" | "Low">("High");

  const handleAddProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;

    createCustomProspect({
      businessName: newBizName,
      industry: newIndustry,
      location: newLocation || "Remote / Unspecified",
      website: newWebsite,
      phone: newPhone,
      opportunityLevel: newOpportunity,
      status: "Researching",
    });

    setNewBizName("");
    setNewLocation("");
    setNewWebsite("");
    setNewPhone("");
    setIsAddModalOpen(false);
  };

  // Filtered prospects
  const filteredProspects = useMemo(() => {
    return prospects.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.businessName.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === "All" || p.status === selectedStatus;

      const matchesIndustry =
        selectedIndustry === "All" ||
        p.industry.toLowerCase() === selectedIndustry.toLowerCase();

      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [prospects, search, selectedStatus, selectedIndustry]);

  const statuses: ("All" | ProspectPipelineStatus)[] = [
    "All",
    "Researching",
    "Qualified",
    "Demo Ready",
    "Contacted",
    "Replied",
    "Demo",
    "Proposal",
    "Won",
  ];

  // Metric counts
  const totalCount = prospects.length;
  const researchingCount = prospects.filter(
    (p) => p.status === "Researching" || p.status === "Found"
  ).length;
  const qualifiedCount = prospects.filter(
    (p) => p.status === "Qualified" || p.status === "Research Complete"
  ).length;
  const demoReadyCount = prospects.filter(
    (p) => p.status === "Demo Ready"
  ).length;
  const contactedCount = prospects.filter(
    (p) => p.status === "Contacted" || p.status === "Replied"
  ).length;

  const isFilterActive =
    search !== "" || selectedStatus !== "All" || selectedIndustry !== "All";

  const handleClearFilters = () => {
    setSearch("");
    setSelectedStatus("All");
    setSelectedIndustry("All");
  };

  return (
    <AppLayout>
      <PageHeader
        title="Prospects"
        subtitle="Target businesses and organizations you want to acquire as NEXUS AI clients."
        badge={
          <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full">
            {totalCount} Active Targets
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

            <Link href="/discover">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<RiCompass3Line className="h-4 w-4 text-[#2563EB]" />}
              >
                Discover More
              </Button>
            </Link>

            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiAddLine className="h-4 w-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Target
            </Button>
          </div>
        }
      />

      <div className="space-y-5">
        {/* Metric Counters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-[#64748B] block">
              Total Targets
            </span>
            <span className="text-xl font-extrabold text-[#0F172A] mt-0.5 block">
              {totalCount}
            </span>
          </div>

          <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-[#64748B] block">
              In Research
            </span>
            <span className="text-xl font-extrabold text-[#2563EB] mt-0.5 block">
              {researchingCount}
            </span>
          </div>

          <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-[#64748B] block">
              Qualified
            </span>
            <span className="text-xl font-extrabold text-[#047857] mt-0.5 block">
              {qualifiedCount}
            </span>
          </div>

          <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs">
            <span className="text-[11px] font-semibold text-[#64748B] block">
              Demo Ready
            </span>
            <span className="text-xl font-extrabold text-[#7C3AED] mt-0.5 block">
              {demoReadyCount}
            </span>
          </div>

          <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-[#64748B] block">
              Contacted / Active
            </span>
            <span className="text-xl font-extrabold text-[#D97706] mt-0.5 block">
              {contactedCount}
            </span>
          </div>
        </div>

        {/* Search & Status Pill Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {statuses.map((st) => (
              <FilterPill
                key={st}
                label={st}
                count={
                  st === "All"
                    ? prospects.length
                    : prospects.filter((p) => p.status === st).length
                }
                isActive={selectedStatus === st}
                onClick={() => setSelectedStatus(st)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isFilterActive && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-[#2563EB] hover:underline font-medium whitespace-nowrap"
              >
                Clear
              </button>
            )}
            <div className="w-full sm:w-64">
              <SearchInput
                placeholder="Filter prospects by name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
              />
            </div>
          </div>
        </div>

        {/* View Content: Table or Cards */}
        {filteredProspects.length > 0 ? (
          viewMode === "table" ? (
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Business Target</th>
                      <th className="py-3 px-4">Industry / Location</th>
                      <th className="py-3 px-4">Opportunity</th>
                      <th className="py-3 px-4">Fit Score</th>
                      <th className="py-3 px-4">Pipeline Status</th>
                      <th className="py-3 px-4">Channels</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredProspects.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F8FAFC] transition-colors group"
                      >
                        {/* Business Name */}
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/prospects/${item.id}`}
                            className="flex items-center gap-2.5"
                          >
                            <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                              <RiBuilding4Line className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors block">
                                {item.businessName}
                              </span>
                              <span className="text-[11px] text-[#64748B]">
                                {item.category}
                              </span>
                            </div>
                          </Link>
                        </td>

                        {/* Industry / Location */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-[#0F172A] block">
                            {item.industry}
                          </span>
                          <span className="text-[#64748B] text-[11px]">
                            {item.location}
                          </span>
                        </td>

                        {/* Opportunity Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full font-semibold text-[10px] border ${
                              item.opportunityLevel === "High"
                                ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                                : item.opportunityLevel === "Medium"
                                ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                                : "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]"
                            }`}
                          >
                            {item.opportunityLevel}
                          </span>
                        </td>

                        {/* Fit Score */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] text-[11px]">
                            {item.nexusFitScore}% Fit
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge
                            status={
                              item.status === "Demo Ready"
                                ? "Demo"
                                : item.status === "Qualified" ||
                                  item.status === "Research Complete"
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

                        {/* Digital Channels */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-[#64748B]">
                            {item.hasWebsite && (
                              <RiGlobalLine
                                className="h-3.5 w-3.5 text-[#2563EB]"
                                title="Website"
                              />
                            )}
                            {item.socialPresence.instagram?.active && (
                              <RiInstagramLine
                                className="h-3.5 w-3.5 text-[#E1306C]"
                                title="Instagram"
                              />
                            )}
                            {item.socialPresence.whatsapp && (
                              <RiWhatsappLine
                                className="h-3.5 w-3.5 text-[#10B981]"
                                title="WhatsApp"
                              />
                            )}
                            {item.socialPresence.facebook?.active && (
                              <RiFacebookCircleLine
                                className="h-3.5 w-3.5 text-[#2563EB]"
                                title="Facebook"
                              />
                            )}
                            {item.socialPresence.googleBusiness?.claimed && (
                              <RiGoogleLine
                                className="h-3.5 w-3.5 text-[#EA4335]"
                                title="Google Business"
                              />
                            )}
                          </div>
                        </td>

                        {/* Last Activity */}
                        <td className="py-3.5 px-4 text-[#94A3B8]">
                          {item.lastActivity}
                        </td>

                        {/* Row Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setResearchingBusiness(item)}
                            >
                              Research
                            </Button>
                            <Link href={`/prospects/${item.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                rightIcon={<RiArrowRightLine className="h-3 w-3" />}
                              >
                                View
                              </Button>
                            </Link>
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
              {filteredProspects.map((item) => (
                <DiscoveryBusinessCard
                  key={item.id}
                  business={item}
                  onResearch={(b) => setResearchingBusiness(b)}
                  onAddToProspects={(b) => addProspect(b.id)}
                />
              ))}
            </div>
          )
        ) : (
          <EmptyStateCard
            icon={<RiCompass3Line className="h-10 w-10 text-[#94A3B8]" />}
            title="No prospects found"
            description={
              isFilterActive
                ? "No active prospects match the selected filter criteria."
                : "You have not added any businesses to your active prospects list yet. Use the Discover tool to scan businesses and add them."
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

      {/* Slide-out Research Drawer */}
      <ResearchDrawer
        business={researchingBusiness}
        isOpen={!!researchingBusiness}
        onClose={() => setResearchingBusiness(null)}
      />

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
                Add Target Prospect Manually
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProspect} className="space-y-3.5 py-4">
              <TextInput
                label="Business / Enterprise Name"
                placeholder="e.g. Skyline Luxury Suites"
                value={newBizName}
                onChange={(e) => setNewBizName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Industry"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  options={[
                    { label: "Hospitality", value: "Hospitality" },
                    { label: "Healthcare", value: "Healthcare" },
                    { label: "Real Estate", value: "Real Estate" },
                    { label: "Travel & Tourism", value: "Travel & Tourism" },
                    { label: "Restaurants & Dining", value: "Restaurants & Dining" },
                    { label: "Education & Coaching", value: "Education & Coaching" },
                    { label: "Professional Services", value: "Professional Services" },
                  ]}
                />

                <Select
                  label="Opportunity Level"
                  value={newOpportunity}
                  onChange={(e) =>
                    setNewOpportunity(e.target.value as "High" | "Medium" | "Low")
                  }
                  options={[
                    { label: "High", value: "High" },
                    { label: "Medium", value: "Medium" },
                    { label: "Low", value: "Low" },
                  ]}
                />
              </div>

              <TextInput
                label="Location (City / Region)"
                placeholder="e.g. Srinagar, Delhi, Mumbai"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />

              <TextInput
                label="Website (Optional)"
                placeholder="https://example.com"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
              />

              <TextInput
                label="Direct Phone (Optional)"
                placeholder="+91 98765 43210"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
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
                  Save to Prospects
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
