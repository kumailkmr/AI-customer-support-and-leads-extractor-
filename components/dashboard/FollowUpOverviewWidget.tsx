"use client";

import React from "react";
import Link from "next/link";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  RiTimeLine,
  RiSendPlane2Fill,
  RiCheckDoubleLine,
  RiArrowRightLine,
  RiSparkling2Fill,
  RiWhatsappFill,
  RiInstagramLine,
  RiMailLine,
  RiFacebookCircleFill,
  RiGlobalLine,
} from "react-icons/ri";

export function FollowUpOverviewWidget() {
  const { followUps, metrics, runs, sendFollowUpNow } = useFollowUps();
  const { addToast } = useToast();

  const dueItems = followUps
    .filter((f) => f.status === "DUE" || f.status === "SCHEDULED")
    .slice(0, 4);

  const recentRuns = runs.slice(0, 3);

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
      default:
        return <RiGlobalLine className="text-[#0D9488]" />;
    }
  };

  return (
    <Card padding="md" className="border-[#E2E8F0] bg-white shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
            <RiTimeLine className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              Follow-Up & Automation Engine
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                Active
              </span>
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Simulated multi-channel outreach queue & automated triggers
            </p>
          </div>
        </div>

        <Link
          href="/follow-ups"
          className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
        >
          View All ({metrics.total}) <RiArrowRightLine className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Mini KPI Counter Badges */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
          <span className="text-[10px] text-[#64748B] block">Due Today</span>
          <strong className="text-sm font-bold text-[#D97706]">{metrics.dueToday}</strong>
        </div>
        <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
          <span className="text-[10px] text-[#64748B] block">Scheduled</span>
          <strong className="text-sm font-bold text-[#2563EB]">{metrics.scheduled}</strong>
        </div>
        <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
          <span className="text-[10px] text-[#64748B] block">Sent</span>
          <strong className="text-sm font-bold text-[#059669]">{metrics.sent}</strong>
        </div>
        <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
          <span className="text-[10px] text-[#64748B] block">Paused</span>
          <strong className="text-sm font-bold text-[#64748B]">{metrics.paused}</strong>
        </div>
      </div>

      {/* Split: Pending Queue List (Left) + Recent Automation Runs (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Pending Queue */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
            Upcoming in Dispatch Queue
          </span>

          <div className="space-y-2">
            {dueItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#64748B] border border-dashed rounded-xl">
                Queue is clear.
              </div>
            ) : (
              dueItems.map((item) => {
                const isLead = item.targetType === "LEAD";
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-2 text-xs hover:bg-white transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{getChannelIcon(item.channel)}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#0F172A] truncate">
                            {item.targetName}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isLead ? "bg-[#EFF6FF] text-[#2563EB]" : "bg-[#FAF5FF] text-[#7C3AED]"
                            }`}
                          >
                            {isLead ? "Lead" : "Prospect"}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] truncate max-w-[170px]">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          sendFollowUpNow(item.id);
                          addToast({
                            title: "Dispatched",
                            description: `Sent follow-up to ${item.targetName}.`,
                            variant: "success",
                          });
                        }}
                        className="text-[11px] h-6 px-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                      >
                        <RiSendPlane2Fill className="h-3 w-3 mr-0.5" /> Send
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Automation Executions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
              Recent Automation Runs
            </span>
            <Link
              href="/settings/automation/runs"
              className="text-[11px] text-[#2563EB] hover:underline"
            >
              All Logs →
            </Link>
          </div>

          <div className="space-y-2">
            {recentRuns.map((r) => (
              <div
                key={r.id}
                className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#0F172A] truncate max-w-[180px]">
                    {r.ruleName}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      r.status === "SUCCESS"
                        ? "bg-[#ECFDF5] text-[#059669]"
                        : r.status === "DUPLICATE"
                        ? "bg-[#FEF3C7] text-[#D97706]"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="text-[10px] text-[#64748B] truncate">{r.reason}</p>
                <div className="text-[9px] text-[#94A3B8] flex items-center justify-between">
                  <span>Target: {r.targetName}</span>
                  <span>{new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
