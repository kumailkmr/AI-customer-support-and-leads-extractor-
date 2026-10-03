"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";
import {
  HiOutlineUserPlus,
  HiOutlineIdentification,
  HiOutlineMagnifyingGlassCircle,
  HiOutlineCalendarDays,
  HiOutlineDocumentPlus,
} from "react-icons/hi2";

export function QuickActionsSection() {
  const actions = [
    {
      label: "Add Prospect",
      description: "Register new business to acquire",
      href: "/prospects",
      icon: HiOutlineUserPlus,
      color: "text-[#2563EB] bg-[#EFF6FF] border-[#BFDBFE]",
    },
    {
      label: "Add Lead",
      description: "Log inbound client lead manually",
      href: "/leads",
      icon: HiOutlineIdentification,
      color: "text-[#10B981] bg-[#ECFDF5] border-[#A7F3D0]",
    },
    {
      label: "Analyze Business",
      description: "AI audit on target business channels",
      href: "/discover",
      icon: HiOutlineMagnifyingGlassCircle,
      color: "text-[#8B5CF6] bg-[#F5F3FF] border-[#DDD6FE]",
    },
    {
      label: "Create Follow-up",
      description: "Schedule automated re-engagement",
      href: "/follow-ups",
      icon: HiOutlineCalendarDays,
      color: "text-[#F59E0B] bg-[#FFFBEB] border-[#FDE68A]",
    },
    {
      label: "Create Proposal",
      description: "Generate tailored agreement",
      href: "/proposals",
      icon: HiOutlineDocumentPlus,
      color: "text-[#0F172A] bg-[#F1F5F9] border-[#E2E8F0]",
    },
  ];

  return (
    <Card padding="md" className="border-[#E2E8F0]">
      <CardHeader
        title="Quick Actions"
        subtitle="Common workflows and acquisition operations"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.label}
              href={act.href}
              className="flex flex-col items-start p-3.5 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-all duration-150 group cursor-pointer"
            >
              <div
                className={`p-2 rounded-lg border ${act.color} mb-2.5 transition-transform group-hover:scale-105`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-tight">
                {act.label}
              </span>
              <span className="text-[11px] text-[#64748B] mt-0.5 leading-snug line-clamp-2">
                {act.description}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
