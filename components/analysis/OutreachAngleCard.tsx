"use client";

import React, { useState } from "react";
import { OutreachAngle } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  RiUserVoiceLine,
  RiFileCopyLine,
  RiCheckLine,
  RiChatSmile3Line,
  RiInformationLine,
  RiSparkling2Fill,
} from "react-icons/ri";

interface OutreachAngleCardProps {
  outreachAngle: OutreachAngle;
  onCopyText: (text: string, label: string) => void;
}

export function OutreachAngleCard({
  outreachAngle,
  onCopyText,
}: OutreachAngleCardProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    onCopyText(text, section);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <RiUserVoiceLine className="h-4 w-4 text-[#2563EB]" />
            Suggested Commercial Outreach Angle
          </h3>
          <p className="text-xs text-[#64748B]">
            Internal preparation and conversational hooks to guide cold messaging or initial discovery calls.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={
            copiedSection === "All" ? (
              <RiCheckLine className="h-4 w-4 text-[#10B981]" />
            ) : (
              <RiFileCopyLine className="h-4 w-4" />
            )
          }
          onClick={() =>
            handleCopy(
              `Headline: ${outreachAngle.headline}\n\nPitch Angle: ${outreachAngle.pitchAngle}\n\nSuggested Hook: ${outreachAngle.suggestedHook}\n\nDemo Offer: ${outreachAngle.demoOffer}`,
              "All"
            )
          }
        >
          {copiedSection === "All" ? "Copied All" : "Copy Complete Angle"}
        </Button>
      </div>

      {/* Core Angle Details */}
      <div className="space-y-3">
        {/* Headline */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
            Positioning Headline
          </span>
          <p className="text-sm font-bold text-[#0F172A]">
            {outreachAngle.headline}
          </p>
        </div>

        {/* Strategic Pitch Angle */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] block">
              Strategic Observation & Value Angle
            </span>
            <button
              type="button"
              onClick={() => handleCopy(outreachAngle.pitchAngle, "Pitch")}
              className="text-[11px] font-semibold text-[#64748B] hover:text-[#2563EB] flex items-center gap-1"
            >
              {copiedSection === "Pitch" ? (
                <RiCheckLine className="h-3 w-3 text-[#10B981]" />
              ) : (
                <RiFileCopyLine className="h-3 w-3" />
              )}
              {copiedSection === "Pitch" ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-[#334155] leading-relaxed">
            {outreachAngle.pitchAngle}
          </p>
        </div>

        {/* Conversational Hook */}
        <div className="p-3.5 rounded-xl bg-[#EFF6FF]/40 border border-[#BFDBFE] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E40AF] flex items-center gap-1">
              <RiChatSmile3Line className="h-3.5 w-3.5" />
              Conversational Hook (WhatsApp / Email DM)
            </span>
            <button
              type="button"
              onClick={() => handleCopy(outreachAngle.suggestedHook, "Hook")}
              className="text-[11px] font-semibold text-[#1E40AF] hover:underline flex items-center gap-1"
            >
              {copiedSection === "Hook" ? (
                <RiCheckLine className="h-3 w-3 text-[#10B981]" />
              ) : (
                <RiFileCopyLine className="h-3 w-3" />
              )}
              {copiedSection === "Hook" ? "Copied" : "Copy Hook"}
            </button>
          </div>
          <p className="text-xs text-[#1E3A8A] leading-relaxed font-medium bg-white p-3 rounded-lg border border-[#DBEAFE]">
            &ldquo;{outreachAngle.suggestedHook}&rdquo;
          </p>
        </div>

        {/* Demo Offer */}
        <div className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#DDD6FE] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D28D9] flex items-center gap-1">
              <RiSparkling2Fill className="h-3.5 w-3.5" />
              Low-Friction Interactive Demo Offer
            </span>
            <button
              type="button"
              onClick={() => handleCopy(outreachAngle.demoOffer, "Offer")}
              className="text-[11px] font-semibold text-[#6D28D9] hover:underline flex items-center gap-1"
            >
              {copiedSection === "Offer" ? (
                <RiCheckLine className="h-3 w-3 text-[#10B981]" />
              ) : (
                <RiFileCopyLine className="h-3 w-3" />
              )}
              {copiedSection === "Offer" ? "Copied" : "Copy Offer"}
            </button>
          </div>
          <p className="text-xs text-[#5B21B6] leading-relaxed font-medium bg-white p-3 rounded-lg border border-[#EDE9FE]">
            &ldquo;{outreachAngle.demoOffer}&rdquo;
          </p>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[11px] text-[#64748B] flex items-center gap-2">
        <RiInformationLine className="h-4 w-4 text-[#8B5CF6] shrink-0" />
        <span>
          Outreach angles are generated for manual human review. NEXUS does not auto-dispatch messages without explicit user approval.
        </span>
      </div>
    </Card>
  );
}
