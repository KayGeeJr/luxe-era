import Link from "next/link";
import PageHero from "../../components/PageHero";
import RevealOnScroll from "../../components/RevealOnScroll";

export const metadata = {
  title: "About | Luxe Era",
  description:
    "Each Luxe Era piece is cast by hand in South Africa using concrete and resin. Learn the story behind the craft.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">

      <PageHero
        eyebrow="Our Story"
        title="Made by hand."
        titleAccent="Marked by hand."
        image="/images/collections/signature/sig-3.jpg"
        imageAlt="Luxe Era"
        minHeight="55vh"
      />

      {/* ── STORY ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

            <RevealOnScroll>
              <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-400">
                Who we are
              </p>
              <h2 className="mt-4 text-2xl sm:text-3xl font-light tracking-tight text-neutral-900 leading-snug">
                Objects that carry intention.
              </h2>
              <p className="mt-6 text-neutral-500 leading-relaxed">
                Luxe Era Home Collections was born from a belief that everyday
                objects should feel exceptional. We design and handcraft
                concrete and resin home pieces — candles, diffuser vessels,
                trays, and candleholders — each one finished with the raw
                signature veining that defines every piece.
              </p>
              <p className="mt-4 text-neutral-500 leading-relaxed">
                The veining is not painted on. It is embedded during the casting
                process, running through the piece the way minerals run through
                stone. Every crack, every vein, is unique to that single
                object. You will never hold another one exactly like it.
              </p>
              <p className="mt-4 text-neutral-500 leading-relaxed">
                We make in small batches in South Africa, and we intend to
                keep it that way. Quantity would cost us the thing that makes
                each piece worth having.
              </p>
            </RevealOnScroll>

            <RevealOnScroll variant="image">
              <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                <img
                  src="/images/collections/signature/sig-2.jpg"
                  alt="Luxe Era Signature Set"
                  className="h-full w-full object-cover"
                />
              </div>
            </RevealOnScroll>

          </div>
        </div>
      </section>

      {/* ── VALUES — dark strip ── */}
      <section className="bg-neutral-950 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <RevealOnScroll>
            <p
              className="text-[10px] tracking-[0.28em] uppercase text-center"
              style={{ color: "#c9a97a" }}
            >
              What drives us
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-light tracking-tight text-white text-center">
              Three things we never compromise.
            </h2>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                label: "I. The Material",
                body: "We use only high-grade concrete and resin. We don't cut weight or texture. If it doesn't feel substantial in the hand, it doesn't leave our studio.",
              },
              {
                label: "II. The Finish",
                body: "The signature veining is embedded by hand in every piece. It is the most time-consuming part of the process, and the part we refuse to rush.",
              },
              {
                label: "III. The Edition",
                body: "We produce in limited runs. Scarcity is not a marketing tactic — it is the natural result of making things properly, one at a time.",
              },
            ].map((v) => (
              <RevealOnScroll key={v.label}>
                <div className="border-t pt-6" style={{ borderColor: "rgba(201,169,122,0.3)" }}>
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase mb-4"
                    style={{ color: "#c9a97a" }}
                  >
                    {v.label}
                  </p>
                  <p className="text-neutral-400 leading-relaxed text-sm">{v.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS PREVIEW ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <RevealOnScroll>
            <p className="text-[10px] tracking-[0.28em] uppercase text-neutral-400">
              The Collections
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-light tracking-tight text-neutral-900">
              Three sets. One signature.
            </h2>
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { label: "Collection I",   title: "Signature Set", img: "/images/collections/signature/sig-2.jpg", alt: "Luxe Era Signature Set" },
              { label: "Collection II",  title: "Halo Luxe Set", img: "/images/collections/halo/halo-1.jpg",    alt: "Halo Luxe Set" },
              { label: "Collection III", title: "Lumi Luxe Set", img: "/images/collections/lumi/lumi-1.jpg",    alt: "Lumi Luxe Set" },
            ].map((c, i) => (
              <RevealOnScroll key={c.title} variant="image" delayMs={i * 80}>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 group">
                  <img
                    src={c.img}
                    alt={c.alt}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)" }}
                  />
                  <div className="absolute bottom-0 p-5 sm:p-6">
                    <p className="text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "#c9a97a" }}>{c.label}</p>
                    <h3 className="text-lg font-extralight tracking-wide text-white">{c.title}</h3>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center border border-neutral-900 px-10 text-[11px] tracking-[0.2em] uppercase text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
            >
              Shop All Collections
            </Link>
          </div>
        </div>
      </section>

      {/* ── CUSTOM ORDERS TEASER ── */}
      <section className="bg-neutral-950 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <RevealOnScroll>
            <p
              className="text-[10px] tracking-[0.3em] uppercase"
              style={{ color: "#c9a97a" }}
            >
              Bespoke
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extralight tracking-wide text-white leading-snug">
              Something made only for you.
            </h2>
            <p className="mt-5 text-neutral-400 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
              We accept a small number of custom commissions each month.
              Bring your colour, your form, your vision — we'll cast it.
            </p>
            <Link
              href="/custom-orders"
              className="mt-8 inline-flex h-12 items-center justify-center border px-10 text-[11px] tracking-[0.2em] uppercase text-white transition hover:bg-white hover:text-neutral-950"
              style={{ borderColor: "rgba(201,169,122,0.5)" }}
            >
              Start a Custom Order
            </Link>
          </RevealOnScroll>
        </div>
      </section>

    </main>
  );
}
