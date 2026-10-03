"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  className,
}: SwitchProps) {
  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const sizes = {
    sm: {
      track: "w-8 h-4",
      thumb: "h-3 w-3",
      translate: "translate-x-4",
    },
    md: {
      track: "w-10 h-5",
      thumb: "h-4 w-4",
      translate: "translate-x-5",
    },
  };

  const currentSize = sizes[size];

  return (
    <div
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none group",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 p-0.5",
          currentSize.track,
          checked ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
        )}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out pointer-events-none",
            currentSize.thumb,
            checked ? currentSize.translate : "translate-x-0"
          )}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-sm font-medium text-[#172033] leading-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-[#64748B] mt-0.5">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
