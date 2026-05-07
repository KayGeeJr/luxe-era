"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

function LazyVideo({ src, poster, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      playsInline
      loop
      preload="none"
      aria-hidden="true"
    />
  );
}

export default function CategoryCarousel({ categories }) {
  const scrollerRef = useRef(null);
  const items = categories || [];

  const card = useMemo(
    () => [
      "group",
      "rounded-3xl",
      "overflow-hidden",
      "border",
      "border-neutral-200/70",
      "bg-white",
      "hover:shadow-md",
      "transition-all",
      "duration-300",
      "transform",
      "hover:-translate-y-1",
      "snap-start",
    ].join(" "),
    [],
  );

  function scrollByCards(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.children[0];
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).gap) || 0;
    const step = first.getBoundingClientRect().width + gap;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <div className="mt-6">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-0 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 sm:gap-5 md:gap-6"
          aria-label="Category carousel"
        >
          {items.map((c, idx) => (
            <div
              key={c.slug}
              className="shrink-0 snap-start max-sm:flex-[0_0_100%] sm:w-[340px] sm:min-w-[340px] md:w-[360px] md:min-w-[360px] lg:w-[380px] lg:min-w-[380px] xl:w-[400px] xl:min-w-[400px]"
            >
              <RevealOnScroll variant="image" delayMs={idx * 80} className="h-full min-w-0">
                <Link href={`/category/${c.slug}`} className={card} aria-label={c.title}>
                  <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden">
                    {c.video ? (
                      <LazyVideo
                        src={c.video}
                        poster={c.image}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={c.image}
                        alt={c.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-neutral-200 px-4 py-5 md:py-6">
                      <div className="text-xs md:text-[13px] font-semibold tracking-[0.16em] text-neutral-900 uppercase text-center leading-snug">
                        {c.title}
                      </div>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:left-0"
          onClick={() => scrollByCards(-1)}
          aria-label="Scroll categories left"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:right-0"
          onClick={() => scrollByCards(1)}
          aria-label="Scroll categories right"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
