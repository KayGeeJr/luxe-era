"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import RevealOnScroll from "../../components/RevealOnScroll";
import ProductCard from "../../components/ProductCard";
import PriceListSection from "../../components/PriceListSection";
import {
  SHOP_FILTERS,
  getEditorialSetsForCollection,
  getShopPieces,
  listMockProducts,
} from "../../data/mockCatalog";

const VALID_COLLECTIONS = new Set(SHOP_FILTERS.map((c) => c.slug));

function normalizeCollection(slug) {
  return VALID_COLLECTIONS.has(slug) ? slug : "all";
}

function ShopSectionTitle({ children, count }) {
  return (
    <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-200 pb-4">
      <h2 className="font-display text-xl font-light text-neutral-900 sm:text-2xl">{children}</h2>
      {count != null ? (
        <span className="text-xs text-neutral-500">
          {count} {count === 1 ? "item" : "items"}
        </span>
      ) : null}
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCollection = normalizeCollection(searchParams.get("collection") || "all");

  const [sort, setSort] = useState("newest");
  const [collection, setCollection] = useState(initialCollection);

  const products = useMemo(
    () => listMockProducts({ sort, collection }),
    [sort, collection],
  );

  const sets = useMemo(
    () => getEditorialSetsForCollection(products, collection),
    [products, collection],
  );

  const pieces = useMemo(() => getShopPieces(products, collection), [products, collection]);
  const showSets = sets.length > 0;
  const showPieces = pieces.length > 0 && collection !== "sets";

  return (
    <>
      <div className="sticky top-[57px] z-40 border-b border-neutral-200 bg-[#faf8f5]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf8f5]/80">
        <div className="mx-auto max-w-shop px-6 py-4 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-1.5">
                {SHOP_FILTERS.map((c) => {
                  const active = collection === c.slug;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setCollection(c.slug)}
                      className={[
                        "shrink-0 px-3 py-1.5 text-[10px] tracking-[0.12em] uppercase transition-colors",
                        active
                          ? "bg-neutral-950 text-white"
                          : "text-neutral-600 hover:bg-neutral-100",
                      ].join(" ")}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
              <select
                className="shrink-0 border-0 border-b border-neutral-300 bg-transparent py-1 text-xs text-neutral-700 outline-none focus:border-neutral-900"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                <option value="newest">Featured</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-shop px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        {showSets ? (
          <section className={showPieces ? "mb-14" : ""}>
            <ShopSectionTitle count={sets.length}>
              {collection === "sets" ? "All sets" : "Sets"}
            </ShopSectionTitle>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
              {sets.map((set, i) => (
                <RevealOnScroll key={set.slug} delayMs={i * 50}>
                  <ProductCard product={set} badge="Set" priceHoverCta="Shop Now" />
                </RevealOnScroll>
              ))}
            </div>
          </section>
        ) : null}

        {showPieces ? (
          <section>
            <ShopSectionTitle count={pieces.length}>Individual pieces</ShopSectionTitle>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
              {pieces.map((p, i) => (
                <RevealOnScroll key={p.slug} delayMs={(i % 8) * 40}>
                  <ProductCard product={p} priceHoverCta="Shop Now" />
                </RevealOnScroll>
              ))}
            </div>
          </section>
        ) : null}

        {products.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">No products in this collection.</p>
        ) : null}

        <PriceListSection />
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Browse"
        title="Shop"
        description="Curated sets and individual pieces — Obsidian and Ivory finishes."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />

      <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-500">Loading…</div>}>
        <ShopContent />
      </Suspense>
    </main>
  );
}
