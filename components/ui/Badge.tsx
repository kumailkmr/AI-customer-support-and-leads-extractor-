"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StatusType } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: StatusType | string;
  variant?: "neutral" | "primary" | "success" | "warning" | "danger" | "ai" | "outline" | "info" | "error";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  pulse?: boolean;
}

export function StatusBadge({
  status,
  variant,
  size = "md",
  dot = true,
  pulse = false,
  className,
  children,
  ...props
}: BadgeProps) {
  // Determine variant automatically from status if variant is not explicitly provided
  const resolvedVariant = variant || getVariantForStatus(status as StatusType);

  const variantStyles: Record<string, string> = {
    neutral: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]",
    primary: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
    info: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
    success: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
    warning: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]",
    danger: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
    error: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
    ai: "bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]",
    outline: "bg-transparent text-[#475569] border-[#CBD5E1]",
  };

  const dotColors: Record<string, string> = {
    neutral: "bg-[#64748B]",
    primary: "bg-[#2563EB]",
    info: "bg-[#2563EB]",
    success: "bg-[#10B981]",
    warning: "bg-[#F59E0B]",
    danger: "bg-[#EF4444]",
    error: "bg-[#EF4444]",
    ai: "bg-[#8B5CF6]",
    outline: "bg-[#64748B]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-0.75 gap-1.5",
    lg: "text-xs px-3 py-1 gap-2 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border select-none transition-colors",
        variantStyles[resolvedVariant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 items-center justify-center">
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                dotColors[resolvedVariant]
              )}
            />
          )}
          <span
            className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", dotColors[resolvedVariant])}
          />
        </span>
      )}
      <span>{children || status}</span>
    </span>
  );
}

export const Badge = StatusBadge;

function getVariantForStatus(status?: StatusType): "neutral" | "primary" | "success" | "warning" | "danger" | "ai" {
  switch (status) {
    case "Won":
    case "Qualified":
    case "Active":
      return "success";
    case "Contacted":
    case "Demo":
    case "Interested":
      return "primary";
    case "Proposal":
    case "Negotiation":
    case "Follow-up":
    case "Pending":
      return "warning";
    case "Lost":
    case "Escalated":
      return "danger";
    case "New":
    case "Inactive":
    default:
      return "neutral";
  }
}
