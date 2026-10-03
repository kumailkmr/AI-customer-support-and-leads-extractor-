"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BusinessProspect, ProspectPipelineStatus } from "@/types/prospects";
import { useProspects } from "@/lib/store/prospects-store";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import {
  RiCloseLine,
  RiBuilding4Line,
  RiMapPin2Line,
  RiGlobalLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiGoogleLine,
  RiFileCopyLine,
  RiCheckLine,
  RiSparkling2Fill,
  RiArrowRightLine,
  RiMailLine,
  RiPhoneLine,
  RiAlertLine,
  RiShieldCheckLine,
  RiUserSearchLine,
  RiTimeLine,
  RiChatSmile3Line,
  RiFilterLine,
} from "react-icons/ri";

interface ResearchDrawerProps {
  business: BusinessProspect | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResearchDrawer({ business, isOpen, onClose }: ResearchDrawerProps) {
  const { addProspect, updateProspectStatus } = useProspects();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !business) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStatusChange = (newStatus: ProspectPipelineStatus) => {
    updateProspectStatus(business.id, newStatus);
  };

  const handleAddToProspects = () => {
    addProspect(business.id);
  };

  const researchStatuses: ProspectPipelineStatus[] = [
    "FOUND",
    "RESEARCHING",
    "QUALIFIED",
    "DEMO READY",
    "CONTACTED",
    "LOST",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-[#E2E8F0] flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#2563EB] shadow-xs">
                <RiBuilding4Line className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0F172A]">
                    {business.businessName}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      business.opportunityLevel === "High"
                        ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                        : business.opportunityLevel === "Medium"
                        ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                        : "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]"
                    }`}
                  >
                    {business.opportunityLevel} Opportunity
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {business.category} · {business.location}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-white border border-transparent hover:border-[#E2E8F0] transition-colors"
              title="Close panel"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status & Fit Score Banner */}
            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-wider">
                    NEXUS Fit Score:
                  </span>
                  <span className="text-lg font-extrabold text-[#1E40AF]">
                    {business.nexusFitScore} / 100
                  </span>
                </div>
                <p className="text-xs text-[#3B82F6] font-medium leading-relaxed">
                  {business.nexusFitRationale}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#60A5FA] pt-0.5">
                  <RiShieldCheckLine className="h-3.5 w-3.5" />
                  <span>Observational potential based on public digital footprint.</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <StatusBadge
                  status={
                    business.status === "DEMO READY" || business.status === "DEMO"
                      ? "Demo"
                      : business.status === "QUALIFIED" || business.status === "PROPOSAL" || business.status === "NEGOTIATION"
                      ? "Qualified"
                      : business.status === "RESEARCHING" || business.status === "REPLIED"
                      ? "Interested"
                      : business.status === "CONTACTED"
                      ? "Contacted"
                      : business.status === "WON"
                      ? "Closed"
                      : "New"
                  }
                  size="md"
                >
                  {business.status}
                </StatusBadge>
              </div>
            </div>

            {/* Editable Research Status Bar */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <RiUserSearchLine className="h-3.5 w-3.5 text-[#2563EB]" />
                  Update Research Stage
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Click to transition target status
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {researchStatuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                      business.status === st
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                        : "bg-white text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Digital Presence & Social Channels */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Digital Presence & Channel Footprint
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Website */}
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />
                    <div>
                      <span className="font-semibold text-[#0F172A] block">Website</span>
                      <span className="text-[11px] text-[#64748B] truncate max-w-[130px] block">
                        {business.hasWebsite ? "Available" : "Not Found"}
                      </span>
                    </div>
                  </div>
                  {business.hasWebsite && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline text-[11px] font-medium"
                    >
                      Visit
                    </a>
                  )}
                </div>

                {/* Instagram */}
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />
                    <div>
                      <span className="font-semibold text-[#0F172A] block">Instagram</span>
                      <span className="text-[11px] text-[#64748B]">
                        {business.socialPresence.instagram?.handle || "No profile"}
                      </span>
                    </div>
                  </div>
                  {business.socialPresence.instagram?.followers && (
                    <span className="text-[10px] font-bold text-[#9D174D] bg-[#FDF2F8] px-1.5 py-0.5 rounded border border-[#FBCFE8]">
                      {business.socialPresence.instagram.followers}
                    </span>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />
                    <div>
                      <span className="font-semibold text-[#0F172A] block">WhatsApp</span>
                      <span className="text-[11px] text-[#64748B]">
                        {business.socialPresence.whatsapp?.number || "No direct line"}
                      </span>
                    </div>
                  </div>
                  {business.socialPresence.whatsapp?.businessVerified && (
                    <span className="text-[10px] font-bold text-[#047857] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                      Verified
                    </span>
                  )}
                </div>

                {/* Google Business */}
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiGoogleLine className="h-4 w-4 text-[#EA4335]" />
                    <div>
                      <span className="font-semibold text-[#0F172A] block">Google Business</span>
                      <span className="text-[11px] text-[#64748B]">
                        {business.socialPresence.googleBusiness?.rating
                          ? `★ ${business.socialPresence.googleBusiness.rating} (${business.socialPresence.googleBusiness.reviewCount})`
                          : "Unclaimed"}
                      </span>
                    </div>
                  </div>
                  {business.socialPresence.googleBusiness?.claimed && (
                    <span className="text-[10px] font-bold text-[#1E40AF] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-[#BFDBFE]">
                      Claimed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Research Observations (Friction & Acquisition Gaps) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Digital Presence & Acquisition Gaps
                </h4>
                <span className="text-[11px] text-[#94A3B8]">Audit Observations</span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] mb-1">
                    <RiTimeLine className="h-3.5 w-3.5 text-[#2563EB]" />
                    Contact & Inquiry Flow
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.contactFlow}
                  </p>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] mb-1">
                    <RiChatSmile3Line className="h-3.5 w-3.5 text-[#8B5CF6]" />
                    FAQ & Knowledge Access
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.faqAccess}
                  </p>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] mb-1">
                    <RiFilterLine className="h-3.5 w-3.5 text-[#10B981]" />
                    Lead Capture & Booking Mechanisms
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.leadCapture}
                  </p>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] mb-1">
                    <RiAlertLine className="h-3.5 w-3.5 text-[#F59E0B]" />
                    Follow-up & Re-engagement System
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {business.researchObservations.followUp}
                  </p>
                </div>
              </div>
            </div>

            {/* NEXUS Opportunity Signals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                NEXUS Opportunity Signals
              </h4>
              <div className="space-y-2">
                {Object.entries(business.opportunitySignals).map(([key, item]) => (
                  <div
                    key={key}
                    className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-start justify-between gap-3 hover:border-[#CBD5E1] transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0F172A]">
                          {item.label}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            item.impactPotential === "High"
                              ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                              : item.impactPotential === "Medium"
                              ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                              : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]"
                          }`}
                        >
                          {item.impactPotential} Impact
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <span
                      className={`h-2.5 w-2.5 rounded-full flex-shrink-0 mt-1 ${
                        item.enabled ? "bg-[#10B981]" : "bg-[#CBD5E1]"
                      }`}
                      title={item.enabled ? "Feature Applicable" : "Not Priority"}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Information with Copy */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Contact Dossier
              </h4>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 divide-y divide-[#E2E8F0]/70 text-xs">
                {business.phone && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[#64748B] flex items-center gap-2">
                      <RiPhoneLine className="h-4 w-4 text-[#2563EB]" />
                      {business.phone}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(business.phone!, "phone")}
                      className="text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 font-medium text-[11px]"
                    >
                      {copiedField === "phone" ? (
                        <>
                          <RiCheckLine className="h-3.5 w-3.5 text-[#10B981]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <RiFileCopyLine className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                )}

                {business.email && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[#64748B] flex items-center gap-2">
                      <RiMailLine className="h-4 w-4 text-[#2563EB]" />
                      {business.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(business.email!, "email")}
                      className="text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 font-medium text-[11px]"
                    >
                      {copiedField === "email" ? (
                        <>
                          <RiCheckLine className="h-3.5 w-3.5 text-[#10B981]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <RiFileCopyLine className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                )}

                {business.address && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[#64748B] flex items-center gap-2">
                      <RiMapPin2Line className="h-4 w-4 text-[#2563EB]" />
                      {business.address}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(business.address!, "address")}
                      className="text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 font-medium text-[11px]"
                    >
                      {copiedField === "address" ? (
                        <>
                          <RiCheckLine className="h-3.5 w-3.5 text-[#10B981]" />
                          Copied
                        </>
                      ) : (
                        <>
                          <RiFileCopyLine className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Pitch Angle */}
            <div className="p-4 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-1.5">
              <span className="text-xs font-bold text-[#7C3AED] flex items-center gap-1.5">
                <RiSparkling2Fill className="h-3.5 w-3.5" />
                Strategic Acquisition Angle
              </span>
              <p className="text-xs text-[#5B21B6] leading-relaxed font-medium">
                {business.suggestedAngle}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
            <Button size="sm" variant="secondary" onClick={onClose}>
              Close
            </Button>

            <div className="flex items-center gap-2">
              {!business.isProspect ? (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleAddToProspects}
                  leftIcon={<RiCheckLine className="h-4 w-4" />}
                >
                  Add to Prospects
                </Button>
              ) : (
                <Link href={`/prospects/${business.id}/analysis`} onClick={onClose}>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-transparent"
                    leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5" />}
                  >
                    Analyze Opportunity
                  </Button>
                </Link>
              )}

              <Link href={`/prospects/${business.id}`} onClick={onClose}>
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}
                >
                  Open Dossier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
