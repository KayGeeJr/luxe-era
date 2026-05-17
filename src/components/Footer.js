import Link from "next/link";
import { socialLinks } from "../data/socialLinks";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";
import brand from "../../brand.config";

const socialIcons = { instagram: InstagramIcon, tiktok: TikTokIcon };

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 text-white">
      <FooterContainer />
    </footer>
  );
}

function FooterContainer() {
  return (
    <div className="luxe-container py-14 sm:py-20">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
        <FooterBrand />
        <FooterNav />
        <FooterContact />
        <FooterFollow />
      </div>
      <FooterBottom />
    </div>
  );
}

function FooterBrand() {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.storeName}
        className="h-10 w-auto brightness-0 invert opacity-90"
      />
      <p className="mt-4 text-sm leading-relaxed text-white/50">
        Handcrafted home collections. Concrete and resin — made in South Africa.
      </p>
    </div>
  );
}

function FooterNav() {
  return (
    <div>
      <p className="luxe-eyebrow mb-4 text-white/40">Explore</p>
      <ul className="space-y-2.5">
        {brand.nav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-white/70 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContact() {
  return (
    <div>
      <p className="luxe-eyebrow mb-4 text-white/40">Contact</p>
      <ul className="space-y-2 text-sm text-white/70">
        <li>
          <a
            href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
            className="transition-colors hover:text-accent"
          >
            {brand.contact.phone}
          </a>
        </li>
        <li>
          <a href={`mailto:${brand.contact.email}`} className="transition-colors hover:text-accent">
            {brand.contact.email}
          </a>
        </li>
      </ul>
    </div>
  );
}

function FooterFollow() {
  return (
    <div>
      <p className="luxe-eyebrow mb-4 text-white/40">Follow</p>
      <FooterSocialLinks />
    </div>
  );
}

function FooterSocialLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks.map((s) => {
        const Icon = socialIcons[s.icon];
        return (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-xs tracking-wide text-white/80 transition hover:border-accent/50 hover:text-accent"
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {s.label}
          </a>
        );
      })}
    </div>
  );
}

function FooterBottom() {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
      <p className="text-[10px] tracking-[0.2em] uppercase text-white/40">
        &copy; {new Date().getFullYear()} {brand.domain}
      </p>
      <p className="max-w-sm text-center text-xs text-white/50 sm:text-right">{brand.tagline}</p>
    </div>
  );
}
