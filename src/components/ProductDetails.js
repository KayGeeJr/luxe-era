"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import VariantSelector from "./VariantSelector";
import { api } from "../lib/api";
import { formatRand } from "../lib/pricing";

function toLegacyOptions(variants = []) {
  if (!Array.isArray(variants) || variants.length === 0) return [];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colours = [...new Set(variants.map((v) => v.colour).filter(Boolean))];
  const options = [];
  if (sizes.length) options.push({ name: "size", values: sizes });
  if (colours.length) options.push({ name: "colour", values: colours });
  return options;
}

export default function ProductDetails({ product }) {
  const router = useRouter();
  const options = product?.options?.length ? product.options : toLegacyOptions(product?.variants);
  const images = product?.images?.length
    ? product.images.map((img) => (typeof img === "string" ? img : img.url)).filter(Boolean)
    : ["/images/placeholder.svg"];

  const optionSignature = useMemo(
    () => options.map((o) => `${o.name}:${o.values.join(",")}`).join("|"),
    [options],
  );

  const [selected, setSelected] = useState(() => {
    const initial = {};
    for (const opt of options) initial[opt.name] = "";
    return initial;
  });

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartError, setCartError] = useState("");
  const stripRef = useRef(null);

  const sizeStockMap = useMemo(() => {
    const map = {};
    for (const v of product?.variants || []) {
      if (v.size) map[v.size] = (map[v.size] || 0) + Number(v.stock || 0);
    }
    return map;
  }, [product?.variants]);

  useEffect(() => {
    const initial = {};
    for (const opt of options) initial[opt.name] = "";
    setSelected(initial);
  }, [optionSignature]);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [product?.slug]);

  const optionNames = useMemo(() => options.map((o) => o.name), [options]);
  const hasAllSelections = optionNames.every((name) => selected[name]);

  const clampedIdx = Math.min(activeImageIdx, images.length - 1);
  const activeSrc = images[clampedIdx] || images[0];
  const title = product.title || product.name;

  function scrollToIdx(idx) {
    const el = stripRef.current;
    if (!el) return;
    const child = el.children[idx];
    if (child) child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveImageIdx(idx);
  }

  function prevImage() {
    scrollToIdx((activeImageIdx - 1 + images.length) % images.length);
  }
  function nextImage() {
    scrollToIdx((activeImageIdx + 1) % images.length);
  }

  function handleStripScroll() {
    const el = stripRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveImageIdx(Math.max(0, Math.min(idx, images.length - 1)));
  }

  async function handleAddToCart() {
    setCartError("");
    setAddingToCart(true);
    try {
      const selectedVariantIndex = (product.variants || []).findIndex(
        (v) =>
          (!selected.size || v.size === selected.size) &&
          (!selected.colour || v.colour === selected.colour),
      );
      await api.addToCart({
        productId: product._id,
        variantIndex: selectedVariantIndex >= 0 ? selectedVariantIndex : 0,
        quantity: 1,
      });
      router.push("/cart");
    } catch (err) {
      setCartError(err?.message || "Could not add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">

      {/* ── Images ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {/* Scrollable image strip */}
        <div className="relative">
          <div
            ref={stripRef}
            onScroll={handleStripScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-2xl"
            aria-label="Product images"
          >
            {images.map((src, idx) => (
              <div key={`${src}-${idx}`} className="flex-none w-full snap-start aspect-[4/5] bg-neutral-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${title} — image ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToIdx(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all focus-visible:outline-none ${
                      i === clampedIdx ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {images.map((src, idx) => {
              const active = idx === clampedIdx;
              return (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => scrollToIdx(idx)}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={active ? "true" : "false"}
                  className={[
                    "flex-none h-[72px] w-[72px] overflow-hidden rounded-xl border-2 bg-neutral-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1",
                    active ? "border-neutral-900" : "border-transparent opacity-60 hover:opacity-90",
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${title} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Details ─────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        {product.category?.name && (
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            {product.category.name}
          </p>
        )}

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          {title}
        </h1>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-neutral-900">
            {formatRand(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-base text-neutral-400 line-through">
              {formatRand(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.description && (
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
            {product.description}
          </p>
        )}

        {/* Variant selectors */}
        {options.length > 0 && (
          <div className="mt-6 space-y-4">
            {options.map((opt) => (
              <VariantSelector
                key={opt.name}
                option={opt}
                value={selected[opt.name]}
                onChange={(v) => setSelected((prev) => ({ ...prev, [opt.name]: v }))}
                stockByValue={opt.name === "size" ? sizeStockMap : undefined}
              />
            ))}
          </div>
        )}

        {/* Add to cart */}
        <div className="mt-8">
          <button
            type="button"
            disabled={!hasAllSelections || addingToCart}
            onClick={handleAddToCart}
            className={[
              "w-full rounded-full border px-6 py-3.5 text-sm font-semibold tracking-wide transition",
              hasAllSelections && !addingToCart
                ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800 active:bg-neutral-950"
                : "cursor-not-allowed bg-neutral-100 text-neutral-400 border-neutral-100",
            ].join(" ")}
          >
            {addingToCart ? "Adding…" : hasAllSelections ? "Add to cart" : "Select options to continue"}
          </button>
          {cartError && (
            <p className="mt-2.5 text-center text-sm text-red-500">{cartError}</p>
          )}
        </div>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
