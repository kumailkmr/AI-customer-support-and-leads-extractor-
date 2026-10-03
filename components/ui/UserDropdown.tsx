"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { mockCurrentUser } from "@/lib/mock-data/user";
import {
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArrowRightOnRectangle,
  HiChevronDown,
} from "react-icons/hi2";

export interface UserDropdownProps {
  placement?: "top" | "bottom";
  showWorkspace?: boolean;
}

export function UserDropdown({ placement = "bottom", showWorkspace = true }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] group cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mockCurrentUser.avatarUrl}
              alt={mockCurrentUser.name}
              className="h-8 w-8 rounded-full object-cover border border-[#CBD5E1] group-hover:border-[#2563EB] transition-colors"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#10B981] ring-1.5 ring-white" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-[#0F172A] truncate leading-tight group-hover:text-[#2563EB] transition-colors">
              {mockCurrentUser.name}
            </span>
            <span className="text-[11px] text-[#64748B] truncate leading-tight">
              {showWorkspace ? mockCurrentUser.workspaceName : mockCurrentUser.role}
            </span>
          </div>
        </div>

        <HiChevronDown className="h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#0F172A] transition-transform" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          } left-0 sm:right-0 sm:left-auto w-56 rounded-xl bg-white shadow-2xl border border-[#E2E8F0] py-1 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3 py-2 border-b border-[#F1F5F9]">
            <p className="text-xs font-bold text-[#0F172A]">{mockCurrentUser.name}</p>
            <p className="text-[11px] text-[#64748B]">{mockCurrentUser.email}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wider">
                {mockCurrentUser.role} Access
              </span>
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
            >
              <HiOutlineUser className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
            >
              <HiOutlineAdjustmentsHorizontal className="h-4 w-4" />
              <span>Preferences</span>
            </Link>
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#475569] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors"
            >
              <HiOutlineCog6Tooth className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="border-t border-[#F1F5F9] pt-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#EF4444] hover:bg-[#FEF2F2] transition-colors text-left cursor-pointer"
            >
              <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
              <span>Sign out (Demo Mode)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
