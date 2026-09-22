"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

/**
 * The 1:1 coaching waitlist: a button on the card, and a dialog behind it.
 *
 * The form is not inlined in the card because the card sits in a row of
 * three of equal height - a form inside one of them would stretch the row
 * and push the other two services out of sight.
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
  "Souhlasím, aby mě Fit bez času kontaktovalo e-mailem ohledně spuštění Osobního vedení 1:1. Souhlas můžu kdykoliv odvolat.";

type Status = "idle" | "submitting" | "done" | "error";

export function CoachingWaitlistCta({ label, className }: { label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    nameRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    // Reset only once it is out of sight, so the closing frame does not
    // flash the form back over a thank-you she has just read.
    setStatus("idle");
    setFieldError("");
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
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${className ?? ""}`}
      >
        {label}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
          >
            {status === "done" ? (
              <>
                <h2 id={titleId} className="text-xl font-bold text-[var(--color-text)]">
                  Osobní vedení 1:1
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
                  Osobní vedení 1:1
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
                <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
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
        </div>
      ) : null}
    </>
  );
}
