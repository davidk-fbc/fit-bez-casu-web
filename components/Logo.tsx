import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden="true">
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-accent-blue)" />
            <stop offset="1" stopColor="var(--color-accent-purple)" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="17.5" fill="none" stroke="url(#logo-gradient)" strokeWidth="3" />
        <path
          d="M20 10v10l6 4"
          fill="none"
          stroke="url(#logo-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="whitespace-nowrap text-lg font-bold text-white">Fit bez času</span>
    </Link>
  );
}
