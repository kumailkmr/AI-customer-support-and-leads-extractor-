import { ProspectPipelineStatus, PipelineStageConfig } from "@/types/pipeline";

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    id: "FOUND",
    label: "Found",
    shortLabel: "Found",
    description: "Target business identified via market scans or manual entry.",
    color: "#64748B",
    bgColor: "#F1F5F9",
    borderColor: "#CBD5E1",
    textColor: "#334155",
    order: 0,
    allowedTransitions: ["RESEARCHING", "LOST"],
  },
  {
    id: "RESEARCHING",
    label: "Researching",
    shortLabel: "Research",
    description: "Auditing digital presence, website friction, and social channels.",
    color: "#0284C7",
    bgColor: "#F0F9FF",
    borderColor: "#BAE6FD",
    textColor: "#0369A1",
    order: 1,
    allowedTransitions: ["FOUND", "QUALIFIED", "LOST"],
  },
  {
    id: "QUALIFIED",
    label: "Qualified",
    shortLabel: "Qualified",
    description: "Confirmed acquisition opportunity with clear business fit.",
    color: "#059669",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    textColor: "#047857",
    order: 2,
    allowedTransitions: ["RESEARCHING", "DEMO READY", "LOST"],
  },
  {
    id: "DEMO READY",
    label: "Demo Ready",
    shortLabel: "Demo Ready",
    description: "Personalized demo and acquisition narrative prepared.",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    textColor: "#6D28D9",
    order: 3,
    allowedTransitions: ["QUALIFIED", "CONTACTED", "DEMO", "LOST"],
  },
  {
    id: "CONTACTED",
    label: "Contacted",
    shortLabel: "Contacted",
    description: "Initial outreach dispatched via Email, WhatsApp, or Phone.",
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    textColor: "#B45309",
    order: 4,
    allowedTransitions: ["DEMO READY", "REPLIED", "LOST"],
  },
  {
    id: "REPLIED",
    label: "Replied",
    shortLabel: "Replied",
    description: "Prospect engaged and responded to initial outreach.",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    textColor: "#1D4ED8",
    order: 5,
    allowedTransitions: ["CONTACTED", "DEMO", "PROPOSAL", "LOST"],
  },
  {
    id: "DEMO",
    label: "Demo",
    shortLabel: "Demo",
    description: "Live walkthrough or personalized solution presented.",
    color: "#9333EA",
    bgColor: "#FAF5FF",
    borderColor: "#E9D5FF",
    textColor: "#7E22CE",
    order: 6,
    allowedTransitions: ["REPLIED", "PROPOSAL", "LOST"],
  },
  {
    id: "PROPOSAL",
    label: "Proposal",
    shortLabel: "Proposal",
    description: "Formal commercial proposal and scope submitted.",
    color: "#4F46E5",
    bgColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    textColor: "#4338CA",
    order: 7,
    allowedTransitions: ["DEMO", "NEGOTIATION", "WON", "LOST"],
  },
  {
    id: "NEGOTIATION",
    label: "Negotiation",
    shortLabel: "Negotiation",
    description: "Commercials, pricing tier, or service agreement under review.",
    color: "#EA580C",
    bgColor: "#FFF7ED",
    borderColor: "#FED7AA",
    textColor: "#C2410C",
    order: 8,
    allowedTransitions: ["PROPOSAL", "WON", "LOST"],
  },
  {
    id: "WON",
    label: "Won",
    shortLabel: "Won",
    description: "Contract signed, deposit cleared, client successfully acquired.",
    color: "#16A34A",
    bgColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    textColor: "#15803D",
    order: 9,
    allowedTransitions: [],
  },
  {
    id: "LOST",
    label: "Lost",
    shortLabel: "Lost",
    description: "Prospect declined, disqualified, or timing not aligned.",
    color: "#DC2626",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    textColor: "#B91C1C",
    order: 10,
    allowedTransitions: ["FOUND", "RESEARCHING"],
  },
];

export const PIPELINE_STAGE_MAP = new Map<string, PipelineStageConfig>();
PIPELINE_STAGES.forEach((stage) => {
  PIPELINE_STAGE_MAP.set(stage.id, stage);
  PIPELINE_STAGE_MAP.set(stage.label.toUpperCase(), stage);
  PIPELINE_STAGE_MAP.set(stage.label, stage);
});

export function normalizePipelineStatus(
  status: string | undefined | null
): ProspectPipelineStatus {
  if (!status) return "FOUND";
  const upper = status.trim().toUpperCase();
  if (upper === "RESEARCH COMPLETE" || upper === "NEEDS REVIEW") return "RESEARCHING";
  if (upper === "REJECTED") return "LOST";
  if (PIPELINE_STAGE_MAP.has(upper)) {
    return PIPELINE_STAGE_MAP.get(upper)!.id;
  }
  return "FOUND";
}

export function getStageConfig(status: string): PipelineStageConfig {
  const normalized = normalizePipelineStatus(status);
  return (
    PIPELINE_STAGE_MAP.get(normalized) ||
    PIPELINE_STAGES[0]
  );
}
