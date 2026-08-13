"use client";

import Link from "next/link";
import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useConsent } from "@/components/consent/consent-provider";
import { FREE_LEAD_MAGNETS, type LeadMagnetId } from "@/lib/free-lead-magnets";

type SignupContextValue = {
  open: (magnetId: LeadMagnetId, trigger: HTMLElement) => void;
};

type SubmissionState = "idle" | "loading" | "success" | "error";

const SignupContext = createContext<SignupContextValue | null>(null);

const PRIVACY_URL = "https://platforma.fitbezcasu.cz/ochrana-osobnich-udaju";

export function LeadMagnetSignupProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const consentInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [magnetId, setMagnetId] = useState<LeadMagnetId | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [consentError, setConsentError] = useState("");
  const { status: consentStatus, analytics } = useConsent();

  const magnet = useMemo(
    () => FREE_LEAD_MAGNETS.find((candidate) => candidate.id === magnetId) ?? null,
    [magnetId],
  );

  const track = useCallback(
    (
      event: "lead_magnet_open" | "lead_magnet_submit" | "lead_magnet_success",
      selectedId: LeadMagnetId,
    ) => {
      if (consentStatus === "decided" && analytics === "granted") {
        window.gtag?.("event", event, { magnet_id: selectedId });
      }
    },
    [analytics, consentStatus],
  );

  const close = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    dialogRef.current?.close();
  }, []);

  const reset = useCallback(() => {
    setMagnetId(null);
    setSubmissionState("idle");
    setErrorMessage("");
    setConsentError("");
    const trigger = triggerRef.current;
    triggerRef.current = null;
    trigger?.focus();
  }, []);

  const open = useCallback(
    (selectedId: LeadMagnetId, trigger: HTMLElement) => {
      triggerRef.current = trigger;
      setSubmissionState("idle");
      setErrorMessage("");
      setConsentError("");
      setMagnetId(selectedId);
      track("lead_magnet_open", selectedId);
    },
    [track],
  );

  useEffect(() => {
    if (magnet && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      nameInputRef.current?.focus();
    }
  }, [magnet]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!magnet) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("consent") !== "on") {
      setConsentError("Pro získání materiálu je potřeba potvrdit souhlas s e-mailovou komunikací.");
      consentInputRef.current?.focus();
      return;
    }
    setConsentError("");
    if (!form.reportValidity()) return;

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setSubmissionState("loading");
    setErrorMessage("");
    track("lead_magnet_submit", magnet.id);

    try {
      const response = await fetch("/api/lead-magnets/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          magnetId: magnet.id,
          consent: true,
          website: String(data.get("website") ?? ""),
        }),
        signal: controller.signal,
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fields?: string[];
      } | null;
      if (!response.ok || !result?.ok) {
        if (response.status === 400 && result?.fields?.includes("consent")) {
          setConsentError("Pro získání materiálu je potřeba potvrdit souhlas s e-mailovou komunikací.");
          consentInputRef.current?.focus();
          setSubmissionState("idle");
          return;
        }
        if (response.status === 429) {
          throw new Error("Zkus to prosím znovu za chvíli.");
        }
        throw new Error("PDF se teď nepodařilo odeslat. Zkus to prosím znovu.");
      }

      setSubmissionState("success");
      track("lead_magnet_success", magnet.id);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setErrorMessage(error instanceof Error ? error.message : "Něco se nepovedlo. Zkus to prosím znovu.");
      setSubmissionState("error");
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) close();
  }

  const contextValue = useMemo(() => ({ open }), [open]);

  return (
    <SignupContext.Provider value={contextValue}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={reset}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={handleBackdropClick}
        onKeyDown={(event: KeyboardEvent<HTMLDialogElement>) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        }}
        aria-labelledby="lead-magnet-dialog-title"
        aria-describedby="lead-magnet-dialog-description"
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-[1.5rem] border border-[var(--color-border-light)] bg-white p-0 text-[var(--color-text)] shadow-[0_32px_100px_-24px_rgba(5,1,16,0.72)] backdrop:bg-[#050110]/75 backdrop:backdrop-blur-sm"
      >
        {magnet ? (
          <div className="relative p-6 sm:p-9">
            <button
              type="button"
              onClick={close}
              aria-label="Zavřít formulář"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border-light)] text-2xl leading-none text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
            >
              <span aria-hidden="true">×</span>
            </button>

            <div className="flex items-start gap-4 pr-12">
              <Image
                src={magnet.preview.cover}
                alt=""
                width={72}
                height={96}
                className="h-24 w-[4.5rem] shrink-0 rounded-lg object-cover shadow-md"
              />
              <div className="min-w-0 pt-1">
                <p className="text-xs font-bold tracking-[0.16em] text-[var(--color-accent-blue)]">VYBRANÉ PDF</p>
                <p className="mt-2 text-sm font-bold leading-snug text-[var(--color-text)] sm:text-base">{magnet.title}</p>
              </div>
            </div>
            <h2 id="lead-magnet-dialog-title" className="mt-5 text-2xl font-bold leading-tight tracking-[-0.025em] sm:text-3xl">
              {submissionState === "success"
                ? "Materiál je na cestě do tvé e-mailové schránky"
                : "Kam ti máme materiál poslat?"}
            </h2>
            <p id="lead-magnet-dialog-description" className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
              {submissionState === "success"
                ? "Právě jsme ti poslali vybraný materiál na e-mail. Pokud ho během pár minut neuvidíš, zkontroluj také složku Hromadné, Promo nebo Spam."
                : "Vyplň jméno a e-mail. Pošleme ti vybraný materiál a budeš od nás dostávat také praktické tipy k hubnutí, inspiraci a nabídky Fit bez času. Z odběru se můžeš kdykoliv jednoduše odhlásit."}
            </p>

            {submissionState === "success" ? (
              <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5" role="status" aria-live="polite">
                <h3 className="text-lg font-bold text-green-900">Hotovo!</h3>
                <p className="mt-2 text-sm leading-relaxed text-green-900">
                  Materiál jsme ti právě poslali na e-mail.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-5 min-h-11 rounded-full bg-[var(--color-dark)] px-6 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-blue)]"
                >
                  Zavřít
                </button>
              </div>
            ) : (
              <form className="mt-7 space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="lead-magnet-name" className="text-sm font-semibold">Jméno</label>
                  <input
                    ref={nameInputRef}
                    id="lead-magnet-name"
                    name="name"
                    type="text"
                    autoComplete="given-name"
                    required
                    minLength={2}
                    maxLength={80}
                    className="mt-2 min-h-12 w-full rounded-xl border border-[#cbc8d6] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--color-accent-blue)] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label htmlFor="lead-magnet-email" className="text-sm font-semibold">E-mail</label>
                  <input
                    id="lead-magnet-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    className="mt-2 min-h-12 w-full rounded-xl border border-[#cbc8d6] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--color-accent-blue)] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="lead-magnet-website">Web</label>
                  <input
                    id="lead-magnet-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[var(--color-surface-muted)] p-4 text-sm leading-relaxed">
                  <input
                    ref={consentInputRef}
                    name="consent"
                    type="checkbox"
                    required
                    aria-invalid={consentError ? "true" : undefined}
                    aria-describedby={consentError ? "lead-magnet-consent-error lead-magnet-privacy-note" : "lead-magnet-privacy-note"}
                    onChange={() => setConsentError("")}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent-blue)]"
                  />
                  <span>
                    Souhlasím se zasíláním e-mailových tipů, inspirace a nabídek Fit bez času a se zpracováním svých údajů za tímto účelem. Souhlas můžu kdykoliv odvolat.
                  </span>
                </label>

                {consentError ? (
                  <p id="lead-magnet-consent-error" role="alert" className="text-sm font-medium text-red-700">
                    {consentError}
                  </p>
                ) : null}

                <p id="lead-magnet-privacy-note" className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                  Více informací najdeš v{
                  " "
                  }<Link href={PRIVACY_URL} target="_blank" rel="noreferrer" className="font-semibold text-[var(--color-accent-blue)] underline underline-offset-2">
                    Zásadách ochrany osobních údajů
                  </Link>.
                </p>

                {submissionState === "error" ? (
                  <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {errorMessage}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submissionState === "loading"}
                  className="min-h-12 w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_-15px_rgba(76,65,245,0.72)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-blue)]"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {submissionState === "loading" ? "Odesílám materiál..." : "Získat materiál zdarma"}
                </button>
              </form>
            )}
          </div>
        ) : null}
      </dialog>
    </SignupContext.Provider>
  );
}

export function useLeadMagnetSignup(): SignupContextValue {
  const context = useContext(SignupContext);
  if (!context) throw new Error("useLeadMagnetSignup must be used within LeadMagnetSignupProvider");
  return context;
}
