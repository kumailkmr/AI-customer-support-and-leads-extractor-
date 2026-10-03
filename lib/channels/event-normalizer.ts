import { ChannelType, NormalizedChannelPayload } from "./types";
import { channelRegistry } from "./channel-registry";

export function normalizeRawEvent(
  channelType: ChannelType,
  rawPayload: Record<string, unknown>
): NormalizedChannelPayload {
  const provider = channelRegistry.getProvider(channelType);
  if (provider) {
    return provider.normalizeEvent(rawPayload);
  }

  // Fallback normalizer
  return {
    externalEventId: (rawPayload.id as string) || `evt_${Date.now()}`,
    externalSenderId: (rawPayload.sender_id as string) || "anonymous_user",
    senderName: (rawPayload.sender_name as string) || "Customer",
    channelType,
    text: (rawPayload.text as string) || (rawPayload.message as string) || "",
    timestamp: new Date().toISOString(),
    rawSource: `Unknown Adapter (${channelType})`,
  };
}
