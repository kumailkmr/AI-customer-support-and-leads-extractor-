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
} from "@/types/prospects";
import { initialDiscoveryBusinesses } from "@/lib/mock-data/discovery";

interface ProspectsContextType {
  businesses: BusinessProspect[];
  prospects: BusinessProspect[];
  isLoaded: boolean;
  addProspect: (id: string) => void;
  removeProspect: (id: string) => void;
  updateProspectStatus: (id: string, newStatus: ProspectPipelineStatus) => void;
  addProspectNote: (
    id: string,
    content: string,
    author?: string,
    authorRole?: string
  ) => void;
  createCustomProspect: (data: Partial<BusinessProspect>) => BusinessProspect;
  getProspectById: (id: string) => BusinessProspect | undefined;
  resetToDefault: () => void;
}

const STORAGE_KEY = "nexus_prospects_v2";

let memoryBusinesses: BusinessProspect[] = initialDiscoveryBusinesses;
let isInitialized = false;
const listeners = new Set<() => void>();

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
    // fallback
  }
  isInitialized = true;
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

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): BusinessProspect[] {
  initStore();
  return memoryBusinesses;
}

function getServerSnapshot(): BusinessProspect[] {
  return initialDiscoveryBusinesses;
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

  const prospects = useMemo(
    () => businesses.filter((b) => b.isProspect),
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

  const addProspect = useCallback((id: string) => {
    memoryBusinesses = memoryBusinesses.map((b) => {
      if (b.id !== id) return b;
      const newStatus: ProspectPipelineStatus =
        b.status === "Found" ? "Researching" : b.status;
      const newActivity: ProspectActivity = {
        id: `act_${Date.now()}`,
        type: "status_change",
        title: "Added to Active Prospects",
        description: "Target converted to active acquisition pipeline.",
        timestamp: "Just now",
      };
      return {
        ...b,
        isProspect: true,
        status: newStatus,
        lastActivity: "Just now",
        activityHistory: [newActivity, ...b.activityHistory],
      };
    });
    emitChange();
  }, []);

  const removeProspect = useCallback((id: string) => {
    memoryBusinesses = memoryBusinesses.map((b) => {
      if (b.id !== id) return b;
      return {
        ...b,
        isProspect: false,
      };
    });
    emitChange();
  }, []);

  const updateProspectStatus = useCallback(
    (id: string, newStatus: ProspectPipelineStatus) => {
      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== id) return b;
        const newActivity: ProspectActivity = {
          id: `act_${Date.now()}`,
          type: "pipeline_advanced",
          title: `Status changed to ${newStatus}`,
          description: `Acquisition pipeline stage transitioned to ${newStatus}.`,
          timestamp: "Just now",
        };
        return {
          ...b,
          status: newStatus,
          lastActivity: "Just now",
          activityHistory: [newActivity, ...b.activityHistory],
        };
      });
      emitChange();
    },
    []
  );

  const addProspectNote = useCallback(
    (
      id: string,
      content: string,
      author = "Growth Specialist",
      authorRole = "Acquisition Agent"
    ) => {
      if (!content.trim()) return;
      const newNote: ProspectNote = {
        id: `note_${Date.now()}`,
        author,
        authorRole,
        content: content.trim(),
        timestamp: "Just now",
      };
      const newActivity: ProspectActivity = {
        id: `act_${Date.now()}`,
        type: "note_added",
        title: "Observation note recorded",
        description: `Note: "${content.slice(0, 70)}${
          content.length > 70 ? "..." : ""
        }"`,
        timestamp: "Just now",
      };

      memoryBusinesses = memoryBusinesses.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          lastActivity: "Just now",
          notes: [newNote, ...b.notes],
          activityHistory: [newActivity, ...b.activityHistory],
        };
      });
      emitChange();
    },
    []
  );

  const createCustomProspect = useCallback(
    (data: Partial<BusinessProspect>): BusinessProspect => {
      const id = `prosp_${Date.now()}`;
      const newBiz: BusinessProspect = {
        id,
        businessName: data.businessName || "New Target Enterprise",
        category: data.category || "Target Enterprise",
        industry: data.industry || "General Industry",
        location: data.location || "Remote / National",
        city: data.city || "Unknown",
        country: data.country || "India",
        website:
          data.website ||
          `https://${(data.businessName || "target")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")}.example.com`,
        hasWebsite: true,
        phone: data.phone || "+91 90000 00000",
        email:
          data.email ||
          `contact@${(data.businessName || "target")
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")}.example.com`,
        address: data.address || data.location || "Central Commercial District",
        companySize: data.companySize || "10-50 Staff",
        socialPresence: data.socialPresence || {
          instagram: { handle: "@target_business", followers: "5k", active: true },
          facebook: { page: "TargetBusiness", likes: "2.5k", active: true },
          whatsapp: { number: "+91 90000 00000", businessVerified: true },
          googleBusiness: { rating: 4.5, reviewCount: 120, claimed: true },
        },
        opportunityLevel: data.opportunityLevel || "High",
        nexusFitScore: data.nexusFitScore || 85,
        nexusFitRationale:
          data.nexusFitRationale ||
          "Observational fit based on initial manual addition and channel evaluation.",
        status: data.status || "Found",
        isProspect: true,
        discoveredAt: new Date().toISOString(),
        lastResearchedAt: new Date().toISOString(),
        lastActivity: "Just now",
        researchObservations: data.researchObservations || {
          contactFlow:
            "Manual phone/email channels with no real-time conversational booking.",
          faqAccess: "Standard information lookup.",
          leadCapture: "Web form submission without instant qualification.",
          followUp: "Manual follow-up process.",
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
        notes: [
          {
            id: `note_${Date.now()}`,
            author: "You",
            authorRole: "Growth Specialist",
            content: "Manually registered into NEXUS client acquisition pipeline.",
            timestamp: "Just now",
          },
        ],
        activityHistory: [
          {
            id: `act_${Date.now()}`,
            type: "discovered",
            title: "Target Created Manually",
            description: "Entered into target list via manual addition.",
            timestamp: "Just now",
          },
        ],
      };

      memoryBusinesses = [newBiz, ...memoryBusinesses];
      emitChange();
      return newBiz;
    },
    []
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
        isLoaded: true,
        addProspect,
        removeProspect,
        updateProspectStatus,
        addProspectNote,
        createCustomProspect,
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
