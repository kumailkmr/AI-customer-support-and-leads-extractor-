export type ClientLeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFYING"
  | "QUALIFIED"
  | "FOLLOW_UP"
  | "HUMAN_HANDOFF"
  | "CONVERTED"
  | "NOT_INTERESTED"
  | "LOST";

export type ClientLeadSource =
  | "Website"
  | "Instagram"
  | "Facebook"
  | "WhatsApp"
  | "Email"
  | "Referral"
  | "Demo"
  | "Manual"
  | "Other";

export type ClientLeadChannel =
  | "Website Chat"
  | "Instagram"
  | "Facebook"
  | "WhatsApp"
  | "Email"
  | "Phone"
  | "Manual";

export type ClientLeadIntent =
  | "Information Request"
  | "Pricing Inquiry"
  | "Booking"
  | "Appointment"
  | "Admission"
  | "Product Inquiry"
  | "Service Inquiry"
  | "Support"
  | "Complaint"
  | "Demo Request"
  | "General Inquiry"
  | "Other";

export type QualificationStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "QUALIFIED"
  | "NOT_QUALIFIED"
  | "NEEDS_HUMAN_REVIEW";

export type QualificationValue = "Unknown" | "Yes" | "No" | "Not Applicable";

export type ObjectionCategory =
  | "Price"
  | "Timing"
  | "Trust"
  | "Need More Information"
  | "Already Have Provider"
  | "Not Interested"
  | "Decision Maker"
  | "Comparison"
  | "Other";

export type ConversationStatus = "Active" | "Needs Attention" | "Human Active" | "Closed";

export type AiConversationMode = "autonomous" | "paused" | "human_takeover" | "resolved";

export type MessageSender = "lead" | "ai" | "human";

export type MessageType = "text" | "system" | "qualification" | "handoff" | "follow_up";

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  aiGenerated: boolean;
  messageType: MessageType;
  metadata?: {
    intentDetected?: ClientLeadIntent;
    objectionDetected?: ObjectionCategory;
    qualificationTriggered?: boolean;
    handoffReason?: string;
  };
}

export interface ExtractedLeadInfo {
  name?: string;
  email?: string;
  phone?: string;
  intent?: ClientLeadIntent;
  requestedService?: string;
  preferredDate?: string;
  notes?: string;
  reviewStatus: "pending" | "accepted" | "edited" | "ignored";
  confidence: "High" | "Medium" | "Low";
}

export interface QualificationCriterion {
  id: string;
  label: string;
  description: string;
  value: QualificationValue;
  notes?: string;
}

export interface ClientLeadNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface ClientLeadActivity {
  id: string;
  title: string;
  description: string;
  type:
    | "lead_created"
    | "message_received"
    | "ai_response"
    | "intent_detected"
    | "information_extracted"
    | "qualification_updated"
    | "follow_up_scheduled"
    | "human_handoff"
    | "human_replied"
    | "status_changed"
    | "conversation_closed";
  timestamp: string;
  channel?: ClientLeadChannel;
  actor: "AI Assistant" | "Team Member" | "Visitor";
}

export interface ClientLead {
  id: string;
  clientId: string;
  clientName: string;

  name: string;
  email: string;
  phone: string;

  source: ClientLeadSource;
  channel: ClientLeadChannel;

  intent: ClientLeadIntent;
  status: ClientLeadStatus;

  qualificationStatus: QualificationStatus;
  qualificationCriteria: QualificationCriterion[];
  score: number; // 0-100 calculated from criteria & completeness
  estimatedValue: number;

  tags: string[];

  conversationId?: string;

  assignedTo: string;

  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  nextFollowUpAt?: string;

  notes: ClientLeadNote[];
  activities: ClientLeadActivity[];

  aiSummary: string;
}

export interface ClientConversation {
  id: string;
  clientId: string;
  clientName: string;
  leadId?: string;
  leadName: string;
  leadContact?: string;

  channel: ClientLeadChannel;
  channelHandle?: string;

  status: ConversationStatus;
  aiMode: AiConversationMode;
  autoCaptureEnabled: boolean;

  messages: ChatMessage[];

  intent: ClientLeadIntent;
  sentiment: "positive" | "neutral" | "hesitant" | "negative";
  qualificationStatus: QualificationStatus;

  extractedInfo?: ExtractedLeadInfo;
  detectedObjection?: {
    category: ObjectionCategory;
    snippet: string;
    recommendedAction: string;
  } | null;

  handoff?: {
    requestedAt: string;
    reason: string;
    status: "pending" | "accepted" | "declined";
  } | null;

  suggestedNextAction: string;
  assignedTo: string;

  startedAt: string;
  updatedAt: string;
  lastMessageSnippet: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ClientBusiness {
  id: string;
  businessName: string;
  industry: string;
  location: string;
  logo?: string;
  website?: string;
  status: "Active" | "Onboarding" | "Paused";
  plan: string;
  mrr: number;
  assignedAgent: string;
  activeChannels: ClientLeadChannel[];
  createdAt: string;
}

export interface ClientLeadMetrics {
  totalLeads: number;
  newLeads: number;
  qualifying: number;
  qualified: number;
  followUp: number;
  humanHandoff: number;
  converted: number;
  pipelineValue: number;
}

export interface ClientConversationMetrics {
  totalConversations: number;
  aiActive: number;
  humanActive: number;
  needsAttention: number;
  closed: number;
  channelBreakdown: Record<ClientLeadChannel, number>;
}
