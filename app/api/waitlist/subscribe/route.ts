import { handleWaitlistSubscribe } from "@/lib/waitlist/handler";
import { MemoryRateLimiter } from "@/lib/lead-magnets/rate-limit";
import { subscribeToCoachingWaitlist } from "@/lib/waitlist/subscribe";

export const runtime = "nodejs";

/** Its own limiter instance: the two forms must not exhaust each other's budget. */
const limiter = new MemoryRateLimiter();

export async function POST(request: Request) {
  return handleWaitlistSubscribe(request, {
    subscribe: subscribeToCoachingWaitlist,
    limiter,
  });
}
