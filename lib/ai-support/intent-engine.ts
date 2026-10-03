import { ClientLeadIntent } from "@/types/leads";

interface IntentRule {
  intent: ClientLeadIntent;
  patterns: RegExp[];
  confidence: number;
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "Admission",
    patterns: [
      /\b(admission|admissions|enroll|enrollment|school fees|prospectus|curriculum|grade \d+|standard \d+|class \d+|cbse|icse)\b/i,
    ],
    confidence: 0.94,
  },
  {
    intent: "Appointment",
    patterns: [
      /\b(doctor|clinic|consultation|appointment|checkup|test|screening|specialist|physician|opd|dentist|slot)\b/i,
    ],
    confidence: 0.92,
  },
  {
    intent: "Booking",
    patterns: [
      /\b(book|booking|room|suite|hotel|resort|stay|check-in|check-out|reservation|availability|weekend|table)\b/i,
    ],
    confidence: 0.95,
  },
  {
    intent: "Pricing Inquiry",
    patterns: [
      /\b(how much|cost|price|pricing|rate|charges|fee|discount|quote|package price|expensive)\b/i,
    ],
    confidence: 0.9,
  },
  {
    intent: "Complaint",
    patterns: [
      /\b(complaint|unhappy|bad service|refund|cancel|terrible|broken|issue|manager|not working|horrible)\b/i,
    ],
    confidence: 0.91,
  },
  {
    intent: "Demo Request",
    patterns: [
      /\b(demo|prototype|trial|walkthrough|presentation|show me|how does it work)\b/i,
    ],
    confidence: 0.88,
  },
  {
    intent: "Support",
    patterns: [
      /\b(help|support|assist|problem|trouble|status of|track|receipt|bill)\b/i,
    ],
    confidence: 0.85,
  },
  {
    intent: "Information Request",
    patterns: [
      /\b(where|location|timing|hours|open|address|direction|details|brochure|catalogue|contact number)\b/i,
    ],
    confidence: 0.86,
  },
  {
    intent: "Product Inquiry",
    patterns: [
      /\b(product|specs|model|colors|sizes|warranty|stock|inventory|material)\b/i,
    ],
    confidence: 0.84,
  },
  {
    intent: "Service Inquiry",
    patterns: [
      /\b(service|hire|contract|interior|remodel|design|cleaning|plumbing|solar|logistics)\b/i,
    ],
    confidence: 0.85,
  },
];

export function detectIntent(text: string): {
  intent: ClientLeadIntent;
  confidence: number;
  matchedKeyword?: string;
} {
  const clean = text.trim();
  if (!clean) {
    return { intent: "General Inquiry", confidence: 0.5 };
  }

  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      const match = clean.match(pattern);
      if (match) {
        return {
          intent: rule.intent,
          confidence: rule.confidence,
          matchedKeyword: match[0],
        };
      }
    }
  }

  return { intent: "Information Request", confidence: 0.65 };
}

export const classifyIntent = detectIntent;
