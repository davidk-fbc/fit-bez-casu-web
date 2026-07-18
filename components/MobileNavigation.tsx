"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { CloseIcon, MenuIcon } from "./icons";
import { COMMUNITY_URL, NAV_LINKS } from "@/lib/navigation";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Zavřít menu" : "Otevřít menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-dark)] text-white"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-50 border-t border-[var(--color-border-dark)] bg-[var(--color-dark)] px-6 pb-8 pt-4 shadow-2xl"
        >
          <nav aria-label="Hlavní navigace" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/5 py-3.5 text-base font-medium text-white/90"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button href={COMMUNITY_URL} variant="gradient" className="mt-5 w-full justify-center">
            Komunita Fit bez času
          </Button>
        </div>
      )}
    </div>
  );
}
