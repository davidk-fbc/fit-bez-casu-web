import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { COMMUNITY_URL, NAV_LINKS } from "@/lib/navigation";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "TikTok", href: "#" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border-dark)] bg-[var(--color-dark)]">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Pomáháme ženám cítit se lépe ve svém těle, mít více energie a zvládnout život s lehkostí.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Sleduj nás</h3>
          <ul className="flex flex-col gap-2.5">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="text-sm text-[var(--color-text-on-dark-muted)] transition hover:text-white"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Rychlé odkazy</h3>
          <ul className="flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-[var(--color-text-on-dark-muted)] transition hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white">Přidej se do komunity</h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Buď první, kdo získá nové tipy, články a speciální nabídky.
          </p>
          <Button href={COMMUNITY_URL} variant="gradient" withArrow={false} className="w-fit">
            Vstoupit do komunity
          </Button>
        </div>
      </Container>

      <div className="border-t border-[var(--color-border-dark)] py-6">
        <Container>
          <p className="text-xs text-[var(--color-text-on-dark-muted)]">
            © {year} Fit bez času
          </p>
        </Container>
      </div>
    </footer>
  );
}
