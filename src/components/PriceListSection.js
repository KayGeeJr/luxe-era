import { PRICE_LIST_IMAGE } from "../data/mockCatalog";

export default function PriceListSection() {
  return (
    <section className="mt-20 border-t border-neutral-200 pt-12">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2">
          <div>
            <p className="luxe-eyebrow text-neutral-400">Obsidian &amp; Ivory</p>
            <h2 className="mt-2 font-display text-xl font-light text-neutral-900 sm:text-2xl">
              View official price list
            </h2>
          </div>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-neutral-200 text-neutral-500 transition group-open:rotate-45"
            aria-hidden="true"
          >
            +
          </span>
        </summary>
        <div className="mt-6 mx-auto max-w-md overflow-hidden bg-neutral-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PRICE_LIST_IMAGE}
            alt="Luxe Era Obsidian collection price list"
            className="h-auto w-full"
          />
        </div>
      </details>
    </section>
  );
}
