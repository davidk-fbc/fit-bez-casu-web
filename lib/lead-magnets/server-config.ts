import "server-only";

import type { LeadMagnetId } from "../free-lead-magnets";
import { IntegrationError } from "./integration-error";

type MagnetServerConfig = {
  templateEnv: string;
};

const SERVER_CONFIG: Record<LeadMagnetId, MagnetServerConfig> = {
  "quick-meals": {
    templateEnv: "BREVO_LEAD_MAGNET_QUICK_MEALS_TEMPLATE_ID",
  },
  "evening-cravings": {
    templateEnv: "BREVO_LEAD_MAGNET_EVENING_CRAVINGS_TEMPLATE_ID",
  },
  "shopping-guide": {
    templateEnv: "BREVO_LEAD_MAGNET_SHOPPING_GUIDE_TEMPLATE_ID",
  },
  "diet-mistakes": {
    templateEnv: "BREVO_LEAD_MAGNET_DIET_MISTAKES_TEMPLATE_ID",
  },
};

export function readIntegrationEnvironment() {
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const systemeApiKey = process.env.SYSTEME_IO_API_KEY?.trim();
  if (!brevoApiKey) throw new IntegrationError("brevo_api_key_missing");
  return { brevoApiKey, systemeApiKey: systemeApiKey || null };
}

export function getMagnetTemplateId(magnetId: LeadMagnetId) {
  const config = SERVER_CONFIG[magnetId];
  const templateId = Number.parseInt(process.env[config.templateEnv] ?? "", 10);
  if (!Number.isSafeInteger(templateId) || templateId <= 0) {
    throw new IntegrationError("brevo_template_id_missing");
  }

  return templateId;
}
