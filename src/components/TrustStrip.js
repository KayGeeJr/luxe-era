import brand from "../../brand.config";

const freeShippingRand = brand.freeShippingAboveZar / 100;

const perks = [
  {
    title: "Handmade in SA",
    body: "Cast and finished in small batches",
  },
  {
    title: `Free shipping over R${freeShippingRand}`,
    body: "On qualifying orders nationwide",
  },
  {
    title: "Limited editions",
    body: "Each piece is unique in its veining",
  },
];

export default function TrustStrip({ variant = "dark" }) {
  const light = variant === "light";

  return (
    <div
      className={
        light
          ? "border-y border-neutral-200 bg-[#faf8f5]"
          : "border-y border-white/10 bg-neutral-950"
      }
    >
      <div
        className={`mx-auto grid max-w-shop grid-cols-1 divide-y px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-10 lg:px-16 ${
          light ? "divide-neutral-200" : "divide-white/10"
        }`}
      >
        {perks.map((p) => (
          <div key={p.title} className="px-2 py-5 text-center sm:py-6">
            <p
              className={`text-[11px] font-medium tracking-[0.12em] uppercase ${
                light ? "text-neutral-900" : "text-white/90"
              }`}
            >
              {p.title}
            </p>
            <p className={`mt-1 text-xs ${light ? "text-neutral-500" : "text-white/45"}`}>{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
