"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { socialLinks } from "../data/socialLinks";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";
import brand from "../../brand.config";

const headerSocialIcons = { instagram: InstagramIcon, tiktok: TikTokIcon };

function HeaderSocialRow({ className = "" }) {
  return (
    <ul
      className={["m-0 flex list-none items-center gap-1.5 p-0", className].filter(Boolean).join(" ")}
      aria-label="Social media"
    >
      {socialLinks.map((s) => {
        const Icon = headerSocialIcons[s.icon];
        return (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              {Icon ? <Icon className="h-[15px] w-[15px]" /> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function Header() {
  const [query, setQuery] = useState("");
  const cartHref = "/cart";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const nav = useMemo(() => brand.nav, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b border-neutral-200 transition-[background-color,box-shadow]",
        scrolled
          ? "bg-white shadow-sm md:bg-white/90 md:shadow-none md:backdrop-blur-md"
          : "bg-white md:bg-white/75 md:backdrop-blur-md",
        "pt-[env(safe-area-inset-top,0px)]",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        {/* Left: logo */}
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="flex shrink-0 items-center gap-2" onClick={closeMenu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo} alt={brand.storeName} className="h-10 w-auto" />
          </Link>
        </div>

        {/* Center: primary nav (tablet/desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-6" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-neutral-700 hover:text-neutral-900 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: search + account + cart */}
        <div className="flex shrink-0 items-center justify-end gap-2 md:gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5">
            <input
              id="header-search"
              className="w-40 text-sm outline-none"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-colors hover:bg-neutral-50"
            onClick={closeMenu}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>

          <Link
            href={cartHref}
            aria-label="Cart"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-colors hover:bg-neutral-50 md:order-none"
            onClick={closeMenu}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M6 6l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 transition-colors hover:bg-neutral-50 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/40 md:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            id="mobile-navigation"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100vw-3rem,320px)] flex-col border-l border-neutral-200 bg-white shadow-xl md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Menu</span>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col divide-y divide-neutral-100 px-4 py-2" aria-label="Main">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-4 text-sm text-neutral-800 transition-colors hover:text-neutral-900"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-neutral-100 p-4 sm:hidden">
              <label htmlFor="mobile-header-search" className="sr-only">Search</label>
              <input
                id="mobile-header-search"
                className="w-full rounded-full border border-neutral-200 px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <HeaderSocialRow className="mt-3 justify-center" />
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
