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

export class MockInstagramProvider implements ChannelProvider {
  type: ChannelType = "instagram";

  async getChannelInfo(clientId: string): Promise<ChannelInfo> {
    return {
      type: "instagram",
      name: "Instagram Direct Messaging",
      description: "Official Meta Graph API simulation for direct messages and story replies.",
      status: "NEEDS_SETUP",
      accountIdentifier: "@client_business",
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
      channelId: `chan_ig_${clientId}`,
      status: "MOCK",
      message: `Meta Instagram Business account ${accountIdentifier || "@demo_brand"} verified in Simulation Mode. Webhook registered.`,
    };
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const externalMessageId = `mid.ig.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      externalMessageId,
      deliveryStatus: "DELIVERED",
      deliveredAt: new Date().toISOString(),
    };
  }

  async simulateInboundEvent(input: SimulateInboundEventInput): Promise<ChannelEvent> {
    const eventId = input.externalEventId || `ig_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const handle = input.customerIdentifier.startsWith("@") ? input.customerIdentifier : `@${input.customerIdentifier}`;

    const rawPayload: Record<string, unknown> = {
      object: "instagram",
      entry: [
        {
          id: "17841400000000001",
          time: Math.floor(Date.now() / 1000),
          messaging: [
            {
              sender: {
                id: `ig_user_${Math.random().toString(36).substring(2, 9)}`,
                username: handle.replace("@", ""),
                name: input.customerName,
              },
              recipient: {
                id: "17841400000000001",
              },
              timestamp: Date.now(),
              message: {
                mid: `m_ig_${Date.now()}`,
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
      channelId: `chan_ig_${input.clientId}`,
      channelType: "instagram",
      externalEventId: eventId,
      eventType: "MESSAGE_RECEIVED",
      conversationId: input.conversationId,
      direction: "INBOUND",
      payload: rawPayload,
      normalizedPayload: normalized,
      status: input.shouldFail ? "FAILED" : "PROCESSED",
      receivedAt: now,
      processedAt: input.shouldFail ? undefined : now,
      error: input.shouldFail ? "Meta Graph API Error: Token rate-limited on simulated webhook delivery" : undefined,
      retryCount: 0,
    };
  }

  normalizeEvent(rawEvent: Record<string, unknown>): NormalizedChannelPayload {
    const entry = Array.isArray(rawEvent.entry) ? rawEvent.entry[0] : {};
    const messaging = Array.isArray(entry.messaging) ? entry.messaging[0] : {};
    const sender = messaging.sender || {};
    const message = messaging.message || {};

    const username = (sender.username as string) || (sender.name as string) || "instagram_user";

    return {
      externalEventId: (rawEvent.id as string) || `ig_evt_${Date.now()}`,
      externalMessageId: (message.mid as string) || undefined,
      externalSenderId: (sender.id as string) || `ig_user_${username}`,
      senderName: (sender.name as string) || `@${username}`,
      senderContact: {
        handle: `@${username}`,
      },
      channelType: "instagram",
      text: (message.text as string) || "",
      timestamp: new Date().toISOString(),
      rawSource: "Meta Instagram Graph Webhook (Simulated)",
    };
  }
}
