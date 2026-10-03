import { ClientConversation, ClientLeadIntent } from "@/types/leads";
import { detectIntent } from "./intent-engine";
import { detectObjection } from "./objection-engine";

export interface SimulatedResponseResult {
  reply: string;
  detectedIntent: ClientLeadIntent;
  shouldHandoff: boolean;
  handoffReason?: string;
  autoCaptureTriggered?: boolean;
}

export function generateSimulatedResponse(
  conversation: ClientConversation,
  clientIndustry = "General"
): SimulatedResponseResult {
  const leadMessages = conversation.messages.filter((m) => m.sender === "lead");
  if (leadMessages.length === 0) {
    return {
      reply: `Hello! Welcome to ${conversation.clientName}. How can I assist you today?`,
      detectedIntent: "General Inquiry",
      shouldHandoff: false,
    };
  }

  const lastLeadMessage = leadMessages[leadMessages.length - 1].content.trim();
  const lower = lastLeadMessage.toLowerCase();

  // 1. Human Handoff Check
  const handoffPatterns = [
    /\b(human|agent|person|representative|manager|speak to someone|real person|operator|call me)\b/i,
  ];
  for (const pat of handoffPatterns) {
    if (pat.test(lower)) {
      return {
        reply: `I understand! I'm notifying a team specialist from ${conversation.clientName} to join this conversation right away. Could you please confirm your phone number or best callback time?`,
        detectedIntent: "Support",
        shouldHandoff: true,
        handoffReason: "Visitor explicitly requested a human specialist.",
      };
    }
  }

  // 2. Objection Check
  const objection = detectObjection(lastLeadMessage);
  if (objection?.category === "Price") {
    return {
      reply: `We completely understand budget considerations. We offer flexible tiers and tailored packages designed to fit different needs. Would you like me to share our starting tier, or connect you with an advisor?`,
      detectedIntent: "Pricing Inquiry",
      shouldHandoff: false,
    };
  }

  // 3. Intent Detection
  const { intent } = detectIntent(lastLeadMessage);
  const ind = clientIndustry.toLowerCase();

  let reply = "";
  let autoCaptureTriggered = false;

  // Check if contact info was provided
  const hasPhone = /\d{10}|\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(lastLeadMessage);
  const hasEmail = /@/.test(lastLeadMessage);

  if (hasPhone || hasEmail) {
    autoCaptureTriggered = true;
    reply = `Thank you! I have recorded your contact details. Our admissions and client team at ${conversation.clientName} will reach out with the complete confirmation and answers shortly. Is there anything else you'd like to ask in the meantime?`;
  } else {
    // Contextual responses by Intent & Industry
    switch (intent) {
      case "Admission":
        if (lower.includes("fee") || lower.includes("cost") || lower.includes("how much")) {
          reply = `The tuition fee structure varies by grade and program. For Grade 1–5 it starts at ₹45,000/term, and Grade 6–10 at ₹65,000/term (including laboratory & activity fees). Which grade are you interested in for your child?`;
        } else if (lower.includes("grade") || lower.includes("class")) {
          reply = `Admissions for that grade are currently open for the upcoming term. May I have your name and WhatsApp number so our admissions coordinator can send over the digital prospectus and campus tour slots?`;
        } else {
          reply = `Welcome to admissions at ${conversation.clientName}! We offer CBSE curriculum with modern science labs and sports facilities. Which class/grade are you seeking admission for?`;
        }
        break;

      case "Booking":
        if (ind.includes("hotel") || ind.includes("resort") || ind.includes("hospitality")) {
          if (lower.includes("price") || lower.includes("rate") || lower.includes("cost")) {
            reply = `Our Deluxe Rooms start from ₹4,500/night and Executive Suites from ₹8,500/night with complimentary mountain-view breakfast included. Which dates are you planning your stay for?`;
          } else {
            reply = `We'd love to host you at ${conversation.clientName}! We have rooms available this upcoming weekend. How many guests will be staying, and would you like us to reserve a room with breakfast included?`;
          }
        } else {
          reply = `I can help arrange your booking. Could you share your preferred date and the number of attendees?`;
        }
        break;

      case "Appointment":
        if (ind.includes("health") || ind.includes("clinic") || ind.includes("doctor")) {
          reply = `Dr. Verma and our senior specialists have open consultation slots tomorrow between 10:00 AM – 2:00 PM and 4:30 PM – 7:00 PM. Would you prefer a morning or evening appointment?`;
        } else {
          reply = `We have consultation slots available this week. What day and time works best for you?`;
        }
        break;

      case "Pricing Inquiry":
        reply = `Our standard packages start from competitive rates tailored to your specific requirements. Would you like a breakdown of our most popular package, or would you prefer a quick 5-minute callback?`;
        break;

      case "Complaint":
        return {
          reply: `I sincerely apologize for the inconvenience you've experienced. I am flagging this directly for senior management at ${conversation.clientName}. May I have your contact number so our support lead can call you immediately?`,
          detectedIntent: "Complaint",
          shouldHandoff: true,
          handoffReason: "Customer raised an urgent service issue.",
        };

      case "Demo Request":
        reply = `We'd be thrilled to demonstrate our full capabilities! We can schedule a 15-minute live screen share this week. What day suits your schedule best?`;
        break;

      case "Information Request":
      default:
        reply = `Thanks for reaching out to ${conversation.clientName}! We are located centrally and open Monday through Saturday from 9:00 AM to 7:00 PM. What specific information can I help you find today?`;
        break;
    }
  }

  return {
    reply,
    detectedIntent: intent,
    shouldHandoff: false,
    autoCaptureTriggered,
  };
}
