"use client";

import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { DiscoveryBusinessCard } from "@/components/prospects/DiscoveryBusinessCard";
import { ResearchDrawer } from "@/components/prospects/ResearchDrawer";
import { useProspects } from "@/lib/store/prospects-store";
import { BusinessProspect } from "@/types/prospects";
import {
  RiSparkling2Fill,
  RiFilterLine,
  RiRefreshLine,
  RiCheckLine,
  RiCloseLine,
  RiCompass3Line,
} from "react-icons/ri";

export default function DiscoverPage() {
  const { businesses, addProspect } = useProspects();

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [hasWebsiteOnly, setHasWebsiteOnly] = useState(false);
  const [hasInstagramOnly, setHasInstagramOnly] = useState(false);
  const [hasWhatsAppOnly, setHasWhatsAppOnly] = useState(false);
  const [hasFacebookOnly, setHasFacebookOnly] = useState(false);
  const [sortBy, setSortBy] = useState("fit_desc");

  // Drawer & Alert State
  const [researchingBusiness, setResearchingBusiness] =
    useState<BusinessProspect | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Example search queries suggested by prompt
  const sampleQueries = [
    "Hotels in Srinagar",
    "Clinics in Delhi",
    "Real estate in Mumbai",
    "Restaurants in Delhi",
    "Real estate in Dubai",
    "Travel in Kashmir",
  ];

  const handleApplyQuery = (query: string) => {
    setSearch(query);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedIndustry("All");
    setSelectedLocation("All");
    setSelectedOpportunity("All");
    setSelectedStatus("All");
    setHasWebsiteOnly(false);
    setHasInstagramOnly(false);
    setHasWhatsAppOnly(false);
    setHasFacebookOnly(false);
    setSortBy("fit_desc");
  };

  const isFilterActive =
    search !== "" ||
    selectedIndustry !== "All" ||
    selectedLocation !== "All" ||
    selectedOpportunity !== "All" ||
    selectedStatus !== "All" ||
    hasWebsiteOnly ||
    hasInstagramOnly ||
    hasWhatsAppOnly ||
    hasFacebookOnly ||
    sortBy !== "fit_desc";

  // Filter & Sort Logic
  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return businesses
      .filter((biz) => {
        // Broad search matching name, industry, category, location, city, or pain points
        const matchesSearch =
          !query ||
          biz.businessName.toLowerCase().includes(query) ||
          biz.industry.toLowerCase().includes(query) ||
          biz.category.toLowerCase().includes(query) ||
          biz.location.toLowerCase().includes(query) ||
          biz.city.toLowerCase().includes(query) ||
          biz.identifiedPainPoints.some((p) => p.toLowerCase().includes(query));

        // Industry filter
        const matchesIndustry =
          selectedIndustry === "All" ||
          biz.industry.toLowerCase() === selectedIndustry.toLowerCase();

        // Location filter
        const matchesLocation =
          selectedLocation === "All" ||
          biz.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
          biz.city.toLowerCase() === selectedLocation.toLowerCase();

        // Opportunity level filter
        const matchesOpportunity =
          selectedOpportunity === "All" ||
          biz.opportunityLevel.toLowerCase() ===
            selectedOpportunity.toLowerCase();

        // Status filter
        const matchesStatus =
          selectedStatus === "All" ||
          biz.status.toLowerCase() === selectedStatus.toLowerCase();

        // Channel filters
        const matchesWebsite = !hasWebsiteOnly || biz.hasWebsite;
        const matchesIg =
          !hasInstagramOnly || !!biz.socialPresence.instagram?.active;
        const matchesWa =
          !hasWhatsAppOnly ||
          !!biz.socialPresence.whatsapp?.businessVerified;
        const matchesFb =
          !hasFacebookOnly || !!biz.socialPresence.facebook?.active;

        return (
          matchesSearch &&
          matchesIndustry &&
          matchesLocation &&
          matchesOpportunity &&
          matchesStatus &&
          matchesWebsite &&
          matchesIg &&
          matchesWa &&
          matchesFb
        );
      })
      .sort((a, b) => {
        if (sortBy === "fit_desc") return b.nexusFitScore - a.nexusFitScore;
        if (sortBy === "fit_asc") return a.nexusFitScore - b.nexusFitScore;
        if (sortBy === "alpha")
          return a.businessName.localeCompare(b.businessName);
        if (sortBy === "recent_discovered")
          return (
            new Date(b.discoveredAt).getTime() -
            new Date(a.discoveredAt).getTime()
          );
        return 0;
      });
  }, [
    businesses,
    search,
    selectedIndustry,
    selectedLocation,
    selectedOpportunity,
    selectedStatus,
    hasWebsiteOnly,
    hasInstagramOnly,
    hasWhatsAppOnly,
    hasFacebookOnly,
    sortBy,
  ]);

  const handleAddToProspects = (biz: BusinessProspect) => {
    addProspect(biz.id);
    setAddedToast(`Added "${biz.businessName}" to active prospects.`);
    setTimeout(() => setAddedToast(null), 3500);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Discover Businesses"
        subtitle="Find businesses that may benefit from NEXUS AI and identify potential acquisition opportunities."
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            AI Prospect Discovery
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            {isFilterActive && (
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<RiRefreshLine className="h-3.5 w-3.5" />}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RiCompass3Line className="h-3.5 w-3.5 text-[#2563EB]" />}
              onClick={() => {
                const randomBiz =
                  businesses[Math.floor(Math.random() * businesses.length)];
                setResearchingBusiness(randomBiz);
              }}
            >
              Random Market Deep Dive
            </Button>
          </div>
        }
      />

      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#334155] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="p-1 rounded-full bg-[#10B981] text-white">
            <RiCheckLine className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium">{addedToast}</span>
          <button
            type="button"
            onClick={() => setAddedToast(null)}
            className="text-[#94A3B8] hover:text-white p-1"
          >
            <RiCloseLine className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Prominent Search & Multi-Filter Workspace */}
        <Card padding="md" className="border-[#E2E8F0] space-y-4 shadow-xs">
          {/* Main Search Input */}
          <div className="relative">
            <SearchInput
              placeholder="Search businesses, industries or locations (e.g. Hotels in Srinagar, Clinics in Delhi, Real estate in Dubai)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              className="text-sm py-2.5"
            />
          </div>

          {/* Quick Query Suggestions */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#64748B] font-semibold text-[11px]">
              Suggestions:
            </span>
            {sampleQueries.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleApplyQuery(q)}
                className={`px-2 py-0.5 rounded-full border text-[11px] transition-colors ${
                  search.toLowerCase() === q.toLowerCase()
                    ? "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] font-bold"
                    : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Structured Dropdown Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-[#F1F5F9]">
            <Select
              label="Industry"
              options={[
                { label: "All Industries", value: "All" },
                { label: "Hospitality", value: "Hospitality" },
                { label: "Healthcare", value: "Healthcare" },
                { label: "Real Estate", value: "Real Estate" },
                { label: "Travel & Tourism", value: "Travel & Tourism" },
                { label: "Restaurants & Dining", value: "Restaurants & Dining" },
                { label: "Education & Coaching", value: "Education & Coaching" },
                { label: "Professional Services", value: "Professional Services" },
              ]}
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            />

            <Select
              label="Location / City"
              options={[
                { label: "All Locations", value: "All" },
                { label: "Srinagar, Kashmir", value: "Srinagar" },
                { label: "New Delhi", value: "Delhi" },
                { label: "Mumbai", value: "Mumbai" },
                { label: "Dubai, UAE", value: "Dubai" },
                { label: "Bengaluru", value: "Bengaluru" },
                { label: "Leh Ladakh", value: "Leh" },
                { label: "Miami, FL", value: "Miami" },
                { label: "Noida, UP", value: "Noida" },
              ]}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />

            <Select
              label="Opportunity Level"
              options={[
                { label: "All Levels", value: "All" },
                { label: "High Opportunity", value: "High" },
                { label: "Medium Opportunity", value: "Medium" },
                { label: "Low Opportunity", value: "Low" },
              ]}
              value={selectedOpportunity}
              onChange={(e) => setSelectedOpportunity(e.target.value)}
            />

            <Select
              label="Pipeline Status"
              options={[
                { label: "All Statuses", value: "All" },
                { label: "Found", value: "Found" },
                { label: "Researching", value: "Researching" },
                { label: "Qualified", value: "Qualified" },
                { label: "Demo Ready", value: "Demo Ready" },
                { label: "Contacted", value: "Contacted" },
              ]}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />

            <Select
              label="Sort By"
              options={[
                { label: "Highest Potential Fit", value: "fit_desc" },
                { label: "Lowest Potential Fit", value: "fit_asc" },
                { label: "Recently Discovered", value: "recent_discovered" },
                { label: "Alphabetical (A-Z)", value: "alpha" },
              ]}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>

          {/* Channel Filter Checkboxes */}
          <div className="flex items-center gap-6 pt-3 border-t border-[#F1F5F9] flex-wrap text-xs">
            <span className="font-semibold text-[#64748B] flex items-center gap-1">
              <RiFilterLine className="h-3.5 w-3.5 text-[#2563EB]" />
              Digital Presence Filters:
            </span>
            <Checkbox
              checked={hasWebsiteOnly}
              onChange={(e) => setHasWebsiteOnly(e.target.checked)}
              label="Active Website"
            />
            <Checkbox
              checked={hasInstagramOnly}
              onChange={(e) => setHasInstagramOnly(e.target.checked)}
              label="Instagram Profile"
            />
            <Checkbox
              checked={hasWhatsAppOnly}
              onChange={(e) => setHasWhatsAppOnly(e.target.checked)}
              label="WhatsApp Business Line"
            />
            <Checkbox
              checked={hasFacebookOnly}
              onChange={(e) => setHasFacebookOnly(e.target.checked)}
              label="Facebook Page"
            />
          </div>
        </Card>

        {/* Discovery Results Header */}
        <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-[#0F172A]">{filteredBusinesses.length}</strong> discovered businesses
            </span>
            <span>·</span>
            <span>
              <strong className="text-[#2563EB]">
                {filteredBusinesses.filter((b) => b.isProspect).length}
              </strong>{" "}
              already in active prospects
            </span>
          </div>

          {isFilterActive && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[#2563EB] hover:underline font-medium text-xs"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Results Grid or Empty State */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBusinesses.map((biz) => (
              <DiscoveryBusinessCard
                key={biz.id}
                business={biz}
                onResearch={(b) => setResearchingBusiness(b)}
                onAddToProspects={(b) => handleAddToProspects(b)}
              />
            ))}
          </div>
        ) : (
          <EmptyStateCard
            icon={<RiCompass3Line className="h-10 w-10 text-[#94A3B8]" />}
            title="No matching businesses discovered"
            description="No businesses in the discovery dataset match your search query or channel filters. Try clearing some filters or searching a different industry."
            actionLabel="Reset Discovery Filters"
            onAction={handleClearFilters}
          />
        )}
      </div>

      {/* Slide-Out Research Drawer */}
      <ResearchDrawer
        business={researchingBusiness}
        isOpen={!!researchingBusiness}
        onClose={() => setResearchingBusiness(null)}
      />
    </AppLayout>
  );
}
