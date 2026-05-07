"use client";

import { useMemo, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function GalleryCarousel({ images = [] }) {
  const scrollerRef = useRef(null);
  const items = images || [];
  const [isAnimating, setIsAnimating] = useState(false);

  const cardClass = useMemo(
    () =>
      [
        "flex-none",
        "rounded-3xl overflow-hidden border border-neutral-200/70 bg-white",
        "transition-all duration-300 hover:shadow-md",
        "snap-start",
        
      ].join(" "),
    [],
  );

  function scrollBy(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    if (isAnimating) return;
    const first = el.children[0];
    if (!first) return;
    const gap = parseFloat(getComputedStyle(el).gap) || 0;
    const slideStep = first.getBoundingClientRect().width + gap;
    const amount = slideStep * direction;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Slower, more premium feel.
    const durationMs = 900;
    const start = el.scrollLeft;
    const end = start + amount;
    setIsAnimating(true);

    if (prefersReduced) {
      el.scrollTo({ left: end });
      window.setTimeout(() => setIsAnimating(false), 120);
      return;
    }

    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      const next = start + (end - start) * eased;
      el.scrollLeft = next;

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // Allow a small buffer so subsequent taps don't fight the animation.
        window.setTimeout(() => setIsAnimating(false), 100);
      }
    }

    requestAnimationFrame(step);
  }

  if (!items.length) return null;

  return (
    <div className="mt-6">
      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 [scroll-snap-stop:always]"
          aria-label="Gallery carousel"
        >
          {items.map((src, idx) => (
            <div
              key={idx}
              className={cardClass}
              style={{ width: "min(92vw, 420px)" }}
            >
              <RevealOnScroll variant="image" delayMs={idx * 60} className="h-full min-w-0">
                <div className="flex min-h-[min(72vh,680px)] max-h-[min(72vh,680px)] items-center justify-center overflow-hidden bg-neutral-100 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Gallery image ${idx + 1}`}
                    loading="lazy"
                    className="max-h-[min(72vh,680px)] max-w-full w-auto h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              </RevealOnScroll>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:left-0"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll gallery left"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:right-0"
          onClick={() => scrollBy(1)}
          aria-label="Scroll gallery right"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

