import {
  QualificationCriterion,
  QualificationStatus,
  QualificationValue,
} from "@/types/leads";
import { DEFAULT_QUALIFICATION_CRITERIA } from "@/lib/leads/leads-config";

export function initializeQualificationCriteria(): QualificationCriterion[] {
  return DEFAULT_QUALIFICATION_CRITERIA.map((item) => ({
    ...item,
    value: "Unknown" as QualificationValue,
  }));
}

export function evaluateQualification(criteria: QualificationCriterion[]): {
  score: number;
  status: QualificationStatus;
  progressPercent: number;
  confirmedCount: number;
  totalCount: number;
} {
  const totalCount = criteria.length;
  if (totalCount === 0) {
    return {
      score: 0,
      status: "NOT_STARTED",
      progressPercent: 0,
      confirmedCount: 0,
      totalCount: 0,
    };
  }

  let confirmedCount = 0;
  let disqualifiedCount = 0;
  let answeredCount = 0;

  criteria.forEach((c) => {
    if (c.value === "Yes") {
      confirmedCount++;
      answeredCount++;
    } else if (c.value === "No") {
      disqualifiedCount++;
      answeredCount++;
    } else if (c.value === "Not Applicable") {
      answeredCount++;
    }
  });

  const progressPercent = Math.round((answeredCount / totalCount) * 100);
  const score = Math.round((confirmedCount / totalCount) * 100);

  let status: QualificationStatus = "NOT_STARTED";

  if (disqualifiedCount >= 2) {
    status = "NOT_QUALIFIED";
  } else if (confirmedCount >= 4 && answeredCount >= 5) {
    status = "QUALIFIED";
  } else if (answeredCount > 0) {
    status = "IN_PROGRESS";
  }

  return {
    score,
    status,
    progressPercent,
    confirmedCount,
    totalCount,
  };
}
