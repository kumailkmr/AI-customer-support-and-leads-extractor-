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

export class MockEmailProvider implements ChannelProvider {
  type: ChannelType = "email";

  async getChannelInfo(clientId: string): Promise<ChannelInfo> {
    return {
      type: "email",
      name: "Inbound & Outbound Email Server",
      description: "Dedicated SMTP/IMAP/SES relay for business inbox integration.",
      status: "MOCK",
      accountIdentifier: `support@${clientId.toLowerCase().replace(/[^a-z0-9]/g, "") || "client"}.com`,
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
      channelId: `chan_email_${clientId}`,
      status: "MOCK",
      message: `Inbound MX DNS records simulated for ${accountIdentifier || "contact@client.com"}. DMARC/SPF/DKIM verified.`,
    };
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }

  async sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    const externalMessageId = `<${Date.now()}.${Math.random().toString(36).substring(2, 8)}@mail.nexusai.io>`;
    return {
      success: true,
      messageId: `msg_${Date.now()}`,
      externalMessageId,
      deliveryStatus: "DELIVERED",
      deliveredAt: new Date().toISOString(),
    };
  }

  async simulateInboundEvent(input: SimulateInboundEventInput): Promise<ChannelEvent> {
    const eventId = input.externalEventId || `em_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const email = input.customerEmail || input.customerIdentifier || "customer@example.com";

    const rawPayload: Record<string, unknown> = {
      event: "email.received",
      mail: {
        messageId: `<inbound_${Date.now()}@relay.nexusai.io>`,
        source: email,
        destination: [`support@${input.clientId}.nexusai.io`],
        commonHeaders: {
          from: [`${input.customerName} <${email}>`],
          to: [`Client Support <support@client.com>`],
          subject: "Inquiry regarding services and availability",
          date: now,
        },
      },
      content: {
        textBody: input.messageText,
        htmlBody: `<p>${input.messageText}</p>`,
      },
      simulation_flag: true,
    };

    const normalized = this.normalizeEvent(rawPayload);

    return {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      clientId: input.clientId,
      channelId: `chan_email_${input.clientId}`,
      channelType: "email",
      externalEventId: eventId,
      eventType: "MESSAGE_RECEIVED",
      conversationId: input.conversationId,
      direction: "INBOUND",
      payload: rawPayload,
      normalizedPayload: normalized,
      status: input.shouldFail ? "FAILED" : "PROCESSED",
      receivedAt: now,
      processedAt: input.shouldFail ? undefined : now,
      error: input.shouldFail ? "SMTP Relay Timeout: Inbound email rejected by spam filter (simulated error)" : undefined,
      retryCount: 0,
    };
  }

  normalizeEvent(rawEvent: Record<string, unknown>): NormalizedChannelPayload {
    const mail = (rawEvent.mail as Record<string, unknown>) || {};
    const commonHeaders = (mail.commonHeaders as Record<string, unknown>) || {};
    const content = (rawEvent.content as Record<string, unknown>) || {};

    const fromHeader = Array.isArray(commonHeaders.from) ? (commonHeaders.from[0] as string) : "";
    const emailMatch = fromHeader.match(/<([^>]+)>/);
    const email = emailMatch ? emailMatch[1] : (mail.source as string) || "customer@example.com";
    const name = fromHeader.split("<")[0].trim() || "Email Sender";

    return {
      externalEventId: (rawEvent.event_id as string) || `em_evt_${Date.now()}`,
      externalMessageId: (mail.messageId as string) || undefined,
      externalSenderId: email,
      senderName: name,
      senderContact: {
        email,
      },
      channelType: "email",
      text: (content.textBody as string) || "",
      timestamp: (commonHeaders.date as string) || new Date().toISOString(),
      rawSource: "Inbound Email SMTP Relay (Simulated)",
    };
  }
}
