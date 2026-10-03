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
import { AutomationRun, AutomationRunStatus } from "@/lib/follow-ups/types";
import {
  RiHistoryLine,
  RiArrowLeftLine,
  RiCheckLine,
  RiAlertLine,
  RiCloseCircleLine,
  RiSearchLine,
  RiEyeLine,
  RiCloseLine,
  RiSparkling2Fill,
  RiExternalLinkLine,
} from "react-icons/ri";

export default function AutomationRunsPage() {
  const { runs } = useFollowUps();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRun, setSelectedRun] = useState<AutomationRun | null>(null);

  const filteredRuns = runs.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (scopeFilter !== "all" && r.targetType !== scopeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRule = r.ruleName.toLowerCase().includes(q);
      const matchTarget = r.targetName.toLowerCase().includes(q);
      const matchReason = r.reason.toLowerCase().includes(q);
      if (!matchRule && !matchTarget && !matchReason) return false;
    }
    return true;
  });

  const getStatusBadge = (status: AutomationRunStatus) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center gap-1">
            <RiCheckLine className="h-3 w-3" /> SUCCESS
          </span>
        );
      case "DUPLICATE":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] flex items-center gap-1">
            <RiAlertLine className="h-3 w-3" /> DUPLICATE
          </span>
        );
      case "SKIPPED":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1]">
            SKIPPED
          </span>
        );
      case "FAILED":
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] flex items-center gap-1">
            <RiCloseCircleLine className="h-3 w-3" /> FAILED
          </span>
        );
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Automation Run Audit Log"
        subtitle="Complete chronological history of evaluated rules, condition checks, idempotency guards, and execution outputs."
        breadcrumbs={[
          { label: "Follow-Ups", href: "/follow-ups" },
          { label: "Rules", href: "/settings/automation" },
          { label: "Run Logs" },
        ]}
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Simulation Mode Active
          </span>
        }
        actions={
          <Link href="/settings/automation">
            <Button variant="outline" size="sm">
              <RiArrowLeftLine className="h-4 w-4 mr-1" /> Back to Rules
            </Button>
          </Link>
        }
      />

      <div className="space-y-6">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center gap-2 flex-wrap border-b border-[#F1F5F9] pb-3">
            <FilterPill
              label="All Runs"
              count={runs.length}
              isActive={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
            />
            <FilterPill
              label="Success"
              count={runs.filter((r) => r.status === "SUCCESS").length}
              isActive={statusFilter === "SUCCESS"}
              onClick={() => setStatusFilter("SUCCESS")}
            />
            <FilterPill
              label="Skipped"
              count={runs.filter((r) => r.status === "SKIPPED").length}
              isActive={statusFilter === "SKIPPED"}
              onClick={() => setStatusFilter("SKIPPED")}
            />
            <FilterPill
              label="Duplicate Guards"
              count={runs.filter((r) => r.status === "DUPLICATE").length}
              isActive={statusFilter === "DUPLICATE"}
              onClick={() => setStatusFilter("DUPLICATE")}
            />
            <FilterPill
              label="Failed"
              count={runs.filter((r) => r.status === "FAILED").length}
              isActive={statusFilter === "FAILED"}
              onClick={() => setStatusFilter("FAILED")}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B]">Scope:</span>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#334155]"
              >
                <option value="all">All Targets</option>
                <option value="LEAD">Client Leads</option>
                <option value="PROSPECT">Nexus Prospects</option>
              </select>
            </div>

            <div className="relative min-w-[220px]">
              <RiSearchLine className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search rule or target..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#CBD5E1] focus:outline-hidden focus:border-[#2563EB]"
              >
              </input>
            </div>
          </div>
        </div>

        {/* Audit Runs Table */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Rule Name</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Trigger Event</th>
                  <th className="py-3 px-4">Reason / Outcome</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredRuns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[#64748B]">
                      No automation runs match your current filters.
                    </td>
                  </tr>
                ) : (
                  filteredRuns.map((run) => {
                    const isLead = run.targetType === "LEAD";
                    return (
                      <tr key={run.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(run.status)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#0F172A] max-w-[200px] truncate">
                          {run.ruleName}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-medium text-[#1E293B] block">
                            {run.targetName}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isLead
                                ? "bg-[#EFF6FF] text-[#2563EB]"
                                : "bg-[#FAF5FF] text-[#7C3AED]"
                            }`}
                          >
                            {run.targetType}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[#475569]">
                          {run.triggerEvent}
                        </td>
                        <td className="py-3 px-4 max-w-[260px] truncate text-[#64748B]">
                          {run.reason}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[#94A3B8] text-[11px]">
                          {new Date(run.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedRun(run)}
                            className="p-1.5 text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors font-medium text-xs flex items-center gap-1 ml-auto"
                          >
                            <RiEyeLine className="h-3.5 w-3.5" /> Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inspect Run Modal */}
      {selectedRun && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E2E8F0] overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RiHistoryLine className="h-5 w-5 text-[#2563EB]" />
                <h3 className="font-bold text-sm text-[#0F172A]">
                  Automation Run Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Execution Status:</span>
                {getStatusBadge(selectedRun.status)}
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5">
                <div>
                  <span className="text-[#64748B] block text-[11px]">Rule Name</span>
                  <span className="font-bold text-[#0F172A]">{selectedRun.ruleName}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Target Subject</span>
                  <span className="font-semibold text-[#1E293B]">
                    {selectedRun.targetName} ({selectedRun.targetType})
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Trigger Event</span>
                  <code className="text-[#2563EB] font-mono text-[11px]">
                    {selectedRun.triggerEvent}
                  </code>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl space-y-1">
                <span className="font-semibold text-[#0F172A] block text-[11px]">
                  Evaluation Outcome Rationale:
                </span>
                <p className="text-[#475569] leading-relaxed">{selectedRun.reason}</p>
              </div>

              {selectedRun.followUpId && (
                <div className="flex items-center justify-between p-2.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg text-xs">
                  <span className="text-[#1E40AF] font-medium">
                    Follow-up Generated: {selectedRun.followUpId}
                  </span>
                  <Link
                    href={`/follow-ups/${selectedRun.followUpId}`}
                    className="text-[#2563EB] hover:underline font-bold flex items-center gap-1"
                  >
                    Open <RiExternalLinkLine />
                  </Link>
                </div>
              )}

              {selectedRun.details && (
                <div>
                  <span className="font-semibold text-[#334155] block mb-1">
                    Payload Metadata:
                  </span>
                  <pre className="p-2.5 bg-[#0F172A] text-[#E2E8F0] rounded-lg font-mono text-[10px] overflow-x-auto">
                    {JSON.stringify(selectedRun.details, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedRun(null)}>
                  Close Inspector
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
