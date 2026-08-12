"use client";

import { ArrowRightIcon } from "@/components/icons";
import { useLeadMagnetSignup } from "@/components/free-resources/LeadMagnetSignupProvider";
import type { LeadMagnetId } from "@/lib/free-lead-magnets";

type FreeLeadMagnetCtaProps = {
  magnetId: LeadMagnetId;
  label: string;
  describedBy: string;
};

const classes =
  "min-h-11 justify-center px-7 py-3.5 text-center text-[15px] shadow-[0_16px_36px_-15px_rgba(76,65,245,0.72)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-blue)] sm:justify-start";

export function FreeLeadMagnetCta({
  magnetId,
  label,
  describedBy,
}: FreeLeadMagnetCtaProps) {
  const { open } = useLeadMagnetSignup();

  return (
    <button
      type="button"
      onClick={(event) => open(magnetId, event.currentTarget)}
      aria-describedby={describedBy}
      data-lead-magnet-id={magnetId}
      className={`${classes} inline-flex items-center gap-2 rounded-full text-sm font-semibold text-white transition hover:brightness-110`}
      style={{ background: "var(--gradient-brand)" }}
    >
      {label}
      <ArrowRightIcon className="h-4 w-4" />
    </button>
  );
}
