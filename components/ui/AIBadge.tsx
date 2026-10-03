"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RiSparkling2Fill } from "react-icons/ri";

export interface AIBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  confidence?: number;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "subtle" | "ghost";
}

export function AIBadge({
  label = "AI Agent",
  confidence,
  size = "md",
  variant = "subtle",
  className,
  children,
  ...props
}: AIBadgeProps) {
  const variantStyles = {
    subtle: "bg-[#F5F3FF] text-[#6D28D9] border border-[#DDD6FE]",
    solid: "bg-[#8B5CF6] text-white border border-transparent shadow-xs",
    ghost: "bg-transparent text-[#7C3AED] border border-[#C4B5FD]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-0.75 gap-1.5",
    lg: "text-xs px-3 py-1 gap-2 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full select-none transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <RiSparkling2Fill className="h-3 w-3 flex-shrink-0 text-current opacity-90" />
      <span>{children || label}</span>
      {confidence !== undefined && (
        <span className="ml-0.5 rounded-full bg-black/10 px-1.5 py-0.2 text-[10px] font-bold">
          {confidence}%
        </span>
      )}
    </span>
  );
}
