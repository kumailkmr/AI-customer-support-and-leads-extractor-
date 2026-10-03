export type AnalysisCategory =
  | "Website"
  | "Lead Generation"
  | "Customer Experience"
  | "Sales"
  | "Follow-Up"
  | "Automation"
  | "Social Media"
  | "Booking"
  | "Communication"
  | "Operations"
  | "Data"
  | "Mobile Experience"
  | "AI Opportunity"
  | "Other";

export type AnalysisConfidence = "High" | "Medium" | "Low";

export type AnalysisStatus =
  | "Not Analyzed"
  | "Analyzing"
  | "Ready"
  | "Needs Review"
  | "Failed";

export type OpportunityPriority =
  | "High Potential"
  | "Medium Potential"
  | "Low Potential";

export type SignalSource =
  | "Research Data"
  | "NEXUS Analysis"
  | "Manually Edited";

export interface BusinessObservation {
  id: string;
  category: AnalysisCategory;
  title: string;
  description: string;
  evidence: string;
  severity: "High" | "Medium" | "Low";
  source: SignalSource;
  userEdited?: boolean;
}

export interface BusinessProblem {
  id: string;
  title: string;
  description: string;
  sourceObservationIds: string[];
  confidence: AnalysisConfidence;
  userEdited?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  problemIds: string[];
  potentialValue: string;
  priority: OpportunityPriority;
  priorityReason: string;
  userEdited?: boolean;
}

export interface RecommendedService {
  id: string;
  service: string;
  reason: string;
  opportunityId: string;
  category?: string;
  userEdited?: boolean;
}

export type BusinessImpactCategory =
  | "Lead Capture"
  | "Conversion Flow"
  | "Customer Experience"
  | "Response Time"
  | "Operational Efficiency"
  | "Follow-Up"
  | "Visibility"
  | "Data Management";

export interface BusinessImpact {
  category: BusinessImpactCategory;
  title: string;
  description: string;
}

export interface SolutionArchitectureNode {
  id: string;
  label: string;
  role: string;
  description: string;
  channel?: string;
}

export interface SolutionArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface SolutionArchitecture {
  nodes: SolutionArchitectureNode[];
  edges: SolutionArchitectureEdge[];
  description: string;
}

export interface DemoScreen {
  name: string;
  description: string;
  keyFeatures: string[];
}

export interface DemoStrategy {
  objective: string;
  screens: DemoScreen[];
  workflow: string[];
  keyFeatures: string[];
}

export interface OutreachAngle {
  headline: string;
  pitchAngle: string;
  suggestedHook: string;
  demoOffer: string;
  userEdited?: boolean;
}

export interface ReadinessArea {
  name: string;
  complete: boolean;
  details: string;
}

export interface ReadinessCheck {
  score: number;
  total: number;
  areas: ReadinessArea[];
  isReadyForDemo: boolean;
}

export interface BusinessAnalysis {
  id: string;
  prospectId: string;
  version: number;
  status: AnalysisStatus;
  summary: string;
  confidence: AnalysisConfidence;
  confidenceReason: string;
  primaryOpportunity: string;
  recommendedSolution: string;
  readiness: ReadinessCheck;
  observations: BusinessObservation[];
  problems: BusinessProblem[];
  opportunities: Opportunity[];
  recommendedServices: RecommendedService[];
  businessImpact: BusinessImpact[];
  solutionArchitecture: SolutionArchitecture;
  demoStrategy: DemoStrategy;
  outreachAngle: OutreachAngle;
  generatedAt: string;
  updatedAt: string;
  userEdited?: boolean;
}

export interface AnalysisHistoryRecord {
  id: string;
  analysisId: string;
  prospectId: string;
  version: number;
  status: AnalysisStatus;
  summary: string;
  primaryOpportunity: string;
  confidence: AnalysisConfidence;
  generatedAt: string;
  userEdited?: boolean;
  snapshot: BusinessAnalysis;
}

export interface AnalysisMetrics {
  totalAnalyzed: number;
  needsReview: number;
  analysisReady: number;
  demosReady: number;
}
