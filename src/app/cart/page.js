"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageHero from "../../components/PageHero";
import { api } from "../../lib/api";
import { formatRand } from "../../lib/pricing";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await api.getCart();
        if (!isMounted) return;
        setCart(data.cart || { items: [] });
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load cart");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const subtotal = useMemo(() => {
    const items = cart?.items || [];
    return items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  }, [cart]);

  async function updateQty(itemId, quantity) {
    try {
      const data = await api.updateCart({ itemId, quantity });
      setCart(data.cart);
    } catch (err) {
      setError(err.message || "Could not update item");
    }
  }

  async function removeItem(itemId) {
    try {
      const data = await api.removeCartItem(itemId);
      setCart(data.cart);
    } catch (err) {
      setError(err.message || "Could not remove item");
    }
  }

  const items = cart?.items || [];

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Cart"
        title="Your"
        titleAccent="selection"
        image="/images/collections/signature/sig-1.jpg"
        imageAlt="Shopping cart"
        minHeight="40vh"
      />

      <section className="luxe-section">
        <div className="luxe-container max-w-3xl">
          {loading ? <p className="text-center text-sm text-neutral-500">Loading cart…</p> : null}
          {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

          {!loading && items.length === 0 ? (
            <div className="card-surface text-center">
              <p className="text-sm text-neutral-600">Your cart is empty.</p>
              <div className="mt-6">
                <Link href="/shop" className="btn-outline">
                  Return to shop
                </Link>
              </div>
            </div>
          ) : null}

          {!loading && items.length > 0 ? (
            <div className="card-surface">
              <div className="space-y-4">
                {items.map((item) => {
                  const image = item.product?.images?.[0];
                  const imageSrc = typeof image === "string" ? image : image?.url || "/images/placeholder.svg";
                  const v = item.product?.variants?.[item.variantIndex];
                  const parts = [v?.size, v?.colour].filter(Boolean);

                  return (
                    <div key={item._id} className="flex gap-4 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageSrc}
                        alt={item.product?.name || "Product"}
                        className="h-24 w-20 shrink-0 object-cover bg-neutral-100"
                      />
                      <div className="min-w-0 flex-1">
                        <CartItemName name={item.product?.name} />
                        {parts.length > 0 ? (
                          <p className="mt-0.5 text-xs tracking-wide text-neutral-500">{parts.join(" · ")}</p>
                        ) : null}
                        <p className="mt-2 text-sm text-neutral-900">{formatRand(item.price)}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            className="h-8 w-8 border border-neutral-200 text-sm transition hover:border-neutral-900"
                            onClick={() => updateQty(item._id, Math.max(1, item.quantity - 1))}
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="h-8 w-8 border border-neutral-200 text-sm transition hover:border-neutral-900"
                            onClick={() => updateQty(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="ml-2 text-[10px] tracking-[0.15em] uppercase text-neutral-400 transition hover:text-red-600"
                            onClick={() => removeItem(item._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border-t border-neutral-200 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="luxe-eyebrow text-neutral-400">Subtotal</span>
                  <span className="text-lg font-light text-neutral-900">{formatRand(subtotal)}</span>
                </div>
                <CartCheckout />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function CartItemName({ name }) {
  return <p className="text-sm font-medium tracking-wide text-neutral-900">{name}</p>;
}

function CartCheckout() {
  return (
    <div className="mt-6 flex justify-end">
      <Link href="/checkout" className="btn-primary-solid">
        Proceed to checkout
      </Link>
    </div>
  );
}
