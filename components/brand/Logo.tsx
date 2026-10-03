"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "compact" | "icon" | "text-only";
  size?: "sm" | "md" | "lg" | "xl";
  showDescriptor?: boolean;
  className?: string;
  href?: string;
}

export function LogoIcon({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#8B5CF6] shadow-sm shadow-[#2563EB]/25 text-white flex-shrink-0 transition-transform duration-200",
        className
      )}
      style={{ width: size, height: size }}
      aria-label="NEXUS AI Logo Mark"
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
      >
        {/* Modern technical N monogram with node connection */}
        <path
          d="M4.5 19.5V4.5L13 14.5V4.5M13 14.5L19.5 19.5V4.5"
          stroke="currentColor"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="19.5" cy="4.5" r="2" fill="#10B981" />
      </svg>
    </div>
  );
}

export function Logo({
  variant = "full",
  size = "md",
  showDescriptor = false,
  className,
  href = "/dashboard",
}: LogoProps) {
  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const currentIconSize = iconSizes[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {variant !== "text-only" && <LogoIcon size={currentIconSize} />}

      {variant !== "icon" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                "font-extrabold tracking-tight text-[#0F172A]",
                textSizes[size]
              )}
            >
              NEXUS
            </span>
            <span
              className={cn(
                "font-bold tracking-tight bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] bg-clip-text text-transparent",
                textSizes[size]
              )}
            >
              AI
            </span>
          </div>
          {(variant === "full" || showDescriptor) && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mt-0.5">
              Client Acquisition OS
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex items-center transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg"
      >
        {content}
      </Link>
    );
  }

  return content;
}
