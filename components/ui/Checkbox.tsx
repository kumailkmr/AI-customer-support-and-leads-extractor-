"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { HiCheck } from "react-icons/hi2";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, disabled, checked, ...props }, ref) => {
    const checkId = id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <label
        htmlFor={checkId}
        className={cn(
          "inline-flex items-start gap-2.5 cursor-pointer select-none group",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={checkId}
            ref={ref}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded border border-[#CBD5E1] bg-white transition-all duration-150",
              "peer-checked:border-[#2563EB] peer-checked:bg-[#2563EB]",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#2563EB]/20",
              "group-hover:border-[#94A3B8]"
            )}
          />
          <HiCheck className="absolute h-3 w-3 text-white stroke-[2.5] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
        </div>
        {(label || description) && (
          <div className="flex flex-col text-left">
            {label && (
              <span className="text-sm font-medium text-[#172033] group-hover:text-[#0F172A] leading-tight">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-[#64748B] mt-0.5">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
