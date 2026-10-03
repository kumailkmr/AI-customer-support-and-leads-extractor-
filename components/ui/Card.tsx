"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "interactive" | "ai" | "highlight";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "bg-white border rounded-xl transition-all duration-150 relative text-[#172033]";

    const variantStyles = {
      default:
        "border-[#E2E8F0] shadow-sm shadow-[#0F172A]/[0.03]",
      subtle:
        "border-[#F1F5F9] bg-[#F8FAFC]",
      interactive:
        "border-[#E2E8F0] shadow-sm shadow-[#0F172A]/[0.03] hover:border-[#CBD5E1] hover:shadow-md hover:shadow-[#0F172A]/[0.06] cursor-pointer",
      ai:
        "border-[#DDD6FE] bg-gradient-to-br from-white to-[#F5F3FF]/40 shadow-sm shadow-[#8B5CF6]/[0.05]",
      highlight:
        "border-[#BFDBFE] bg-gradient-to-br from-white to-[#EFF6FF]/40 shadow-sm shadow-[#2563EB]/[0.05]",
    };

    const paddingStyles = {
      none: "p-0",
      sm: "p-3.5",
      md: "p-5",
      lg: "p-6 sm:p-7",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  title,
  subtitle,
  action,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 pb-3 border-b border-[#F1F5F9] mb-4",
        className
      )}
      {...props}
    >
      <div>
        {title && (
          <h3 className="text-sm font-semibold text-[#0F172A] tracking-tight">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
