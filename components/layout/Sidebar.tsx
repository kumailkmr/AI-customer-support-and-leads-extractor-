"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { UserDropdown } from "@/components/ui/UserDropdown";
import {
  HiOutlineHome,
  HiOutlineMagnifyingGlassCircle,
  HiOutlineUserGroup,
  HiOutlineIdentification,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCalendarDays,
  HiOutlineArrowTrendingUp,
  HiOutlineDocumentText,
  HiOutlineBuildingOffice2,
  HiOutlineChartBarSquare,
  HiOutlineCog6Tooth,
  HiOutlineSwatch,
  HiOutlineSparkles,
} from "react-icons/hi2";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "blue" | "emerald" | "violet";
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: HiOutlineHome,
      },
      {
        label: "Discover",
        href: "/discover",
        icon: HiOutlineMagnifyingGlassCircle,
      },
      {
        label: "Prospects",
        href: "/prospects",
        icon: HiOutlineUserGroup,
      },
      {
        label: "Leads",
        href: "/leads",
        icon: HiOutlineIdentification,
        badge: "71 Qualified",
        badgeVariant: "emerald",
      },
      {
        label: "Inbox",
        href: "/inbox",
        icon: HiOutlineChatBubbleLeftRight,
        badge: 4,
        badgeVariant: "blue",
      },
    ],
  },
  {
    title: "SALES",
    items: [
      {
        label: "Follow-ups",
        href: "/follow-ups",
        icon: HiOutlineCalendarDays,
        badge: "2 Due",
        badgeVariant: "violet",
      },
      {
        label: "Sales",
        href: "/sales",
        icon: HiOutlineArrowTrendingUp,
      },
      {
        label: "Proposals",
        href: "/proposals",
        icon: HiOutlineDocumentText,
      },
      {
        label: "Clients",
        href: "/clients",
        icon: HiOutlineBuildingOffice2,
      },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      {
        label: "Analytics",
        href: "/analytics",
        icon: HiOutlineChartBarSquare,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: HiOutlineCog6Tooth,
      },
      {
        label: "Design System",
        href: "/design-system",
        icon: HiOutlineSwatch,
      },
    ],
  },
];

export interface SidebarProps {
  className?: string;
  onItemClick?: () => void;
}

export function Sidebar({ className, onItemClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-full select-none justify-between",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-[#F1F5F9]">
        <Logo variant="full" size="md" showDescriptor />
      </div>

      {/* Main Grouped Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
              {section.title}
            </div>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "group relative flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all duration-150",
                      isActive
                        ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                    )}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-[#2563EB]" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isActive
                            ? "text-[#2563EB]"
                            : "text-[#64748B] group-hover:text-[#0F172A]"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight",
                          item.badgeVariant === "emerald"
                            ? "bg-[#ECFDF5] text-[#047857]"
                            : item.badgeVariant === "violet"
                            ? "bg-[#F5F3FF] text-[#6D28D9]"
                            : "bg-[#2563EB] text-white"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Autonomous AI Status Strip */}
      <div className="px-3 py-2 mx-3 mb-2 rounded-lg bg-gradient-to-r from-[#EFF6FF] to-[#F5F3FF] border border-[#DBEAFE] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          <span className="text-[11px] font-medium text-[#1E40AF] flex items-center gap-1">
            <HiOutlineSparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
            AI Acquisition Active
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#2563EB]">100% SLA</span>
      </div>

      {/* Bottom User / Profile Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]/70">
        <UserDropdown placement="top" showWorkspace={true} />
      </div>
    </aside>
  );
}
