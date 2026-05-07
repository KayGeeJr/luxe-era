import brand from "../../brand.config";

export default function LogoLoader({ fullScreen = false }) {
  const wrapper = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white"
    : "flex min-h-[50vh] items-center justify-center";

  return (
    <div className={`${wrapper} flex-col gap-4`} aria-label="Loading" role="status">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.logo}
        alt={brand.storeName}
        className="h-36 w-28 animate-pulse object-contain opacity-90"
      />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 animate-pulse">
        Loading...
      </p>
    </div>
  );
}
