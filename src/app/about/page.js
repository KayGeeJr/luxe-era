import Link from "next/link";
import PageHeader from "../../components/PageHeader";
import RevealOnScroll from "../../components/RevealOnScroll";
import brand from "../../../brand.config";

export const metadata = {
  title: "About | Luxe Era",
  description:
    "LuxeEra Home Collections — a handcrafted décor brand founded in 2023. Timeless, modern pieces made with intention in South Africa.",
};

const ORDER_STEPS = [
  {
    step: "1",
    title: "Place your order",
    body: `Message us on WhatsApp (${brand.contact.phoneDisplay}) or DM us on Instagram with the product name(s) or set, quantity, and your delivery address.`,
  },
  {
    step: "2",
    title: "Order processing",
    body: `All orders are handcrafted and require ${brand.orderLeadTime} to be completed.`,
  },
  {
    step: "3",
    title: "Delivery fee",
    body: "Once your delivery address is confirmed, your delivery fee will be calculated based on your location. You will receive a total amount (products + delivery fee).",
  },
  {
    step: "4",
    title: "Payment confirmation",
    body: "Your order will be confirmed once payment is made via EFT using the banking details provided at checkout.",
  },
  {
    step: "5",
    title: "Dispatch & delivery",
    body: "Your order will be securely packaged and dispatched. You will receive shipping updates once your order is on the way.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Introduction"
        title="Handcrafted."
        titleAccent="Minimal. Timeless."
        description="A handcrafted décor brand — timeless pieces made with intention in South Africa."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-20">
            <RevealOnScroll>
              <p className="ref-kicker text-neutral-400">About us</p>
              <h2 className="mt-4 text-2xl font-light leading-snug tracking-tight text-neutral-900 sm:text-3xl">
                Quiet luxury for everyday spaces.
              </h2>
              <p className="mt-6 leading-relaxed text-neutral-600">
                {brand.storeName} Home Collections is a handcrafted décor brand founded in{" "}
                {brand.foundedYear}, born from a passion for creating sculptural pieces that bring a
                sense of quiet luxury into everyday living spaces.
              </p>
              <p className="mt-4 leading-relaxed text-neutral-600">
                What began as a creative outlet evolved into a vision for a brand rooted in
                intentional design and craftsmanship. A period of pause allowed for reflection,
                growth, and a clearer direction for LuxeEra&apos;s identity.
              </p>
              <p className="mt-4 leading-relaxed text-neutral-600">
                Today, LuxeEra returns with a renewed direction: to create timeless, modern décor
                pieces that are both functional and artistic. Each item is thoughtfully
                handcrafted — carefully shaped, sanded, and finished to achieve a clean, elevated
                look that complements contemporary interiors.
              </p>
              <p className="mt-4 leading-relaxed text-neutral-600">
                At the core of the brand is a commitment to quality, detail, and consistency —
                ensuring that every piece reflects the standard of a truly refined product. Our
                range includes handmade concrete trinket trays, trinket boxes, mini vases, and
                curated full sets, offered in Obsidian and Ivory finishes.
              </p>
              <p className="mt-6 text-sm tracking-[0.2em] uppercase text-neutral-900">
                {brand.tagline}
              </p>
            </RevealOnScroll>

            <RevealOnScroll variant="image">
              <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/collections/luxe-era-signature-set/luxe-era-signature-set-01.jpeg"
                  alt="Luxe Era Signature Set"
                  className="h-full w-full object-cover"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
          <RevealOnScroll>
            <p className="text-center text-[10px] tracking-[0.28em] uppercase text-accent">
              What drives us
            </p>
            <h2 className="mt-3 text-center text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Quality. Detail. Consistency.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-neutral-600">
              Every LuxeEra piece is made to feel substantial, finished with care, and produced
              with the same standard of refinement — whether a single vase or a complete set.
            </p>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
            {[
              {
                label: "Quality",
                body: "High-grade materials and a substantial feel in the hand. If it does not meet our standard, it does not leave the studio.",
              },
              {
                label: "Detail",
                body: "Each piece is carefully shaped, sanded, and finished — including signature Crystal Vein detailing on select forms.",
              },
              {
                label: "Consistency",
                body: "Every object reflects the same refined standard, from individual trays and vases to our curated Obsidian and Ivory sets.",
              },
            ].map((v) => (
              <RevealOnScroll key={v.label}>
                <div className="border-t border-accent/30 pt-6">
                  <p className="mb-4 text-[10px] tracking-[0.25em] uppercase text-accent">{v.label}</p>
                  <p className="text-sm leading-relaxed text-neutral-600">{v.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
          <RevealOnScroll>
            <p className="ref-kicker text-neutral-400">The range</p>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Sculptural pieces for the home.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Our catalogue includes trays, vases, and storage forms designed for both function and
              styling — from statement Aurelia and Halo vases to the Lumi box and Aura trays.
            </p>
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Aura Tray",
                body: "A sculptural tray for jewellery, candles, perfumes, vanity styling, or coffee table décor.",
              },
              {
                name: "Aurelia Vase",
                body: "An elegant statement piece with signature Crystal Vein finish — ideal for dried stems and shelf styling.",
              },
              {
                name: "Halo Vase",
                body: "A bold, sculptural silhouette designed to stand beautifully on its own or with dried florals.",
              },
              {
                name: "Jade Vase",
                body: "A refined vase with a clean, timeless aesthetic for effortless styling.",
              },
              {
                name: "Lumi Box",
                body: "Decorative storage for jewellery and small essentials — understated luxury for everyday rituals.",
              },
              {
                name: "Curated sets",
                body: "Signature, Halo, and Lumi sets bundle our most-loved pieces at set pricing in Obsidian and Ivory.",
              },
            ].map((item, i) => (
              <RevealOnScroll key={item.name} delayMs={i * 60}>
                <div className="border border-neutral-200 bg-white p-6">
                  <h3 className="text-sm font-medium tracking-wide text-neutral-900">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-16">
          <RevealOnScroll>
            <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-400">The collections</p>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Three sets. Two finishes.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-neutral-600">
              Collection I Signature, Collection II Halo, and Collection III Lumi — each available
              in Obsidian and Ivory.
            </p>
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              {
                label: "Collection I",
                title: "Signature Set",
                img: "/images/collections/luxe-era-signature-set/luxe-era-signature-set-01.jpeg",
                alt: "Luxe Era Signature Set",
              },
              {
                label: "Collection II",
                title: "Halo Luxe Set",
                img: "/images/collections/halo-luxe-set/halo-luxe-set-01.jpeg",
                alt: "Halo Luxe Set",
              },
              {
                label: "Collection III",
                title: "Lumi Luxe Set",
                img: "/images/collections/lumi-luxe-set/lumi-luxe-set-01.jpeg",
                alt: "Lumi Luxe Set",
              },
            ].map((c, i) => (
              <RevealOnScroll key={c.title} variant="image" delayMs={i * 80}>
                <div className="group relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.img}
                    alt={c.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute bottom-0 p-5 sm:p-6">
                    <p className="mb-1 text-[9px] tracking-[0.3em] uppercase text-accent">{c.label}</p>
                    <h3 className="text-lg font-extralight tracking-wide text-white">{c.title}</h3>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/shop" className="btn-outline">
              Shop all collections
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-[#faf8f5] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <RevealOnScroll>
            <p className="ref-kicker text-neutral-400">How to order</p>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl">
              Place your order with us.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Follow the steps below — the same process outlined in our 2026 product catalogue.
            </p>
          </RevealOnScroll>

          <ol className="mt-10 space-y-6">
            {ORDER_STEPS.map((item, i) => (
              <RevealOnScroll key={item.step} delayMs={i * 70}>
                <li className="flex gap-5 border-b border-neutral-200 pb-6 last:border-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-900 text-[11px] font-medium text-neutral-900">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium tracking-wide text-neutral-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.body}</p>
                  </div>
                </li>
              </RevealOnScroll>
            ))}
          </ol>

          <RevealOnScroll delayMs={200}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href={brand.chatUrl} target="_blank" rel="noreferrer" className="btn-primary-solid">
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="btn-outline">
                Contact us
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center sm:px-10">
          <RevealOnScroll>
            <p className="text-[10px] tracking-[0.3em] uppercase text-accent">Bespoke</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-snug tracking-wide text-neutral-900 sm:text-4xl">
              Something made only for you.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
              For a piece outside our catalogue, start a custom enquiry — we&apos;ll collaborate on
              finish, form, and fragrance for a one-of-one object.
            </p>
            <Link
              href="/custom-orders"
              className="btn-accent-outline mt-8"
            >
              Start an enquiry
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
