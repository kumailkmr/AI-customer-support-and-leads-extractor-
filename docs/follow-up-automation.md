# NEXUS AI — Follow-Up & Automation Engine Architecture (Phase 9)

## 1. System Overview

The **NEXUS AI Follow-Up & Automation Engine** delivers automated lifecycle re-engagement and outreach scheduling across the dual spectrum of NEXUS AI:

```
[Inbound Event / Time Trigger]
          │
          ▼
 [Automation Engine] ────► [Safety Guards: Human Handoff Check]
          │                [Idempotency Guard: Anti-Spam Check]
          ▼
[Rule Condition Evaluator]
          │
          ▼
[Variable Substitution Engine] ({{lead.name}}, {{client.name}}, etc.)
          │
          ▼
  [Follow-Up Queue]
   (DUE / SCHEDULED)
          │
          ▼
[Channel Simulation Dispatcher]
(WhatsApp / Instagram / Facebook / Email / Website)
          │
          ▼
   [Audit Run Log]
```

---

## 2. Strict Entity Boundaries

A primary requirement of the NEXUS AI Client Acquisition OS is maintaining clear architectural boundaries between:

1. **Client Lead (`targetType: "LEAD"`)**:
   - The prospective consumer or end-customer inquiring about a client's services (e.g., Sarah Johnson booking a suite at Alpine Grand Hotel).
   - Follow-ups speak on behalf of the client company (`{{client.name}}`).
   - Channels: WhatsApp, Instagram DM, Facebook Messenger, Website Concierge.

2. **Nexus Prospect (`targetType: "PROSPECT"`)**:
   - The commercial business NEXUS AI is seeking to onboard as an agency client (e.g., Srinagar Heritage Crafts).
   - Follow-ups represent NEXUS AI (`{{agent.name}}`, NEXUS prototype demo links `{{demo.link}}`).
   - Channels: Executive Email, Direct WhatsApp, Business Instagram.

---

## 3. Automation Engine & Evaluation Workflow

The engine evaluates rules in deterministic sequence:

1. **Scope Check**: Asserts that `rule.targetType === target.targetType`.
2. **Idempotency Guard**: Compares against `AutomationRun` logs. If a run with identical `ruleId + targetId + triggerEvent` has succeeded within the active cooldown period, the evaluation aborts with status `DUPLICATE` to prevent spamming customers.
3. **Safety Guard (Human Takeover)**:
   - If `has_human_takeover === true` (agent took over the chat in `/inbox`), all autonomous follow-up dispatches for that lead are skipped or suspended (`status = "PAUSED"`).
   - Rules with action `PAUSE_EXISTING_FOLLOW_UPS` safely freeze pending dispatches.
4. **Condition Evaluator**:
   - Evaluates criteria using operators `equals`, `not_equals`, `greater_than`, `less_than`, `contains`, and `in`.
   - Criteria fields include `channel`, `qualification_score`, `has_human_takeover`, `status`, `estimated_deal_value`, etc.
5. **Action Generation**:
   - If conditions pass, the engine constructs a structured `FollowUp` task with status `SCHEDULED` or `DUE`.
   - Creates an immutable `AutomationRun` audit record (`SUCCESS`, `SKIPPED`, `DUPLICATE`, or `FAILED`).

---

## 4. Variable Substitution Engine

The template resolver interpolates variables dynamically:
- `{{lead.name}}`, `{{lead.first_name}}`
- `{{client.name}}`
- `{{lead.channel}}`
- `{{prospect.name}}`, `{{prospect.contact}}`, `{{prospect.industry}}`
- `{{agent.name}}`
- `{{appointment.date}}`, `{{appointment.time}}`
- `{{demo.link}}`
- `{{offer.expiration_date}}`

### Fallback Guarantee
If an interpolated variable is undefined or null, safe fallbacks are applied (e.g. `lead.first_name` falls back to the first token of the full name, or `"there"`), ensuring customer communications never display broken code syntax.

---

## 5. Channel Simulation & Delivery Lifecycle

Follow-ups transition through the following states:

- `SCHEDULED`: Queued for a future timestamp.
- `DUE`: Reached scheduled time; ready for dispatch.
- `PROCESSING`: Currently running simulated transmission.
- `SENT`: Mock adapter confirmed simulated delivery (HTTP 200).
- `PAUSED`: Halted by human takeover safety guard or manual agent intervention.
- `CANCELLED`: Target converted or reservation booked before follow-up was needed.
- `FAILED`: Simulated gateway timeout; retry queued (max 3 retries).
- `COMPLETED`: Lifecycle closed.

---

## 6. Local Storage Persistence & Reactive Store

- Key: `nexus_follow_up_os_v1` in browser `localStorage`.
- Architecture: `useSyncExternalStore` in `lib/store/follow-up-store.tsx` provides multi-tab synchronization and prevents hydration mismatches.
- Exposed via `<FollowUpProvider>` in `app/layout.tsx`.
