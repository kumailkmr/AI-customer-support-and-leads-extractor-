"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { RiSparkling2Fill, RiLoader4Line } from "react-icons/ri";

export interface AIActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  variant?: "solid" | "subtle" | "outline";
  label?: string;
  icon?: React.ReactNode;
}

export const AIActionButton = forwardRef<HTMLButtonElement, AIActionButtonProps>(
  (
    {
      className,
      size = "md",
      isLoading = false,
      variant = "solid",
      label,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      solid:
        "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-sm shadow-[#8B5CF6]/25 border border-transparent",
      subtle:
        "bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#7C3AED] border border-[#DDD6FE] hover:border-[#C4B5FD]",
      outline:
        "bg-white hover:bg-[#F5F3FF] text-[#7C3AED] border border-[#C4B5FD] hover:border-[#8B5CF6]",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5 min-h-[30px]",
      md: "text-sm px-3.5 py-2 gap-2 min-h-[36px]",
      lg: "text-base px-4 py-2.5 gap-2.5 min-h-[42px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <RiLoader4Line className="animate-spin text-current h-4 w-4" />
        ) : (
          icon || <RiSparkling2Fill className="h-3.5 w-3.5 text-current flex-shrink-0" />
        )}
        <span>{label || children}</span>
      </button>
    );
  }
);

AIActionButton.displayName = "AIActionButton";
