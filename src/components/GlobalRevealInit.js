"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function revealElement(el) {
  const delay = Number(el.getAttribute("data-reveal-delay") || 0);
  const apply = () => el.setAttribute("data-reveal-visible", "");
  if (delay > 0) {
    setTimeout(apply, delay);
  } else {
    apply();
  }
}

function bindRevealTargets(root = document) {
  if (prefersReducedMotion()) {
    root.querySelectorAll("[data-reveal]:not([data-reveal-visible])").forEach((el) => {
      el.setAttribute("data-reveal-visible", "");
    });
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        revealElement(el);
        observer.unobserve(el);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
  );

  const nodes = root.querySelectorAll("[data-reveal]:not([data-reveal-visible])");
  nodes.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

export default function GlobalRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    let disconnectObserver = bindRevealTargets();

    const mutation = new MutationObserver(() => {
      disconnectObserver();
      disconnectObserver = bindRevealTargets();
    });

    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      disconnectObserver();
    };
  }, [pathname]);

  return null;
}
