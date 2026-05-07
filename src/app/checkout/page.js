"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api, getToken } from "../../lib/api";
import { formatRand } from "../../lib/pricing";
import brand from "../../../brand.config";

const EFT_DETAILS = brand.eft;

export default function CheckoutPage() {
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("eft_manual");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    setIsLoggedIn(!!getToken());
    api.getCart().then(d => setCart(d.cart || null)).catch(() => {});
  }, []);

  const subtotal = useMemo(() => {
    return (cart?.items || []).reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0);
  }, [cart]);

  const shipping = subtotal >= brand.freeShippingAboveZar ? 0 : brand.shippingFeeZar;
  const estimatedTotal = subtotal + shipping;

  function submitPayfastForm(payfastUrl, paymentData) {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = payfastUrl;
    form.style.display = "none";
    Object.entries(paymentData || {}).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value ?? "");
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="page-narrow">
      <div className="page-kicker text-center">Checkout</div>
      <h1 className="mt-2 page-title text-center">Checkout</h1>

      {!placed ? (
        <div className="mt-6 space-y-4 sm:mt-8">

          {/* Order summary */}
          {cart?.items?.length > 0 && (
            <div className="card-surface">
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">Order Summary</div>
              <div className="space-y-2.5">
                {cart.items.map((item) => {
                  const img = item.product?.images?.[0];
                  const imgSrc = typeof img === "string" ? img : img?.url || "/images/placeholder.svg";
                  const v = item.product?.variants?.[item.variantIndex];
                  const variantLabel = [v?.size, v?.colour].filter(Boolean).join(" · ");
                  return (
                    <div key={item._id} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgSrc} alt={item.product?.name} className="h-14 w-14 rounded-lg object-cover border border-neutral-100" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-neutral-900">{item.product?.name}</div>
                        {variantLabel && <div className="text-xs text-neutral-500">{variantLabel}</div>}
                        <div className="text-xs text-neutral-500">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-medium text-neutral-900 shrink-0">
                        {formatRand(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 border-t border-neutral-100 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatRand(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatRand(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold text-neutral-900 pt-1 border-t border-neutral-100">
                  <span>Total</span>
                  <span>{formatRand(estimatedTotal)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="card-surface">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">Shipping Details</div>

            <form
              className="grid grid-cols-1 gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  setError("");
                  setSubmitting(true);
                  const form = new FormData(e.currentTarget);
                  const shippingAddress = {
                    name: String(form.get("name") || ""),
                    street: String(form.get("street") || ""),
                    city: String(form.get("city") || ""),
                    province: String(form.get("province") || ""),
                    postalCode: String(form.get("postalCode") || ""),
                    country: brand.country,
                    phone: String(form.get("phone") || ""),
                  };
                  const payload = {
                    shippingAddress,
                    paymentMethod,
                    guestEmail: String(form.get("email") || ""),
                  };
                  const data = await api.createOrder(payload);
                  setOrderNumber(data.order?.orderNumber || "");
                  setOrderTotal(data.order?.total || 0);
                  if (paymentMethod === "payfast") {
                    const payfast = await api.initiatePayment({
                      orderId: data.order?._id,
                      guestEmail: payload.guestEmail,
                    });
                    submitPayfastForm(payfast.payfastUrl, payfast.paymentData);
                    return;
                  }
                  setPlaced(true);
                } catch (err) {
                  setError(err.message || "Checkout failed");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <label className="block">
                <div className="text-sm text-neutral-700 mb-1">Full Name</div>
                <input name="name" className="field-input" required />
              </label>
              <label className="block">
                <div className="text-sm text-neutral-700 mb-1">Email</div>
                <input name="email" type="email" className="field-input" required />
              </label>
              <label className="block">
                <div className="text-sm text-neutral-700 mb-1">Phone</div>
                <input name="phone" className="field-input" required />
              </label>
              <label className="block">
                <div className="text-sm text-neutral-700 mb-1">Street Address</div>
                <input name="street" className="field-input" required />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="block">
                  <div className="text-sm text-neutral-700 mb-1">City</div>
                  <input name="city" className="field-input" required />
                </label>
                <label className="block">
                  <div className="text-sm text-neutral-700 mb-1">Province</div>
                  <input name="province" className="field-input" required />
                </label>
                <label className="block">
                  <div className="text-sm text-neutral-700 mb-1">Postal Code</div>
                  <input name="postalCode" className="field-input" required />
                </label>
              </div>
              <label className="block">
                <div className="mb-1 text-sm text-neutral-700">Payment Method</div>
                <select
                  className="field-input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="eft_manual">Manual EFT</option>
                  <option value="payfast">PayFast (card / EFT)</option>
                </select>
              </label>
              {error ? <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div> : null}
              {!isLoggedIn && (
                <div className="text-xs text-neutral-500">
                  Proceeding as guest. You can still place an order without an account.
                </div>
              )}

              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-solid rounded-full px-10"
                >
                  {submitting ? "Placing..." : paymentMethod === "payfast" ? "Continue to PayFast" : "Place Order"}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-xs text-neutral-500">
              <Link href="/cart" className="hover:underline">Back to cart</Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4 sm:mt-8">
          <div className="card-surface text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-900">Order placed!</h2>
            <p className="mt-1.5 text-sm leading-snug text-neutral-600">
              Thanks! We&apos;ve received your order.
            </p>
            {orderNumber && (
              <p className="mt-2 font-mono text-sm font-semibold text-neutral-900">{orderNumber}</p>
            )}
            {orderTotal > 0 && (
              <p className="mt-1 text-sm text-neutral-600">Total: {formatRand(orderTotal)}</p>
            )}
          </div>

          {/* EFT banking details */}
          <div className="card-surface">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Payment Instructions
            </div>
            <p className="mb-4 text-sm text-neutral-600 leading-relaxed">
              Please make an EFT payment using the banking details below. Use your order number as the payment reference so we can match your payment.
            </p>
            <div className="space-y-2 rounded-xl bg-neutral-50 border border-neutral-100 px-4 py-3.5 text-sm">
              {[
                ["Bank", EFT_DETAILS.bank],
                ["Account Name", EFT_DETAILS.accountName],
                ["Account Number", EFT_DETAILS.accountNumber],
                ["Branch Code", EFT_DETAILS.branchCode],
                ["Reference", orderNumber || EFT_DETAILS.reference],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-neutral-500">{label}</span>
                  <span className="font-medium text-neutral-900 font-mono text-right">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-neutral-400">
              Orders are processed once payment reflects. You&apos;ll receive a confirmation email when your order ships.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/shop" className="btn-primary-solid rounded-full px-8">
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
