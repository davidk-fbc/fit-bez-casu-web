"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

/**
 * The coaching waitlist: a button on the card, and a dialog behind it.
 *
 * WHY THIS IS A NATIVE <dialog> AND NOT A DIV
 * -------------------------------------------
 * The first version was `<div class="fixed inset-0">` rendered where the
 * button sits - inside the card. It looked right until the pointer was over
 * the card, and then it was wrong in two ways at once.
 *
 * The card carries `hover:-translate-y-1 transition duration-200`. A
 * transform other than `none` makes an element the containing block for its
 * `position: fixed` descendants, so while the card was hovered - which it
 * always is, a moment after clicking a button inside it - `inset: 0` meant
 * the card's bounds, not the viewport's. The overlay shrank into the card.
 *
 * The flicker came from the same property being animated. Moving the pointer
 * or scrolling toggled the hover transform on and off, and each toggle
 * created or destroyed the containing block, so the overlay snapped between
 * card-sized and viewport-sized over and over.
 *
 * `showModal()` puts the dialog in the browser's top layer, outside the
 * normal stacking and containing-block hierarchy entirely. No ancestor
 * transform, overflow or z-index can reach it - which is a stronger fix than
 * a portal to document.body, because a portal only escapes the DOM subtree
 * and would still be subject to whatever the new parent does. It also brings
 * the focus trap, the inert background and ::backdrop for free.
 *
 * This is the same primitive components/free-resources/LeadMagnetSignupProvider.tsx
 * already uses; the class list below is deliberately its one.
 *
 * WHAT A FAILURE MEANS HERE
 * -------------------------
 * The only outcome of this form is that she can be found later by a tag in
 * Systeme.io. If that tag cannot be assigned, she is on no list at all, so
 * the error state is shown rather than a thank-you - see
 * lib/waitlist/orchestrator.ts. A cheerful confirmation would be a promise
 * broken at launch, months later, invisibly.
 */

const PRIVACY_URL = "https://fittalir.fitbezcasu.cz/ochrana-osobnich-udaju";

const CONSENT_TEXT =
  "Souhlasím, aby mě Fit bez času kontaktovalo e-mailem ohledně spuštění Osobního vedení. Souhlas můžu kdykoliv odvolat.";

type Status = "idle" | "submitting" | "done" | "error";

export function CoachingWaitlistCta({ label, className }: { label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  // showModal() rather than the `open` attribute: only the former reaches the
  // top layer, and only the top layer is immune to the card's transform.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      nameRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  /**
   * showModal() makes the page behind inert, but does not stop it scrolling
   * in every browser. The cleanup restores whatever the page had before,
   * including when the component unmounts while still open.
   */
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function close() {
    setOpen(false);
    setStatus("idle");
    setFieldError("");
    // Back to the button she came from, not to the top of the document.
    triggerRef.current?.focus();
  }

  /**
   * A click lands on the dialog itself only when it hits the backdrop, since
   * anything inside is a child. The rectangle check is the second half: a
   * click on the dialog's own padding is still inside the window and must
   * not close it.
   */
  function onDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (!inside) close();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("consent") !== "on") {
      setFieldError("Bez souhlasu ti nemůžeme dát vědět.");
      return;
    }

    setStatus("submitting");
    setFieldError("");

    try {
      const response = await fetch("/api/waitlist/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          consent: true,
          website: String(data.get("website") ?? "")
        })
      });

      if (response.ok) {
        setStatus("done");
        return;
      }

      const result = (await response.json().catch(() => null)) as { fields?: string[] } | null;

      if (response.status === 400 && result?.fields?.length) {
        setStatus("idle");
        setFieldError(
          result.fields.includes("email") ? "Zkontroluj prosím e-mail." : "Zkontroluj prosím vyplněné údaje."
        );
        return;
      }

      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className ?? ""}`}
      >
        {label}
      </button>

      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClose={close}
        onCancel={(event) => {
          // Escape reaches the dialog as `cancel`; going through close()
          // keeps the React state in step with the element.
          event.preventDefault();
          close();
        }}
        onClick={onDialogClick}
        onKeyDown={(event: KeyboardEvent<HTMLDialogElement>) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-[1.5rem] border border-[var(--color-border-light)] bg-white p-0 text-[var(--color-text)] shadow-[0_32px_100px_-24px_rgba(5,1,16,0.72)] backdrop:bg-[#050110]/75 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 sm:p-8">
          {status === "done" ? (
            <>
              <h2 id={titleId} className="text-xl font-bold text-[var(--color-text)]">
                Osobní vedení
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Díky, máme tě na seznamu. Ozveme se ti, až otevřeme první místa.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-accent-blue)] px-5 text-sm font-bold text-white"
              >
                Zavřít
              </button>
            </>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <h2 id={titleId} className="text-xl font-bold text-[var(--color-text)]">
                Osobní vedení
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Dáme ti vědět, až otevřeme první místa.
              </p>

              <label className="mt-5 block text-sm font-semibold text-[var(--color-text)]" htmlFor="waitlist-name">
                Jméno
              </label>
              <input
                ref={nameRef}
                id="waitlist-name"
                name="name"
                type="text"
                required
                autoComplete="given-name"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-sm"
              />

              <label className="mt-4 block text-sm font-semibold text-[var(--color-text)]" htmlFor="waitlist-email">
                E-mail
              </label>
              <input
                id="waitlist-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-sm"
              />

              {/* Honeypot: off-screen rather than display:none, which some bots skip. */}
              <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="waitlist-website">Web</label>
                <input id="waitlist-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-[var(--color-text-muted)]">
                <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {CONSENT_TEXT}{" "}
                  <Link
                    href={PRIVACY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[var(--color-accent-blue)] underline underline-offset-2"
                  >
                    Zásady ochrany osobních údajů
                  </Link>
                </span>
              </label>

              {fieldError ? (
                <p role="alert" className="mt-3 text-xs font-semibold text-[var(--color-text-danger,#b91c1c)]">
                  {fieldError}
                </p>
              ) : null}

              {status === "error" ? (
                <p role="alert" className="mt-3 text-xs font-semibold text-[var(--color-text-danger,#b91c1c)]">
                  Zápis se nepodařil. Zkus to prosím ještě jednou.
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[var(--color-accent-blue)] px-5 text-sm font-bold text-white disabled:opacity-60"
              >
                {status === "submitting" ? "Odesíláme…" : "Chci vědět, až otevřete místa"}
              </button>

              <button
                type="button"
                onClick={close}
                className="mt-3 w-full text-xs font-semibold text-[var(--color-text-muted)] underline underline-offset-2"
              >
                Zavřít
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
