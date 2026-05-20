import Link from "next/link";
import PieceTile from "../PieceTile";
import RevealOnScroll from "../RevealOnScroll";
import { getShopPieces, mockProducts } from "../../data/mockCatalog";

const pieces = getShopPieces(mockProducts, "all");

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
