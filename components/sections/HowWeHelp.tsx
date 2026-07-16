import { Button } from "../Button";
import { Container } from "../Container";
import { PlaceholderImage } from "../PlaceholderImage";
import { SectionHeading } from "../SectionHeading";
import { ForkKnifeIcon, UsersIcon } from "../icons";

export function HowWeHelp() {
  return (
    <section className="bg-[var(--color-surface-muted)] py-[var(--space-section)]">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-14">
        <SectionHeading
          eyebrow="Naše cesty"
          title="Jak ti pomůžeme"
          description="Dvě hlavní cesty, které ti pomůžou cítit se lépe, mít víc energie a zvládat každodenní život s lehkostí."
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="relative flex min-h-72 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-6">
            <PlaceholderImage
              label="Foto: jídelníček"
              tone="brand-purple"
              icon={<ForkKnifeIcon className="h-full w-full" />}
              fill
              className="rounded-none"
            />
            <div className="relative flex flex-col gap-3">
              <h3 className="text-xl font-bold text-white">Jídelníček</h3>
              <p className="text-sm leading-relaxed text-white/85">
                Promyšlené jídelníčky na míru, které šetří čas, zbaví tě zbytečného stresu a přinesou výsledky.
              </p>
              <Button href="#jidelnicek" variant="outline-light" className="w-fit border-white/40 bg-white/10 text-white hover:bg-white/20">
                Mrknout na jídelníček
              </Button>
            </div>
          </div>

          <div className="relative flex min-h-72 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-6">
            <PlaceholderImage
              label="Foto: komunita"
              tone="brand-blue"
              icon={<UsersIcon className="h-full w-full" />}
              fill
              className="rounded-none"
            />
            <div className="relative flex flex-col gap-3">
              <h3 className="text-xl font-bold text-white">Komunita</h3>
              <p className="text-sm leading-relaxed text-white/85">
                Místo podpory, motivace a sdílení. Nejsi na to sama. Společně to jde líp.
              </p>
              <Button href="#komunita" variant="outline-light" className="w-fit border-white/40 bg-white/10 text-white hover:bg-white/20">
                Přidat se ke komunitě
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
