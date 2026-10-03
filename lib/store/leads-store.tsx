"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import {
  ClientBusiness,
  ClientLead,
  ClientConversation,
  ClientLeadStatus,
  ClientLeadMetrics,
  ClientConversationMetrics,
  ConversationStatus,
  QualificationValue,
  AiConversationMode,
  ExtractedLeadInfo,
  ChatMessage,
  ClientLeadChannel,
} from "@/types/leads";
import {
  initialMockClients,
  initialMockLeads,
  initialMockConversations,
} from "@/lib/mock-data/client-leads-initial";
import { evaluateQualification } from "@/lib/ai-support/qualification-engine";
import { defaultSupportAgentProvider } from "@/lib/ai-support/provider";
import { detectObjection } from "@/lib/ai-support/objection-engine";

interface LeadsStoreState {
  clients: ClientBusiness[];
  leads: ClientLead[];
  conversations: ClientConversation[];
}

interface LeadsContextType {
  clients: ClientBusiness[];
  leads: ClientLead[];
  conversations: ClientConversation[];
  leadMetrics: ClientLeadMetrics;
  conversationMetrics: ClientConversationMetrics;

  // Lead CRUD & Workflow
  getLead: (id: string) => ClientLead | undefined;
  getClient: (id: string) => ClientBusiness | undefined;
  getConversation: (id: string) => ClientConversation | undefined;
  addLead: (lead: Partial<ClientLead>) => ClientLead;
  updateLead: (leadId: string, updates: Partial<ClientLead>) => void;
  updateLeadStatus: (leadId: string, status: ClientLeadStatus) => void;
  updateQualificationCriterion: (
    leadId: string,
    criterionId: string,
    value: QualificationValue,
    notes?: string
  ) => void;
  addLeadNote: (leadId: string, content: string, author?: string) => void;
  scheduleLeadFollowUp: (leadId: string, nextFollowUpAt: string, note?: string) => void;
  deleteLead: (leadId: string) => void;
  createLeadFromConversation: (
    conversationId: string,
    overrides?: Partial<ClientLead>
  ) => ClientLead;

  // Omnichannel Conversation Actions
  sendSimulatedCustomerMessage: (conversationId: string, text: string) => Promise<void>;
  triggerAiResponse: (conversationId: string) => Promise<void>;
  sendHumanReply: (conversationId: string, text: string) => void;
  toggleAiMode: (conversationId: string, mode: AiConversationMode) => void;
  reviewExtractedInfo: (
    conversationId: string,
    action: "accept" | "edit" | "ignore",
    editedData?: Partial<ExtractedLeadInfo>
  ) => void;
  triggerHumanHandoff: (conversationId: string, reason?: string) => void;
  acceptHumanHandoff: (conversationId: string) => void;
  toggleAutoCapture: (conversationId: string) => void;
  closeConversation: (conversationId: string) => void;
}

const STORAGE_KEY = "nexus_client_leads_os_v1";

function calculateLeadMetrics(leads: ClientLead[]): ClientLeadMetrics {
  let newLeads = 0;
  let qualifying = 0;
  let qualified = 0;
  let followUp = 0;
  let humanHandoff = 0;
  let converted = 0;
  let pipelineValue = 0;

  leads.forEach((l) => {
    pipelineValue += l.estimatedValue || 0;
    if (l.status === "NEW") newLeads++;
    else if (l.status === "QUALIFYING") qualifying++;
    else if (l.status === "QUALIFIED") qualified++;
    else if (l.status === "FOLLOW_UP") followUp++;
    else if (l.status === "HUMAN_HANDOFF") humanHandoff++;
    else if (l.status === "CONVERTED") converted++;
  });

  return {
    totalLeads: leads.length,
    newLeads,
    qualifying,
    qualified,
    followUp,
    humanHandoff,
    converted,
    pipelineValue,
  };
}

function calculateConversationMetrics(
  conversations: ClientConversation[]
): ClientConversationMetrics {
  let aiActive = 0;
  let humanActive = 0;
  let needsAttention = 0;
  let closed = 0;

  const channelBreakdown: Record<ClientLeadChannel, number> = {
    "Website Chat": 0,
    Instagram: 0,
    Facebook: 0,
    WhatsApp: 0,
    Email: 0,
    Phone: 0,
    Manual: 0,
  };

  conversations.forEach((c) => {
    if (channelBreakdown[c.channel] !== undefined) {
      channelBreakdown[c.channel]++;
    }
    if (c.status === "Closed") closed++;
    else if (c.status === "Needs Attention") needsAttention++;
    else if (c.aiMode === "human_takeover" || c.status === "Human Active") humanActive++;
    else aiActive++;
  });

  return {
    totalConversations: conversations.length,
    aiActive,
    humanActive,
    needsAttention,
    closed,
    channelBreakdown,
  };
}

let memoryState: LeadsStoreState = {
  clients: initialMockClients,
  leads: initialMockLeads,
  conversations: initialMockConversations,
};

let isStoreInitialized = false;
const storeListeners = new Set<() => void>();

function initLeadsStore() {
  if (isStoreInitialized) return;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.leads && parsed.conversations && parsed.clients) {
          memoryState = parsed;
          isStoreInitialized = true;
          return;
        }
      }
    } catch {
      // Fallback
    }
  }

  memoryState = {
    clients: initialMockClients,
    leads: initialMockLeads,
    conversations: initialMockConversations,
  };
  isStoreInitialized = true;
}

function emitLeadsChange() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
    } catch {
      // ignore
    }
  }
  for (const listener of storeListeners) {
    listener();
  }
}

function subscribeLeads(listener: () => void) {
  storeListeners.add(listener);
  return () => {
    storeListeners.delete(listener);
  };
}

function getLeadsSnapshot(): LeadsStoreState {
  initLeadsStore();
  return memoryState;
}

let serverSnapshotCache: LeadsStoreState | null = null;
function getServerLeadsSnapshot(): LeadsStoreState {
  if (!serverSnapshotCache) {
    serverSnapshotCache = {
      clients: initialMockClients,
      leads: initialMockLeads,
      conversations: initialMockConversations,
    };
  }
  return serverSnapshotCache;
}

// Module-level mutation functions (independent of React rendering)
function storeGetLead(id: string): ClientLead | undefined {
  return memoryState.leads.find((l) => l.id.toLowerCase() === id.toLowerCase());
}

function storeGetClient(id: string): ClientBusiness | undefined {
  return memoryState.clients.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

function storeGetConversation(id: string): ClientConversation | undefined {
  return memoryState.conversations.find((c) => c.id.toLowerCase() === id.toLowerCase());
}

function storeAddLead(partial: Partial<ClientLead>): ClientLead {
  const id = partial.id || `lead_${Date.now()}`;
  const client = memoryState.clients.find((c) => c.id === partial.clientId) || memoryState.clients[0];
  const criteria = partial.qualificationCriteria || [];
  const evalResult = evaluateQualification(criteria);

  const newLead: ClientLead = {
    id,
    clientId: client.id,
    clientName: client.businessName,
    name: partial.name || "Unnamed Customer",
    email: partial.email || "",
    phone: partial.phone || "",
    source: partial.source || "Website",
    channel: partial.channel || "Website Chat",
    intent: partial.intent || "General Inquiry",
    status: partial.status || "NEW",
    qualificationStatus: evalResult.status,
    qualificationCriteria: criteria,
    score: evalResult.score || 50,
    estimatedValue: partial.estimatedValue || 15000,
    tags: partial.tags || ["Customer Inbound"],
    conversationId: partial.conversationId,
    assignedTo: partial.assignedTo || client.assignedAgent,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActivityAt: "Just now",
    nextFollowUpAt: partial.nextFollowUpAt,
    notes: partial.notes || [],
    activities: [
      {
        id: `act_${Date.now()}`,
        title: "Lead Created",
        description: `Customer lead created in system for client ${client.businessName}.`,
        type: "lead_created",
        timestamp: "Just now",
        actor: "Team Member",
      },
      ...(partial.activities || []),
    ],
    aiSummary: partial.aiSummary || "Lead registered in CRM. (AI-generated summary — simulation)",
  };

  memoryState = {
    ...memoryState,
    leads: [newLead, ...memoryState.leads],
  };
  emitLeadsChange();
  return newLead;
}

function storeUpdateLead(leadId: string, updates: Partial<ClientLead>) {
  memoryState = {
    ...memoryState,
    leads: memoryState.leads.map((l) =>
      l.id.toLowerCase() === leadId.toLowerCase()
        ? { ...l, ...updates, updatedAt: new Date().toISOString() }
        : l
    ),
  };
  emitLeadsChange();
}

function storeUpdateLeadStatus(leadId: string, status: ClientLeadStatus) {
  const lead = storeGetLead(leadId);
  if (!lead) return;

  const activity = {
    id: `act_${Date.now()}`,
    title: "Status Changed",
    description: `Lead status updated from ${lead.status} to ${status}.`,
    type: "status_changed" as const,
    timestamp: "Just now",
    actor: "Team Member" as const,
  };

  storeUpdateLead(leadId, {
    status,
    lastActivityAt: "Just now",
    activities: [activity, ...lead.activities],
  });
}

function storeUpdateQualificationCriterion(
  leadId: string,
  criterionId: string,
  value: QualificationValue,
  notes?: string
) {
  const lead = storeGetLead(leadId);
  if (!lead) return;

  const updatedCriteria = lead.qualificationCriteria.map((c) =>
    c.id === criterionId ? { ...c, value, notes: notes ?? c.notes } : c
  );

  const evalResult = evaluateQualification(updatedCriteria);

  const activity = {
    id: `act_${Date.now()}`,
    title: "Qualification Criteria Updated",
    description: `Evaluated ${criterionId}: ${value}. Overall status: ${evalResult.status}.`,
    type: "qualification_updated" as const,
    timestamp: "Just now",
    actor: "Team Member" as const,
  };

  storeUpdateLead(leadId, {
    qualificationCriteria: updatedCriteria,
    qualificationStatus: evalResult.status,
    score: evalResult.score,
    lastActivityAt: "Just now",
    activities: [activity, ...lead.activities],
  });
}

function storeAddLeadNote(leadId: string, content: string, author = "Team Member") {
  const lead = storeGetLead(leadId);
  if (!lead) return;

  const newNote = {
    id: `note_${Date.now()}`,
    author,
    content,
    createdAt: new Date().toISOString(),
  };

  storeUpdateLead(leadId, {
    notes: [newNote, ...lead.notes],
    lastActivityAt: "Just now",
  });
}

function storeScheduleLeadFollowUp(
  leadId: string,
  nextFollowUpAt: string,
  note?: string
) {
  const lead = storeGetLead(leadId);
  if (!lead) return;

  const activity = {
    id: `act_${Date.now()}`,
    title: "Follow-Up Scheduled",
    description: `Scheduled check-in for ${nextFollowUpAt}${note ? `: "${note}"` : ""}.`,
    type: "follow_up_scheduled" as const,
    timestamp: "Just now",
    actor: "Team Member" as const,
  };

  storeUpdateLead(leadId, {
    nextFollowUpAt,
    status: "FOLLOW_UP",
    lastActivityAt: "Just now",
    activities: [activity, ...lead.activities],
  });
}

function storeDeleteLead(leadId: string) {
  memoryState = {
    ...memoryState,
    leads: memoryState.leads.filter((l) => l.id.toLowerCase() !== leadId.toLowerCase()),
  };
  emitLeadsChange();
}

function storeCreateLeadFromConversation(
  conversationId: string,
  overrides?: Partial<ClientLead>
): ClientLead {
  const conv = storeGetConversation(conversationId);
  const client = conv
    ? memoryState.clients.find((c) => c.id === conv.clientId) || memoryState.clients[0]
    : memoryState.clients[0];

  const extracted = conv?.extractedInfo;

  const leadName = overrides?.name || extracted?.name || conv?.leadName || "Inbound Visitor";
  const email = overrides?.email || extracted?.email || "";
  const phone = overrides?.phone || extracted?.phone || conv?.leadContact || "";
  const intent = overrides?.intent || extracted?.intent || conv?.intent || "General Inquiry";

  const created = storeAddLead({
    clientId: client.id,
    clientName: client.businessName,
    name: leadName,
    email,
    phone,
    source: conv?.channel === "Instagram" ? "Instagram" : conv?.channel === "WhatsApp" ? "WhatsApp" : "Website",
    channel: conv?.channel || "Website Chat",
    intent,
    status: "QUALIFYING",
    conversationId,
    estimatedValue: overrides?.estimatedValue || 25000,
    tags: ["From Conversation", conv?.channel || "Chat", "Simulation"],
    ...overrides,
  });

  if (conv) {
    memoryState = {
      ...memoryState,
      conversations: memoryState.conversations.map((c) =>
        c.id === conversationId ? { ...c, leadId: created.id, leadName: created.name } : c
      ),
    };
    emitLeadsChange();
  }

  return created;
}

async function storeSendSimulatedCustomerMessage(
  conversationId: string,
  text: string
) {
  const conv = storeGetConversation(conversationId);
  if (!conv) return;

  const newMsg: ChatMessage = {
    id: `m_${Date.now()}`,
    conversationId,
    sender: "lead",
    content: text,
    timestamp: "Just now",
    aiGenerated: false,
    messageType: "text",
  };

  const updatedMessages = [...conv.messages, newMsg];
  const extracted = await defaultSupportAgentProvider.extractLeadInfo(updatedMessages);
  const objection = detectObjection(text);
  const intentResult = await defaultSupportAgentProvider.detectIntent(text);

  const updatedConv: ClientConversation = {
    ...conv,
    messages: updatedMessages,
    lastMessageSnippet: text,
    lastMessageAt: "Just now",
    unreadCount: conv.unreadCount + 1,
    intent: intentResult.intent,
    extractedInfo: extracted.name || extracted.phone || extracted.email ? extracted : conv.extractedInfo,
    detectedObjection: objection,
    updatedAt: new Date().toISOString(),
  };

  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId ? updatedConv : c
    ),
  };
  emitLeadsChange();

  if (conv.aiMode === "autonomous") {
    await storeTriggerAiResponse(conversationId);
  }
}

async function storeTriggerAiResponse(conversationId: string) {
  const conv = storeGetConversation(conversationId);
  if (!conv || conv.aiMode === "paused" || conv.aiMode === "human_takeover") return;

  const client = memoryState.clients.find((c) => c.id === conv.clientId);
  const aiResult = await defaultSupportAgentProvider.generateResponse(
    conv,
    client?.industry || "General"
  );

  const aiMsg: ChatMessage = {
    id: `m_${Date.now()}`,
    conversationId,
    sender: "ai",
    content: aiResult.reply,
    timestamp: "Just now",
    aiGenerated: true,
    messageType: aiResult.shouldHandoff ? "handoff" : "text",
  };

  const updatedMessages = [...conv.messages, aiMsg];
  const summary = await defaultSupportAgentProvider.summarizeConversation(
    updatedMessages,
    conv.clientName
  );

  let newStatus: ConversationStatus = conv.status;
  let newAiMode: AiConversationMode = conv.aiMode;

  if (aiResult.shouldHandoff) {
    newStatus = "Needs Attention";
    newAiMode = "human_takeover";
  }

  if (conv.autoCaptureEnabled && aiResult.autoCaptureTriggered && !conv.leadId && conv.extractedInfo?.name) {
    storeCreateLeadFromConversation(conversationId, {
      name: conv.extractedInfo.name,
      phone: conv.extractedInfo.phone || "",
      email: conv.extractedInfo.email || "",
      intent: aiResult.detectedIntent,
      aiSummary: summary,
    });
  }

  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            messages: updatedMessages,
            lastMessageSnippet: aiResult.reply,
            lastMessageAt: "Just now",
            status: newStatus,
            aiMode: newAiMode,
            handoff: aiResult.shouldHandoff
              ? {
                  requestedAt: new Date().toISOString(),
                  reason: aiResult.handoffReason || "Escalation requested.",
                  status: "pending",
                }
              : c.handoff,
            suggestedNextAction: aiResult.shouldHandoff
              ? "Human agent needed to assist customer."
              : "Awaiting next customer query or lead qualification.",
            updatedAt: new Date().toISOString(),
          }
        : c
    ),
  };
  emitLeadsChange();
}

function storeSendHumanReply(conversationId: string, text: string) {
  const conv = storeGetConversation(conversationId);
  if (!conv) return;

  const msg: ChatMessage = {
    id: `m_${Date.now()}`,
    conversationId,
    sender: "human",
    content: text,
    timestamp: "Just now",
    aiGenerated: false,
    messageType: "text",
  };

  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            messages: [...c.messages, msg],
            lastMessageSnippet: text,
            lastMessageAt: "Just now",
            aiMode: "human_takeover",
            status: "Human Active",
            updatedAt: new Date().toISOString(),
          }
        : c
    ),
  };
  emitLeadsChange();
}

function storeToggleAiMode(conversationId: string, mode: AiConversationMode) {
  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            aiMode: mode,
            status: mode === "human_takeover" ? "Human Active" : mode === "paused" ? "Needs Attention" : "Active",
            updatedAt: new Date().toISOString(),
          }
        : c
    ),
  };
  emitLeadsChange();
}

function storeReviewExtractedInfo(
  conversationId: string,
  action: "accept" | "edit" | "ignore",
  editedData?: Partial<ExtractedLeadInfo>
) {
  const conv = storeGetConversation(conversationId);
  if (!conv || !conv.extractedInfo) return;

  const updatedExtracted: ExtractedLeadInfo = {
    ...conv.extractedInfo,
    ...editedData,
    reviewStatus: action === "accept" ? "accepted" : action === "edit" ? "edited" : "ignored",
  };

  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId ? { ...c, extractedInfo: updatedExtracted } : c
    ),
  };
  emitLeadsChange();

  if ((action === "accept" || action === "edit") && conv.leadId) {
    storeUpdateLead(conv.leadId, {
      name: updatedExtracted.name || undefined,
      phone: updatedExtracted.phone || undefined,
      email: updatedExtracted.email || undefined,
      intent: updatedExtracted.intent || undefined,
    });
  }
}

function storeTriggerHumanHandoff(conversationId: string, reason = "Requested by user/agent") {
  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            status: "Needs Attention",
            aiMode: "human_takeover",
            handoff: {
              requestedAt: new Date().toISOString(),
              reason,
              status: "pending",
            },
            updatedAt: new Date().toISOString(),
          }
        : c
    ),
  };
  emitLeadsChange();
}

function storeAcceptHumanHandoff(conversationId: string) {
  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            status: "Human Active",
            aiMode: "human_takeover",
            handoff: c.handoff ? { ...c.handoff, status: "accepted" } : null,
            updatedAt: new Date().toISOString(),
          }
        : c
    ),
  };
  emitLeadsChange();
}

function storeToggleAutoCapture(conversationId: string) {
  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId ? { ...c, autoCaptureEnabled: !c.autoCaptureEnabled } : c
    ),
  };
  emitLeadsChange();
}

function storeCloseConversation(conversationId: string) {
  memoryState = {
    ...memoryState,
    conversations: memoryState.conversations.map((c) =>
      c.id === conversationId ? { ...c, status: "Closed", aiMode: "resolved" } : c
    ),
  };
  emitLeadsChange();
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    subscribeLeads,
    getLeadsSnapshot,
    getServerLeadsSnapshot
  );

  const getLead = useCallback((id: string) => storeGetLead(id), []);
  const getClient = useCallback((id: string) => storeGetClient(id), []);
  const getConversation = useCallback((id: string) => storeGetConversation(id), []);
  const addLead = useCallback((partial: Partial<ClientLead>) => storeAddLead(partial), []);
  const updateLead = useCallback((id: string, upd: Partial<ClientLead>) => storeUpdateLead(id, upd), []);
  const updateLeadStatus = useCallback((id: string, st: ClientLeadStatus) => storeUpdateLeadStatus(id, st), []);
  const updateQualificationCriterion = useCallback(
    (leadId: string, critId: string, val: QualificationValue, notes?: string) =>
      storeUpdateQualificationCriterion(leadId, critId, val, notes),
    []
  );
  const addLeadNote = useCallback((id: string, content: string, author?: string) => storeAddLeadNote(id, content, author), []);
  const scheduleLeadFollowUp = useCallback((id: string, date: string, note?: string) => storeScheduleLeadFollowUp(id, date, note), []);
  const deleteLead = useCallback((id: string) => storeDeleteLead(id), []);
  const createLeadFromConversation = useCallback((convId: string, overrides?: Partial<ClientLead>) => storeCreateLeadFromConversation(convId, overrides), []);

  const sendSimulatedCustomerMessage = useCallback((convId: string, text: string) => storeSendSimulatedCustomerMessage(convId, text), []);
  const triggerAiResponse = useCallback((convId: string) => storeTriggerAiResponse(convId), []);
  const sendHumanReply = useCallback((convId: string, text: string) => storeSendHumanReply(convId, text), []);
  const toggleAiMode = useCallback((convId: string, mode: AiConversationMode) => storeToggleAiMode(convId, mode), []);
  const reviewExtractedInfo = useCallback(
    (convId: string, action: "accept" | "edit" | "ignore", data?: Partial<ExtractedLeadInfo>) =>
      storeReviewExtractedInfo(convId, action, data),
    []
  );
  const triggerHumanHandoff = useCallback((convId: string, reason?: string) => storeTriggerHumanHandoff(convId, reason), []);
  const acceptHumanHandoff = useCallback((convId: string) => storeAcceptHumanHandoff(convId), []);
  const toggleAutoCapture = useCallback((convId: string) => storeToggleAutoCapture(convId), []);
  const closeConversation = useCallback((convId: string) => storeCloseConversation(convId), []);

  const leadMetrics = calculateLeadMetrics(state.leads);
  const conversationMetrics = calculateConversationMetrics(state.conversations);

  return (
    <LeadsContext.Provider
      value={{
        clients: state.clients,
        leads: state.leads,
        conversations: state.conversations,
        leadMetrics,
        conversationMetrics,
        getLead,
        getClient,
        getConversation,
        addLead,
        updateLead,
        updateLeadStatus,
        updateQualificationCriterion,
        addLeadNote,
        scheduleLeadFollowUp,
        deleteLead,
        createLeadFromConversation,
        sendSimulatedCustomerMessage,
        triggerAiResponse,
        sendHumanReply,
        toggleAiMode,
        reviewExtractedInfo,
        triggerHumanHandoff,
        acceptHumanHandoff,
        toggleAutoCapture,
        closeConversation,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
