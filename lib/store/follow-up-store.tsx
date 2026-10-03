"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import {
  FollowUp,
  AutomationRule,
  MessageTemplate,
  AutomationRun,
  FollowUpSuggestion,
  FollowUpStatus,
  FollowUpTargetType,
  FollowUpChannel,
} from "../follow-ups/types";
import {
  initialMockFollowUps,
  initialMockAutomationRules,
  initialMockMessageTemplates,
  initialMockAutomationRuns,
  initialMockSuggestions,
} from "../follow-ups/mock-data";
import { simulateExecuteFollowUp, simulateProcessBatchQueue } from "../follow-ups/follow-up-executor";
import { evaluateRuleOnTarget } from "../follow-ups/automation-engine";

interface FollowUpStoreState {
  followUps: FollowUp[];
  rules: AutomationRule[];
  templates: MessageTemplate[];
  runs: AutomationRun[];
  suggestions: FollowUpSuggestion[];
}

const STORAGE_KEY = "nexus_follow_up_os_v1";

const initialStoreState: FollowUpStoreState = {
  followUps: initialMockFollowUps,
  rules: initialMockAutomationRules,
  templates: initialMockMessageTemplates,
  runs: initialMockAutomationRuns,
  suggestions: initialMockSuggestions,
};

let memoryState: FollowUpStoreState = initialStoreState;
const listeners = new Set<() => void>();

function getStoredState(): FollowUpStoreState {
  if (typeof window === "undefined") return initialStoreState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStoreState));
      return initialStoreState;
    }
    const parsed = JSON.parse(raw);
    return {
      followUps: parsed.followUps || initialMockFollowUps,
      rules: parsed.rules || initialMockAutomationRules,
      templates: parsed.templates || initialMockMessageTemplates,
      runs: parsed.runs || initialMockAutomationRuns,
      suggestions: parsed.suggestions || initialMockSuggestions,
    };
  } catch (err) {
    console.error("Failed to parse follow-ups store state from localStorage:", err);
    return initialStoreState;
  }
}

if (typeof window !== "undefined") {
  memoryState = getStoredState();
}

function emitChange() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    } catch (e) {
      console.error("Failed saving to localStorage", e);
    }
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): FollowUpStoreState {
  return memoryState;
}

function getServerSnapshot(): FollowUpStoreState {
  return initialStoreState;
}

interface FollowUpMetrics {
  total: number;
  dueToday: number;
  scheduled: number;
  sent: number;
  paused: number;
  failed: number;
  byTargetType: {
    leads: number;
    prospects: number;
  };
  byChannel: Record<FollowUpChannel, number>;
}

interface FollowUpContextType {
  followUps: FollowUp[];
  rules: AutomationRule[];
  templates: MessageTemplate[];
  runs: AutomationRun[];
  suggestions: FollowUpSuggestion[];
  metrics: FollowUpMetrics;

  getFollowUp: (id: string) => FollowUp | undefined;
  createFollowUp: (data: Partial<FollowUp>) => FollowUp;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  updateFollowUpStatus: (id: string, status: FollowUpStatus) => void;
  sendFollowUpNow: (id: string) => void;
  pauseFollowUp: (id: string) => void;
  resumeFollowUp: (id: string) => void;
  cancelFollowUp: (id: string) => void;
  retryFollowUp: (id: string) => void;
  deleteFollowUp: (id: string) => void;
  processQueue: () => { processedCount: number };

  // Automation Rules
  getRule: (id: string) => AutomationRule | undefined;
  createRule: (rule: Partial<AutomationRule>) => AutomationRule;
  updateRule: (id: string, updates: Partial<AutomationRule>) => void;
  toggleRule: (id: string, enabled?: boolean) => void;
  deleteRule: (id: string) => void;
  triggerRuleSimulation: (
    ruleId: string,
    target: { id: string; name: string; targetType: FollowUpTargetType; [k: string]: any }
  ) => void;

  // Templates
  getTemplate: (id: string) => MessageTemplate | undefined;
  createTemplate: (template: Partial<MessageTemplate>) => MessageTemplate;
  updateTemplate: (id: string, updates: Partial<MessageTemplate>) => void;
  deleteTemplate: (id: string) => void;

  // Suggestions
  dismissSuggestion: (id: string) => void;
  acceptSuggestion: (id: string) => FollowUp | null;

  // Utilities
  resetToMockData: () => void;
}

const FollowUpContext = createContext<FollowUpContextType | null>(null);

export function FollowUpProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Computed metrics
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000;

  const metrics: FollowUpMetrics = {
    total: state.followUps.length,
    dueToday: state.followUps.filter((f) => {
      const due = new Date(f.dueAt).getTime();
      return f.status === "DUE" || (due >= startOfDay && due <= endOfDay && f.status === "SCHEDULED");
    }).length,
    scheduled: state.followUps.filter((f) => f.status === "SCHEDULED").length,
    sent: state.followUps.filter((f) => f.status === "SENT" || f.status === "COMPLETED").length,
    paused: state.followUps.filter((f) => f.status === "PAUSED").length,
    failed: state.followUps.filter((f) => f.status === "FAILED").length,
    byTargetType: {
      leads: state.followUps.filter((f) => f.targetType === "LEAD").length,
      prospects: state.followUps.filter((f) => f.targetType === "PROSPECT").length,
    },
    byChannel: {
      whatsapp: state.followUps.filter((f) => f.channel === "whatsapp").length,
      instagram: state.followUps.filter((f) => f.channel === "instagram").length,
      facebook: state.followUps.filter((f) => f.channel === "facebook").length,
      email: state.followUps.filter((f) => f.channel === "email").length,
      website: state.followUps.filter((f) => f.channel === "website").length,
    },
  };

  const getFollowUp = useCallback(
    (id: string) => state.followUps.find((f) => f.id === id),
    [state.followUps]
  );

  const createFollowUp = useCallback(
    (data: Partial<FollowUp>): FollowUp => {
      const nowIso = new Date().toISOString();
      const newId = data.id || `fu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const item: FollowUp = {
        id: newId,
        targetType: data.targetType || "LEAD",
        targetId: data.targetId || "target_default",
        targetName: data.targetName || "Target Contact",
        targetSubtext: data.targetSubtext,
        clientId: data.clientId,
        clientName: data.clientName,
        type: data.type || "NO_REPLY_NUDGE",
        priority: data.priority || "MEDIUM",
        channel: data.channel || "whatsapp",
        status: data.status || "SCHEDULED",
        automationMode: data.automationMode || "MANUAL_APPROVAL",
        scheduledAt: data.scheduledAt || nowIso,
        dueAt: data.dueAt || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        triggerReason: data.triggerReason || "Manual follow-up creation",
        templateId: data.templateId,
        message: data.message || "Hi, following up on our recent chat.",
        subject: data.subject,
        retryCount: 0,
        maxRetries: 3,
        history: [
          {
            id: `h_${Date.now()}`,
            timestamp: nowIso,
            action: "Follow-up Created",
            performedBy: "Agent",
          },
        ],
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      memoryState = {
        ...memoryState,
        followUps: [item, ...memoryState.followUps],
      };
      emitChange();
      return item;
    },
    []
  );

  const updateFollowUp = useCallback((id: string, updates: Partial<FollowUp>) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.map((f) =>
        f.id === id ? { ...f, ...updates, updatedAt: nowIso } : f
      ),
    };
    emitChange();
  }, []);

  const updateFollowUpStatus = useCallback((id: string, status: FollowUpStatus) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          status,
          updatedAt: nowIso,
          history: [
            ...f.history,
            {
              id: `h_${Date.now()}`,
              timestamp: nowIso,
              action: `Status changed to ${status}`,
              performedBy: "User Action",
            },
          ],
        };
      }),
    };
    emitChange();
  }, []);

  const sendFollowUpNow = useCallback((id: string) => {
    const target = memoryState.followUps.find((f) => f.id === id);
    if (!target) return;
    const { updatedFollowUp } = simulateExecuteFollowUp(target, false);
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.map((f) => (f.id === id ? updatedFollowUp : f)),
    };
    emitChange();
  }, []);

  const pauseFollowUp = useCallback((id: string) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          status: "PAUSED",
          updatedAt: nowIso,
          history: [
            ...f.history,
            {
              id: `h_${Date.now()}`,
              timestamp: nowIso,
              action: "Paused",
              performedBy: "Agent",
            },
          ],
        };
      }),
    };
    emitChange();
  }, []);

  const resumeFollowUp = useCallback((id: string) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          status: "SCHEDULED",
          updatedAt: nowIso,
          history: [
            ...f.history,
            {
              id: `h_${Date.now()}`,
              timestamp: nowIso,
              action: "Resumed",
              performedBy: "Agent",
            },
          ],
        };
      }),
    };
    emitChange();
  }, []);

  const cancelFollowUp = useCallback((id: string) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          status: "CANCELLED",
          updatedAt: nowIso,
          history: [
            ...f.history,
            {
              id: `h_${Date.now()}`,
              timestamp: nowIso,
              action: "Cancelled",
              performedBy: "Agent",
            },
          ],
        };
      }),
    };
    emitChange();
  }, []);

  const retryFollowUp = useCallback((id: string) => {
    const target = memoryState.followUps.find((f) => f.id === id);
    if (!target) return;
    const { updatedFollowUp } = simulateExecuteFollowUp(target, false);
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.map((f) => (f.id === id ? updatedFollowUp : f)),
    };
    emitChange();
  }, []);

  const deleteFollowUp = useCallback((id: string) => {
    memoryState = {
      ...memoryState,
      followUps: memoryState.followUps.filter((f) => f.id !== id),
    };
    emitChange();
  }, []);

  const processQueue = useCallback(() => {
    const { updatedQueue, results } = simulateProcessBatchQueue(memoryState.followUps);
    memoryState = {
      ...memoryState,
      followUps: updatedQueue,
    };
    emitChange();
    return { processedCount: results.length };
  }, []);

  // Automation Rules
  const getRule = useCallback(
    (id: string) => state.rules.find((r) => r.id === id),
    [state.rules]
  );

  const createRule = useCallback((ruleData: Partial<AutomationRule>): AutomationRule => {
    const nowIso = new Date().toISOString();
    const newId = ruleData.id || `rule_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const rule: AutomationRule = {
      id: newId,
      name: ruleData.name || "Untitled Automation Rule",
      description: ruleData.description || "Automated trigger action",
      targetType: ruleData.targetType || "LEAD",
      category: ruleData.category || "Client Lead Capture",
      enabled: ruleData.enabled ?? true,
      trigger: ruleData.trigger || { type: "NO_REPLY_HOURS", delayMinutes: 60 },
      conditions: ruleData.conditions || [],
      action: ruleData.action || {
        type: "SCHEDULE_FOLLOW_UP",
        automationMode: "AUTONOMOUS",
        priority: "MEDIUM",
        channel: "whatsapp",
      },
      createdAt: nowIso,
      updatedAt: nowIso,
      runsCount: 0,
      successCount: 0,
    };

    memoryState = {
      ...memoryState,
      rules: [rule, ...memoryState.rules],
    };
    emitChange();
    return rule;
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<AutomationRule>) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      rules: memoryState.rules.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: nowIso } : r
      ),
    };
    emitChange();
  }, []);

  const toggleRule = useCallback((id: string, enabled?: boolean) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      rules: memoryState.rules.map((r) =>
        r.id === id
          ? { ...r, enabled: enabled !== undefined ? enabled : !r.enabled, updatedAt: nowIso }
          : r
      ),
    };
    emitChange();
  }, []);

  const deleteRule = useCallback((id: string) => {
    memoryState = {
      ...memoryState,
      rules: memoryState.rules.filter((r) => r.id !== id),
    };
    emitChange();
  }, []);

  const triggerRuleSimulation = useCallback(
    (
      ruleId: string,
      target: { id: string; name: string; targetType: FollowUpTargetType; [k: string]: any }
    ) => {
      const rule = memoryState.rules.find((r) => r.id === ruleId);
      if (!rule) return;

      const template = rule.action.templateId
        ? memoryState.templates.find((t) => t.id === rule.action.templateId)
        : undefined;

      const result = evaluateRuleOnTarget(
        rule,
        target,
        "MANUAL_TEST_RUN",
        memoryState.runs,
        memoryState.followUps,
        template?.body,
        template?.subject
      );

      const updatedRuns = [result.run, ...memoryState.runs];
      let updatedFollowUps = memoryState.followUps;

      if (result.createdFollowUp) {
        updatedFollowUps = [result.createdFollowUp, ...updatedFollowUps];
      }

      if (result.shouldPauseExisting) {
        updatedFollowUps = updatedFollowUps.map((f) =>
          f.targetId === target.id && (f.status === "SCHEDULED" || f.status === "DUE")
            ? { ...f, status: "PAUSED" as FollowUpStatus }
            : f
        );
      }

      const updatedRules = memoryState.rules.map((r) => {
        if (r.id !== ruleId) return r;
        return {
          ...r,
          runsCount: r.runsCount + 1,
          successCount: result.run.status === "SUCCESS" ? r.successCount + 1 : r.successCount,
        };
      });

      memoryState = {
        ...memoryState,
        runs: updatedRuns,
        followUps: updatedFollowUps,
        rules: updatedRules,
      };
      emitChange();
    },
    []
  );

  // Templates
  const getTemplate = useCallback(
    (id: string) => state.templates.find((t) => t.id === id),
    [state.templates]
  );

  const createTemplate = useCallback(
    (tmpl: Partial<MessageTemplate>): MessageTemplate => {
      const nowIso = new Date().toISOString();
      const newId = tmpl.id || `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const template: MessageTemplate = {
        id: newId,
        name: tmpl.name || "Untitled Template",
        targetType: tmpl.targetType || "LEAD",
        category: tmpl.category || "No-Reply Nudge",
        channel: tmpl.channel || "whatsapp",
        subject: tmpl.subject,
        body: tmpl.body || "Hello {{lead.name}}",
        variables: tmpl.variables || ["lead.name"],
        isSystemDefault: false,
        updatedAt: nowIso,
      };

      memoryState = {
        ...memoryState,
        templates: [template, ...memoryState.templates],
      };
      emitChange();
      return template;
    },
    []
  );

  const updateTemplate = useCallback((id: string, updates: Partial<MessageTemplate>) => {
    const nowIso = new Date().toISOString();
    memoryState = {
      ...memoryState,
      templates: memoryState.templates.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: nowIso } : t
      ),
    };
    emitChange();
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    memoryState = {
      ...memoryState,
      templates: memoryState.templates.filter((t) => t.id !== id),
    };
    emitChange();
  }, []);

  // Suggestions
  const dismissSuggestion = useCallback((id: string) => {
    memoryState = {
      ...memoryState,
      suggestions: memoryState.suggestions.filter((s) => s.id !== id),
    };
    emitChange();
  }, []);

  const acceptSuggestion = useCallback(
    (id: string): FollowUp | null => {
      const sug = memoryState.suggestions.find((s) => s.id === id);
      if (!sug) return null;

      const created = createFollowUp({
        targetType: sug.targetType,
        targetId: sug.targetId,
        targetName: sug.targetName,
        targetSubtext: sug.targetSubtext,
        clientId: sug.clientId,
        clientName: sug.clientName,
        type: sug.recommendedType,
        channel: sug.recommendedChannel,
        priority: sug.urgency,
        status: "DUE",
        automationMode: "MANUAL_APPROVAL",
        triggerReason: sug.rationale,
        message: sug.draftMessage,
      });

      memoryState = {
        ...memoryState,
        suggestions: memoryState.suggestions.filter((s) => s.id !== id),
      };
      emitChange();
      return created;
    },
    [createFollowUp]
  );

  const resetToMockData = useCallback(() => {
    memoryState = initialStoreState;
    emitChange();
  }, []);

  return (
    <FollowUpContext.Provider
      value={{
        followUps: state.followUps,
        rules: state.rules,
        templates: state.templates,
        runs: state.runs,
        suggestions: state.suggestions,
        metrics,
        getFollowUp,
        createFollowUp,
        updateFollowUp,
        updateFollowUpStatus,
        sendFollowUpNow,
        pauseFollowUp,
        resumeFollowUp,
        cancelFollowUp,
        retryFollowUp,
        deleteFollowUp,
        processQueue,
        getRule,
        createRule,
        updateRule,
        toggleRule,
        deleteRule,
        triggerRuleSimulation,
        getTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        dismissSuggestion,
        acceptSuggestion,
        resetToMockData,
      }}
    >
      {children}
    </FollowUpContext.Provider>
  );
}

export function useFollowUps() {
  const context = useContext(FollowUpContext);
  if (!context) {
    throw new Error("useFollowUps must be used within a FollowUpProvider");
  }
  return context;
}
