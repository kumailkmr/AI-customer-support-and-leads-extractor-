import {
  ChannelEvent,
  ChannelType,
  SimulateInboundEventInput,
  NormalizedChannelPayload,
  ChannelIdentity,
} from "./types";
import { channelRegistry } from "./channel-registry";
import {
  ClientBusiness,
  ClientLead,
  ClientConversation,
  ChatMessage,
} from "@/types/leads";
import { classifyIntent } from "@/lib/ai-support/intent-engine";
import { extractLeadInfo } from "@/lib/ai-support/extraction-engine";

export interface EventProcessorContext {
  clients: ClientBusiness[];
  leads: ClientLead[];
  conversations: ClientConversation[];
  events: ChannelEvent[];
  identities: ChannelIdentity[];
}

export interface EventProcessingResult {
  success: boolean;
  duplicate: boolean;
  event: ChannelEvent;
  message?: ChatMessage;
  conversation?: ClientConversation;
  lead?: ClientLead;
  newIdentity?: ChannelIdentity;
  error?: string;
}

export function generateIdempotencyKey(clientId: string, channelType: ChannelType, externalEventId: string): string {
  return `${clientId}:${channelType}:${externalEventId}`;
}

export async function processInboundChannelEvent(
  input: SimulateInboundEventInput,
  context: EventProcessorContext
): Promise<EventProcessingResult> {
  const provider = channelRegistry.getProvider(input.channelType);
  if (!provider) {
    throw new Error(`Unsupported channel type: ${input.channelType}`);
  }

  // 1. Generate or validate event using channel provider
  const event = await provider.simulateInboundEvent(input);

  // 2. Check Idempotency / Duplicate Event
  const idempotencyKey = generateIdempotencyKey(event.clientId, event.channelType, event.externalEventId);
  const isDuplicate = context.events.some(
    (e) => generateIdempotencyKey(e.clientId, e.channelType, e.externalEventId) === idempotencyKey
  );

  if (isDuplicate) {
    const duplicateEvent: ChannelEvent = {
      ...event,
      status: "DUPLICATE",
      error: "Duplicate event ignored: Event with matching idempotency key already processed.",
      processedAt: new Date().toISOString(),
    };
    return {
      success: false,
      duplicate: true,
      event: duplicateEvent,
      error: "Duplicate event ignored (idempotency enforced)",
    };
  }

  // If simulate instructed failure:
  if (input.shouldFail) {
    return {
      success: false,
      duplicate: false,
      event,
      error: event.error || "Event processing failed",
    };
  }

  // 3. Resolve Client
  const client = context.clients.find((c) => c.id === input.clientId) || context.clients[0];
  const clientId = client ? client.id : input.clientId;
  const clientName = client ? client.businessName : "Client Business";

  // 4. Resolve Lead via Channel Identities, Email, or Phone
  const normalized = event.normalizedPayload;
  let resolvedLead: ClientLead | undefined = undefined;

  // Check matching channel identity
  const matchedIdentity = context.identities.find(
    (i) =>
      i.clientId === clientId &&
      i.channelType === input.channelType &&
      (i.externalUserId === normalized.externalSenderId ||
        (i.identifier && i.identifier.toLowerCase() === input.customerIdentifier.toLowerCase()))
  );

  if (matchedIdentity) {
    resolvedLead = context.leads.find((l) => l.id === matchedIdentity.leadId);
  }

  // Fallback: match by email or phone across all leads for this client
  if (!resolvedLead) {
    if (input.customerEmail) {
      resolvedLead = context.leads.find(
        (l) => l.clientId === clientId && l.email && l.email.toLowerCase() === input.customerEmail!.toLowerCase()
      );
    } else if (input.customerPhone) {
      const cleanPhone = input.customerPhone.replace(/[^0-9]/g, "");
      resolvedLead = context.leads.find(
        (l) => l.clientId === clientId && l.phone && l.phone.replace(/[^0-9]/g, "").includes(cleanPhone.slice(-8))
      );
    }
  }

  // 5. Resolve or Create Conversation
  let conversation: ClientConversation | undefined = undefined;

  if (input.conversationId) {
    conversation = context.conversations.find((c) => c.id === input.conversationId);
  } else if (resolvedLead?.conversationId) {
    conversation = context.conversations.find((c) => c.id === resolvedLead!.conversationId);
  } else if (resolvedLead) {
    conversation = context.conversations.find(
      (c) => c.clientId === clientId && c.leadId === resolvedLead!.id
    );
  }

  // Map channel type to legacy ClientLeadChannel
  const channelDisplayMap: Record<ChannelType, "Website Chat" | "Instagram" | "Facebook" | "WhatsApp" | "Email" | "Phone" | "Manual"> = {
    website: "Website Chat",
    instagram: "Instagram",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    email: "Email",
    phone: "Phone",
    manual: "Manual",
  };

  const currentChannelDisplay = channelDisplayMap[input.channelType];

  const now = new Date();
  const timeStr = "Just now";

  // 6. Intent & Information Extraction
  const detectedIntent = classifyIntent(input.messageText).intent;
  const extracted = extractLeadInfo(input.messageText);
  if (input.customerEmail && !extracted.email) extracted.email = input.customerEmail;
  if (input.customerPhone && !extracted.phone) extracted.phone = input.customerPhone;
  if (!extracted.name) extracted.name = input.customerName;

  // 7. Create ChatMessage
  const message: ChatMessage = {
    id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    conversationId: conversation ? conversation.id : `conv_${Date.now()}`,
    sender: "lead",
    content: input.messageText,
    timestamp: timeStr,
    aiGenerated: false,
    messageType: "text",
    metadata: {
      intentDetected: detectedIntent,
    },
  };

  // 8. If conversation does not exist, create new unified conversation
  if (!conversation) {
    conversation = {
      id: message.conversationId,
      clientId,
      clientName,
      leadId: resolvedLead?.id,
      leadName: resolvedLead?.name || input.customerName || "Inbound Visitor",
      leadContact: input.customerPhone || input.customerEmail || input.customerIdentifier,
      channel: currentChannelDisplay,
      channelHandle: input.customerIdentifier,
      status: "Active",
      aiMode: "autonomous",
      autoCaptureEnabled: true,
      messages: [message],
      intent: detectedIntent,
      sentiment: "neutral",
      qualificationStatus: resolvedLead ? resolvedLead.qualificationStatus : "IN_PROGRESS",
      extractedInfo: extracted,
      detectedObjection: null,
      handoff: null,
      suggestedNextAction: "Awaiting AI Support Assistant response",
      assignedTo: "AI Assistant",
      startedAt: now.toISOString(),
      updatedAt: now.toISOString(),
      lastMessageSnippet: input.messageText,
      lastMessageAt: timeStr,
      unreadCount: 1,
    };
  } else {
    // Append message to existing conversation
    conversation = {
      ...conversation,
      channel: currentChannelDisplay, // Updates active channel of message
      channelHandle: input.customerIdentifier || conversation.channelHandle,
      messages: [...conversation.messages, message],
      lastMessageSnippet: input.messageText,
      lastMessageAt: timeStr,
      unreadCount: conversation.unreadCount + 1,
      extractedInfo: extracted.name ? extracted : conversation.extractedInfo,
      updatedAt: now.toISOString(),
    };
  }

  // 9. If Lead doesn't exist, create lead if we have contact info or auto-capture
  if (!resolvedLead && (input.customerEmail || input.customerPhone || extracted.name)) {
    const leadName = extracted.name || input.customerName || "New Inbound Customer";
    resolvedLead = {
      id: `lead_${Date.now()}`,
      clientId,
      clientName,
      name: leadName,
      email: input.customerEmail || extracted.email || "",
      phone: input.customerPhone || extracted.phone || "",
      source: input.channelType === "website" ? "Website" : input.channelType === "instagram" ? "Instagram" : input.channelType === "whatsapp" ? "WhatsApp" : input.channelType === "facebook" ? "Facebook" : "Email",
      channel: currentChannelDisplay,
      intent: detectedIntent,
      status: "NEW",
      qualificationStatus: "IN_PROGRESS",
      qualificationCriteria: [
        { id: "crit_1", label: "Need identified", description: "Customer described specific request", value: "Yes" },
        { id: "crit_2", label: "Budget discussed", description: "Pricing mentioned", value: "Unknown" },
        { id: "crit_3", label: "Timeline known", description: "Date/time provided", value: extracted.preferredDate ? "Yes" : "Unknown" },
        { id: "crit_4", label: "Decision maker", description: "Direct buyer confirmed", value: "Unknown" },
        { id: "crit_5", label: "Service fit", description: "Client offerings match inquiry", value: "Yes" },
        { id: "crit_6", label: "Contact verified", description: "Reachable contact phone/email provided", value: input.customerPhone || input.customerEmail ? "Yes" : "Unknown" },
      ],
      score: 45,
      estimatedValue: 1200,
      tags: ["Omnichannel Inbound", input.channelType.toUpperCase()],
      conversationId: conversation.id,
      assignedTo: "Unassigned",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      lastActivityAt: timeStr,
      notes: [],
      activities: [
        {
          id: `act_${Date.now()}`,
          title: "Inbound Message via " + currentChannelDisplay,
          description: `Customer initiated conversation: "${input.messageText.slice(0, 60)}..."`,
          type: "message_received",
          timestamp: timeStr,
          channel: currentChannelDisplay,
          actor: "Visitor",
        },
      ],
      aiSummary: `Customer contacted ${clientName} via ${currentChannelDisplay} inquiring about ${detectedIntent}. Contact details captured.`,
    };

    // Associate lead with conversation
    conversation.leadId = resolvedLead.id;
    conversation.leadName = resolvedLead.name;
  }

  // 10. Create or Update Channel Identity
  let newIdentity: ChannelIdentity | undefined = undefined;
  if (resolvedLead && !matchedIdentity) {
    newIdentity = {
      id: `idnt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientId,
      leadId: resolvedLead.id,
      channelType: input.channelType,
      externalUserId: normalized.externalSenderId,
      identifier: input.customerIdentifier || normalized.senderName,
      displayName: input.customerName,
      firstSeenAt: now.toISOString(),
      lastSeenAt: now.toISOString(),
    };
  }

  // 11. Finalize Event Record
  const processedEvent: ChannelEvent = {
    ...event,
    conversationId: conversation.id,
    leadId: resolvedLead?.id,
    status: "PROCESSED",
    processedAt: now.toISOString(),
  };

  return {
    success: true,
    duplicate: false,
    event: processedEvent,
    message,
    conversation,
    lead: resolvedLead,
    newIdentity,
  };
}
