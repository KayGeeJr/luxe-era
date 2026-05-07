import Link from "next/link";

export default function FeaturedProductTile({ product }) {
  const img = product.images?.[0] || "/images/placeholder.svg";
  return (
    <div className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:rounded-2xl">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="aspect-[5/6] bg-neutral-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="px-2 py-3 text-center sm:p-4">
          <div className="text-[10px] text-neutral-500 leading-snug sm:text-xs">{product.title}</div>
          <div className="mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">{`R${product.price}.00`}</div>
        </div>
      </Link>

      <div className="flex justify-center px-2 pb-4 sm:pb-6">
        <Link
          href={`/product/${product.slug}`}
          className="btn-primary-solid max-w-full rounded-full px-4 text-[10px] sm:px-8 sm:text-[11px]"
        >
          SHOP
        </Link>
      </div>
    </div>
  );
}

