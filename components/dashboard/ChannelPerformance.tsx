"use client";

import React from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { mockChannels } from "@/lib/mock-data/channels";
import {
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
} from "react-icons/ri";

export function ChannelPerformance() {
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Instagram":
        return <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />;
      case "WhatsApp":
        return <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />;
      case "Facebook":
        return <RiFacebookCircleLine className="h-4 w-4 text-[#1877F2]" />;
      case "Website":
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
      case "Email":
        return <RiMailLine className="h-4 w-4 text-[#64748B]" />;
      default:
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
    }
  };

  const totalLeads = mockChannels.reduce((sum, c) => sum + c.totalConversations, 0);

  return (
    <Card padding="md" className="border-[#E2E8F0]">
      <CardHeader
        title="Top Lead Sources"
        subtitle="Inbound lead volume and qualification conversion across channels"
        action={
          <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full">
            {totalLeads} Total Inbound
          </span>
        }
      />

      <div className="space-y-3">
        {mockChannels.map((item) => (
          <div
            key={item.channel}
            className="flex items-center justify-between p-3 rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]/50 hover:bg-white hover:border-[#E2E8F0] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-xs flex-shrink-0">
                {getChannelIcon(item.channel)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0F172A]">
                    {item.channel}
                  </h4>
                  {item.unreadCount > 0 && (
                    <span className="bg-[#2563EB] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] truncate">
                  {item.qualifiedLeads} qualified leads ({item.conversionRate}% conv. rate)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0 text-right">
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">
                  {item.totalConversations}
                </span>
                <span className="text-[10px] text-[#94A3B8]">Leads</span>
              </div>

              <div className="hidden sm:block w-20 bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#10B981] h-full rounded-full"
                  style={{ width: `${Math.min((item.totalConversations / 62) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
