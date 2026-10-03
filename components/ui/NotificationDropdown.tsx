"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  HiOutlineBell,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineDocumentText,
  HiCheck,
} from "react-icons/hi2";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "lead" | "followup" | "escalation" | "proposal";
  unread: boolean;
  href: string;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_1",
      title: "New qualified lead from Instagram",
      description: "Sarah Johnson scored 92% for Presidential Suite booking inquiry.",
      timestamp: "4m ago",
      type: "lead",
      unread: true,
      href: "/leads",
    },
    {
      id: "notif_2",
      title: "Follow-up due in 30 minutes",
      description: "Automated sequence ready for Sarah Johnson (Instagram).",
      timestamp: "12m ago",
      type: "followup",
      unread: true,
      href: "/follow-ups",
    },
    {
      id: "notif_3",
      title: "AI escalated a conversation",
      description: "James Wilson requested custom 12-branch SLA routing terms.",
      timestamp: "1h ago",
      type: "escalation",
      unread: true,
      href: "/inbox",
    },
    {
      id: "notif_4",
      title: "Proposal viewed",
      description: "David Miller (Apex Solar Commercial) viewed the proposal document.",
      timestamp: "2h ago",
      type: "proposal",
      unread: false,
      href: "/proposals",
    },
  ]);

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

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "lead":
        return <HiOutlineCheckBadge className="h-4 w-4 text-[#10B981]" />;
      case "followup":
        return <HiOutlineClock className="h-4 w-4 text-[#2563EB]" />;
      case "escalation":
        return <HiOutlineExclamationTriangle className="h-4 w-4 text-[#EF4444]" />;
      case "proposal":
        return <HiOutlineDocumentText className="h-4 w-4 text-[#8B5CF6]" />;
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
        aria-label="Notifications"
      >
        <HiOutlineBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A]">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-[#2563EB] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
              >
                <HiCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
            {notifications.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-start gap-3 p-3.5 transition-colors hover:bg-[#F8FAFC] block",
                  n.unread && "bg-[#EFF6FF]/30"
                )}
              >
                <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-xs flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-xs font-bold text-[#0F172A] truncate">
                      {n.title}
                    </h5>
                    <span className="text-[10px] text-[#94A3B8] flex-shrink-0">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                    {n.description}
                  </p>
                </div>
                {n.unread && (
                  <span className="h-2 w-2 rounded-full bg-[#2563EB] flex-shrink-0 mt-2" />
                )}
              </Link>
            ))}
          </div>

          <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
            <span className="text-[11px] text-[#94A3B8]">
              NEXUS AI Autonomous Alerts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
