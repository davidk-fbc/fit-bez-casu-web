import { Button } from "../Button";
import { Container } from "../Container";
import { PlaceholderImage } from "../PlaceholderImage";
import { SectionHeading } from "../SectionHeading";
import { ForkKnifeIcon, UsersIcon } from "../icons";

export function HowWeHelp() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-muted)] py-[var(--space-section)]">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[var(--color-accent-purple)] opacity-[0.07] blur-3xl" />
      <Container className="relative grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
        <SectionHeading
          eyebrow="Naše cesty"
          title="Jak ti pomůžeme"
          description="Dvě hlavní cesty, které ti pomůžou cítit se lépe, mít víc energie a zvládat každodenní život s lehkostí."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative flex min-h-80 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)] lg:min-h-[24rem]">
            <PlaceholderImage
              label="Foto: jídelníček"
              tone="brand-purple"
              fill
              showContent={false}
              className="rounded-none"
            />
            <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white/80">
              <ForkKnifeIcon className="h-4 w-4" />
            </span>
            <div className="relative flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-white">Jídelníček</h3>
              <p className="text-sm leading-relaxed text-white/85">
                Promyšlené jídelníčky na míru, které šetří čas, zbaví tě zbytečného stresu a přinesou výsledky.
              </p>
              <Button href="#jidelnicek" variant="outline-light" className="w-fit border-white/50 bg-white/15 text-white hover:bg-white/25">
                Mrknout na jídelníček
              </Button>
            </div>
          </div>

          <div className="relative flex min-h-80 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-card)] lg:min-h-[24rem]">
            <PlaceholderImage
              label="Foto: komunita"
              tone="brand-blue"
              fill
              showContent={false}
              className="rounded-none"
            />
            <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white/80">
              <UsersIcon className="h-4 w-4" />
            </span>
            <div className="relative flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-white">Komunita</h3>
              <p className="text-sm leading-relaxed text-white/85">
                Místo podpory, motivace a sdílení. Nejsi na to sama. Společně to jde líp.
              </p>
              <Button href="#komunita" variant="outline-light" className="w-fit border-white/50 bg-white/15 text-white hover:bg-white/25">
                Přidat se ke komunitě
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
