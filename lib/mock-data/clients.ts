import { Client } from "@/types";

export interface ExtendedClient extends Client {
  services: string[];
  totalDeals: number;
}

export const mockClients: ExtendedClient[] = [
  {
    id: "cl_alpine",
    companyName: "Alpine Grand Hotel",
    primaryContact: "Farooq Ahmed",
    contactEmail: "reservations@alpinegrandhotel.example.com",
    plan: "Growth OS + 24/7 AI Agents",
    monthlyRevenue: 8999,
    acquisitionChannel: "Instagram",
    onboardingStatus: "complete",
    healthScore: 98,
    signedAt: "Jan 14, 2026",
    totalDeals: 42,
    services: [
      "AI Customer Support",
      "Lead Management",
      "Automated Follow-ups",
    ],
  },
  {
    id: "cl_primecare",
    companyName: "PrimeCare Clinic",
    primaryContact: "Dr. Ananya Verma",
    contactEmail: "admin@primecareclinic.example.com",
    plan: "Healthcare Acquisition OS",
    monthlyRevenue: 12500,
    acquisitionChannel: "WhatsApp",
    onboardingStatus: "in_progress",
    healthScore: 92,
    signedAt: "Feb 02, 2026",
    totalDeals: 18,
    services: [
      "Patient Intake Triage",
      "WhatsApp Health Packages",
      "Automated Reminders",
    ],
  },
  {
    id: "cl_veloce",
    companyName: "Veloce Interiors",
    primaryContact: "Elena Rostova",
    contactEmail: "elena@veloce.example.com",
    plan: "Omnichannel Growth Suite",
    monthlyRevenue: 15000,
    acquisitionChannel: "Facebook",
    onboardingStatus: "complete",
    healthScore: 95,
    signedAt: "Jan 28, 2026",
    totalDeals: 29,
    services: [
      "Consultation Scheduler",
      "Portfolio DM Bot",
      "Objection Handling",
    ],
  },
  {
    id: "cl_omni",
    companyName: "OmniLogistics Group",
    primaryContact: "Marcus Vance",
    contactEmail: "m.vance@omnilogistics.example.com",
    plan: "Enterprise Acquisition Tier",
    monthlyRevenue: 24000,
    acquisitionChannel: "Website",
    onboardingStatus: "complete",
    healthScore: 96,
    signedAt: "Jan 05, 2026",
    totalDeals: 64,
    services: [
      "Freight Routing API",
      "24/7 Dispatch Bot",
      "Multi-tenant Triage",
    ],
  },
  {
    id: "cl_apex",
    companyName: "Apex Solar Commercial",
    primaryContact: "David Miller",
    contactEmail: "david@apexsolar.example.com",
    plan: "CleanTech Funnel OS",
    monthlyRevenue: 9500,
    acquisitionChannel: "Email",
    onboardingStatus: "pending",
    healthScore: 84,
    signedAt: "Feb 18, 2026",
    totalDeals: 8,
    services: [
      "Roof Analysis Funnel",
      "Utility Bill AI Triage",
      "CRM Sync",
    ],
  },
];
