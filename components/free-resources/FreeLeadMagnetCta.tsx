import { Button } from "@/components/Button";
import { ArrowRightIcon } from "@/components/icons";

type FreeLeadMagnetCtaProps = {
  configKey: string;
  label: string;
  url: string | null;
  describedBy: string;
};

const classes =
  "min-h-11 justify-center px-7 py-3.5 text-center text-[15px] shadow-[0_16px_36px_-15px_rgba(76,65,245,0.72)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent-blue)] sm:justify-start";

export function FreeLeadMagnetCta({
  configKey,
  label,
  url,
  describedBy,
}: FreeLeadMagnetCtaProps) {
  if (url) {
    return (
      <Button href={url} aria-describedby={describedBy} variant="gradient" className={classes}>
        {label}
      </Button>
    );
  }

  return (
    <button
      type="button"
      disabled
      aria-describedby={describedBy}
      data-cta-config-key={configKey}
      className={`${classes} inline-flex cursor-default items-center gap-2 rounded-full text-sm font-semibold text-white`}
      style={{ background: "var(--gradient-brand)" }}
    >
      {label}
      <ArrowRightIcon className="h-4 w-4" />
    </button>
  );
}
