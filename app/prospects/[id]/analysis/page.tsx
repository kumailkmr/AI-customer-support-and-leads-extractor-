"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useProspects } from "@/lib/store/prospects-store";
import { useAnalysis } from "@/lib/store/analysis-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";

import { AnalysisHeader } from "@/components/analysis/AnalysisHeader";
import { ExecutiveSummaryCard } from "@/components/analysis/ExecutiveSummaryCard";
import { ReadinessChecklistCard } from "@/components/analysis/ReadinessChecklistCard";
import { ObservationsList } from "@/components/analysis/ObservationsList";
import { ProblemsList } from "@/components/analysis/ProblemsList";
import { OpportunityMap } from "@/components/analysis/OpportunityMap";
import { OpportunityPriorityCards } from "@/components/analysis/OpportunityPriorityCards";
import { BusinessImpactGrid } from "@/components/analysis/BusinessImpactGrid";
import { RecommendedServicesList } from "@/components/analysis/RecommendedServicesList";
import { SolutionArchitectureDiagram } from "@/components/analysis/SolutionArchitectureDiagram";
import { DemoStrategyCard } from "@/components/analysis/DemoStrategyCard";
import { OutreachAngleCard } from "@/components/analysis/OutreachAngleCard";

import { AnalyzingStateModal } from "@/components/analysis/AnalyzingStateModal";
import { AnalysisHistoryModal } from "@/components/analysis/AnalysisHistoryModal";
import { EditAnalysisModal } from "@/components/analysis/EditAnalysisModal";
import { PrepareDemoModal } from "@/components/analysis/PrepareDemoModal";

import {
  RiSparkling2Fill,
  RiArrowLeftLine,
} from "react-icons/ri";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export default function AnalysisWorkspacePage({ params }: AnalysisPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { showToast } = useToast();
  const { getProspectById } = useProspects();
  const {
    getAnalysis,
    getAnalysisStatus,
    getAnalysisProgress,
    getAnalysisHistory,
    analyzeProspect,
    updateAnalysis,
    markReviewed,
    addOpportunity,
  } = useAnalysis();

  const prospect = getProspectById(resolvedParams.id);
  const analysis = prospect ? getAnalysis(prospect.id) : undefined;
  const analysisStatus = prospect ? getAnalysisStatus(prospect.id) : "Not Analyzed";
  const progress = prospect ? getAnalysisProgress(prospect.id) : undefined;
  const history = prospect ? getAnalysisHistory(prospect.id) : [];

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // If prospect not found
  if (!prospect) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <EmptyStateCard
            title="Prospect Not Found"
            description="The requested prospect could not be located in your local CRM pipeline."
            actionLabel="Back to Prospects"
            onAction={() => router.push("/prospects")}
          />
        </div>
      </AppLayout>
    );
  }

  const handleRunAnalysis = async () => {
    try {
      const isRegen = !!analysis;
      const res = await analyzeProspect(prospect, isRegen);
      showToast(
        isRegen
          ? `Analysis regenerated successfully (v${res.version})`
          : `AI Business Analysis generated for ${prospect.businessName}`,
        "success"
      );
    } catch {
      showToast("Analysis generation encountered an error. Please retry.", "error");
    }
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const text = `NEXUS AI BUSINESS ANALYSIS BRIEF\nTarget: ${prospect.businessName} (${prospect.industry})\nVersion: v${analysis.version} | Confidence: ${analysis.confidence}\n\nSUMMARY:\n${analysis.summary}\n\nPRIMARY OPPORTUNITY:\n${analysis.primaryOpportunity}\n\nRECOMMENDED SOLUTION:\n${analysis.recommendedSolution}\n\nOUTREACH HOOK:\n${analysis.outreachAngle.suggestedHook}`;
    navigator.clipboard.writeText(text);
    showToast("Analysis brief copied to clipboard.", "info");
  };

  const handleCopyOutreachText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard.`, "info");
  };

  const handleProceedToDemo = () => {
    showToast(
      `Demo specifications ready for ${prospect.businessName}. Proceeding to Demo Generator...`,
      "success"
    );
    // In Phase 5 (Demo Generator), router.push(`/prospects/${prospect.id}/demo`)
  };

  return (
    <AppLayout>
      <div className="min-h-full pb-16">
        {/* Sticky Workspace Header */}
        <AnalysisHeader
          prospect={prospect}
          analysis={analysis}
          status={analysisStatus}
          isAnalyzing={analysisStatus === "Analyzing"}
          onAnalyze={handleRunAnalysis}
          onOpenEditModal={() => setIsEditModalOpen(true)}
          onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
          onMarkReviewed={() => {
            markReviewed(prospect.id);
            showToast("Analysis marked as reviewed for demo delivery.", "success");
          }}
          onCopySummary={handleCopySummary}
        />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          {/* State: Not Analyzed */}
          {!analysis && analysisStatus !== "Analyzing" && (
            <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-center max-w-2xl mx-auto space-y-4 my-8">
              <div className="h-16 w-16 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] text-[#8B5CF6] flex items-center justify-center mx-auto shadow-xs">
                <RiSparkling2Fill className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#0F172A]">
                  This prospect has not been analyzed yet
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Run the local NEXUS AI Business Analysis Engine to evaluate {prospect.businessName}&apos;s digital presence, infer conversion bottlenecks, and synthesize a tailored acquisition demo strategy.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Link href={`/prospects/${prospect.id}`}>
                  <Button size="sm" variant="outline" leftIcon={<RiArrowLeftLine className="h-4 w-4" />}>
                    Back to Dossier
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<RiSparkling2Fill className="h-4 w-4" />}
                  onClick={handleRunAnalysis}
                >
                  Analyze Business Now
                </Button>
              </div>
            </div>
          )}

          {/* State: Analysis Ready or In Review */}
          {analysis && (
            <>
              {/* Executive Summary */}
              <ExecutiveSummaryCard analysis={analysis} />

              {/* Research Readiness Score */}
              <ReadinessChecklistCard readiness={analysis.readiness} />

              {/* Observations Section */}
              <ObservationsList observations={analysis.observations} />

              {/* Potential Problems Hypotheses */}
              <ProblemsList
                problems={analysis.problems}
                observations={analysis.observations}
              />

              {/* Opportunity Progression Map */}
              <OpportunityMap
                observations={analysis.observations}
                problems={analysis.problems}
                opportunities={analysis.opportunities}
                services={analysis.recommendedServices}
              />

              {/* Opportunity Prioritization Cards */}
              <OpportunityPriorityCards
                opportunities={analysis.opportunities}
                onAddOpportunity={() => setIsEditModalOpen(true)}
              />

              {/* Qualitative Business Impact Grid */}
              <BusinessImpactGrid impacts={analysis.businessImpact} />

              {/* Recommended NEXUS Services */}
              <RecommendedServicesList
                services={analysis.recommendedServices}
                opportunities={analysis.opportunities}
              />

              {/* Solution Architecture Flowchart */}
              <SolutionArchitectureDiagram
                architecture={analysis.solutionArchitecture}
              />

              {/* Demo Strategy */}
              <DemoStrategyCard
                demoStrategy={analysis.demoStrategy}
                onPrepareDemo={() => setIsDemoModalOpen(true)}
              />

              {/* Outreach Angle */}
              <OutreachAngleCard
                outreachAngle={analysis.outreachAngle}
                onCopyText={handleCopyOutreachText}
              />
            </>
          )}
        </div>

        {/* Modals */}
        <AnalyzingStateModal
          isOpen={analysisStatus === "Analyzing"}
          stage={progress?.stage || "Processing business audit..."}
          percent={progress?.percent || 20}
          businessName={prospect.businessName}
        />

        {analysis && (
          <>
            <EditAnalysisModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              analysis={analysis}
              onSave={(updates) => {
                updateAnalysis(prospect.id, updates);
                showToast("Analysis updated manually.", "success");
              }}
              onAddOpportunity={(newOpp) => {
                addOpportunity(prospect.id, newOpp);
                showToast(`Added custom opportunity "${newOpp.title}".`, "success");
              }}
            />

            <AnalysisHistoryModal
              isOpen={isHistoryModalOpen}
              onClose={() => setIsHistoryModalOpen(false)}
              history={history}
              currentVersion={analysis.version}
            />

            <PrepareDemoModal
              isOpen={isDemoModalOpen}
              onClose={() => setIsDemoModalOpen(false)}
              prospect={prospect}
              readiness={analysis.readiness}
              onProceedToDemo={handleProceedToDemo}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
