export type FollowUpTargetType = "LEAD" | "PROSPECT";

export type FollowUpType =
  | "NO_REPLY_NUDGE"
  | "POST_BOOKING_REMINDER"
  | "DEMO_PREPARATION"
  | "QUOTE_EXCLUSIVITY_EXPIRATION"
  | "NURTURE_SEQUENCE"
  | "RE_ENGAGEMENT"
  | "FEEDBACK_CHECKIN"
  | "CUSTOM";

export type FollowUpStatus =
  | "SCHEDULED"
  | "DUE"
  | "PROCESSING"
  | "SENT"
  | "PAUSED"
  | "CANCELLED"
  | "FAILED"
  | "COMPLETED";

export type FollowUpPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type AutomationMode = "MANUAL_APPROVAL" | "AUTONOMOUS";

export type FollowUpChannel = "whatsapp" | "instagram" | "facebook" | "email" | "website";

export interface FollowUpHistoryEvent {
  id: string;
  timestamp: string;
  action: string;
  note?: string;
  performedBy: string; // e.g. "NEXUS AI System", "Agent Kumail", "Rule: Inactivity Nudge"
}

export interface FollowUp {
  id: string;
  targetType: FollowUpTargetType;
  targetId: string;
  targetName: string;
  targetSubtext?: string; // e.g. "Alpine Grand Hotel" or "Srinagar, Kashmir"
  clientId?: string; // If targetType === "LEAD", the client company ID
  clientName?: string; // If targetType === "LEAD", the client company name
  type: FollowUpType;
  priority: FollowUpPriority;
  channel: FollowUpChannel;
  status: FollowUpStatus;
  automationMode: AutomationMode;
  scheduledAt: string; // ISO String
  dueAt: string; // ISO String
  sentAt?: string; // ISO String
  triggerReason: string;
  templateId?: string;
  message: string;
  subject?: string; // for email channel
  metadata?: Record<string, any>;
  ruleId?: string;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  history: FollowUpHistoryEvent[];
  createdAt: string;
  updatedAt: string;
}

export type AutomationTriggerType =
  | "LEAD_QUALIFIED"
  | "NO_REPLY_HOURS"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_UPCOMING"
  | "QUOTE_SENT"
  | "HUMAN_HANDOFF_ACTIVATED"
  | "DEMO_DELIVERED"
  | "PROSPECT_STATUS_CHANGED";

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "contains"
  | "in";

export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

export type AutomationActionType =
  | "SCHEDULE_FOLLOW_UP"
  | "SEND_IMMEDIATE_MESSAGE"
  | "NOTIFY_AGENT"
  | "UPDATE_STATUS"
  | "PAUSE_EXISTING_FOLLOW_UPS";

export interface AutomationActionConfig {
  type: AutomationActionType;
  followUpType?: FollowUpType;
  channel?: FollowUpChannel;
  templateId?: string;
  automationMode: AutomationMode;
  priority: FollowUpPriority;
  delayHours?: number;
  customMessageTemplate?: string;
  statusToUpdate?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  targetType: FollowUpTargetType;
  category: "Client Lead Capture" | "Prospect Acquisition" | "Omnichannel Handoff" | "Re-engagement";
  enabled: boolean;
  trigger: {
    type: AutomationTriggerType;
    delayMinutes?: number;
    config?: Record<string, any>;
  };
  conditions: AutomationCondition[];
  action: AutomationActionConfig;
  createdAt: string;
  updatedAt: string;
  runsCount: number;
  successCount: number;
}

export type AutomationRunStatus = "SUCCESS" | "SKIPPED" | "FAILED" | "DUPLICATE";

export interface AutomationRun {
  id: string;
  ruleId: string;
  ruleName: string;
  targetType: FollowUpTargetType;
  targetId: string;
  targetName: string;
  triggerEvent: string;
  status: AutomationRunStatus;
  reason: string;
  followUpId?: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface MessageTemplate {
  id: string;
  name: string;
  targetType: FollowUpTargetType;
  category: "No-Reply Nudge" | "Appointment & Reminders" | "Demo & Proposal" | "Re-engagement" | "VIP & Objections";
  channel: FollowUpChannel;
  subject?: string;
  body: string;
  variables: string[];
  isSystemDefault: boolean;
  updatedAt: string;
}

export interface FollowUpSuggestion {
  id: string;
  targetType: FollowUpTargetType;
  targetId: string;
  targetName: string;
  targetSubtext?: string;
  clientId?: string;
  clientName?: string;
  recommendedType: FollowUpType;
  recommendedChannel: FollowUpChannel;
  confidenceScore: number; // e.g. 0.94
  urgency: FollowUpPriority;
  rationale: string;
  suggestedDelayHours: number;
  draftMessage: string;
}

export interface VariableDescriptor {
  key: string;
  label: string;
  example: string;
  targetScope: "LEAD" | "PROSPECT" | "BOTH";
}
