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

export class MockWhatsAppProvider implements ChannelProvider {
  type: ChannelType = "whatsapp";

  async getChannelInfo(clientId: string): Promise<ChannelInfo> {
    return {
      type: "whatsapp",
      name: "WhatsApp Cloud Business API",
      description: "Official Meta WhatsApp Cloud Platform for instant customer chat.",
      status: "NEEDS_SETUP",
      accountIdentifier: `+1800555${clientId.slice(-4) || "0199"}`,
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
      channelId: `chan_wa_${clientId}`,
      status: "MOCK",
      message: `WhatsApp Business number ${accountIdentifier || "+1 (800) 555-0199"} registered in Cloud Sandbox. Webhook endpoint verified.`,
    };
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const externalMessageId = `wamid.HBgL${Date.now()}${Math.random().toString(36).substring(2, 7)}=`;
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      externalMessageId,
      deliveryStatus: "DELIVERED",
      deliveredAt: new Date().toISOString(),
    };
  }

  async simulateInboundEvent(input: SimulateInboundEventInput): Promise<ChannelEvent> {
    const eventId = input.externalEventId || `wa_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const phone = input.customerPhone || input.customerIdentifier || "+91 98765 43210";

    const rawPayload: Record<string, unknown> = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: `waba_${input.clientId}`,
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "+1 555 0199",
                  phone_number_id: `phone_id_${input.clientId}`,
                },
                contacts: [
                  {
                    profile: { name: input.customerName },
                    wa_id: phone.replace(/[^0-9]/g, ""),
                  },
                ],
                messages: [
                  {
                    from: phone.replace(/[^0-9]/g, ""),
                    id: `wamid_${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: input.messageText,
                    },
                    type: "text",
                  },
                ],
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
      channelId: `chan_wa_${input.clientId}`,
      channelType: "whatsapp",
      externalEventId: eventId,
      eventType: "MESSAGE_RECEIVED",
      conversationId: input.conversationId,
      direction: "INBOUND",
      payload: rawPayload,
      normalizedPayload: normalized,
      status: input.shouldFail ? "FAILED" : "PROCESSED",
      receivedAt: now,
      processedAt: input.shouldFail ? undefined : now,
      error: input.shouldFail ? "WhatsApp Cloud API Error: Phone number verification challenge failed (simulated error)" : undefined,
      retryCount: 0,
    };
  }

  normalizeEvent(rawEvent: Record<string, unknown>): NormalizedChannelPayload {
    const entry = Array.isArray(rawEvent.entry) ? rawEvent.entry[0] : {};
    const changes = Array.isArray(entry.changes) ? entry.changes[0] : {};
    const value = changes.value || {};
    const contact = Array.isArray(value.contacts) ? value.contacts[0] : {};
    const message = Array.isArray(value.messages) ? value.messages[0] : {};

    const phone = contact.wa_id ? `+${contact.wa_id}` : "+91 98765 43210";
    const name = contact.profile?.name || "WhatsApp User";
    const text = message.text?.body || "";

    return {
      externalEventId: (rawEvent.id as string) || `wa_evt_${Date.now()}`,
      externalMessageId: (message.id as string) || undefined,
      externalSenderId: contact.wa_id || "whatsapp_user",
      senderName: name,
      senderContact: {
        phone,
      },
      channelType: "whatsapp",
      text,
      timestamp: new Date().toISOString(),
      rawSource: "Meta WhatsApp Cloud API Webhook (Simulated)",
    };
  }
}
