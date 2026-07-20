import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  size?: "header" | "footer";
};

// Header: ~36px na mobilu, 40px od desktopového nav breakpointu (lg) — 40px
// odpovídá původní velikosti ikony, takže se výška headeru nezvětší.
// Footer: pevných ~48px, mírně větší než v Headeru, ale ne dominantní.
const SIZE_CLASSES: Record<NonNullable<LogoProps["size"]>, string> = {
  header: "h-9 w-9 lg:h-10 lg:w-10",
  footer: "h-12 w-12",
};

export function Logo({ className = "", size = "header" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <span className={`relative shrink-0 overflow-hidden rounded-full ${SIZE_CLASSES[size]}`}>
        <Image src="/images/brand/logo-fbc.png" alt="" fill sizes="48px" className="object-contain" />
      </span>
      <span className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-white">Fit bez času</span>
    </Link>
  );
}
