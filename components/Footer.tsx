import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./icons";
import { COMMUNITY_URL } from "@/lib/navigation";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#", icon: <FacebookIcon className="h-4.5 w-4.5" /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon className="h-4.5 w-4.5" /> },
  { label: "YouTube", href: "#", icon: <YoutubeIcon className="h-4.5 w-4.5" /> },
  { label: "TikTok", href: "#", icon: <TiktokIcon className="h-4.5 w-4.5" /> },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[var(--color-dark)]">
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-brand-diagonal)" }}
      />
      <div className="noise-layer" />

      <Container className="relative grid gap-12 py-20 sm:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo size="footer" />
          <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Pomáháme ženám cítit se lépe ve svém těle, mít více energie a zvládnout život s lehkostí.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold leading-snug text-white">
            Malé kroky každý den = velká změna časem.
          </h3>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold leading-snug text-white">
            Už tě nebaví pořád začínat znovu?
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Přidej se ke komunitě žen, které to myslí vážně.
          </p>
          <Button href={COMMUNITY_URL} variant="gradient" withArrow={false} className="w-fit px-6 py-3">
            Vstoupit do komunity
          </Button>
        </div>
      </Container>

      <div className="relative border-t border-white/[0.08] py-6">
        <Container>
          <p className="text-xs text-[var(--color-text-on-dark-muted)]">
            © {year} Fit bez času
          </p>
        </Container>
      </div>
    </footer>
  );
}
