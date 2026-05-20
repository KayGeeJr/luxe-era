"use client";

import Link from "next/link";
import { useState } from "react";
import { getSetHomeBlurb } from "../data/mockCatalog";
import { formatRand } from "../lib/pricing";

export default function ProductCard({ product, badge, layout = "grid" }) {
  const images = (product.images || []).map((img) =>
    typeof img === "string" ? img : img?.url,
  ).filter(Boolean);
  const primary = images[0] || "/images/placeholder.svg";
  const hover = images[1] || primary;
  const title = product.title || product.name;
  const finishLabel = product.finish
    ? `${product.finish.charAt(0).toUpperCase()}${product.finish.slice(1)}`
    : null;
  const showBadge =
    badge || (product.kind === "set" && finishLabel ? `${finishLabel} Set` : product.kind === "set" ? "Set" : null);
  const [imgSrc, setImgSrc] = useState(primary);

  if (layout === "editorial") {
    return (
      <EditorialCard
        product={product}
        title={title}
        badge={badge || (product.kind === "set" ? "Set" : showBadge)}
        primary={primary}
      />
    );
  }

  return (
    <article className="group luxe-hover-lift">
      <Link href={`/product/${product.slug}`} className="block">
        <ProductCardImage
          title={title}
          primary={primary}
          hover={hover}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          showBadge={showBadge}
        />
        <ProductCardInfo title={title} price={product.price} />
      </Link>
    </article>
  );
}

function ProductCardImage({ title, primary, hover, imgSrc, setImgSrc, showBadge }) {
  return (
    <ProductCardImageRoot
      title={title}
      primary={primary}
      hover={hover}
      imgSrc={imgSrc}
      setImgSrc={setImgSrc}
      showBadge={showBadge}
    />
  );
}

function ProductCardImageRoot({ title, primary, hover, imgSrc, setImgSrc, showBadge }) {
  return (
    <div
      className="relative aspect-[3/4] overflow-hidden bg-[#f4f2ef]"
      onMouseEnter={() => setImgSrc(hover)}
      onMouseLeave={() => setImgSrc(primary)}
    >
      {showBadge ? (
        <span className="absolute left-3 top-3 z-10 bg-white/95 px-2.5 py-1 text-[10px] font-medium tracking-[0.14em] uppercase text-neutral-900">
          {showBadge}
        </span>
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 flex translate-y-full justify-center pb-4 transition-transform duration-300 group-hover:translate-y-0">
        <span className="bg-white/95 px-4 py-2 text-[10px] tracking-[0.16em] uppercase text-neutral-900 shadow-sm">
          Quick view
        </span>
      </div>
    </div>
  );
}

function ProductCardInfo({ title, price }) {
  return (
    <div className="pt-4">
      <h3 className="text-sm font-normal text-neutral-900 line-clamp-2">{title}</h3>
      <p className="mt-1.5 text-sm text-neutral-600">{formatRand(price)}</p>
    </div>
  );
}

function EditorialCard({ product, title, badge, primary }) {
  const blurb = product.kind === "set" ? getSetHomeBlurb(product) : product.description;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group grid w-full grid-cols-1 bg-white lg:grid-cols-2 lg:min-h-[min(560px,70vh)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#f0f0f0] lg:aspect-auto lg:min-h-[400px]">
        {badge ? (
          <span className="absolute left-4 top-4 z-10 bg-white px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase text-neutral-900">
            {badge}
          </span>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-16 lg:px-14 lg:py-20">
        <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-400">
          {product.kind === "set" ? "Curated set" : "Piece"}
        </p>
        <h3 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.1] text-neutral-900">
          {title}
        </h3>
        {blurb ? (
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-neutral-600">{blurb}</p>
        ) : null}
        <p className="mt-6 text-base text-neutral-900">{formatRand(product.price)}</p>
        <span className="mt-8 inline-block text-[11px] tracking-[0.2em] uppercase text-neutral-500 transition-colors group-hover:text-neutral-900">
          {product.kind === "set" ? "Shop Now" : "View piece"} →
        </span>
      </div>
    </Link>
  );
}
