"use client";

import HeroText from "../HeroText";

export default function HomeHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-neutral-950">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/collections/signature/sig-1.jpg"
        aria-hidden="true"
      >
        <source src="/images/banner-video.mp4" type="video/mp4" />
      </video>

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.15) 40%, rgba(10,10,10,0.75) 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end">
        <HeroText />
      </div>

      <a
        href="#collections"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/40 sm:flex"
        aria-label="Scroll to collections"
      >
        <span>Explore</span>
        <span className="block h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </a>
    </section>
  );
}
