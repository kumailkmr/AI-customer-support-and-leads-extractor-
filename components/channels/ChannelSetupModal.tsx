"use client";

import React, { useState } from "react";
import { ChannelConfig } from "@/lib/channels/types";
import { CHANNEL_META } from "@/lib/channels/channel-registry";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useChannels } from "@/lib/store/channels-store";
import {
  RiCloseLine,
  RiCheckLine,
  RiGlobalLine,
  RiInstagramLine,
  RiFacebookCircleLine,
  RiWhatsappLine,
  RiMailLine,
  RiSparkling2Fill,
  RiShieldCheckLine,
  RiInformationLine,
  RiLoader4Line,
} from "react-icons/ri";

interface ChannelSetupModalProps {
  channel: ChannelConfig | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ChannelSetupModal({ channel, isOpen, onClose }: ChannelSetupModalProps) {
  const { simulateConnectChannel, updateChannelStatus } = useChannels();
  const { addToast } = useToast();

  const [connectingStep, setConnectingStep] = useState<
    "idle" | "connecting" | "validating" | "registering" | "done"
  >("idle");
  const [accountIdentifier, setAccountIdentifier] = useState(
    channel?.accountIdentifier || ""
  );

  if (!isOpen || !channel) return null;

  const meta = CHANNEL_META[channel.type];

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "instagram":
        return <RiInstagramLine className="h-6 w-6 text-[#E1306C]" />;
      case "whatsapp":
        return <RiWhatsappLine className="h-6 w-6 text-[#10B981]" />;
      case "facebook":
        return <RiFacebookCircleLine className="h-6 w-6 text-[#1877F2]" />;
      case "email":
        return <RiMailLine className="h-6 w-6 text-[#64748B]" />;
      default:
        return <RiGlobalLine className="h-6 w-6 text-[#2563EB]" />;
    }
  };

  const handleSimulateConnection = async () => {
    setConnectingStep("connecting");

    setTimeout(() => {
      setConnectingStep("validating");
      setTimeout(() => {
        setConnectingStep("registering");
        setTimeout(async () => {
          setConnectingStep("done");
          await simulateConnectChannel(channel.id, accountIdentifier);
          addToast({
            title: "Channel Simulated Successfully",
            description: `${channel.name} is now connected in Simulation Mode. Webhook active.`,
            variant: "success",
          });
          setTimeout(() => {
            setConnectingStep("idle");
            onClose();
          }, 1000);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleDisconnect = () => {
    updateChannelStatus(channel.id, "NEEDS_SETUP");
    addToast({
      title: "Channel Disconnected",
      description: `${channel.name} status updated to Needs Setup.`,
      variant: "neutral",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
              {getChannelIcon(channel.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F172A]">{channel.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    channel.status === "CONNECTED" || channel.status === "MOCK"
                      ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                      : "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                  }`}
                >
                  {channel.status === "MOCK" ? "SIMULATION MODE" : channel.status}
                </span>
              </div>
              <p className="text-xs text-[#64748B]">Client: {channel.clientName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
            aria-label="Close modal"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#334155]">
          {/* Simulation Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-3">
            <RiInformationLine className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#1E3A8A] block">Simulation Mode Architecture</span>
              <p className="text-[11px] text-[#1E40AF] leading-relaxed">
                NEXUS AI runs all omnichannel channels through mock provider adapters. No real API keys, OAuth tokens, or external platform credentials are required or stored in this phase.
              </p>
            </div>
          </div>

          {/* Integration Specs */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Integration Method
              </span>
              <strong className="text-xs text-[#0F172A] mt-0.5 block">{meta.officialProviderName}</strong>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
                Webhook Pipeline
              </span>
              <span className="text-xs text-[#047857] font-semibold flex items-center gap-1 mt-0.5">
                <RiShieldCheckLine className="h-3.5 w-3.5" /> Ready for configuration
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Account Identifier / Handle / Number
              </label>
              <input
                type="text"
                value={accountIdentifier}
                onChange={(e) => setAccountIdentifier(e.target.value)}
                placeholder={meta.defaultAccount}
                className="w-full text-xs px-3 py-2 border border-[#CBD5E1] rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#2563EB]"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Used to route inbound webhooks to this client workspace.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Simulated Webhook Secret / Token
              </label>
              <input
                type="password"
                disabled
                value="nexus_mock_sec_9918239018239"
                className="w-full text-xs px-3 py-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xl text-[#94A3B8] font-mono"
              />
              <span className="text-[10px] text-[#64748B] mt-1 block">
                Auto-generated mock handshake token for event idempotency.
              </span>
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <span className="block text-xs font-bold text-[#0F172A] mb-2">
              Supported Channel Capabilities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {channel.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[11px] font-medium text-[#334155] flex items-center gap-1 shadow-2xs"
                >
                  <RiCheckLine className="h-3 w-3 text-[#10B981]" />
                  {cap.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Connection Progress Indicator */}
          {connectingStep !== "idle" && (
            <div className="p-3.5 rounded-xl bg-[#FAF5FF] border border-[#DDD6FE] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#6D28D9]">
                <span className="flex items-center gap-1.5">
                  {connectingStep === "done" ? (
                    <RiCheckLine className="h-4 w-4 text-[#10B981]" />
                  ) : (
                    <RiLoader4Line className="h-4 w-4 animate-spin text-[#8B5CF6]" />
                  )}
                  {connectingStep === "connecting" && "Connecting to mock adapter..."}
                  {connectingStep === "validating" && "Validating mock webhook handshake..."}
                  {connectingStep === "registering" && "Registering idempotency route..."}
                  {connectingStep === "done" && "Connection verified in Simulation Mode!"}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold">
                  {connectingStep === "done" ? "100%" : "Processing"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E9D5FF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5CF6] transition-all duration-300 rounded-full"
                  style={{
                    width:
                      connectingStep === "connecting"
                        ? "30%"
                        : connectingStep === "validating"
                        ? "60%"
                        : connectingStep === "registering"
                        ? "85%"
                        : "100%",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          {channel.status === "CONNECTED" || channel.status === "MOCK" ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="text-xs text-[#DC2626] hover:underline font-semibold"
            >
              Disconnect Channel
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              disabled={connectingStep !== "idle"}
              onClick={handleSimulateConnection}
              leftIcon={<RiSparkling2Fill className="h-3.5 w-3.5" />}
            >
              {connectingStep !== "idle" ? "Connecting..." : "Simulate Connection"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
