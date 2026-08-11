import Image from "next/image";

type FreeLeadMagnetPreviewProps = {
  cover: string;
  inside: string;
  alt: string;
  priority?: boolean;
};

export function FreeLeadMagnetPreview({
  cover,
  inside,
  alt,
  priority = false,
}: FreeLeadMagnetPreviewProps) {
  return (
    <figure
      aria-label={alt}
      className="relative mx-auto h-[27rem] w-full max-w-[34rem] sm:h-[36rem] lg:h-[39rem]"
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[72%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,rgba(31,110,249,0.2),rgba(139,60,249,0.24))] blur-3xl"
      />
      <div className="absolute left-[5%] top-[10%] w-[58%] -rotate-[5deg] overflow-hidden rounded-[0.65rem] border border-white/80 bg-white shadow-[0_28px_65px_-26px_rgba(20,10,60,0.52)] sm:left-[8%]">
        <Image
          src={inside}
          alt=""
          width={1100}
          height={1556}
          sizes="(max-width: 640px) 55vw, (max-width: 1024px) 38vw, 27vw"
          className="h-auto w-full"
        />
      </div>
      <div className="absolute right-[4%] top-[2%] w-[62%] rotate-[3deg] overflow-hidden rounded-[0.7rem] border border-white/60 bg-white shadow-[0_35px_80px_-28px_rgba(20,10,60,0.68)] sm:right-[7%]">
        <Image
          src={cover}
          alt={alt}
          width={1100}
          height={1556}
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 42vw, 29vw"
          priority={priority}
          className="h-auto w-full"
        />
      </div>
    </figure>
  );
}
