"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  return (
    <div className="page-narrow">
      <div className="page-kicker text-center">Contact</div>
      <h1 className="mt-2 page-title text-center">Contact Us</h1>

      <div className="mt-6 card-surface sm:mt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("Submitted (mock). We’ll get back to you soon.");
          }}
          className="grid grid-cols-1 gap-3 sm:gap-4"
        >
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
            <input type="file" className="w-full text-sm" />
          </label>

          <div className="flex justify-center pt-1">
            <button
              type="submit"
              className="btn-primary-solid rounded-full px-10"
            >
              Submit
            </button>
          </div>

          {status ? <div className="text-center text-sm text-neutral-700">{status}</div> : null}
        </form>
      </div>
    </div>
  );
}

