import Link from "next/link";
import { formatRand } from "../lib/pricing";

export default function ProductCard({ product }) {
  const firstImage = product.images?.[0];
  const img = typeof firstImage === "string" ? firstImage : firstImage?.url || "/images/placeholder.svg";
  const title = product.title || product.name;
  return (
    <div className="group overflow-hidden rounded-2xl border border-neutral-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-3xl">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative">
          <div className="aspect-square bg-neutral-50 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/8 via-transparent to-transparent" />
        </div>

        <div className="px-2 py-3 text-center sm:p-4">
          <div className="text-xs font-medium leading-snug group-hover:underline transition sm:text-sm">
            {title}
          </div>
          <div className="mt-1.5 text-xs font-semibold text-neutral-900 sm:mt-2 sm:text-sm">{formatRand(product.price)}</div>
          <div className="mt-2 flex justify-center sm:mt-3">
            <span className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-3 py-1.5 text-center text-[10px] text-white sm:px-5 sm:py-2 sm:text-[11px]">
              SHOP
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

