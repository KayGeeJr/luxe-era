"use client";

import { useMemo, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

function encodePathSegment(path) {
  return String(path)
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

export default function CustomOrdersCarousel({ images = [] }) {
  const scrollerRef = useRef(null);
  const items = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [isAnimating, setIsAnimating] = useState(false);

  function scrollBy(direction) {
    const el = scrollerRef.current;
    if (!el) return;
    if (isAnimating) return;

    const amount = Math.round(el.clientWidth * 0.85) * direction;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const durationMs = 800;
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
      el.scrollLeft = start + (end - start) * eased;
      if (t < 1) requestAnimationFrame(step);
      else window.setTimeout(() => setIsAnimating(false), 100);
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
          aria-label="Custom orders carousel"
        >
          {items.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="flex-none snap-start overflow-hidden rounded-3xl border border-neutral-200/70 bg-white shadow-sm w-[92vw] sm:w-[520px] lg:w-[calc((100%-2rem)/3)]"
            >
              <RevealOnScroll variant="image" delayMs={idx * 70} className="min-w-0">
                <div className="flex min-h-[min(62vh,620px)] items-center justify-center bg-neutral-100 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodePathSegment(src)}
                    alt={`Custom order image ${idx + 1}`}
                    className="max-h-[min(62vh,620px)] w-auto max-w-full object-contain"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </div>
              </RevealOnScroll>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/70 backdrop-blur hover:bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll custom orders left"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/70 backdrop-blur hover:bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          onClick={() => scrollBy(1)}
          aria-label="Scroll custom orders right"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

