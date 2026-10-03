import { Proposal } from "@/types";

export interface ExtendedProposal extends Omit<Proposal, "status"> {
  status: "Draft" | "Sent" | "Viewed" | "Accepted" | "Rejected";
  clientIndustry?: string;
  createdAt: string;
  lastViewedAt?: string;
}

export const mockProposals: ExtendedProposal[] = [
  {
    id: "prop_alpine",
    title: "Omnichannel Acquisition & 24/7 AI Guest Booking",
    clientName: "Farooq Ahmed",
    companyName: "Alpine Grand Hotel",
    clientIndustry: "Hospitality",
    amount: 8999,
    status: "Accepted",
    createdAt: "Jan 10, 2026",
    sentAt: "Jan 12, 2026",
    lastViewedAt: "Jan 14, 2026",
    expiresAt: "Signed",
    aiGeneratedSummary: "Full Instagram & WhatsApp AI reservation booking deployment with PMS synchronization.",
  },
  {
    id: "prop_primecare",
    title: "Healthcare Patient Intake & WhatsApp Triage Engine",
    clientName: "Dr. Ananya Verma",
    companyName: "PrimeCare Clinic",
    clientIndustry: "Healthcare",
    amount: 12500,
    status: "Sent",
    createdAt: "Jan 28, 2026",
    sentAt: "Feb 01, 2026",
    lastViewedAt: "Yesterday, 4:15 PM",
    expiresAt: "In 5 days",
    aiGeneratedSummary: "Automated WhatsApp health checkup booking, symptom intake, and reminder notifications.",
  },
  {
    id: "prop_apex",
    title: "Commercial Solar Lead Qualification Funnel",
    clientName: "David Miller",
    companyName: "Apex Solar Commercial",
    clientIndustry: "CleanTech",
    amount: 36000,
    status: "Viewed",
    createdAt: "Feb 10, 2026",
    sentAt: "Feb 12, 2026",
    lastViewedAt: "Today, 9:30 AM",
    expiresAt: "In 7 days",
    aiGeneratedSummary: "Automated roof sizing questionnaire and utility bill analysis qualification bot.",
  },
  {
    id: "prop_zenith",
    title: "Luxury Real Estate Lead Triage & Tour Scheduling",
    clientName: "Rajiv Singhania",
    companyName: "Zenith Real Estate Group",
    clientIndustry: "Real Estate",
    amount: 18000,
    status: "Draft",
    createdAt: "Feb 20, 2026",
    expiresAt: "In 14 days",
    aiGeneratedSummary: "Instant 60s Instagram & Facebook lead qualification with property walkthrough booking.",
  },
  {
    id: "prop_legacy",
    title: "Legacy Multi-Branch Cold Outreach System",
    clientName: "Arthur Pendelton",
    companyName: "Beacon Logistics",
    clientIndustry: "Logistics",
    amount: 6500,
    status: "Rejected",
    createdAt: "Dec 15, 2025",
    sentAt: "Dec 18, 2025",
    lastViewedAt: "Dec 22, 2025",
    expiresAt: "Expired",
    aiGeneratedSummary: "Single-channel email scraper replaced by modern omnichannel acquisition OS.",
  },
];
