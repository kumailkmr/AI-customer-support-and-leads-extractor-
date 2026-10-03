# NEXUS AI — Omnichannel Communication Architecture

## 1. Architectural Overview

NEXUS AI's Omnichannel Engine unifies disparate communication sources (Website Live Chat, Instagram Direct Messages, Facebook Messenger, WhatsApp Cloud API, and Email) into a single deterministic pipeline:

```text
External Inbound Webhook / Visitor Action
                  │
                  ▼
         [Channel Provider Adapter]
       (MockWebsite / MockInstagram / ...)
                  │
                  ▼
         [Raw Channel Inbound Event]
                  │
                  ▼
         [Idempotency & Duplicate Check]
    Key: clientId + channelType + externalEventId
                  │
                  ▼
       [Event Normalization Pipeline]
                  │
                  ▼
         [Resolver Pipeline]
     ├── Client Resolver
     ├── Lead Resolver (Email / Phone / Channel Identity)
     └── Conversation Resolver (Unified Thread)
                  │
                  ▼
         [Message & Intent Ingestion]
     ├── ChatMessage Appended
     ├── Intent Classification & Info Extraction
     └── Qualification Engine Evaluation
                  │
                  ▼
         [AI Support Assistant / Human Specialist]
                  │
                  ▼
        [Outbound Message Lifecycle]
      QUEUED ──► SENDING ──► SENT ──► DELIVERED
                  │
                  ▼
         [Channel Provider Adapter]
```

---

## 2. Channel Provider Abstraction

Every communication platform implements the central [`ChannelProvider`](../lib/channels/types.ts) interface:

```typescript
export interface ChannelProvider {
  type: ChannelType;
  getChannelInfo(clientId: string): Promise<ChannelInfo>;
  connect(clientId: string, accountIdentifier: string): Promise<ConnectionResult>;
  disconnect(clientId: string): Promise<void>;
  sendMessage(input: SendMessageInput): Promise<SendMessageResult>;
  simulateInboundEvent(input: SimulateInboundEventInput): Promise<ChannelEvent>;
  normalizeEvent(rawEvent: Record<string, unknown>): NormalizedChannelPayload;
}
```

### Provider Implementations (`lib/channels/mock/`):
* `MockWebsiteProvider`: Simulates embedded landing page chat widgets, visitor sessions, and browser payloads.
* `MockInstagramProvider`: Simulates Meta Instagram Graph API webhooks with Instagram user handles and story mentions.
* `MockFacebookProvider`: Simulates Meta Messenger Platform page webhooks.
* `MockWhatsAppProvider`: Simulates Meta WhatsApp Cloud API payloads, message statuses, and phone number verification.
* `MockEmailProvider`: Simulates AWS SES / SMTP relays with MIME headers (From, To, Subject).

All providers are centrally registered in [`ChannelRegistry`](../lib/channels/channel-registry.ts) and can be swapped for official SDKs in future phases without altering CRM, inbox, or lead components.

---

## 3. Idempotency & Duplicate Protection

Real webhooks (Meta Graph, WhatsApp, AWS SES) frequently retry deliveries upon brief network latency, resulting in duplicate database insertions. NEXUS solves this with composite idempotency keys:

$$\text{IdempotencyKey} = \text{clientId} + \text{channelType} + \text{externalEventId}$$

When an incoming event matches an existing key:
1. Processing is halted before message creation or lead modification.
2. The event is preserved in the audit log with status `DUPLICATE`.
3. The UI indicates: `"Duplicate event ignored: Event with matching idempotency key already processed."`

---

## 4. Multi-Channel Identity Mapping

A customer might first inquire on Instagram (`@ayaan_demo`), then follow up via WhatsApp (`+91 98765 43210`), and subsequently visit the website.

NEXUS models external personas using [`ChannelIdentity`](../lib/channels/types.ts):
* `externalUserId`: Native platform identifier (Meta PSID, WhatsApp phone number, browser session token).
* `identifier`: Human-readable identifier (`@ayaan_demo`, phone number, email).
* `leadId`: Relational link to the central `ClientLead` record.

### Identity Resolution Flow:
1. Lookup existing `ChannelIdentity` by `(clientId, channelType, externalSenderId)`.
2. If found, link incoming message to the parent `leadId`.
3. If not found, search by secondary phone/email match.
4. If matched, register a new `ChannelIdentity` under that existing lead.
5. If no match is found, initialize a new lead and associate the first channel identity.

This enables a unified dossier displaying conversation threads across channels on `/leads/[id]`.

---

## 5. Event Pipeline Audit Trail & Retry Mechanism

All events pass through [`event-processor.ts`](../lib/channels/event-processor.ts) and are recorded with:
* Raw simulated JSON payload.
* Standardized `NormalizedChannelPayload`.
* Processing status: `PROCESSED`, `DUPLICATE`, `FAILED`, `RETRYING`.
* Error details and `retryCount`.

When an adapter fails (e.g., token expiration or rate limits), administrators can inspect the event trace at `/settings/channels/events` and trigger **Retry Event**, which re-runs the resolution pipeline and updates the conversation state.

---

## 6. Future Official API Integration Strategy

When transitioning from Simulation Mode to live production APIs:
1. **Meta Graph Webhook Gateway**:
   - Replace `MockInstagramProvider` and `MockFacebookProvider` with an edge webhook handler verifying Meta's `X-Hub-Signature-256`.
2. **WhatsApp Cloud API Platform**:
   - Swap `MockWhatsAppProvider` with an endpoint verifying `hub.verify_token` and sending outbound messages via the Graph API endpoint `/{phone-number-id}/messages`.
3. **Inbound Email Relay**:
   - Hook AWS SES Inbound SNS notifications or Postmark Inbound Webhooks directly into `normalizeRawEvent("email", body)`.
4. **Website Chat Client SDK**:
   - Provide a lightweight `<script>` tag connecting to a real-time WebSocket channel that streams normalized payloads.
