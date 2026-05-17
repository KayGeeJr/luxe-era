import Link from "next/link";

export default function HomeStory() {
  return (
    <section className="relative overflow-hidden bg-neutral-950">
      <div className="mx-auto max-w-shop">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[640px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/collections/signature/sig-4.jpg"
              alt="Luxe Era craftsmanship — hand-cast concrete"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950/80 lg:to-neutral-950"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
            <p className="luxe-eyebrow text-accent">The craft</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-[1.1] text-white sm:text-5xl">
              Cast by hand.
              <br />
              Finished with care.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              Every piece begins as concrete and resin, shaped in South Africa with signature veining
              embedded during the cast — not painted on. Each object is limited, and no two are
              identical.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/about" className="btn-accent-outline">
                Our story
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-[48px] items-center justify-center px-8 text-[11px] tracking-[0.2em] uppercase text-white/70 transition hover:text-accent"
              >
                Shop Obsidian →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
