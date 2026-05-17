"use client";

import Link from "next/link";
import { useState } from "react";
import { formatRand } from "../lib/pricing";

export default function ProductCard({ product, badge, layout = "grid" }) {
  const images = (product.images || []).map((img) =>
    typeof img === "string" ? img : img?.url,
  ).filter(Boolean);
  const primary = images[0] || "/images/placeholder.svg";
  const hover = images[1] || primary;
  const title = product.title || product.name;
  const showBadge = badge || (product.kind === "set" ? "Set" : null);
  const [imgSrc, setImgSrc] = useState(primary);

  if (layout === "editorial") {
    return <EditorialCard product={product} title={title} showBadge={showBadge} primary={primary} />;
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

function EditorialCard({ product, title, showBadge, primary }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group grid grid-cols-1 overflow-hidden border border-white/10 bg-white md:grid-cols-2"
    >
      <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[420px]">
        {showBadge ? (
          <span className="absolute left-4 top-4 z-10 bg-white px-3 py-1 text-[10px] tracking-[0.14em] uppercase">
            {showBadge}
          </span>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <EditorialCardBody product={product} title={title} />
    </Link>
  );
}

function EditorialCardBody({ product, title }) {
  return (
    <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
      <p className="luxe-eyebrow text-neutral-400">Curated set</p>
      <h3 className="mt-3 font-display text-3xl font-light text-neutral-900 md:text-4xl">{title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600 line-clamp-3">
        {product.description}
      </p>
      <p className="mt-6 text-lg text-neutral-900">{formatRand(product.price)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-accent">
        View set
        <span aria-hidden="true">→</span>
      </span>
    </div>
  );
}
