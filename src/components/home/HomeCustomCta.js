import Link from "next/link";

export default function HomeCustomCta() {
  return (
    <section className="bg-[#faf8f5] py-20 sm:py-24">
      <div className="mx-auto max-w-shop px-6 sm:px-10 lg:px-16">
        <div className="relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/collections/halo/halo-4.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-neutral-950/55" aria-hidden="true" />

          <div className="relative grid gap-8 px-8 py-16 sm:px-14 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <div className="max-w-lg">
              <p className="luxe-eyebrow text-accent">Bespoke</p>
              <h2 className="mt-4 font-display text-3xl font-light text-white sm:text-4xl lg:text-5xl">
                Commission a piece made only for you.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                Collaborate on finish, form, and fragrance for a one-of-one object — from concept to
                delivery.
              </p>
            </div>
            <Link
              href="/custom-orders"
              className="btn-outline-light shrink-0 justify-self-start lg:justify-self-end"
            >
              Start an enquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
