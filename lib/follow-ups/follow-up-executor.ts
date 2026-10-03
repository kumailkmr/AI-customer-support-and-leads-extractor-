import { FollowUp, FollowUpStatus } from "./types";

export interface ExecutionResult {
  followUpId: string;
  previousStatus: FollowUpStatus;
  newStatus: FollowUpStatus;
  success: boolean;
  error?: string;
  deliveredAt: string;
  logMessage: string;
}

export function simulateExecuteFollowUp(
  followUp: FollowUp,
  forceFail: boolean = false
): { updatedFollowUp: FollowUp; result: ExecutionResult } {
  const now = new Date().toISOString();
  const previousStatus = followUp.status;

  if (forceFail || (followUp.retryCount > 0 && followUp.retryCount < 2 && Math.random() < 0.25)) {
    const errorMsg = "Simulated Gateway 504: Target channel endpoint timed out. Retry queued.";
    const updated: FollowUp = {
      ...followUp,
      status: "FAILED",
      retryCount: followUp.retryCount + 1,
      lastError: errorMsg,
      updatedAt: now,
      history: [
        ...followUp.history,
        {
          id: `h_${Date.now()}`,
          timestamp: now,
          action: `Dispatch Attempt ${followUp.retryCount + 1} Failed (Simulation)`,
          note: errorMsg,
          performedBy: "Mock Dispatcher Gateway",
        },
      ],
    };

    return {
      updatedFollowUp: updated,
      result: {
        followUpId: followUp.id,
        previousStatus,
        newStatus: "FAILED",
        success: false,
        error: errorMsg,
        deliveredAt: now,
        logMessage: `Failed to deliver ${followUp.id}: ${errorMsg}`,
      },
    };
  }

  // Success simulation
  const nextStatus: FollowUpStatus = "SENT";
  const updated: FollowUp = {
    ...followUp,
    status: nextStatus,
    sentAt: now,
    lastError: undefined,
    updatedAt: now,
    history: [
      ...followUp.history,
      {
        id: `h_${Date.now()}`,
        timestamp: now,
        action: "Simulated Dispatch Delivered",
        note: `Dispatched to ${followUp.channel.toUpperCase()} adapter in Simulation Mode. 200 OK.`,
        performedBy: "NEXUS Channel Dispatcher",
      },
    ],
  };

  return {
    updatedFollowUp: updated,
    result: {
      followUpId: followUp.id,
      previousStatus,
      newStatus: nextStatus,
      success: true,
      deliveredAt: now,
      logMessage: `Delivered follow-up ${followUp.id} to ${followUp.targetName} via ${followUp.channel}.`,
    },
  };
}

export function simulateProcessBatchQueue(
  queue: FollowUp[]
): { updatedQueue: FollowUp[]; results: ExecutionResult[] } {
  const updatedQueue: FollowUp[] = [];
  const results: ExecutionResult[] = [];

  for (const item of queue) {
    if (item.status === "DUE" || (item.status === "SCHEDULED" && item.automationMode === "AUTONOMOUS")) {
      const { updatedFollowUp, result } = simulateExecuteFollowUp(item);
      updatedQueue.push(updatedFollowUp);
      results.push(result);
    } else {
      updatedQueue.push(item);
    }
  }

  return { updatedQueue, results };
}
