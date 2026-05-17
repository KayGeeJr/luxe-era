"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import RevealOnScroll from "../../components/RevealOnScroll";
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
    api.getCart().then((d) => setCart(d.cart || null)).catch(() => {});
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
    <main className="bg-white">
      <PageHero
        eyebrow="Checkout"
        title={placed ? "Order" : "Complete"}
        titleAccent={placed ? "confirmed" : "your order"}
        image="/images/collections/signature/sig-2.jpg"
        imageAlt="Checkout"
        minHeight="40vh"
      />

      <RevealOnScroll variant="text">
        <section className="luxe-section">
          <div className="luxe-container max-w-2xl">
            {!placed ? (
              <CheckoutForm
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              estimatedTotal={estimatedTotal}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              error={error}
              setError={setError}
              submitting={submitting}
              setSubmitting={setSubmitting}
              isLoggedIn={isLoggedIn}
              setPlaced={setPlaced}
              setOrderNumber={setOrderNumber}
              setOrderTotal={setOrderTotal}
              submitPayfastForm={submitPayfastForm}
            />
          ) : (
            <OrderConfirmation
              orderNumber={orderNumber}
              orderTotal={orderTotal}
            />
          )}
          </div>
        </section>
      </RevealOnScroll>
    </main>
  );
}

function CheckoutForm({
  cart,
  subtotal,
  shipping,
  estimatedTotal,
  paymentMethod,
  setPaymentMethod,
  error,
  setError,
  submitting,
  setSubmitting,
  isLoggedIn,
  setPlaced,
  setOrderNumber,
  setOrderTotal,
  submitPayfastForm,
}) {
  return (
    <CheckoutFormInner
      cart={cart}
      subtotal={subtotal}
      shipping={shipping}
      estimatedTotal={estimatedTotal}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      error={error}
      setError={setError}
      submitting={submitting}
      setSubmitting={setSubmitting}
      isLoggedIn={isLoggedIn}
      setPlaced={setPlaced}
      setOrderNumber={setOrderNumber}
      setOrderTotal={setOrderTotal}
      submitPayfastForm={submitPayfastForm}
    />
  );
}

function CheckoutFormInner(props) {
  const {
    cart,
    subtotal,
    shipping,
    estimatedTotal,
    paymentMethod,
    setPaymentMethod,
    error,
    setError,
    submitting,
    setSubmitting,
    isLoggedIn,
    setPlaced,
    setOrderNumber,
    setOrderTotal,
    submitPayfastForm,
  } = props;

  return (
    <div className="space-y-6">
      {cart?.items?.length > 0 && (
        <div className="card-surface">
          <p className="luxe-eyebrow text-neutral-400 mb-4">Order summary</p>
          <div className="space-y-3">
            {cart.items.map((item) => {
              const img = item.product?.images?.[0];
              const imgSrc = typeof img === "string" ? img : img?.url || "/images/placeholder.svg";
              const v = item.product?.variants?.[item.variantIndex];
              const variantLabel = [v?.size, v?.colour].filter(Boolean).join(" · ");
              return (
                <CheckoutLine
                  key={item._id}
                  imgSrc={imgSrc}
                  name={item.product?.name}
                  variantLabel={variantLabel}
                  quantity={item.quantity}
                  lineTotal={item.price * item.quantity}
                />
              );
            })}
          </div>
          <div className="mt-5 border-t border-neutral-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatRand(subtotal)}</span>
            </div>
            <CheckoutShipping shipping={shipping} />
            <CheckoutTotal estimatedTotal={estimatedTotal} />
          </div>
        </div>
      )}

      <div className="card-surface">
        <p className="luxe-eyebrow text-neutral-400 mb-4">Shipping details</p>
        <form
          className="grid grid-cols-1 gap-4"
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
          <label>
            <span className="field-label">Full name</span>
            <input name="name" className="field-input" required />
          </label>
          <label>
            <span className="field-label">Email</span>
            <input name="email" type="email" className="field-input" required />
          </label>
          <label>
            <span className="field-label">Phone</span>
            <input name="phone" className="field-input" required />
          </label>
          <label>
            <span className="field-label">Street address</span>
            <input name="street" className="field-input" required />
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label>
              <span className="field-label">City</span>
              <input name="city" className="field-input" required />
            </label>
            <label>
              <span className="field-label">Province</span>
              <input name="province" className="field-input" required />
            </label>
            <label>
              <span className="field-label">Postal code</span>
              <input name="postalCode" className="field-input" required />
            </label>
          </div>
          <label>
            <span className="field-label">Payment method</span>
            <select
              className="field-input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="eft_manual">Manual EFT</option>
              <option value="payfast">PayFast (card / EFT)</option>
            </select>
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!isLoggedIn && (
            <p className="text-xs text-neutral-500">
              Proceeding as guest. You can place an order without an account.
            </p>
          )}
          <button type="submit" disabled={submitting} className="btn-primary-solid w-full sm:w-auto">
            {submitting ? "Placing…" : paymentMethod === "payfast" ? "Continue to PayFast" : "Place order"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-neutral-500">
          <Link href="/cart" className="hover:text-accent transition-colors">
            ← Back to cart
          </Link>
        </p>
      </div>
    </div>
  );
}

function CheckoutLine({ imgSrc, name, variantLabel, quantity, lineTotal }) {
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt={name} className="h-14 w-14 object-cover bg-neutral-100" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-neutral-900">{name}</p>
        {variantLabel ? <p className="text-xs text-neutral-500">{variantLabel}</p> : null}
        <p className="text-xs text-neutral-500">Qty: {quantity}</p>
      </div>
      <p className="text-sm text-neutral-900 shrink-0">{formatRand(lineTotal)}</p>
    </div>
  );
}

function CheckoutShipping({ shipping }) {
  return (
    <CheckoutShippingInner shipping={shipping} />
  );
}

function CheckoutShippingInner({ shipping }) {
  return (
    <CheckoutShippingRow shipping={shipping} />
  );
}

function CheckoutShippingRow({ shipping }) {
  return (
    <div className="flex justify-between text-neutral-600">
      <span>Shipping</span>
      <span>{shipping === 0 ? "Free" : formatRand(shipping)}</span>
    </div>
  );
}

function CheckoutTotal({ estimatedTotal }) {
  return (
    <div className="flex justify-between font-light text-neutral-900 pt-2 border-t border-neutral-200">
      <span>Total</span>
      <span>{formatRand(estimatedTotal)}</span>
    </div>
  );
}

function OrderConfirmation({ orderNumber, orderTotal }) {
  return (
    <div className="space-y-6">
      <div className="card-surface text-center">
        <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center bg-neutral-950 text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-extralight tracking-wide text-neutral-900">Thank you</h2>
        <p className="mt-2 text-sm text-neutral-500">We&apos;ve received your order.</p>
        {orderNumber && (
          <p className="mt-3 font-mono text-sm text-accent">{orderNumber}</p>
        )}
        {orderTotal > 0 && (
          <p className="mt-1 text-sm text-neutral-600">Total: {formatRand(orderTotal)}</p>
        )}
      </div>

      <div className="card-surface">
        <p className="luxe-eyebrow text-neutral-400 mb-3">Payment instructions</p>
        <p className="mb-4 text-sm leading-relaxed text-neutral-600">
          Please make an EFT using the details below. Use your order number as the payment reference.
        </p>
        <div className="space-y-2 border border-neutral-100 bg-neutral-50 px-4 py-4 text-sm">
          {[
            ["Bank", EFT_DETAILS.bank],
            ["Account Name", EFT_DETAILS.accountName],
            ["Account Number", EFT_DETAILS.accountNumber],
            ["Branch Code", EFT_DETAILS.branchCode],
            ["Reference", orderNumber || EFT_DETAILS.reference],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-neutral-500">{label}</span>
              <span className="font-mono text-right text-neutral-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <CheckoutContinue />
    </div>
  );
}

function CheckoutContinue() {
  return (
    <CheckoutContinueInner />
  );
}

function CheckoutContinueInner() {
  return (
    <div className="flex justify-center">
      <Link href="/shop" className="btn-primary-solid">
        Continue shopping
      </Link>
    </div>
  );
}
