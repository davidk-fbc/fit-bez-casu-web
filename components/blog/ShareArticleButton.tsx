"use client";

import { useState, useSyncExternalStore } from "react";
import { FacebookIcon, LinkedInIcon, ShareIcon, WhatsappIcon } from "../icons";

type ShareStatus = "idle" | "copied" | "error";

const LABELS: Record<ShareStatus, string> = {
  idle: "Sdílet článek",
  copied: "Odkaz zkopírován",
  error: "Odkaz se nepodařilo zkopírovat",
};

// Shared layout, size and focus-visible treatment - identical to before,
// unrelated to which network a link is for. Only background/border/icon
// color are network-specific (see SOCIAL_ICON_VARIANT below).
const SOCIAL_ICON_BASE =
  "flex h-9 w-9 items-center justify-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-purple)]";

// Very light per-network tint (~8% background, ~20% border) so the 3
// icons are distinguishable at a glance without competing with the main
// gradient button - hover only turns the same tint slightly stronger,
// never a color swap.
const SOCIAL_ICON_VARIANT = {
  facebook: "border-[#1877F2]/20 bg-[#1877F2]/8 text-[#1877F2] hover:border-[#1877F2]/35 hover:bg-[#1877F2]/14",
  linkedin: "border-[#0A66C2]/20 bg-[#0A66C2]/8 text-[#0A66C2] hover:border-[#0A66C2]/35 hover:bg-[#0A66C2]/14",
  whatsapp: "border-[#25D366]/20 bg-[#25D366]/8 text-[#25D366] hover:border-[#25D366]/35 hover:bg-[#25D366]/14",
};

// The current page URL never changes for the lifetime of this component
// (a new article page is a fresh mount), so there is nothing to subscribe
// to - this no-op subscribe is exactly what useSyncExternalStore expects
// for a one-shot external read.
function subscribeToNothing() {
  return () => {};
}

function getPageUrl() {
  return window.location.href;
}

function getServerPageUrl() {
  return "";
}

// The only interactive piece of the article's share box - kept as its own
// small client component so the surrounding ArticleContent stays a server
// component. The main button always reads the page's own current URL at
// click time (never a hardcoded domain), so it matches whatever the
// visitor is actually on - including preview links. The secondary social
// links need a real href up front (for target="_blank"/right-click/copy-
// link) rather than only at click time, so `pageUrl` is read via
// useSyncExternalStore - React's own SSR-safe way to read an external,
// browser-only value: it renders the empty getServerPageUrl() during SSR
// and the initial client render (so server and client output match, no
// hydration mismatch), then switches to the real window.location.href
// right after mount without a manual effect + setState.
export function ShareArticleButton({ articleTitle }: { articleTitle: string }) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const pageUrl = useSyncExternalStore(subscribeToNothing, getPageUrl, getServerPageUrl);

  async function handleShare() {
    const url = window.location.href;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: articleTitle, url });
      } catch {
        // User closed the native share sheet or it failed - do nothing,
        // no error, no clipboard fallback.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2500);
  }

  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${articleTitle} ${pageUrl}`)}`;

  return (
    <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
      <button
        type="button"
        onClick={handleShare}
        aria-live="polite"
        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(139,60,249,0.6)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-purple)] sm:w-auto"
        style={{ background: "var(--gradient-brand)" }}
      >
        <ShareIcon className="h-4 w-4" />
        {LABELS[status]}
      </button>

      <div className="flex items-center gap-2">
        <a href={facebookHref} target="_blank" rel="noopener noreferrer" aria-label="Sdílet na Facebooku" className={`${SOCIAL_ICON_BASE} ${SOCIAL_ICON_VARIANT.facebook}`}>
          <FacebookIcon className="h-4 w-4" />
        </a>
        <a href={linkedInHref} target="_blank" rel="noopener noreferrer" aria-label="Sdílet na LinkedIn" className={`${SOCIAL_ICON_BASE} ${SOCIAL_ICON_VARIANT.linkedin}`}>
          <LinkedInIcon className="h-4 w-4" />
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Sdílet přes WhatsApp" className={`${SOCIAL_ICON_BASE} ${SOCIAL_ICON_VARIANT.whatsapp}`}>
          <WhatsappIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
