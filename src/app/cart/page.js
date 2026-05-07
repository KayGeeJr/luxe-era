"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
    <div className="page-shell">
      <div className="page-kicker text-center">Shopping Cart</div>
      <h1 className="mt-2 page-title text-center">Cart</h1>
      {loading ? <div className="mt-6 text-center text-sm text-neutral-600">Loading cart...</div> : null}
      {error ? <div className="mt-4 text-center text-sm text-red-600">{error}</div> : null}

      {!loading && items.length === 0 ? (
        <div className="mx-auto mt-6 max-w-xl card-surface text-center sm:mt-8">
          <div className="text-sm text-neutral-700">Your cart is currently empty.</div>
          <div className="mt-6 flex justify-center">
            <Link href="/shop" className="btn-primary-solid">
              RETURN TO SHOP
            </Link>
          </div>
        </div>
      ) : null}

      {!loading && items.length > 0 ? (
        <div className="mx-auto mt-6 max-w-3xl card-surface sm:mt-8">
          <div className="space-y-4">
            {items.map((item) => {
              const image = item.product?.images?.[0];
              const imageSrc = typeof image === "string" ? image : image?.url || "/images/placeholder.svg";
              return (
                <div key={item._id} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt={item.product?.name || "Product"} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-neutral-900">{item.product?.name}</div>
                    {(() => {
                      const v = item.product?.variants?.[item.variantIndex];
                      const parts = [v?.size, v?.colour].filter(Boolean);
                      return parts.length > 0 ? (
                        <div className="mt-0.5 text-xs text-neutral-500">{parts.join(" · ")}</div>
                      ) : null;
                    })()}
                    <div className="mt-1 text-xs text-neutral-600">Qty: {item.quantity}</div>
                    <div className="mt-1 text-sm text-neutral-800">{formatRand(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-neutral-200 px-2 py-1 text-xs"
                      onClick={() => updateQty(item._id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-neutral-200 px-2 py-1 text-xs"
                      onClick={() => updateQty(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-red-600"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-700">Subtotal</span>
              <span className="font-medium text-neutral-900">{formatRand(subtotal)}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/checkout" className="btn-primary-solid rounded-full px-8">
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

