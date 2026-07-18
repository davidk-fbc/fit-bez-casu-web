import Image from "next/image";
import type { ReactNode } from "react";

type AboutStoryBlockProps = {
  title?: string;
  paragraphs: ReactNode[];
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
};

// Autentický dvousloupcový blok — reálná fotografie + skutečný text z
// původní stránky fitbezcasu.cz/o-nas. Žádné avatary ani vymyšlené role.
export function AboutStoryBlock({ title, paragraphs, imageSrc, imageAlt, reverse = false }: AboutStoryBlockProps) {
  return (
    <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 20rem, 90vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-5">
        {title && <h3 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">{title}</h3>}
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-[var(--color-text-muted)] sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
