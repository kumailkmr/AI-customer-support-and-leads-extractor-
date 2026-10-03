"use client";

import React, { useState } from "react";
import { BusinessObservation } from "@/types";
import { Card } from "@/components/ui/Card";
import { getSeverityBadgeProps } from "@/lib/analysis/analysis-service";
import {
  RiSearchEyeLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFilter3Line,
  RiFileTextLine,
  RiEditLine,
} from "react-icons/ri";

interface ObservationsListProps {
  observations: BusinessObservation[];
  onEditObservation?: (obs: BusinessObservation) => void;
}

export function ObservationsList({
  observations,
  onEditObservation,
}: ObservationsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = Array.from(
    new Set(observations.map((o) => o.category))
  );

  const filtered = observations.filter((obs) => {
    if (selectedCategory !== "All" && obs.category !== selectedCategory)
      return false;
    if (selectedSeverity !== "All" && obs.severity !== selectedSeverity)
      return false;
    return true;
  });

  return (
    <Card padding="lg" className="border-[#E2E8F0] shadow-xs space-y-4">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
            <RiSearchEyeLine className="h-4 w-4 text-[#2563EB]" />
            Digital Research Observations ({observations.length})
          </h3>
          <p className="text-xs text-[#64748B]">
            Concrete signals identified across website, social presence, and inquiry workflows.
          </p>
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-[#64748B]">
            <RiFilter3Line className="h-3.5 w-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs font-medium px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-white text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="All">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Observations Grid */}
      <div className="space-y-3">
        {filtered.map((obs) => {
          const isExpanded = expandedIds[obs.id] ?? true;
          const severityProps = getSeverityBadgeProps(obs.severity);

          return (
            <div
              key={obs.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                      {obs.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${severityProps.bg} ${severityProps.text} ${severityProps.border}`}
                    >
                      {obs.severity} Friction
                    </span>
                    <span className="text-[10px] font-medium text-[#64748B] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                      {obs.source}
                    </span>
                    {obs.userEdited && (
                      <span className="text-[10px] font-semibold text-[#B45309] bg-[#FFFBEB] px-1.5 py-0.2 rounded border border-[#FDE68A]">
                        Edited
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {obs.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  {onEditObservation && (
                    <button
                      type="button"
                      onClick={() => onEditObservation(obs)}
                      className="p-1 text-[#94A3B8] hover:text-[#2563EB] rounded hover:bg-[#F1F5F9] transition-colors"
                      title="Edit observation"
                    >
                      <RiEditLine className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleExpand(obs.id)}
                    className="p-1 text-[#64748B] hover:text-[#0F172A] rounded hover:bg-[#F1F5F9] transition-colors"
                  >
                    {isExpanded ? (
                      <RiArrowUpSLine className="h-4 w-4" />
                    ) : (
                      <RiArrowDownSLine className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-2 text-xs pt-1 border-t border-[#F8FAFC]">
                  <p className="text-[#334155] leading-relaxed">
                    {obs.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2 text-[#64748B]">
                    <RiFileTextLine className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#0F172A]">Audit Evidence: </span>
                      <span>{obs.evidence}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            No observations match the selected filters.
          </div>
        )}
      </div>
    </Card>
  );
}
