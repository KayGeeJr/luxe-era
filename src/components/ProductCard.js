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
  const finishLabel = product.finish
    ? `${product.finish.charAt(0).toUpperCase()}${product.finish.slice(1)}`
    : null;
  const showBadge =
    badge || (product.kind === "set" && finishLabel ? `${finishLabel} Set` : product.kind === "set" ? "Set" : null);
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
    <Link href={`/product/${product.slug}`} className="group block w-full">
      <div className="relative mx-auto w-full max-w-5xl aspect-[4/3] overflow-hidden bg-[#f0f0f0]">
        {showBadge ? (
          <span className="absolute left-4 top-4 z-10 bg-white px-3 py-1 text-[10px] tracking-[0.14em] uppercase">
            {showBadge}
          </span>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={primary}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <EditorialCardBody product={product} title={title} />
    </Link>
  );
}

function EditorialCardBody({ product, title }) {
  return (
    <div className="px-2 py-8 text-center sm:py-10">
      <h3 className="text-sm font-normal tracking-wide text-neutral-900 sm:text-base">{title}</h3>
      <p className="mt-2 text-sm text-neutral-600">{formatRand(product.price)}</p>
      <p className="mx-auto mt-4 max-w-lg text-sm font-light leading-relaxed text-neutral-500 line-clamp-2">
        {product.description}
      </p>
    </div>
  );
}
