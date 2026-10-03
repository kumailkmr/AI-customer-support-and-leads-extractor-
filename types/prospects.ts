import { ProspectPipelineStatus } from "./pipeline";

export type { ProspectPipelineStatus };

export type OpportunityLevel = "High" | "Medium" | "Low";

export type AcquisitionSource =
  | "Manual"
  | "Website Research"
  | "Referral"
  | "Social Media"
  | "Directory"
  | "Other";

export type FollowUpStatus = "overdue" | "today" | "upcoming" | "none";

export type ResponseStatus =
  | "Not Contacted"
  | "Awaiting Reply"
  | "Replied"
  | "Positive"
  | "Neutral"
  | "Not Interested";

export type ActivityType =
  | "prospect_added"
  | "research_started"
  | "research_completed"
  | "qualified"
  | "demo_prepared"
  | "email_sent"
  | "whatsapp_sent"
  | "instagram_sent"
  | "call_made"
  | "reply_received"
  | "demo_scheduled"
  | "demo_completed"
  | "proposal_sent"
  | "negotiation_started"
  | "follow_up_scheduled"
  | "status_changed"
  | "note_added"
  | "deal_updated";

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
  title: string;
  content: string;
  author: string;
  authorRole: string;
  tag?: string;
  timestamp: string;
  createdAt: string;
}

export interface ProspectActivity {
  id: string;
  timestamp: string;
  type: ActivityType;
  title: string;
  description: string;
  actor: string;
  channel?: "Email" | "WhatsApp" | "Instagram" | "Facebook" | "Call" | "Website" | "Other";
  contactPerson?: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface ProspectFollowUp {
  date: string;
  time: string;
  channel: "Email" | "WhatsApp" | "Instagram" | "Facebook" | "Call" | "Other";
  reminder: boolean;
  notes: string;
  status: FollowUpStatus;
}

export interface ContactAttemptsSummary {
  total: number;
  email: number;
  whatsapp: number;
  call: number;
  instagram: number;
  lastContactedAt?: string;
  responseStatus: ResponseStatus;
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
  email?: string;
  phone?: string;
  address?: string;
  companySize?: string;

  socialPresence: SocialPresence;

  status: ProspectPipelineStatus;

  opportunityLevel: OpportunityLevel;
  opportunityScore: number; // 0 - 100
  nexusFitScore: number; // 0 - 100
  nexusFitRationale: string; // Observational potential

  estimatedDealValue: number; // e.g. 45000 (one-time setup)
  monthlyValue: number; // e.g. 12000 (monthly recurring)
  serviceInterest: string[];

  acquisitionSource: AcquisitionSource;
  assignedTo: string;

  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  lastActivity: string;

  nextFollowUpAt?: string;
  followUp?: ProspectFollowUp;

  contactAttempts: ContactAttemptsSummary;
  researchStatus: string;

  researchObservations: ResearchObservations;
  opportunitySignals: OpportunitySignals;
  identifiedPainPoints: string[];
  suggestedAngle: string;

  notes: ProspectNote[];
  activityHistory: ProspectActivity[];
  tags: string[];
  customFields?: Record<string, string>;

  isProspect: boolean; // true if in CRM active prospects
  discoveredAt: string;
  lastResearchedAt?: string;
}

export interface CrmMetrics {
  totalProspects: number;
  activeOpportunities: number;
  contacted: number;
  replies: number;
  demos: number;
  proposals: number;
  won: number;
  pipelineValue: number;
}
