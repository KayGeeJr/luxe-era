import { getMockProductById } from "../data/mockCatalog";
import { dispatchCartUpdated } from "./cartEvents";

const CART_KEY = "luxe_era_mock_cart";

function isBrowser() {
  return typeof window !== "undefined";
}

function readItems() {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeItems(items) {
  if (!isBrowser()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  dispatchCartUpdated();
}

export function getMockCartCount() {
  return readItems().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function emptyCart() {
  return { items: [], discount: 0, couponCode: null };
}

export function getMockCart() {
  return { success: true, cart: { ...emptyCart(), items: readItems() } };
}

export function addToMockCart({ productId, variantIndex = 0, quantity = 1 }) {
  const product = getMockProductById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const items = readItems();
  const idx = variantIndex ?? 0;
  const qty = Math.max(1, Number(quantity) || 1);
  const existing = items.find(
    (item) => item.product?._id === productId && item.variantIndex === idx,
  );

  if (existing) {
    existing.quantity += qty;
  } else {
    items.push({
      _id: `mock-item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        images: product.images,
        variants: product.variants || [],
      },
      variantIndex: idx,
      quantity: qty,
      price: product.price,
    });
  }

  writeItems(items);
  return getMockCart();
}

export function updateMockCart({ itemId, quantity }) {
  const items = readItems();
  const item = items.find((i) => i._id === itemId);
  if (!item) throw new Error("Item not found");

  const qty = Number(quantity);
  if (!qty || qty < 1) {
    writeItems(items.filter((i) => i._id !== itemId));
  } else {
    item.quantity = qty;
    writeItems(items);
  }
  return getMockCart();
}

export function removeMockCartItem(itemId) {
  writeItems(readItems().filter((i) => i._id !== itemId));
  return getMockCart();
}

export function clearMockCart() {
  writeItems([]);
  return getMockCart();
}
