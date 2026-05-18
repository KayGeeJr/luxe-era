/**
 * Static catalog — Luxe Era Product Catalogue 2026 (Obsidian + Ivory).
 * Prices in whole ZAR.
 */

export const PRICE_LIST_IMAGE = "/images/price-list.png";
export const COLLECTION_LINES = ["Obsidian", "Ivory"];

export const MOCK_COLLECTIONS = [
  { slug: "all", label: "All" },
  { slug: "sets", label: "Sets" },
  { slug: "obsidian", label: "Obsidian" },
  { slug: "ivory", label: "Ivory" },
  { slug: "signature", label: "Signature" },
  { slug: "halo", label: "Halo" },
  { slug: "lumi", label: "Lumi" },
  { slug: "pieces", label: "Individual pieces" },
];

/** @deprecated use product.finish */
export const COLLECTION_LINE = "Obsidian";

const IMG = {
  auraTray: "/images/products/aura-tray.jpg",
  miniAuraTray: "/images/products/mini-aura-tray.jpg",
  aureliaVase: "/images/products/aurelia-vase.jpg",
  haloVase: "/images/products/halo-vase.jpg",
  jadeVase: "/images/products/jade-vase.jpg",
  lumiBox: "/images/products/lumi-box.jpg",
  sig1: "/images/collections/signature/sig-1.jpg",
  sig2: "/images/collections/signature/sig-2.jpg",
  sig3: "/images/collections/signature/sig-3.jpg",
  sig4: "/images/collections/signature/sig-4.jpg",
  haloSetDisplay: "/images/collections/halo-luxe-set/halo-luxe-set-01.jpeg",
  haloSet2: "/images/collections/halo-luxe-set/halo-luxe-set-04.jpeg",
  haloSet3: "/images/collections/halo-luxe-set/halo-luxe-set-03.jpeg",
  halo1: "/images/collections/halo/halo-1.jpg",
  halo2: "/images/collections/halo/halo-2.jpg",
  halo3: "/images/collections/halo/halo-3.jpg",
  halo4: "/images/collections/halo/halo-4.jpg",
  signatureSetDisplay: "/images/collections/luxe-era-signature-set/luxe-era-signature-set-01.jpeg",
  signatureSet2: "/images/collections/luxe-era-signature-set/luxe-era-signature-set-02.jpeg",
  lumiSetDisplay: "/images/collections/lumi-luxe-set/lumi-luxe-set-01.jpeg",
  lumiSet2: "/images/collections/lumi-luxe-set/lumi-luxe-set-02.jpeg",
  lumiSet3: "/images/collections/lumi-luxe-set/lumi-luxe-set-03.jpeg",
  lumi1: "/images/collections/lumi/lumi-1.jpg",
  lumi2: "/images/collections/lumi/lumi-2.jpg",
  lumi3: "/images/collections/lumi/lumi-3.jpg",
};

/** Product copy aligned with the 2026 catalogue PDF. */
const COPY = {
  auraTray: {
    summary:
      "A sculptural tray designed for both function and styling, bringing a refined touch to any space.",
    idealFor: [
      "Jewellery and accessories",
      "Candles and perfumes",
      "Bathroom or vanity styling",
      "Coffee table décor",
    ],
  },
  miniAuraTray: {
    summary:
      "A sculptural tray designed for both function and styling, bringing a refined touch to any space.",
    idealFor: [
      "Jewellery and accessories",
      "Candles and perfumes",
      "Bathroom or vanity styling",
      "Coffee table décor",
    ],
  },
  jadeVase: {
    summary: "A refined vase offering a clean, timeless aesthetic for effortless styling.",
    idealFor: ["Dried stems", "Neutral minimal interiors", "Shelf or table accents"],
  },
  haloVase: {
    summary:
      "A bold, sculptural vase with a contemporary silhouette, designed to stand beautifully on its own.",
    idealFor: [
      "Stand-alone décor",
      "Dried floral arrangements",
      "Console or coffee table styling",
    ],
  },
  aureliaVase: {
    summary:
      "An elegant statement piece featuring the signature Crystal Vein finish, designed to elevate modern interiors.",
    idealFor: [
      "Dried or preserved stems",
      "Decorative shelf styling",
      "Minimal interior accents",
    ],
  },
  lumiBox: {
    summary:
      "A decorative storage piece designed to hold small essentials while adding a touch of understated luxury.",
    idealFor: ["Jewellery", "Small personal items", "Decorative styling"],
  },
};

function withCopy(copyKey, product) {
  const copy = COPY[copyKey];
  return {
    ...product,
    description: copy.summary,
    idealFor: copy.idealFor,
  };
}

const obsidianSets = [
  {
    _id: "mock-halo-luxe-set",
    slug: "halo-luxe-set",
    name: "Halo Luxe Set",
    kind: "set",
    collection: "halo",
    finish: "obsidian",
    price: 1000,
    description:
      "Obsidian Collection II — LuxeEra Aura tray with Aurelia, Halo, and Jade vases. Four pieces, one complete vignette.",
    images: [IMG.haloSetDisplay, IMG.haloSet2, IMG.haloSet3],
    tags: ["Set", "Obsidian", "Collection II"],
    isFeatured: true,
    setContents: [
      { name: "LuxeEra Aura Tray", price: 350 },
      { name: "LuxeEra Aurelia Vase", price: 300 },
      { name: "LuxeEra Halo Vase", price: 200 },
      { name: "LuxeEra Jade Vase", price: 150 },
    ],
  },
  {
    _id: "mock-lumi-luxe-set",
    slug: "lumi-luxe-set",
    name: "Lumi Luxe Set",
    kind: "set",
    collection: "lumi",
    finish: "obsidian",
    price: 900,
    description:
      "Obsidian Collection III — Aura tray, Halo and Jade vases, and the Lumi box for scent and keepsakes.",
    images: [IMG.lumiSetDisplay, IMG.lumiSet2, IMG.lumiSet3],
    tags: ["Set", "Obsidian", "Collection III"],
    isFeatured: true,
    setContents: [
      { name: "LuxeEra Aura Tray", price: 350 },
      { name: "LuxeEra Halo Vase", price: 200 },
      { name: "LuxeEra Jade Vase", price: 150 },
      { name: "LuxeEra Lumi Box", price: 200 },
    ],
  },
  {
    _id: "mock-luxe-era-signature-set",
    slug: "luxe-era-signature-set",
    name: "LuxeEra Signature Set",
    kind: "set",
    collection: "signature",
    finish: "obsidian",
    price: 750,
    description:
      "Obsidian Collection I — Mini Aura tray, Aurelia vase, and Lumi box. The signature entry to the line.",
    images: [IMG.signatureSetDisplay, IMG.signatureSet2],
    tags: ["Set", "Obsidian", "Collection I"],
    isFeatured: true,
    setContents: [
      { name: "LuxeEra Mini Aura Tray", price: 250 },
      { name: "LuxeEra Aurelia Vase", price: 300 },
      { name: "LuxeEra Lumi Box", price: 200 },
    ],
  },
];

const ivorySets = [
  {
    _id: "mock-halo-luxe-set-ivory",
    slug: "halo-luxe-set-ivory",
    name: "Halo Luxe Set",
    kind: "set",
    collection: "halo",
    finish: "ivory",
    price: 800,
    description:
      "Ivory Collection II — LuxeEra Aura tray with Aurelia, Halo, and Jade vases in the Ivory finish.",
    images: [IMG.haloSetDisplay, IMG.haloSet2, IMG.haloSet3],
    tags: ["Set", "Ivory", "Collection II"],
    isFeatured: true,
    setContents: [
      { name: "LuxeEra Aura Tray", price: 300 },
      { name: "LuxeEra Aurelia Vase", price: 250 },
      { name: "LuxeEra Halo Vase", price: 150 },
      { name: "LuxeEra Jade Vase", price: 100 },
    ],
  },
  {
    _id: "mock-lumi-luxe-set-ivory",
    slug: "lumi-luxe-set-ivory",
    name: "Lumi Luxe Set",
    kind: "set",
    collection: "lumi",
    finish: "ivory",
    price: 700,
    description:
      "Ivory Collection III — Aura tray, Halo and Jade vases, and the Lumi box in the Ivory finish.",
    images: [IMG.lumiSetDisplay, IMG.lumiSet2, IMG.lumiSet3],
    tags: ["Set", "Ivory", "Collection III"],
    isFeatured: true,
    setContents: [
      { name: "LuxeEra Aura Tray", price: 300 },
      { name: "LuxeEra Halo Vase", price: 150 },
      { name: "LuxeEra Jade Vase", price: 100 },
      { name: "LuxeEra Lumi Box", price: 150 },
    ],
  },
  {
    _id: "mock-luxe-era-signature-set-ivory",
    slug: "luxe-era-signature-set-ivory",
    name: "LuxeEra Signature Set",
    kind: "set",
    collection: "signature",
    finish: "ivory",
    price: 550,
    description:
      "Ivory Collection I — Mini Aura tray, Aurelia vase, and Lumi box in the Ivory finish.",
    images: [IMG.signatureSetDisplay, IMG.signatureSet2],
    tags: ["Set", "Ivory", "Collection I"],
    isFeatured: true,
    setContents: [
      { name: "LuxeEra Mini Aura Tray", price: 150 },
      { name: "LuxeEra Aurelia Vase", price: 250 },
      { name: "LuxeEra Lumi Box", price: 150 },
    ],
  },
];

const obsidianPieces = [
  withCopy("auraTray", {
    _id: "mock-aura-tray-large",
    slug: "aura-tray-large",
    name: "LuxeEra Aura Tray",
    kind: "piece",
    collection: "halo",
    finish: "obsidian",
    price: 350,
    images: [IMG.auraTray, IMG.sig4],
    tags: ["Tray", "Obsidian"],
    isFeatured: true,
  }),
  withCopy("miniAuraTray", {
    _id: "mock-mini-aura-tray",
    slug: "mini-aura-tray",
    name: "LuxeEra Mini Aura Tray",
    kind: "piece",
    collection: "signature",
    finish: "obsidian",
    price: 250,
    images: [IMG.miniAuraTray, IMG.sig1],
    tags: ["Tray", "Mini", "Obsidian"],
    isFeatured: true,
  }),
  withCopy("aureliaVase", {
    _id: "mock-aurelia-vase",
    slug: "aurelia-vase",
    name: "LuxeEra Aurelia Vase",
    kind: "piece",
    collection: "signature",
    finish: "obsidian",
    price: 300,
    images: [IMG.aureliaVase, IMG.sig2],
    tags: ["Vase", "Obsidian"],
    isFeatured: true,
  }),
  withCopy("haloVase", {
    _id: "mock-halo-vase",
    slug: "halo-vase",
    name: "LuxeEra Halo Vase",
    kind: "piece",
    collection: "halo",
    finish: "obsidian",
    price: 200,
    images: [IMG.haloVase, IMG.halo3],
    tags: ["Vase", "Obsidian"],
    isFeatured: true,
  }),
  withCopy("jadeVase", {
    _id: "mock-jade-vase",
    slug: "jade-vase",
    name: "LuxeEra Jade Vase",
    kind: "piece",
    collection: "lumi",
    finish: "obsidian",
    price: 150,
    images: [IMG.jadeVase, IMG.lumi2],
    tags: ["Vase", "Obsidian"],
    isFeatured: true,
  }),
  withCopy("lumiBox", {
    _id: "mock-lumi-box",
    slug: "lumi-box",
    name: "LuxeEra Lumi Box",
    kind: "piece",
    collection: "lumi",
    finish: "obsidian",
    price: 200,
    images: [IMG.lumiBox, IMG.lumiSetDisplay, IMG.lumi2],
    tags: ["Box", "Obsidian"],
    isFeatured: true,
  }),
];

const ivoryPieces = [
  withCopy("auraTray", {
    _id: "mock-aura-tray-large-ivory",
    slug: "aura-tray-ivory",
    name: "LuxeEra Aura Tray",
    kind: "piece",
    collection: "halo",
    finish: "ivory",
    price: 300,
    images: [IMG.auraTray, IMG.sig4],
    tags: ["Tray", "Ivory"],
    isFeatured: false,
  }),
  withCopy("miniAuraTray", {
    _id: "mock-mini-aura-tray-ivory",
    slug: "mini-aura-tray-ivory",
    name: "LuxeEra Mini Aura Tray",
    kind: "piece",
    collection: "signature",
    finish: "ivory",
    price: 150,
    images: [IMG.miniAuraTray, IMG.sig1],
    tags: ["Tray", "Mini", "Ivory"],
    isFeatured: false,
  }),
  withCopy("aureliaVase", {
    _id: "mock-aurelia-vase-ivory",
    slug: "aurelia-vase-ivory",
    name: "LuxeEra Aurelia Vase",
    kind: "piece",
    collection: "signature",
    finish: "ivory",
    price: 250,
    images: [IMG.aureliaVase, IMG.sig2],
    tags: ["Vase", "Ivory"],
    isFeatured: false,
  }),
  withCopy("haloVase", {
    _id: "mock-halo-vase-ivory",
    slug: "halo-vase-ivory",
    name: "LuxeEra Halo Vase",
    kind: "piece",
    collection: "halo",
    finish: "ivory",
    price: 150,
    images: [IMG.haloVase, IMG.halo3],
    tags: ["Vase", "Ivory"],
    isFeatured: false,
  }),
  withCopy("jadeVase", {
    _id: "mock-jade-vase-ivory",
    slug: "jade-vase-ivory",
    name: "LuxeEra Jade Vase",
    kind: "piece",
    collection: "lumi",
    finish: "ivory",
    price: 100,
    images: [IMG.jadeVase, IMG.lumi2],
    tags: ["Vase", "Ivory"],
    isFeatured: false,
  }),
  withCopy("lumiBox", {
    _id: "mock-lumi-box-ivory",
    slug: "lumi-box-ivory",
    name: "LuxeEra Lumi Box",
    kind: "piece",
    collection: "lumi",
    finish: "ivory",
    price: 150,
    images: [IMG.lumiBox, IMG.lumiSet2, IMG.lumi3],
    tags: ["Box", "Ivory"],
    isFeatured: false,
  }),
];

export const mockProducts = [
  ...obsidianSets,
  ...ivorySets,
  ...obsidianPieces,
  ...ivoryPieces,
];

export function getMockProduct(slug) {
  return mockProducts.find((p) => p.slug === slug) || null;
}

export function getMockProductById(id) {
  return mockProducts.find((p) => p._id === id) || null;
}

export function listMockProducts({ sort = "newest", collection = "all" } = {}) {
  let items = [...mockProducts];

  if (collection === "sets") {
    items = items.filter((p) => p.kind === "set");
  } else if (collection === "pieces") {
    items = items.filter((p) => p.kind === "piece");
  } else if (collection === "obsidian") {
    items = items.filter((p) => p.finish === "obsidian");
  } else if (collection === "ivory") {
    items = items.filter((p) => p.finish === "ivory");
  } else if (collection && collection !== "all") {
    items = items.filter((p) => p.collection === collection);
  }

  switch (sort) {
    case "price_asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "newest":
    default:
      items.sort((a, b) => {
        if (a.finish !== b.finish) return a.finish === "obsidian" ? -1 : 1;
        if (a.kind !== b.kind) return a.kind === "set" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      break;
  }

  return items;
}

export function isMockCatalogEnabled() {
  return process.env.NEXT_PUBLIC_USE_MOCK_CATALOG !== "false";
}

export function getRelatedProducts(slug, limit = 4) {
  const current = getMockProduct(slug);
  if (!current) return [];
  return mockProducts
    .filter(
      (p) =>
        p.slug !== slug &&
        (p.collection === current.collection || p.kind === current.kind) &&
        p.finish === current.finish,
    )
    .slice(0, limit);
}

export function getSetSavings(product) {
  if (!product?.setContents?.length) return null;
  const separate = product.setContents.reduce((sum, i) => sum + i.price, 0);
  const save = separate - product.price;
  return save > 0 ? save : null;
}

export function getProductFinishLabel(product) {
  if (!product?.finish) return null;
  return product.finish.charAt(0).toUpperCase() + product.finish.slice(1);
}

export function getProductIdealFor(product) {
  if (Array.isArray(product?.idealFor) && product.idealFor.length > 0) {
    return product.idealFor;
  }
  return [];
}
