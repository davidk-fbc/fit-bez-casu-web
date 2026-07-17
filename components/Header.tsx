import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { COMMUNITY_URL, NAV_LINKS } from "@/lib/navigation";

export function Header() {
  return (
    <header className="relative z-40 border-b border-white/[0.08] bg-[var(--color-dark)]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-60"
        style={{ background: "var(--gradient-brand)" }}
      />
      <Container className="flex items-center justify-between py-6">
        <Logo />

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-7 lg:flex xl:gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-[15px] font-semibold text-white/85 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            href={COMMUNITY_URL}
            variant="gradient"
            withArrow={false}
            className="whitespace-nowrap px-6 py-3 shadow-[0_14px_35px_-10px_rgba(139,60,249,0.75)] transition hover:scale-[1.03] lg:px-8"
          >
            Komunita Fit bez času
          </Button>
        </div>

        <MobileNavigation />
      </Container>
    </header>
  );
}
