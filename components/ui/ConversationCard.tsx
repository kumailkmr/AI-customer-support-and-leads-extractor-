"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types";
import { Card } from "./Card";
import { AIBadge } from "./AIBadge";
import {
  RiInstagramLine,
  RiWhatsappLine,
  RiFacebookCircleLine,
  RiGlobalLine,
  RiMailLine,
} from "react-icons/ri";

export interface ConversationCardProps {
  conversation: Conversation;
  isSelected?: boolean;
  onSelect?: (conversation: Conversation) => void;
  className?: string;
}

export function ConversationCard({
  conversation,
  isSelected = false,
  onSelect,
  className,
}: ConversationCardProps) {
  const getChannelDetails = () => {
    switch (conversation.channel) {
      case "Instagram":
        return {
          icon: <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />,
          bg: "bg-[#FDF2F8]",
        };
      case "WhatsApp":
        return {
          icon: <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />,
          bg: "bg-[#ECFDF5]",
        };
      case "Facebook":
        return {
          icon: <RiFacebookCircleLine className="h-4 w-4 text-[#1877F2]" />,
          bg: "bg-[#EFF6FF]",
        };
      case "Website":
        return {
          icon: <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />,
          bg: "bg-[#EFF6FF]",
        };
      case "Email":
        return {
          icon: <RiMailLine className="h-4 w-4 text-[#64748B]" />,
          bg: "bg-[#F1F5F9]",
        };
    }
  };

  const channel = getChannelDetails();

  return (
    <Card
      padding="sm"
      variant="interactive"
      onClick={() => onSelect?.(conversation)}
      className={cn(
        "transition-all duration-150 relative border-[#E2E8F0]",
        isSelected && "bg-[#EFF6FF]/60 border-[#2563EB] shadow-sm",
        conversation.unreadCount > 0 && "border-l-4 border-l-[#2563EB]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            {conversation.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={conversation.avatarUrl}
                alt={conversation.contactName}
                className="h-9 w-9 rounded-full object-cover border border-[#E2E8F0]"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-[#F1F5F9] text-[#475569] font-bold text-xs flex items-center justify-center">
                {conversation.contactName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            <div
              className={cn(
                "absolute -bottom-1 -right-1 p-0.5 rounded-full shadow-xs border border-white",
                channel.bg
              )}
            >
              {channel.icon}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#0F172A] truncate">
                {conversation.contactName}
              </span>
              {conversation.unreadCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
              )}
            </div>
            <p className="text-[11px] text-[#64748B] truncate">
              {conversation.companyName}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end flex-shrink-0 gap-1">
          <span className="text-[10px] text-[#94A3B8] font-medium">
            {conversation.lastMessageAt}
          </span>
          {conversation.aiHandled && (
            <AIBadge label="AI Handled" size="sm" />
          )}
        </div>
      </div>

      <div className="mt-2.5">
        <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9]">
          {conversation.lastMessageSnippet}
        </p>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#64748B]">
        <span className="font-mono text-[10px] text-[#94A3B8] truncate">
          {conversation.channelHandle}
        </span>
        <span className="capitalize text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.2 rounded">
          {conversation.status}
        </span>
      </div>
    </Card>
  );
}
