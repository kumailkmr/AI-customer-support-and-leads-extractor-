import { FollowUpItem } from "@/types";

export interface ExtendedFollowUp extends FollowUpItem {
  timeCategory: "today" | "upcoming" | "completed";
  isAiSuggested: boolean;
}

export const mockFollowUps: ExtendedFollowUp[] = [
  {
    id: "fu_sarah",
    leadId: "lead_sarah",
    leadName: "Sarah Johnson",
    companyName: "Alpine Grand Hotel (Client)",
    channel: "Instagram",
    scheduledFor: "Today, 4:30 PM",
    timeCategory: "today",
    isAiSuggested: true,
    status: "pending",
    recommendedMessage: "Hi Sarah! Just checking in — we have one remaining Presidential Suite available for this weekend. Would you like me to hold it for you?",
    triggerReason: "Interested but hasn't replied",
  },
  {
    id: "fu_james",
    leadId: "lead_james",
    leadName: "James Wilson",
    companyName: "OmniLogistics (Client)",
    channel: "Website",
    scheduledFor: "Today, 5:30 PM",
    timeCategory: "today",
    isAiSuggested: true,
    status: "pending",
    recommendedMessage: "Hi James, Kumail reviewed the 12-branch multi-tenant routing terms. We've prepared a custom SLA addendum for your team.",
    triggerReason: "High-Value Enterprise Escalation",
  },
  {
    id: "fu_michael",
    leadId: "lead_michael",
    leadName: "Michael Brown",
    companyName: "PrimeCare Clinic (Client)",
    channel: "WhatsApp",
    scheduledFor: "Tomorrow, 11:00 AM",
    timeCategory: "upcoming",
    isAiSuggested: true,
    status: "pending",
    recommendedMessage: "Hello Michael, following up on your inquiry for the comprehensive health checkup package. Would you prefer a morning or afternoon slot?",
    triggerReason: "Waiting for package selection confirmation",
  },
  {
    id: "fu_david",
    leadId: "lead_david",
    leadName: "David Miller",
    companyName: "Apex Solar Commercial",
    channel: "Email",
    scheduledFor: "Thursday, 2:00 PM",
    timeCategory: "upcoming",
    isAiSuggested: true,
    status: "pending",
    recommendedMessage: "Hi David, hope the CFO review is going well. Happy to join a 10-minute clarification call on the roof analysis automation ROI.",
    triggerReason: "Proposal review check-in with board",
  },
  {
    id: "fu_emma",
    leadId: "lead_emma",
    leadName: "Emma Davis",
    companyName: "Veloce Interiors (Client)",
    channel: "Facebook",
    scheduledFor: "Yesterday, 3:00 PM",
    timeCategory: "completed",
    isAiSuggested: true,
    status: "sent",
    recommendedMessage: "Hi Emma, thank you for booking the showroom consultation! We look forward to meeting you on Friday.",
    triggerReason: "Consultation booked successfully",
  },
];
