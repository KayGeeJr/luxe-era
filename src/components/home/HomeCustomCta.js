import Link from "next/link";

export default function HomeCustomCta() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-shop px-6 sm:px-10 lg:px-16">
        <div className="relative overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/collections/halo/halo-4.jpg"
            alt="Custom Luxe Era commission"
            className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
          />
          <div className="absolute inset-0 bg-white/20" aria-hidden="true" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="ref-kicker text-neutral-900">Bespoke</p>
            <h2 className="mt-4 max-w-lg font-display text-3xl font-light text-neutral-900 sm:text-4xl">
              Commission a piece made only for you
            </h2>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-neutral-700">
              Collaborate on finish, form, and fragrance for a one-of-one object.
            </p>
            <Link href="/custom-orders" className="btn-primary-solid mt-8">
              Start an enquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
