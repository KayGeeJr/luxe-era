const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api-proxy";
const LOCAL_API_FALLBACK = "http://localhost:5001/api";

const TOKEN_KEY = "anti_token";
const SESSION_KEY = "anti_session_id";

function isBrowser() {
  return typeof window !== "undefined";
}

export function setToken(token) {
  if (!isBrowser()) return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getToken() {
  if (!isBrowser()) return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function removeToken() {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getSessionId() {
  if (!isBrowser()) return "";
  let existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  // Small stable guest ID for cart continuity.
  existing = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(SESSION_KEY, existing);
  return existing;
}

export function setSessionId(sessionId) {
  if (!isBrowser()) return;
  if (sessionId) {
    localStorage.setItem(SESSION_KEY, sessionId);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  const hasJsonBody = options.body && typeof options.body === "object" && !(options.body instanceof FormData);
  if (hasJsonBody) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // For guest cart routes, server accepts x-session-id.
  const sessionId = getSessionId();
  if (sessionId && !headers["x-session-id"]) {
    headers["x-session-id"] = sessionId;
  }

  async function doFetch(baseUrl) {
    return fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      body: hasJsonBody ? JSON.stringify(options.body) : options.body,
    });
  }

  let response;
  let usedBase = API_BASE;
  try {
    response = await doFetch(API_BASE);
  } catch (err) {
    // If proxy path fails, attempt direct local backend as a dev fallback.
    if (API_BASE.startsWith("/")) {
      try {
        response = await doFetch(LOCAL_API_FALLBACK);
        usedBase = LOCAL_API_FALLBACK;
      } catch {
        const error = new Error(
          `Could not reach API at ${API_BASE} or ${LOCAL_API_FALLBACK}. Ensure backend is running on port 5001 and restart frontend dev server.`,
        );
        error.cause = err;
        throw error;
      }
    } else {
      const error = new Error(
        `Could not reach API at ${API_BASE}. Ensure backend is running on port 5001 and restart frontend dev server.`,
      );
      error.cause = err;
      throw error;
    }
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    // Proxy-specific fallback: retry direct backend for non-OK rewrites.
    if (usedBase === API_BASE && API_BASE.startsWith("/") && response.status >= 500) {
      try {
        const fallbackResponse = await doFetch(LOCAL_API_FALLBACK);
        if (fallbackResponse.ok) {
          const fallbackType = fallbackResponse.headers.get("content-type") || "";
          return fallbackType.includes("application/json")
            ? await fallbackResponse.json()
            : await fallbackResponse.text();
        }
      } catch {
        // keep original error handling below
      }
    }

    // Auto-clear expired / invalid token so user gets prompted to log in again
    if (response.status === 401) {
      removeToken();
    }

    const message = isJson ? payload?.message || "Request failed" : payload || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const api = {
  health: () => apiFetch("/health"),
  register: (data) => apiFetch("/auth/register", { method: "POST", body: data }),
  login: (data) => apiFetch("/auth/login", { method: "POST", body: data }),
  me: () => apiFetch("/auth/me"),
  updateProfile: (data) => apiFetch("/auth/update-profile", { method: "PUT", body: data }),
  addAddress: (data) => apiFetch("/auth/address", { method: "POST", body: data }),
  forgotPassword: (data) => apiFetch("/auth/forgot-password", { method: "POST", body: data }),
  resetPassword: (data) => apiFetch("/auth/reset-password", { method: "POST", body: data }),
  listProducts: (query = "") => apiFetch(`/products${query}`),
  getProduct: (slug) => apiFetch(`/products/${slug}`),
  createProduct: (formData) => apiFetch("/products", { method: "POST", body: formData }),
  updateProduct: (id, formData) => apiFetch(`/products/${id}`, { method: "PUT", body: formData }),
  deleteProduct: (id) => apiFetch(`/products/${id}`, { method: "DELETE" }),
  updateStock: (id, data) => apiFetch(`/products/${id}/stock`, { method: "PUT", body: data }),
  listCategories: () => apiFetch("/categories"),
  getCategoryBySlug: (slug) => apiFetch(`/categories/${slug}`),
  createCategory: (formData) => apiFetch("/categories", { method: "POST", body: formData }),
  updateCategory: (id, formData) => apiFetch(`/categories/${id}`, { method: "PUT", body: formData }),
  deleteCategory: (id) => apiFetch(`/categories/${id}`, { method: "DELETE" }),
  listCollections: () => apiFetch("/collections"),
  getCart: () => apiFetch("/cart"),
  addToCart: (data) => apiFetch("/cart/add", { method: "POST", body: data }),
  updateCart: (data) => apiFetch("/cart/update", { method: "PUT", body: data }),
  removeCartItem: (itemId) => apiFetch(`/cart/item/${itemId}`, { method: "DELETE" }),
  clearCart: () => apiFetch("/cart/clear", { method: "DELETE" }),
  mergeCart: (sessionId) => apiFetch("/cart/merge", { method: "POST", body: { sessionId } }),
  createOrder: (data) => apiFetch("/orders", { method: "POST", body: data }),
  myOrders: () => apiFetch("/orders/my-orders"),
  getOrder: (orderNumber, email) =>
    apiFetch(`/orders/${orderNumber}${email ? `?email=${encodeURIComponent(email)}` : ""}`),
  initiatePayment: (data) => apiFetch("/payment/initiate", { method: "POST", body: data }),
  adminDashboard: () => apiFetch("/admin/dashboard"),
  adminOrders: (query = "") => apiFetch(`/admin/orders${query}`),
  adminUpdateOrder: (id, data) => apiFetch(`/admin/orders/${id}`, { method: "PUT", body: data }),
  adminUsers: (query = "") => apiFetch(`/admin/users${query}`),
  adminInventory: () => apiFetch("/admin/inventory"),
  subscribeNewsletter: (data) => apiFetch("/newsletter/subscribe", { method: "POST", body: data }),
};
