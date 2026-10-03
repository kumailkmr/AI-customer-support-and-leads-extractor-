"use client";

import React, { useState } from "react";
import { z } from "zod";
import { BusinessProspect, OpportunityLevel, AcquisitionSource } from "@/types/prospects";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { RiCloseLine, RiAddLine } from "react-icons/ri";

const addProspectSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().min(2, "Location is required"),
  website: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  source: z.string().default("Manual"),
  opportunity: z.enum(["High", "Medium", "Low"]).default("High"),
  estimatedDealValue: z.number().min(0).default(35000),
  monthlyValue: z.number().min(0).default(8000),
  notes: z.string().optional(),
});

interface AddProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BusinessProspect>) => void;
}

const SERVICE_OPTIONS = [
  "AI Support",
  "WhatsApp Automation",
  "Booking System",
  "Lead Generation",
  "CRM",
  "Website",
  "AI Agent",
  "Analytics",
  "Business Automation",
];

export function AddProspectModal({
  isOpen,
  onClose,
  onSubmit,
}: AddProspectModalProps) {
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "Hospitality",
    location: "",
    website: "",
    email: "",
    phone: "",
    instagram: "",
    facebook: "",
    whatsapp: "",
    source: "Manual",
    opportunity: "High" as OpportunityLevel,
    estimatedDealValue: "45000",
    monthlyValue: "9000",
    notes: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([
    "AI Support",
    "WhatsApp Automation",
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsedDealValue = parseInt(formData.estimatedDealValue.replace(/[^0-9]/g, ""), 10) || 0;
    const parsedMonthlyValue = parseInt(formData.monthlyValue.replace(/[^0-9]/g, ""), 10) || 0;

    const validationResult = addProspectSchema.safeParse({
      ...formData,
      estimatedDealValue: parsedDealValue,
      monthlyValue: parsedMonthlyValue,
    });

    if (!validationResult.success) {
      const errMap: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0].toString()] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    onSubmit({
      businessName: formData.businessName.trim(),
      industry: formData.industry,
      location: formData.location.trim(),
      website: formData.website.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      socialPresence: {
        instagram: { handle: formData.instagram.trim(), active: !!formData.instagram },
        facebook: { page: formData.facebook.trim(), active: !!formData.facebook },
        whatsapp: { number: formData.whatsapp.trim() || formData.phone.trim(), businessVerified: true },
        googleBusiness: { rating: 4.5, reviewCount: 15, claimed: true },
      },
      acquisitionSource: formData.source as AcquisitionSource,
      opportunityLevel: formData.opportunity,
      estimatedDealValue: parsedDealValue,
      monthlyValue: parsedMonthlyValue,
      serviceInterest: selectedServices,
      status: "FOUND",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-150 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Add Target Prospect to CRM
            </h3>
            <p className="text-xs text-[#64748B]">
              Register a business to begin research and acquisition tracking.
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

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Core Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <TextInput
                label="Business / Enterprise Name *"
                placeholder="e.g. Alpine Grand Hotel"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                error={errors.businessName}
              />
            </div>

            <div>
              <Select
                label="Industry *"
                value={formData.industry}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                options={[
                  { label: "Hospitality", value: "Hospitality" },
                  { label: "Restaurant", value: "Restaurant" },
                  { label: "Travel", value: "Travel" },
                  { label: "School", value: "School" },
                  { label: "Clinic", value: "Clinic" },
                  { label: "Healthcare", value: "Healthcare" },
                  { label: "Real Estate", value: "Real Estate" },
                  { label: "Professional Services", value: "Professional Services" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              label="Location (City / Region) *"
              placeholder="e.g. Srinagar, Kashmir or Bandra, Mumbai"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              error={errors.location}
            />

            <TextInput
              label="Website URL"
              placeholder="https://example.com"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextInput
              label="Email Address"
              placeholder="contact@business.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />

            <TextInput
              label="Telephone / Mobile"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <TextInput
              label="WhatsApp Direct Line"
              placeholder="+91 98765 43210"
              value={formData.whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
            />
          </div>

          {/* Social Handles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="Instagram Handle"
              placeholder="@business_official"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
            />

            <TextInput
              label="Facebook Page"
              placeholder="BusinessOfficial"
              value={formData.facebook}
              onChange={(e) =>
                setFormData({ ...formData, facebook: e.target.value })
              }
            />
          </div>

          {/* Commercials & Opportunity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F1F5F9]">
            <Select
              label="NEXUS Opportunity Level"
              value={formData.opportunity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  opportunity: e.target.value as OpportunityLevel,
                })
              }
              options={[
                { label: "High Opportunity", value: "High" },
                { label: "Medium Opportunity", value: "Medium" },
                { label: "Low Opportunity", value: "Low" },
              ]}
            />

            <TextInput
              label="Estimated Deal Value (₹)"
              placeholder="45000"
              value={formData.estimatedDealValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedDealValue: e.target.value,
                })
              }
            />

            <TextInput
              label="Estimated Monthly Retainer (₹/mo)"
              placeholder="9000"
              value={formData.monthlyValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthlyValue: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Acquisition Source"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              options={[
                { label: "Manual Entry", value: "Manual" },
                { label: "Website Research", value: "Website Research" },
                { label: "Referral", value: "Referral" },
                { label: "Social Media", value: "Social Media" },
                { label: "Directory", value: "Directory" },
                { label: "Other", value: "Other" },
              ]}
            />
          </div>

          {/* Service Interests Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-[#0F172A] block">
              Potential Service Interests:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SERVICE_OPTIONS.map((svc) => (
                <button
                  key={svc}
                  type="button"
                  onClick={() => toggleService(svc)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    selectedServices.includes(svc)
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {svc}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Note */}
          <div className="pt-1">
            <Textarea
              label="Initial Acquisition Notes (Optional)"
              placeholder="Key observations regarding their website, response time, or acquisition opportunity..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              leftIcon={<RiAddLine className="h-4 w-4" />}
            >
              Add to Pipeline
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
