import brand from "../../brand.config";

const freeShippingRand = brand.freeShippingAboveZar / 100;

const perks = [
  { title: "Handmade in SA", body: "Cast and finished in small batches" },
  { title: "Free shipping", body: `On orders over R${freeShippingRand}` },
  { title: "Secure checkout", body: "Your details stay private" },
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
        {perks.map((p, i) => (
          <div
            key={p.title}
            data-reveal="text"
            data-reveal-delay={String(i * 90)}
            className="px-2 py-5 text-center sm:py-6"
          >
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
