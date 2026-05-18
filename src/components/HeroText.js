"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroText() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`px-6 text-center transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <p className="font-display text-[clamp(3rem,10vw,7.5rem)] font-light leading-[0.92] tracking-[0.06em] text-white lg:text-[clamp(3.5rem,6vw,6.5rem)]">
        Luxe
        <span className="mx-2 sm:mx-4 text-white/90" aria-hidden="true">
          ·
        </span>
        Era
      </p>
      <p className="mt-4 text-[10px] tracking-[0.35em] uppercase text-white/70 sm:text-[11px]">
        Home Collections
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/shop" className="btn-primary-solid min-w-[180px]">
          Shop Now
        </Link>
      </div>
    </div>
  );
}
