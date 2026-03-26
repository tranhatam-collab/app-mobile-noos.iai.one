export type QueuedAsk = {
  id: string;
  createdAtMs: number;
  text: string;
  language?: string;
  delayTolerant: boolean;
  /**
   * Developer test knob: mô phỏng delay Mars latency end-to-end.
   * (UI sẽ chịu thêm delay vì noosClient đã sleep trước khi flush.)
   */
  marsLatencyMs?: number;
};

const queue: QueuedAsk[] = [];

export function enqueueAsk(item: QueuedAsk) {
  queue.unshift(item);
}

export function getQueueSize() {
  return queue.length;
}

export function clearQueue() {
  queue.splice(0, queue.length);
}

/**
 * Flush queue bằng cách gọi sendFn cho từng item.
 * - Nếu sendFn throw, item giữ lại queue.
 * - Flush chạy tuần tự để predictable evidence ordering.
 */
export async function flushQueue(
  sendFn: (item: QueuedAsk) => Promise<void>,
): Promise<{ flushed: number; remaining: number }> {
  const snapshot = [...queue];
  let flushed = 0;

  for (const item of snapshot.reverse()) {
    try {
      await sendFn(item);
      // Remove item (exact id match)
      const idx = queue.findIndex((q) => q.id === item.id);
      if (idx >= 0) queue.splice(idx, 1);
      flushed += 1;
    } catch {
      // keep remaining
    }
  }

  return { flushed, remaining: queue.length };
}

