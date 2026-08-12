import { IntegrationError } from "./integration-error";

const SYSTEME_BASE_URL = "https://api.systeme.io/api";
const LEAD_MAGNET_TAG = "Lead-magnet";

type SystemeTag = { id: number; name: string };
type SystemeContact = { id: number; email: string; tags?: SystemeTag[] };
type Collection<T> = { items: T[]; hasMore?: boolean };

export type SystemeConfig = { apiKey: string };

function hasNumberId(value: unknown): value is { id: number } {
  return Boolean(value && typeof value === "object" && typeof (value as { id?: unknown }).id === "number");
}

export function createSystemeClient(config: SystemeConfig, fetcher: typeof fetch = fetch) {
  async function request(path: string, init: RequestInit, errorCode: string): Promise<unknown> {
    let response: Response;
    try {
      response = await fetcher(`${SYSTEME_BASE_URL}${path}`, {
        ...init,
        headers: {
          accept: "application/json",
          "X-API-Key": config.apiKey,
          ...init.headers,
        },
        signal: AbortSignal.timeout(15_000),
      });
    } catch {
      throw new IntegrationError(`${errorCode}_network`);
    }

    if (!response.ok) throw new IntegrationError(errorCode, response.status);
    if (response.status === 204) return null;
    try {
      return await response.json();
    } catch {
      throw new IntegrationError(`${errorCode}_invalid_response`);
    }
  }

  async function findContact(email: string): Promise<SystemeContact | null> {
    const result = (await request(
      `/contacts?email=${encodeURIComponent(email)}&limit=10`,
      { method: "GET" },
      "systeme_contact_lookup_failed",
    )) as Collection<SystemeContact>;
    if (!result || !Array.isArray(result.items)) throw new IntegrationError("systeme_contact_lookup_invalid");
    return result.items.find((contact) => contact.email?.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async function createContact(name: string, email: string): Promise<SystemeContact> {
    const result = await request(
      "/contacts",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          locale: "cs",
          fields: [{ slug: "first_name", value: name }],
        }),
      },
      "systeme_contact_create_failed",
    );
    if (!hasNumberId(result)) throw new IntegrationError("systeme_contact_create_invalid");
    return result as SystemeContact;
  }

  async function updateFirstName(contactId: number, name: string) {
    await request(
      `/contacts/${contactId}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/merge-patch+json" },
        body: JSON.stringify({ fields: [{ slug: "first_name", value: name }] }),
      },
      "systeme_contact_update_failed",
    );
  }

  async function findExactTag(): Promise<SystemeTag> {
    const result = (await request(
      `/tags?query=${encodeURIComponent(LEAD_MAGNET_TAG)}&limit=100`,
      { method: "GET" },
      "systeme_tag_lookup_failed",
    )) as Collection<SystemeTag>;
    if (!result || !Array.isArray(result.items)) throw new IntegrationError("systeme_tag_lookup_invalid");
    const tag = result.items.find((candidate) => candidate.name === LEAD_MAGNET_TAG);
    if (!tag) throw new IntegrationError("systeme_tag_missing");
    return tag;
  }

  return {
    async upsertAndTag(name: string, email: string): Promise<"assigned" | "already-present"> {
      let contact = await findContact(email);
      if (contact) {
        await updateFirstName(contact.id, name);
      } else {
        contact = await createContact(name, email);
      }

      if (!Array.isArray(contact.tags)) throw new IntegrationError("systeme_contact_tags_missing");
      const tag = await findExactTag();
      if (contact.tags.some((existingTag) => existingTag.id === tag.id || existingTag.name === LEAD_MAGNET_TAG)) {
        return "already-present";
      }

      await request(
        `/contacts/${contact.id}/tags`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ tagId: tag.id }),
        },
        "systeme_tag_assign_failed",
      );
      return "assigned";
    },
  };
}

export type SystemeClient = ReturnType<typeof createSystemeClient>;
