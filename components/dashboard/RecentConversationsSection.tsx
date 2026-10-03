"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CardHeader } from "@/components/ui/Card";
import { ConversationCard } from "@/components/ui/ConversationCard";
import { FilterPill } from "@/components/ui/FilterPill";
import { mockRecentConversations } from "@/lib/mock-data/conversations";
import { HiOutlineArrowRight } from "react-icons/hi2";

export function RecentConversationsSection() {
  const [selectedChannel, setSelectedChannel] = useState<string>("All");

  const filteredConversations =
    selectedChannel === "All"
      ? mockRecentConversations
      : mockRecentConversations.filter((c) => c.channel === selectedChannel);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <CardHeader
          title="Live Omnichannel Inbound"
          subtitle="Real-time synchronized conversations across 5 channels"
          className="border-b-0 pb-0 mb-0"
        />

        <Link
          href="/inbox"
          className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>Open Unified Inbox</span>
          <HiOutlineArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Channel Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <FilterPill
          label="All Channels"
          count={mockRecentConversations.length}
          isActive={selectedChannel === "All"}
          onClick={() => setSelectedChannel("All")}
        />
        <FilterPill
          label="WhatsApp"
          count={mockRecentConversations.filter((c) => c.channel === "WhatsApp").length}
          isActive={selectedChannel === "WhatsApp"}
          onClick={() => setSelectedChannel("WhatsApp")}
        />
        <FilterPill
          label="Instagram"
          count={mockRecentConversations.filter((c) => c.channel === "Instagram").length}
          isActive={selectedChannel === "Instagram"}
          onClick={() => setSelectedChannel("Instagram")}
        />
        <FilterPill
          label="Email"
          count={mockRecentConversations.filter((c) => c.channel === "Email").length}
          isActive={selectedChannel === "Email"}
          onClick={() => setSelectedChannel("Email")}
        />
      </div>

      {/* Conversations Stack */}
      <div className="space-y-3">
        {filteredConversations.map((conversation) => (
          <ConversationCard
            key={conversation.id}
            conversation={conversation}
          />
        ))}
      </div>
    </div>
  );
}
