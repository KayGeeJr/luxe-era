"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/anti_images/logo1.jpeg"
        alt="ANTI"
        className="mb-6 h-16 w-16 rounded-full object-cover opacity-60"
      />
      <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-neutral-500">An unexpected error occurred. Please try again.</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-full bg-neutral-900 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Try again
        </button>
        <Link href="/" className="rounded-full border border-neutral-200 px-8 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
          Go home
        </Link>
      </div>
    </div>
  );
}
