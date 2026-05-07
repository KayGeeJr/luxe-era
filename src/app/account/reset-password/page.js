"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm text-center">
        <p className="text-sm text-neutral-600">This reset link is invalid or has expired.</p>
        <Link
          href="/account/forgot-password"
          className="mt-4 inline-block text-sm font-medium text-neutral-900 underline-offset-2 hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await api.resetPassword({ token, password });
      setDone(true);
      setTimeout(() => router.push("/account"), 2500);
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-neutral-900">Password updated!</h2>
        <p className="mt-2 text-sm text-neutral-500">Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm"
    >
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
          New password
        </label>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min 8 chars, upper, lower & number"
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition"
        />
      </div>
      <div>
        <label className="block text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
          Confirm password
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat new password"
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
        {submitting ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Set new password</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Choose a strong password for your account.
          </p>
        </div>
        <Suspense fallback={
          <div className="rounded-2xl border border-neutral-100 bg-white p-7 shadow-sm text-center text-sm text-neutral-500">
            Loading…
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
