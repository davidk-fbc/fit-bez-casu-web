import type { BrevoClient, BrevoDelivery } from "./brevo";
import type { SystemeClient } from "./systeme";
import type { LeadMagnetSubmission } from "./validation";

export type LeadMagnetLogger = (event: string, context: { code: string; magnetId: string }) => void;

export async function orchestrateLeadMagnet(
  submission: LeadMagnetSubmission,
  templateId: BrevoDelivery["templateId"],
  brevo: BrevoClient,
  systeme: SystemeClient | null,
  log: LeadMagnetLogger = (event, context) => console.error(event, context),
) {
  await brevo.upsertContact(submission.name, submission.email);
  await brevo.sendLeadMagnet({
    name: submission.name,
    email: submission.email,
    templateId,
  });

  if (!submission.marketingConsent) return { delivered: true, marketingSynced: false } as const;
  if (!systeme) {
    log("lead_magnet_systeme_sync_failed", { code: "systeme_api_key_missing", magnetId: submission.magnetId });
    return { delivered: true, marketingSynced: false } as const;
  }

  try {
    await systeme.upsertAndTag(submission.name, submission.email);
    return { delivered: true, marketingSynced: true } as const;
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    log("lead_magnet_systeme_sync_failed", { code, magnetId: submission.magnetId });
    return { delivered: true, marketingSynced: false } as const;
  }
}
