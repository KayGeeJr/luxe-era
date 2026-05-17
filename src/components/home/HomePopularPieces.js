import Link from "next/link";
import RevealOnScroll from "../RevealOnScroll";
import { formatRand } from "../../lib/pricing";
import { mockProducts } from "../../data/mockCatalog";

const pieces = mockProducts.filter((p) => p.kind === "piece").slice(0, 5);
const [hero, ...rest] = pieces;

export default function HomePopularPieces() {
  if (!hero) return null;

  return (
    <section className="bg-[#faf8f5] py-20 sm:py-28">
      <div className="mx-auto max-w-shop px-6 sm:px-10 lg:px-16">
        <RevealOnScroll variant="text">
          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="luxe-eyebrow text-neutral-400">Individual pieces</p>
              <h2 className="mt-3 font-display text-4xl font-light text-neutral-900 sm:text-5xl">
                Sculptural objects
              </h2>
            </div>
            <Link
              href="/shop?collection=pieces"
              className="text-[11px] tracking-[0.16em] uppercase text-neutral-900 hover:text-accent transition-colors"
            >
              Shop all pieces →
            </Link>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <RevealOnScroll variant="image" className="lg:col-span-7">
            <PieceTile product={hero} large />
          </RevealOnScroll>
          <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            {rest.slice(0, 2).map((p, i) => (
              <RevealOnScroll key={p.slug} variant="image" delayMs={80 + i * 80}>
                <PieceTile product={p} />
              </RevealOnScroll>
            ))}
          </div>
          {rest.length > 2 ? (
            <div className="col-span-1 grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-3 lg:gap-5">
              {rest.slice(2).map((p, i) => (
                <RevealOnScroll key={p.slug} variant="image" delayMs={160 + i * 70}>
                  <PieceTile product={p} />
                </RevealOnScroll>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function PieceTile({ product, large = false }) {
  const img = product.images?.[0];
  const title = product.name;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative block overflow-hidden bg-neutral-200"
    >
      <div className={large ? "aspect-[4/5] lg:aspect-[5/6]" : "aspect-[4/5]"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div
        data-reveal="text"
        data-reveal-delay="100"
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5"
      >
        <h3 className={`font-display font-light text-white ${large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>
          {title}
        </h3>
        <p className="mt-1 text-sm text-white/75">{formatRand(product.price)}</p>
      </div>
    </Link>
  );
}
