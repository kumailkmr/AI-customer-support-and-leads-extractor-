"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  BusinessProspect,
  ProspectPipelineStatus,
  ProspectNote,
  ProspectActivity,
  ProspectFollowUp,
  CrmMetrics,
} from "@/types/prospects";
import { initialDiscoveryBusinesses } from "@/lib/mock-data/discovery";
import {
  calculateCrmMetrics,
  exportProspectsToCsv,
  getFollowUpStatus,
} from "@/lib/crm/crm-service";
import { normalizePipelineStatus } from "@/lib/crm/pipeline-config";

export type CrmViewMode = "table" | "kanban" | "cards";

interface ProspectsContextType {
  businesses: BusinessProspect[];
  prospects: BusinessProspect[];
  crmMetrics: CrmMetrics;
  isLoaded: boolean;
  selectedView: CrmViewMode;
  setSelectedView: (view: CrmViewMode) => void;

  addProspect: (dataOrId: string | Partial<BusinessProspect>) => BusinessProspect;
  updateProspect: (id: string, updates: Partial<BusinessProspect>) => void;
  deleteProspect: (id: string) => void;
  updateProspectStatus: (id: string, newStatus: ProspectPipelineStatus) => void;

  addActivity: (
    prospectId: string,
    activity: {
      type: ProspectActivity["type"];
      title: string;
      description: string;
      actor?: string;
      channel?: ProspectActivity["channel"];
      contactPerson?: string;
    }
  ) => void;

  addProspectNote: (
    id: string,
    content: string,
    author?: string,
    authorRole?: string,
    title?: string,
    tag?: string
  ) => void;

  deleteProspectNote: (prospectId: string, noteId: string) => void;

  scheduleFollowUp: (
    prospectId: string,
    followUp: {
      date: string;
      time: string;
      channel: ProspectFollowUp["channel"];
      reminder: boolean;
      notes: string;
    }
  ) => void;

  bulkUpdateStatus: (ids: string[], newStatus: ProspectPipelineStatus) => void;
  bulkAddTag: (ids: string[], tag: string) => void;
  bulkDelete: (ids: string[]) => void;

  importProspects: (items: Array<Partial<BusinessProspect>>) => number;
  exportProspects: (subset?: BusinessProspect[]) => void;

  getProspectById: (id: string) => BusinessProspect | undefined;
  resetToDefault: () => void;
}

const STORAGE_KEY = "nexus_prospects_v3";
const VIEW_STORAGE_KEY = "nexus_crm_view_mode";

let memoryBusinesses: BusinessProspect[] = initialDiscoveryBusinesses;
let isInitialized = false;
const listeners = new Set<() => void>();

let memoryView: CrmViewMode = "table";
let isViewInitialized = false;
const viewListeners = new Set<() => void>();

function initStore() {
  if (isInitialized || typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryBusinesses = parsed;
      }
    }
  } catch {
    // fallback to initial
  }
  isInitialized = true;
}

function initViewStore() {
  if (isViewInitialized || typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY) as CrmViewMode;
    if (saved === "table" || saved === "kanban" || saved === "cards") {
      memoryView = saved;
    }
  } catch {
    // ignore
  }
  isViewInitialized = true;
}

function emitChange() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryBusinesses));
    } catch {
      // ignore
    }
  }
  for (const listener of listeners) {
    listener();
  }
}

function emitViewChange() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, memoryView);
    } catch {
      // ignore
    }
  }
  for (const listener of viewListeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function subscribeView(listener: () => void) {
  viewListeners.add(listener);
  return () => {
    viewListeners.delete(listener);
  };
}

function getSnapshot(): BusinessProspect[] {
  initStore();
  return memoryBusinesses;
}

function getServerSnapshot(): BusinessProspect[] {
  return initialDiscoveryBusinesses;
}

function getViewSnapshot(): CrmViewMode {
  initViewStore();
  return memoryView;
}

function getServerViewSnapshot(): CrmViewMode {
  return "table";
}

const ProspectsContext = createContext<ProspectsContextType | undefined>(
  undefined
);

export function ProspectsProvider({ children }: { children: React.ReactNode }) {
  const businesses = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const selectedView = useSyncExternalStore(
    subscribeView,
    getViewSnapshot,
    getServerViewSnapshot
  );

  const setSelectedView = useCallback((view: CrmViewMode) => {
    memoryView = view;
    emitViewChange();
  }, []);

  const prospects = useMemo(
    () => businesses.filter((b) => b.isProspect),
    [businesses]
  );

  const crmMetrics = useMemo(
    () => calculateCrmMetrics(businesses),
    [businesses]
  );

  const getProspectById = useCallback(
    (id: string) => {
      return businesses.find(
        (b) => b.id.toLowerCase() === id.toLowerCase()
      );
    },
    [businesses]
  );

  // Add Prospect (manual or scanner or ID promotion)
  const addProspect = useCallback(
    (dataOrId: string | Partial<BusinessProspect>): BusinessProspect => {
      if (typeof dataOrId === "string") {
        const targetId = dataOrId.toLowerCase();
        let updatedBiz: BusinessProspect | undefined;
        memoryBusinesses = memoryBusinesses.map((b) => {
          if (b.id.toLowerCase() === targetId) {
            updatedBiz = {
              ...b,
              isProspect: true,
              status: b.status || "FOUND",
              updatedAt: new Date().toISOString(),
            };
            return updatedBiz;
          }
          return b;
        });
        if (updatedBiz) {
          emitChange();
          return updatedBiz;
        }
      }

      const data: Partial<BusinessProspect> =
        typeof dataOrId === "string" ? { id: dataOrId } : dataOrId;

      const id = data.id || `prosp_${Date.now()}`;
      const now = new Date().toISOString();
      const sp = data.socialPresence;
      const newBiz: BusinessProspect = {
        id,
        businessName: data.businessName || "New Target Enterprise",
        category: data.category || "Target Enterprise",
        industry: data.industry || "General",
        location: data.location || "Remote",
        city: data.city || "Unknown",
        country: data.country || "India",
        website:
          data.website ||
          `https://${(data.businessName || "target")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")}.example.com`,
        hasWebsite: !!data.website || true,
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || data.location || "",
        companySize: data.companySize || "10-50 Staff",
        socialPresence: {
          instagram: sp?.instagram || {
            handle: "",
            followers: "0",
            active: false,
          },
          facebook: sp?.facebook || {
            page: "",
            likes: "0",
            active: false,
          },
          whatsapp: sp?.whatsapp || {
            number: data.phone || "",
            businessVerified: false,
          },
          googleBusiness: sp?.googleBusiness || {
            rating: 4.5,
            reviewCount: 0,
            claimed: true,
          },
        },
        status: normalizePipelineStatus(data.status || "FOUND"),
        opportunityLevel: data.opportunityLevel || "High",
        opportunityScore: data.opportunityScore || 85,
        nexusFitScore: data.nexusFitScore || 85,
        nexusFitRationale:
          data.nexusFitRationale ||
          "Potential fit based on initial manual addition and channel evaluation.",
        estimatedDealValue: data.estimatedDealValue || 45000,
        monthlyValue: data.monthlyValue || 9000,
        serviceInterest: data.serviceInterest || [
          "AI Support",
          "WhatsApp Automation",
          "CRM",
        ],
        acquisitionSource: data.acquisitionSource || "Manual",
        assignedTo: data.assignedTo || "Kumail (You)",
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
        lastActivity: "Just now",
        contactAttempts: data.contactAttempts || {
          total: 0,
          email: 0,
          whatsapp: 0,
          call: 0,
          instagram: 0,
          responseStatus: "Not Contacted",
        },
        researchStatus: data.researchStatus || "Pending",
        researchObservations: data.researchObservations || {
          contactFlow: "Inquiry channel not yet audited.",
          faqAccess: "Knowledge base not yet audited.",
          leadCapture: "Lead capture mechanism not yet audited.",
          followUp: "Follow-up workflow not yet audited.",
        },
        opportunitySignals: data.opportunitySignals || {
          customerSupport: {
            enabled: true,
            label: "24/7 AI Receptionist",
            description: "Automate initial customer inquiries across channels.",
            impactPotential: "High",
          },
          leadCapture: {
            enabled: true,
            label: "Omnichannel Lead Capture",
            description: "Capture booking intents directly from WhatsApp and web.",
            impactPotential: "High",
          },
          followUp: {
            enabled: true,
            label: "Automated Re-engagement",
            description: "Scheduled smart follow-up sequences.",
            impactPotential: "Medium",
          },
          aiQualification: {
            enabled: true,
            label: "Lead Intent Scoring",
            description: "Score customer inquiries for high-intent conversion.",
            impactPotential: "Medium",
          },
          unifiedInbox: {
            enabled: true,
            label: "Unified Team Inbox",
            description: "Single pane of glass across all acquisition touchpoints.",
            impactPotential: "High",
          },
        },
        identifiedPainPoints: data.identifiedPainPoints || [
          "Manual customer intake and delayed reply times",
          "Lack of automated 24/7 inquiry capture",
        ],
        suggestedAngle:
          data.suggestedAngle ||
          "Deploy NEXUS AI omnichannel assistant to capture and qualify client inquiries 24/7.",
        notes: data.notes || [
          {
            id: `note_${Date.now()}`,
            title: "Prospect Created",
            content: "Manually registered into NEXUS client acquisition CRM pipeline.",
            author: "Kumail (You)",
            authorRole: "Acquisition Lead",
            tag: "High Potential",
            timestamp: "Just now",
            createdAt: now,
          },
        ],
        activityHistory: [
          {
            id: `act_${Date.now()}`,
            type: "prospect_added",
            title: "Prospect Created in CRM",
            description: "Registered into acquisition pipeline.",
            actor: "Kumail (You)",
            timestamp: "Just now",
          },
        ],
        tags: data.tags || ["High Potential"],
        isProspect: true,
        discoveredAt: now,
      };

      memoryBusinesses = [newBiz, ...memoryBusinesses];
      emitChange();
      return newBiz;
    },
    []
  );

  // Update existing prospect fields
  const updateProspect = useCallback(
    (id: string, updates: Partial<BusinessProspect>) => {
      const now = new Date().toISOString();
      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          ...updates,
          updatedAt: now,
          lastActivityAt: now,
          lastActivity: "Just now",
        };
      });
      emitChange();
    },
    []
  );

  // Delete single prospect
  const deleteProspect = useCallback((id: string) => {
    memoryBusinesses = memoryBusinesses.filter((b) => b.id !== id);
    emitChange();
  }, []);

  // Update prospect status (moves through pipeline)
  const updateProspectStatus = useCallback(
    (id: string, newStatus: ProspectPipelineStatus) => {
      const normalized = normalizePipelineStatus(newStatus);
      const now = new Date().toISOString();

      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== id) return b;
        const newActivity: ProspectActivity = {
          id: `act_${Date.now()}`,
          type: "status_changed",
          title: `Moved to ${normalized}`,
          description: `Acquisition stage transitioned from ${b.status} to ${normalized}.`,
          actor: "Kumail (You)",
          timestamp: "Just now",
        };

        return {
          ...b,
          status: normalized,
          isProspect: true,
          updatedAt: now,
          lastActivityAt: now,
          lastActivity: "Just now",
          activityHistory: [newActivity, ...b.activityHistory],
        };
      });
      emitChange();
    },
    []
  );

  // Add structured activity
  const addActivity = useCallback(
    (
      prospectId: string,
      activity: {
        type: ProspectActivity["type"];
        title: string;
        description: string;
        actor?: string;
        channel?: ProspectActivity["channel"];
        contactPerson?: string;
      }
    ) => {
      const now = new Date().toISOString();
      const newActivity: ProspectActivity = {
        id: `act_${Date.now()}`,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        actor: activity.actor || "Kumail (You)",
        channel: activity.channel,
        contactPerson: activity.contactPerson,
        timestamp: "Just now",
      };

      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== prospectId) return b;

        // If it was a contact attempt (email, call, whatsapp, instagram), update contactAttempts counter
        const updatedContactAttempts = { ...b.contactAttempts };
        if (activity.type === "email_sent") {
          updatedContactAttempts.total += 1;
          updatedContactAttempts.email += 1;
          updatedContactAttempts.lastContactedAt = now;
        } else if (activity.type === "whatsapp_sent") {
          updatedContactAttempts.total += 1;
          updatedContactAttempts.whatsapp += 1;
          updatedContactAttempts.lastContactedAt = now;
        } else if (activity.type === "call_made") {
          updatedContactAttempts.total += 1;
          updatedContactAttempts.call += 1;
          updatedContactAttempts.lastContactedAt = now;
        } else if (activity.type === "instagram_sent") {
          updatedContactAttempts.total += 1;
          updatedContactAttempts.instagram += 1;
          updatedContactAttempts.lastContactedAt = now;
        } else if (activity.type === "reply_received") {
          updatedContactAttempts.responseStatus = "Replied";
        }

        return {
          ...b,
          contactAttempts: updatedContactAttempts,
          updatedAt: now,
          lastActivityAt: now,
          lastActivity: "Just now",
          activityHistory: [newActivity, ...b.activityHistory],
        };
      });
      emitChange();
    },
    []
  );

  // Add note
  const addProspectNote = useCallback(
    (
      id: string,
      content: string,
      author = "Kumail (You)",
      authorRole = "Acquisition Lead",
      title = "CRM Observation",
      tag?: string
    ) => {
      if (!content.trim()) return;
      const now = new Date().toISOString();
      const newNote: ProspectNote = {
        id: `note_${Date.now()}`,
        title: title || "CRM Note",
        content: content.trim(),
        author,
        authorRole,
        tag,
        timestamp: "Just now",
        createdAt: now,
      };

      const newActivity: ProspectActivity = {
        id: `act_${Date.now()}`,
        type: "note_added",
        title: `Note: ${title}`,
        description: `"${content.slice(0, 70)}${content.length > 70 ? "..." : ""}"`,
        actor: author,
        timestamp: "Just now",
      };

      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          updatedAt: now,
          lastActivityAt: now,
          lastActivity: "Just now",
          notes: [newNote, ...b.notes],
          activityHistory: [newActivity, ...b.activityHistory],
        };
      });
      emitChange();
    },
    []
  );

  // Delete note
  const deleteProspectNote = useCallback(
    (prospectId: string, noteId: string) => {
      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== prospectId) return b;
        return {
          ...b,
          notes: b.notes.filter((n) => n.id !== noteId),
        };
      });
      emitChange();
    },
    []
  );

  // Schedule follow-up
  const scheduleFollowUp = useCallback(
    (
      prospectId: string,
      followUpData: {
        date: string;
        time: string;
        channel: ProspectFollowUp["channel"];
        reminder: boolean;
        notes: string;
      }
    ) => {
      const now = new Date().toISOString();
      const followUpStatus = getFollowUpStatus(followUpData.date);

      const followUp: ProspectFollowUp = {
        ...followUpData,
        status: followUpStatus,
      };

      const newActivity: ProspectActivity = {
        id: `act_${Date.now()}`,
        type: "follow_up_scheduled",
        title: `Follow-up Scheduled: ${followUpData.channel}`,
        description: `Due on ${followUpData.date} at ${followUpData.time}. Note: "${followUpData.notes}"`,
        actor: "Kumail (You)",
        channel: followUpData.channel,
        timestamp: "Just now",
      };

      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== prospectId) return b;
        return {
          ...b,
          nextFollowUpAt: `${followUpData.date}T${followUpData.time}:00Z`,
          followUp,
          updatedAt: now,
          lastActivityAt: now,
          lastActivity: "Just now",
          activityHistory: [newActivity, ...b.activityHistory],
        };
      });
      emitChange();
    },
    []
  );

  // Bulk status update
  const bulkUpdateStatus = useCallback(
    (ids: string[], newStatus: ProspectPipelineStatus) => {
      const normalized = normalizePipelineStatus(newStatus);
      const now = new Date().toISOString();
      const idSet = new Set(ids);

      memoryBusinesses = memoryBusinesses.map((b) => {
        if (!idSet.has(b.id)) return b;
        const newActivity: ProspectActivity = {
          id: `act_${Date.now()}_${b.id}`,
          type: "status_changed",
          title: `Moved to ${normalized}`,
          description: `Bulk stage transition to ${normalized}.`,
          actor: "Kumail (You)",
          timestamp: "Just now",
        };
        return {
          ...b,
          status: normalized,
          updatedAt: now,
          lastActivityAt: now,
          lastActivity: "Just now",
          activityHistory: [newActivity, ...b.activityHistory],
        };
      });
      emitChange();
    },
    []
  );

  // Bulk add tag
  const bulkAddTag = useCallback((ids: string[], tag: string) => {
    const idSet = new Set(ids);
    memoryBusinesses = memoryBusinesses.map((b) => {
      if (!idSet.has(b.id)) return b;
      if (b.tags.includes(tag)) return b;
      return {
        ...b,
        tags: [...b.tags, tag],
      };
    });
    emitChange();
  }, []);

  // Bulk delete
  const bulkDelete = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    memoryBusinesses = memoryBusinesses.filter((b) => !idSet.has(b.id));
    emitChange();
  }, []);

  // Import prospects from CSV rows
  const importProspects = useCallback(
    (items: Array<Partial<BusinessProspect>>): number => {
      let count = 0;
      const newItems: BusinessProspect[] = [];

      items.forEach((item) => {
        if (!item.businessName) return;
        count++;
        const id = `prosp_imp_${Date.now()}_${count}`;
        const now = new Date().toISOString();

        newItems.push({
          id,
          businessName: item.businessName,
          category: item.category || "Imported Business",
          industry: item.industry || "General",
          location: item.location || "Remote",
          city: item.city || "Unknown",
          country: item.country || "India",
          website: item.website || "",
          hasWebsite: !!item.website,
          phone: item.phone || "",
          email: item.email || "",
          address: item.location || "",
          companySize: "10-50 Staff",
          socialPresence: {
            instagram: { handle: "", followers: "0", active: false },
            facebook: { page: "", likes: "0", active: false },
            whatsapp: { number: item.phone || "", businessVerified: false },
            googleBusiness: { rating: 4.5, reviewCount: 0, claimed: true },
          },
          status: normalizePipelineStatus(item.status || "FOUND"),
          opportunityLevel: item.opportunityLevel || "High",
          opportunityScore: 80,
          nexusFitScore: 80,
          nexusFitRationale: "Imported via CSV into CRM pipeline.",
          estimatedDealValue: item.estimatedDealValue || 45000,
          monthlyValue: 9000,
          serviceInterest: ["AI Support", "WhatsApp Automation"],
          acquisitionSource: item.acquisitionSource || "Directory",
          assignedTo: "Kumail (You)",
          createdAt: now,
          updatedAt: now,
          lastActivityAt: now,
          lastActivity: "Just now",
          contactAttempts: {
            total: 0,
            email: 0,
            whatsapp: 0,
            call: 0,
            instagram: 0,
            responseStatus: "Not Contacted",
          },
          researchStatus: "Pending",
          researchObservations: {
            contactFlow: "Pending review.",
            faqAccess: "Pending review.",
            leadCapture: "Pending review.",
            followUp: "Pending review.",
          },
          opportunitySignals: {
            customerSupport: {
              enabled: true,
              label: "24/7 AI Receptionist",
              description: "Automate initial customer inquiries.",
              impactPotential: "High",
            },
            leadCapture: {
              enabled: true,
              label: "Omnichannel Lead Capture",
              description: "Capture booking intents.",
              impactPotential: "High",
            },
            followUp: {
              enabled: true,
              label: "Automated Re-engagement",
              description: "Scheduled smart follow-up.",
              impactPotential: "Medium",
            },
            aiQualification: {
              enabled: true,
              label: "Lead Intent Scoring",
              description: "Score customer inquiries.",
              impactPotential: "Medium",
            },
            unifiedInbox: {
              enabled: true,
              label: "Unified Team Inbox",
              description: "Single pane of glass.",
              impactPotential: "High",
            },
          },
          identifiedPainPoints: ["Imported from external list"],
          suggestedAngle: "Deploy NEXUS AI Client Acquisition Suite.",
          notes: [
            {
              id: `note_${Date.now()}_${count}`,
              title: "CSV Import Record",
              content: "Imported from batch file into NEXUS CRM.",
              author: "Kumail (You)",
              authorRole: "Acquisition Lead",
              tag: "Imported",
              timestamp: "Just now",
              createdAt: now,
            },
          ],
          activityHistory: [
            {
              id: `act_${Date.now()}_${count}`,
              type: "prospect_added",
              title: "Imported via CSV",
              description: "Added to pipeline via CSV import.",
              actor: "Kumail (You)",
              timestamp: "Just now",
            },
          ],
          tags: ["Imported"],
          isProspect: true,
          discoveredAt: now,
        });
      });

      if (newItems.length > 0) {
        memoryBusinesses = [...newItems, ...memoryBusinesses];
        emitChange();
      }
      return count;
    },
    []
  );

  // Export current prospects to CSV download
  const exportProspects = useCallback(
    (subset?: BusinessProspect[]) => {
      exportProspectsToCsv(subset || prospects);
    },
    [prospects]
  );

  const resetToDefault = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    memoryBusinesses = initialDiscoveryBusinesses;
    emitChange();
  }, []);

  return (
    <ProspectsContext.Provider
      value={{
        businesses,
        prospects,
        crmMetrics,
        isLoaded: true,
        selectedView,
        setSelectedView,
        addProspect,
        updateProspect,
        deleteProspect,
        updateProspectStatus,
        addActivity,
        addProspectNote,
        deleteProspectNote,
        scheduleFollowUp,
        bulkUpdateStatus,
        bulkAddTag,
        bulkDelete,
        importProspects,
        exportProspects,
        getProspectById,
        resetToDefault,
      }}
    >
      {children}
    </ProspectsContext.Provider>
  );
}

export function useProspects() {
  const context = useContext(ProspectsContext);
  if (!context) {
    throw new Error("useProspects must be used within a ProspectsProvider");
  }
  return context;
}
