"use client";

import { useEffect } from "react";
import Link from "next/link";
import brand from "../../brand.config";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center bg-neutral-950 px-6 text-center text-white">
      <p className="luxe-eyebrow text-white/40">Error</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.storeName}
        className="mt-6 h-12 w-auto brightness-0 invert opacity-50"
      />
      <h1 className="mt-8 text-3xl font-extralight tracking-wide sm:text-4xl">
        Something went <span className="text-accent">wrong</span>
      </h1>
      <p className="mt-4 max-w-sm text-sm text-white/50">
        An unexpected error occurred. Please try again.
      </p>
      <ErrorActions reset={reset} />
    </main>
  );
}

function ErrorActions({ reset }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
      <button type="button" onClick={reset} className="btn-outline-light">
        Try again
      </button>
      <Link href="/" className="text-[11px] tracking-[0.2em] uppercase text-accent hover:text-accent-light transition-colors">
        Go home →
      </Link>
    </div>
  );
}
