"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { HiOutlineMagnifyingGlass, HiXMark } from "react-icons/hi2";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  shortcutKey?: string;
  containerClassName?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      containerClassName,
      placeholder = "Search leads, conversations, prospects...",
      value,
      onChange,
      onClear,
      shortcutKey = "⌘K",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        <div className="absolute left-3 flex items-center pointer-events-none text-[#64748B]">
          <HiOutlineMagnifyingGlass className="h-4 w-4" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-16 py-1.5 text-sm text-[#172033] placeholder:text-[#94A3B8]",
            "hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all duration-150",
            "disabled:bg-[#F8FAFC] disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1">
          {value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              <HiXMark className="h-3.5 w-3.5" />
            </button>
          ) : shortcutKey ? (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 text-[10px] font-medium text-[#64748B] select-none">
              {shortcutKey}
            </kbd>
          ) : null}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
