export type RateLimitRule = {
  prefix: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

type Entry = { count: number; resetAt: number };

export class MemoryRateLimiter {
  private readonly entries = new Map<string, Entry>();
  private checks = 0;

  check(rules: readonly RateLimitRule[], now = Date.now()): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
    this.checks += 1;
    if (this.checks % 100 === 0) this.cleanup(now);

    let longestRetryMs = 0;
    for (const rule of rules) {
      const key = `${rule.prefix}:${rule.identifier}`;
      const current = this.entries.get(key);
      if (current && current.resetAt > now && current.count >= rule.limit) {
        longestRetryMs = Math.max(longestRetryMs, current.resetAt - now);
      }
    }

    if (longestRetryMs > 0) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(longestRetryMs / 1000)) };
    }

    for (const rule of rules) {
      const key = `${rule.prefix}:${rule.identifier}`;
      const current = this.entries.get(key);
      if (!current || current.resetAt <= now) {
        this.entries.set(key, { count: 1, resetAt: now + rule.windowMs });
      } else {
        current.count += 1;
      }
    }

    return { allowed: true };
  }

  reset() {
    this.entries.clear();
    this.checks = 0;
  }

  private cleanup(now: number) {
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(key);
    }
  }
}
