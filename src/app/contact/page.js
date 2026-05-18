"use client";

import { useState } from "react";
import PageHero from "../../components/PageHero";
import RevealOnScroll from "../../components/RevealOnScroll";
import brand from "../../../brand.config";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  return (
    <main className="bg-white">
      <PageHero
        eyebrow="Contact"
        title="Let's"
        titleAccent="connect"
        image="/images/collections/halo/halo-1.jpg"
        imageAlt="Contact Luxe Era"
        minHeight="45vh"
      />

      <section className="luxe-section">
        <div className="luxe-container">
          <ContactGrid status={status} setStatus={setStatus} brand={brand} />
        </div>
      </section>
    </main>
  );
}

function ContactGrid({ status, setStatus, brand }) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
      <RevealOnScroll>
        <p className="luxe-eyebrow text-neutral-400">Reach us</p>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extralight tracking-wide text-neutral-900">
          We&apos;d love to hear from you.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-neutral-500">
          Questions about an order, a collection, or a custom piece — send us a message and we&apos;ll
          respond within one business day.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          <li>
            <span className="luxe-eyebrow text-neutral-400 block mb-1">WhatsApp</span>
            <a
              href={brand.chatUrl}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-800 hover:text-accent transition-colors"
            >
              {brand.contact.phoneDisplay || brand.contact.phone}
            </a>
          </li>
          <li>
            <span className="luxe-eyebrow text-neutral-400 block mb-1">Phone</span>
            <a href={`tel:${brand.contact.phone.replace(/\s/g, "")}`} className="text-neutral-800 hover:text-accent transition-colors">
              {brand.contact.phone}
            </a>
          </li>
          <li>
            <span className="luxe-eyebrow text-neutral-400 block mb-1">Email</span>
            <a href={`mailto:${brand.contact.email}`} className="text-neutral-800 hover:text-accent transition-colors">
              {brand.contact.email}
            </a>
          </li>
        </ul>
      </RevealOnScroll>

      <RevealOnScroll delayMs={80}>
        <div className="card-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("Thank you — we'll be in touch shortly.");
            }}
            className="grid grid-cols-1 gap-4"
          >
            <label>
              <span className="field-label">Name *</span>
              <input required className="field-input" />
            </label>
            <label>
              <span className="field-label">Email *</span>
              <input type="email" required className="field-input" />
            </label>
            <label>
              <span className="field-label">Phone *</span>
              <input required className="field-input" />
            </label>
            <label>
              <span className="field-label">Message</span>
              <textarea className="field-input" rows={4} />
            </label>
            <label>
              <span className="field-label">Reference image</span>
              <input type="file" className="w-full text-sm text-neutral-600" />
            </label>
            <div className="pt-2">
              <button type="submit" className="btn-primary-solid w-full sm:w-auto">
                Send message
              </button>
            </div>
            {status ? <p className="text-sm text-neutral-600">{status}</p> : null}
          </form>
        </div>
      </RevealOnScroll>
    </div>
  );
}
