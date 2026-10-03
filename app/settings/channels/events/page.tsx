"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { useChannels } from "@/lib/store/channels-store";
import { ChannelEvent, ChannelType } from "@/lib/channels/types";
import { EventDetailDrawer } from "@/components/channels/EventDetailDrawer";
import { EventSimulatorModal } from "@/components/channels/EventSimulatorModal";
import {
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiSparkling2Fill,
  RiArrowRightLine,
  RiExchangeLine,
  RiRefreshLine,
  RiErrorWarningLine,
  RiShieldCheckLine,
  RiFilter3Line,
} from "react-icons/ri";

export default function ChannelEventsPage() {
  const { events, retryEvent, getEventMetrics } = useChannels();

  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<ChannelEvent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  const metrics = getEventMetrics();

  const filteredEvents = events.filter((ev) => {
    const matchesStatus = selectedStatus === "All" || ev.status === selectedStatus;
    const matchesChannel = selectedChannel === "All" || ev.channelType === selectedChannel;
    return matchesStatus && matchesChannel;
  });

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case "instagram":
        return <RiInstagramLine className="h-4 w-4 text-[#E1306C]" />;
      case "whatsapp":
        return <RiWhatsappLine className="h-4 w-4 text-[#10B981]" />;
      case "facebook":
        return <RiFacebookCircleLine className="h-4 w-4 text-[#1877F2]" />;
      case "email":
        return <RiMailLine className="h-4 w-4 text-[#64748B]" />;
      default:
        return <RiGlobalLine className="h-4 w-4 text-[#2563EB]" />;
    }
  };

  const handleOpenDetail = (event: ChannelEvent) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <PageHeader
          title="Channel Event Logs"
          subtitle="Real-time audit trail of normalized webhook events, idempotency deduplication, and pipeline delivery traces."
          breadcrumbs={[
            { label: "Settings", href: "/settings" },
            { label: "Channels", href: "/settings/channels" },
            { label: "Events" },
          ]}
          action={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsSimulateOpen(true)}
                leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5" />}
              >
                Simulate Webhook Event
              </Button>
            </div>
          }
        />

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
              Total Ingested
            </span>
            <div className="text-xl font-bold text-[#0F172A] mt-0.5">{metrics.total}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block">
              Processed
            </span>
            <div className="text-xl font-bold text-[#047857] mt-0.5">{metrics.processed}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block">
              Duplicates Ignored
            </span>
            <div className="text-xl font-bold text-[#B45309] mt-0.5">{metrics.duplicate}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-[10px] font-bold text-[#B91C1C] uppercase tracking-wider block">
              Failed Deliveries
            </span>
            <div className="text-xl font-bold text-[#B91C1C] mt-0.5">{metrics.failed}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <span className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider block">
              Retried Successfully
            </span>
            <div className="text-xl font-bold text-[#7C3AED] mt-0.5">{metrics.retried}</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <RiFilter3Line className="h-4 w-4" />
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs px-2.5 py-1 border border-[#CBD5E1] rounded-lg bg-[#F8FAFC] font-semibold text-[#0F172A]"
              >
                <option value="All">All Statuses ({events.length})</option>
                <option value="PROCESSED">Processed ({metrics.processed})</option>
                <option value="DUPLICATE">Duplicate Ignored ({metrics.duplicate})</option>
                <option value="FAILED">Failed ({metrics.failed})</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span>Channel:</span>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="text-xs px-2.5 py-1 border border-[#CBD5E1] rounded-lg bg-[#F8FAFC] font-semibold text-[#0F172A]"
              >
                <option value="All">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="website">Website</option>
                <option value="facebook">Facebook</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-[#64748B]">
            Showing <strong>{filteredEvents.length}</strong> events
          </span>
        </div>

        {/* Event Logs List / Table */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <RiExchangeLine className="h-8 w-8 text-[#94A3B8] mx-auto" />
              <div className="text-sm font-semibold text-[#0F172A]">No events match filters</div>
              <p className="text-xs text-[#64748B]">
                Try adjusting your filter selection or simulate a new inbound message.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Event Type &amp; ID</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Sender / Lead</th>
                    <th className="py-3 px-4">Normalized Content</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredEvents.map((ev) => {
                    const isProcessed = ev.status === "PROCESSED";
                    const isDup = ev.status === "DUPLICATE";
                    const isFailed = ev.status === "FAILED";

                    return (
                      <tr
                        key={ev.id}
                        className="hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                        onClick={() => handleOpenDetail(ev)}
                      >
                        {/* Event ID */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#0F172A]">{ev.eventType}</div>
                          <div className="font-mono text-[10px] text-[#64748B] truncate max-w-[140px]">
                            {ev.externalEventId}
                          </div>
                        </td>

                        {/* Channel */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-[#334155] capitalize">
                            {getChannelIcon(ev.channelType)}
                            <span>{ev.channelType}</span>
                          </div>
                        </td>

                        {/* Sender / Lead */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#0F172A]">
                            {ev.normalizedPayload.senderName}
                          </div>
                          <div className="text-[10px] text-[#64748B]">
                            {ev.normalizedPayload.senderContact?.handle ||
                              ev.normalizedPayload.senderContact?.phone ||
                              ev.normalizedPayload.senderContact?.email ||
                              ev.normalizedPayload.externalSenderId}
                          </div>
                        </td>

                        {/* Content */}
                        <td className="py-3 px-4 max-w-xs">
                          <p className="truncate text-[#334155] leading-normal">
                            &quot;{ev.normalizedPayload.text}&quot;
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isProcessed
                                ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                                : isDup
                                ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                                : "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]"
                            }`}
                          >
                            {isProcessed && <RiShieldCheckLine className="h-3 w-3" />}
                            {isDup && <RiShieldCheckLine className="h-3 w-3" />}
                            {isFailed && <RiErrorWarningLine className="h-3 w-3" />}
                            {ev.status}
                            {ev.retryCount > 0 && ` (${ev.retryCount}r)`}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3 px-4 text-[#64748B] whitespace-nowrap">
                          {new Date(ev.receivedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div
                            className="inline-flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isFailed && (
                              <button
                                type="button"
                                onClick={() => retryEvent(ev.id)}
                                className="px-2 py-1 text-[11px] font-semibold text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] rounded-lg transition-colors flex items-center gap-1"
                              >
                                <RiRefreshLine className="h-3 w-3" />
                                Retry
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenDetail(ev)}
                              className="p-1 text-[#64748B] hover:text-[#2563EB] rounded transition-colors"
                            >
                              <RiArrowRightLine className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals & Drawers */}
      <EventDetailDrawer
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <EventSimulatorModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
      />
    </AppLayout>
  );
}
