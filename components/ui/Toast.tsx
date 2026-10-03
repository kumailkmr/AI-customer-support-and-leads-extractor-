"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  RiCheckLine,
  RiInformationLine,
  RiAlertLine,
  RiCloseLine,
  RiErrorWarningLine,
} from "react-icons/ri";

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", title?: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = {
        id,
        title,
        message,
        type,
      };

      setToasts((prev) => [...prev.slice(-3), newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === "success"
                ? "bg-[#0F172A] text-white border-[#334155]"
                : toast.type === "error"
                ? "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]"
                : toast.type === "warning"
                ? "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]"
                : "bg-white text-[#0F172A] border-[#E2E8F0]"
            }`}
            role="status"
            aria-live="polite"
          >
            <div
              className={`p-1 rounded-full flex-shrink-0 mt-0.5 ${
                toast.type === "success"
                  ? "bg-[#10B981] text-white"
                  : toast.type === "error"
                  ? "bg-[#EF4444] text-white"
                  : toast.type === "warning"
                  ? "bg-[#F59E0B] text-white"
                  : "bg-[#2563EB] text-white"
              }`}
            >
              {toast.type === "success" ? (
                <RiCheckLine className="h-3.5 w-3.5" />
              ) : toast.type === "error" ? (
                <RiErrorWarningLine className="h-3.5 w-3.5" />
              ) : toast.type === "warning" ? (
                <RiAlertLine className="h-3.5 w-3.5" />
              ) : (
                <RiInformationLine className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="flex-1 text-xs">
              {toast.title && (
                <span className="font-bold block mb-0.5">{toast.title}</span>
              )}
              <p className="leading-snug">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded opacity-70 hover:opacity-100 hover:bg-black/10 transition-opacity"
              title="Dismiss notification"
            >
              <RiCloseLine className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
