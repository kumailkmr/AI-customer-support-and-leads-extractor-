"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLeads } from "@/lib/store/leads-store";
import { useChannels } from "@/lib/store/channels-store";
import { ChannelConfig, ChannelType } from "@/lib/channels/types";
import { CHANNEL_META } from "@/lib/channels/channel-registry";
import { ChannelSetupModal } from "@/components/channels/ChannelSetupModal";
import { AddChannelModal } from "@/components/channels/AddChannelModal";
import { EventSimulatorModal } from "@/components/channels/EventSimulatorModal";
import {
  RiAddLine,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiSettings4Line,
  RiSparkling2Fill,
  RiTimeLine,
  RiListCheck2,
  RiExchangeLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";

export default function ChannelsPage() {
  const { clients } = useLeads();
  const { channels, getEventMetrics } = useChannels();

  const [selectedClient, setSelectedClient] = useState<string>("All");
  const [selectedChannelForSetup, setSelectedChannelForSetup] = useState<ChannelConfig | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [simulateDefaultChannel, setSimulateDefaultChannel] = useState<ChannelType>("whatsapp");
  const [simulateDefaultClient, setSimulateDefaultClient] = useState<string>("");

  const eventMetrics = getEventMetrics();

  const filteredChannels = channels.filter((c) => {
    if (selectedClient === "All") return true;
    return c.clientId === selectedClient;
  });

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
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

  const handleOpenSetup = (channel: ChannelConfig) => {
    setSelectedChannelForSetup(channel);
    setIsSetupOpen(true);
  };

  const handleOpenTest = (channel: ChannelConfig) => {
    setSimulateDefaultChannel(channel.type);
    setSimulateDefaultClient(channel.clientId);
    setIsSimulateOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Channels"
          subtitle="Connect and manage the communication channels used by your clients."
          breadcrumbs={[
            { label: "Settings", href: "/settings" },
            { label: "Channels" },
          ]}
          action={
            <div className="flex items-center gap-2">
              <Link href="/settings/channels/events">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<RiExchangeLine className="h-4 w-4" />}
                >
                  <span>Event Logs</span>
                  <span className="ml-1 px-1.5 py-0.2 bg-[#F1F5F9] rounded-full text-[10px] font-bold text-[#475569]">
                    {eventMetrics.total}
                  </span>
                </Button>
              </Link>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddOpen(true)}
                leftIcon={<RiAddLine className="h-4 w-4" />}
              >
                + Add Channel
              </Button>
            </div>
          }
        />

        {/* Telemetry / Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Configured Channels
            </span>
            <div className="text-xl font-bold text-[#0F172A]">{channels.length}</div>
            <div className="text-[11px] text-[#64748B]">Across {clients.length} active clients</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Active In Simulation
            </span>
            <div className="text-xl font-bold text-[#047857]">
              {channels.filter((c) => c.status === "MOCK" || c.status === "CONNECTED").length}
            </div>
            <div className="text-[11px] text-[#047857] font-medium flex items-center gap-1">
              <RiCheckboxCircleLine className="h-3.5 w-3.5" /> Webhooks listening
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Processed Events
            </span>
            <div className="text-xl font-bold text-[#2563EB]">{eventMetrics.processed}</div>
            <div className="text-[11px] text-[#64748B] flex items-center gap-1">
              <span>{eventMetrics.duplicate} duplicates prevented</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Simulation Mode
            </span>
            <div className="text-xl font-bold text-[#8B5CF6] flex items-center gap-1">
              <RiSparkling2Fill className="h-5 w-5" /> 100% Mock
            </div>
            <div className="text-[11px] text-[#64748B]">Zero external API credentials</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">Client Scope:</span>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="text-xs px-3 py-1.5 border border-[#CBD5E1] rounded-lg bg-[#F8FAFC] font-medium text-[#0F172A] focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="All">All Client Accounts ({clients.length})</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.businessName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSimulateDefaultChannel("whatsapp");
                setIsSimulateOpen(true);
              }}
              leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />}
            >
              Simulate Inbound Event
            </Button>
          </div>
        </div>

        {/* Channel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChannels.map((channel) => {
            const meta = CHANNEL_META[channel.type];
            const isMockConnected = channel.status === "MOCK" || channel.status === "CONNECTED";

            return (
              <Card
                key={channel.id}
                padding="md"
                className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  {/* Top Row: Icon + Name + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        {getChannelIcon(channel.type)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#0F172A]">{channel.name}</h4>
                        <span className="text-[11px] text-[#64748B] block truncate max-w-[180px]">
                          {channel.clientName}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        isMockConnected
                          ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                          : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                      }`}
                    >
                      {channel.status === "MOCK" ? "MOCK" : "NEEDS SETUP"}
                    </span>
                  </div>

                  {/* Account Information */}
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B]">Account:</span>
                      <span className="font-semibold text-[#0F172A] truncate max-w-[180px]">
                        {channel.accountIdentifier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B]">Integration:</span>
                      <span className="text-[#2563EB] font-medium">{meta.officialProviderName}</span>
                    </div>
                  </div>

                  {/* Capabilities Tags */}
                  <div>
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1.5">
                      Capabilities
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {channel.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#475569]"
                        >
                          {cap.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Last Event */}
                  <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 pt-1 border-t border-[#F1F5F9]">
                    <RiTimeLine className="h-3.5 w-3.5 text-[#94A3B8]" />
                    <span>
                      Last event:{" "}
                      {channel.lastEventAt
                        ? new Date(channel.lastEventAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No events recorded yet"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleOpenSetup(channel)}
                    leftIcon={<RiSettings4Line className="h-3.5 w-3.5" />}
                  >
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleOpenTest(channel)}
                    leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />}
                  >
                    Test Channel
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modals & Drawers */}
      <ChannelSetupModal
        channel={selectedChannelForSetup}
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />

      <AddChannelModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <EventSimulatorModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        defaultChannel={simulateDefaultChannel}
        defaultClientId={simulateDefaultClient}
      />
    </AppLayout>
  );
}
