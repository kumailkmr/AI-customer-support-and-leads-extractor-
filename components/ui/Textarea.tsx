"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-semibold text-[#0F172A] tracking-tight"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full min-h-[90px] rounded-lg border bg-white px-3.5 py-2 text-sm text-[#172033] placeholder:text-[#94A3B8]",
            "transition-all duration-150 outline-none resize-y",
            "border-[#E2E8F0] hover:border-[#CBD5E1]",
            "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15",
            "disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed",
            error &&
              "border-[#EF4444] hover:border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#64748B]">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
