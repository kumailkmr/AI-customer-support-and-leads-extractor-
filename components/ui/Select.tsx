"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { HiChevronUpDown } from "react-icons/hi2";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, id, disabled, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[#0F172A] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-lg border bg-white px-3.5 py-2 pr-9 text-sm text-[#172033]",
              "transition-all duration-150 outline-none cursor-pointer",
              "border-[#E2E8F0] hover:border-[#CBD5E1]",
              "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15",
              "disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed",
              error &&
                "border-[#EF4444] hover:border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 flex items-center pointer-events-none text-[#64748B]">
            <HiChevronUpDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#64748B]">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
