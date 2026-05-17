export default function PageHero({
  eyebrow,
  title,
  titleAccent,
  image = "/images/collections/signature/sig-3.jpg",
  imageAlt = "Luxe Era",
  minHeight = "50vh",
  align = "end",
}) {
  const centered = align === "center";

  return (
    <section
      className={`relative flex overflow-hidden bg-neutral-950 ${
        centered ? "items-center" : "items-end"
      }`}
      style={{ minHeight }}
    >
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.42]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.35) 55%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 ${
          centered ? "py-20 text-center" : "pb-12 sm:pb-16 pt-24"
        }`}
      >
        {eyebrow ? <p className="luxe-eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-wide text-white leading-tight">
          {title}
          {titleAccent ? (
            <>
              <br />
              <span className="text-accent">{titleAccent}</span>
            </>
          ) : null}
        </h1>
      </div>
    </section>
  );
}
