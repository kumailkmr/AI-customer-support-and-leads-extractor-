import { ChatMessage, ExtractedLeadInfo, ClientLeadIntent } from "@/types/leads";
import { detectIntent } from "./intent-engine";

export function extractLeadInfo(messages: ChatMessage[]): ExtractedLeadInfo {
  let name: string | undefined;
  let email: string | undefined;
  let phone: string | undefined;
  let requestedService: string | undefined;
  let preferredDate: string | undefined;
  let detectedLeadIntent: ClientLeadIntent | undefined;

  const combinedText = messages.map((m) => m.content).join(" \n ");

  // 1. Phone extraction (international or standard local numbers)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/;
  const phoneMatch = combinedText.match(phoneRegex);
  if (phoneMatch) {
    phone = phoneMatch[0].trim();
  }

  // 2. Email extraction
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = combinedText.match(emailRegex);
  if (emailMatch) {
    email = emailMatch[0].trim();
  }

  // 3. Name extraction patterns ("My name is X", "I am X", "This is X")
  const namePatterns = [
    /(?:my name is|i am|this is|name's|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
  ];

  for (const pat of namePatterns) {
    const match = combinedText.match(pat);
    if (match && match[1]) {
      name = match[1].trim();
      break;
    }
  }

  // 4. Date extraction ("for Friday", "this weekend", "next week", "tomorrow", "on 15th")
  const datePatterns = [
    /\b(this weekend|friday|saturday|sunday|next week|tomorrow|next month|in 2 days|on \d{1,2}(?:st|nd|rd|th)?(?:\s+[A-Za-z]+)?)\b/i,
  ];
  for (const pat of datePatterns) {
    const match = combinedText.match(pat);
    if (match) {
      preferredDate = match[0].trim();
      break;
    }
  }

  // 5. Service / Interest extraction
  const servicePatterns = [
    /(?:interested in|booking for|looking for|inquire about|inquiry for|need|want)\s+([a-zA-Z0-9\s-]{4,35})(?:\.|\?|,|$)/i,
  ];
  for (const pat of servicePatterns) {
    const match = combinedText.match(pat);
    if (match && match[1]) {
      const candidate = match[1].trim();
      if (!candidate.toLowerCase().includes("someone") && !candidate.toLowerCase().includes("a person")) {
        requestedService = candidate;
        break;
      }
    }
  }

  // 6. Intent detection
  const leadMessages = messages.filter((m) => m.sender === "lead");
  if (leadMessages.length > 0) {
    const latestLeadText = leadMessages[leadMessages.length - 1].content;
    const res = detectIntent(latestLeadText);
    detectedLeadIntent = res.intent;
  }

  // Determine extraction confidence
  let confidence: "High" | "Medium" | "Low" = "Low";
  if (name && (phone || email)) {
    confidence = "High";
  } else if (name || phone || email || requestedService) {
    confidence = "Medium";
  }

  return {
    name,
    email,
    phone,
    intent: detectedLeadIntent || "Information Request",
    requestedService,
    preferredDate,
    reviewStatus: "pending",
    confidence,
  };
}
