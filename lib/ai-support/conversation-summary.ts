import { ChatMessage } from "@/types/leads";
import { detectIntent } from "./intent-engine";

export function generateConversationSummary(
  messages: ChatMessage[],
  clientName: string
): string {
  if (!messages || messages.length === 0) {
    return "No message exchange recorded yet. (AI-generated summary — simulation)";
  }

  const leadMessages = messages.filter((m) => m.sender === "lead");
  if (leadMessages.length === 0) {
    return `Inbound conversation initiated with ${clientName}. Waiting for initial customer message. (AI-generated summary — simulation)`;
  }

  const latestLeadText = leadMessages[leadMessages.length - 1].content;
  const intentResult = detectIntent(latestLeadText);

  // Determine key themes
  const combined = leadMessages.map((m) => m.content).join(" ");
  let specificContext = "";

  if (intentResult.intent === "Admission") {
    specificContext = "Lead is inquiring about school admissions, syllabus details, or fee structure.";
  } else if (intentResult.intent === "Booking") {
    specificContext = "Customer is seeking room or facility availability and reservation details.";
  } else if (intentResult.intent === "Appointment") {
    specificContext = "Patient or customer is requesting appointment slots and doctor consultation availability.";
  } else if (intentResult.intent === "Pricing Inquiry") {
    specificContext = "Customer requested pricing breakdown and package quotes.";
  } else if (intentResult.intent === "Complaint") {
    specificContext = "Customer raised an urgent service concern requiring prompt team attention.";
  } else if (intentResult.intent === "Demo Request") {
    specificContext = "Prospect requested a live product walkthrough or consultation session.";
  } else {
    specificContext = `Customer submitted an inquiry regarding services offered by ${clientName}.`;
  }

  const phoneMatch = combined.match(/\d{10}|\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const contactStatus = phoneMatch
    ? "Contact details were provided during the exchange."
    : "Direct contact details have not yet been submitted.";

  return `${specificContext} ${contactStatus} AI agent answered general questions and qualified buyer intent. (AI-generated summary — simulation)`;
}
