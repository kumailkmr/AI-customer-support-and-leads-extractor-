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

export class MockWebsiteProvider implements ChannelProvider {
  type: ChannelType = "website";

  async getChannelInfo(clientId: string): Promise<ChannelInfo> {
    return {
      type: "website",
      name: "Website Live Chat Widget",
      description: "Embedded high-conversion web widget on client's landing pages.",
      status: "MOCK",
      accountIdentifier: `widget_${clientId}.nexusai.io`,
      capabilities: [
        "receive_messages",
        "send_messages",
        "lead_capture",
        "ai_support",
        "conversation_history",
        "attachments",
      ],
      simulated: true,
    };
  }

  async connect(clientId: string, accountIdentifier: string): Promise<ConnectionResult> {
    return {
      success: true,
      channelId: `chan_web_${clientId}`,
      status: "MOCK",
      message: `Website widget simulated at ${accountIdentifier || "demo.client.com"}. Script tag ready for installation.`,
    };
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const externalMessageId = `web_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      externalMessageId,
      deliveryStatus: "DELIVERED",
      deliveredAt: new Date().toISOString(),
    };
  }

  async simulateInboundEvent(input: SimulateInboundEventInput): Promise<ChannelEvent> {
    const eventId = input.externalEventId || `evt_web_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const rawPayload: Record<string, unknown> = {
      event: "widget.message.created",
      widget_id: `wid_${input.clientId}`,
      session_id: input.customerIdentifier || `sess_${Math.random().toString(36).substring(2, 9)}`,
      visitor: {
        name: input.customerName,
        email: input.customerEmail || "",
        phone: input.customerPhone || "",
        ip: "103.24.120.4",
        browser: "Chrome 122.0 / Windows",
      },
      message: {
        id: `wmsg_${Date.now()}`,
        body: input.messageText,
        created_at: now,
      },
      simulation_flag: true,
    };

    const normalized = this.normalizeEvent(rawPayload);

    return {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientId: input.clientId,
      channelId: `chan_web_${input.clientId}`,
      channelType: "website",
      externalEventId: eventId,
      eventType: "MESSAGE_RECEIVED",
      conversationId: input.conversationId,
      direction: "INBOUND",
      payload: rawPayload,
      normalizedPayload: normalized,
      status: input.shouldFail ? "FAILED" : "PROCESSED",
      receivedAt: now,
      processedAt: input.shouldFail ? undefined : now,
      error: input.shouldFail ? "Simulation Error: Webhook connection timed out (simulated failure)" : undefined,
      retryCount: 0,
    };
  }

  normalizeEvent(rawEvent: Record<string, unknown>): NormalizedChannelPayload {
    const visitor = (rawEvent.visitor as Record<string, unknown>) || {};
    const message = (rawEvent.message as Record<string, unknown>) || {};

    return {
      externalEventId: (rawEvent.event_id as string) || `web_evt_${Date.now()}`,
      externalMessageId: (message.id as string) || undefined,
      externalSenderId: (rawEvent.session_id as string) || "anonymous_web_visitor",
      senderName: (visitor.name as string) || "Website Visitor",
      senderContact: {
        email: (visitor.email as string) || undefined,
        phone: (visitor.phone as string) || undefined,
      },
      channelType: "website",
      text: (message.body as string) || "",
      timestamp: (message.created_at as string) || new Date().toISOString(),
      rawSource: "Website Chat Widget Webhook (Simulated)",
    };
  }
}
