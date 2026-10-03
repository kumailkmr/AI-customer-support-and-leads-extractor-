"use client";

import React, { useState } from "react";
import { FollowUp } from "@/lib/follow-ups/types";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  RiPlayList2Fill,
  RiSendPlane2Fill,
  RiTimeLine,
  RiWhatsappFill,
  RiInstagramLine,
  RiFacebookCircleFill,
  RiMailLine,
  RiGlobalLine,
  RiEyeLine,
  RiSparkling2Fill,
  RiCheckDoubleLine,
} from "react-icons/ri";

interface FollowUpQueueProps {
  onSelectFollowUp: (followUp: FollowUp) => void;
}

export function FollowUpQueue({ onSelectFollowUp }: FollowUpQueueProps) {
  const { followUps, processQueue, sendFollowUpNow } = useFollowUps();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Queue items: DUE or SCHEDULED
  const queueItems = followUps
    .filter((f) => f.status === "DUE" || f.status === "SCHEDULED")
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

  const handleProcessQueue = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const { processedCount } = processQueue();
      setIsProcessing(false);
      addToast({
        title: "Queue Processed",
        description: `Successfully processed ${processedCount} pending follow-ups in Simulation Mode.`,
        variant: "success",
      });
    }, 600);
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "whatsapp":
        return <RiWhatsappFill className="text-[#25D366]" />;
      case "instagram":
        return <RiInstagramLine className="text-[#E1306C]" />;
      case "facebook":
        return <RiFacebookCircleFill className="text-[#1877F2]" />;
      case "email":
        return <RiMailLine className="text-[#2563EB]" />;
      case "website":
        return <RiGlobalLine className="text-[#0D9488]" />;
      default:
        return <RiMailLine />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <RiPlayList2Fill className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              Dispatch Queue
              <span className="text-xs bg-[#2563EB] text-white px-2 py-0.2 rounded-full font-semibold">
                {queueItems.length}
              </span>
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Real-time sequence of scheduled & due follow-up tasks
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={queueItems.length === 0 || isProcessing}
          onClick={handleProcessQueue}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs flex items-center gap-1.5 shadow-xs"
        >
          <RiSparkling2Fill className="h-3.5 w-3.5" />
          {isProcessing ? "Processing Queue..." : "Process Queue (Simulation)"}
        </Button>
      </div>

      <div className="divide-y divide-[#F1F5F9] max-h-[380px] overflow-y-auto">
        {queueItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            <RiCheckDoubleLine className="h-8 w-8 text-[#10B981] mx-auto mb-2 opacity-80" />
            Queue is clear. No scheduled or overdue follow-ups pending dispatch.
          </div>
        ) : (
          queueItems.map((item, idx) => {
            const isDue = item.status === "DUE";
            const isLead = item.targetType === "LEAD";

            return (
              <div
                key={item.id}
                className="p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-1 p-2 rounded-lg bg-[#F1F5F9] text-base shrink-0">
                    {getChannelIcon(item.channel)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-[#0F172A] truncate">
                        {item.targetName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase ${
                          isLead
                            ? "bg-[#EFF6FF] text-[#2563EB]"
                            : "bg-[#FAF5FF] text-[#7C3AED]"
                        }`}
                      >
                        {isLead ? "Lead" : "Prospect"}
                      </span>
                      {isDue ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#FEF3C7] text-[#B45309] animate-pulse">
                          DUE NOW
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#64748B] flex items-center gap-0.5">
                          <RiTimeLine className="h-3 w-3" />
                          {new Date(item.dueAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-[#64748B] truncate mt-0.5 max-w-md">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectFollowUp(item)}
                    className="text-xs h-7 px-2.5"
                  >
                    <RiEyeLine className="h-3.5 w-3.5 mr-1" /> Inspect
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      sendFollowUpNow(item.id);
                      addToast({
                        title: "Dispatched",
                        description: `Follow-up sent to ${item.targetName} via ${item.channel}.`,
                        variant: "success",
                      });
                    }}
                    className="text-xs h-7 px-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                  >
                    <RiSendPlane2Fill className="h-3 w-3 mr-1" /> Send
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
