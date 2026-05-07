"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "../../../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/anti_images/logo1.jpeg"
            alt="ANTI"
            className="mx-auto mb-5 h-20 w-16 object-contain opacity-90"
          />
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Forgot password?</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-neutral-900">Check your inbox</h2>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
              If <span className="font-medium text-neutral-700">{email}</span> is registered, you&apos;ll receive a reset link shortly. Check your spam folder if it doesn&apos;t arrive.
            </p>
            <Link
              href="/account"
              className="mt-5 inline-block text-sm font-medium text-neutral-900 underline-offset-2 hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm"
          >
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 active:bg-neutral-950 disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send reset link"}
            </button>

            <div className="text-center">
              <Link
                href="/account"
                className="text-sm text-neutral-500 hover:text-neutral-700 transition"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
