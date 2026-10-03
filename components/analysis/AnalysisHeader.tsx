"use client";

import React from "react";
import Link from "next/link";
import {
  BusinessProspect,
  BusinessAnalysis,
  AnalysisStatus,
} from "@/types";
import { Button } from "@/components/ui/Button";
import {
  getStatusBadgeProps,
  getConfidenceBadgeProps,
} from "@/lib/analysis/analysis-service";
import {
  RiArrowLeftLine,
  RiSparkling2Fill,
  RiRefreshLine,
  RiEditLine,
  RiCheckboxCircleLine,
  RiFileCopyLine,
  RiPresentationLine,
  RiHistoryLine,
} from "react-icons/ri";

interface AnalysisHeaderProps {
  prospect: BusinessProspect;
  analysis?: BusinessAnalysis;
  status: AnalysisStatus;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onOpenEditModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenDemoModal: () => void;
  onMarkReviewed: () => void;
  onCopySummary: () => void;
}

export function AnalysisHeader({
  prospect,
  analysis,
  status,
  isAnalyzing,
  onAnalyze,
  onOpenEditModal,
  onOpenHistoryModal,
  onOpenDemoModal,
  onMarkReviewed,
  onCopySummary,
}: AnalysisHeaderProps) {
  const statusBadge = getStatusBadgeProps(status);
  const confidenceBadge = analysis
    ? getConfidenceBadgeProps(analysis.confidence)
    : null;

  return (
    <div className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/prospects/${prospect.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
          >
            <RiArrowLeftLine className="h-4 w-4" />
            Back to Prospect Dossier
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<RiHistoryLine className="h-3.5 w-3.5" />}
              onClick={onOpenHistoryModal}
            >
              History {analysis ? `(v${analysis.version})` : ""}
            </Button>

            {analysis && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<RiFileCopyLine className="h-3.5 w-3.5" />}
                onClick={onCopySummary}
              >
                Copy Brief
              </Button>
            )}
          </div>
        </div>

        {/* Title, Badges & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                {prospect.businessName}
              </h1>

              {/* Status Badge */}
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
              >
                <RiSparkling2Fill className="h-3 w-3" />
                {statusBadge.label}
              </span>

              {/* Version Badge */}
              {analysis && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  Version {analysis.version}
                  {analysis.userEdited ? " · Edited" : ""}
                </span>
              )}

              {/* Confidence Badge */}
              {confidenceBadge && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${confidenceBadge.bg} ${confidenceBadge.text} ${confidenceBadge.border}`}
                >
                  {confidenceBadge.label}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#64748B] flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{prospect.industry}</span>
              <span>·</span>
              <span>{prospect.location}</span>
              {analysis && (
                <>
                  <span>·</span>
                  <span className="text-[#94A3B8]">
                    Generated {new Date(analysis.generatedAt).toLocaleDateString()}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex flex-wrap items-center gap-2 pt-1 lg:pt-0">
            {analysis && (
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<RiEditLine className="h-4 w-4" />}
                onClick={onOpenEditModal}
              >
                Edit Analysis
              </Button>
            )}

            {analysis && analysis.status !== "Ready" && (
              <Button
                size="sm"
                variant="outline"
                leftIcon={<RiCheckboxCircleLine className="h-4 w-4 text-[#10B981]" />}
                onClick={onMarkReviewed}
              >
                Mark Reviewed
              </Button>
            )}

            <Button
              size="sm"
              variant={analysis ? "secondary" : "primary"}
              leftIcon={<RiRefreshLine className={`h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />}
              isLoading={isAnalyzing}
              onClick={onAnalyze}
            >
              {analysis ? "Regenerate Analysis" : "Analyze Business"}
            </Button>

            <Button
              size="sm"
              variant="primary"
              leftIcon={<RiPresentationLine className="h-4 w-4" />}
              onClick={onOpenDemoModal}
            >
              Prepare Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
