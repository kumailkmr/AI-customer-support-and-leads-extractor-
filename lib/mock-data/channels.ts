import { ChannelPerformance } from "@/types";

export const mockChannels: ChannelPerformance[] = [
  {
    channel: "Instagram",
    totalConversations: 62,
    qualifiedLeads: 24,
    conversionRate: 38.7,
    activeAutomations: 6,
    status: "connected",
    unreadCount: 4,
  },
  {
    channel: "WhatsApp",
    totalConversations: 51,
    qualifiedLeads: 21,
    conversionRate: 41.2,
    activeAutomations: 8,
    status: "connected",
    unreadCount: 3,
  },
  {
    channel: "Facebook",
    totalConversations: 34,
    qualifiedLeads: 11,
    conversionRate: 32.4,
    activeAutomations: 3,
    status: "connected",
    unreadCount: 1,
  },
  {
    channel: "Website",
    totalConversations: 28,
    qualifiedLeads: 9,
    conversionRate: 32.1,
    activeAutomations: 4,
    status: "connected",
    unreadCount: 2,
  },
  {
    channel: "Email",
    totalConversations: 14,
    qualifiedLeads: 6,
    conversionRate: 42.8,
    activeAutomations: 5,
    status: "connected",
    unreadCount: 1,
  },
];
