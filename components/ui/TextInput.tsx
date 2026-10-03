"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { RiErrorWarningLine, RiLoader4Line } from "react-icons/ri";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-[#0F172A] tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#64748B]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled || isLoading}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={cn(
              "w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#172033] placeholder:text-[#94A3B8]",
              "transition-all duration-150 outline-none",
              "border-[#E2E8F0] hover:border-[#CBD5E1]",
              "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15",
              "disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:border-[#E2E8F0] disabled:cursor-not-allowed",
              error &&
                "border-[#EF4444] hover:border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/15",
              leftIcon && "pl-9",
              (rightIcon || error || isLoading) && "pr-9",
              className
            )}
            {...props}
          />
          <div className="absolute right-3 flex items-center pointer-events-none text-[#64748B]">
            {isLoading ? (
              <RiLoader4Line className="animate-spin text-[#2563EB] h-4 w-4" />
            ) : error ? (
              <RiErrorWarningLine className="text-[#EF4444] h-4 w-4" />
            ) : (
              rightIcon
            )}
          </div>
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[#EF4444] font-medium mt-0.5">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[#64748B] mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
