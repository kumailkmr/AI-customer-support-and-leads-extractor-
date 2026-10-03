export type ProspectPipelineStatus =
  | "FOUND"
  | "RESEARCHING"
  | "QUALIFIED"
  | "DEMO READY"
  | "CONTACTED"
  | "REPLIED"
  | "DEMO"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export interface PipelineStageConfig {
  id: ProspectPipelineStatus;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  order: number;
  allowedTransitions: ProspectPipelineStatus[];
}
