import {
  ChatMessage,
  ClientConversation,
  ClientLeadIntent,
  ExtractedLeadInfo,
} from "@/types/leads";
import { detectIntent } from "./intent-engine";
import { extractLeadInfo } from "./extraction-engine";
import { generateConversationSummary } from "./conversation-summary";
import {
  generateSimulatedResponse,
  SimulatedResponseResult,
} from "./response-engine";

export interface SupportAgentProvider {
  detectIntent(text: string): Promise<{ intent: ClientLeadIntent; confidence: number }>;
  generateResponse(
    conversation: ClientConversation,
    clientIndustry?: string
  ): Promise<SimulatedResponseResult>;
  extractLeadInfo(messages: ChatMessage[]): Promise<ExtractedLeadInfo>;
  summarizeConversation(
    messages: ChatMessage[],
    clientName: string
  ): Promise<string>;
}

export class MockSupportAgentProvider implements SupportAgentProvider {
  private artificialDelayMs: number;

  constructor(delayMs = 400) {
    this.artificialDelayMs = delayMs;
  }

  private async delay(): Promise<void> {
    if (this.artificialDelayMs > 0) {
      await new Promise((res) => setTimeout(res, this.artificialDelayMs));
    }
  }

  async detectIntent(text: string): Promise<{ intent: ClientLeadIntent; confidence: number }> {
    await this.delay();
    const result = detectIntent(text);
    return { intent: result.intent, confidence: result.confidence };
  }

  async generateResponse(
    conversation: ClientConversation,
    clientIndustry?: string
  ): Promise<SimulatedResponseResult> {
    await this.delay();
    return generateSimulatedResponse(conversation, clientIndustry);
  }

  async extractLeadInfo(messages: ChatMessage[]): Promise<ExtractedLeadInfo> {
    await this.delay();
    return extractLeadInfo(messages);
  }

  async summarizeConversation(
    messages: ChatMessage[],
    clientName: string
  ): Promise<string> {
    await this.delay();
    return generateConversationSummary(messages, clientName);
  }
}

export const defaultSupportAgentProvider = new MockSupportAgentProvider(300);
