"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductGallery from "./ProductGallery";
import VariantSelector from "./VariantSelector";
import { api } from "../lib/api";
import { formatRand } from "../lib/pricing";
import { getSetSavings } from "../data/mockCatalog";
import brand from "../../brand.config";

function toLegacyOptions(variants = []) {
  if (!Array.isArray(variants) || variants.length === 0) return [];
  const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const colours = [...new Set(variants.map((v) => v.colour).filter(Boolean))];
  const options = [];
  if (sizes.length) options.push({ name: "size", values: sizes });
  if (colours.length) options.push({ name: "colour", values: colours });
  return options;
}

const freeShippingLabel = `Free delivery on orders over R${brand.freeShippingAboveZar / 100}`;

export default function ProductDetails({ product, setContents }) {
  const router = useRouter();
  const options = product?.options?.length ? product.options : toLegacyOptions(product?.variants);
  const images = product?.images?.length
    ? product.images.map((img) => (typeof img === "string" ? img : img.url)).filter(Boolean)
    : ["/images/placeholder.svg"];

  const savings = getSetSavings(product);
  const title = product.title || product.name;

  const optionSignature = useMemo(
    () => options.map((o) => `${o.name}:${o.values.join(",")}`).join("|"),
    [options],
  );

  const [selected, setSelected] = useState(() => {
    const initial = {};
    for (const opt of options) initial[opt.name] = "";
    return initial;
  });

  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartError, setCartError] = useState("");

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

  const optionNames = useMemo(() => options.map((o) => o.name), [options]);
  const hasAllSelections = optionNames.length === 0 || optionNames.every((name) => selected[name]);

  async function handleAddToCart() {
    setCartError("");
    setAddedToCart(false);
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
      setAddedToCart(true);
      window.dispatchEvent(new CustomEvent("luxe-cart-updated"));
    } catch (err) {
      setCartError(err?.message || "Could not add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14 xl:gap-20">
      <ProductGallery images={images} title={title} />

      <div className="mt-8 lg:mt-0">
        <div className="lg:sticky lg:top-28">
          <ProductBuyBox
            product={product}
            title={title}
            savings={savings}
            options={options}
            selected={selected}
            setSelected={setSelected}
            sizeStockMap={sizeStockMap}
            hasAllSelections={hasAllSelections}
            addingToCart={addingToCart}
            addedToCart={addedToCart}
            handleAddToCart={handleAddToCart}
            cartError={cartError}
            router={router}
            setContents={setContents}
          />
        </div>
      </div>
    </div>
  );
}

function ProductBuyBox(props) {
  const {
    product,
    title,
    savings,
    options,
    selected,
    setSelected,
    sizeStockMap,
    hasAllSelections,
    addingToCart,
    addedToCart,
    handleAddToCart,
    cartError,
    router,
    setContents,
  } = props;

  return (
    <ProductBuyBoxInner
      product={product}
      title={title}
      savings={savings}
      options={options}
      selected={selected}
      setSelected={setSelected}
      sizeStockMap={sizeStockMap}
      hasAllSelections={hasAllSelections}
      addingToCart={addingToCart}
      addedToCart={addedToCart}
      handleAddToCart={handleAddToCart}
      cartError={cartError}
      router={router}
      setContents={setContents}
    />
  );
}

function ProductBuyBoxInner(props) {
  const {
    product,
    title,
    savings,
    options,
    selected,
    setSelected,
    sizeStockMap,
    hasAllSelections,
    addingToCart,
    addedToCart,
    handleAddToCart,
    cartError,
    router,
    setContents,
  } = props;

  return (
    <>
      {product.kind === "set" ? (
        <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-accent">Curated set</p>
      ) : product.tags?.[0] ? (
        <p className="text-[11px] tracking-[0.14em] uppercase text-neutral-400">{product.tags[0]}</p>
      ) : null}

      <h1 className="mt-2 font-display text-3xl font-light leading-tight text-neutral-900 sm:text-4xl">
        {title}
      </h1>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-xl text-neutral-900">{formatRand(product.price)}</span>
        {savings ? (
          <span className="text-sm text-accent">Save {formatRand(savings)} vs. separate</span>
        ) : null}
      </div>

      {product.description ? (
        <p className="mt-5 text-sm leading-relaxed text-neutral-600">{product.description}</p>
      ) : null}

      {options.length > 0 ? (
        <div className="mt-6 space-y-5 border-t border-neutral-200 pt-6">
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
      ) : null}

      <div className="mt-8 space-y-3">
        <button
          type="button"
          disabled={!hasAllSelections || addingToCart}
          onClick={handleAddToCart}
          className={[
            "w-full min-h-[52px] text-[11px] tracking-[0.2em] uppercase transition",
            addedToCart
              ? "bg-accent text-white"
              : hasAllSelections && !addingToCart
                ? "bg-neutral-950 text-white hover:bg-neutral-800"
                : "cursor-not-allowed bg-neutral-100 text-neutral-400",
          ].join(" ")}
        >
          {addingToCart ? "Adding…" : addedToCart ? "Added to cart" : "Add to cart"}
        </button>
        {addedToCart ? (
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="btn-outline block w-full text-center !min-h-[44px]"
          >
            View cart
          </button>
        ) : null}
        {cartError ? <p className="text-center text-sm text-red-600">{cartError}</p> : null}
        <Link
          href="/custom-orders"
          className="block text-center text-[10px] tracking-[0.16em] uppercase text-neutral-500 transition hover:text-accent"
        >
          Need something bespoke? Enquire →
        </Link>
      </div>

      <p className="mt-4 text-xs text-neutral-500">{freeShippingLabel}</p>

      <ProductAccordions setContents={setContents} product={product} />
    </>
  );
}

function ProductAccordions({ setContents, product }) {
  return (
    <div className="mt-8 divide-y divide-neutral-200 border-t border-neutral-200">
      {setContents?.length > 0 ? (
        <details className="group py-4" open>
          <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] tracking-[0.14em] uppercase text-neutral-900">
            What&apos;s in this set
            <span className="text-neutral-400 transition group-open:rotate-45">+</span>
          </summary>
          <ul className="mt-4 space-y-2">
            {setContents.map((item) => (
              <li key={item.name} className="flex justify-between text-sm text-neutral-600">
                <span>{item.name}</span>
                <span>{formatRand(item.price)}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <details className="group py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] tracking-[0.14em] uppercase text-neutral-900">
          Materials &amp; care
          <span className="text-neutral-400 transition group-open:rotate-45">+</span>
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Hand-cast concrete and resin with embedded signature veining. Wipe with a soft damp cloth; avoid
          harsh chemicals and prolonged standing water. Each piece is unique — colour and veining vary
          slightly.
        </p>
      </details>

      <details className="group py-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] tracking-[0.14em] uppercase text-neutral-900">
          Shipping
          <span className="text-neutral-400 transition group-open:rotate-45">+</span>
        </summary>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {freeShippingLabel}. We ship across South Africa; dispatch within 3–5 business days after
          payment. Custom pieces may require additional lead time.
        </p>
      </details>
    </div>
  );
}
