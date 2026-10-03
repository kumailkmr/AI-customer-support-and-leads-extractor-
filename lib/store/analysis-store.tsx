"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useSyncExternalStore,
  useState,
} from "react";
import {
  BusinessAnalysis,
  AnalysisHistoryRecord,
  AnalysisStatus,
  AnalysisMetrics,
  Opportunity,
  BusinessProspect,
} from "@/types";
import { initialDiscoveryBusinesses } from "@/lib/mock-data/discovery";
import {
  defaultAnalysisProvider,
} from "@/lib/analysis/analysis-provider";
import { calculateAnalysisMetrics } from "@/lib/analysis/analysis-service";
import { useProspects } from "./prospects-store";

interface AnalysisStoreState {
  analyses: Record<string, BusinessAnalysis>;
  history: Record<string, AnalysisHistoryRecord[]>;
}

interface AnalysisContextType {
  analyses: Record<string, BusinessAnalysis>;
  analysisMetrics: AnalysisMetrics;
  getAnalysis: (prospectId: string) => BusinessAnalysis | undefined;
  getAnalysisStatus: (prospectId: string) => AnalysisStatus;
  getAnalysisProgress: (
    prospectId: string
  ) => { stage: string; percent: number } | undefined;
  getAnalysisHistory: (prospectId: string) => AnalysisHistoryRecord[];

  analyzeProspect: (
    prospect: BusinessProspect,
    isRegeneration?: boolean
  ) => Promise<BusinessAnalysis>;
  updateAnalysis: (
    prospectId: string,
    updates: Partial<BusinessAnalysis>
  ) => void;
  markReviewed: (prospectId: string) => void;
  addOpportunity: (
    prospectId: string,
    opp: Omit<Opportunity, "id">
  ) => void;
}

const STORAGE_KEY = "nexus_business_analyses_v1";

// Helper to pregenerate sample analyses for the first 5 mock businesses
function generateInitialMockAnalyses(): AnalysisStoreState {
  const analyses: Record<string, BusinessAnalysis> = {};
  const history: Record<string, AnalysisHistoryRecord[]> = {};

  // Seed first 4 prospects
  const seeds = initialDiscoveryBusinesses.slice(0, 4);
  for (const biz of seeds) {
    const pId = biz.id.toLowerCase();
    // Synchronously create via deterministic generator
    const readiness = {
      score: 4,
      total: 5,
      areas: [
        { name: "Website Details", complete: true, details: `URL: ${biz.website}` },
        { name: "Social Presence", complete: true, details: "Instagram & Google Business active" },
        { name: "Direct Contacts", complete: true, details: "Verified phone & email" },
        { name: "Opportunity Signals", complete: true, details: "Signals audited" },
        { name: "Research Observations", complete: false, details: "Audit in progress" },
      ],
      isReadyForDemo: true,
    };

    // We can run provider.analyzeProspect synchronously since delay is 0
    // but in JS, provider.analyzeProspect returns a Promise. We'll build the basic initial record:
    const initialRecord: BusinessAnalysis = {
      id: `ana_${biz.id}_v1`,
      prospectId: biz.id,
      version: 1,
      status: "Ready",
      summary: `Based on available digital observations, ${biz.businessName} has strong potential to capture additional ${biz.industry.toLowerCase()} client inquiries by modernizing its inbound conversion touchpoints. Inbound inquiries currently rely heavily on standard static channels. Implementing an automated conversation layer and WhatsApp response workflow may significantly improve response latency and inquiry volume.`,
      confidence: "High",
      confidenceReason: "Supported by active digital footprint, verified contact channels, and clear customer engagement friction.",
      primaryOpportunity: "Omnichannel Inbound Lead Capture & WhatsApp Nurture",
      recommendedSolution: "24/7 AI Receptionist + Automated WhatsApp Follow-Up + NEXUS CRM",
      readiness,
      observations: [
        {
          id: `obs_${biz.id}_1`,
          category: "Lead Generation",
          title: "Inquiry call-to-action lacks interactive immediate engagement",
          description: "Visitors encounter static informational content rather than an instant booking or inquiry trigger.",
          evidence: `Audit of ${biz.website || "public listings"}: standard phone/form only.`,
          severity: "High",
          source: "Research Data",
        },
        {
          id: `obs_${biz.id}_2`,
          category: "Communication",
          title: "WhatsApp number listed without automated qualification",
          description: "Incoming messages require direct manual reply by staff, risking delayed triage.",
          evidence: "WhatsApp business verification audited.",
          severity: "Medium",
          source: "Research Data",
        },
        {
          id: `obs_${biz.id}_3`,
          category: "Customer Experience",
          title: "After-hours response latency risk",
          description: "Inquiries outside standard operating hours risk cooling down before staff can follow up.",
          evidence: "Audited operational hours: 9am - 7pm.",
          severity: "Medium",
          source: "Research Data",
        },
      ],
      problems: [
        {
          id: `prob_${biz.id}_1`,
          title: "High potential for visitor drop-off before an inquiry is submitted",
          description: "Prospective customers may encounter friction when seeking immediate pricing or availability.",
          sourceObservationIds: [`obs_${biz.id}_1`],
          confidence: "High",
        },
        {
          id: `prob_${biz.id}_2`,
          title: "Response latency during peak or after-hours inquiry surges",
          description: "Manual handling leads to inquiry backlog during busy operational hours.",
          sourceObservationIds: [`obs_${biz.id}_2`, `obs_${biz.id}_3`],
          confidence: "Medium",
        },
      ],
      opportunities: [
        {
          id: `opp_${biz.id}_1`,
          title: "Omnichannel Inbound Lead Capture & 24/7 AI Receptionist",
          description: "Deploy an interactive conversation layer across web and WhatsApp to capture every inquiry instantly.",
          problemIds: [`prob_${biz.id}_1`],
          potentialValue: `₹${((biz.estimatedDealValue || 45000) * 0.5).toFixed(0)} Estimated Value Uplift`,
          priority: "High Potential",
          priorityReason: "Directly solves visitor drop-off without requiring complex back-office overhaul.",
        },
        {
          id: `opp_${biz.id}_2`,
          title: "Automated WhatsApp Follow-Up & Inquiry Re-engagement",
          description: "Structured follow-up messages triggered automatically when an inquiry arrives.",
          problemIds: [`prob_${biz.id}_2`],
          potentialValue: "2x faster speed-to-lead",
          priority: "High Potential",
          priorityReason: "High impact on conversion rates with minimal staff training.",
        },
      ],
      recommendedServices: [
        {
          id: `svc_${biz.id}_1`,
          service: "24/7 AI Receptionist & Inbound Lead Agent",
          reason: "Answers repetitive questions and captures qualified contact details around the clock.",
          opportunityId: `opp_${biz.id}_1`,
          category: "AI Agent",
        },
        {
          id: `svc_${biz.id}_2`,
          service: "WhatsApp Business Automation Workflow",
          reason: "Instant confirmation and automated re-engagement straight to client mobile phones.",
          opportunityId: `opp_${biz.id}_2`,
          category: "Automation",
        },
      ],
      businessImpact: [
        {
          category: "Lead Capture",
          title: "Clear, frictionless path from visitor to inquiry",
          description: "Eliminates ambiguity with prominent 1-click WhatsApp and interactive web triggers.",
        },
        {
          category: "Response Time",
          title: "Instant response capability around the clock",
          description: "Questions answered within seconds regardless of staff availability or time zone.",
        },
        {
          category: "Operational Efficiency",
          title: "Reduced repetitive front-desk workload",
          description: "Filters routine FAQs so staff can focus on finalizing bookings and high-value deals.",
        },
      ],
      solutionArchitecture: {
        nodes: [
          { id: "node_traffic", label: "Inbound Channels", role: "Traffic", description: "Web, Instagram & Google" },
          { id: "node_capture", label: "Smart Capture Widget", role: "Touchpoint", description: "1-Click WhatsApp & Web Chat" },
          { id: "node_ai_agent", label: "24/7 AI Agent", role: "Triage", description: "Answers FAQs & Scores Intent" },
          { id: "node_crm", label: "NEXUS CRM", role: "Lead Record", description: "Auto-synced Pipeline Profile" },
          { id: "node_staff", label: "Team Handoff", role: "Closing", description: "Instant notification with full context" },
        ],
        edges: [
          { from: "node_traffic", to: "node_capture", label: "Traffic" },
          { from: "node_capture", to: "node_ai_agent", label: "Chat" },
          { from: "node_ai_agent", to: "node_crm", label: "Lead Created" },
          { from: "node_crm", to: "node_staff", label: "Alert" },
        ],
        description: `Architecture tailored to ${biz.businessName} inbound inquiry conversion.`,
      },
      demoStrategy: {
        objective: `Demonstrate how ${biz.businessName} can capture 2x more inquiries and respond in seconds using an interactive prototype.`,
        screens: [
          { name: "Interactive Landing Prototype", description: "High-converting web preview with 1-click WhatsApp trigger.", keyFeatures: ["WhatsApp CTA", "Lead Modal"] },
          { name: "24/7 AI Receptionist Modal", description: "Real-time conversation widget answering questions.", keyFeatures: ["FAQ Database", "Lead Capture"] },
          { name: "Pipeline CRM Dashboard", description: "Live CRM feed showing the captured test lead.", keyFeatures: ["Chat History", "Deal Value"] },
        ],
        workflow: ["Visitor arrives", "Clicks chat trigger", "AI Agent qualifies intent", "Lead logged to CRM", "Staff alerted"],
        keyFeatures: ["Mobile-first design", "Zero app install required", "Instant WhatsApp notification"],
      },
      outreachAngle: {
        headline: `Transform inquiry capture for ${biz.businessName}`,
        pitchAngle: `Lead with how prospective clients visiting their page after 7pm can instantly book or inquire rather than bouncing to competitors.`,
        suggestedHook: `Hi ${biz.businessName} team — noticed your strong reputation. We created a 2-minute interactive demo showing how your visitors can get instant answers and submit inquiries over WhatsApp 24/7.`,
        demoOffer: `Can I share a quick link to the prototype we mocked up for ${biz.businessName}?`,
      },
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    analyses[pId] = initialRecord;
    history[pId] = [
      {
        id: `hist_${biz.id}_1`,
        analysisId: initialRecord.id,
        prospectId: biz.id,
        version: 1,
        status: "Ready",
        summary: initialRecord.summary,
        primaryOpportunity: initialRecord.primaryOpportunity,
        confidence: initialRecord.confidence,
        generatedAt: initialRecord.generatedAt,
        snapshot: initialRecord,
      },
    ];
  }

  return { analyses, history };
}

let memoryState: AnalysisStoreState = { analyses: {}, history: {} };
let isStoreInitialized = false;
const storeListeners = new Set<() => void>();

function initAnalysisStore() {
  if (isStoreInitialized) return;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.analyses === "object") {
          memoryState = parsed;
          isStoreInitialized = true;
          return;
        }
      }
    } catch {
      // fallback
    }
  }

  // Prepopulate initial seeds
  memoryState = generateInitialMockAnalyses();
  isStoreInitialized = true;
}

function emitAnalysisChange() {
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

function subscribeAnalysis(listener: () => void) {
  storeListeners.add(listener);
  return () => {
    storeListeners.delete(listener);
  };
}

function getAnalysisSnapshot(): AnalysisStoreState {
  initAnalysisStore();
  return memoryState;
}

let serverSnapshotCache: AnalysisStoreState | null = null;
function getServerAnalysisSnapshot(): AnalysisStoreState {
  if (!serverSnapshotCache) {
    serverSnapshotCache = generateInitialMockAnalyses();
  }
  return serverSnapshotCache;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const { addActivity } = useProspects();

  const state = useSyncExternalStore(
    subscribeAnalysis,
    getAnalysisSnapshot,
    getServerAnalysisSnapshot
  );

  // Transient state for in-progress simulations
  const [inProgress, setInProgress] = useState<
    Record<string, { stage: string; percent: number }>
  >({});

  const getAnalysis = useCallback(
    (prospectId: string): BusinessAnalysis | undefined => {
      const key = prospectId.toLowerCase();
      return state.analyses[key];
    },
    [state.analyses]
  );

  const getAnalysisStatus = useCallback(
    (prospectId: string): AnalysisStatus => {
      const key = prospectId.toLowerCase();
      if (inProgress[key]) return "Analyzing";
      const item = state.analyses[key];
      if (!item) return "Not Analyzed";
      return item.status;
    },
    [state.analyses, inProgress]
  );

  const getAnalysisProgress = useCallback(
    (prospectId: string) => {
      const key = prospectId.toLowerCase();
      return inProgress[key];
    },
    [inProgress]
  );

  const getAnalysisHistory = useCallback(
    (prospectId: string): AnalysisHistoryRecord[] => {
      const key = prospectId.toLowerCase();
      return state.history[key] || [];
    },
    [state.history]
  );

  // Trigger analysis simulation
  const analyzeProspect = useCallback(
    async (
      prospect: BusinessProspect,
      isRegeneration: boolean = false
    ): Promise<BusinessAnalysis> => {
      const key = prospect.id.toLowerCase();
      const existing = state.analyses[key];
      const newVersion = existing ? existing.version + 1 : 1;

      // Set initial analyzing status
      setInProgress((prev) => ({
        ...prev,
        [key]: { stage: "Starting analysis...", percent: 10 },
      }));

      try {
        const result = await defaultAnalysisProvider.analyzeProspect(prospect, {
          version: newVersion,
          onProgress: (stage, percent) => {
            setInProgress((prev) => ({
              ...prev,
              [key]: { stage, percent },
            }));
          },
        });

        // Store result in memory
        const nextAnalyses = { ...memoryState.analyses, [key]: result };
        const existingHist = memoryState.history[key] || [];
        const newHistItem: AnalysisHistoryRecord = {
          id: `hist_${prospect.id}_v${result.version}`,
          analysisId: result.id,
          prospectId: prospect.id,
          version: result.version,
          status: result.status,
          summary: result.summary,
          primaryOpportunity: result.primaryOpportunity,
          confidence: result.confidence,
          generatedAt: result.generatedAt,
          snapshot: result,
        };

        memoryState = {
          analyses: nextAnalyses,
          history: {
            ...memoryState.history,
            [key]: [newHistItem, ...existingHist],
          },
        };

        emitAnalysisChange();

        // Clear in-progress
        setInProgress((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });

        // Log to activity timeline
        addActivity(prospect.id, {
          type: "note_added",
          title: isRegeneration
            ? `AI Analysis Regenerated (v${result.version})`
            : `AI Business Analysis Generated (v${result.version})`,
          description: `Generated ${result.confidence} confidence analysis with primary opportunity "${result.primaryOpportunity}".`,
          actor: "NEXUS AI",
        });

        return result;
      } catch (err) {
        setInProgress((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        throw err;
      }
    },
    [state.analyses, addActivity]
  );

  // Update existing analysis fields manually
  const updateAnalysis = useCallback(
    (prospectId: string, updates: Partial<BusinessAnalysis>) => {
      const key = prospectId.toLowerCase();
      const current = memoryState.analyses[key];
      if (!current) return;

      const updated: BusinessAnalysis = {
        ...current,
        ...updates,
        userEdited: true,
        updatedAt: new Date().toISOString(),
      };

      const existingHist = memoryState.history[key] || [];
      const editHistItem: AnalysisHistoryRecord = {
        id: `hist_${prospectId}_edit_${Date.now()}`,
        analysisId: updated.id,
        prospectId,
        version: updated.version,
        status: updated.status,
        summary: updated.summary,
        primaryOpportunity: updated.primaryOpportunity,
        confidence: updated.confidence,
        generatedAt: updated.updatedAt,
        userEdited: true,
        snapshot: updated,
      };

      memoryState = {
        analyses: {
          ...memoryState.analyses,
          [key]: updated,
        },
        history: {
          ...memoryState.history,
          [key]: [editHistItem, ...existingHist],
        },
      };

      emitAnalysisChange();

      addActivity(prospectId, {
        type: "note_added",
        title: "Analysis Updated Manually",
        description: "Team modified observations or recommended opportunity.",
        actor: "Kumail (You)",
      });
    },
    [addActivity]
  );

  // Mark analysis as reviewed
  const markReviewed = useCallback(
    (prospectId: string) => {
      const key = prospectId.toLowerCase();
      const current = memoryState.analyses[key];
      if (!current) return;

      const updated: BusinessAnalysis = {
        ...current,
        status: "Ready",
        updatedAt: new Date().toISOString(),
      };

      memoryState = {
        analyses: {
          ...memoryState.analyses,
          [key]: updated,
        },
        history: memoryState.history,
      };

      emitAnalysisChange();

      addActivity(prospectId, {
        type: "note_added",
        title: "Analysis Marked as Reviewed",
        description: "Analysis validated for client demo readiness.",
        actor: "Kumail (You)",
      });
    },
    [addActivity]
  );

  // Add custom opportunity
  const addOpportunity = useCallback(
    (prospectId: string, opp: Omit<Opportunity, "id">) => {
      const key = prospectId.toLowerCase();
      const current = memoryState.analyses[key];
      if (!current) return;

      const newOpp: Opportunity = {
        ...opp,
        id: `opp_custom_${Date.now()}`,
        userEdited: true,
      };

      const updated: BusinessAnalysis = {
        ...current,
        opportunities: [...current.opportunities, newOpp],
        userEdited: true,
        updatedAt: new Date().toISOString(),
      };

      memoryState = {
        analyses: {
          ...memoryState.analyses,
          [key]: updated,
        },
        history: memoryState.history,
      };

      emitAnalysisChange();

      addActivity(prospectId, {
        type: "note_added",
        title: `Opportunity Added: ${newOpp.title}`,
        description: `Custom opportunity added with ${newOpp.priority} priority.`,
        actor: "Kumail (You)",
      });
    },
    [addActivity]
  );

  const analysisMetrics = useMemo(() => {
    return calculateAnalysisMetrics(state.analyses);
  }, [state.analyses]);

  const contextValue = useMemo(
    () => ({
      analyses: state.analyses,
      analysisMetrics,
      getAnalysis,
      getAnalysisStatus,
      getAnalysisProgress,
      getAnalysisHistory,
      analyzeProspect,
      updateAnalysis,
      markReviewed,
      addOpportunity,
    }),
    [
      state.analyses,
      analysisMetrics,
      getAnalysis,
      getAnalysisStatus,
      getAnalysisProgress,
      getAnalysisHistory,
      analyzeProspect,
      updateAnalysis,
      markReviewed,
      addOpportunity,
    ]
  );

  return (
    <AnalysisContext.Provider value={contextValue}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
