"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryCarousel from "./CategoryCarousel";
import { api } from "../lib/api";

const linkFocus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-sm";

export default function HomepageCollections() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.listCategories()
      .then(data => {
        const cats = (data.categories || []).map(c => ({
          slug: c.slug,
          title: c.name,
          image: c.image?.url || c.image || null,
          video: c.video || null,
        }));
        if (cats.length) setCategories(cats);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="bg-white home-section-y" aria-labelledby="collections-heading">
      <div className="home-container">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="collections-heading" className="text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl">
              Collections
            </h2>
            <p className="mt-1 text-sm text-neutral-600">Browse by collection and mood.</p>
          </div>
          <Link
            href="/shop"
            className={`text-sm text-neutral-700 underline-offset-4 hover:underline ${linkFocus}`}
          >
            View Shop
          </Link>
        </div>
        {categories.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <CategoryCarousel categories={categories} />
          </div>
        )}
      </div>
    </section>
  );
}
