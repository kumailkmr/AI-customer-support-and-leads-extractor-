"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { AIBadge } from "@/components/ui/AIBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { mockProspects, ExtendedProspect } from "@/lib/mock-data/prospects";
import {
  RiBuilding4Line,
  RiMapPin2Line,
  RiGlobalLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiSparkling2Fill,
  RiCheckLine,
  RiArrowRightLine,
  RiCloseLine,
} from "react-icons/ri";

export default function DiscoverPage() {
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [hasInstagram, setHasInstagram] = useState(false);
  const [hasWhatsApp, setHasWhatsApp] = useState(false);
  const [analyzingBusiness, setAnalyzingBusiness] = useState<ExtendedProspect | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const filteredBusinesses = mockProspects.filter((biz) => {
    const matchesSearch =
      search === "" ||
      biz.businessName.toLowerCase().includes(search.toLowerCase()) ||
      biz.industry.toLowerCase().includes(search.toLowerCase()) ||
      biz.location.toLowerCase().includes(search.toLowerCase());

    const matchesIndustry =
      selectedIndustry === "All" || biz.industry.toLowerCase() === selectedIndustry.toLowerCase();

    const matchesLocation =
      selectedLocation === "All" || biz.location.toLowerCase() === selectedLocation.toLowerCase();

    const matchesIg = !hasInstagram || !!biz.socialHandles.instagram;
    const matchesWa = !hasWhatsApp || !!biz.socialHandles.whatsapp;

    return matchesSearch && matchesIndustry && matchesLocation && matchesIg && matchesWa;
  });

  return (
    <AppLayout>
      <PageHeader
        title="Discover Businesses"
        subtitle="Find potential businesses and identify opportunities for AI-powered customer acquisition."
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            AI Prospect Discovery
          </span>
        }
        actions={
          <AIActionButton
            label="Scan New Market"
            size="sm"
            variant="solid"
            onClick={() => setAnalyzingBusiness(mockProspects[0])}
          />
        }
      />

      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <Card padding="md" className="border-[#E2E8F0] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              placeholder="Search by business name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />

            <Select
              options={[
                { label: "All Industries", value: "All" },
                { label: "Hospitality", value: "Hospitality" },
                { label: "Healthcare", value: "Healthcare" },
                { label: "Real Estate", value: "Real Estate" },
                { label: "Healthcare & Aesthetics", value: "Healthcare & Aesthetics" },
              ]}
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            />

            <Select
              options={[
                { label: "All Locations", value: "All" },
                { label: "Srinagar", value: "Srinagar" },
                { label: "Delhi", value: "Delhi" },
                { label: "Mumbai", value: "Mumbai" },
                { label: "Miami, FL", value: "Miami, FL" },
              ]}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-[#F1F5F9] flex-wrap">
            <span className="text-xs font-semibold text-[#64748B]">Channel Filters:</span>
            <Checkbox
              checked={hasInstagram}
              onChange={(e) => setHasInstagram(e.target.checked)}
              label="Has Instagram Account"
            />
            <Checkbox
              checked={hasWhatsApp}
              onChange={(e) => setHasWhatsApp(e.target.checked)}
              label="Has WhatsApp Business"
            />
          </div>
        </Card>

        {/* Business Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>
              Showing <strong className="text-[#0F172A]">{filteredBusinesses.length}</strong> target businesses
            </span>
            <span>Sorted by AI Relevance Score</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBusinesses.map((biz) => (
              <Card
                key={biz.id}
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
                        <h4 className="text-sm font-bold text-[#0F172A]">
                          {biz.businessName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                          <span>{biz.industry}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <RiMapPin2Line className="h-3 w-3" />
                            {biz.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                          biz.aiOpportunity === "High"
                            ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                            : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                        }`}
                      >
                        {biz.aiOpportunity} Opportunity
                      </span>
                    </div>
                  </div>

                  {/* Channel Badges */}
                  <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                    {biz.socialHandles.website && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569]">
                        <RiGlobalLine className="h-3 w-3 text-[#2563EB]" />
                        Website
                      </span>
                    )}
                    {biz.socialHandles.instagram && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FDF2F8] border border-[#FBCFE8] text-[11px] text-[#9D174D]">
                        <RiInstagramLine className="h-3 w-3 text-[#E1306C]" />
                        Instagram
                      </span>
                    )}
                    {biz.socialHandles.whatsapp && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#047857]">
                        <RiWhatsappLine className="h-3 w-3 text-[#10B981]" />
                        WhatsApp
                      </span>
                    )}
                  </div>

                  {/* Potential Services */}
                  <div className="mt-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
                      AI Acquisition Potential:
                    </span>
                    <ul className="text-xs text-[#475569] space-y-1">
                      {biz.potentialServices.map((svc, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-1.5">
                          <RiCheckLine className="h-3.5 w-3.5 text-[#10B981] flex-shrink-0" />
                          <span>{svc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <AIBadge confidence={biz.relevanceScore} size="sm" label="Match Score" />
                  <AIActionButton
                    size="sm"
                    variant="solid"
                    label="Analyze"
                    onClick={() => {
                      setAnalyzingBusiness(biz);
                      setIsSaved(false);
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* AI Business Opportunity Analysis Modal */}
      {analyzingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setAnalyzingBusiness(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F5F3FF] text-[#8B5CF6]">
                  <RiSparkling2Fill className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    AI Acquisition Audit: {analyzingBusiness.businessName}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {analyzingBusiness.industry} · {analyzingBusiness.location}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnalyzingBusiness(null)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <span className="text-xs font-bold text-[#0F172A] block">
                  Identified Acquisition Bottlenecks
                </span>
                <ul className="text-xs text-[#475569] space-y-1 list-disc list-inside">
                  {analyzingBusiness.identifiedPainPoints.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#F5F3FF]/70 rounded-xl border border-[#DDD6FE] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7C3AED]">
                    Recommended Pitch Angle
                  </span>
                  <AIBadge confidence={analyzingBusiness.relevanceScore} size="sm" />
                </div>
                <p className="text-xs text-[#4C1D95] font-medium leading-relaxed">
                  {analyzingBusiness.suggestedAngle}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs px-2 text-[#64748B]">
                <span>Projected Monthly Opportunity:</span>
                <strong className="text-sm font-bold text-[#10B981]">
                  ₹8,999 – ₹15,000 / mo
                </strong>
              </div>
            </div>

            <div className="border-t border-[#F1F5F9] pt-3 flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAnalyzingBusiness(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}
                onClick={() => {
                  setIsSaved(true);
                  setTimeout(() => setAnalyzingBusiness(null), 800);
                }}
              >
                {isSaved ? "Saved to Prospects!" : "Convert to Active Prospect"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
