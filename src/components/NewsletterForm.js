"use client";

import { useState } from "react";
import { api } from "../lib/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMsg("");
    try {
      await api.subscribeNewsletter({ email: email.trim() });
      setStatus("success");
      setMsg("You're in! Thanks for subscribing.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <p className="text-center text-sm font-medium text-white/90">{msg}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 sm:gap-3 sm:flex-row sm:justify-center">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <input
        id="newsletter-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        className="min-h-[48px] w-full max-w-sm rounded-full border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-white/45 outline-none transition-colors focus:border-white/40 focus:ring-2 focus:ring-white/30 sm:max-w-md sm:flex-1"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-[48px] w-full max-w-xs shrink-0 items-center justify-center rounded-full bg-white px-8 text-center text-sm font-medium uppercase tracking-[0.12em] text-neutral-900 transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 sm:w-auto"
      >
        {status === "loading" ? "Subscribing…" : "SUBSCRIBE"}
      </button>
      {status === "error" && (
        <p className="w-full text-center text-xs text-red-300 sm:absolute sm:bottom-[-1.5rem]">{msg}</p>
      )}
    </form>
  );
}
