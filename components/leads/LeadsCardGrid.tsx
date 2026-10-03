"use client";

import React from "react";
import Link from "next/link";
import { ClientLead, ClientLeadStatus } from "@/types/leads";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  LEAD_STATUS_CONFIG,
  LEAD_INTENT_LABELS,
  QUALIFICATION_STATUS_CONFIG,
} from "@/lib/leads/leads-config";
import { formatCurrency } from "@/lib/utils";
import {
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiPhoneLine,
  RiUserSharedLine,
  RiBuilding4Line,
  RiChat1Line,
  RiArrowRightLine,
  RiCalendarLine,
} from "react-icons/ri";

interface LeadsCardGridProps {
  leads: ClientLead[];
  onUpdateStatus: (id: string, status: ClientLeadStatus) => void;
  onDeleteLead: (id: string) => void;
}

export function LeadsCardGrid({ leads, onUpdateStatus }: LeadsCardGridProps) {
  const getChannelIcon = (ch: ClientLead["channel"]) => {
    switch (ch) {
      case "Website Chat":
        return <RiGlobalLine className="h-3.5 w-3.5 text-[#2563EB]" />;
      case "Instagram":
        return <RiInstagramLine className="h-3.5 w-3.5 text-[#E1306C]" />;
      case "Facebook":
        return <RiFacebookCircleLine className="h-3.5 w-3.5 text-[#1877F2]" />;
      case "WhatsApp":
        return <RiWhatsappLine className="h-3.5 w-3.5 text-[#10B981]" />;
      case "Email":
        return <RiMailLine className="h-3.5 w-3.5 text-[#64748B]" />;
      case "Phone":
        return <RiPhoneLine className="h-3.5 w-3.5 text-[#D97706]" />;
      default:
        return <RiUserSharedLine className="h-3.5 w-3.5 text-[#475569]" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {leads.map((lead) => {
        const statusCfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG.NEW;
        const intentCfg = LEAD_INTENT_LABELS[lead.intent] || { label: lead.intent, badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" };
        const qualCfg = QUALIFICATION_STATUS_CONFIG[lead.qualificationStatus] || QUALIFICATION_STATUS_CONFIG.NOT_STARTED;

        return (
          <Card key={lead.id} padding="md" className="space-y-3.5 hover:shadow-sm transition-all border-[#E2E8F0]">
            {/* Header: Lead Name & Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <Link
                  href={`/leads/${lead.id}`}
                  className="font-bold text-sm text-[#0F172A] hover:text-[#2563EB] transition-colors"
                >
                  {lead.name}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <RiBuilding4Line className="h-3.5 w-3.5 text-[#2563EB] flex-shrink-0" />
                  <span className="truncate">{lead.clientName}</span>
                </div>
              </div>

              <select
                value={lead.status}
                onChange={(e) => onUpdateStatus(lead.id, e.target.value as ClientLeadStatus)}
                aria-label="Change status"
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#2563EB] ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.badgeBorder}`}
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="QUALIFYING">Qualifying</option>
                <option value="QUALIFIED">Qualified</option>
                <option value="FOLLOW_UP">Follow-Up</option>
                <option value="HUMAN_HANDOFF">Human Handoff</option>
                <option value="CONVERTED">Converted</option>
                <option value="NOT_INTERESTED">Not Interested</option>
                <option value="LOST">Lost</option>
              </select>
            </div>

            {/* Channel, Source & Intent */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] font-medium text-[11px]">
                {getChannelIcon(lead.channel)}
                <span>{lead.channel}</span>
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${intentCfg.badge}`}>
                {intentCfg.label}
              </span>

              <span className="text-[10px] text-[#64748B] ml-auto">
                Value: <strong className="text-[#0F172A]">{formatCurrency(lead.estimatedValue)}</strong>
              </span>
            </div>

            {/* AI Summary Snippet */}
            <div className="p-2.5 rounded-lg bg-[#FAF5FF] border border-[#DDD6FE] text-[11px] text-[#5B21B6] leading-relaxed">
              <p className="line-clamp-2">{lead.aiSummary}</p>
            </div>

            {/* Qualification Progress */}
            <div className="space-y-1 pt-1 border-t border-[#F1F5F9]">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#64748B]">Qualification Progress</span>
                <span className="font-bold text-[#0F172A]">{lead.score}% ({qualCfg.label})</span>
              </div>
              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full"
                  style={{ width: `${Math.min(100, lead.score)}%` }}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] gap-2">
              <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                <RiCalendarLine className="h-3 w-3 text-[#94A3B8]" />
                <span className="truncate">{lead.nextFollowUpAt || "No follow-up"}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {lead.conversationId && (
                  <Link href={`/inbox?conversationId=${lead.conversationId}`}>
                    <Button size="sm" variant="secondary" leftIcon={<RiChat1Line className="h-3.5 w-3.5" />}>
                      Chat
                    </Button>
                  </Link>
                )}
                <Link href={`/leads/${lead.id}`}>
                  <Button size="sm" variant="outline" rightIcon={<RiArrowRightLine className="h-3.5 w-3.5" />}>
                    Dossier
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
