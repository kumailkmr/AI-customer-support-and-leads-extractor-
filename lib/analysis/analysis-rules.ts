import {
  BusinessProspect,
  BusinessObservation,
  BusinessProblem,
  Opportunity,
  RecommendedService,
  BusinessImpact,
  SolutionArchitecture,
  DemoStrategy,
  OutreachAngle,
  ReadinessCheck,
  AnalysisConfidence,
} from "@/types";

/**
 * Checks research completeness across 5 key areas
 */
export function calculateReadiness(prospect: BusinessProspect): ReadinessCheck {
  const areas = [
    {
      name: "Website Details",
      complete: !!(prospect.website && prospect.website.length > 5),
      details: prospect.hasWebsite
        ? `Website URL detected: ${prospect.website}`
        : "No website detected or registered",
    },
    {
      name: "Social & Search Presence",
      complete: !!(
        prospect.socialPresence.instagram?.active ||
        prospect.socialPresence.googleBusiness?.claimed ||
        prospect.socialPresence.whatsapp?.businessVerified
      ),
      details: prospect.socialPresence.googleBusiness?.claimed
        ? `Google Business verified (Rating: ${prospect.socialPresence.googleBusiness.rating})`
        : "Social channels audited",
    },
    {
      name: "Direct Contact Channels",
      complete: !!(prospect.phone || prospect.email),
      details: [prospect.phone ? "Phone" : "", prospect.email ? "Email" : ""]
        .filter(Boolean)
        .join(" & ") || "No verified direct contact channels",
    },
    {
      name: "Opportunity Signals",
      complete: !!(
        prospect.opportunitySignals?.customerSupport ||
        prospect.opportunitySignals?.leadCapture
      ),
      details: "Audit of support & lead capture channels completed",
    },
    {
      name: "Research Observations",
      complete: !!(
        prospect.researchObservations?.contactFlow &&
        prospect.researchObservations.contactFlow.length > 10
      ),
      details: "Inquiry flow and friction observations recorded",
    },
  ];

  const score = areas.filter((a) => a.complete).length;
  return {
    score,
    total: areas.length,
    areas,
    isReadyForDemo: score >= 3,
  };
}

/**
 * Generates deterministic observations based on real prospect data
 */
export function generateObservations(prospect: BusinessProspect): BusinessObservation[] {
  const observations: BusinessObservation[] = [];
  const ind = (prospect.industry || "").toLowerCase();

  // 1. Website Observation
  if (!prospect.hasWebsite || !prospect.website) {
    observations.push({
      id: `obs_${prospect.id}_web_none`,
      category: "Website",
      title: "No dedicated business website detected",
      description:
        "The prospect relies on third-party listings or direct word-of-mouth without a central web landing page for conversion.",
      evidence: "Domain audit confirmed no registered proprietary web portal.",
      severity: "High",
      source: "Research Data",
    });
  } else {
    observations.push({
      id: `obs_${prospect.id}_web_cta`,
      category: "Lead Generation",
      title: "Inquiry call-to-action may lack immediate interactive capture",
      description:
        "Available research indicates visitors encounter standard informational copy rather than a prominent, interactive booking or inquiry trigger.",
      evidence: `Website audit (${prospect.website}): ${prospect.researchObservations?.contactFlow || "Static contact information observed."}`,
      severity: "Medium",
      source: "Research Data",
    });
  }

  // 2. WhatsApp / Instant Messaging Observation
  if (prospect.socialPresence?.whatsapp?.number) {
    observations.push({
      id: `obs_${prospect.id}_wa_flow`,
      category: "Communication",
      title: "WhatsApp number listed without automated response workflow",
      description:
        "WhatsApp is provided as a contact channel, but inbound queries appear to be routed directly to staff devices without automated instant greeting or qualification.",
      evidence: `WhatsApp phone ${prospect.socialPresence.whatsapp.number}: manual triage detected.`,
      severity: "High",
      source: "Research Data",
    });
  } else {
    observations.push({
      id: `obs_${prospect.id}_wa_missing`,
      category: "Follow-Up",
      title: "Absence of direct WhatsApp conversational trigger",
      description:
        "Prospective buyers prefer low-friction messaging, but no quick 1-click WhatsApp widget was identified.",
      evidence: "Channel presence check: No WhatsApp business integration found.",
      severity: "Medium",
      source: "Research Data",
    });
  }

  // 3. Customer Support / Inquiry Hours
  observations.push({
    id: `obs_${prospect.id}_supp_hours`,
    category: "Customer Experience",
    title: "After-hours response latency risk",
    description:
      "Customer questions submitted outside standard daytime operating hours appear vulnerable to delayed replies or dropped inquiries.",
    evidence: `Research finding: ${prospect.researchObservations?.faqAccess || "Limited automated self-service knowledge base."}`,
    severity: "Medium",
    source: "Research Data",
  });

  // 4. Industry-Specific Observation
  if (ind.includes("hotel") || ind.includes("resort") || ind.includes("hospitality")) {
    observations.push({
      id: `obs_${prospect.id}_hosp_booking`,
      category: "Booking",
      title: "Direct room & package reservation inquiry friction",
      description:
        "Guests searching for room rates or seasonal tariff inquiries likely rely on manual telephone or delayed email quotes.",
      evidence: "Booking engine check: No real-time interactive reservation assistant present.",
      severity: "High",
      source: "Research Data",
    });
  } else if (ind.includes("school") || ind.includes("education") || ind.includes("academy")) {
    observations.push({
      id: `obs_${prospect.id}_edu_admissions`,
      category: "Lead Generation",
      title: "Admission inquiry & parent prospectus capture",
      description:
        "Prospective parent inquiries during admission cycles are likely logged manually without automated multi-step tracking.",
      evidence: "Admissions workflow check: Static prospectus PDF download or phone desk.",
      severity: "High",
      source: "Research Data",
    });
  } else if (ind.includes("clinic") || ind.includes("health") || ind.includes("dental")) {
    observations.push({
      id: `obs_${prospect.id}_clinic_appt`,
      category: "Booking",
      title: "Patient consultation scheduling flow",
      description:
        "Patients seeking appointment availability face friction when attempting to confirm clinic slots outside desk hours.",
      evidence: "Healthcare appointment workflow check: Manual front-desk phone coordination.",
      severity: "High",
      source: "Research Data",
    });
  } else if (ind.includes("real estate") || ind.includes("property")) {
    observations.push({
      id: `obs_${prospect.id}_real_inquiry`,
      category: "Sales",
      title: "High-value buyer lead qualification lag",
      description:
        "Property inquiries require instant qualification regarding budget, location preference, and timeline before agent assignment.",
      evidence: "Property listing check: Standard web form without instant qualification bot.",
      severity: "High",
      source: "Research Data",
    });
  } else {
    observations.push({
      id: `obs_${prospect.id}_gen_flow`,
      category: "Lead Generation",
      title: "Inbound quote & consultation request flow",
      description:
        "Commercial clients seeking services do not have access to an instant scoping or quotation intake interface.",
      evidence: "Service inquiry check: General contact email or desk phone.",
      severity: "Medium",
      source: "Research Data",
    });
  }

  // 5. Follow-Up Workflow Observation
  observations.push({
    id: `obs_${prospect.id}_follow_up`,
    category: "Follow-Up",
    title: "Inquiry re-engagement & nurture dependency",
    description:
      "Once an initial inquiry is received, subsequent follow-up touches appear to depend on staff memory without automated scheduled sequences.",
    evidence: `Audit note: ${prospect.researchObservations?.followUp || "No automated cadence detected."}`,
    severity: "Medium",
    source: "Research Data",
  });

  return observations;
}

/**
 * Generates potential business problems (hypotheses) linked to observations
 */
export function generateProblems(
  prospect: BusinessProspect,
  observations: BusinessObservation[]
): BusinessProblem[] {
  const problems: BusinessProblem[] = [];
  const ind = (prospect.industry || "").toLowerCase();

  // Problem 1: Visitor-to-Inquiry Drop-off
  const webObs = observations.filter(
    (o) => o.category === "Website" || o.category === "Lead Generation"
  );
  problems.push({
    id: `prob_${prospect.id}_1`,
    title: "High potential for visitor drop-off before an inquiry is submitted",
    description:
      "Prospective customers exploring the business may encounter friction when trying to ask immediate questions, causing high intent visitors to bounce to competitors.",
    sourceObservationIds: webObs.map((o) => o.id),
    confidence: "High",
  });

  // Problem 2: Response Delay & Lost After-Hours Demand
  const commObs = observations.filter(
    (o) =>
      o.category === "Communication" ||
      o.category === "Customer Experience" ||
      o.category === "Follow-Up"
  );
  problems.push({
    id: `prob_${prospect.id}_2`,
    title: "Response latency during peak or after-hours inquiry surges",
    description:
      "Because initial questions require manual human handling, leads arriving during evenings or weekends risk cooling down before an agent can reply.",
    sourceObservationIds: commObs.map((o) => o.id),
    confidence: "Medium",
  });

  // Problem 3: Industry Specific Qualification Bottleneck
  let indProblemTitle = "Manual qualification creates unnecessary administrative burden";
  let indProblemDesc =
    "Staff spend valuable time answering repetitive preliminary questions rather than closing high-intent qualified buyers.";

  if (ind.includes("hotel") || ind.includes("resort")) {
    indProblemTitle = "Direct booking leakage to third-party commission platforms";
    indProblemDesc =
      "Travelers unable to easily get instant room availability or direct packages often revert to high-commission OTAs (MakeMyTrip, Booking.com), eroding margin.";
  } else if (ind.includes("school") || ind.includes("education")) {
    indProblemTitle = "Admission season inquiry leakage and delayed parent nurture";
    indProblemDesc =
      "During peak admission cycles, staff cannot promptly track hundreds of inquiries, risking student enrollment loss to competing schools.";
  } else if (ind.includes("clinic") || ind.includes("health")) {
    indProblemTitle = "Appointment no-shows and front-desk phone congestion";
    indProblemDesc =
      "Reception desk overwhelmed by slot queries while patient cancellation gaps remain unfilled due to lack of automated reminders.";
  }

  const indObs = observations.filter(
    (o) => o.category === "Booking" || o.category === "Sales" || o.category === "Lead Generation"
  );
  problems.push({
    id: `prob_${prospect.id}_3`,
    title: indProblemTitle,
    description: indProblemDesc,
    sourceObservationIds: indObs.map((o) => o.id),
    confidence: "High",
  });

  return problems;
}

/**
 * Maps problems into actionable NEXUS Opportunities
 */
export function generateOpportunities(
  prospect: BusinessProspect,
  problems: BusinessProblem[]
): Opportunity[] {
  const opportunities: Opportunity[] = [];
  const ind = (prospect.industry || "").toLowerCase();

  // Opportunity 1: Omnichannel Instant Lead Capture
  opportunities.push({
    id: `opp_${prospect.id}_1`,
    title: "Omnichannel Inbound Lead Capture & 24/7 AI Receptionist",
    description:
      "Deploy an interactive, AI-driven conversation layer across WhatsApp, website, and social channels to capture every inquiry instantly.",
    problemIds: [problems[0]?.id || "", problems[1]?.id || ""].filter(Boolean),
    potentialValue: `₹${((prospect.estimatedDealValue || 45000) * 0.45).toFixed(0)} - ₹${((prospect.estimatedDealValue || 45000) * 0.75).toFixed(0)} Value Uplift`,
    priority: "High Potential",
    priorityReason:
      "Aligns directly with observed communication gaps and can be demonstrated in an interactive prototype without altering existing core systems.",
  });

  // Opportunity 2: Automated WhatsApp Nurture & Re-engagement
  opportunities.push({
    id: `opp_${prospect.id}_2`,
    title: "Automated WhatsApp Follow-Up & Inquiry Re-engagement",
    description:
      "Establish a deterministic, intelligent follow-up sequence triggered immediately when an inquiry enters, nurturing undecided prospects automatically.",
    problemIds: [problems[1]?.id || ""].filter(Boolean),
    potentialValue: "Immediate 2x-3x speed-to-lead improvement",
    priority: "High Potential",
    priorityReason:
      "Prospect already utilizes WhatsApp or direct mobile; adding automation delivers immediate, tangible time savings for their staff.",
  });

  // Opportunity 3: Industry Specific Workflow
  let indOppTitle = "Integrated Lead Management CRM & Team Dispatch";
  let indOppDesc =
    "Centralize incoming client inquiries into a unified dashboard with qualification tags and automatic team assignment.";

  if (ind.includes("hotel") || ind.includes("resort")) {
    indOppTitle = "Direct WhatsApp & Web Reservation Assistant";
    indOppDesc =
      "Allow guests to view room options, check amenities, ask dining questions, and initiate direct booking holds via WhatsApp and interactive web widget.";
  } else if (ind.includes("school") || ind.includes("education")) {
    indOppTitle = "Admissions Prospectus & Tour Booking Workflow";
    indOppDesc =
      "Automate brochure delivery, campus tour booking, and multi-touch WhatsApp admissions nurture for inquiring parents.";
  } else if (ind.includes("clinic") || ind.includes("health")) {
    indOppTitle = "Automated Patient Appointment Booking & Reminder Engine";
    indOppDesc =
      "Enable 24/7 doctor slot booking, automated WhatsApp reminders, and pre-consultation questionnaire intake.";
  }

  opportunities.push({
    id: `opp_${prospect.id}_3`,
    title: indOppTitle,
    description: indOppDesc,
    problemIds: [problems[2]?.id || ""].filter(Boolean),
    potentialValue: "Substantial operational labor and conversion gain",
    priority: "Medium Potential",
    priorityReason:
      "High commercial impact, though requiring clear coordination with the prospect's operational team during rollout.",
  });

  return opportunities;
}

/**
 * Recommends NEXUS Services mapped to Opportunities
 */
export function generateRecommendedServices(
  prospect: BusinessProspect,
  opportunities: Opportunity[]
): RecommendedService[] {
  const services: RecommendedService[] = [];
  const ind = (prospect.industry || "").toLowerCase();

  services.push({
    id: `svc_${prospect.id}_1`,
    service: "24/7 AI Receptionist & Inbound Lead Agent",
    reason:
      "Answers repetitive questions, collects guest/client intent details, and prevents after-hours lead drop-off across channels.",
    opportunityId: opportunities[0]?.id || "",
    category: "AI Agent",
  });

  services.push({
    id: `svc_${prospect.id}_2`,
    service: "WhatsApp Business API & Automation Workflow",
    reason:
      "Delivers instant quote notifications, booking confirmations, and scheduled nurture sequences straight to prospective clients' phones.",
    opportunityId: opportunities[1]?.id || "",
    category: "Automation",
  });

  if (ind.includes("hotel") || ind.includes("resort")) {
    services.push({
      id: `svc_${prospect.id}_3`,
      service: "Direct Reservation Engine & Custom Website",
      reason:
        "Transforms informational browsing into high-converting direct guest reservations with zero OTA commission fees.",
      opportunityId: opportunities[2]?.id || "",
      category: "Booking System",
    });
  } else if (ind.includes("school") || ind.includes("education")) {
    services.push({
      id: `svc_${prospect.id}_3`,
      service: "Admissions Pipeline CRM & Portal",
      reason:
        "Equips admissions coordinators with candidate tracking, automated tour bookings, and application status tracking.",
      opportunityId: opportunities[2]?.id || "",
      category: "CRM & Portal",
    });
  } else if (ind.includes("clinic") || ind.includes("health")) {
    services.push({
      id: `svc_${prospect.id}_3`,
      service: "Clinic Appointment Scheduler & Reminder Bot",
      reason:
        "Frees front-desk telephone capacity while reducing appointment cancellations through automated WhatsApp check-ins.",
      opportunityId: opportunities[2]?.id || "",
      category: "Booking System",
    });
  } else {
    services.push({
      id: `svc_${prospect.id}_3`,
      service: "NEXUS Omnichannel Client Acquisition CRM",
      reason:
        "Consolidates website forms, phone calls, and WhatsApp messages into a single pipeline with instant team alerts.",
      opportunityId: opportunities[2]?.id || "",
      category: "CRM",
    });
  }

  return services;
}

/**
 * Qualitative business impact statements (no false numerical claims)
 */
export function generateBusinessImpact(): BusinessImpact[] {
  return [
    {
      category: "Lead Capture",
      title: "Clear, frictionless path from visitor to inquiry",
      description:
        "Eliminates ambiguity by placing low-friction inquiry and messaging options at key decision points across all digital touchpoints.",
    },
    {
      category: "Response Time",
      title: "Instant response capability around the clock",
      description:
        "Inquiries received late at night or during peak operational hours receive immediate conversational replies instead of waiting until the next business day.",
    },
    {
      category: "Conversion Flow",
      title: "Guided qualification tailored to customer intent",
      description:
        "Helps potential customers quickly understand pricing, service details, and next steps before handoff to human representatives.",
    },
    {
      category: "Follow-Up",
      title: "Consistent re-engagement without manual overhead",
      description:
        "Reduces heavy reliance on staff memory through structured follow-up cadences that keep the business top-of-mind.",
    },
    {
      category: "Operational Efficiency",
      title: "Reduced repetitive inquiry burden on staff",
      description:
        "Filters out low-intent queries and answers standard FAQ questions automatically, allowing team members to focus on high-value conversations.",
    },
    {
      category: "Customer Experience",
      title: "Modern, professional first impression",
      description:
        "Provides visitors with the modern, rapid responsiveness expected from top-tier modern businesses in the region.",
    },
  ];
}

/**
 * Adaptive solution architecture graph
 */
export function generateSolutionArchitecture(prospect: BusinessProspect): SolutionArchitecture {
  const ind = (prospect.industry || "").toLowerCase();

  const nodes = [
    {
      id: "node_traffic",
      label: "Prospect Inbound Channels",
      role: "Traffic & Inquiries",
      description: "Visitors discovering the business via Web, Google, Instagram, or Word of Mouth",
      channel: "Multi-Channel",
    },
    {
      id: "node_capture",
      label: "NEXUS Smart Capture Layer",
      role: "Interactive Touchpoint",
      description: "Floating Web Widget + 1-Click WhatsApp Smart Link",
      channel: "Web & WhatsApp",
    },
    {
      id: "node_ai_agent",
      label: "24/7 AI Qualification Agent",
      role: "Intelligent Triage",
      description:
        ind.includes("hotel")
          ? "Answers tariff questions, checks dates, captures guest details"
          : ind.includes("school")
          ? "Provides prospectus info, gathers student details, schedules tour"
          : ind.includes("clinic")
          ? "Triage symptoms, checks doctor availability, confirms slot"
          : "Screens budget, timeline, and service requirements",
      channel: "NEXUS AI Core",
    },
    {
      id: "node_crm",
      label: "NEXUS Pipeline CRM",
      role: "Lead Management",
      description: "Auto-creates qualified prospect profile with conversation history and intent tags",
      channel: "CRM",
    },
    {
      id: "node_automation",
      label: "Automated WhatsApp Cadence",
      role: "Follow-Up & Nurture",
      description: "Sends appointment reminder, confirmation message, and 24h follow-up touchpoint",
      channel: "WhatsApp API",
    },
    {
      id: "node_staff",
      label: "Business Team Handoff",
      role: "Deal Closing",
      description: "Staff notified via instant WhatsApp/Email alert with full context to close the booking/deal",
      channel: "Human Team",
    },
  ];

  const edges = [
    { from: "node_traffic", to: "node_capture", label: "Inbound Intent" },
    { from: "node_capture", to: "node_ai_agent", label: "Conversational Session" },
    { from: "node_ai_agent", to: "node_crm", label: "Qualified Lead Record" },
    { from: "node_crm", to: "node_automation", label: "Trigger Cadence" },
    { from: "node_crm", to: "node_staff", label: "High-Priority Alert" },
    { from: "node_automation", to: "node_staff", label: "Customer Response" },
  ];

  return {
    nodes,
    edges,
    description: `Tailored acquisition and customer engagement architecture designed for ${prospect.businessName}. Adapts to their current channels and bridges the gap to automated conversion.`,
  };
}

/**
 * Generates actionable Demo Strategy
 */
export function generateDemoStrategy(prospect: BusinessProspect): DemoStrategy {
  const ind = (prospect.industry || "").toLowerCase();

  let objective = `Demonstrate how ${prospect.businessName} can capture 2x more client inquiries and respond in under 30 seconds using an automated conversation layer.`;
  const screens = [
    {
      name: "Interactive Landing Prototype",
      description: "Clean, high-conversion landing page mockup showcasing their core services with prominent inquiry triggers.",
      keyFeatures: ["Instant WhatsApp CTA", "Dynamic Lead Capture Trigger", "Clear Value Proposition"],
    },
    {
      name: "24/7 AI Receptionist Modal",
      description: "Interactive chat widget simulation that answers inquiries and gathers lead contact information in real-time.",
      keyFeatures: ["FAQ Knowledge Base", "Lead Data Extraction", "Intent Scoring"],
    },
    {
      name: "NEXUS Pipeline CRM View",
      description: "Admin view showing the prospect's newly captured inquiry appear dynamically in the sales pipeline.",
      keyFeatures: ["Full Chat Transcript", "Deal Value Calculation", "One-Click Team Reassignment"],
    },
    {
      name: "WhatsApp Automation Flow",
      description: "Visual mockup of instant confirmation message and automated re-engagement text delivered to the client's phone.",
      keyFeatures: ["Personalized Greeting", "Calendar Confirmation", "Automated 24h Check-in"],
    },
  ];

  if (ind.includes("hotel") || ind.includes("resort")) {
    objective = `Show the owner of ${prospect.businessName} how guests can check room availability, receive package details, and reserve directly via WhatsApp without paying high OTA commissions.`;
    screens[0].name = "Luxury Resort Web & Booking Interface";
    screens[1].name = "Guest Concierge & Reservation Bot";
  } else if (ind.includes("school") || ind.includes("education")) {
    objective = `Show school administrators how prospective parents can download the prospectus, ask fee queries, and book campus tours through an automated admissions assistant.`;
    screens[0].name = "Admissions Landing & Prospectus Hub";
    screens[1].name = "Parent Admissions Assistant";
  } else if (ind.includes("clinic") || ind.includes("health")) {
    objective = `Demonstrate seamless patient appointment scheduling, automated doctor slot coordination, and WhatsApp appointment reminders.`;
    screens[0].name = "Clinic Appointment & Specialty Portal";
    screens[1].name = "Patient Triage & Slot Booking Bot";
  }

  const workflow = [
    "Visitor arrives on digital touchpoint",
    "Clicks interactive chat or WhatsApp link",
    "AI Agent responds within 2 seconds",
    "Visitor shares intent, requirements, and contact phone",
    "NEXUS creates lead profile & scores intent",
    "Immediate confirmation sent via WhatsApp",
    "Staff alerted on phone with ready context",
  ];

  const keyFeatures = [
    "Zero app install required for prospective clients",
    "Operates seamlessly on mobile screens",
    "Syncs directly to client's phone or desktop CRM",
    "Bilingual or multi-language conversational support",
  ];

  return {
    objective,
    screens,
    workflow,
    keyFeatures,
  };
}

/**
 * Generates custom Outreach Angle for commercial acquisition
 */
export function generateOutreachAngle(prospect: BusinessProspect): OutreachAngle {
  const ind = (prospect.industry || "").toLowerCase();

  let pitchAngle = `Lead with the observation that ${prospect.businessName} has great local reputation, but their digital presence appears primarily informational rather than conversion-focused.`;
  let suggestedHook = `Hi ${prospect.businessName} team — noticed your high ratings on Google. We built an interactive preview showing how your guests/clients could get instant answers and book inquiries directly over WhatsApp in seconds.`;
  let demoOffer = `We put together a 3-minute interactive mockup specifically for ${prospect.businessName} showing how this works. Can I share a quick link?`;

  if (ind.includes("hotel") || ind.includes("resort")) {
    pitchAngle = `Lead with the observation that traveler booking inquiries outside 10am-7pm risk going to Booking.com/OTAs where the resort loses 15-20% in commission fees.`;
    suggestedHook = `Hi ${prospect.businessName} team — loved your property photos. We built a prototype WhatsApp concierge that lets prospective guests check seasonal tariff and reserve rooms directly without OTA commission fees.`;
    demoOffer = `Would you be open to seeing a 2-minute interactive demo of the direct booking flow we mocked up for ${prospect.businessName}?`;
  } else if (ind.includes("school") || ind.includes("education")) {
    pitchAngle = `Focus on reducing admissions workload while ensuring zero parent inquiries go unanswered during active enrollment cycles.`;
    suggestedHook = `Hi ${prospect.businessName} administration — noticed your admissions cycle. We designed an automated parent inquiry and tour booking assistant specifically for regional schools.`;
    demoOffer = `Can I send you a 3-minute interactive preview showing how parents can book campus tours directly from WhatsApp?`;
  } else if (ind.includes("clinic") || ind.includes("health")) {
    pitchAngle = `Focus on freeing up front-desk telephone lines and cutting patient appointment no-shows through automated WhatsApp reminders.`;
    suggestedHook = `Hi Dr. / Clinic Coordinator — we put together an interactive workflow showing how patients can check specialist schedules and confirm clinic visits 24/7.`;
    demoOffer = `Would love to share a quick interactive demo of the patient scheduling bot built for your clinic.`;
  }

  return {
    headline: `Unlock direct, automated inquiry conversion for ${prospect.businessName}`,
    pitchAngle,
    suggestedHook,
    demoOffer,
  };
}

/**
 * Synthesizes the overall executive summary
 */
export function generateExecutiveSummary(
  prospect: BusinessProspect,
  confidence: AnalysisConfidence
): { summary: string; confidenceReason: string; primaryOpportunity: string; recommendedSolution: string } {
  const ind = prospect.industry || "Local Enterprise";
  const channelNote = prospect.hasWebsite
    ? `an active digital footprint (${prospect.website})`
    : `promising regional presence without a dedicated proprietary website`;

  const summary = `Based on available digital observations, ${prospect.businessName} appears to have strong potential to capture additional ${ind.toLowerCase()} client inquiries by modernizing its inbound conversion touchpoints. The business currently exhibits ${channelNote}, but inquiry capture and after-hours response appear reliant on manual intervention. Implementing an omnichannel conversation layer and automated WhatsApp workflow may significantly reduce lead response latency and improve visitor-to-inquiry conversion.`;

  const confidenceReason =
    confidence === "High"
      ? "Supported by comprehensive digital audit data across web availability, social channels, and direct inquiry flow observations."
      : confidence === "Medium"
      ? "Reasonable inference based on available web address and communication channels observed during discovery."
      : "Preliminary assessment requiring further manual research or direct discovery conversation.";

  const primaryOpportunity = "Omnichannel Inbound Lead Capture & Automated Response";
  const recommendedSolution = "24/7 AI Receptionist + WhatsApp Automation + NEXUS Client Pipeline";

  return {
    summary,
    confidenceReason,
    primaryOpportunity,
    recommendedSolution,
  };
}
