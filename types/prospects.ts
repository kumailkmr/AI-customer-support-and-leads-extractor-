export type OpportunityLevel = "High" | "Medium" | "Low";

export type ProspectPipelineStatus =
  | "Found"
  | "Researching"
  | "Research Complete"
  | "Needs Review"
  | "Qualified"
  | "Demo Ready"
  | "Contacted"
  | "Replied"
  | "Demo"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost"
  | "Rejected";

export interface ResearchObservations {
  contactFlow: string;
  faqAccess: string;
  leadCapture: string;
  followUp: string;
}

export interface OpportunitySignalItem {
  enabled: boolean;
  label: string;
  description: string;
  impactPotential: "High" | "Medium" | "Low";
}

export interface OpportunitySignals {
  customerSupport: OpportunitySignalItem;
  leadCapture: OpportunitySignalItem;
  followUp: OpportunitySignalItem;
  aiQualification: OpportunitySignalItem;
  unifiedInbox: OpportunitySignalItem;
}

export interface ProspectNote {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

export interface ProspectActivity {
  id: string;
  type:
    | "discovered"
    | "researched"
    | "status_change"
    | "note_added"
    | "contacted"
    | "analysis_initiated"
    | "pipeline_advanced";
  title: string;
  description: string;
  timestamp: string;
}

export interface SocialPresence {
  instagram?: { handle: string; followers?: string; active: boolean };
  facebook?: { page: string; likes?: string; active: boolean };
  whatsapp?: { number: string; businessVerified: boolean };
  googleBusiness?: { rating: number; reviewCount: number; claimed: boolean };
}

export interface BusinessProspect {
  id: string;
  businessName: string;
  category: string;
  industry: string;
  location: string;
  city: string;
  country: string;
  website: string;
  hasWebsite: boolean;
  phone?: string;
  email?: string;
  address?: string;
  companySize?: string;
  socialPresence: SocialPresence;
  opportunityLevel: OpportunityLevel;
  nexusFitScore: number; // 0 - 100
  nexusFitRationale: string; // Clearly labeled as observational potential
  status: ProspectPipelineStatus;
  isProspect: boolean; // true if added to user's active prospects list
  discoveredAt: string;
  lastResearchedAt?: string;
  lastActivity: string;
  researchObservations: ResearchObservations;
  opportunitySignals: OpportunitySignals;
  identifiedPainPoints: string[];
  suggestedAngle: string;
  notes: ProspectNote[];
  activityHistory: ProspectActivity[];
}
