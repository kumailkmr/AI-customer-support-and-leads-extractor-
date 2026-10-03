/**
 * NEXUS AI — Omnichannel Channel & Event Architecture Types
 *
 * Core abstractions for multi-channel communication:
 * Channel -> Channel Adapter -> Inbound Event -> Normalization -> Resolvers -> Unified Conversation
 */

export type ChannelType =
  | "website"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "email"
  | "phone"
  | "manual";

export type ChannelStatus =
  | "CONNECTED"
  | "NOT_CONNECTED"
  | "MOCK"
  | "NEEDS_SETUP"
  | "ERROR";

export type ChannelCapability =
  | "receive_messages"
  | "send_messages"
  | "lead_capture"
  | "ai_support"
  | "conversation_history"
  | "attachments"
  | "quick_replies"
  | "rich_cards";

export interface ChannelConfig {
  id: string;
  type: ChannelType;
  name: string;
  description: string;
  status: ChannelStatus;
  clientId: string;
  clientName: string;
  accountName: string;
  accountIdentifier: string; // e.g. @demo_business, +18005550199, support@business.com
  lastConnectedAt?: string;
  lastEventAt?: string;
  unreadCount: number;
  capabilities: ChannelCapability[];
  createdAt: string;
  updatedAt: string;
  simulationMode: boolean;
  metadata?: Record<string, unknown>;
}

// -------------------------------------------------------------
// Channel Identities (Mapping external users to single lead)
// -------------------------------------------------------------
export interface ChannelIdentity {
  id: string;
  clientId: string;
  leadId: string;
  channelType: ChannelType;
  externalUserId: string; // ID from external platform (e.g. IG user ID, WA phone number, web session)
  identifier: string; // Human display identifier (e.g. @ayaan_demo, +91 98765 43210)
  displayName: string;
  metadata?: {
    avatarUrl?: string;
    profileUrl?: string;
    email?: string;
    phone?: string;
    ipCountry?: string;
    device?: string;
  };
  firstSeenAt: string;
  lastSeenAt: string;
}

// -------------------------------------------------------------
// Normalized Event Model
// -------------------------------------------------------------
export type ChannelEventType =
  | "MESSAGE_RECEIVED"
  | "MESSAGE_SENT"
  | "MESSAGE_DELIVERED"
  | "MESSAGE_READ"
  | "MESSAGE_FAILED"
  | "CONVERSATION_STARTED"
  | "CONVERSATION_UPDATED"
  | "LEAD_CREATED"
  | "LEAD_UPDATED"
  | "CHANNEL_CONNECTED"
  | "CHANNEL_DISCONNECTED";

export type EventDirection = "INBOUND" | "OUTBOUND" | "SYSTEM";

export type EventProcessingStatus =
  | "PROCESSED"
  | "DUPLICATE"
  | "FAILED"
  | "RETRYING"
  | "PENDING";

export interface NormalizedAttachment {
  type: "image" | "file" | "audio" | "video";
  url: string;
  name: string;
  sizeBytes?: number;
  mimeType?: string;
}

export interface NormalizedChannelPayload {
  externalEventId: string;
  externalMessageId?: string;
  externalSenderId: string;
  senderName: string;
  senderContact?: {
    email?: string;
    phone?: string;
    handle?: string;
  };
  channelType: ChannelType;
  text: string;
  attachments?: NormalizedAttachment[];
  timestamp: string;
  intentHint?: string;
  rawSource: string;
}

export interface ChannelEvent {
  id: string;
  clientId: string;
  channelId: string;
  channelType: ChannelType;
  externalEventId: string; // Used for Idempotency key (clientId + channelId + externalEventId)
  eventType: ChannelEventType;
  conversationId?: string;
  leadId?: string;
  direction: EventDirection;
  payload: Record<string, unknown>; // Raw simulated webhook/API payload
  normalizedPayload: NormalizedChannelPayload;
  status: EventProcessingStatus;
  receivedAt: string;
  processedAt?: string;
  error?: string;
  retryCount: number;
}

// -------------------------------------------------------------
// Unified Messages & Delivery
// -------------------------------------------------------------
export type UnifiedMessageSender = "CUSTOMER" | "AI" | "HUMAN" | "SYSTEM";

export type UnifiedDeliveryStatus =
  | "QUEUED"
  | "SENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED";

export interface UnifiedMessage {
  id: string;
  conversationId: string;
  clientId: string;
  leadId?: string;
  channelId: string;
  channelType: ChannelType;
  direction: EventDirection;
  senderType: UnifiedMessageSender;
  senderName: string;
  content: string;
  attachments?: NormalizedAttachment[];
  externalMessageId?: string;
  deliveryStatus: UnifiedDeliveryStatus;
  createdAt: string;
  metadata?: {
    emailSubject?: string;
    emailFrom?: string;
    emailTo?: string;
    instagramStoryReply?: boolean;
    webSessionId?: string;
    whatsappMessageId?: string;
    intentDetected?: string;
    aiGenerated?: boolean;
  };
}

// -------------------------------------------------------------
// Channel Provider Abstraction
// -------------------------------------------------------------
export interface ChannelInfo {
  type: ChannelType;
  name: string;
  description: string;
  status: ChannelStatus;
  accountIdentifier: string;
  capabilities: ChannelCapability[];
  simulated: boolean;
}

export interface ConnectionResult {
  success: boolean;
  channelId: string;
  status: ChannelStatus;
  message: string;
}

export interface SendMessageInput {
  conversationId: string;
  clientId: string;
  leadId?: string;
  channelId: string;
  recipientIdentifier: string;
  content: string;
  senderType: UnifiedMessageSender;
  senderName: string;
  attachments?: NormalizedAttachment[];
  metadata?: Record<string, unknown>;
}

export interface SendMessageResult {
  success: boolean;
  messageId: string;
  externalMessageId: string;
  deliveryStatus: UnifiedDeliveryStatus;
  deliveredAt?: string;
  error?: string;
}

export interface SimulateInboundEventInput {
  clientId: string;
  channelType: ChannelType;
  customerName: string;
  customerIdentifier: string; // phone, handle, email, sessionId
  messageText: string;
  customerEmail?: string;
  customerPhone?: string;
  conversationId?: string;
  externalEventId?: string; // Optional custom ID for testing duplicate protection
  shouldFail?: boolean; // For testing retry/error handling
}

export interface ChannelProvider {
  type: ChannelType;
  getChannelInfo(clientId: string): Promise<ChannelInfo>;
  connect(clientId: string, accountIdentifier: string): Promise<ConnectionResult>;
  disconnect(clientId: string): Promise<void>;
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
  simulateInboundEvent(input: SimulateInboundEventInput): Promise<ChannelEvent>;
  normalizeEvent(rawEvent: Record<string, unknown>): NormalizedChannelPayload;
}
