import "server-only";

import { createBrevoClient } from "../lead-magnets/brevo";
import { IntegrationError } from "../lead-magnets/integration-error";
import { createSystemeClient } from "../lead-magnets/systeme";
import { orchestrateWaitlistSignup } from "./orchestrator";
import type { WaitlistSubmission } from "./validation";

/**
 * Wires the waitlist to the two services it uses, from the same environment
 * variables the lead magnets already read.
 *
 * Unlike fulfillLeadMagnet, a missing SYSTEME_IO_API_KEY is fatal here
 * rather than a `null` client: without Systeme.io there is no list to join,
 * and the sign-up would be a form that stores nothing while saying it
 * worked.
 */
export async function subscribeToCoachingWaitlist(submission: WaitlistSubmission) {
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const systemeApiKey = process.env.SYSTEME_IO_API_KEY?.trim();

  if (!systemeApiKey) throw new IntegrationError("systeme_api_key_missing");
  if (!brevoApiKey) throw new IntegrationError("brevo_api_key_missing");

  return orchestrateWaitlistSignup(
    submission,
    createBrevoClient({ apiKey: brevoApiKey }),
    createSystemeClient({ apiKey: systemeApiKey }),
  );
}
