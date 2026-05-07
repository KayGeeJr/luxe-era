"use client";

import { useEffect, useRef, useState } from "react";

const variants = {
  default: {
    base: "transition-[opacity,transform] duration-700 ease-out",
    hidden: "opacity-0 translate-y-4",
    shown: "opacity-100 translate-y-0",
    photoClass: "",
  },
  image: {
    base: "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [will-change:opacity,transform]",
    hidden: "opacity-0 translate-y-8 scale-[0.94]",
    shown: "opacity-100 translate-y-0 scale-100",
    photoClass: "reveal-photo-active",
  },
};

/**
 * Scroll-triggered entrance animation.
 * @param {"default"|"image"} variant - `image` adds a stronger scale/fade and inner `img` zoom (see globals.css).
 */
export default function RevealOnScroll({ children, className = "", delayMs = 0, variant = "default" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const v = variants[variant] || variants.default;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const threshold = variant === "image" ? 0.08 : 0.15;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <div
      ref={ref}
      className={[
        v.base,
        visible ? [v.shown, v.photoClass].filter(Boolean).join(" ") : v.hidden,
        className,
      ].join(" ")}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

