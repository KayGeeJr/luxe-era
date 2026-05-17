export const CART_UPDATED_EVENT = "luxe-cart-updated";

export function dispatchCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }
}
