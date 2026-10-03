"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Prospect } from "@/types";
import { Card } from "./Card";
import { Button } from "./Button";
import { AIBadge } from "./AIBadge";
import {
  RiBuilding4Line,
  RiMapPin2Line,
  RiSendPlaneLine,
} from "react-icons/ri";

export interface ProspectCardProps {
  prospect: Prospect;
  onEnrich?: (prospect: Prospect) => void;
  className?: string;
}

export function ProspectCard({ prospect, onEnrich, className }: ProspectCardProps) {
  return (
    <Card
      variant="default"
      padding="md"
      className={cn("border-[#E2E8F0] hover:border-[#CBD5E1] transition-all", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] flex-shrink-0">
            <RiBuilding4Line className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">
              {prospect.businessName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
              <span>{prospect.industry}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <RiMapPin2Line className="h-3 w-3" />
                {prospect.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-[#10B981] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
            {prospect.relevanceScore}% Match
          </span>
          <span className="text-[10px] text-[#94A3B8] mt-1">Status: {prospect.status}</span>
        </div>
      </div>

      <div className="mt-3.5 space-y-2">
        <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            Identified Pain Points
          </span>
          <ul className="text-xs text-[#475569] space-y-1 list-disc list-inside">
            {prospect.identifiedPainPoints.map((point, idx) => (
              <li key={idx} className="line-clamp-1">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#F5F3FF]/60 border border-[#DDD6FE] rounded-lg p-2.5 flex items-start gap-2">
          <AIBadge label="Angle" size="sm" />
          <p className="text-xs text-[#6D28D9] font-medium leading-relaxed">
            {prospect.suggestedAngle}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
        <span className="text-xs text-[#94A3B8]">
          Channels: {Object.keys(prospect.socialHandles).join(", ")}
        </span>
        <Button
          size="sm"
          variant="primary"
          leftIcon={<RiSendPlaneLine className="h-3.5 w-3.5" />}
          onClick={() => onEnrich?.(prospect)}
        >
          Draft Outreach
        </Button>
      </div>
    </Card>
  );
}
