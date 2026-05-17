/**
 * Static catalog for design preview (no backend).
 * Prices in whole ZAR — from Luxe Era Obsidian price list (@luxeera.homecollections).
 */

export const PRICE_LIST_IMAGE = "/images/price-list.png";
export const COLLECTION_LINE = "Obsidian";

export const MOCK_COLLECTIONS = [
  { slug: "all", label: "All" },
  { slug: "sets", label: "Sets" },
  { slug: "signature", label: "Signature" },
  { slug: "halo", label: "Halo" },
  { slug: "lumi", label: "Lumi" },
  { slug: "pieces", label: "Individual pieces" },
];

const IMG = {
  auraTray: "/images/products/aura-tray.jpg",
  miniAuraTray: "/images/products/mini-aura-tray.jpg",
  aureliaVase: "/images/products/aurelia-vase.jpg",
  haloVase: "/images/products/halo-vase.jpg",
  jadeVase: "/images/products/jade-vase.jpg",
  sig1: "/images/collections/signature/sig-1.jpg",
  sig2: "/images/collections/signature/sig-2.jpg",
  sig3: "/images/collections/signature/sig-3.jpg",
  sig4: "/images/collections/signature/sig-4.jpg",
  halo2: "/images/collections/halo/halo-2.jpg",
  halo3: "/images/collections/halo/halo-3.jpg",
  halo4: "/images/collections/halo/halo-4.jpg",
  lumi1: "/images/collections/lumi/lumi-1.jpg",
  lumi2: "/images/collections/lumi/lumi-2.jpg",
  lumi3: "/images/collections/lumi/lumi-3.jpg",
};

/** Obsidian sets — order matches official price list */
export const mockProducts = [
  {
    _id: "mock-halo-luxe-set",
    slug: "halo-luxe-set",
    name: "Halo Luxe Set",
    kind: "set",
    collection: "halo",
    price: 1000,
    description:
      "Obsidian Collection II — Aura tray plus Aurelia, Halo, and Jade vases. Four pieces, one vignette.",
    images: [IMG.halo2, IMG.auraTray, IMG.aureliaVase, IMG.haloVase, IMG.jadeVase],
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
    price: 900,
    description:
      "Obsidian Collection III — Aura tray, Halo and Jade vases, and the Lumi box for scent and keepsakes.",
    images: [IMG.lumi1, IMG.auraTray, IMG.haloVase, IMG.jadeVase],
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
    price: 750,
    description:
      "Obsidian Collection I — Mini Aura tray, Aurelia vase, and Lumi box. The signature entry to the line.",
    images: [IMG.sig3, IMG.miniAuraTray, IMG.aureliaVase, IMG.lumi1],
    tags: ["Set", "Obsidian", "Collection I"],
    isFeatured: true,
    setContents: [
      { name: "LuxeEra Mini Aura Tray", price: 250 },
      { name: "LuxeEra Aurelia Vase", price: 300 },
      { name: "LuxeEra Lumi Box", price: 200 },
    ],
  },
  {
    _id: "mock-aura-tray-large",
    slug: "aura-tray-large",
    name: "LuxeEra Aura Tray",
    kind: "piece",
    collection: "halo",
    price: 350,
    description:
      "Large Aura tray — cast concrete with embedded signature veining. For keys, jewellery, or a single sculptural object.",
    images: [IMG.auraTray, IMG.sig4],
    tags: ["Tray", "Obsidian"],
    isFeatured: true,
  },
  {
    _id: "mock-mini-aura-tray",
    slug: "mini-aura-tray",
    name: "LuxeEra Mini Aura Tray",
    kind: "piece",
    collection: "signature",
    price: 250,
    description:
      "Compact Aura form with the same hand-finished detail — ideal for bedside or desk.",
    images: [IMG.miniAuraTray, IMG.sig1],
    tags: ["Tray", "Mini", "Obsidian"],
    isFeatured: true,
  },
  {
    _id: "mock-aurelia-vase",
    slug: "aurelia-vase",
    name: "LuxeEra Aurelia Vase",
    kind: "piece",
    collection: "signature",
    price: 300,
    description:
      "Tall sculptural vase — diffuser, stem, or standalone object. Weighted in the hand, with signature veining.",
    images: [IMG.aureliaVase, IMG.sig2],
    tags: ["Vase", "Obsidian"],
    isFeatured: true,
  },
  {
    _id: "mock-halo-vase",
    slug: "halo-vase",
    name: "LuxeEra Halo Vase",
    kind: "piece",
    collection: "halo",
    price: 200,
    description:
      "Mid-scale vessel named for the halo ring that crowns each cast — scent or single stem.",
    images: [IMG.haloVase, IMG.halo3],
    tags: ["Vase", "Obsidian"],
    isFeatured: true,
  },
  {
    _id: "mock-jade-vase",
    slug: "jade-vase",
    name: "LuxeEra Jade Vase",
    kind: "piece",
    collection: "lumi",
    price: 150,
    description:
      "The smallest vase in the line — intimate scale, full signature finish.",
    images: [IMG.jadeVase, IMG.lumi2],
    tags: ["Vase", "Obsidian"],
    isFeatured: true,
  },
  {
    _id: "mock-lumi-box",
    slug: "lumi-box",
    name: "LuxeEra Lumi Box",
    kind: "piece",
    collection: "lumi",
    price: 200,
    description:
      "Lidded concrete form for scent, keepsakes, or ritual — hand-veined, made to be opened and admired.",
    images: [IMG.lumi1, IMG.lumi3, IMG.lumi2],
    tags: ["Box", "Scent", "Obsidian"],
    isFeatured: true,
  },
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
    .filter((p) => p.slug !== slug && (p.collection === current.collection || p.kind === current.kind))
    .slice(0, limit);
}

export function getSetSavings(product) {
  if (!product?.setContents?.length) return null;
  const separate = product.setContents.reduce((sum, i) => sum + i.price, 0);
  const save = separate - product.price;
  return save > 0 ? save : null;
}
