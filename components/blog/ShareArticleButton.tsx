"use client";

import { useState } from "react";
import { ShareIcon } from "../icons";

type ShareStatus = "idle" | "copied" | "error";

const LABELS: Record<ShareStatus, string> = {
  idle: "Sdílet článek",
  copied: "Odkaz zkopírován",
  error: "Odkaz se nepodařilo zkopírovat",
};

// The only interactive piece of the article's share box - kept as its own
// small client component so the surrounding ArticleContent stays a server
// component. Always reads the page's own current URL at click time (never
// a hardcoded domain), so it matches whatever the visitor is actually on -
// including preview links.
export function ShareArticleButton({ articleTitle }: { articleTitle: string }) {
  const [status, setStatus] = useState<ShareStatus>("idle");

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

  return (
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
  );
}
