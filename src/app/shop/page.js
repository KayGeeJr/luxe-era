"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";
import RevealOnScroll from "../../components/RevealOnScroll";
import LogoLoader from "../../components/LogoLoader";
import { api } from "../../lib/api";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const query = `?page=1&limit=60&sort=${encodeURIComponent(sort)}`;
        const data = await api.listProducts(query);
        if (!isMounted) return;
        setProducts(data.products || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [sort]);

  const sortedCount = useMemo(() => products.length, [products.length]);
  return (
    <div className="page-shell">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div>
          <div className="page-kicker">Shop</div>
          <h1 className="mt-2 page-title">Shop</h1>
          <div className="mt-1.5 text-sm leading-snug text-neutral-600 sm:mt-2 sm:leading-normal">
            {loading ? "Loading products..." : `Showing all ${sortedCount} results`}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 sm:justify-end">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <span className="font-medium">Sort</span>
            <select className="field-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Sort by latest</option>
              <option value="price_asc">Sort by price: low to high</option>
              <option value="price_desc">Sort by price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      {error ? <div className="mt-6 text-sm text-red-600">{error}</div> : null}
      {loading ? (
        <LogoLoader />
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-3">
        {products.map((p, idx) => (
          <RevealOnScroll key={p.slug} delayMs={idx * 30}>
            <ProductCard product={p} />
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

