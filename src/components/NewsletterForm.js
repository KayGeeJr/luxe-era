"use client";

import { useState } from "react";
import { api } from "../lib/api";

export default function NewsletterForm({ variant = "light" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState("");
  const dark = variant === "dark";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMsg("");
    try {
      await api.subscribeNewsletter({ email: email.trim() });
      setStatus("success");
      setMsg("You're in. Thanks for subscribing.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-center text-sm font-medium ${dark ? "text-white/90" : "text-neutral-700"}`}>
        {msg}
      </p>
    );
  }

  const inputClass = dark
    ? "min-h-[48px] w-full max-w-sm border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/45 outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 sm:max-w-md sm:flex-1"
    : "min-h-[48px] w-full max-w-sm border border-neutral-200 bg-white px-5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 sm:max-w-md sm:flex-1";

  const btnClass = dark
    ? "inline-flex min-h-[48px] w-full max-w-xs shrink-0 items-center justify-center bg-white px-8 text-center text-[11px] tracking-[0.2em] uppercase text-neutral-950 transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
    : "inline-flex min-h-[48px] w-full max-w-xs shrink-0 items-center justify-center bg-neutral-950 px-8 text-center text-[11px] tracking-[0.2em] uppercase text-white transition hover:bg-neutral-800 disabled:opacity-60 sm:w-auto";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className={inputClass}
      />
      <button type="submit" disabled={status === "loading"} className={btnClass}>
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className={`w-full text-center text-xs ${dark ? "text-red-300" : "text-red-600"}`}>{msg}</p>
      )}
    </form>
  );
}
