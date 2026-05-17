"use client";

import { useEffect, useRef, useState } from "react";

export default function ProductGallery({ images, title }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const stripRef = useRef(null);

  const clampedIdx = Math.min(activeIdx, Math.max(images.length - 1, 0));
  const activeSrc = images[clampedIdx] || images[0];

  useEffect(() => {
    setActiveIdx(0);
  }, [images]);

  function goTo(idx) {
    setActiveIdx(idx);
    const el = stripRef.current;
    if (!el) return;
    const child = el.children[idx];
    if (child) child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  function handleStripScroll() {
    const el = stripRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIdx(Math.max(0, Math.min(idx, images.length - 1)));
  }

  if (!images.length) return null;

  return (
    <GalleryRoot images={images} title={title} clampedIdx={clampedIdx} activeSrc={activeSrc} setActiveIdx={setActiveIdx} stripRef={stripRef} handleStripScroll={handleStripScroll} goTo={goTo} />
  );
}

function GalleryRoot({ images, title, clampedIdx, activeSrc, setActiveIdx, stripRef, handleStripScroll, goTo }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:gap-4">
      {images.length > 1 ? (
        <div className="hidden md:flex flex-col gap-2 shrink-0">
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIdx(idx)}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === clampedIdx ? "true" : "false"}
              className={[
                "relative aspect-[4/5] w-[72px] overflow-hidden bg-neutral-100 transition",
                idx === clampedIdx ? "ring-1 ring-neutral-900 ring-offset-2" : "opacity-45 hover:opacity-75",
              ].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative min-w-0 flex-1">
        <GalleryMobile images={images} title={title} stripRef={stripRef} handleStripScroll={handleStripScroll} />
        <div className="hidden md:block aspect-[4/5] bg-neutral-100 overflow-hidden" data-reveal="image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
        </div>
        {images.length > 1 ? (
          <GalleryDots images={images} clampedIdx={clampedIdx} goTo={goTo} />
        ) : null}
      </div>
    </div>
  );
}

function GalleryMobile({ images, title, stripRef, handleStripScroll }) {
  return (
    <div
      ref={stripRef}
      onScroll={handleStripScroll}
      className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:hidden"
      aria-label="Product images"
    >
      {images.map((src, idx) => (
        <GalleryMobileSlide key={`${src}-${idx}`} src={src} title={title} idx={idx} />
      ))}
    </div>
  );
}

function GalleryMobileSlide({ src, title, idx }) {
  return (
    <div className="flex-none w-full snap-start aspect-[4/5] bg-neutral-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${title} ${idx + 1}`} className="h-full w-full object-cover" />
    </div>
  );
}

function GalleryDots({ images, clampedIdx, goTo }) {
  return (
    <>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar md:hidden">
        {images.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(idx)}
            className={[
              "flex-none h-16 w-16 overflow-hidden bg-neutral-100",
              idx === clampedIdx ? "ring-1 ring-neutral-900" : "opacity-50",
            ].join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-[10px] tracking-widest text-neutral-400 md:hidden">
        {clampedIdx + 1} / {images.length}
      </p>
    </>
  );
}
