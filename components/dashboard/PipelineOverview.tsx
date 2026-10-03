"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import { mockPipelineStages } from "@/lib/mock-data/pipeline";
import { formatCurrency } from "@/lib/utils";
import { HiOutlineChevronRight, HiOutlineArrowRight } from "react-icons/hi2";

export function PipelineOverview() {
  const totalPipelineValue = mockPipelineStages.reduce((acc, curr) => acc + curr.totalValue, 0);
  const totalActiveLeads = mockPipelineStages.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card padding="md" className="border-[#E2E8F0]">
      <CardHeader
        title="Sales Pipeline"
        subtitle={`${totalActiveLeads} active leads across acquisition stages (${formatCurrency(totalPipelineValue)} pipeline value)`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/sales"
              className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors group"
            >
              <span>View pipeline</span>
              <HiOutlineArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {mockPipelineStages.map((stage, idx) => {
          const isLast = idx === mockPipelineStages.length - 1;

          return (
            <div
              key={stage.id}
              className="relative p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/70 hover:bg-white hover:border-[#CBD5E1] transition-all group"
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
                <span className="text-[11px] font-normal text-[#94A3B8] ml-1">leads</span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px]">
                <span className="text-[#64748B] font-medium">
                  {formatCurrency(stage.totalValue)}
                </span>
                <span className="text-[10px] font-semibold text-[#2563EB]">
                  {stage.conversionRate}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
