"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { HiArrowTrendingUp, HiArrowTrendingDown } from "react-icons/hi2";
import {
  HiOutlineUsers,
  HiOutlineCheckBadge,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBanknotes,
} from "react-icons/hi2";

export interface MetricCardProps {
  title: string;
  value: string | number;
  changePercentage?: number;
  isPositiveChange?: boolean;
  timeframe?: string;
  subtitle?: string;
  iconName?: string;
  accentColor?: "blue" | "emerald" | "violet" | "amber";
  className?: string;
}

export function MetricCard({
  title,
  value,
  changePercentage,
  isPositiveChange = true,
  timeframe = "vs. last month",
  subtitle,
  iconName = "HiOutlineUsers",
  accentColor = "blue",
  className,
}: MetricCardProps) {
  const getIcon = () => {
    switch (iconName) {
      case "HiOutlineUsers":
        return <HiOutlineUsers className="h-5 w-5" />;
      case "HiOutlineCheckBadge":
        return <HiOutlineCheckBadge className="h-5 w-5" />;
      case "HiOutlineChatBubbleLeftRight":
        return <HiOutlineChatBubbleLeftRight className="h-5 w-5" />;
      case "HiOutlineBanknotes":
        return <HiOutlineBanknotes className="h-5 w-5" />;
      default:
        return <HiOutlineUsers className="h-5 w-5" />;
    }
  };

  const accentStyles = {
    blue: {
      iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
      borderAccent: "hover:border-[#BFDBFE]",
    },
    emerald: {
      iconBg: "bg-[#ECFDF5] text-[#10B981] border-[#A7F3D0]",
      borderAccent: "hover:border-[#A7F3D0]",
    },
    violet: {
      iconBg: "bg-[#F5F3FF] text-[#8B5CF6] border-[#DDD6FE]",
      borderAccent: "hover:border-[#DDD6FE]",
    },
    amber: {
      iconBg: "bg-[#FFFBEB] text-[#F59E0B] border-[#FDE68A]",
      borderAccent: "hover:border-[#FDE68A]",
    },
  };

  const currentAccent = accentStyles[accentColor];

  return (
    <Card
      padding="md"
      className={cn(
        "transition-all duration-200 hover:-translate-y-0.5 group",
        currentAccent.borderAccent,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
          {title}
        </span>
        <div
          className={cn(
            "p-2 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105",
            currentAccent.iconBg
          )}
        >
          {getIcon()}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
          {value}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
        {changePercentage !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded",
              isPositiveChange
                ? "bg-[#ECFDF5] text-[#047857]"
                : "bg-[#FEF2F2] text-[#B91C1C]"
            )}
          >
            {isPositiveChange ? (
              <HiArrowTrendingUp className="h-3.5 w-3.5" />
            ) : (
              <HiArrowTrendingDown className="h-3.5 w-3.5" />
            )}
            {changePercentage > 0 ? `+${changePercentage}%` : `${changePercentage}%`}
          </span>
        )}
        <span className="text-[#94A3B8] font-normal">
          {subtitle || timeframe}
        </span>
      </div>
    </Card>
  );
}
