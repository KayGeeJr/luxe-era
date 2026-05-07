/**
 * HOMEPAGE — rebuild this entirely for each client.
 * Keep the data-fetching patterns below as starting points.
 * Delete or replace the placeholder UI with the client's design.
 */

// Example server-side data fetching patterns (uncomment and adapt as needed):
//
// import { api } from "../lib/api";
//
// async function getFeaturedProducts() {
//   try {
//     const data = await fetch(`${process.env.BACKEND_URL}/api/products?limit=8`);
//     return data.json();
//   } catch { return { products: [] }; }
// }
//
// async function getCollections() {
//   try {
//     const data = await fetch(`${process.env.BACKEND_URL}/api/collections`);
//     return data.json();
//   } catch { return { collections: [] }; }
// }

export default function HomePage() {
  return (
    <main>
      {/* ─── REPLACE THIS WITH THE CLIENT'S HOMEPAGE DESIGN ─── */}
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          Welcome to your store
        </h1>
        <p className="mt-4 text-neutral-500 max-w-md">
          This is the homepage placeholder. Replace this with the client&apos;s design.
        </p>
        <a
          href="/shop"
          className="mt-8 rounded-full bg-neutral-900 px-8 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition"
        >
          Shop Now
        </a>
      </div>
    </main>
  );
}
