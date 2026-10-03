import { ObjectionCategory } from "@/types/leads";
import { OBJECTION_CONFIG } from "@/lib/leads/leads-config";

interface ObjectionRule {
  category: ObjectionCategory;
  patterns: RegExp[];
}

const OBJECTION_RULES: ObjectionRule[] = [
  {
    category: "Price",
    patterns: [
      /\b(too expensive|costly|cannot afford|out of my budget|discount|cheaper|rates are high|pricey|lower price)\b/i,
    ],
  },
  {
    category: "Timing",
    patterns: [
      /\b(not now|later|next month|next quarter|busy right now|call me next year|waiting for|not ready)\b/i,
    ],
  },
  {
    category: "Trust",
    patterns: [
      /\b(is this legit|reviews|proof|guarantee|scam|references|never heard of you|trustworthy|certified)\b/i,
    ],
  },
  {
    category: "Need More Information",
    patterns: [
      /\b(need more info|confused|not clear|send details first|what is included|can you explain)\b/i,
    ],
  },
  {
    category: "Already Have Provider",
    patterns: [
      /\b(already have|using someone else|current vendor|already enrolled|booked with another|existing provider)\b/i,
    ],
  },
  {
    category: "Decision Maker",
    patterns: [
      /\b(talk to my husband|ask my wife|partner approval|boss decides|check with parents|need committee approval)\b/i,
    ],
  },
  {
    category: "Comparison",
    patterns: [
      /\b(comparing|other options|how do you compare to|competitor is offering|versus)\b/i,
    ],
  },
  {
    category: "Not Interested",
    patterns: [
      /\b(not interested|stop messaging|unsubscribe|no thanks|do not contact me|remove my number)\b/i,
    ],
  },
];

export function detectObjection(text: string): {
  category: ObjectionCategory;
  snippet: string;
  recommendedAction: string;
} | null {
  const clean = text.trim();
  if (!clean) return null;

  for (const rule of OBJECTION_RULES) {
    for (const pat of rule.patterns) {
      const match = clean.match(pat);
      if (match) {
        const config = OBJECTION_CONFIG[rule.category];
        return {
          category: rule.category,
          snippet: match[0],
          recommendedAction: config.recommendedAction,
        };
      }
    }
  }

  return null;
}
