import { BusinessProspect, BusinessAnalysis, AnalysisConfidence } from "@/types";
import {
  calculateReadiness,
  generateObservations,
  generateProblems,
  generateOpportunities,
  generateRecommendedServices,
  generateBusinessImpact,
  generateSolutionArchitecture,
  generateDemoStrategy,
  generateOutreachAngle,
  generateExecutiveSummary,
} from "./analysis-rules";

export interface AnalysisProgressCallback {
  (stage: string, progressPercent: number): void;
}

export interface AnalysisProvider {
  analyzeProspect(
    prospect: BusinessProspect,
    options?: {
      version?: number;
      onProgress?: AnalysisProgressCallback;
    }
  ): Promise<BusinessAnalysis>;
}

export const ANALYSIS_STAGES = [
  { label: "Reviewing business profile & contact channels...", percent: 20 },
  { label: "Auditing digital presence & inquiry friction...", percent: 40 },
  { label: "Identifying opportunity signals & hypotheses...", percent: 60 },
  { label: "Synthesizing solution architecture & NEXUS services...", percent: 80 },
  { label: "Finalizing demo strategy & outreach angle...", percent: 100 },
];

/**
 * MockAnalysisProvider
 * Simulates local AI business analysis with realistic stepped progress.
 * Architected to be replaced seamlessly by an LLMAnalysisProvider in future phases.
 */
export class MockAnalysisProvider implements AnalysisProvider {
  private stepDelayMs: number;

  constructor(stepDelayMs: number = 250) {
    this.stepDelayMs = stepDelayMs;
  }

  async analyzeProspect(
    prospect: BusinessProspect,
    options?: {
      version?: number;
      onProgress?: AnalysisProgressCallback;
    }
  ): Promise<BusinessAnalysis> {
    const version = options?.version || 1;
    const now = new Date().toISOString();

    // Staged execution simulation
    for (const stage of ANALYSIS_STAGES) {
      if (options?.onProgress) {
        options.onProgress(stage.label, stage.percent);
      }
      if (this.stepDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.stepDelayMs));
      }
    }

    // 1. Calculate readiness
    const readiness = calculateReadiness(prospect);

    // 2. Determine confidence based on research completeness
    let confidence: AnalysisConfidence = "Medium";
    if (readiness.score >= 4) {
      confidence = "High";
    } else if (readiness.score <= 1) {
      confidence = "Low";
    }

    // 3. Generate deterministic sections
    const observations = generateObservations(prospect);
    const problems = generateProblems(prospect, observations);
    const opportunities = generateOpportunities(prospect, problems);
    const recommendedServices = generateRecommendedServices(prospect, opportunities);
    const businessImpact = generateBusinessImpact();
    const solutionArchitecture = generateSolutionArchitecture(prospect);
    const demoStrategy = generateDemoStrategy(prospect);
    const outreachAngle = generateOutreachAngle(prospect);
    const executiveSummary = generateExecutiveSummary(prospect, confidence);

    const analysis: BusinessAnalysis = {
      id: `ana_${prospect.id}_v${version}`,
      prospectId: prospect.id,
      version,
      status: readiness.score <= 1 ? "Needs Review" : "Ready",
      summary: executiveSummary.summary,
      confidence,
      confidenceReason: executiveSummary.confidenceReason,
      primaryOpportunity: executiveSummary.primaryOpportunity,
      recommendedSolution: executiveSummary.recommendedSolution,
      readiness,
      observations,
      problems,
      opportunities,
      recommendedServices,
      businessImpact,
      solutionArchitecture,
      demoStrategy,
      outreachAngle,
      generatedAt: now,
      updatedAt: now,
    };

    return analysis;
  }
}

// Default singleton instance
export const defaultAnalysisProvider = new MockAnalysisProvider();
