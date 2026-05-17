"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Luxury wipe-reveal: a dark overlay slides out right-to-left,
 * exposing the image underneath. Classic high-end editorial effect.
 */
export default function ImageReveal({ src, alt, className = "", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      {/* Image scales in subtly as it's revealed */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "scale-100" : "scale-110"
        } ${className}`}
        style={style}
      />

      {/* Accent flash — sweeps across as overlay peels away */}
      <div
        className="absolute inset-y-0 w-[2px]"
        style={{
          background: "#c9a97a",
          transition: "left 1.1s cubic-bezier(0.77,0,0.18,1), opacity 0.3s ease",
          left: visible ? "101%" : "-2px",
          opacity: visible ? 0 : 1,
        }}
        aria-hidden="true"
      />

      {/* Dark overlay slides away to the right */}
      <div
        className="absolute inset-0 bg-neutral-950 transition-transform duration-[1.1s] ease-[cubic-bezier(0.77,0,0.18,1)]"
        style={{
          transformOrigin: "right",
          transform: visible ? "scaleX(0)" : "scaleX(1)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
