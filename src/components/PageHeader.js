import Breadcrumbs from "./Breadcrumbs";

export default function PageHeader({
  eyebrow,
  title,
  titleAccent,
  description,
  breadcrumbs,
  className = "",
}) {
  return (
    <div className={`border-b border-neutral-200 bg-white ${className}`.trim()}>
      <div className="mx-auto max-w-shop px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        {breadcrumbs?.length ? (
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        ) : null}
        {eyebrow ? <p className="ref-kicker">{eyebrow}</p> : null}
        <h1 className="font-display text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          {title}
          {titleAccent ? (
            <>
              <br />
              <span className="text-accent">{titleAccent}</span>
            </>
          ) : null}
        </h1>
        {description ? (
          <p className="mt-3 max-w-lg text-sm font-light leading-relaxed text-neutral-600">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
