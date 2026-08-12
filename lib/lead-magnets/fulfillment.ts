import "server-only";

import { createBrevoClient } from "./brevo";
import { getMagnetTemplateId, readIntegrationEnvironment } from "./server-config";
import { orchestrateLeadMagnet } from "./orchestrator";
import { createSystemeClient } from "./systeme";
import type { LeadMagnetSubmission } from "./validation";

export async function fulfillLeadMagnet(submission: LeadMagnetSubmission) {
  const environment = readIntegrationEnvironment();
  const templateId = getMagnetTemplateId(submission.magnetId);
  const brevo = createBrevoClient({ apiKey: environment.brevoApiKey });
  const systeme = environment.systemeApiKey
    ? createSystemeClient({ apiKey: environment.systemeApiKey })
    : null;
  return orchestrateLeadMagnet(submission, templateId, brevo, systeme);
}
