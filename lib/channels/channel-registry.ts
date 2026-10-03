import { ChannelProvider, ChannelType, ChannelConfig } from "./types";
import { MockWebsiteProvider } from "./mock/website-provider";
import { MockInstagramProvider } from "./mock/instagram-provider";
import { MockFacebookProvider } from "./mock/facebook-provider";
import { MockWhatsAppProvider } from "./mock/whatsapp-provider";
import { MockEmailProvider } from "./mock/email-provider";

export class ChannelRegistry {
  private static instance: ChannelRegistry;
  private providers: Map<ChannelType, ChannelProvider> = new Map();

  private constructor() {
    this.registerProvider(new MockWebsiteProvider());
    this.registerProvider(new MockInstagramProvider());
    this.registerProvider(new MockFacebookProvider());
    this.registerProvider(new MockWhatsAppProvider());
    this.registerProvider(new MockEmailProvider());
  }

  public static getInstance(): ChannelRegistry {
    if (!ChannelRegistry.instance) {
      ChannelRegistry.instance = new ChannelRegistry();
    }
    return ChannelRegistry.instance;
  }

  public registerProvider(provider: ChannelProvider): void {
    this.providers.set(provider.type, provider);
  }

  public getProvider(type: ChannelType): ChannelProvider | undefined {
    return this.providers.get(type);
  }

  public hasProvider(type: ChannelType): boolean {
    return this.providers.has(type);
  }

  public getSupportedTypes(): ChannelType[] {
    return Array.from(this.providers.keys());
  }
}

export const channelRegistry = ChannelRegistry.getInstance();

export const CHANNEL_META: Record<
  ChannelType,
  {
    name: string;
    description: string;
    badgeColor: string;
    badgeBg: string;
    badgeBorder: string;
    defaultAccount: string;
    officialProviderName: string;
  }
> = {
  website: {
    name: "Website Chat",
    description: "Embeddable live chat widget on client landing pages & websites.",
    badgeColor: "text-[#2563EB]",
    badgeBg: "bg-[#EFF6FF]",
    badgeBorder: "border-[#BFDBFE]",
    defaultAccount: "widget.client.com",
    officialProviderName: "Nexus Web Client SDK",
  },
  instagram: {
    name: "Instagram Direct",
    description: "Direct message automation and story reply lead generation.",
    badgeColor: "text-[#E1306C]",
    badgeBg: "bg-[#FDF2F8]",
    badgeBorder: "border-[#FBCFE8]",
    defaultAccount: "@business_demo",
    officialProviderName: "Meta Instagram Graph API",
  },
  facebook: {
    name: "Facebook Messenger",
    description: "Official Facebook page visitor inquiries & lead captures.",
    badgeColor: "text-[#1877F2]",
    badgeBg: "bg-[#EFF6FF]",
    badgeBorder: "border-[#BFDBFE]",
    defaultAccount: "fb.me/clientpage",
    officialProviderName: "Meta Messenger Platform",
  },
  whatsapp: {
    name: "WhatsApp Cloud",
    description: "High-conversion WhatsApp chat conversations and instant follow-ups.",
    badgeColor: "text-[#10B981]",
    badgeBg: "bg-[#ECFDF5]",
    badgeBorder: "border-[#A7F3D0]",
    defaultAccount: "+1 (800) 555-0199",
    officialProviderName: "Meta WhatsApp Cloud API",
  },
  email: {
    name: "Email Relay",
    description: "Dedicated inbound & outbound client inquiry email integration.",
    badgeColor: "text-[#64748B]",
    badgeBg: "bg-[#F8FAFC]",
    badgeBorder: "border-[#E2E8F0]",
    defaultAccount: "inquiries@client.com",
    officialProviderName: "AWS SES / Postmark Relay",
  },
  phone: {
    name: "Phone / Call Log",
    description: "Manual telephone outreach logs and voice notes.",
    badgeColor: "text-[#F59E0B]",
    badgeBg: "bg-[#FFFBEB]",
    badgeBorder: "border-[#FDE68A]",
    defaultAccount: "+1 (800) 555-9999",
    officialProviderName: "Internal Telephony",
  },
  manual: {
    name: "Manual Intake",
    description: "Direct walk-ins, offline conferences, and staff-entered records.",
    badgeColor: "text-[#64748B]",
    badgeBg: "bg-[#F1F5F9]",
    badgeBorder: "border-[#CBD5E1]",
    defaultAccount: "Desk Intake",
    officialProviderName: "Manual Staff Entry",
  },
};
