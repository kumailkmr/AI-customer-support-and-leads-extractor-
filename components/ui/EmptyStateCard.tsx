"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { Button } from "./Button";
import { RiInbox2Line } from "react-icons/ri";

export interface EmptyStateCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyStateCard({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateCardProps) {
  return (
    <Card
      padding="lg"
      className={cn(
        "flex flex-col items-center justify-center text-center border-dashed border-[#CBD5E1] bg-[#F8FAFC]/50 py-12",
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-[#64748B] mb-3.5">
        {icon || <RiInbox2Line className="h-6 w-6 text-[#2563EB]" />}
      </div>
      <h3 className="text-base font-bold text-[#0F172A] tracking-tight">{title}</h3>
      <p className="text-xs text-[#64748B] max-w-sm mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button
          size="sm"
          variant="primary"
          onClick={onAction}
          className="mt-5"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
