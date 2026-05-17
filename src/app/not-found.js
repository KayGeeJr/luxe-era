import Link from "next/link";
import brand from "../../brand.config";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <p className="luxe-eyebrow text-white/40">404</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.storeName}
        className="mt-6 h-12 w-auto brightness-0 invert opacity-50"
      />
      <h1 className="mt-8 text-4xl font-extralight tracking-wide sm:text-5xl">
        Page not <span className="text-accent">found</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm text-white/50">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className="btn-outline-light">
          Go home
        </Link>
        <Link href="/shop" className="text-[11px] tracking-[0.2em] uppercase text-accent hover:text-accent-light transition-colors">
          Shop collection →
        </Link>
      </div>
    </main>
  );
}
