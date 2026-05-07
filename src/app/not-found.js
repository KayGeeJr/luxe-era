import Link from "next/link";
import brand from "../../brand.config";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.storeName}
        className="mb-6 h-16 w-16 rounded-full object-cover opacity-60"
      />
      <h1 className="text-5xl font-bold tracking-tighter text-neutral-900">404</h1>
      <p className="mt-3 text-base text-neutral-500">This page doesn&apos;t exist.</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link href="/" className="rounded-full bg-neutral-900 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800">
          Go home
        </Link>
        <Link href="/shop" className="rounded-full border border-neutral-200 px-8 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
          Shop
        </Link>
      </div>
    </div>
  );
}
