"use client";

import ProductCard from "./ProductCard";
import RevealOnScroll from "./RevealOnScroll";

export default function RelatedProducts({ products, title = "You may also like" }) {
  if (!products?.length) return null;

  return (
    <RevealOnScroll>
      <section className="mt-20 border-t border-neutral-200 pt-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-light text-neutral-900 sm:text-3xl">{title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <RevealOnScroll key={p.slug} delayMs={i * 70}>
              <ProductCard product={p} />
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
