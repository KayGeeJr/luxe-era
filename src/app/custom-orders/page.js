"use client";

import { useState } from "react";
import CustomOrdersCarousel from "../../components/CustomOrdersCarousel";

// Add the client's custom order showcase images here.
// Place images in /public/images/custom/ and list them below.
const customImages = [
  // "/images/custom/example1.jpg",
  // "/images/custom/example2.jpg",
];

export default function CustomOrdersPage() {
  const [status, setStatus] = useState("");

  return (
    <div className="page-narrow">
      <div className="page-kicker text-center">Custom</div>
      <h1 className="mt-2 page-title text-center">Custom Orders</h1>
      <p className="mt-2 text-sm leading-snug text-neutral-700 sm:mt-3 sm:leading-relaxed">
        We tailor each piece to your vision. Fill in the form below and we&apos;ll be in touch.
      </p>

      {customImages.length > 0 && <CustomOrdersCarousel images={customImages} />}

      <div className="mt-6 card-surface sm:mt-8">
        <h2 className="text-center font-semibold tracking-tight">Place Order</h2>

        <form
          className="mt-4 sm:mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("Submitted. We'll get back to you soon.");
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Name *</div>
              <input required className="field-input" />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Email *</div>
              <input type="email" required className="field-input" />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Phone Number *</div>
              <input required className="field-input" />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Additional Information</div>
              <textarea className="field-input" rows={4} />
            </label>
            <label className="block">
              <div className="text-sm text-neutral-700 mb-1">Upload Reference Image</div>
              <input type="file" required className="w-full text-sm" />
            </label>

            <div className="flex justify-center pt-1">
              <button type="submit" className="btn-primary-solid rounded-full px-10">
                Submit
              </button>
            </div>
          </div>

          {status ? <div className="mt-4 text-center text-sm text-neutral-700">{status}</div> : null}
        </form>
      </div>
    </div>
  );
}
