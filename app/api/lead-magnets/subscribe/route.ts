import { fulfillLeadMagnet } from "@/lib/lead-magnets/fulfillment";
import { handleLeadMagnetSubscribe } from "@/lib/lead-magnets/handler";
import { MemoryRateLimiter } from "@/lib/lead-magnets/rate-limit";

export const runtime = "nodejs";

const limiter = new MemoryRateLimiter();

export async function POST(request: Request) {
  return handleLeadMagnetSubscribe(request, {
    fulfill: fulfillLeadMagnet,
    limiter,
  });
}
