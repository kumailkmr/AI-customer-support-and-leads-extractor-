"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FilterPill } from "@/components/ui/FilterPill";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { FollowUp, FollowUpTargetType, FollowUpChannel } from "@/lib/follow-ups/types";
import { FollowUpDetailDrawer } from "@/components/follow-ups/FollowUpDetailDrawer";
import { CreateFollowUpModal } from "@/components/follow-ups/CreateFollowUpModal";
import { FollowUpQueue } from "@/components/follow-ups/FollowUpQueue";
import {
  RiSparkling2Fill,
  RiTimeLine,
  RiSendPlane2Fill,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiRestartLine,
  RiAddLine,
  RiSettings4Line,
  RiHistoryLine,
  RiBookletLine,
  RiSearchLine,
  RiWhatsappFill,
  RiInstagramLine,
  RiFacebookCircleFill,
  RiMailLine,
  RiGlobalLine,
  RiCheckDoubleLine,
  RiEyeLine,
} from "react-icons/ri";

export default function FollowUpsPage() {
  const {
    followUps,
    metrics,
    suggestions,
    sendFollowUpNow,
    pauseFollowUp,
    resumeFollowUp,
    retryFollowUp,
    acceptSuggestion,
    dismissSuggestion,
  } = useFollowUps();

  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<"all" | "due" | "scheduled" | "sent" | "paused">("all");
  const [scopeFilter, setScopeFilter] = useState<"all" | "LEAD" | "PROSPECT">("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtered follow-ups
  const filtered = followUps.filter((item) => {
    // Tab filter
    if (activeTab === "due" && item.status !== "DUE") return false;
    if (activeTab === "scheduled" && item.status !== "SCHEDULED") return false;
    if (activeTab === "sent" && item.status !== "SENT" && item.status !== "COMPLETED") return false;
    if (activeTab === "paused" && item.status !== "PAUSED") return false;

    // Scope filter
    if (scopeFilter !== "all" && item.targetType !== scopeFilter) return false;

    // Channel filter
    if (channelFilter !== "all" && item.channel !== channelFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.targetName.toLowerCase().includes(q);
      const matchSub = item.targetSubtext?.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchReason = item.triggerReason.toLowerCase().includes(q);
      if (!matchName && !matchSub && !matchMsg && !matchReason) return false;
    }

    return true;
  });

  const handleOpenDetail = (item: FollowUp) => {
    setSelectedFollowUp(item);
    setIsDrawerOpen(true);
  };

  const getChannelIcon = (ch: FollowUpChannel) => {
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
    }
  };

  const getStatusBadgeVariant = (st: string) => {
    switch (st) {
      case "DUE":
        return "warning";
      case "SCHEDULED":
        return "info";
      case "SENT":
      case "COMPLETED":
        return "success";
      case "PAUSED":
        return "neutral";
      case "FAILED":
        return "error";
      case "CANCELLED":
        return "neutral";
      default:
        return "neutral";
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Follow-Up & Automation Engine"
        subtitle="Intelligent simulated follow-ups, scheduled multi-channel outreach, and safety guards for both Leads and Prospects."
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Simulation Mode Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/settings/automation">
              <Button variant="outline" size="sm" className="text-xs">
                <RiSettings4Line className="h-3.5 w-3.5 mr-1 text-[#64748B]" />
                Rules ({metrics.total > 0 ? "10 Active" : "Rules"})
              </Button>
            </Link>
            <Link href="/settings/templates">
              <Button variant="outline" size="sm" className="text-xs">
                <RiBookletLine className="h-3.5 w-3.5 mr-1 text-[#64748B]" />
                Templates
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs flex items-center gap-1 shadow-xs"
            >
              <RiAddLine className="h-4 w-4" /> New Follow-Up
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-medium text-[#64748B] block">Total Follow-Ups</span>
            <div className="text-xl font-bold text-[#0F172A] mt-0.5">{metrics.total}</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">
              {metrics.byTargetType.leads} Leads • {metrics.byTargetType.prospects} Prospects
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs border-l-4 border-l-[#F59E0B]">
            <span className="text-[11px] font-medium text-[#D97706] block">Due Today</span>
            <div className="text-xl font-bold text-[#0F172A] mt-0.5">{metrics.dueToday}</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Immediate attention</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs border-l-4 border-l-[#2563EB]">
            <span className="text-[11px] font-medium text-[#2563EB] block">Scheduled</span>
            <div className="text-xl font-bold text-[#0F172A] mt-0.5">{metrics.scheduled}</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Upcoming queue</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs border-l-4 border-l-[#10B981]">
            <span className="text-[11px] font-medium text-[#059669] block">Sent / Completed</span>
            <div className="text-xl font-bold text-[#0F172A] mt-0.5">{metrics.sent}</div>
            <div className="text-[10px] text-[#059669] mt-0.5">Dispatched</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
            <span className="text-[11px] font-medium text-[#64748B] block">Paused</span>
            <div className="text-xl font-bold text-[#0F172A] mt-0.5">{metrics.paused}</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Human takeover guard</div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xs border-l-4 border-l-[#EF4444]">
            <span className="text-[11px] font-medium text-[#DC2626] block">Failed / Retry</span>
            <div className="text-xl font-bold text-[#0F172A] mt-0.5">{metrics.failed}</div>
            <div className="text-[10px] text-[#DC2626] mt-0.5">Retry available</div>
          </div>
        </div>

        {/* AI SMART SUGGESTIONS BANNER */}
        {suggestions.length > 0 && (
          <div className="bg-gradient-to-r from-[#FAF5FF] via-[#F3E8FF] to-[#EFF6FF] border border-[#DDD6FE] rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center">
                  <RiSparkling2Fill className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-bold text-[#581C87] uppercase tracking-wider">
                  NEXUS AI Follow-Up Recommendations ({suggestions.length})
                </h3>
              </div>
              <span className="text-[11px] text-[#7C3AED] font-semibold">
                Autonomous heuristic engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="bg-white p-3.5 rounded-xl border border-[#E9D5FF] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#0F172A]">
                          {sug.targetName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md uppercase ${
                            sug.targetType === "LEAD"
                              ? "bg-[#EFF6FF] text-[#2563EB]"
                              : "bg-[#FAF5FF] text-[#7C3AED]"
                          }`}
                        >
                          {sug.targetType}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                        {Math.round(sug.confidenceScore * 100)}% Match
                      </span>
                    </div>

                    <p className="text-[11px] text-[#64748B] leading-relaxed mb-2">
                      {sug.rationale}
                    </p>

                    <div className="text-[11px] bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9] text-[#334155] italic line-clamp-2">
                      &ldquo;{sug.draftMessage}&rdquo;
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => dismissSuggestion(sug.id)}
                      className="text-xs text-[#94A3B8] hover:text-[#64748B] px-2 py-1"
                    >
                      Dismiss
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        acceptSuggestion(sug.id);
                        addToast({
                          title: "Suggestion Accepted",
                          description: `Scheduled follow-up for ${sug.targetName}.`,
                          variant: "success",
                        });
                      }}
                      className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs h-7 px-3"
                    >
                      Schedule Follow-Up
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TWO COLUMN WORKSPACE: Main Table & Live Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS: Follow-Up Workspace List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Controls Bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 flex-wrap border-b border-[#F1F5F9] pb-3">
                <FilterPill
                  label="All Items"
                  count={followUps.length}
                  isActive={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                />
                <FilterPill
                  label="Due Today"
                  count={metrics.dueToday}
                  isActive={activeTab === "due"}
                  onClick={() => setActiveTab("due")}
                />
                <FilterPill
                  label="Scheduled"
                  count={metrics.scheduled}
                  isActive={activeTab === "scheduled"}
                  onClick={() => setActiveTab("scheduled")}
                />
                <FilterPill
                  label="Sent / Completed"
                  count={metrics.sent}
                  isActive={activeTab === "sent"}
                  onClick={() => setActiveTab("sent")}
                />
                <FilterPill
                  label="Paused"
                  count={metrics.paused}
                  isActive={activeTab === "paused"}
                  onClick={() => setActiveTab("paused")}
                />
              </div>

              {/* Sub-Filters: Scope, Channel, Search */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Scope filter */}
                  <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-lg text-xs">
                    <button
                      onClick={() => setScopeFilter("all")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        scopeFilter === "all"
                          ? "bg-white text-[#0F172A] shadow-xs"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      All Entities
                    </button>
                    <button
                      onClick={() => setScopeFilter("LEAD")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        scopeFilter === "LEAD"
                          ? "bg-white text-[#2563EB] shadow-xs font-semibold"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Client Leads
                    </button>
                    <button
                      onClick={() => setScopeFilter("PROSPECT")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                        scopeFilter === "PROSPECT"
                          ? "bg-white text-[#7C3AED] shadow-xs font-semibold"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Prospects
                    </button>
                  </div>

                  {/* Channel filter */}
                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value)}
                    className="text-xs py-1.5 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#334155]"
                  >
                    <option value="all">All Channels</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="email">Email</option>
                    <option value="website">Website</option>
                  </select>
                </div>

                {/* Search */}
                <div className="relative min-w-[200px]">
                  <RiSearchLine className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search follow-ups..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Follow-up Cards */}
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-dashed border-[#CBD5E1]">
                  No follow-ups match your current filter parameters.
                </div>
              ) : (
                filtered.map((item) => {
                  const isLead = item.targetType === "LEAD";
                  return (
                    <Card
                      key={item.id}
                      padding="md"
                      className="border-[#E2E8F0] hover:border-[#CBD5E1] transition-all bg-white shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9] text-xl shrink-0 mt-0.5">
                            {getChannelIcon(item.channel)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h4
                                onClick={() => handleOpenDetail(item)}
                                className="font-bold text-sm text-[#0F172A] hover:text-[#2563EB] cursor-pointer transition-colors"
                              >
                                {item.targetName}
                              </h4>

                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  isLead
                                    ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                                    : "bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D5FF]"
                                }`}
                              >
                                {isLead ? "Client Lead" : "Prospect"}
                              </span>

                              <Badge variant={getStatusBadgeVariant(item.status)} size="sm">
                                {item.status}
                              </Badge>

                              {item.automationMode === "AUTONOMOUS" && (
                                <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-1.5 py-0.2 rounded-md">
                                  Autonomous
                                </span>
                              )}
                            </div>

                            {item.targetSubtext && (
                              <p className="text-[11px] text-[#64748B] mb-1.5">
                                {item.targetSubtext}
                              </p>
                            )}

                            <p className="text-xs text-[#334155] line-clamp-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#F1F5F9] mb-1.5">
                              &ldquo;{item.message}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-[#64748B] flex-wrap">
                              <span className="flex items-center gap-1">
                                <RiTimeLine className="h-3.5 w-3.5 text-[#94A3B8]" />
                                Due: {new Date(item.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-xs">{item.triggerReason}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDetail(item)}
                            className="text-xs h-8 px-2.5"
                          >
                            <RiEyeLine className="h-3.5 w-3.5 mr-1" /> Inspect
                          </Button>

                          {item.status === "PAUSED" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                resumeFollowUp(item.id);
                                addToast({
                                  title: "Resumed",
                                  description: "Follow-up schedule reinstated.",
                                  variant: "success",
                                });
                              }}
                              className="text-xs h-8 px-2.5 text-[#059669]"
                            >
                              <RiPlayCircleLine className="h-3.5 w-3.5 mr-1" /> Resume
                            </Button>
                          ) : item.status === "FAILED" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                retryFollowUp(item.id);
                                addToast({
                                  title: "Retrying",
                                  description: "Simulating message retry...",
                                  variant: "info",
                                });
                              }}
                              className="text-xs h-8 px-2.5 text-[#2563EB]"
                            >
                              <RiRestartLine className="h-3.5 w-3.5 mr-1" /> Retry
                            </Button>
                          ) : item.status !== "SENT" && item.status !== "COMPLETED" ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                sendFollowUpNow(item.id);
                                addToast({
                                  title: "Dispatched",
                                  description: `Delivered follow-up to ${item.targetName}.`,
                                  variant: "success",
                                });
                              }}
                              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs h-8 px-3"
                            >
                              <RiSendPlane2Fill className="h-3.5 w-3.5 mr-1" /> Send Now
                            </Button>
                          ) : (
                            <span className="text-xs text-[#059669] font-medium flex items-center gap-1 px-2 py-1">
                              <RiCheckDoubleLine className="h-4 w-4" /> Sent
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Live Queue & Operational Shortcuts */}
          <div className="space-y-4">
            <FollowUpQueue onSelectFollowUp={handleOpenDetail} />

            {/* Quick Links Card */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Automation Engine Controls
              </h4>

              <div className="space-y-2">
                <Link
                  href="/settings/automation"
                  className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors flex items-center justify-between block"
                >
                  <div className="flex items-center gap-2">
                    <RiSettings4Line className="h-4 w-4 text-[#2563EB]" />
                    <span className="text-xs font-semibold text-[#1E293B]">Automation Rules</span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">Manage & Test &rarr;</span>
                </Link>

                <Link
                  href="/settings/automation/runs"
                  className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors flex items-center justify-between block"
                >
                  <div className="flex items-center gap-2">
                    <RiHistoryLine className="h-4 w-4 text-[#7C3AED]" />
                    <span className="text-xs font-semibold text-[#1E293B]">Audit Run Logs</span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">View Execution Logs &rarr;</span>
                </Link>

                <Link
                  href="/settings/templates"
                  className="p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors flex items-center justify-between block"
                >
                  <div className="flex items-center gap-2">
                    <RiBookletLine className="h-4 w-4 text-[#059669]" />
                    <span className="text-xs font-semibold text-[#1E293B]">Message Templates</span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">Edit Variables &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <FollowUpDetailDrawer
        followUp={selectedFollowUp}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Create Modal */}
      <CreateFollowUpModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </AppLayout>
  );
}
