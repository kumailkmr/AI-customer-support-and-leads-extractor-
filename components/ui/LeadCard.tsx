"use client";

import React from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Lead } from "@/types";
import { Card } from "./Card";
import { StatusBadge } from "./Badge";
import { AIBadge } from "./AIBadge";
import {
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
} from "react-icons/ri";
import { HiOutlineChevronRight } from "react-icons/hi2";

export interface LeadCardProps {
  lead: Lead;
  onSelect?: (lead: Lead) => void;
  className?: string;
}

export function LeadCard({ lead, onSelect, className }: LeadCardProps) {
  const getChannelIcon = () => {
    switch (lead.channel) {
      case "Instagram":
        return <RiInstagramLine className="text-[#E1306C] h-3.5 w-3.5" />;
      case "WhatsApp":
        return <RiWhatsappLine className="text-[#10B981] h-3.5 w-3.5" />;
      case "Facebook":
        return <RiFacebookCircleLine className="text-[#1877F2] h-3.5 w-3.5" />;
      case "Website":
        return <RiGlobalLine className="text-[#2563EB] h-3.5 w-3.5" />;
      case "Email":
        return <RiMailLine className="text-[#64748B] h-3.5 w-3.5" />;
    }
  };

  return (
    <Card
      variant="interactive"
      padding="sm"
      onClick={() => onSelect?.(lead)}
      className={cn(
        "group transition-all duration-150 border-[#E2E8F0] hover:border-[#CBD5E1]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            {lead.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lead.avatarUrl}
                alt={lead.fullName}
                className="h-10 w-10 rounded-full object-cover border border-[#E2E8F0]"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center border border-[#BFDBFE]">
                {lead.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-xs border border-[#E2E8F0]">
              {getChannelIcon()}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#2563EB] transition-colors">
                {lead.fullName}
              </h4>
              <StatusBadge status={lead.status} size="sm" />
            </div>
            <p className="text-xs text-[#64748B] truncate">
              {lead.role} · <span className="font-medium text-[#172033]">{lead.company}</span>
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-sm font-bold text-[#0F172A] block">
            {formatCurrency(lead.estimatedValue)}
          </span>
          <span className="text-[11px] text-[#94A3B8]">Est. Value</span>
        </div>
      </div>

      {lead.aiSummary && (
        <div className="mt-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-2.5 flex items-start gap-2">
          <AIBadge label="AI Summary" size="sm" />
          <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
            {lead.aiSummary}
          </p>
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium text-[11px]">
            Score: <strong className="text-[#0F172A]">{lead.aiQualificationScore}/100</strong>
          </span>
          {lead.tags.slice(0, 2).map((t) => (
            <span key={t} className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF] text-[11px] font-medium">
              {t}
            </span>
          ))}
        </div>

        <span className="inline-flex items-center gap-0.5 text-xs text-[#2563EB] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View Lead <HiOutlineChevronRight className="h-3 w-3" />
        </span>
      </div>
    </Card>
  );
}
