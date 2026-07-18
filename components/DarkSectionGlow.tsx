/**
 * Sdílené tmavé fialovo-modré pozadí (glow, hvězdy, jemné zrno) pro hero
 * sekce podstránek. Homepage Hero má vlastní nezávislou implementaci a
 * touto komponentou není ovlivněna.
 */
export function DarkSectionGlow() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 65% at 80% 20%, rgba(155,80,255,0.55) 0%, rgba(31,110,249,0.32) 42%, transparent 78%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-brand-diagonal)" }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[var(--color-accent-blue)] opacity-20 blur-3xl" />
      <div className="stars-layer" />
      <div className="noise-layer" />
    </>
  );
}
