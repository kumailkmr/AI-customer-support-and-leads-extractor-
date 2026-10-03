"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { Card } from "./Card";
import { RiAlertLine, RiRefreshLine } from "react-icons/ri";

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again or check your network connection.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Card
      padding="lg"
      className={cn(
        "flex flex-col items-center justify-center text-center border-dashed border-[#FECACA] bg-[#FEF2F2]/30 py-10",
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-white border border-[#FECACA] shadow-xs flex items-center justify-center text-[#EF4444] mb-3">
        <RiAlertLine className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-[#0F172A] tracking-tight">{title}</h3>
      <p className="text-xs text-[#64748B] max-w-sm mt-1 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button
          size="sm"
          variant="secondary"
          leftIcon={<RiRefreshLine className="h-3.5 w-3.5" />}
          onClick={onRetry}
          className="mt-4 border-[#E2E8F0]"
        >
          Try Again
        </Button>
      )}
    </Card>
  );
}
