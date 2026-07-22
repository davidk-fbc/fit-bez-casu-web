import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "./icons";
import { COMMUNITY_URL } from "@/lib/navigation";
import { ConsentSettingsButton } from "@/components/consent/consent-settings-button";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61569640431106",
    icon: <FacebookIcon className="h-4.5 w-4.5" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/fitbezcasu/",
    icon: <InstagramIcon className="h-4.5 w-4.5" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@fitbezcasu",
    icon: <YoutubeIcon className="h-4.5 w-4.5" />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@fitbezcasu",
    icon: <TiktokIcon className="h-4.5 w-4.5" />,
  },
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
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo size="footer" />
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Pomáháme ženám, které mají málo času, zhubnout a cítit se lépe bez diet, zákazů a zbytečných extrémů.
          </p>
        </div>

        <div className="flex flex-col items-center gap-5 text-center">
          <h3 className="text-lg font-bold leading-snug text-white">Sleduj nás na sociálních sítích</h3>
          <div className="flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} Fit bez času`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <h3 className="text-lg font-bold leading-snug text-white">Přidej se do komunity Fit bez času</h3>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--color-text-on-dark-muted)]">
            Krátká cvičení, praktické tipy k jídlu a podpora, díky které na změnu nebudeš sama.
          </p>
          <Button href={COMMUNITY_URL} variant="gradient" withArrow={false} className="w-fit px-6 py-3">
            Přidat se ke komunitě
          </Button>
        </div>
      </Container>

      <div className="relative border-t border-white/[0.08] py-6">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-[var(--color-text-on-dark-muted)]">
            <span>© {year} Fit bez času</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://platforma.fitbezcasu.cz/obchodni-podminky"
              className="underline-offset-2 transition hover:text-white hover:underline"
            >
              Obchodní podmínky
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://platforma.fitbezcasu.cz/ochrana-osobnich-udaju"
              className="underline-offset-2 transition hover:text-white hover:underline"
            >
              Ochrana osobních údajů
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://platforma.fitbezcasu.cz/zasady-cookies"
              className="underline-offset-2 transition hover:text-white hover:underline"
            >
              Zásady cookies
            </a>
            <span aria-hidden="true">·</span>
            <ConsentSettingsButton className="underline-offset-2 transition hover:text-white hover:underline">
              Nastavení cookies
            </ConsentSettingsButton>
          </div>
        </Container>
      </div>
    </footer>
  );
}
