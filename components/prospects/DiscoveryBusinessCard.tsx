"use client";

import React from "react";
import Link from "next/link";
import { BusinessProspect } from "@/types/prospects";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import {
  RiBuilding4Line,
  RiMapPin2Line,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiGoogleLine,
  RiCheckLine,
  RiSearchLine,
  RiArrowRightLine,
  RiSparkling2Fill,
} from "react-icons/ri";

interface DiscoveryBusinessCardProps {
  business: BusinessProspect;
  onResearch: (business: BusinessProspect) => void;
  onAddToProspects: (business: BusinessProspect) => void;
}

export function DiscoveryBusinessCard({
  business,
  onResearch,
  onAddToProspects,
}: DiscoveryBusinessCardProps) {
  return (
    <Card
      padding="md"
      className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
    >
      <div>
        {/* Top Header: Icon, Name, Category/Location & Opportunity Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] flex-shrink-0 mt-0.5">
              <RiBuilding4Line className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                  {business.businessName}
                </h4>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5 flex-wrap">
                <span className="font-medium text-[#475569]">{business.industry}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <RiMapPin2Line className="h-3 w-3 text-[#94A3B8]" />
                  {business.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
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
            <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.2 rounded border border-[#BFDBFE]">
              {business.nexusFitScore}% Potential Fit
            </span>
          </div>
        </div>

        {/* Digital Presence Channels */}
        <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
          {business.hasWebsite && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569]">
              <RiGlobalLine className="h-3 w-3 text-[#2563EB]" />
              Website
            </span>
          )}
          {business.socialPresence.instagram?.active && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FDF2F8] border border-[#FBCFE8] text-[11px] text-[#9D174D]">
              <RiInstagramLine className="h-3 w-3 text-[#E1306C]" />
              Instagram
              {business.socialPresence.instagram.followers && (
                <span className="text-[10px] opacity-75 font-semibold">
                  ({business.socialPresence.instagram.followers})
                </span>
              )}
            </span>
          )}
          {business.socialPresence.whatsapp?.businessVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] text-[#047857]">
              <RiWhatsappLine className="h-3 w-3 text-[#10B981]" />
              WhatsApp
            </span>
          )}
          {business.socialPresence.facebook?.active && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#1E40AF]">
              <RiFacebookCircleLine className="h-3 w-3 text-[#2563EB]" />
              Facebook
            </span>
          )}
          {business.socialPresence.googleBusiness?.claimed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF2F2] border border-[#FECACA] text-[11px] text-[#991B1B]">
              <RiGoogleLine className="h-3 w-3 text-[#EA4335]" />
              ★ {business.socialPresence.googleBusiness.rating}
            </span>
          )}
        </div>

        {/* AI Opportunity Signals */}
        <div className="mt-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-2.5 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            Identified Acquisition Gaps:
          </span>
          <ul className="text-xs text-[#475569] space-y-1">
            {business.identifiedPainPoints.slice(0, 2).map((pt, pIdx) => (
              <li key={pIdx} className="flex items-start gap-1.5 leading-snug">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                <span className="line-clamp-1">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer: Status & Actions */}
      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
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
          size="sm"
        >
          {business.status}
        </StatusBadge>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RiSearchLine className="h-3.5 w-3.5" />}
            onClick={() => onResearch(business)}
          >
            Research
          </Button>

          {!business.isProspect ? (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiCheckLine className="h-3.5 w-3.5" />}
              onClick={() => onAddToProspects(business)}
            >
              Add to Prospects
            </Button>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href={`/prospects/${business.id}/analysis`}>
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-transparent"
                  leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5" />}
                >
                  Analyze
                </Button>
              </Link>
              <Link href={`/prospects/${business.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}
                >
                  CRM
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
