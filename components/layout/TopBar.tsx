"use client";

import React, { useState } from "react";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";
import { UserDropdown } from "@/components/ui/UserDropdown";
import { GlobalSearchModal } from "@/components/ui/GlobalSearchModal";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBars3,
  HiOutlineSparkles,
} from "react-icons/hi2";

export interface TopBarProps {
  onMenuToggle?: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#E2E8F0] bg-white/95 px-4 sm:px-6 backdrop-blur-md">
        {/* Left side: Mobile menu toggle and search bar trigger */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            aria-label="Open navigation menu"
          >
            <HiOutlineBars3 className="h-5 w-5" />
          </button>

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] px-3 py-1.5 text-xs text-[#94A3B8] transition-all shadow-xs group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HiOutlineMagnifyingGlass className="h-4 w-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
              <span className="truncate">Search leads, prospects, conversations...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 text-[10px] font-medium text-[#64748B]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side: AI Status, Notifications, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 ml-4">
          {/* AI Autopilot Indicator */}
          <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#DDD6FE] bg-[#F5F3FF] px-2.5 py-1 text-xs font-medium text-[#7C3AED]">
            <HiOutlineSparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>AI Autopilot Active</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
          </div>

          {/* Interactive Notifications Popover */}
          <NotificationDropdown />

          {/* User Profile Dropdown Pill */}
          <div className="hidden sm:block w-48 border-l border-[#E2E8F0] pl-2">
            <UserDropdown placement="bottom" showWorkspace={false} />
          </div>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
