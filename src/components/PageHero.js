"use client";

import { useEffect, useState } from "react";

export default function PageHero({
  eyebrow,
  title,
  titleAccent,
  image = "/images/collections/signature/sig-3.jpg",
  imageAlt = "Luxe Era",
  minHeight = "50vh",
  align = "end",
}) {
  const centered = align === "center";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [image, title, titleAccent, eyebrow]);

  useEffect(() => {
    if (!mounted) return;
    const nodes = document.querySelectorAll("[data-hero-reveal]");
    nodes.forEach((el, i) => {
      const delay = Number(el.getAttribute("data-reveal-delay") || i * 80);
      setTimeout(() => el.setAttribute("data-reveal-visible", ""), delay);
    });
  }, [mounted]);

  return (
    <section
      className={`relative flex overflow-hidden bg-neutral-950 ${
        centered ? "items-center" : "items-end"
      }`}
      style={{ minHeight }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={imageAlt}
        data-hero-reveal
        data-reveal="image"
        data-reveal-delay="0"
        className={`absolute inset-0 h-full w-full object-cover opacity-[0.42] transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mounted ? "scale-100" : "scale-105"
        }`}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.35) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 ${
          centered ? "py-20 text-center" : "pb-12 sm:pb-16 pt-24"
        }`}
      >
        {eyebrow ? (
          <p className="luxe-eyebrow mb-3" data-hero-reveal data-reveal="text" data-reveal-delay="80">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-wide text-white leading-tight"
          data-hero-reveal
          data-reveal="text"
          data-reveal-delay="160"
        >
          {title}
          {titleAccent ? (
            <>
              <br />
              <span className="text-accent">{titleAccent}</span>
            </>
          ) : null}
        </h1>
      </div>
    </section>
  );
}
