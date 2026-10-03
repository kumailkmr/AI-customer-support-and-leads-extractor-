"use client";

import React from "react";
import Link from "next/link";
import { ClientLead, ClientLeadStatus } from "@/types/leads";
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
} from "react-icons/ri";

interface LeadsTableProps {
  leads: ClientLead[];
  onUpdateStatus: (id: string, status: ClientLeadStatus) => void;
  onDeleteLead: (id: string) => void;
}

export function LeadsTable({ leads, onUpdateStatus }: LeadsTableProps) {
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
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
              <th className="py-3 px-4">Lead</th>
              <th className="py-3 px-3">Client</th>
              <th className="py-3 px-3">Channel / Source</th>
              <th className="py-3 px-3">Buyer Intent</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Qualification</th>
              <th className="py-3 px-3">Next Follow-Up</th>
              <th className="py-3 px-3">Value</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {leads.map((lead) => {
              const statusCfg = LEAD_STATUS_CONFIG[lead.status] || LEAD_STATUS_CONFIG.NEW;
              const intentCfg = LEAD_INTENT_LABELS[lead.intent] || { label: lead.intent, badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" };
              const qualCfg = QUALIFICATION_STATUS_CONFIG[lead.qualificationStatus] || QUALIFICATION_STATUS_CONFIG.NOT_STARTED;

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-[#F8FAFC] transition-colors group"
                >
                  {/* Lead Cell */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors flex items-center gap-1.5"
                      >
                        <span>{lead.name}</span>
                      </Link>
                      <div className="text-[11px] text-[#64748B] space-x-2">
                        {lead.phone && <span>{lead.phone}</span>}
                        {lead.email && <span>· {lead.email}</span>}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap pt-0.5">
                        {lead.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-1.5 py-0.2 bg-[#F1F5F9] text-[#475569] rounded font-medium border border-[#E2E8F0]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Client Cell */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <RiBuilding4Line className="h-3.5 w-3.5 text-[#2563EB] flex-shrink-0" />
                      <span className="font-semibold text-[#0F172A] truncate max-w-[140px]" title={lead.clientName}>
                        {lead.clientName}
                      </span>
                    </div>
                  </td>

                  {/* Channel / Source */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {getChannelIcon(lead.channel)}
                        <span className="font-medium text-[#334155]">{lead.channel}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B] block">
                        via {lead.source} · <span className="text-[#8B5CF6]">Simulated</span>
                      </span>
                    </div>
                  </td>

                  {/* Buyer Intent */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${intentCfg.badge}`}
                    >
                      {intentCfg.label}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-3">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value as ClientLeadStatus)}
                      aria-label="Change status"
                      className={`text-[11px] font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[#2563EB] ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.badgeBorder}`}
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
                  </td>

                  {/* Qualification Score */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${qualCfg.badgeBg} ${qualCfg.badgeText} ${qualCfg.badgeBorder}`}
                        >
                          {qualCfg.label}
                        </span>
                        <span className="text-[11px] font-bold text-[#0F172A]">{lead.score}%</span>
                      </div>
                      <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10B981] rounded-full"
                          style={{ width: `${Math.min(100, lead.score)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Next Follow-Up */}
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] text-[#475569] font-medium whitespace-nowrap">
                      {lead.nextFollowUpAt || "None scheduled"}
                    </span>
                  </td>

                  {/* Estimated Value */}
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-[#0F172A]">
                      {formatCurrency(lead.estimatedValue)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {lead.conversationId && (
                        <Link
                          href={`/inbox?conversationId=${lead.conversationId}`}
                          className="p-1.5 text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg border border-transparent hover:border-[#BFDBFE] transition-colors"
                          title="Open live conversation"
                        >
                          <RiChat1Line className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        href={`/leads/${lead.id}`}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] hover:text-[#2563EB] bg-[#F8FAFC] hover:bg-white rounded-lg border border-[#E2E8F0] transition-colors flex items-center gap-1"
                      >
                        <span>Dossier</span>
                        <RiArrowRightLine className="h-3 w-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
