const items = [
  "Signature veining",
  "Limited editions",
  "Made in South Africa",
  "Home Collections",
  "Handcrafted · Minimal · Timeless",
];

export default function HomeMarquee() {
  const row = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-neutral-200 bg-[#f7f7f7] py-4">
      <div className="flex w-max animate-marquee">
        {row.map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="flex shrink-0 items-center px-8 text-[11px] tracking-[0.28em] uppercase text-neutral-500"
          >
            {text}
            <span className="ml-8 text-neutral-300" aria-hidden="true">
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
