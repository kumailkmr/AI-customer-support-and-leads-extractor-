export * from "./pipeline";
export * from "./prospects";
export * from "./analysis";

export type StatusType =
  | "New"
  | "Contacted"
  | "Interested"
  | "Qualified"
  | "Demo"
  | "Proposal"
  | "Negotiation"
  | "Won"
  | "Lost"
  | "Follow-up"
  | "Escalated"
  | "Active"
  | "Inactive"
  | "Pending";

export type ChannelType =
  | "Instagram"
  | "WhatsApp"
  | "Facebook"
  | "Website"
  | "Email";

export type AIIntentType =
  | "high_intent"
  | "pricing_inquiry"
  | "objection_handling"
  | "demo_request"
  | "support"
  | "unqualified";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  companyName: string;
  workspaceName: string;
  status: "online" | "busy" | "away";
}

export interface MetricItem {
  id: string;
  title: string;
  value: string | number;
  changePercentage: number;
  isPositiveChange: boolean;
  timeframe: string;
  iconName: string;
  accentColor?: "blue" | "emerald" | "violet" | "amber";
  subtitle?: string;
}

export interface ChannelPerformance {
  channel: ChannelType;
  totalConversations: number;
  qualifiedLeads: number;
  conversionRate: number;
  activeAutomations: number;
  status: "connected" | "warning" | "disconnected";
  unreadCount: number;
}

export interface PipelineStageData {
  id: string;
  name: StatusType;
  count: number;
  totalValue: number;
  conversionRate: number;
  color: string;
}

export interface Lead {
  id: string;
  fullName: string;
  company: string;
  role: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  channel: ChannelType;
  status: StatusType;
  aiQualificationScore: number; // 0-100
  estimatedValue: number;
  primaryNeed: string;
  lastContactedAt: string;
  nextFollowUpAt?: string;
  aiSummary: string;
  tags: string[];
}

export interface Prospect {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  websiteUrl?: string;
  socialHandles: {
    website?: string;
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    email?: string;
  };
  relevanceScore: number;
  status: "Discovered" | "Enriched" | "Ready" | "Contacted";
  identifiedPainPoints: string[];
  suggestedAngle: string;
}

export interface ConversationMessage {
  id: string;
  sender: "user" | "lead" | "ai_agent";
  content: string;
  timestamp: string;
  isAiGenerated?: boolean;
  sentiment?: "positive" | "neutral" | "hesitant" | "negative";
}

export interface Conversation {
  id: string;
  contactName: string;
  contactRole?: string;
  companyName: string;
  avatarUrl?: string;
  channel: ChannelType;
  channelHandle: string;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageAt: string;
  status: StatusType;
  aiIntent: AIIntentType;
  aiHandled: boolean;
  messages: ConversationMessage[];
}

export interface AIActivityItem {
  id: string;
  timestamp: string;
  type:
    | "lead_qualified"
    | "conversation_handled"
    | "follow_up_scheduled"
    | "escalation"
    | "objection_handled"
    | "proposal_generated";
  title: string;
  description: string;
  leadName?: string;
  channel?: ChannelType;
  confidenceScore: number; // 0-100
  impactTag?: string;
}

export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  metric?: string;
  suggestedAction: string;
  actionType: "schedule_followup" | "adjust_pricing" | "escalate_lead" | "send_proposal";
  severity?: "low" | "medium" | "high";
}

export interface FollowUpItem {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  channel: ChannelType;
  scheduledFor: string;
  status: "pending" | "sent" | "overdue" | "cancelled";
  recommendedMessage: string;
  triggerReason: string;
}

export interface Client {
  id: string;
  companyName: string;
  primaryContact: string;
  contactEmail: string;
  plan: string;
  monthlyRevenue: number;
  acquisitionChannel: ChannelType;
  onboardingStatus: "complete" | "in_progress" | "pending";
  healthScore: number;
  signedAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  companyName: string;
  amount: number;
  status: "Draft" | "Sent" | "Viewed" | "Accepted" | "Expired" | "Rejected";
  sentAt?: string;
  expiresAt: string;
  aiGeneratedSummary: string;
}
