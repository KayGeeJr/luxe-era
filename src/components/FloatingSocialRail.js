"use client";

import { socialLinks } from "../data/socialLinks";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";

const icons = { instagram: InstagramIcon, tiktok: TikTokIcon };

export default function FloatingSocialRail() {
  return (
    <aside
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col border border-neutral-200/80 bg-white/95 shadow-sm backdrop-blur-sm md:flex"
      aria-label="Social media"
    >
      {socialLinks.map((s) => {
        const Icon = icons[s.icon];
        return (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className="flex h-11 w-11 items-center justify-center border-b border-neutral-100 text-neutral-900 transition-colors last:border-b-0 hover:bg-neutral-50"
          >
            {Icon ? <Icon className="h-[18px] w-[18px]" /> : null}
          </a>
        );
      })}
    </aside>
  );
}
