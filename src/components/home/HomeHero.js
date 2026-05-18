import HeroText from "../HeroText";

const HERO_MOBILE = "/images/collections/luxe-era-signature-set/luxe-era-signature-set-01.jpeg";
const HERO_DESKTOP = "/images/luxe_era_banner_full.jpg";

function HeroPicture({ className, alt = "", priority = false, hidden = false }) {
  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source media="(min-width: 1024px)" srcSet={HERO_DESKTOP} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_MOBILE}
        alt={hidden ? "" : alt}
        aria-hidden={hidden || undefined}
        className={className}
        sizes="100vw"
        fetchPriority={priority ? "high" : undefined}
      />
    </picture>
  );
}

export default function HomeHero() {
  return (
    <section className="relative w-full">
      <div className="hero-media-frame hero-media-frame--desktop h-[72svh] min-h-[420px] sm:h-[78svh] lg:min-h-0">
        <HeroPicture className="hero-media-ambient lg:hidden" hidden />

        <HeroPicture
          className="hero-media-sharp"
          alt="Luxe Era Signature Set — trinket tray, vase, and curated pieces"
          priority
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-16 bg-gradient-to-b from-[#f6f4f1]/90 to-transparent sm:h-20 lg:hidden"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-black/5 via-transparent to-black/60 lg:hidden"
          aria-hidden="true"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="pointer-events-auto w-full max-w-shop">
          <HeroText />
        </div>
      </div>

      <a
        href="#collections"
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/50 sm:flex lg:bottom-8"
        aria-label="Scroll to collections"
      >
        <span>Explore</span>
        <span className="block h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
      </a>
    </section>
  );
}
