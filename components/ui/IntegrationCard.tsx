"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChannelType } from "@/types";
import { Card } from "./Card";
import { Switch } from "./Switch";
import { StatusBadge } from "./Badge";
import {
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
} from "react-icons/ri";

export interface IntegrationCardProps {
  channel: ChannelType;
  accountHandle?: string;
  isConnected: boolean;
  activeAutomations: number;
  onToggle?: (connected: boolean) => void;
  className?: string;
}

export function IntegrationCard({
  channel,
  accountHandle,
  isConnected,
  activeAutomations,
  onToggle,
  className,
}: IntegrationCardProps) {
  const getDetails = () => {
    switch (channel) {
      case "Instagram":
        return {
          icon: <RiInstagramLine className="h-6 w-6 text-[#E1306C]" />,
          title: "Instagram DM Automation",
          description: "Auto-reply to story mentions, post comments, and inbound DMs.",
        };
      case "WhatsApp":
        return {
          icon: <RiWhatsappLine className="h-6 w-6 text-[#10B981]" />,
          title: "WhatsApp Cloud API",
          description: "Sub-minute qualification routing and calendar walkthrough hooks.",
        };
      case "Facebook":
        return {
          icon: <RiFacebookCircleLine className="h-6 w-6 text-[#1877F2]" />,
          title: "Facebook Messenger & Lead Ads",
          description: "Instant lead synchronization and automated triage sequences.",
        };
      case "Website":
        return {
          icon: <RiGlobalLine className="h-6 w-6 text-[#2563EB]" />,
          title: "Website Live Widget",
          description: "Embeddable high-converting capture widget with AI triage.",
        };
      case "Email":
        return {
          icon: <RiMailLine className="h-6 w-6 text-[#64748B]" />,
          title: "Email Sequence Engine",
          description: "Smart 48-hour follow-up sequences and objection clearance.",
        };
    }
  };

  const details = getDetails();

  return (
    <Card
      padding="md"
      className={cn(
        "border-[#E2E8F0] transition-all hover:border-[#CBD5E1]",
        isConnected && "border-l-4 border-l-[#10B981]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex-shrink-0">
            {details.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">
                {details.title}
              </h4>
              <StatusBadge
                status={isConnected ? "Active" : "Inactive"}
                size="sm"
              />
            </div>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              {details.description}
            </p>
          </div>
        </div>

        <Switch
          checked={isConnected}
          onChange={(val) => onToggle?.(val)}
          size="sm"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
        <span>
          Handle:{" "}
          <strong className="text-[#0F172A] font-mono text-[11px]">
            {accountHandle || `${channel.toLowerCase()}_nexus_sync`}
          </strong>
        </span>
        <span className="text-[11px] font-medium bg-[#EFF6FF] text-[#1D4ED8] px-2 py-0.5 rounded">
          {activeAutomations} Active Sequences
        </span>
      </div>
    </Card>
  );
}
