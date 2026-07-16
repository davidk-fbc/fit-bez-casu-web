import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { COMMUNITY_URL, NAV_LINKS } from "@/lib/navigation";

export function Header() {
  return (
    <header className="relative z-50 border-b border-[var(--color-border-dark)] bg-[var(--color-dark)]">
      <Container className="flex items-center justify-between py-4">
        <Logo />

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-4 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm font-medium text-white/85 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href={COMMUNITY_URL} variant="gradient" withArrow={false} className="whitespace-nowrap px-4 lg:px-6">
            Komunita Fit bez času
          </Button>
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
