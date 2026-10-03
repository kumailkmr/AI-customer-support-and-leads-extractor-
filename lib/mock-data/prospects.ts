import { Prospect } from "@/types";

export interface ExtendedProspect extends Prospect {
  aiOpportunity: "High" | "Medium" | "Low";
  potentialServices: string[];
}

export const mockProspects: ExtendedProspect[] = [
  {
    id: "prosp_alpine",
    businessName: "Alpine Grand Hotel",
    industry: "Hospitality",
    location: "Srinagar",
    websiteUrl: "https://alpinegrandhotel.example.com",
    socialHandles: {
      website: "https://alpinegrandhotel.example.com",
      instagram: "@alpinegrand_resort",
      whatsapp: "+91 98112 34567",
    },
    relevanceScore: 96,
    aiOpportunity: "High",
    status: "Ready",
    potentialServices: [
      "AI Customer Support (24/7 Room Inquiries)",
      "Lead Capture from Instagram Story Mentions",
      "Automated Booking & Follow-up Sequences",
    ],
    identifiedPainPoints: [
      "Losing 40% of Instagram DM inquiries due to 6-hour delay during night hours",
      "No automated weekend suite reservation triage",
    ],
    suggestedAngle: "Pitch instant 24/7 AI guest booking on Instagram & WhatsApp with zero reservation drop-off.",
  },
  {
    id: "prosp_primecare",
    businessName: "PrimeCare Clinic",
    industry: "Healthcare",
    location: "Delhi",
    websiteUrl: "https://primecareclinic.example.com",
    socialHandles: {
      website: "https://primecareclinic.example.com",
      whatsapp: "+91 98765 43210",
      email: "info@primecare.example.com",
    },
    relevanceScore: 90,
    aiOpportunity: "Medium",
    status: "Enriched",
    potentialServices: [
      "AI Patient Intake & Triage",
      "Automated WhatsApp Health Checkup Booking",
      "Follow-up Medication Reminders",
    ],
    identifiedPainPoints: [
      "Clinic front desk overwhelmed by repetitive pricing calls",
      "No automated appointment confirmation system",
    ],
    suggestedAngle: "Automate patient triage and health package bookings directly on WhatsApp.",
  },
  {
    id: "prosp_zenith",
    businessName: "Zenith Real Estate Group",
    industry: "Real Estate",
    location: "Mumbai",
    websiteUrl: "https://zenithproperties.example.com",
    socialHandles: {
      website: "https://zenithproperties.example.com",
      instagram: "@zenith_luxury_mumbai",
      facebook: "ZenithRealEstateMumbai",
      whatsapp: "+91 99887 76655",
    },
    relevanceScore: 94,
    aiOpportunity: "High",
    status: "Discovered",
    potentialServices: [
      "Automated Property Tour Scheduling",
      "Ad Lead Instant Qualification Bot",
      "High-Net-Worth Investor Verification",
    ],
    identifiedPainPoints: [
      "Facebook Lead Ads take 48 hours to be contacted by brokers",
      "High lead drop-off for luxury penthouse inquiries",
    ],
    suggestedAngle: "Deploy instant 60-second property brochure dispatch and tour scheduling AI bot.",
  },
  {
    id: "prosp_catalyst",
    businessName: "Catalyst Medical Aesthetics",
    industry: "Healthcare & Aesthetics",
    location: "Miami, FL",
    websiteUrl: "https://catalystmed.example.com",
    socialHandles: {
      website: "https://catalystmed.example.com",
      instagram: "@catalystmed",
      whatsapp: "+1 (555) 431-8900",
    },
    relevanceScore: 92,
    aiOpportunity: "High",
    status: "Ready",
    potentialServices: [
      "Showroom & Consultation Booking",
      "Instagram DM Visual Portfolio Bot",
      "Objection Handling for Cosmetic Packages",
    ],
    identifiedPainPoints: [
      "Potential clients hesitate on pricing before booking consultation",
      "No weekend triage",
    ],
    suggestedAngle: "Deploy AI objection handler and customized visual quote assistant.",
  },
];
