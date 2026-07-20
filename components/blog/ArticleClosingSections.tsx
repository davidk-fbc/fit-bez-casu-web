import type { ArticleClosingSections as ClosingSections } from "@/lib/blog/articles";

type ArticleClosingSectionsProps = {
  sections: ClosingSections;
};

type ClosingBlockProps = {
  emoji: string;
  title: string;
  lines: string[];
};

function ClosingBlock({ emoji, title, lines }: ClosingBlockProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface-muted)] p-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-[var(--color-text)]">
        <span aria-hidden="true">{emoji}</span>
        {title}
      </h3>
      {lines.length > 1 ? (
        <ul className="flex flex-col gap-1.5 pl-5 text-sm leading-relaxed text-[var(--color-text-muted)]">
          {lines.map((line, index) => (
            <li key={index} className="list-disc">
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{lines[0]}</p>
      )}
    </div>
  );
}

// Povinná závěrečná struktura každého článku: 3 praktické bloky + citace.
export function ArticleClosingSections({ sections }: ArticleClosingSectionsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 sm:grid-cols-3">
        <ClosingBlock emoji="🧠" title="Malý krok na dnešní den" lines={sections.smallStep} />
        <ClosingBlock emoji="🎯" title="Čas k zamyšlení" lines={sections.reflection} />
        <ClosingBlock emoji="📝" title="Mini úkol na večer" lines={sections.eveningTask} />
      </div>
      <blockquote className="border-l-4 border-[var(--color-accent-purple)] pl-6 text-lg font-semibold italic leading-relaxed text-[var(--color-text)]">
        <span aria-hidden="true">✨ </span>
        {sections.finalQuote}
      </blockquote>
    </div>
  );
}
