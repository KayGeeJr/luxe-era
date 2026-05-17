import Link from "next/link";
import ProductCard from "../ProductCard";
import RevealOnScroll from "../RevealOnScroll";
import { COLLECTION_LINE, mockProducts } from "../../data/mockCatalog";

const sets = mockProducts.filter((p) => p.kind === "set");

export default function HomeFeaturedSets() {
  return (
    <section id="collections" className="bg-neutral-950 py-20 sm:py-28">
      <div className="mx-auto max-w-shop px-6 sm:px-10 lg:px-16">
        <RevealOnScroll variant="text">
          <div className="max-w-xl">
            <p className="luxe-eyebrow text-accent/90">{COLLECTION_LINE}</p>
            <h2 className="mt-4 font-display text-4xl font-light leading-tight text-white sm:text-5xl lg:text-6xl">
              Three curated sets.
              <br />
              <span className="text-white/50">One complete vignette each.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/55 sm:text-base">
              Bundle pricing on every set — trays, vases, and the Lumi box composed for your space.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 flex flex-col gap-6 lg:gap-8">
          {sets.map((set, i) => (
            <RevealOnScroll key={set.slug} variant="image" delayMs={i * 100}>
              <ProductCard product={set} layout="editorial" />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll variant="fade" delayMs={200}>
          <div className="mt-12 text-center">
            <Link href="/shop?collection=sets" className="btn-accent-outline">
              View all sets
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
