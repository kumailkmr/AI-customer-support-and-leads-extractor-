"use client";

import React, { useState } from "react";
import { ChannelEvent } from "@/lib/channels/types";
import { useChannels } from "@/lib/store/channels-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import {
  RiCloseLine,
  RiRefreshLine,
  RiFileCopyLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiExchangeLine,
} from "react-icons/ri";

interface EventDetailDrawerProps {
  event: ChannelEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailDrawer({ event, isOpen, onClose }: EventDetailDrawerProps) {
  const { retryEvent } = useChannels();
  const { addToast } = useToast();
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedNormalized, setCopiedNormalized] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isOpen || !event) return null;

  const handleCopy = (text: string, isRaw: boolean) => {
    navigator.clipboard.writeText(text);
    if (isRaw) {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } else {
      setCopiedNormalized(true);
      setTimeout(() => setCopiedNormalized(false), 2000);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    const res = await retryEvent(event.id);
    setIsRetrying(false);
    if (res.success) {
      addToast({
        title: "Event Retried Successfully",
        description: res.message,
        variant: "success",
      });
      onClose();
    } else {
      addToast({
        title: "Retry Failed",
        description: res.message,
        variant: "danger",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white h-full max-w-xl w-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                {event.eventType}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  event.status === "PROCESSED"
                    ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                    : event.status === "DUPLICATE"
                    ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                    : "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]"
                }`}
              >
                {event.status}
              </span>
            </div>
            <p className="text-xs font-mono text-[#64748B] mt-1">ID: {event.externalEventId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#334155]">
          {/* Status & Idempotency Metadata */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase">Channel</span>
              <strong className="block text-xs text-[#0F172A] capitalize mt-0.5">
                {event.channelType}
              </strong>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase">Direction</span>
              <strong className="block text-xs text-[#0F172A] mt-0.5">{event.direction}</strong>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase">Received At</span>
              <span className="block text-[11px] text-[#0F172A] mt-0.5">
                {new Date(event.receivedAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase">Retry Count</span>
              <strong className="block text-xs text-[#0F172A] mt-0.5">{event.retryCount} retries</strong>
            </div>
          </div>

          {/* Idempotency Protection Callout */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0F172A]">
              <RiShieldCheckLine className="h-3.5 w-3.5 text-[#2563EB]" />
              Idempotency Key
            </div>
            <div className="font-mono text-[10px] text-[#64748B] bg-white p-2 rounded-lg border border-[#E2E8F0] break-all">
              {`${event.clientId}:${event.channelType}:${event.externalEventId}`}
            </div>
            <p className="text-[10px] text-[#64748B]">
              Subsequent deliveries with this exact key are deduplicated to protect against duplicate messages.
            </p>
          </div>

          {/* Error Banner if Failed */}
          {event.status === "FAILED" && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#B91C1C]">
                <RiErrorWarningLine className="h-4 w-4" />
                Processing Failure Trace
              </div>
              <p className="text-[11px] text-[#991B1B] font-mono leading-relaxed">{event.error}</p>
            </div>
          )}

          {/* Processing Timeline Trace */}
          <div>
            <span className="text-xs font-bold text-[#0F172A] mb-2.5 block flex items-center gap-1.5">
              <RiTimeLine className="h-4 w-4 text-[#8B5CF6]" />
              Event Processing Timeline
            </span>
            <div className="space-y-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
              <div className="flex items-start gap-3 relative pl-6">
                <span className="absolute left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-[#2563EB] ring-4 ring-white" />
                <div>
                  <div className="font-semibold text-[#0F172A]">Webhook Ingested</div>
                  <div className="text-[10px] text-[#64748B]">
                    Received via simulated adapter for {event.channelType}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 relative pl-6">
                <span className="absolute left-1 top-1.5 h-2.5 w-2.5 rounded-full bg-[#8B5CF6] ring-4 ring-white" />
                <div>
                  <div className="font-semibold text-[#0F172A]">Payload Normalized</div>
                  <div className="text-[10px] text-[#64748B]">
                    Extracted text: &quot;{event.normalizedPayload.text.slice(0, 45)}...&quot;
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 relative pl-6">
                <span
                  className={`absolute left-1 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${
                    event.status === "PROCESSED"
                      ? "bg-[#10B981]"
                      : event.status === "DUPLICATE"
                      ? "bg-[#F59E0B]"
                      : "bg-[#EF4444]"
                  }`}
                />
                <div>
                  <div className="font-semibold text-[#0F172A]">
                    {event.status === "PROCESSED"
                      ? "Conversation & Lead Updated"
                      : event.status === "DUPLICATE"
                      ? "Deduplicated & Ignored"
                      : "Failed Validation"}
                  </div>
                  <div className="text-[10px] text-[#64748B]">
                    Status: {event.status} ({event.processedAt ? new Date(event.processedAt).toLocaleTimeString() : "Pending"})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Normalized Payload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <RiExchangeLine className="h-4 w-4 text-[#10B981]" />
                Normalized Payload
              </span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(event.normalizedPayload, null, 2), false)}
                className="text-[11px] text-[#2563EB] hover:underline flex items-center gap-1"
              >
                {copiedNormalized ? <RiCheckLine className="h-3 w-3" /> : <RiFileCopyLine className="h-3 w-3" />}
                {copiedNormalized ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#0F172A] text-[#E2E8F0] font-mono text-[10px] overflow-x-auto max-h-48 border border-black/10">
              {JSON.stringify(event.normalizedPayload, null, 2)}
            </pre>
          </div>

          {/* Raw Simulated Payload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-[#0F172A]">Raw Webhook Payload (Simulated)</span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(event.payload, null, 2), true)}
                className="text-[11px] text-[#2563EB] hover:underline flex items-center gap-1"
              >
                {copiedRaw ? <RiCheckLine className="h-3 w-3" /> : <RiFileCopyLine className="h-3 w-3" />}
                {copiedRaw ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#F8FAFC] text-[#334155] font-mono text-[10px] overflow-x-auto max-h-48 border border-[#E2E8F0]">
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>

          {event.status === "FAILED" && (
            <Button
              size="sm"
              variant="primary"
              disabled={isRetrying}
              onClick={handleRetry}
              leftIcon={<RiRefreshLine className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />}
            >
              {isRetrying ? "Retrying Event..." : "Retry Event"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
