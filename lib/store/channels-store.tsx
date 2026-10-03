"use client";

import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import {
  ChannelConfig,
  ChannelIdentity,
  ChannelEvent,
  ChannelStatus,
  ChannelType,
  SimulateInboundEventInput,
} from "@/lib/channels/types";
import {
  initialMockChannelConfigs,
  initialMockIdentities,
  initialMockChannelEvents,
} from "@/lib/mock-data/omnichannel-initial";
import {
  processInboundChannelEvent,
  EventProcessingResult,
} from "@/lib/channels/event-processor";
import { useLeads } from "./leads-store";

interface ChannelsState {
  channels: ChannelConfig[];
  identities: ChannelIdentity[];
  events: ChannelEvent[];
}

interface ChannelsContextType {
  channels: ChannelConfig[];
  identities: ChannelIdentity[];
  events: ChannelEvent[];

  // Channel Operations
  getChannelsForClient: (clientId?: string) => ChannelConfig[];
  getChannel: (channelId: string) => ChannelConfig | undefined;
  updateChannelStatus: (channelId: string, status: ChannelStatus) => void;
  simulateConnectChannel: (channelId: string, accountIdentifier?: string) => Promise<{ success: boolean; message: string }>;
  addChannel: (channel: Partial<ChannelConfig>) => ChannelConfig;

  // Identity Operations
  getIdentitiesForLead: (leadId: string) => ChannelIdentity[];
  addChannelIdentity: (identity: Partial<ChannelIdentity>) => ChannelIdentity;

  // Event & Webhook Pipeline Simulation
  simulateInboundMessage: (input: SimulateInboundEventInput) => Promise<EventProcessingResult>;
  retryEvent: (eventId: string) => Promise<{ success: boolean; message: string }>;
  getEvents: (filter?: { status?: string; channelType?: string; clientId?: string }) => ChannelEvent[];
  getEventMetrics: () => {
    total: number;
    processed: number;
    duplicate: number;
    failed: number;
    retried: number;
  };
}

const CHANNELS_STORAGE_KEY = "nexus_omnichannel_os_v1";

let memoryState: ChannelsState = {
  channels: initialMockChannelConfigs,
  identities: initialMockIdentities,
  events: initialMockChannelEvents,
};

const listeners = new Set<() => void>();

function notifyListeners() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(memoryState));
    } catch (e) {
      console.warn("Failed to persist channels state to localStorage:", e);
    }
  }
  listeners.forEach((listener) => listener());
}

function initializeState(): ChannelsState {
  if (typeof window === "undefined") {
    return memoryState;
  }
  try {
    const raw = localStorage.getItem(CHANNELS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.channels && parsed.events) {
        memoryState = {
          channels: parsed.channels,
          identities: parsed.identities || initialMockIdentities,
          events: parsed.events,
        };
        return memoryState;
      }
    }
  } catch (e) {
    console.warn("Failed to parse cached channels state, using initial seed:", e);
  }
  return memoryState;
}

if (typeof window !== "undefined") {
  initializeState();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): ChannelsState {
  return memoryState;
}

const serverSnapshot: ChannelsState = {
  channels: initialMockChannelConfigs,
  identities: initialMockIdentities,
  events: initialMockChannelEvents,
};

function getServerSnapshot(): ChannelsState {
  return serverSnapshot;
}

const ChannelsContext = createContext<ChannelsContextType | null>(null);

export function ChannelsProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { clients, leads, conversations } = useLeads();

  const getChannelsForClient = useCallback(
    (clientId?: string) => {
      if (!clientId || clientId === "All") return state.channels;
      return state.channels.filter((c) => c.clientId === clientId);
    },
    [state.channels]
  );

  const getChannel = useCallback(
    (channelId: string) => {
      return state.channels.find((c) => c.id === channelId);
    },
    [state.channels]
  );

  const updateChannelStatus = useCallback((channelId: string, status: ChannelStatus) => {
    memoryState = {
      ...memoryState,
      channels: memoryState.channels.map((c) =>
        c.id === channelId
          ? {
              ...c,
              status,
              updatedAt: new Date().toISOString(),
              lastConnectedAt: status === "CONNECTED" || status === "MOCK" ? new Date().toISOString() : c.lastConnectedAt,
            }
          : c
      ),
    };
    notifyListeners();
  }, []);

  const simulateConnectChannel = useCallback(
    async (channelId: string, accountIdentifier?: string): Promise<{ success: boolean; message: string }> => {
      // Simulate asynchronous handshake
      await new Promise((resolve) => setTimeout(resolve, 800));

      const channel = memoryState.channels.find((c) => c.id === channelId);
      if (!channel) {
        return { success: false, message: "Channel configuration not found" };
      }

      memoryState = {
        ...memoryState,
        channels: memoryState.channels.map((c) =>
          c.id === channelId
            ? {
                ...c,
                status: "MOCK",
                accountIdentifier: accountIdentifier || c.accountIdentifier,
                lastConnectedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : c
        ),
      };
      notifyListeners();

      return {
        success: true,
        message: `${channel.name} connected successfully in Simulation Mode. Webhook pipeline active.`,
      };
    },
    []
  );

  const addChannel = useCallback((channel: Partial<ChannelConfig>): ChannelConfig => {
    const newChan: ChannelConfig = {
      id: `chan_${Date.now()}`,
      type: channel.type || "website",
      name: channel.name || "New Custom Channel",
      description: channel.description || "Custom client communication channel",
      status: "MOCK",
      clientId: channel.clientId || "client_abc_school",
      clientName: channel.clientName || "ABC International School",
      accountName: channel.accountName || "Custom Channel",
      accountIdentifier: channel.accountIdentifier || "custom.nexusai.io",
      lastConnectedAt: new Date().toISOString(),
      lastEventAt: undefined,
      unreadCount: 0,
      capabilities: channel.capabilities || ["receive_messages", "send_messages", "lead_capture"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      simulationMode: true,
    };

    memoryState = {
      ...memoryState,
      channels: [newChan, ...memoryState.channels],
    };
    notifyListeners();
    return newChan;
  }, []);

  const getIdentitiesForLead = useCallback(
    (leadId: string) => {
      return state.identities.filter((i) => i.leadId === leadId);
    },
    [state.identities]
  );

  const addChannelIdentity = useCallback((identity: Partial<ChannelIdentity>): ChannelIdentity => {
    const newIdnt: ChannelIdentity = {
      id: `idnt_${Date.now()}`,
      clientId: identity.clientId || "client_abc_school",
      leadId: identity.leadId || "",
      channelType: identity.channelType || "website",
      externalUserId: identity.externalUserId || `ext_${Date.now()}`,
      identifier: identity.identifier || "@handle",
      displayName: identity.displayName || "Customer Contact",
      metadata: identity.metadata,
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    memoryState = {
      ...memoryState,
      identities: [...memoryState.identities, newIdnt],
    };
    notifyListeners();
    return newIdnt;
  }, []);

  const simulateInboundMessage = useCallback(
    async (input: SimulateInboundEventInput): Promise<EventProcessingResult> => {
      const result = await processInboundChannelEvent(input, {
        clients,
        leads,
        conversations,
        events: memoryState.events,
        identities: memoryState.identities,
      });

      // Update channels event log
      const updatedEvents = [result.event, ...memoryState.events];

      let updatedIdentities = memoryState.identities;
      if (result.newIdentity) {
        updatedIdentities = [...updatedIdentities, result.newIdentity];
      }

      // Update channel last event time and unread count
      const updatedChannels = memoryState.channels.map((c) => {
        if (c.clientId === input.clientId && c.type === input.channelType) {
          return {
            ...c,
            lastEventAt: new Date().toISOString(),
            unreadCount: result.success ? c.unreadCount + 1 : c.unreadCount,
          };
        }
        return c;
      });

      memoryState = {
        ...memoryState,
        events: updatedEvents,
        identities: updatedIdentities,
        channels: updatedChannels,
      };
      notifyListeners();

      return result;
    },
    [clients, leads, conversations]
  );

  const retryEvent = useCallback(
    async (eventId: string): Promise<{ success: boolean; message: string }> => {
      const ev = memoryState.events.find((e) => e.id === eventId);
      if (!ev) {
        return { success: false, message: "Event not found" };
      }

      // Simulate re-processing
      await new Promise((resolve) => setTimeout(resolve, 600));

      const updatedEvents = memoryState.events.map((e) => {
        if (e.id === eventId) {
          return {
            ...e,
            status: "PROCESSED" as const,
            retryCount: e.retryCount + 1,
            processedAt: new Date().toISOString(),
            error: undefined,
          };
        }
        return e;
      });

      memoryState = {
        ...memoryState,
        events: updatedEvents,
      };
      notifyListeners();

      return {
        success: true,
        message: `Event ${ev.externalEventId} successfully re-processed and delivered to inbox.`,
      };
    },
    []
  );

  const getEvents = useCallback(
    (filter?: { status?: string; channelType?: string; clientId?: string }) => {
      let result = state.events;
      if (!filter) return result;

      if (filter.status && filter.status !== "All") {
        result = result.filter((e) => e.status === filter.status);
      }
      if (filter.channelType && filter.channelType !== "All") {
        result = result.filter((e) => e.channelType === filter.channelType);
      }
      if (filter.clientId && filter.clientId !== "All") {
        result = result.filter((e) => e.clientId === filter.clientId);
      }
      return result;
    },
    [state.events]
  );

  const getEventMetrics = useCallback(() => {
    let processed = 0;
    let duplicate = 0;
    let failed = 0;
    let retried = 0;

    state.events.forEach((e) => {
      if (e.status === "PROCESSED") processed++;
      else if (e.status === "DUPLICATE") duplicate++;
      else if (e.status === "FAILED") failed++;

      if (e.retryCount > 0) retried++;
    });

    return {
      total: state.events.length,
      processed,
      duplicate,
      failed,
      retried,
    };
  }, [state.events]);

  const value = {
    channels: state.channels,
    identities: state.identities,
    events: state.events,
    getChannelsForClient,
    getChannel,
    updateChannelStatus,
    simulateConnectChannel,
    addChannel,
    getIdentitiesForLead,
    addChannelIdentity,
    simulateInboundMessage,
    retryEvent,
    getEvents,
    getEventMetrics,
  };

  return <ChannelsContext.Provider value={value}>{children}</ChannelsContext.Provider>;
}

export function useChannels() {
  const context = useContext(ChannelsContext);
  if (!context) {
    throw new Error("useChannels must be used within a ChannelsProvider");
  }
  return context;
}
