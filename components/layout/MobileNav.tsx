"use client";

import React, { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { HiXMark } from "react-icons/hi2";

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer content */}
      <div className="relative flex w-full max-w-xs h-full bg-white shadow-2xl transition-transform duration-200 ease-out z-10 flex-col">
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            aria-label="Close navigation"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <Sidebar className="w-full border-r-0" onItemClick={onClose} />
      </div>
    </div>
  );
}
