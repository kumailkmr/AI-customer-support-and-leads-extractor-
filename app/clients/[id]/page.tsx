"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { useLeads } from "@/lib/store/leads-store";
import { useChannels } from "@/lib/store/channels-store";
import { formatCurrency } from "@/lib/utils";
import { ChannelConfig, ChannelType } from "@/lib/channels/types";
import { CHANNEL_META } from "@/lib/channels/channel-registry";
import { ChannelSetupModal } from "@/components/channels/ChannelSetupModal";
import { EventSimulatorModal } from "@/components/channels/EventSimulatorModal";

import {
  RiArrowLeftLine,
  RiBuilding4Line,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiSettings4Line,
  RiSparkling2Fill,
  RiTimeLine,
  RiUserVoiceLine,
  RiArrowRightLine,
  RiInboxArchiveLine,
  RiCheckDoubleLine,
} from "react-icons/ri";

export default function ClientWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.id as string;

  const { clients, leads, conversations } = useLeads();
  const { channels } = useChannels();

  const [selectedChannelForSetup, setSelectedChannelForSetup] = useState<ChannelConfig | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulateChannel, setSimulateChannel] = useState<ChannelType>("whatsapp");

  const client = useMemo(() => {
    return clients.find((c) => c.id === clientId) || clients[0];
  }, [clients, clientId]);

  const clientChannels = useMemo(() => {
    return channels.filter((c) => c.clientId === client?.id);
  }, [channels, client]);

  const clientConversations = useMemo(() => {
    return conversations.filter((c) => c.clientId === client?.id);
  }, [conversations, client]);

  const clientLeads = useMemo(() => {
    return leads.filter((l) => l.clientId === client?.id);
  }, [leads, client]);

  // Leads count grouped by channel
  const leadsByChannel = useMemo(() => {
    const counts: Record<string, number> = {
      Website: 0,
      Instagram: 0,
      Facebook: 0,
      WhatsApp: 0,
      Email: 0,
    };
    clientLeads.forEach((l) => {
      const src = l.source || "Website";
      if (counts[src] !== undefined) {
        counts[src]++;
      } else {
        counts.Website++;
      }
    });
    return counts;
  }, [clientLeads]);

  const getChannelIcon = (type: ChannelType | string) => {
    switch (type.toLowerCase()) {
      case "instagram":
        return <RiInstagramLine className="h-5 w-5 text-[#E1306C]" />;
      case "whatsapp":
        return <RiWhatsappLine className="h-5 w-5 text-[#10B981]" />;
      case "facebook":
        return <RiFacebookCircleLine className="h-5 w-5 text-[#1877F2]" />;
      case "email":
        return <RiMailLine className="h-5 w-5 text-[#64748B]" />;
      default:
        return <RiGlobalLine className="h-5 w-5 text-[#2563EB]" />;
    }
  };

  const handleOpenSetup = (ch: ChannelConfig) => {
    setSelectedChannelForSetup(ch);
    setIsSetupOpen(true);
  };

  if (!client) {
    return (
      <AppLayout>
        <div className="p-8 text-center space-y-3">
          <p className="text-sm text-[#64748B]">Client workspace not found.</p>
          <Button size="sm" variant="outline" onClick={() => router.push("/clients")}>
            Back to Clients
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/clients"
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 mb-2"
          >
            <RiArrowLeftLine className="h-3.5 w-3.5" />
            <span>Back to All Clients</span>
          </Link>

          <PageHeader
            title={client.businessName}
            subtitle={`${client.industry} • ${client.location} • Plan: ${client.plan}`}
            action={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSimulateChannel("whatsapp");
                    setIsSimulatorOpen(true);
                  }}
                  leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />}
                >
                  Test Inbound Webhook
                </Button>
                <Link href="/inbox">
                  <Button size="sm" variant="primary" leftIcon={<RiInboxArchiveLine className="h-4 w-4" />}>
                    Open Unified Inbox
                  </Button>
                </Link>
              </div>
            }
          />
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Monthly Plan / MRR
            </span>
            <div className="text-xl font-bold text-[#0F172A]">{formatCurrency(client.mrr)}/mo</div>
            <div className="text-[11px] text-[#047857] font-semibold">Active Client Account</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Active Customer Leads
            </span>
            <div className="text-xl font-bold text-[#2563EB]">{clientLeads.length}</div>
            <div className="text-[11px] text-[#64748B]">Across all connected channels</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Conversations Ingested
            </span>
            <div className="text-xl font-bold text-[#8B5CF6]">{clientConversations.length}</div>
            <div className="text-[11px] text-[#64748B]">
              {clientConversations.filter((c) => c.status === "Active").length} active threads
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Connected Channels
            </span>
            <div className="text-xl font-bold text-[#10B981]">{clientChannels.length}</div>
            <div className="text-[11px] text-[#047857] font-semibold">All in Simulation Mode</div>
          </div>
        </div>

        {/* SECTION 1: CONNECTED CHANNELS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Connected Omnichannel Sources
              </h3>
              <p className="text-xs text-[#64748B]">
                Live adapters handling customer inquiries for {client.businessName}
              </p>
            </div>
            <Link
              href="/settings/channels"
              className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>Manage Global Channels</span>
              <RiArrowRightLine className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientChannels.map((channel) => {
              const meta = CHANNEL_META[channel.type];
              const isConnected = channel.status === "MOCK" || channel.status === "CONNECTED";
              const convCount = clientConversations.filter(
                (c) => c.channel.toLowerCase() === channel.type.toLowerCase() || (channel.type === "website" && c.channel === "Website Chat")
              ).length;

              return (
                <Card
                  key={channel.id}
                  padding="md"
                  className="border-[#E2E8F0] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                          {getChannelIcon(channel.type)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#0F172A]">{channel.name}</h4>
                          <span className="text-[11px] font-mono text-[#64748B] block truncate max-w-[150px]">
                            {channel.accountIdentifier}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          isConnected
                            ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                            : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                        }`}
                      >
                        {channel.status === "MOCK" ? "MOCK" : "NEEDS SETUP"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] p-2 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]">
                      <div>
                        <span className="text-[#64748B] block">Threads:</span>
                        <strong className="text-[#0F172A]">{convCount} conversations</strong>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Unread:</span>
                        <strong className="text-[#2563EB]">{channel.unreadCount} unread</strong>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#64748B] flex items-center gap-1">
                      <RiTimeLine className="h-3 w-3" />
                      <span>
                        Last event:{" "}
                        {channel.lastEventAt
                          ? new Date(channel.lastEventAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "No events recorded"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => handleOpenSetup(channel)}
                    leftIcon={<RiSettings4Line className="h-3.5 w-3.5" />}
                  >
                    Configure Adapter
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* SECTION 2 & 3: RECENT CONVERSATIONS & LEADS BY CHANNEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Conversations (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
                Recent Client Conversations
              </h3>
              <Link href="/inbox" className="text-xs text-[#2563EB] hover:underline font-semibold">
                View All in Inbox →
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs divide-y divide-[#F1F5F9]">
              {clientConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No conversations recorded for this client yet.
                </div>
              ) : (
                clientConversations.slice(0, 5).map((conv) => (
                  <Link
                    key={conv.id}
                    href="/inbox"
                    className="p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1D4ED8] font-bold text-xs flex items-center justify-center">
                        {conv.leadName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0F172A]">{conv.leadName}</span>
                          <span className="text-[10px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-0.2 rounded-full flex items-center gap-1">
                            {getChannelIcon(conv.channel)}
                            {conv.channel}
                          </span>
                        </div>
                        <p className="text-xs text-[#475569] line-clamp-1 mt-0.5 max-w-md">
                          {conv.lastMessageSnippet}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-[#94A3B8]">{conv.lastMessageAt}</span>
                      <div className="mt-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]">
                          {conv.aiMode === "autonomous" ? "AI Active" : "Human"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Right: Leads by Channel Breakdown (1 col) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider">
              Customer Leads by Channel
            </h3>

            <Card padding="md" className="border-[#E2E8F0] space-y-3 shadow-xs">
              <span className="text-xs text-[#64748B] block">
                Acquisition channels generating verified customers for {client.businessName}:
              </span>

              <div className="space-y-2 text-xs">
                {[
                  { channel: "Website", icon: RiGlobalLine, color: "text-[#2563EB]", count: leadsByChannel.Website },
                  { channel: "Instagram", icon: RiInstagramLine, color: "text-[#E1306C]", count: leadsByChannel.Instagram },
                  { channel: "WhatsApp", icon: RiWhatsappLine, color: "text-[#10B981]", count: leadsByChannel.WhatsApp },
                  { channel: "Facebook", icon: RiFacebookCircleLine, color: "text-[#1877F2]", count: leadsByChannel.Facebook },
                  { channel: "Email", icon: RiMailLine, color: "text-[#64748B]", count: leadsByChannel.Email },
                ].map((item) => {
                  const Icon = item.icon;
                  const total = clientLeads.length || 1;
                  const pct = Math.round((item.count / total) * 100);

                  return (
                    <div key={item.channel} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-[#334155]">
                          <Icon className={`h-4 w-4 ${item.color}`} />
                          {item.channel}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#64748B]">{pct}%</span>
                          <strong className="text-xs text-[#0F172A]">{item.count} leads</strong>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2563EB] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] text-center">
                <Link href="/leads" className="text-xs font-semibold text-[#2563EB] hover:underline">
                  View Full Leads CRM →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChannelSetupModal
        channel={selectedChannelForSetup}
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />

      <EventSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        defaultChannel={simulateChannel}
        defaultClientId={client.id}
      />
    </AppLayout>
  );
}
