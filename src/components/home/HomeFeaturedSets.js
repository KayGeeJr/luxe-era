import Link from "next/link";
import ProductCard from "../ProductCard";
import RevealOnScroll from "../RevealOnScroll";
import { getEditorialSetsForCollection, mockProducts } from "../../data/mockCatalog";

const sets = getEditorialSetsForCollection(mockProducts, "all");

export default function HomeFeaturedSets() {
  return (
    <section id="collections" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-shop px-6 sm:px-10 lg:px-16">
        <RevealOnScroll variant="text">
          <div>
            <h2 className="home-section-heading">Collections</h2>
            <p className="ref-body mx-auto mt-8 max-w-2xl">
              Welcome to LuxeEra Home Collections, where timeless design meets artisan craftsmanship.
              Each piece in our collection—featuring handmade concrete trinket trays, trinket boxes,
              mini vases, and curated full sets—is thoughtfully crafted to bring understated luxury
              to your space. Perfect for organizing, decorating, or gifting, our creations combine
              modern elegance with the durability of handcrafted artistry. Add a touch of
              sophistication to your home with Luxe Era.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 flex flex-col gap-8 sm:gap-10 lg:gap-12">
          {sets.map((set, i) => (
            <RevealOnScroll key={set.slug} variant="image" delayMs={i * 100} className="w-full">
              <ProductCard product={set} layout="editorial" badge="Set" />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll variant="fade" delayMs={200}>
          <div className="mt-14 text-center">
            <Link href="/shop?collection=sets" className="btn-outline">
              View all sets
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
