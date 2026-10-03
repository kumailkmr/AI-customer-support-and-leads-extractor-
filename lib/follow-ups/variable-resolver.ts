import { VariableDescriptor, FollowUpTargetType } from "./types";

export const AVAILABLE_VARIABLES: VariableDescriptor[] = [
  {
    key: "lead.name",
    label: "Lead Full Name",
    example: "Sarah Johnson",
    targetScope: "LEAD",
  },
  {
    key: "lead.first_name",
    label: "Lead First Name",
    example: "Sarah",
    targetScope: "LEAD",
  },
  {
    key: "client.name",
    label: "Client Business Name",
    example: "Alpine Grand Hotel",
    targetScope: "LEAD",
  },
  {
    key: "lead.channel",
    label: "Origin Channel",
    example: "WhatsApp",
    targetScope: "LEAD",
  },
  {
    key: "lead.qualification_score",
    label: "Qualification Score",
    example: "94/100",
    targetScope: "LEAD",
  },
  {
    key: "prospect.name",
    label: "Prospect Business Name",
    example: "Srinagar Heritage Crafts",
    targetScope: "PROSPECT",
  },
  {
    key: "prospect.contact",
    label: "Prospect Contact Person",
    example: "Tariq Ahmad",
    targetScope: "PROSPECT",
  },
  {
    key: "prospect.industry",
    label: "Prospect Industry",
    example: "Luxury Hospitality",
    targetScope: "PROSPECT",
  },
  {
    key: "agent.name",
    label: "Assigned Agent / Rep",
    example: "Kumail",
    targetScope: "BOTH",
  },
  {
    key: "appointment.date",
    label: "Appointment Date",
    example: "Friday, Oct 24",
    targetScope: "BOTH",
  },
  {
    key: "appointment.time",
    label: "Appointment Time",
    example: "3:30 PM IST",
    targetScope: "BOTH",
  },
  {
    key: "demo.link",
    label: "AI Demo Preview URL",
    example: "https://nexus-ai.local/demo/p_srinagar_crafts",
    targetScope: "PROSPECT",
  },
  {
    key: "offer.expiration_date",
    label: "Offer Expiration Date",
    example: "Sunday midnight",
    targetScope: "BOTH",
  },
  {
    key: "custom.value",
    label: "Custom Parameter",
    example: "Presidential Suite",
    targetScope: "BOTH",
  },
];

export interface VariableContext {
  lead?: {
    name?: string;
    first_name?: string;
    channel?: string;
    qualification_score?: number | string;
    [key: string]: any;
  };
  client?: {
    name?: string;
    industry?: string;
    [key: string]: any;
  };
  prospect?: {
    name?: string;
    contact?: string;
    industry?: string;
    [key: string]: any;
  };
  agent?: {
    name?: string;
    email?: string;
  };
  appointment?: {
    date?: string;
    time?: string;
  };
  demo?: {
    link?: string;
  };
  offer?: {
    expiration_date?: string;
  };
  custom?: Record<string, string>;
}

export function extractTemplateVariables(template: string): string[] {
  const regex = /\{\{([a-zA-Z0-9_.]+)\}\}/g;
  const matches = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
}

export function resolveTemplateVariables(
  template: string,
  context: VariableContext,
  targetType: FollowUpTargetType = "LEAD"
): string {
  if (!template) return "";

  return template.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (_, key) => {
    const parts = key.split(".");
    if (parts.length === 2) {
      const [domain, field] = parts;
      const domainObj = (context as any)[domain];
      if (domainObj && domainObj[field] !== undefined && domainObj[field] !== null) {
        return String(domainObj[field]);
      }
    }

    // Intelligent Fallbacks
    if (key === "lead.name" || key === "lead.first_name") {
      return context.lead?.name?.split(" ")[0] || "there";
    }
    if (key === "client.name") {
      return context.client?.name || "our team";
    }
    if (key === "prospect.name") {
      return context.prospect?.name || "your team";
    }
    if (key === "prospect.contact") {
      return context.prospect?.contact || "there";
    }
    if (key === "agent.name") {
      return context.agent?.name || "The NEXUS Team";
    }
    if (key === "appointment.date") {
      return context.appointment?.date || "your upcoming scheduled time";
    }
    if (key === "appointment.time") {
      return context.appointment?.time || "today";
    }
    if (key === "demo.link") {
      return context.demo?.link || "https://nexus-ai.local/demo";
    }
    if (key === "offer.expiration_date") {
      return context.offer?.expiration_date || "this weekend";
    }

    // Keep placeholder visible if completely unmapped
    return `[${key}]`;
  });
}
