import ProductCard from "./ProductCard";

export default function RelatedProducts({ products, title = "You may also like" }) {
  if (!products?.length) return null;

  return (
    <section className="mt-20 border-t border-neutral-200 pt-14">
      <div className="flex items-end justify-between gap-4 mb-8">
        <h2 className="font-display text-2xl font-light text-neutral-900 sm:text-3xl">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
