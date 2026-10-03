"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { RiLoader4Line } from "react-icons/ri";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "ghost" | "danger" | "outline" | "ai";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus-visible:ring-[#2563EB] shadow-sm shadow-[#2563EB]/20 border border-transparent",
      secondary:
        "bg-white text-[#172033] border border-[#E2E8F0] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] focus-visible:ring-[#2563EB] shadow-sm",
      success:
        "bg-[#10B981] text-white hover:bg-[#059669] focus-visible:ring-[#10B981] shadow-sm shadow-[#10B981]/20 border border-transparent",
      ghost:
        "bg-transparent text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] focus-visible:ring-[#2563EB] border border-transparent",
      danger:
        "bg-[#EF4444] text-white hover:bg-[#DC2626] focus-visible:ring-[#EF4444] shadow-sm shadow-[#EF4444]/20 border border-transparent",
      outline:
        "bg-transparent text-[#2563EB] border border-[#2563EB] hover:bg-[#EFF6FF] focus-visible:ring-[#2563EB]",
      ai:
        "bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] text-white hover:from-[#1D4ED8] hover:to-[#7C3AED] shadow-sm shadow-[#8B5CF6]/25 border border-transparent",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2 gap-2 min-h-[38px]",
      lg: "text-base px-5 py-2.5 gap-2.5 min-h-[44px]",
      icon: "h-9 w-9 p-0 flex items-center justify-center",
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
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
