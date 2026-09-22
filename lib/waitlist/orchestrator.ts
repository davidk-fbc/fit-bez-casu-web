import type { BrevoClient } from "../lead-magnets/brevo";
import type { SystemeClient } from "../lead-magnets/systeme";
import type { WaitlistSubmission } from "./validation";

/**
 * The tag that IS the waitlist. Whoever opens the 1:1 programme finds these
 * people by filtering on it, so a contact without it is not on the list at
 * all - which is why this flow fails rather than degrades.
 *
 * The app never creates it. It has to exist in Systeme.io first; a tag
 * invented here would be invisible to whoever runs the campaigns.
 */
export const COACHING_WAITLIST_TAG = "zajem-osobni-vedeni-1-1";

export type WaitlistLogger = (event: string, context: { code: string }) => void;

/**
 * WHY THIS DOES NOT BEHAVE LIKE THE LEAD-MAGNET ORCHESTRATOR
 * ----------------------------------------------------------
 * There, a failed Systeme sync is logged and swallowed, because the reader
 * still gets the PDF she came for - the marketing tag is a bonus.
 *
 * Here the tag is the entire product. Nothing is sent, nothing is
 * downloaded; the only outcome of the form is that she can be found later.
 * If the tag is missing, unreadable or cannot be assigned, she is not on any
 * list, and telling her "díky, máme tě na seznamu" would be a lie she has no
 * way of detecting - until a launch e-mail never arrives.
 *
 * So every failure throws, the route answers with an error, and she gets the
 * chance to try again.
 */
export async function orchestrateWaitlistSignup(
  submission: WaitlistSubmission,
  brevo: BrevoClient,
  systeme: SystemeClient,
  log: WaitlistLogger = (event, context) => console.error(event, context),
) {
  // Brevo first and best-effort: the contact record is useful, but it is not
  // what makes somebody a member of the list. Failing the whole sign-up over
  // the CRM would lose a person we could still have tagged.
  try {
    await brevo.upsertContact(submission.name, submission.email);
  } catch (error) {
    log("waitlist_brevo_upsert_failed", { code: error instanceof Error ? error.message : "unknown" });
  }

  // No throw is caught here on purpose - see the note above.
  const outcome = await systeme.upsertAndTag(submission.name, submission.email, COACHING_WAITLIST_TAG);

  return { listed: true, tag: outcome } as const;
}
