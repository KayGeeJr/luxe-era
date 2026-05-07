"use client";

import { useEffect, useMemo, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import FeaturedProductTile from "./FeaturedProductTile";

function pickRandom(items, count) {
  const arr = Array.isArray(items) ? [...items] : [];
  // Fisher–Yates shuffle (partial)
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export default function RandomFeaturedProducts({ products, count = 4 }) {
  const safeCount = Math.max(0, Math.min(count, Array.isArray(products) ? products.length : 0));

  // Avoid hydration mismatch by randomizing only after mount (client-side).
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    setFeatured(pickRandom(products, safeCount));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = useMemo(() => (Array.isArray(featured) ? featured : []), [featured]);

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 md:gap-10">
      {featured === null
        ? Array.from({ length: safeCount }).map((_, idx) => (
            <div
              // Placeholder boxes so SSR and first client render match.
              key={idx}
              className="min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm sm:rounded-2xl"
            >
              <div className="aspect-[5/6] bg-neutral-100/70" />
              <div className="px-2 py-3 sm:p-4">
                <div className="mx-auto h-3 w-3/4 rounded bg-neutral-100/80" />
                <div className="mx-auto mt-2 h-3 w-1/3 rounded bg-neutral-100/80" />
              </div>
              <div className="flex justify-center px-2 pb-4 sm:pb-6">
                <div className="h-10 w-full max-w-[220px] rounded-full bg-neutral-100/80" />
              </div>
            </div>
          ))
        : items.map((p, idx) => (
            <RevealOnScroll key={p.slug} variant="image" delayMs={idx * 90} className="min-w-0">
              <FeaturedProductTile product={p} />
            </RevealOnScroll>
          ))}
    </div>
  );
}

