import { notFound } from "next/navigation";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ProductDetails from "../../../components/ProductDetails";
import RelatedProducts from "../../../components/RelatedProducts";
import { getMockProduct, getRelatedProducts, mockProducts } from "../../../data/mockCatalog";

export function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const product = getMockProduct(params.slug);
  if (!product) return { title: "Product | Luxe Era" };
  return {
    title: `${product.name} | Luxe Era`,
    description: product.description,
  };
}

export default function ProductPage({ params }) {
  const product = getMockProduct(params.slug);
  if (!product) notFound();

  const related = getRelatedProducts(params.slug);
  const title = product.name;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-shop px-6 pt-6 pb-2 sm:px-10 lg:px-16 lg:pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: title },
          ]}
        />
      </div>

      <section className="mx-auto max-w-shop px-6 pb-16 sm:px-10 lg:px-16 lg:pb-24">
        <ProductDetails product={product} setContents={product.setContents} />
        <RelatedProducts products={related} />
      </section>
    </main>
  );
}
