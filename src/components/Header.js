"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { socialLinks } from "../data/socialLinks";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";
import brand from "../../brand.config";

const headerSocialIcons = { instagram: InstagramIcon, tiktok: TikTokIcon };
const DARK_HERO_PATHS = ["/about", "/shop", "/contact", "/custom-orders"];

function HeaderSocialRow({ className = "", dark }) {
  const btnClass = dark
    ? "border-neutral-200 text-neutral-700 hover:bg-neutral-100"
    : "border-white/20 bg-white/5 text-white hover:bg-white/15";

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
              className={`inline-flex h-8 w-8 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${btnClass}`}
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
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const onDarkHero = DARK_HERO_PATHS.includes(pathname);
  const atTop = !scrolled;

  const darkTransparent = (isHome && atTop) || (onDarkHero && atTop);
  const lightMode = !darkTransparent && (isHome ? scrolled : !onDarkHero || scrolled);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

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

  const headerClass = lightMode
    ? "border-b border-neutral-200/80 bg-[#faf8f5]/90 backdrop-blur-md"
    : darkTransparent
      ? "border-b border-transparent bg-transparent"
      : "border-b border-white/10 bg-neutral-950/95 backdrop-blur-md";

  const navLinkClass = lightMode
    ? "text-[11px] tracking-[0.14em] uppercase text-neutral-600 hover:text-neutral-900 transition-colors"
    : "text-[11px] tracking-[0.14em] uppercase text-white/80 hover:text-white transition-colors";

  const iconBtnClass = lightMode
    ? "border-neutral-200 text-neutral-800 hover:bg-neutral-100"
    : "border-white/20 bg-white/5 text-white hover:bg-white/15";

  const logoClass = lightMode ? "h-9 w-auto" : "h-9 w-auto brightness-0 invert";

  const searchClass = lightMode
    ? "w-36 bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none"
    : "w-36 bg-transparent text-sm text-white placeholder:text-white/40 outline-none";

  const searchBorder = lightMode ? "border-neutral-200" : "border-white/15";

  return (
    <header
      className={[
        "fixed top-0 z-50 w-full transition-all duration-300",
        headerClass,
        "pt-[env(safe-area-inset-top,0px)]",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-shop items-center justify-between gap-3 px-6 py-3.5 sm:px-10 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        <HeaderLogo closeMenu={closeMenu} logoClass={logoClass} />

        <nav className="hidden md:flex items-center justify-center gap-7" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <div className={`hidden lg:flex items-center gap-2 border px-3 py-1.5 ${searchBorder}`}>
            <input
              id="header-search"
              className={searchClass}
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Link
            href="/account"
            aria-label="Account"
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${iconBtnClass}`}
            onClick={closeMenu}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>

          <Link
            href="/cart"
            aria-label="Cart"
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors ${iconBtnClass}`}
            onClick={closeMenu}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M6 6l-2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </Link>

          <button
            type="button"
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border transition-colors md:hidden ${iconBtnClass}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <MobileNavPanel nav={nav} closeMenu={closeMenu} query={query} setQuery={setQuery} />
        </>
      ) : null}
    </header>
  );
}

function HeaderLogo({ closeMenu, logoClass }) {
  return (
    <div className="flex min-w-0 items-center">
      <Link href="/" className="flex shrink-0 items-center" onClick={closeMenu}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt={brand.storeName} className={logoClass} />
      </Link>
    </div>
  );
}

function MobileNavPanel({ nav, closeMenu, query, setQuery }) {
  return (
    <div
      id="mobile-navigation"
      className="fixed inset-y-0 right-0 z-[70] flex w-[min(100vw-3rem,320px)] flex-col border-l border-neutral-200 bg-white shadow-xl md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <span className="luxe-eyebrow text-neutral-400">Menu</span>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center text-neutral-600"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col px-5 py-2" aria-label="Main">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border-b border-neutral-100 py-4 text-sm tracking-[0.1em] uppercase text-neutral-800"
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-neutral-100 p-5">
        <input
          id="mobile-header-search"
          className="w-full border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-accent"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <HeaderSocialRow dark className="mt-4 justify-center" />
      </div>
    </div>
  );
}
