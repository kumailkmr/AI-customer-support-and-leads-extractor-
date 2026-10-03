"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Fixed Sidebar */}
        <div className="hidden lg:flex flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-y-auto min-w-0">
          <TopBar onMenuToggle={() => setIsMobileNavOpen(true)} />

          <main className={cn("flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto", className)}>
            {children}
          </main>

          {/* Clean Dashboard Footer */}
          <footer className="border-t border-[#E2E8F0] bg-white px-6 py-4 text-center text-xs text-[#94A3B8] flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#0F172A]">NEXUS AI</span>
              <span>— Client Acquisition OS</span>
              <span className="inline-block px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold">
                Phase 1 Foundation
              </span>
            </div>
            <p>Connect every conversation. Capture every lead. Automate every follow-up.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
