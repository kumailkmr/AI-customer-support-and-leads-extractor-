import {
  ChannelProvider,
  ChannelType,
  ChannelInfo,
  ConnectionResult,
  SendMessageInput,
  SendMessageResult,
  SimulateInboundEventInput,
  ChannelEvent,
  NormalizedChannelPayload,
} from "../types";

export class MockFacebookProvider implements ChannelProvider {
  type: ChannelType = "facebook";

  async getChannelInfo(clientId: string): Promise<ChannelInfo> {
    return {
      type: "facebook",
      name: "Facebook Messenger",
      description: "Meta Messenger Platform simulation for official Facebook Page messages.",
      status: "NEEDS_SETUP",
      accountIdentifier: `page_${clientId}`,
      capabilities: [
        "receive_messages",
        "send_messages",
        "lead_capture",
        "ai_support",
        "conversation_history",
        "attachments",
        "quick_replies",
      ],
      simulated: true,
    };
  }

  async connect(clientId: string, accountIdentifier: string): Promise<ConnectionResult> {
    return {
      success: true,
      channelId: `chan_fb_${clientId}`,
      status: "MOCK",
      message: `Facebook Page ${accountIdentifier || "Official Business Page"} simulated connection verified. Page webhook subscribed.`,
    };
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const externalMessageId = `mid.fb.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      externalMessageId,
      deliveryStatus: "DELIVERED",
      deliveredAt: new Date().toISOString(),
    };
  }

  async simulateInboundEvent(input: SimulateInboundEventInput): Promise<ChannelEvent> {
    const eventId = input.externalEventId || `fb_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const rawPayload: Record<string, unknown> = {
      object: "page",
      entry: [
        {
          id: `page_${input.clientId}`,
          time: Date.now(),
          messaging: [
            {
              sender: {
                id: input.customerIdentifier || `fb_user_${Math.random().toString(36).substring(2, 8)}`,
                name: input.customerName,
              },
              recipient: {
                id: `page_${input.clientId}`,
              },
              message: {
                mid: `mid_fb_${Date.now()}`,
                text: input.messageText,
              },
            },
          ],
        },
      ],
      simulation_flag: true,
    };

    const normalized = this.normalizeEvent(rawPayload);

    return {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientId: input.clientId,
      channelId: `chan_fb_${input.clientId}`,
      channelType: "facebook",
      externalEventId: eventId,
      eventType: "MESSAGE_RECEIVED",
      conversationId: input.conversationId,
      direction: "INBOUND",
      payload: rawPayload,
      normalizedPayload: normalized,
      status: input.shouldFail ? "FAILED" : "PROCESSED",
      receivedAt: now,
      processedAt: input.shouldFail ? undefined : now,
      error: input.shouldFail ? "Meta Messenger Error: PSID validation failed (simulated webhook error)" : undefined,
      retryCount: 0,
    };
  }

  normalizeEvent(rawEvent: Record<string, unknown>): NormalizedChannelPayload {
    const entry = Array.isArray(rawEvent.entry) ? rawEvent.entry[0] : {};
    const messaging = Array.isArray(entry.messaging) ? entry.messaging[0] : {};
    const sender = messaging.sender || {};
    const message = messaging.message || {};

    return {
      externalEventId: (rawEvent.id as string) || `fb_evt_${Date.now()}`,
      externalMessageId: (message.mid as string) || undefined,
      externalSenderId: (sender.id as string) || "facebook_user",
      senderName: (sender.name as string) || "Facebook Visitor",
      channelType: "facebook",
      text: (message.text as string) || "",
      timestamp: new Date().toISOString(),
      rawSource: "Meta Messenger Webhook (Simulated)",
    };
  }
}
