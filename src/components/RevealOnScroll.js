/**
 * Marks content for scroll-triggered animation (see GlobalRevealInit + globals.css).
 * @param {"text"|"image"|"left"|"right"|"fade"} variant
 */
export default function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
  variant = "text",
}) {
  return (
    <div
      data-reveal={variant}
      data-reveal-delay={delayMs > 0 ? String(delayMs) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
