import { IntegrationError } from "./integration-error";

const BREVO_BASE_URL = "https://api.brevo.com/v3";

export type BrevoConfig = {
  apiKey: string;
};

export type BrevoDelivery = {
  name: string;
  email: string;
  templateId: number;
};

export function createBrevoClient(config: BrevoConfig, fetcher: typeof fetch = fetch) {
  async function request(path: string, body: unknown, errorCode: string) {
    let response: Response;
    try {
      response = await fetcher(`${BREVO_BASE_URL}${path}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": config.apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new IntegrationError(`${errorCode}_network`);
    }

    if (!response.ok) throw new IntegrationError(errorCode, response.status);
  }

  return {
    async upsertContact(name: string, email: string) {
      await request(
        "/contacts",
        {
          email,
          attributes: { FIRSTNAME: name },
          updateEnabled: true,
        },
        "brevo_contact_failed",
      );
    },

    async sendLeadMagnet(delivery: BrevoDelivery) {
      await request(
        "/smtp/email",
        {
          to: [{ email: delivery.email, name: delivery.name }],
          templateId: delivery.templateId,
          params: { name: delivery.name },
        },
        "brevo_delivery_failed",
      );
    },
  };
}

export type BrevoClient = ReturnType<typeof createBrevoClient>;
