"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#E2E8F0]/70",
        className
      )}
      {...props}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-20 mt-2" />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
      <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex items-center gap-4 py-2 border-b border-[#F8FAFC]">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className={cn(
                  "h-4 flex-1",
                  cIdx === 0 && "w-1/3 flex-none",
                  cIdx === cols - 1 && "w-16 flex-none"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-2.5">
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
        <div className="space-y-1.5 w-2/3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
      <div className="flex items-start gap-2.5 justify-end">
        <div className="space-y-1.5 w-2/3 flex flex-col items-end">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-16 w-full rounded-xl bg-[#EFF6FF]" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      </div>
    </div>
  );
}
