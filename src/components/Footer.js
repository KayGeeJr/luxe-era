import Link from "next/link";
import { socialLinks } from "../data/socialLinks";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";
import brand from "../../brand.config";

const socialIcons = { instagram: InstagramIcon, tiktok: TikTokIcon };

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold tracking-tight mb-2">{brand.storeName}</div>
            <div className="text-sm text-neutral-600">{brand.tagline}</div>
          </div>
          <div>
            <div className="font-semibold tracking-tight mb-2">Explore</div>
            <div className="flex flex-col gap-2 text-sm text-neutral-700 items-center">
              {brand.nav.map((item) => (
                <Link key={item.href} href={item.href} className="hover:opacity-80">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold tracking-tight mb-2">Contact</div>
            <div className="text-sm text-neutral-700">
              <div>Phone: {brand.contact.phone}</div>
              <div>Email: {brand.contact.email}</div>
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-4">
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Social</div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  {socialLinks.map((s) => {
                    const Icon = socialIcons[s.icon];
                    return (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-900 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                      >
                        {Icon ? <Icon className="h-4 w-4" /> : null}
                        {s.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-xs text-neutral-500">
          Copyright &copy; {new Date().getFullYear()} {brand.domain}
        </div>
      </div>
    </footer>
  );
}
