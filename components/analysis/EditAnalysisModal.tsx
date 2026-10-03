"use client";

import React, { useState } from "react";
import { BusinessAnalysis, OpportunityPriority } from "@/types";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  RiCloseLine,
  RiEditLine,
  RiCheckLine,
  RiAddLine,
} from "react-icons/ri";

interface EditAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: BusinessAnalysis;
  onSave: (updates: Partial<BusinessAnalysis>) => void;
  onAddOpportunity: (opp: {
    title: string;
    description: string;
    problemIds: string[];
    potentialValue: string;
    priority: OpportunityPriority;
    priorityReason: string;
  }) => void;
}

export function EditAnalysisModal({
  isOpen,
  onClose,
  analysis,
  onSave,
  onAddOpportunity,
}: EditAnalysisModalProps) {
  if (!isOpen) return null;

  return (
    <EditAnalysisModalForm
      key={analysis.id}
      analysis={analysis}
      onClose={onClose}
      onSave={onSave}
      onAddOpportunity={onAddOpportunity}
    />
  );
}

function EditAnalysisModalForm({
  analysis,
  onClose,
  onSave,
  onAddOpportunity,
}: {
  analysis: BusinessAnalysis;
  onClose: () => void;
  onSave: (updates: Partial<BusinessAnalysis>) => void;
  onAddOpportunity: (opp: {
    title: string;
    description: string;
    problemIds: string[];
    potentialValue: string;
    priority: OpportunityPriority;
    priorityReason: string;
  }) => void;
}) {
  const [activeTab, setActiveTab] = useState<"summary" | "add_opp" | "outreach">("summary");

  // Summary & Solutions
  const [summary, setSummary] = useState(analysis.summary);
  const [primaryOpportunity, setPrimaryOpportunity] = useState(analysis.primaryOpportunity);
  const [recommendedSolution, setRecommendedSolution] = useState(analysis.recommendedSolution);

  // Outreach Angle
  const [outreachHeadline, setOutreachHeadline] = useState(analysis.outreachAngle.headline);
  const [outreachHook, setOutreachHook] = useState(analysis.outreachAngle.suggestedHook);
  const [outreachOffer, setOutreachOffer] = useState(analysis.outreachAngle.demoOffer);

  // Custom Opportunity Form
  const [newOppTitle, setNewOppTitle] = useState("");
  const [newOppDesc, setNewOppDesc] = useState("");
  const [newOppVal, setNewOppVal] = useState("₹25,000 Potential Uplift");
  const [newOppPriority, setNewOppPriority] = useState<OpportunityPriority>("High Potential");
  const [newOppReason, setNewOppReason] = useState("");

  const handleSaveSummary = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      summary,
      primaryOpportunity,
      recommendedSolution,
    });
    onClose();
  };

  const handleSaveOutreach = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      outreachAngle: {
        ...analysis.outreachAngle,
        headline: outreachHeadline,
        suggestedHook: outreachHook,
        demoOffer: outreachOffer,
        userEdited: true,
      },
    });
    onClose();
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOppTitle.trim()) return;

    onAddOpportunity({
      title: newOppTitle,
      description: newOppDesc || "Custom identified opportunity.",
      problemIds: analysis.problems.map((p) => p.id),
      potentialValue: newOppVal,
      priority: newOppPriority,
      priorityReason: newOppReason || "Identified during manual review.",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <RiEditLine className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Edit Business Analysis
              </h3>
              <p className="text-xs text-[#64748B]">
                Refine AI-generated hypotheses, add custom opportunities, or update outreach angle.
              </p>
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

        {/* Tab Selector */}
        <div className="flex border-b border-[#E2E8F0] gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("summary")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "summary"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Executive Summary & Solution
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("add_opp")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "add_opp"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            + Add Custom Opportunity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("outreach")}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === "outreach"
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-[#64748B] hover:text-[#0F172A]"
            }`}
          >
            Outreach Angle
          </button>
        </div>

        {/* Tab 1: Summary & Solution */}
        {activeTab === "summary" && (
          <form onSubmit={handleSaveSummary} className="space-y-4">
            <Textarea
              label="Executive Analysis Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              helperText="Describe key digital presence signals and potential opportunity areas."
            />

            <TextInput
              label="Primary Opportunity Title"
              value={primaryOpportunity}
              onChange={(e) => setPrimaryOpportunity(e.target.value)}
            />

            <TextInput
              label="Recommended Solution Package"
              value={recommendedSolution}
              onChange={(e) => setRecommendedSolution(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button size="sm" variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit" leftIcon={<RiCheckLine className="h-4 w-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Add Custom Opportunity */}
        {activeTab === "add_opp" && (
          <form onSubmit={handleCreateOpportunity} className="space-y-4">
            <TextInput
              label="Opportunity Title"
              placeholder="e.g. VIP Concierge & Booking Assistant"
              value={newOppTitle}
              onChange={(e) => setNewOppTitle(e.target.value)}
              required
            />

            <Textarea
              label="Opportunity Description"
              placeholder="Explain how this benefits the client..."
              value={newOppDesc}
              onChange={(e) => setNewOppDesc(e.target.value)}
              rows={3}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Priority Level"
                value={newOppPriority}
                onChange={(e) => setNewOppPriority(e.target.value as OpportunityPriority)}
                options={[
                  { label: "High Potential", value: "High Potential" },
                  { label: "Medium Potential", value: "Medium Potential" },
                  { label: "Low Potential", value: "Low Potential" },
                ]}
              />

              <TextInput
                label="Estimated Value Uplift"
                value={newOppVal}
                onChange={(e) => setNewOppVal(e.target.value)}
              />
            </div>

            <TextInput
              label="Priority Rationale"
              placeholder="Why is this prioritized for the client?"
              value={newOppReason}
              onChange={(e) => setNewOppReason(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button size="sm" variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit" leftIcon={<RiAddLine className="h-4 w-4" />}>
                Add Opportunity
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Outreach Angle */}
        {activeTab === "outreach" && (
          <form onSubmit={handleSaveOutreach} className="space-y-4">
            <TextInput
              label="Positioning Headline"
              value={outreachHeadline}
              onChange={(e) => setOutreachHeadline(e.target.value)}
            />

            <Textarea
              label="Conversational Hook (WhatsApp / Email DM)"
              value={outreachHook}
              onChange={(e) => setOutreachHook(e.target.value)}
              rows={3}
            />

            <TextInput
              label="Low-Friction Demo Offer"
              value={outreachOffer}
              onChange={(e) => setOutreachOffer(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button size="sm" variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit" leftIcon={<RiCheckLine className="h-4 w-4" />}>
                Save Outreach Angle
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
