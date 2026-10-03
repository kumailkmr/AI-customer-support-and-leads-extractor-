"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RiCloseLine, RiUploadCloud2Line, RiCheckLine, RiFileTextLine } from "react-icons/ri";

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportDone: (count: number) => void;
}

export function ImportLeadsModal({
  isOpen,
  onClose,
  onImportDone,
}: ImportLeadsModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onImportDone(4);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB]">
              <RiUploadCloud2Line className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Import Customer Leads</h3>
              <p className="text-xs text-[#64748B]">CSV / Excel simulated intake file</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 text-center space-y-2 bg-[#F8FAFC]">
          <RiFileTextLine className="h-8 w-8 text-[#94A3B8] mx-auto" />
          <div className="text-xs font-semibold text-[#0F172A]">
            Upload leads_export.csv
          </div>
          <p className="text-[11px] text-[#64748B]">
            Columns: Name, Email, Phone, ClientID, Channel, Intent, EstimatedValue
          </p>
          <span className="inline-block text-[10px] font-bold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-0.5 rounded-full mt-2">
            Simulation Intake
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
          <Button size="sm" variant="secondary" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={handleSimulateImport}
            disabled={isProcessing}
            leftIcon={<RiCheckLine className="h-4 w-4" />}
          >
            {isProcessing ? "Importing..." : "Simulate Import (4 Leads)"}
          </Button>
        </div>
      </div>
    </div>
  );
}
