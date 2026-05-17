"use client";

import { useMemo } from "react";

export default function VariantSelector({ option, value, onChange, stockByValue }) {
  const label = useMemo(() => {
    if (option.name === "color") return "Colour";
    if (option.name === "size") return "Size";
    return option.name;
  }, [option.name]);

  return (
    <div>
      <p className="text-[11px] tracking-[0.12em] uppercase text-neutral-900">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
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
              className={[
                "relative min-w-[3rem] border px-4 py-2 text-xs transition",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900",
                oos
                  ? "cursor-not-allowed border-neutral-100 text-neutral-300 line-through"
                  : active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-800 hover:border-neutral-900",
              ].join(" ")}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
