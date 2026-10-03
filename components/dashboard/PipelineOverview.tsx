"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { useProspects } from "@/lib/store/prospects-store";
import { formatCrmCurrency } from "@/lib/crm/crm-service";
import { normalizePipelineStatus } from "@/lib/crm/pipeline-config";
import { HiOutlineChevronRight, HiOutlineArrowRight } from "react-icons/hi2";

export function PipelineOverview() {
  const { prospects, crmMetrics } = useProspects();

  // 6 key stages requested for compact pipeline visualization:
  // FOUND → QUALIFIED → CONTACTED → DEMO → PROPOSAL → WON
  const compactStages = [
    {
      id: "FOUND",
      name: "Found",
      color: "#64748B",
      count: prospects.filter((p) => normalizePipelineStatus(p.status) === "FOUND").length,
      totalValue: prospects
        .filter((p) => normalizePipelineStatus(p.status) === "FOUND")
        .reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0),
    },
    {
      id: "QUALIFIED",
      name: "Qualified",
      color: "#059669",
      count: prospects.filter((p) => normalizePipelineStatus(p.status) === "QUALIFIED").length,
      totalValue: prospects
        .filter((p) => normalizePipelineStatus(p.status) === "QUALIFIED")
        .reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0),
    },
    {
      id: "CONTACTED",
      name: "Contacted",
      color: "#D97706",
      count: prospects.filter((p) => normalizePipelineStatus(p.status) === "CONTACTED").length,
      totalValue: prospects
        .filter((p) => normalizePipelineStatus(p.status) === "CONTACTED")
        .reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0),
    },
    {
      id: "DEMO",
      name: "Demo",
      color: "#9333EA",
      count: prospects.filter(
        (p) =>
          normalizePipelineStatus(p.status) === "DEMO" ||
          normalizePipelineStatus(p.status) === "DEMO READY"
      ).length,
      totalValue: prospects
        .filter(
          (p) =>
            normalizePipelineStatus(p.status) === "DEMO" ||
            normalizePipelineStatus(p.status) === "DEMO READY"
        )
        .reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0),
    },
    {
      id: "PROPOSAL",
      name: "Proposal",
      color: "#4F46E5",
      count: prospects.filter(
        (p) =>
          normalizePipelineStatus(p.status) === "PROPOSAL" ||
          normalizePipelineStatus(p.status) === "NEGOTIATION"
      ).length,
      totalValue: prospects
        .filter(
          (p) =>
            normalizePipelineStatus(p.status) === "PROPOSAL" ||
            normalizePipelineStatus(p.status) === "NEGOTIATION"
        )
        .reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0),
    },
    {
      id: "WON",
      name: "Won",
      color: "#16A34A",
      count: prospects.filter((p) => normalizePipelineStatus(p.status) === "WON").length,
      totalValue: prospects
        .filter((p) => normalizePipelineStatus(p.status) === "WON")
        .reduce((sum, p) => sum + (p.estimatedDealValue || 0), 0),
    },
  ];

  return (
    <Card padding="md" className="border-[#E2E8F0]">
      <CardHeader
        title="Prospects Sales Pipeline"
        subtitle={`${crmMetrics.totalProspects} target prospects (${formatCrmCurrency(crmMetrics.pipelineValue, { compact: true })} estimated pipeline)`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/prospects"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors group"
            >
              <span>View full CRM pipeline</span>
              <HiOutlineArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {compactStages.map((stage, idx) => {
          const isLast = idx === compactStages.length - 1;

          return (
            <Link
              key={stage.id}
              href={`/prospects`}
              className="relative p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/70 hover:bg-white hover:border-[#2563EB] transition-all group block shadow-xs"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  {stage.name}
                </span>
                {!isLast && (
                  <HiOutlineChevronRight className="hidden lg:block h-3.5 w-3.5 text-[#CBD5E1] group-hover:text-[#2563EB] transition-colors" />
                )}
              </div>

              <div className="text-xl font-bold text-[#0F172A]">
                {stage.count}
                <span className="text-[11px] font-normal text-[#94A3B8] ml-1">prospects</span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium">
                  {formatCrmCurrency(stage.totalValue, { compact: true })}
                </span>
                <span className="text-[10px] font-semibold text-[#2563EB] group-hover:underline">
                  View →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
