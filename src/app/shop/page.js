"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "../../components/Breadcrumbs";
import RevealOnScroll from "../../components/RevealOnScroll";
import ProductCard from "../../components/ProductCard";
import PriceListSection from "../../components/PriceListSection";
import { MOCK_COLLECTIONS, listMockProducts, mockProducts } from "../../data/mockCatalog";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCollection = searchParams.get("collection") || "all";

  const [sort, setSort] = useState("newest");
  const [collection, setCollection] = useState(initialCollection);

  const products = useMemo(
    () => listMockProducts({ sort, collection }),
    [sort, collection],
  );

  const sets = products.filter((p) => p.kind === "set");
  const pieces = products.filter((p) => p.kind === "piece");
  const showEditorialSets = collection === "all";
  const allSets = mockProducts.filter((p) => p.kind === "set");

  return (
    <>
      <div className="sticky top-[57px] z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-shop px-6 py-4 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-500">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar">
                {MOCK_COLLECTIONS.map((c) => {
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
        {showEditorialSets ? (
          <section className="mb-16 flex flex-col gap-8 sm:gap-10 lg:gap-12">
            <ShopSetsHeader />
            {allSets.map((set, i) => (
              <RevealOnScroll key={set.slug} delayMs={i * 80}>
                <ProductCard product={set} layout="editorial" badge="Set" />
              </RevealOnScroll>
            ))}
          </section>
        ) : null}

        {collection !== "sets" && pieces.length > 0 ? (
          <section className={showEditorialSets ? "mt-4" : ""}>
            {!showEditorialSets || collection === "pieces" ? (
              <h2 className="mb-8 font-display text-2xl font-light text-neutral-900">
                {collection === "pieces" ? "All pieces" : "Shop individual pieces"}
              </h2>
            ) : (
              <h2 className="mb-8 font-display text-2xl font-light text-neutral-900">
                Individual pieces
              </h2>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {(showEditorialSets ? pieces : products).map((p, i) => (
                <RevealOnScroll key={p.slug} delayMs={(i % 8) * 60}>
                  <ProductCard product={p} />
                </RevealOnScroll>
              ))}
            </div>
          </section>
        ) : null}

        {collection === "sets" && !showEditorialSets ? (
          <section>
            <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12">
              {sets.map((p, i) => (
                <RevealOnScroll key={p.slug} variant="image" delayMs={i * 80}>
                  <ProductCard product={p} layout="editorial" badge="Set" />
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

function ShopSetsHeader() {
  return (
    <div>
      <p className="luxe-eyebrow text-neutral-400">Obsidian &amp; Ivory</p>
      <h2 className="mt-2 font-display text-2xl font-light text-neutral-900 sm:text-3xl">Curated sets</h2>
      <p className="mt-2 max-w-xl text-sm text-neutral-500">
        Bundle pricing in two finishes — everything you need for a finished vignette, in one order.
      </p>
    </div>
  );
}

export default function ShopPage() {
  return (
    <main className="bg-white">
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-shop px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
          <RevealOnScroll variant="fade">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
          </RevealOnScroll>
          <RevealOnScroll variant="text" delayMs={80}>
            <h1 className="font-display text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Shop
            </h1>
          </RevealOnScroll>
          <RevealOnScroll variant="text" delayMs={140}>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-600">
              Hand-cast concrete and resin — objects for scent, surface, and ritual.
            </p>
          </RevealOnScroll>
        </div>
      </div>

      <Suspense fallback={<div className="py-20 text-center text-sm text-neutral-500">Loading…</div>}>
        <ShopContent />
      </Suspense>
    </main>
  );
}
