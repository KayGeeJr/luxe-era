const items = [
  "Hand-cast concrete",
  "Signature veining",
  "Limited editions",
  "Made in South Africa",
  "Obsidian collection",
  "Sculpted · Scented · Yours",
];

export default function HomeMarquee() {
  const row = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-white/10 bg-neutral-950 py-4">
      <div className="flex w-max animate-marquee">
        {row.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex shrink-0 items-center px-8 text-[11px] tracking-[0.28em] uppercase text-white/50"
          >
            {text}
            <span className="ml-8 text-accent" aria-hidden="true">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
