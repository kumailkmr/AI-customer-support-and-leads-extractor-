"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FilterPillProps {
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterPill({
  label,
  count,
  isActive = false,
  onClick,
  icon,
  className,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 border select-none cursor-pointer",
        isActive
          ? "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] shadow-xs"
          : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC] hover:text-[#0F172A] hover:border-[#CBD5E1]",
        className
      )}
    >
      {icon && <span className="text-current flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.2 text-[10px] font-semibold transition-colors",
            isActive
              ? "bg-[#2563EB] text-white"
              : "bg-[#F1F5F9] text-[#64748B]"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
