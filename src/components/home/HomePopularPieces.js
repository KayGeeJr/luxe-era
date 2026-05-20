import Link from "next/link";
import RevealOnScroll from "../RevealOnScroll";
import { formatRand } from "../../lib/pricing";
import { mockProducts } from "../../data/mockCatalog";

const pieces = mockProducts.filter((p) => p.kind === "piece" && p.finish === "obsidian");

export default function HomePopularPieces() {
  if (pieces.length === 0) return null;

  return (
    <section className="bg-[#f7f7f7] py-16 sm:py-24">
      <div className="mx-auto max-w-shop px-6 sm:px-10 lg:px-16">
        <RevealOnScroll variant="text">
          <div className="text-center">
            <h2 className="home-section-heading">Individual Pieces</h2>
            <p className="ref-body mx-auto mt-6 max-w-xl">
              Sculptural trays, vases, and trinket boxes — sold separately or composed into your own set.
            </p>
            <Link
              href="/shop?collection=pieces"
              className="mt-8 inline-block text-[11px] tracking-[0.2em] uppercase text-neutral-900 underline-offset-4 hover:underline"
            >
              Shop all pieces
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3 lg:gap-10">
          {pieces.map((p, i) => (
            <RevealOnScroll key={p.slug} variant="image" delayMs={i * 70}>
              <PieceTile product={p} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

function PieceTile({ product }) {
  const img = product.images?.[0];
  const title = product.name;

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
