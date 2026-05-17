"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroText() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Drive a step counter so each line has a deterministic delay
    const t1 = setTimeout(() => setStep(1), 80);
    const t2 = setTimeout(() => setStep(2), 300);
    const t3 = setTimeout(() => setStep(3), 550);
    const t4 = setTimeout(() => setStep(4), 800);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const line = (threshold, extra = "") =>
    `transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
      step >= threshold
        ? `opacity-100 translate-y-0 ${extra}`
        : "opacity-0 translate-y-6"
    }`;

  return (
    <div className="absolute bottom-0 left-0 right-0 px-6 pb-16 sm:px-10 sm:pb-20 md:px-16">

      <div className={`duration-700 ${line(1)}`}>
        <p
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Home Collections · South Africa
        </p>
      </div>

      <div className={`duration-[900ms] ${line(2)}`}>
        <h1
          className="text-5xl sm:text-8xl md:text-[9rem] font-extralight tracking-[0.12em] sm:tracking-[0.15em] uppercase leading-none"
          style={{ color: "#ffffff" }}
        >
          Luxe
          <br />
          <span style={{ color: "#c9a97a" }}>Era</span>
        </h1>
      </div>

      <div className={`duration-700 mt-4 ${line(3)}`}>
        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-white/25" />
          <p
            className="text-[10px] sm:text-xs tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Sculpted · Scented · Yours
          </p>
        </div>
      </div>

      <div className={`duration-700 mt-8 ${line(4)}`}>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center border border-white/80 px-8 text-[11px] font-medium tracking-[0.2em] uppercase text-white transition hover:bg-white hover:text-neutral-950"
          >
            Shop the Collection
          </Link>
          <Link
            href="/custom-orders"
            className="inline-flex h-12 items-center justify-center px-8 text-[11px] font-medium tracking-[0.2em] uppercase transition hover:opacity-70"
            style={{ color: "#c9a97a" }}
          >
            Custom Orders →
          </Link>
        </div>
      </div>

    </div>
  );
}
