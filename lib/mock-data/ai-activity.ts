import { AIActivityItem, AIInsight } from "@/types";

export const mockAiActivitySummary = {
  conversationsHandled: 18,
  leadsQualified: 7,
  followUpsScheduled: 11,
  escalations: 3,
};

export const mockAiActivities: AIActivityItem[] = [
  {
    id: "act_01",
    timestamp: "12 minutes ago",
    type: "lead_qualified",
    title: "7 leads qualified",
    description: "AI qualification engine scored Sarah Johnson and 6 others with >85% intent signals.",
    leadName: "Sarah Johnson",
    channel: "Instagram",
    confidenceScore: 92,
    impactTag: "AI Qualified",
  },
  {
    id: "act_02",
    timestamp: "24 minutes ago",
    type: "conversation_handled",
    title: "18 conversations handled",
    description: "Instant sub-minute inquiries resolved across WhatsApp and Instagram DM channels.",
    leadName: "Michael Brown",
    channel: "WhatsApp",
    confidenceScore: 95,
    impactTag: "Auto-Replied",
  },
  {
    id: "act_03",
    timestamp: "45 minutes ago",
    type: "follow_up_scheduled",
    title: "11 follow-ups scheduled",
    description: "Automated sequence triggered for stalled leads idle over 24 hours.",
    leadName: "Emma Davis",
    channel: "Facebook",
    confidenceScore: 89,
    impactTag: "Scheduled",
  },
  {
    id: "act_04",
    timestamp: "1 hour ago",
    type: "escalation",
    title: "3 escalations flagged",
    description: "High-value custom SLA questions routed to Kumail for manual review.",
    leadName: "James Wilson",
    channel: "WhatsApp",
    confidenceScore: 91,
    impactTag: "Human Required",
  },
];

export const mockAiInsights: AIInsight[] = [
  {
    id: "ins_01",
    title: "WhatsApp Response Velocity Advantage",
    summary: "WhatsApp conversion rate is 32% higher when AI replies within 60 seconds vs manual 15-min human response.",
    confidence: 97,
    suggestedAction: "Keep instant auto-qualification enabled on WhatsApp Tier 1 leads.",
    actionType: "adjust_pricing",
    severity: "high",
  },
  {
    id: "ins_02",
    title: "3 Stalled Hotel Leads Ready for Follow-up",
    summary: "Hospitality prospects viewed demo video over 2 times without booking consultation.",
    confidence: 89,
    suggestedAction: "Trigger AI Value Justification sequence.",
    actionType: "schedule_followup",
    severity: "medium",
  },
];
