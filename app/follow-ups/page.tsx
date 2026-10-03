"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AIBadge } from "@/components/ui/AIBadge";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { FilterPill } from "@/components/ui/FilterPill";
import { mockFollowUps, ExtendedFollowUp } from "@/lib/mock-data/follow-ups";
import {
  RiCalendarCheckLine,
  RiSendPlaneLine,
  RiSparkling2Fill,
  RiCloseLine,
  RiEditLine,
  RiCheckDoubleLine,
} from "react-icons/ri";

export default function FollowUpsPage() {
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "completed">("today");
  const [reviewingItem, setReviewingItem] = useState<ExtendedFollowUp | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [sentToast, setSentToast] = useState(false);

  const filtered = mockFollowUps.filter((item) => item.timeCategory === activeTab);

  const counts = {
    today: mockFollowUps.filter((i) => i.timeCategory === "today").length,
    upcoming: mockFollowUps.filter((i) => i.timeCategory === "upcoming").length,
    completed: mockFollowUps.filter((i) => i.timeCategory === "completed").length,
  };

  const handleOpenReview = (item: ExtendedFollowUp) => {
    setReviewingItem(item);
    setCustomMsg(item.recommendedMessage);
    setSentToast(false);
  };

  const handleSendFollowUp = () => {
    setSentToast(true);
    setTimeout(() => {
      setReviewingItem(null);
      setSentToast(false);
    }, 900);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Follow-ups"
        subtitle="AI-suggested client follow-ups and automated re-engagement workflows."
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            {counts.today} Due Today
          </span>
        }
        actions={
          <AIActionButton label="Scan Idle Leads" size="sm" variant="solid" />
        }
      />

      <div className="space-y-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <FilterPill
            label="Due Today"
            count={counts.today}
            isActive={activeTab === "today"}
            onClick={() => setActiveTab("today")}
          />
          <FilterPill
            label="Upcoming"
            count={counts.upcoming}
            isActive={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
          />
          <FilterPill
            label="Completed"
            count={counts.completed}
            isActive={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
          />
        </div>

        {/* Follow-up Cards */}
        <div className="space-y-3.5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B] border border-dashed rounded-xl">
              No follow-ups found in this category.
            </div>
          ) : (
            filtered.map((fu) => (
              <Card
                key={fu.id}
                padding="md"
                className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#0F172A]">
                        {fu.leadName}
                      </h4>
                      <span className="text-xs text-[#64748B]">({fu.companyName})</span>
                      <span className="text-[11px] font-semibold bg-[#EFF6FF] text-[#1E40AF] px-2 py-0.5 rounded">
                        {fu.channel}
                      </span>
                      {fu.isAiSuggested && (
                        <AIBadge label="AI Suggested" size="sm" />
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#64748B] mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[#2563EB] font-medium">
                        <RiCalendarCheckLine className="h-3.5 w-3.5" />
                        {fu.scheduledFor}
                      </span>
                      <span>·</span>
                      <span className="text-[#475569]">
                        <strong>Reason:</strong> {fu.triggerReason}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<RiEditLine className="h-3.5 w-3.5" />}
                      onClick={() => handleOpenReview(fu)}
                    >
                      Review
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<RiSendPlaneLine className="h-3.5 w-3.5" />}
                      onClick={() => handleOpenReview(fu)}
                    >
                      Send
                    </Button>
                  </div>
                </div>

                <div className="mt-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg p-2.5 flex items-start gap-2">
                  <span className="text-[10px] font-bold uppercase text-[#64748B] tracking-wider flex-shrink-0 mt-0.5">
                    Draft:
                  </span>
                  <p className="text-xs text-[#475569] font-mono leading-relaxed">
                    &ldquo;{fu.recommendedMessage}&rdquo;
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Review & Approve Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setReviewingItem(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Review Follow-up for {reviewingItem.leadName}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Channel: {reviewingItem.channel} · Trigger: {reviewingItem.triggerReason}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingItem(null)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A]"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <label className="text-xs font-semibold text-[#0F172A] block">
                Message Content ({reviewingItem.channel})
              </label>
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-[#E2E8F0] p-3 text-xs text-[#172033] outline-none focus:border-[#2563EB]"
              />
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <AIBadge label="AI Context Generated" size="sm" />
                <span>Scheduled: {reviewingItem.scheduledFor}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setReviewingItem(null)}
              >
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<RiCheckDoubleLine className="h-3.5 w-3.5" />}
                  onClick={handleSendFollowUp}
                >
                  {sentToast ? "Dispatched Successfully!" : "Approve & Send"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
