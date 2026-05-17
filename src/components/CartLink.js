"use client";

import Link from "next/link";
import { useCartCount } from "../hooks/useCartCount";

export default function CartLink({ className = "", onClick }) {
  const { count, bump } = useCartCount();
  const label = count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart";

  return (
    <Link
      href="/cart"
      aria-label={label}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M6 6l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="9" cy="20" r="1.5" fill="currentColor" />
        <circle cx="18" cy="20" r="1.5" fill="currentColor" />
      </svg>
      {count > 0 ? (
        <span
          className={[
            "absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium leading-none text-neutral-950 shadow-sm",
            bump ? "animate-cart-bump" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
