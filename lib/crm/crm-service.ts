import {
  BusinessProspect,
  CrmMetrics,
  FollowUpStatus,
} from "@/types/prospects";
import { normalizePipelineStatus } from "./pipeline-config";

/**
 * Currency formatting helper (e.g. ₹35,000 or ₹4.8L)
 */
export function formatCrmCurrency(
  amount: number,
  options?: { compact?: boolean }
): string {
  if (isNaN(amount) || amount === 0) return "₹0";

  if (options?.compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}k`;
    }
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Calculates CRM Summary Metrics from active prospects
 */
export function calculateCrmMetrics(prospects: BusinessProspect[]): CrmMetrics {
  const activeTargets = prospects.filter((p) => p.isProspect);

  let activeOpportunities = 0;
  let contacted = 0;
  let replies = 0;
  let demos = 0;
  let proposals = 0;
  let won = 0;
  let pipelineValue = 0;

  activeTargets.forEach((p) => {
    const status = normalizePipelineStatus(p.status);

    if (status !== "LOST" && status !== "WON") {
      activeOpportunities++;
      pipelineValue += p.estimatedDealValue || 0;
    }

    if (
      status === "CONTACTED" ||
      status === "REPLIED" ||
      status === "DEMO" ||
      status === "PROPOSAL" ||
      status === "NEGOTIATION" ||
      status === "WON"
    ) {
      contacted++;
    }

    if (
      status === "REPLIED" ||
      status === "DEMO" ||
      status === "PROPOSAL" ||
      status === "NEGOTIATION" ||
      status === "WON"
    ) {
      replies++;
    }

    if (
      status === "DEMO" ||
      status === "PROPOSAL" ||
      status === "NEGOTIATION" ||
      status === "WON"
    ) {
      demos++;
    }

    if (status === "PROPOSAL" || status === "NEGOTIATION" || status === "WON") {
      proposals++;
    }

    if (status === "WON") {
      won++;
    }
  });

  return {
    totalProspects: activeTargets.length,
    activeOpportunities,
    contacted,
    replies,
    demos,
    proposals,
    won,
    pipelineValue,
  };
}

/**
 * Determines follow-up status relative to today
 */
export function getFollowUpStatus(dateStr?: string): FollowUpStatus {
  if (!dateStr) return "none";

  const targetDate = new Date(dateStr);
  if (isNaN(targetDate.getTime())) return "none";

  const today = new Date();
  const todayDateOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  const targetDateOnly = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  ).getTime();

  if (targetDateOnly < todayDateOnly) return "overdue";
  if (targetDateOnly === todayDateOnly) return "today";
  return "upcoming";
}

/**
 * Filter prospects
 */
export interface CrmFilterState {
  search: string;
  status: string;
  industry: string;
  opportunity: string;
  source: string;
  followUp: string;
  sortBy: string;
}

export function filterAndSortProspects(
  prospects: BusinessProspect[],
  filters: CrmFilterState
): BusinessProspect[] {
  const q = filters.search.trim().toLowerCase();

  return prospects
    .filter((p) => {
      // Must be an active prospect
      if (!p.isProspect) return false;

      // Search match across business name, industry, location, email, phone, tags, and notes
      const matchesSearch =
        !q ||
        p.businessName.toLowerCase().includes(q) ||
        p.industry.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.notes.some((n) => n.content.toLowerCase().includes(q) || n.title.toLowerCase().includes(q));

      // Status match
      const pStatusNormalized = normalizePipelineStatus(p.status);
      const filterStatusNormalized =
        filters.status === "All" ? "All" : normalizePipelineStatus(filters.status);
      const matchesStatus =
        filters.status === "All" || pStatusNormalized === filterStatusNormalized;

      // Industry match
      const matchesIndustry =
        filters.industry === "All" ||
        p.industry.toLowerCase() === filters.industry.toLowerCase();

      // Opportunity level match
      const matchesOpportunity =
        filters.opportunity === "All" ||
        p.opportunityLevel.toLowerCase() === filters.opportunity.toLowerCase();

      // Source match
      const matchesSource =
        filters.source === "All" ||
        (p.acquisitionSource &&
          p.acquisitionSource.toLowerCase() === filters.source.toLowerCase());

      // Follow-up status match
      const followUpStatus = p.followUp?.status || getFollowUpStatus(p.nextFollowUpAt);
      const matchesFollowUp =
        filters.followUp === "All" ||
        (filters.followUp === "Overdue" && followUpStatus === "overdue") ||
        (filters.followUp === "Today" && followUpStatus === "today") ||
        (filters.followUp === "Upcoming" && followUpStatus === "upcoming") ||
        (filters.followUp === "No Follow-Up" && (followUpStatus === "none" || !p.nextFollowUpAt));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesIndustry &&
        matchesOpportunity &&
        matchesSource &&
        matchesFollowUp
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "value_desc") {
        return (b.estimatedDealValue || 0) - (a.estimatedDealValue || 0);
      }
      if (filters.sortBy === "value_asc") {
        return (a.estimatedDealValue || 0) - (b.estimatedDealValue || 0);
      }
      if (filters.sortBy === "fit_desc") {
        return (b.nexusFitScore || 0) - (a.nexusFitScore || 0);
      }
      if (filters.sortBy === "name_asc") {
        return a.businessName.localeCompare(b.businessName);
      }
      if (filters.sortBy === "updated_desc") {
        return (
          new Date(b.updatedAt || b.lastActivityAt || 0).getTime() -
          new Date(a.updatedAt || a.lastActivityAt || 0).getTime()
        );
      }
      return (
        new Date(b.lastActivityAt || b.discoveredAt || 0).getTime() -
        new Date(a.lastActivityAt || a.discoveredAt || 0).getTime()
      );
    });
}

/**
 * Export prospects to CSV and trigger browser download
 */
export function exportProspectsToCsv(prospects: BusinessProspect[]): void {
  const headers = [
    "ID",
    "Business Name",
    "Industry",
    "Location",
    "Status",
    "NEXUS Opportunity",
    "Fit Score",
    "Estimated Deal Value",
    "Monthly Value",
    "Acquisition Source",
    "Website",
    "Email",
    "Phone",
    "Instagram",
    "WhatsApp",
    "Next Follow-Up",
    "Follow-Up Status",
    "Tags",
    "Last Activity",
  ];

  const rows = prospects.map((p) => {
    return [
      `"${p.id}"`,
      `"${p.businessName.replace(/"/g, '""')}"`,
      `"${p.industry.replace(/"/g, '""')}"`,
      `"${p.location.replace(/"/g, '""')}"`,
      `"${p.status}"`,
      `"${p.opportunityLevel}"`,
      p.nexusFitScore,
      p.estimatedDealValue || 0,
      p.monthlyValue || 0,
      `"${p.acquisitionSource || "Manual"}"`,
      `"${p.website || ""}"`,
      `"${p.email || ""}"`,
      `"${p.phone || ""}"`,
      `"${p.socialPresence?.instagram?.handle || ""}"`,
      `"${p.socialPresence?.whatsapp?.number || ""}"`,
      `"${p.nextFollowUpAt || ""}"`,
      `"${p.followUp?.status || getFollowUpStatus(p.nextFollowUpAt)}"`,
      `"${p.tags.join(", ")}"`,
      `"${p.lastActivity || ""}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `nexus-prospects-export-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Basic CSV Parser for Import
 */
export function parseProspectCsv(
  csvText: string
): Array<Partial<BusinessProspect>> {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim().toLowerCase());
  const results: Array<Partial<BusinessProspect>> = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // Simple regex parser for quoted CSV line
    const values: string[] = [];
    let insideQuotes = false;
    let currentVal = "";

    for (let charIdx = 0; charIdx < rawLine.length; charIdx++) {
      const char = rawLine[charIdx];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(currentVal.trim().replace(/^"|"$/g, ""));
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim().replace(/^"|"$/g, ""));

    const rowObj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      rowObj[header] = values[idx] || "";
    });

    const name =
      rowObj["business name"] || rowObj["business"] || rowObj["name"] || "";
    if (!name) continue;

    const dealVal = parseInt(
      (rowObj["deal value"] || rowObj["estimated deal value"] || "0").replace(/[^0-9]/g, ""),
      10
    );

    results.push({
      businessName: name,
      industry: rowObj["industry"] || "General",
      location: rowObj["location"] || "Remote",
      website: rowObj["website"] || "",
      email: rowObj["email"] || "",
      phone: rowObj["phone"] || "",
      status: normalizePipelineStatus(rowObj["status"] || "FOUND"),
      opportunityLevel:
        rowObj["opportunity"] === "High" || rowObj["opportunity"] === "Low"
          ? (rowObj["opportunity"] as "High" | "Low")
          : "Medium",
      estimatedDealValue: isNaN(dealVal) ? 35000 : dealVal,
    });
  }

  return results;
}
