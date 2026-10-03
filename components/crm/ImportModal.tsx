"use client";

import React, { useState } from "react";
import { parseProspectCsv } from "@/lib/crm/crm-service";
import { BusinessProspect } from "@/types/prospects";
import { Button } from "@/components/ui/Button";
import {
  RiCloseLine,
  RiUploadCloud2Line,
  RiFileTextLine,
  RiCheckLine,
  RiAlertLine,
} from "react-icons/ri";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (items: Array<Partial<BusinessProspect>>) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [parsedRows, setParsedRows] = useState<Array<Partial<BusinessProspect>>>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setError("Please select a valid .csv file.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseProspectCsv(text);
      if (rows.length === 0) {
        setError("Could not parse any valid rows. Please ensure your CSV contains a header with at least 'Business Name'.");
      } else {
        setParsedRows(rows);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsText(file);
  };

  const handleImportSubmit = () => {
    if (parsedRows.length === 0) return;
    onImport(parsedRows);
    onClose();
  };

  const sampleCsv = `Business Name,Industry,Location,Website,Email,Phone,Deal Value\n"Grand Vista Resort",Hospitality,"Srinagar","https://grandvista.example.com","info@grandvista.com","+91 9811122233","85000"\n"City Dental Clinic",Clinic,"Delhi","https://citydental.example.com","care@citydental.com","+91 9822233344","60000"`;

  const handleLoadSample = () => {
    setFileName("sample_prospects.csv");
    const rows = parseProspectCsv(sampleCsv);
    setParsedRows(rows);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Import Prospects from CSV
            </h3>
            <p className="text-xs text-[#64748B]">
              Upload a spreadsheet to batch import businesses into your CRM.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#0F172A]"
          >
            <RiCloseLine className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 text-center hover:border-[#2563EB] transition-colors bg-[#F8FAFC]">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-file-input"
          />
          <label
            htmlFor="csv-file-input"
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <div className="p-3 bg-white rounded-full border border-[#E2E8F0] text-[#2563EB] shadow-xs">
              <RiUploadCloud2Line className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#2563EB] hover:underline">
                Click to browse file
              </span>
              <span className="text-xs text-[#64748B]"> or drag and drop CSV here</span>
            </div>
            <span className="text-[10px] text-[#94A3B8]">
              Supports standard CSV with Business Name, Industry, Location, Email, Phone
            </span>
          </label>
        </div>

        {/* Quick Sample Trigger */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
          <span>Need a template?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-[#2563EB] hover:underline font-medium text-xs flex items-center gap-1"
          >
            <RiFileTextLine className="h-3.5 w-3.5" />
            Load Sample CSV Data
          </button>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs text-[#991B1B] flex items-center gap-2">
            <RiAlertLine className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Preview of parsed rows */}
        {parsedRows.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F172A]">
                Preview ({parsedRows.length} prospects detected in {fileName}):
              </span>
              <span className="text-[11px] text-[#059669] font-semibold flex items-center gap-1">
                <RiCheckLine className="h-3.5 w-3.5" /> Ready to Import
              </span>
            </div>

            <div className="max-h-36 overflow-y-auto border border-[#E2E8F0] rounded-xl divide-y divide-[#F1F5F9] text-xs">
              {parsedRows.slice(0, 5).map((row, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0F172A] block">
                      {row.businessName}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {row.industry} · {row.location}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#2563EB]">
                    ₹{(row.estimatedDealValue || 35000).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
              {parsedRows.length > 5 && (
                <div className="p-2 text-center text-[11px] text-[#94A3B8] bg-[#F8FAFC]">
                  + {parsedRows.length - 5} more records
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="primary"
            disabled={parsedRows.length === 0}
            onClick={handleImportSubmit}
            leftIcon={<RiCheckLine className="h-4 w-4" />}
          >
            Import {parsedRows.length > 0 ? `(${parsedRows.length})` : ""} Prospects
          </Button>
        </div>
      </div>
    </div>
  );
}
