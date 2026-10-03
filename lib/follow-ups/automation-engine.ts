import {
  AutomationRule,
  AutomationCondition,
  AutomationRun,
  FollowUp,
  FollowUpTargetType,
  FollowUpStatus,
} from "./types";
import { resolveTemplateVariables, VariableContext } from "./variable-resolver";

export interface EvaluationTarget {
  id: string;
  name: string;
  targetType: FollowUpTargetType;
  subtext?: string;
  clientId?: string;
  clientName?: string;
  channel?: string;
  status?: string;
  qualification_score?: number;
  has_human_takeover?: boolean;
  has_appointment?: boolean;
  has_email?: boolean;
  has_phone?: boolean;
  estimated_deal_value?: number;
  [key: string]: any;
}

export interface EngineEvaluationResult {
  run: AutomationRun;
  createdFollowUp?: FollowUp;
  shouldPauseExisting?: boolean;
}

export function matchCondition(target: EvaluationTarget, condition: AutomationCondition): boolean {
  const actualVal = target[condition.field];
  const expectedVal = condition.value;

  switch (condition.operator) {
    case "equals":
      return String(actualVal).toLowerCase() === String(expectedVal).toLowerCase();
    case "not_equals":
      return String(actualVal).toLowerCase() !== String(expectedVal).toLowerCase();
    case "greater_than":
      return Number(actualVal || 0) > Number(expectedVal || 0);
    case "less_than":
      return Number(actualVal || 0) < Number(expectedVal || 0);
    case "contains":
      return String(actualVal || "").toLowerCase().includes(String(expectedVal || "").toLowerCase());
    case "in":
      if (Array.isArray(expectedVal)) {
        return expectedVal.map((v) => String(v).toLowerCase()).includes(String(actualVal).toLowerCase());
      }
      return false;
    default:
      return false;
  }
}

export function evaluateRuleOnTarget(
  rule: AutomationRule,
  target: EvaluationTarget,
  triggerEvent: string,
  existingRuns: AutomationRun[],
  existingFollowUps: FollowUp[],
  templateBody?: string,
  templateSubject?: string
): EngineEvaluationResult {
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  // 1. Check Target Type match
  if (rule.targetType !== target.targetType) {
    return {
      run: {
        id: runId,
        ruleId: rule.id,
        ruleName: rule.name,
        targetType: target.targetType,
        targetId: target.id,
        targetName: target.name,
        triggerEvent,
        status: "SKIPPED",
        reason: `Rule targetType (${rule.targetType}) does not match target (${target.targetType})`,
        timestamp: nowIso,
      },
    };
  }

  // 2. Check Idempotency Guard (Prevent Duplicate spam)
  const isDuplicate = existingRuns.some(
    (r) =>
      r.ruleId === rule.id &&
      r.targetId === target.id &&
      r.triggerEvent === triggerEvent &&
      r.status === "SUCCESS"
  );

  if (isDuplicate) {
    return {
      run: {
        id: runId,
        ruleId: rule.id,
        ruleName: rule.name,
        targetType: target.targetType,
        targetId: target.id,
        targetName: target.name,
        triggerEvent,
        status: "DUPLICATE",
        reason: `Idempotency guard active: rule already executed for trigger event ${triggerEvent}`,
        timestamp: nowIso,
      },
    };
  }

  // 3. Human Handoff Guard for Client Leads
  if (target.targetType === "LEAD" && target.has_human_takeover) {
    if (rule.action.type === "PAUSE_EXISTING_FOLLOW_UPS") {
      return {
        run: {
          id: runId,
          ruleId: rule.id,
          ruleName: rule.name,
          targetType: target.targetType,
          targetId: target.id,
          targetName: target.name,
          triggerEvent,
          status: "SUCCESS",
          reason: "Human takeover confirmed: active follow-ups paused for agent handoff",
          timestamp: nowIso,
        },
        shouldPauseExisting: true,
      };
    } else {
      return {
        run: {
          id: runId,
          ruleId: rule.id,
          ruleName: rule.name,
          targetType: target.targetType,
          targetId: target.id,
          targetName: target.name,
          triggerEvent,
          status: "SKIPPED",
          reason: "Skipped because human takeover is active on this lead",
          timestamp: nowIso,
        },
      };
    }
  }

  // 4. Evaluate Conditions
  for (const condition of rule.conditions) {
    if (!matchCondition(target, condition)) {
      return {
        run: {
          id: runId,
          ruleId: rule.id,
          ruleName: rule.name,
          targetType: target.targetType,
          targetId: target.id,
          targetName: target.name,
          triggerEvent,
          status: "SKIPPED",
          reason: `Condition '${condition.field} ${condition.operator} ${condition.value}' was not satisfied (actual: ${target[condition.field]})`,
          timestamp: nowIso,
        },
      };
    }
  }

  // 5. Rule Passed -> Execute Action
  if (rule.action.type === "PAUSE_EXISTING_FOLLOW_UPS") {
    return {
      run: {
        id: runId,
        ruleId: rule.id,
        ruleName: rule.name,
        targetType: target.targetType,
        targetId: target.id,
        targetName: target.name,
        triggerEvent,
        status: "SUCCESS",
        reason: "Executed pause action on existing target follow-ups",
        timestamp: nowIso,
      },
      shouldPauseExisting: true,
    };
  }

  // Prepare variable context
  const varContext: VariableContext = {
    lead: {
      name: target.name,
      first_name: target.name.split(" ")[0],
      channel: target.channel || "WhatsApp",
      qualification_score: target.qualification_score || 85,
    },
    client: {
      name: target.clientName || "Our Business",
    },
    prospect: {
      name: target.name,
      contact: target.contact || target.name,
      industry: target.industry || "General Industry",
    },
    agent: {
      name: "Kumail",
      email: "kumail@nexus-ai.local",
    },
    appointment: {
      date: target.appointmentDate || "Tomorrow",
      time: target.appointmentTime || "11:00 AM",
    },
    demo: {
      link: `https://nexus-ai.local/demo/${target.id}`,
    },
    offer: {
      expiration_date: "Today at 5:00 PM",
    },
  };

  const rawMessage = templateBody || rule.action.customMessageTemplate || "Hello {{lead.name}}, following up regarding our conversation.";
  const renderedMessage = resolveTemplateVariables(rawMessage, varContext, target.targetType);
  const renderedSubject = templateSubject ? resolveTemplateVariables(templateSubject, varContext, target.targetType) : undefined;

  const delayHours = rule.action.delayHours || 0;
  const scheduledTime = new Date(Date.now() + delayHours * 3600 * 1000).toISOString();
  const dueTime = new Date(Date.now() + (delayHours + 0.5) * 3600 * 1000).toISOString();

  const newFollowUpId = `fu_${target.id}_${Date.now().toString(36)}`;
  const initialStatus: FollowUpStatus = delayHours === 0 ? "DUE" : "SCHEDULED";

  const newFollowUp: FollowUp = {
    id: newFollowUpId,
    targetType: target.targetType,
    targetId: target.id,
    targetName: target.name,
    targetSubtext: target.subtext || (target.targetType === "LEAD" ? target.clientName : target.industry),
    clientId: target.clientId,
    clientName: target.clientName,
    type: rule.action.followUpType || "NO_REPLY_NUDGE",
    priority: rule.action.priority || "MEDIUM",
    channel: rule.action.channel || "whatsapp",
    status: initialStatus,
    automationMode: rule.action.automationMode || "AUTONOMOUS",
    scheduledAt: scheduledTime,
    dueAt: dueTime,
    triggerReason: `Triggered by Rule: ${rule.name} (${triggerEvent})`,
    templateId: rule.action.templateId,
    message: renderedMessage,
    subject: renderedSubject,
    ruleId: rule.id,
    retryCount: 0,
    maxRetries: 3,
    history: [
      {
        id: `h_${Date.now()}`,
        timestamp: nowIso,
        action: `Generated via Automation Engine (${rule.name})`,
        note: `Mode: ${rule.action.automationMode}, Channel: ${rule.action.channel}`,
        performedBy: "NEXUS Automation Engine",
      },
    ],
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  return {
    run: {
      id: runId,
      ruleId: rule.id,
      ruleName: rule.name,
      targetType: target.targetType,
      targetId: target.id,
      targetName: target.name,
      triggerEvent,
      status: "SUCCESS",
      reason: `Successfully scheduled follow-up ${newFollowUpId} (${newFollowUp.type})`,
      followUpId: newFollowUpId,
      timestamp: nowIso,
      details: {
        channel: newFollowUp.channel,
        mode: newFollowUp.automationMode,
        scheduledAt: newFollowUp.scheduledAt,
      },
    },
    createdFollowUp: newFollowUp,
  };
}
