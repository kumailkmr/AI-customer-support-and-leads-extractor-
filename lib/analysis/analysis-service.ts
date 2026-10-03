import {
  AnalysisConfidence,
  AnalysisStatus,
  OpportunityPriority,
  BusinessAnalysis,
  AnalysisMetrics,
} from "@/types";

export function getConfidenceBadgeProps(confidence: AnalysisConfidence) {
  switch (confidence) {
    case "High":
      return {
        bg: "bg-[#ECFDF5]",
        text: "text-[#065F46]",
        border: "border-[#A7F3D0]",
        label: "High Confidence",
      };
    case "Medium":
      return {
        bg: "bg-[#EFF6FF]",
        text: "text-[#1E40AF]",
        border: "border-[#BFDBFE]",
        label: "Medium Confidence",
      };
    case "Low":
    default:
      return {
        bg: "bg-[#FFFBEB]",
        text: "text-[#92400E]",
        border: "border-[#FDE68A]",
        label: "Low Confidence",
      };
  }
}

export function getStatusBadgeProps(status: AnalysisStatus) {
  switch (status) {
    case "Ready":
      return {
        bg: "bg-[#ECFDF5]",
        text: "text-[#065F46]",
        border: "border-[#A7F3D0]",
        label: "Analysis Ready",
      };
    case "Analyzing":
      return {
        bg: "bg-[#F5F3FF]",
        text: "text-[#6D28D9]",
        border: "border-[#DDD6FE]",
        label: "Analyzing...",
      };
    case "Needs Review":
      return {
        bg: "bg-[#FFFBEB]",
        text: "text-[#B45309]",
        border: "border-[#FDE68A]",
        label: "Needs Review",
      };
    case "Failed":
      return {
        bg: "bg-[#FEF2F2]",
        text: "text-[#B91C1C]",
        border: "border-[#FECACA]",
        label: "Analysis Failed",
      };
    case "Not Analyzed":
    default:
      return {
        bg: "bg-[#F8FAFC]",
        text: "text-[#64748B]",
        border: "border-[#E2E8F0]",
        label: "Not Analyzed",
      };
  }
}

export function getPriorityBadgeProps(priority: OpportunityPriority) {
  switch (priority) {
    case "High Potential":
      return {
        bg: "bg-[#ECFDF5]",
        text: "text-[#047857]",
        border: "border-[#A7F3D0]",
      };
    case "Medium Potential":
      return {
        bg: "bg-[#EFF6FF]",
        text: "text-[#1D4ED8]",
        border: "border-[#BFDBFE]",
      };
    case "Low Potential":
    default:
      return {
        bg: "bg-[#F8FAFC]",
        text: "text-[#64748B]",
        border: "border-[#E2E8F0]",
      };
  }
}

export function getSeverityBadgeProps(severity: "High" | "Medium" | "Low") {
  switch (severity) {
    case "High":
      return {
        bg: "bg-[#FEF2F2]",
        text: "text-[#DC2626]",
        border: "border-[#FECACA]",
      };
    case "Medium":
      return {
        bg: "bg-[#FFFBEB]",
        text: "text-[#D97706]",
        border: "border-[#FDE68A]",
      };
    case "Low":
    default:
      return {
        bg: "bg-[#F8FAFC]",
        text: "text-[#64748B]",
        border: "border-[#E2E8F0]",
      };
  }
}

export function calculateAnalysisMetrics(
  analyses: Record<string, BusinessAnalysis>
): AnalysisMetrics {
  const items = Object.values(analyses);
  return {
    totalAnalyzed: items.filter((a) => a.status === "Ready" || a.status === "Needs Review").length,
    needsReview: items.filter((a) => a.status === "Needs Review").length,
    analysisReady: items.filter((a) => a.status === "Ready").length,
    demosReady: items.filter(
      (a) => a.status === "Ready" && a.readiness?.isReadyForDemo
    ).length,
  };
}
