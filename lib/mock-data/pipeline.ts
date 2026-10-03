import { PipelineStageData } from "@/types";

export const mockPipelineStages: PipelineStageData[] = [
  {
    id: "stage_new",
    name: "New",
    count: 248,
    totalValue: 124000,
    conversionRate: 64,
    color: "#64748B",
  },
  {
    id: "stage_contacted",
    name: "Contacted",
    count: 96,
    totalValue: 88000,
    conversionRate: 56,
    color: "#2563EB",
  },
  {
    id: "stage_interested",
    name: "Interested",
    count: 54,
    totalValue: 62000,
    conversionRate: 59,
    color: "#8B5CF6",
  },
  {
    id: "stage_qualified",
    name: "Qualified",
    count: 32,
    totalValue: 48000,
    conversionRate: 68,
    color: "#10B981",
  },
  {
    id: "stage_proposal",
    name: "Proposal",
    count: 18,
    totalValue: 36000,
    conversionRate: 72,
    color: "#F59E0B",
  },
  {
    id: "stage_won",
    name: "Won",
    count: 8,
    totalValue: 48500,
    conversionRate: 100,
    color: "#10B981",
  },
];
