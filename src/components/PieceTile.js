import Link from "next/link";
import { formatRand } from "../lib/pricing";

export default function PieceTile({ product }) {
  const img = product.images?.[0];
  const title = product.title || product.name;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-neutral-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-4 text-center sm:mt-5">
        <h3 className="text-xs font-normal tracking-wide text-neutral-900 sm:text-sm">{title}</h3>
        <p className="mt-1.5 text-sm text-neutral-600">{formatRand(product.price)}</p>
      </div>
    </Link>
  );
}
