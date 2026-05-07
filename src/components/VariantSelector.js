"use client";

import { useMemo } from "react";

export default function VariantSelector({ option, value, onChange, stockByValue }) {
  const label = useMemo(() => option.name, [option.name]);

  return (
    <div className="mb-3">
      <div className="text-xs font-medium text-neutral-700 mb-2">
        {label === "color" ? "Color" : label === "size" ? "Size" : label}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {option.values.map((v) => {
          const active = v === value;
          const oos = stockByValue != null && stockByValue[v] === 0;
          return (
            <button
              key={v}
              type="button"
              disabled={oos}
              onClick={() => !oos && onChange(v)}
              aria-pressed={active}
              aria-disabled={oos}
              className={[
                "relative px-3 py-1.5 text-sm border rounded-full transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                oos
                  ? "cursor-not-allowed border-neutral-100 bg-neutral-50 text-neutral-300"
                  : active
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50",
              ].join(" ")}
            >
              {v}
              {oos && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="block h-px w-4/5 rotate-[-35deg] bg-neutral-200" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

