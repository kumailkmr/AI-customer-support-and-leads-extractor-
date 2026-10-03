import {
  ClientLeadStatus,
  ClientLeadChannel,
  ClientLeadIntent,
  QualificationStatus,
  ObjectionCategory,
  QualificationCriterion,
} from "@/types/leads";

export interface StatusConfigItem {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  description: string;
}

export const LEAD_STATUS_CONFIG: Record<ClientLeadStatus, StatusConfigItem> = {
  NEW: {
    label: "New",
    badgeBg: "bg-[#EFF6FF]",
    badgeText: "text-[#2563EB]",
    badgeBorder: "border-[#BFDBFE]",
    dotColor: "bg-[#2563EB]",
    description: "Inbound visitor initiated chat; lead newly registered",
  },
  CONTACTED: {
    label: "Contacted",
    badgeBg: "bg-[#F1F5F9]",
    badgeText: "text-[#475569]",
    badgeBorder: "border-[#CBD5E1]",
    dotColor: "bg-[#64748B]",
    description: "Initial message exchange confirmed",
  },
  QUALIFYING: {
    label: "Qualifying",
    badgeBg: "bg-[#F5F3FF]",
    badgeText: "text-[#7C3AED]",
    badgeBorder: "border-[#DDD6FE]",
    dotColor: "bg-[#8B5CF6]",
    description: "AI triage gathering requirements & budget criteria",
  },
  QUALIFIED: {
    label: "Qualified",
    badgeBg: "bg-[#ECFDF5]",
    badgeText: "text-[#047857]",
    badgeBorder: "border-[#A7F3D0]",
    dotColor: "bg-[#10B981]",
    description: "Met configured criteria; ready for booking or human agent",
  },
  FOLLOW_UP: {
    label: "Follow-Up",
    badgeBg: "bg-[#FFFBEB]",
    badgeText: "text-[#B45309]",
    badgeBorder: "border-[#FDE68A]",
    dotColor: "bg-[#F59E0B]",
    description: "Automated or scheduled check-in pending response",
  },
  HUMAN_HANDOFF: {
    label: "Human Handoff",
    badgeBg: "bg-[#FEF2F2]",
    badgeText: "text-[#B91C1C]",
    badgeBorder: "border-[#FECACA]",
    dotColor: "bg-[#EF4444]",
    description: "Escalated for immediate team takeover",
  },
  CONVERTED: {
    label: "Converted",
    badgeBg: "bg-[#ECFDF5]",
    badgeText: "text-[#065F46]",
    badgeBorder: "border-[#6EE7B7]",
    dotColor: "bg-[#059669]",
    description: "Customer booked appointment, enrolled, or purchased",
  },
  NOT_INTERESTED: {
    label: "Not Interested",
    badgeBg: "bg-[#F8FAFC]",
    badgeText: "text-[#64748B]",
    badgeBorder: "border-[#E2E8F0]",
    dotColor: "bg-[#94A3B8]",
    description: "Inquired but declined further communication",
  },
  LOST: {
    label: "Lost",
    badgeBg: "bg-[#FEF2F2]",
    badgeText: "text-[#991B1B]",
    badgeBorder: "border-[#FCA5A5]",
    dotColor: "bg-[#DC2626]",
    description: "Drop-off or competitor chosen",
  },
};

export interface ChannelConfigItem {
  label: string;
  iconName: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  statusLabel: string;
  description: string;
}

export const LEAD_CHANNEL_CONFIG: Record<ClientLeadChannel, ChannelConfigItem> = {
  "Website Chat": {
    label: "Website Chat",
    iconName: "RiGlobalLine",
    accentColor: "#2563EB",
    badgeBg: "bg-[#EFF6FF]",
    badgeBorder: "border-[#BFDBFE]",
    badgeText: "text-[#1D4ED8]",
    statusLabel: "Simulated Web Widget",
    description: "Live on-site embedded chat trigger with real-time AI triage",
  },
  Instagram: {
    label: "Instagram DM",
    iconName: "RiInstagramLine",
    accentColor: "#E1306C",
    badgeBg: "bg-[#FDF2F8]",
    badgeBorder: "border-[#FBCFE8]",
    badgeText: "text-[#BE185D]",
    statusLabel: "Simulated Direct Message",
    description: "Instagram direct messaging lead capture simulation",
  },
  Facebook: {
    label: "Facebook Messenger",
    iconName: "RiFacebookCircleLine",
    accentColor: "#1877F2",
    badgeBg: "bg-[#EFF6FF]",
    badgeBorder: "border-[#DBEAFE]",
    badgeText: "text-[#1E40AF]",
    statusLabel: "Simulated Messenger",
    description: "Page inbox response simulation with automatic lead profiling",
  },
  WhatsApp: {
    label: "WhatsApp Business",
    iconName: "RiWhatsappLine",
    accentColor: "#10B981",
    badgeBg: "bg-[#ECFDF5]",
    badgeBorder: "border-[#A7F3D0]",
    badgeText: "text-[#047857]",
    statusLabel: "Simulated WhatsApp",
    description: "Official WhatsApp Cloud API simulation for instant triage",
  },
  Email: {
    label: "Inbound Email",
    iconName: "RiMailLine",
    accentColor: "#64748B",
    badgeBg: "bg-[#F8FAFC]",
    badgeBorder: "border-[#E2E8F0]",
    badgeText: "text-[#334155]",
    statusLabel: "Simulated Inbound Email",
    description: "Automated email parsing and structured lead extraction",
  },
  Phone: {
    label: "Phone / Call Log",
    iconName: "RiPhoneLine",
    accentColor: "#D97706",
    badgeBg: "bg-[#FFFBEB]",
    badgeBorder: "border-[#FDE68A]",
    badgeText: "text-[#92400E]",
    statusLabel: "Manual Intake Call",
    description: "Phone inquiry notes logged by reception desk",
  },
  Manual: {
    label: "Manual Entry",
    iconName: "RiUserSharedLine",
    accentColor: "#475569",
    badgeBg: "bg-[#F1F5F9]",
    badgeBorder: "border-[#CBD5E1]",
    badgeText: "text-[#1E293B]",
    statusLabel: "Staff CRM Entry",
    description: "Direct walk-in or manual team creation",
  },
};

export const LEAD_INTENT_LABELS: Record<ClientLeadIntent, { label: string; badge: string }> = {
  "Information Request": { label: "Information Request", badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" },
  "Pricing Inquiry": { label: "Pricing Inquiry", badge: "bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]" },
  Booking: { label: "Room / Table Booking", badge: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]" },
  Appointment: { label: "Doctor Appointment", badge: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]" },
  Admission: { label: "School Admission", badge: "bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]" },
  "Product Inquiry": { label: "Product Details", badge: "bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]" },
  "Service Inquiry": { label: "Service Request", badge: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]" },
  Support: { label: "Customer Support", badge: "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]" },
  Complaint: { label: "Escalated Complaint", badge: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]" },
  "Demo Request": { label: "Consultation / Demo", badge: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]" },
  "General Inquiry": { label: "General Inquiry", badge: "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]" },
  Other: { label: "Other", badge: "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]" },
};

export const QUALIFICATION_STATUS_CONFIG: Record<
  QualificationStatus,
  { label: string; badgeBg: string; badgeText: string; badgeBorder: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    badgeBg: "bg-[#F8FAFC]",
    badgeText: "text-[#64748B]",
    badgeBorder: "border-[#E2E8F0]",
  },
  IN_PROGRESS: {
    label: "In Progress",
    badgeBg: "bg-[#FFFBEB]",
    badgeText: "text-[#B45309]",
    badgeBorder: "border-[#FDE68A]",
  },
  QUALIFIED: {
    label: "Qualified",
    badgeBg: "bg-[#ECFDF5]",
    badgeText: "text-[#047857]",
    badgeBorder: "border-[#A7F3D0]",
  },
  NOT_QUALIFIED: {
    label: "Not Qualified",
    badgeBg: "bg-[#FEF2F2]",
    badgeText: "text-[#991B1B]",
    badgeBorder: "border-[#FECACA]",
  },
  NEEDS_HUMAN_REVIEW: {
    label: "Needs Review",
    badgeBg: "bg-[#F5F3FF]",
    badgeText: "text-[#6D28D9]",
    badgeBorder: "border-[#DDD6FE]",
  },
};

export const DEFAULT_QUALIFICATION_CRITERIA: Omit<QualificationCriterion, "value" | "notes">[] = [
  {
    id: "need_identified",
    label: "Need Identified",
    description: "Clear requirement or specific problem stated by the prospect",
  },
  {
    id: "budget_discussed",
    label: "Budget Range Discussed",
    description: "Customer acknowledged pricing, package tier, or budget willingness",
  },
  {
    id: "timeline_known",
    label: "Timeline / Date Known",
    description: "Date of booking, enrollment term, or urgency confirmed",
  },
  {
    id: "decision_maker",
    label: "Decision Maker",
    description: "Primary buyer or authorized authority engaged in dialogue",
  },
  {
    id: "service_fit",
    label: "Service Fit",
    description: "Client offers the exact service or capacity requested",
  },
  {
    id: "contact_available",
    label: "Contact Information Available",
    description: "Valid phone number, email, or verified messaging identity confirmed",
  },
];

export const OBJECTION_CONFIG: Record<
  ObjectionCategory,
  { label: string; description: string; recommendedAction: string }
> = {
  Price: {
    label: "Price Concern",
    description: "Customer perceives pricing as steep or inquired about discounts",
    recommendedAction: "Provide payment plan options, emphasize ROI, or route to human agent for custom package",
  },
  Timing: {
    label: "Timing / Delay",
    description: "Not ready to purchase immediately; delayed decision timeframe",
    recommendedAction: "Schedule a non-intrusive 7-day follow-up with relevant case study",
  },
  Trust: {
    label: "Trust & Credibility",
    description: "Customer looking for reviews, guarantees, or safety assurances",
    recommendedAction: "Share verifiable Google reviews, customer testimonials, and accreditation credentials",
  },
  "Need More Information": {
    label: "Information Gap",
    description: "Customer has unanswered questions regarding inclusions or syllabus",
    recommendedAction: "Deliver digital brochure/prospectus or trigger AI deep-dive answer",
  },
  "Already Have Provider": {
    label: "Existing Alternative",
    description: "Customer currently utilizing a competitor or incumbent solution",
    recommendedAction: "Highlight key differentiators, faster response times, and premium support",
  },
  "Not Interested": {
    label: "Not Interested",
    description: "Clear disinterest or misaligned inquiry",
    recommendedAction: "Mark status as NOT_INTERESTED and cease automated outbound messages",
  },
  "Decision Maker": {
    label: "Requires Stakeholder Approval",
    description: "Needs spouse, parent, or partner sign-off before committing",
    recommendedAction: "Offer shareable summary sheet or joint consultation call slot",
  },
  Comparison: {
    label: "Comparing Competitors",
    description: "Customer actively evaluating other options in the market",
    recommendedAction: "Provide transparent comparison sheet focusing on service quality & reliability",
  },
  Other: {
    label: "General Concern",
    description: "Unclassified hesitation requiring context-aware review",
    recommendedAction: "Flag for internal team review",
  },
};
