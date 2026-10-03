"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BusinessProspect, ProspectPipelineStatus } from "@/types/prospects";
import { formatCrmCurrency } from "@/lib/crm/crm-service";
import { getStageConfig, PIPELINE_STAGES } from "@/lib/crm/pipeline-config";
import { Button } from "@/components/ui/Button";
import { useAnalysis } from "@/lib/store/analysis-store";
import {
  RiBuilding4Line,
  RiGlobalLine,
  RiInstagramLine,
  RiWhatsappLine,
  RiArrowRightLine,
  RiTimeLine,
  RiCalendarLine,
  RiAlertLine,
  RiPriceTag3Line,
  RiDeleteBinLine,
  RiSparkling2Fill,
} from "react-icons/ri";

interface ProspectsTableProps {
  prospects: BusinessProspect[];
  onUpdateStatus: (id: string, status: ProspectPipelineStatus) => void;
  onDeleteProspect: (id: string) => void;
  onBulkUpdateStatus: (ids: string[], status: ProspectPipelineStatus) => void;
  onBulkAddTag: (ids: string[], tag: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

export function ProspectsTable({
  prospects,
  onUpdateStatus,
  onDeleteProspect,
  onBulkUpdateStatus,
  onBulkAddTag,
  onBulkDelete,
}: ProspectsTableProps) {
  const { getAnalysis, getAnalysisStatus } = useAnalysis();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkTagOpen, setIsBulkTagOpen] = useState(false);
  const [bulkTagInput, setBulkTagInput] = useState("High Potential");
  const [isBulkDeleteConfirm, setIsBulkDeleteConfirm] = useState(false);

  const allSelected =
    prospects.length > 0 && selectedIds.length === prospects.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prospects.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyBulkStatus = (status: ProspectPipelineStatus) => {
    if (selectedIds.length === 0) return;
    onBulkUpdateStatus(selectedIds, status);
  };

  const handleApplyBulkTag = () => {
    if (selectedIds.length === 0 || !bulkTagInput.trim()) return;
    onBulkAddTag(selectedIds, bulkTagInput.trim());
    setIsBulkTagOpen(false);
  };

  const handleConfirmBulkDelete = () => {
    onBulkDelete(selectedIds);
    setSelectedIds([]);
    setIsBulkDeleteConfirm(false);
  };

  return (
    <div className="space-y-3">
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#0F172A] text-white rounded-xl shadow-lg border border-[#334155] flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>{selectedIds.length} prospects selected</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Quick Status Shift */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#94A3B8]">Move to:</span>
              <select
                onChange={(e) =>
                  handleApplyBulkStatus(e.target.value as ProspectPipelineStatus)
                }
                defaultValue=""
                className="bg-[#1E293B] text-white border border-[#475569] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#2563EB]"
              >
                <option value="" disabled>
                  Select Stage
                </option>
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Tag */}
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RiPriceTag3Line className="h-3.5 w-3.5" />}
              onClick={() => setIsBulkTagOpen(true)}
            >
              Add Tag
            </Button>

            {/* Delete Selection */}
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RiDeleteBinLine className="h-3.5 w-3.5 text-[#EF4444]" />}
              onClick={() => setIsBulkDeleteConfirm(true)}
            >
              Delete Selected
            </Button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-[#94A3B8] hover:text-white underline ml-2"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                    aria-label="Select all prospects"
                  />
                </th>
                <th className="py-3 px-4 min-w-[200px]">Business Prospect</th>
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4 min-w-[130px]">Pipeline Stage</th>
                <th className="py-3 px-4 min-w-[120px]">Deal Value</th>
                <th className="py-3 px-4 min-w-[120px]">Next Follow-Up</th>
                <th className="py-3 px-4 min-w-[110px]">AI Analysis</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {prospects.map((item) => {
                const stageConfig = getStageConfig(item.status);
                const isSelected = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#F8FAFC] transition-colors group ${
                      isSelected ? "bg-[#EFF6FF]/40" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(item.id)}
                        className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                        aria-label={`Select ${item.businessName}`}
                      />
                    </td>

                    {/* Business Name & Metadata */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#F8FAFC] text-[#2563EB] border border-[#E2E8F0] flex-shrink-0 mt-0.5">
                          <RiBuilding4Line className="h-4 w-4" />
                        </div>
                        <div>
                          <Link
                            href={`/prospects/${item.id}`}
                            className="font-bold text-[#0F172A] hover:text-[#2563EB] transition-colors block text-xs"
                          >
                            {item.businessName}
                          </Link>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-0.5">
                            <span>{item.industry}</span>
                            <span>·</span>
                            <span>{item.location}</span>
                          </div>

                          {/* Digital Channel Badges */}
                          <div className="flex items-center gap-1.5 mt-1">
                            {item.hasWebsite && (
                              <RiGlobalLine
                                className="h-3 w-3 text-[#2563EB]"
                                title="Website Available"
                              />
                            )}
                            {item.socialPresence.instagram?.active && (
                              <RiInstagramLine
                                className="h-3 w-3 text-[#E1306C]"
                                title="Instagram Active"
                              />
                            )}
                            {item.socialPresence.whatsapp && (
                              <RiWhatsappLine
                                className="h-3 w-3 text-[#10B981]"
                                title="WhatsApp Verified"
                              />
                            )}
                            {item.tags.slice(0, 1).map((t) => (
                              <span
                                key={t}
                                className="text-[9px] font-semibold text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.2 rounded border border-[#E2E8F0]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Opportunity */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                            item.opportunityLevel === "High"
                              ? "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]"
                              : item.opportunityLevel === "Medium"
                              ? "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]"
                              : "bg-[#F1F5F9] text-[#64748B] border-[#CBD5E1]"
                          }`}
                        >
                          {item.opportunityLevel}
                        </span>
                        <div className="text-[10px] text-[#2563EB] font-semibold flex items-center gap-0.5">
                          <RiSparkling2Fill className="h-2.5 w-2.5" />
                          <span>{item.nexusFitScore}% Fit</span>
                        </div>
                      </div>
                    </td>

                    {/* Pipeline Stage with Quick Selector */}
                    <td className="py-3 px-4">
                      <select
                        value={stageConfig.id}
                        onChange={(e) =>
                          onUpdateStatus(
                            item.id,
                            e.target.value as ProspectPipelineStatus
                          )
                        }
                        className="text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition-colors cursor-pointer"
                        style={{
                          backgroundColor: stageConfig.bgColor,
                          color: stageConfig.textColor,
                          borderColor: stageConfig.borderColor,
                        }}
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Deal Value */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#0F172A] block text-xs">
                        {formatCrmCurrency(item.estimatedDealValue || 0)}
                      </span>
                      {item.monthlyValue ? (
                        <span className="text-[10px] text-[#059669] font-medium">
                          +{formatCrmCurrency(item.monthlyValue)}/mo
                        </span>
                      ) : null}
                    </td>

                    {/* Next Follow-Up */}
                    <td className="py-3 px-4">
                      {item.followUp ? (
                        <div className="space-y-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                              item.followUp.status === "overdue"
                                ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                                : item.followUp.status === "today"
                                ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                                : "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]"
                            }`}
                          >
                            <RiCalendarLine className="h-3 w-3" />
                            {item.followUp.status === "today"
                              ? "Due Today"
                              : item.followUp.status === "overdue"
                              ? "Overdue"
                              : item.followUp.date}
                          </span>
                          <span className="text-[10px] text-[#64748B] block truncate max-w-[120px]">
                            {item.followUp.channel} · {item.followUp.time}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                          <RiTimeLine className="h-3 w-3" />
                          No Follow-Up
                        </span>
                      )}
                    </td>

                    {/* AI Analysis Column */}
                    <td className="py-3 px-4">
                      {(() => {
                        const status = getAnalysisStatus(item.id);
                        const ana = getAnalysis(item.id);
                        if (status === "Ready" && ana) {
                          return (
                            <Link href={`/prospects/${item.id}/analysis`}>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-colors cursor-pointer">
                                <RiSparkling2Fill className="h-2.5 w-2.5 text-[#10B981]" />
                                Ready (v{ana.version})
                              </span>
                            </Link>
                          );
                        } else if (status === "Needs Review") {
                          return (
                            <Link href={`/prospects/${item.id}/analysis`}>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] hover:bg-[#FEF3C7] transition-colors cursor-pointer">
                                <RiAlertLine className="h-2.5 w-2.5 text-[#F59E0B]" />
                                Review
                              </span>
                            </Link>
                          );
                        } else if (status === "Analyzing") {
                          return (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]">
                              <RiSparkling2Fill className="h-2.5 w-2.5 text-[#8B5CF6] animate-spin" />
                              Analyzing
                            </span>
                          );
                        } else {
                          return (
                            <Link href={`/prospects/${item.id}/analysis`}>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#2563EB] transition-colors cursor-pointer">
                                <RiSparkling2Fill className="h-2.5 w-2.5 text-[#94A3B8]" />
                                Analyze
                              </span>
                            </Link>
                          );
                        }
                      })()}
                    </td>

                    {/* Acquisition Source */}
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569]">
                        {item.acquisitionSource || "Manual"}
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td className="py-3 px-4 text-[#94A3B8] text-[11px]">
                      {item.lastActivity}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/prospects/${item.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            rightIcon={<RiArrowRightLine className="h-3 w-3" />}
                          >
                            View
                          </Button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDeleteProspect(item.id)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded hover:bg-[#FEE2E2] transition-colors"
                          title="Delete Prospect"
                        >
                          <RiDeleteBinLine className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Tag Modal */}
      {isBulkTagOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsBulkTagOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-3">
            <h4 className="text-sm font-bold text-[#0F172A]">
              Apply Tag to {selectedIds.length} Prospects
            </h4>
            <div className="space-y-1">
              <label className="text-xs text-[#64748B] block">Tag Name</label>
              <input
                type="text"
                value={bulkTagInput}
                onChange={(e) => setBulkTagInput(e.target.value)}
                placeholder="e.g. High Potential, Needs Demo, Hot"
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsBulkTagOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleApplyBulkTag}>
                Apply Tag
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsBulkDeleteConfirm(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-3">
            <div className="flex items-center gap-2 text-[#EF4444]">
              <RiAlertLine className="h-5 w-5" />
              <h4 className="text-sm font-bold text-[#0F172A]">
                Confirm Bulk Deletion
              </h4>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-[#0F172A]">{selectedIds.length}</strong> selected
              prospects? This action will remove them from your active pipeline.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsBulkDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleConfirmBulkDelete}
              >
                Delete {selectedIds.length} Prospects
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
