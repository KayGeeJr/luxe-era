import Link from "next/link";
import brand from "../../../brand.config";

export default function HomeAbout() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-shop px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 lg:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/collections/signature/sig-4.jpg"
              alt="Luxe Era handcrafted concrete tray with signature finish"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="lg:order-2">
            <p className="ref-kicker">About us</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-[1.15] text-neutral-900 sm:text-4xl">
              Quiet luxury for everyday spaces.
            </h2>
            <p className="ref-body mt-6 text-left">
              {brand.storeName} Home Collections is a handcrafted décor brand founded in{" "}
              {brand.foundedYear}, born from a passion for creating sculptural pieces that bring a
              sense of quiet luxury into everyday living spaces.
            </p>
            <p className="ref-body mt-4 text-left">
              Today, LuxeEra creates timeless, modern décor pieces that are both functional and
              artistic. Each item is thoughtfully handcrafted — carefully shaped, sanded, and
              finished for a clean, elevated look that complements contemporary interiors.
            </p>

            <p className="mt-8 text-[10px] tracking-[0.28em] uppercase text-neutral-400">
              The catalogue
            </p>
            <p className="ref-body mt-3 text-left">
              Our catalogue includes handmade concrete trinket trays, trinket boxes, mini vases, and
              curated full sets. Collection I Signature, Collection II Halo, and Collection III Lumi are each
              available in Obsidian and Ivory finishes.
            </p>
            <p className="mt-4 text-sm tracking-[0.2em] uppercase text-neutral-900">{brand.tagline}</p>

            <Link href="/about" className="btn-outline mt-10 inline-flex">
              Read our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
