"use client";

import React, { useState } from "react";
import { z } from "zod";
import { BusinessProspect, OpportunityLevel, AcquisitionSource, ProspectPipelineStatus } from "@/types/prospects";
import { PIPELINE_STAGES } from "@/lib/crm/pipeline-config";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { RiCloseLine, RiCheckLine } from "react-icons/ri";

const editProspectSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  location: z.string().min(2, "Location is required"),
  website: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  whatsapp: z.string().optional(),
  assignedTo: z.string().default("Kumail (You)"),
  source: z.string().default("Manual"),
  status: z.string(),
  opportunity: z.enum(["High", "Medium", "Low"]),
  estimatedDealValue: z.number().min(0),
  monthlyValue: z.number().min(0),
  tags: z.string().optional(),
});

interface EditProspectModalProps {
  prospect: BusinessProspect | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<BusinessProspect>) => void;
}

export function EditProspectModal({
  prospect,
  isOpen,
  onClose,
  onSubmit,
}: EditProspectModalProps) {
  if (!isOpen || !prospect) return null;

  return (
    <EditProspectModalForm
      key={prospect.id}
      prospect={prospect}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function EditProspectModalForm({
  prospect,
  onClose,
  onSubmit,
}: {
  prospect: BusinessProspect;
  onClose: () => void;
  onSubmit: (id: string, updates: Partial<BusinessProspect>) => void;
}) {
  const [formData, setFormData] = useState({
    businessName: prospect.businessName || "",
    industry: prospect.industry || "Hospitality",
    location: prospect.location || "",
    website: prospect.website || "",
    email: prospect.email || "",
    phone: prospect.phone || "",
    instagram: prospect.socialPresence?.instagram?.handle || "",
    facebook: prospect.socialPresence?.facebook?.page || "",
    whatsapp: prospect.socialPresence?.whatsapp?.number || "",
    assignedTo: prospect.assignedTo || "Kumail (You)",
    source: prospect.acquisitionSource || "Manual",
    status: prospect.status || "FOUND",
    opportunity: prospect.opportunityLevel || ("High" as OpportunityLevel),
    estimatedDealValue: String(prospect.estimatedDealValue || 45000),
    monthlyValue: String(prospect.monthlyValue || 9000),
    tags: prospect.tags?.join(", ") || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsedDealValue = parseInt(formData.estimatedDealValue.replace(/[^0-9]/g, ""), 10) || 0;
    const parsedMonthlyValue = parseInt(formData.monthlyValue.replace(/[^0-9]/g, ""), 10) || 0;

    const validationResult = editProspectSchema.safeParse({
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

    const tagArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit(prospect.id, {
      businessName: formData.businessName.trim(),
      industry: formData.industry,
      location: formData.location.trim(),
      website: formData.website.trim(),
      hasWebsite: !!formData.website.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      socialPresence: {
        ...prospect.socialPresence,
        instagram: {
          handle: formData.instagram.trim(),
          followers: prospect.socialPresence?.instagram?.followers || "0",
          active: !!formData.instagram,
        },
        facebook: {
          page: formData.facebook.trim(),
          likes: prospect.socialPresence?.facebook?.likes || "0",
          active: !!formData.facebook,
        },
        whatsapp: {
          number: formData.whatsapp.trim() || formData.phone.trim(),
          businessVerified: true,
        },
      },
      assignedTo: formData.assignedTo.trim(),
      acquisitionSource: formData.source as AcquisitionSource,
      status: formData.status as ProspectPipelineStatus,
      opportunityLevel: formData.opportunity,
      estimatedDealValue: parsedDealValue,
      monthlyValue: parsedMonthlyValue,
      tags: tagArray.length > 0 ? tagArray : prospect.tags,
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
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Edit Prospect Dossier: {prospect.businessName}
            </h3>
            <p className="text-xs text-[#64748B]">
              Update CRM records, commercials, contacts, and assignment.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              label="Business Name *"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              error={errors.businessName}
            />

            <Select
              label="Industry"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextInput
              label="Location (City / Region) *"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              error={errors.location}
            />

            <TextInput
              label="Website URL"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <TextInput
              label="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />

            <TextInput
              label="Telephone / Direct"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <TextInput
              label="WhatsApp Number"
              value={formData.whatsapp}
              onChange={(e) =>
                setFormData({ ...formData, whatsapp: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextInput
              label="Instagram Profile"
              value={formData.instagram}
              onChange={(e) =>
                setFormData({ ...formData, instagram: e.target.value })
              }
            />

            <TextInput
              label="Facebook Page"
              value={formData.facebook}
              onChange={(e) =>
                setFormData({ ...formData, facebook: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F1F5F9]">
            <Select
              label="Pipeline Stage"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as ProspectPipelineStatus,
                })
              }
              options={PIPELINE_STAGES.map((s) => ({
                label: s.label,
                value: s.id,
              }))}
            />

            <TextInput
              label="Estimated Deal Value (₹)"
              value={formData.estimatedDealValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedDealValue: e.target.value,
                })
              }
            />

            <TextInput
              label="Monthly Retainer (₹/mo)"
              value={formData.monthlyValue}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthlyValue: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Opportunity Level"
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
              label="Assigned Lead Owner"
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
            />

            <Select
              label="Acquisition Source"
              value={formData.source}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  source: e.target.value as AcquisitionSource,
                })
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

          <div className="pt-1">
            <TextInput
              label="Tags (comma separated)"
              placeholder="e.g. High Potential, Hot, Needs Demo"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2">
            <Button size="sm" variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              leftIcon={<RiCheckLine className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
