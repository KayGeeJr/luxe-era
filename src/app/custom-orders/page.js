"use client";

import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import RevealOnScroll from "../../components/RevealOnScroll";
import ImageReveal from "../../components/ImageReveal";

const showcaseImages = [
  "/images/collections/signature/sig-5.jpg",
  "/images/collections/halo/halo-3.jpg",
  "/images/collections/lumi/lumi-3.jpg",
  "/images/collections/signature/sig-6.jpg",
];

export default function CustomOrdersPage() {
  const [status, setStatus] = useState("");

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Bespoke"
        title="Made only"
        titleAccent="for you"
        description="Collaborate on finish, form, and fragrance for a one-of-one Luxe Era piece."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Custom orders" }]}
      />

      <section className="luxe-section border-b border-neutral-100">
        <div className="luxe-container">
          <RevealOnScroll>
            <p className="luxe-eyebrow text-neutral-400">The process</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extralight tracking-wide text-neutral-900">
              Collaborate on finish, form, and fragrance.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">
              We accept a small number of custom commissions each month. Share your vision — colour,
              scale, scent — and we&apos;ll cast something that exists nowhere else.
            </p>
          </RevealOnScroll>

          <div className="mt-10 grid grid-cols-2 gap-1 sm:grid-cols-4 sm:gap-2">
            {showcaseImages.map((src) => (
              <div key={src} className="aspect-square bg-neutral-950">
                <ImageReveal src={src} alt="Custom Luxe Era piece" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="luxe-section bg-neutral-50">
        <div className="luxe-container max-w-2xl">
          <RevealOnScroll>
            <p className="luxe-eyebrow text-neutral-400 text-center">Enquire</p>
            <h2 className="mt-3 text-center text-xl font-extralight tracking-wide text-neutral-900">
              Start your custom order
            </h2>

            <div className="mt-8 card-surface">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStatus("Submitted. We'll be in touch within 48 hours.");
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
                  <span className="field-label">Your vision</span>
                  <textarea className="field-input" rows={4} placeholder="Colour, form, fragrance, dimensions…" />
                </label>
                <label>
                  <span className="field-label">Reference image *</span>
                  <input type="file" required className="w-full text-sm text-neutral-600" />
                </label>
                <div className="pt-2 flex justify-center">
                  <button type="submit" className="btn-primary-solid">
                    Submit enquiry
                  </button>
                </div>
                {status ? <p className="text-center text-sm text-neutral-600">{status}</p> : null}
              </form>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  );
}
