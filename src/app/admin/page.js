"use client";

import { useEffect, useMemo, useState } from "react";
import { api, getToken, removeToken, setToken } from "../../lib/api";
import { formatRand } from "../../lib/pricing";

// ── Icons ────────────────────────────────────────────────────────────────────

function Icon({ d, className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const ICONS = {
  menu: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  dashboard: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  products: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
  categories: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3zM6 6h.008v.008H6V6z",
  orders: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z",
  revenue: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  logout: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9",
  plus: "M12 4.5v15m7.5-7.5h-15",
  x: "M6 18L18 6M6 6l12 12",
  check: "M4.5 12.75l6 6 9-13.5",
};

// ── Status helpers ────────────────────────────────────────────────────────────

const ORDER_STATUSES = ["processing", "confirmed", "shipped", "delivered", "cancelled"];

function orderStatusCls(s) {
  const m = {
    delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    shipped:   "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    confirmed: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
    processing:"bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  };
  return m[String(s).toLowerCase()] || "bg-neutral-100 text-neutral-500";
}

function paymentStatusCls(s) {
  const m = {
    paid:    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    failed:  "bg-red-50 text-red-700 ring-1 ring-red-200",
    pending: "bg-neutral-100 text-neutral-400",
  };
  return m[String(s).toLowerCase()] || "bg-neutral-100 text-neutral-400";
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl text-sm font-medium
      ${type === "error" ? "bg-red-600 text-white" : "bg-neutral-900 text-white"}`}>
      <Icon d={type === "error" ? ICONS.x : ICONS.check} className="w-4 h-4 shrink-0" />
      {message}
      <button onClick={onDismiss} className="ml-1 opacity-60 hover:opacity-100 transition">
        <Icon d={ICONS.x} className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
          <button onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition">
            <Icon d={ICONS.x} className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Form primitives ───────────────────────────────────────────────────────────

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  "w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 " +
  "focus:border-neutral-900 focus:bg-white focus:outline-none transition";

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, iconPath, accentBg, accentText }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white border border-neutral-100 shadow-sm px-5 py-4">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentBg}`}>
        <Icon d={iconPath} className={`w-5 h-5 ${accentText}`} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 truncate">{label}</div>
        <div className="mt-0.5 text-2xl font-bold tracking-tight text-neutral-900">{value}</div>
      </div>
    </div>
  );
}

// ── Sidebar nav item ──────────────────────────────────────────────────────────

function NavItem({ label, iconPath, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
        ${active ? "bg-white/15 text-white" : "text-neutral-400 hover:bg-white/8 hover:text-neutral-200"}`}>
      <Icon d={iconPath} className="w-4 h-4 shrink-0" />
      {label}
    </button>
  );
}

// ── Table header cell ─────────────────────────────────────────────────────────

function TH({ children, right }) {
  return (
    <th className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400 ${right ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}

// ── Empty form states ─────────────────────────────────────────────────────────

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

function defaultVariants() {
  return DEFAULT_SIZES.map(s => ({ size: s, stock: 0, colour: "", sku: "" }));
}

function emptyProduct() {
  return { name: "", description: "", price: "", category: "", collection: "", tags: "", variants: defaultVariants(), newImages: [], existingImages: [], imagesToRemove: [] };
}
function emptyCategory() {
  return { name: "", description: "", video: "", existingImage: null, newImage: null, removeImage: false, newVideo: null, removeVideo: false };
}

/** Normalize populated or raw Mongoose refs for form selects (avoids sending "" as category on save). */
function mongoRefId(ref) {
  if (ref == null) return "";
  if (typeof ref === "object" && ref._id != null) return String(ref._id);
  return String(ref);
}

// ── Sidebar nav items ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: "dashboard",  label: "Dashboard",  icon: ICONS.dashboard  },
  { key: "products",   label: "Products",   icon: ICONS.products   },
  { key: "categories", label: "Categories", icon: ICONS.categories },
  { key: "orders",     label: "Orders",     icon: ICONS.orders     },
];

function SidebarContent({ tab, setTab, user, handleLogout, onNav }) {
  return (
    <>
      <div className="mb-7 flex items-center gap-2.5 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
          <span className="text-sm font-black tracking-tighter text-neutral-900">A</span>
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">ANTI</span>
      </div>
      <nav className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.key} label={item.label} iconPath={item.icon}
            active={tab === item.key} onClick={() => { setTab(item.key); onNav(); }} />
        ))}
      </nav>
      <div className="border-t border-white/10 pt-4">
        <div className="mb-2 px-3">
          <div className="truncate text-xs font-medium text-white">{user.email}</div>
          <div className="text-[11px] text-neutral-500">Administrator</div>
        </div>
        <button onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-neutral-400 transition hover:bg-white/10 hover:text-white">
          <Icon d={ICONS.logout} className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  // Auth
  const [authFields, setAuthFields] = useState({ email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // Navigation
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [orders, setOrders] = useState([]);

  // Notifications
  const [toastState, setToastState] = useState(null);

  // Modals
  const [productModal, setProductModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [orderModal, setOrderModal] = useState(null);

  // Editing targets
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Forms
  const [productForm, setProductForm] = useState(emptyProduct());
  const [categoryForm, setCategoryForm] = useState(emptyCategory());
  const [orderForm, setOrderForm] = useState({ orderStatus: "", trackingNumber: "" });

  // Search / filter
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // ── Bootstrap ───────────────────────────────────────────────────────────────

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!getToken()) { if (alive) setBooting(false); return; }
      try {
        const me = await api.me();
        if (!alive) return;
        if (!me.user?.isAdmin) { removeToken(); setAuthError("This account is not an admin."); }
        else { setUser(me.user); await refresh(); }
      } catch { removeToken(); }
      finally { if (alive) setBooting(false); }
    })();
    return () => { alive = false; };
  }, []);

  async function refresh() {
    const [cats, prods, cols, ords] = await Promise.all([
      api.listCategories(),
      api.listProducts("?page=1&limit=100&sort=newest"),
      api.listCollections(),
      api.adminOrders("?page=1&limit=50"),
    ]);
    setCategories(cats.categories || []);
    setProducts(prods.products || []);
    setCollections(cols.collections || []);
    setOrders(ords.orders || []);
  }

  function showToast(message, type = "success") {
    setToastState({ message, type });
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await api.login(authFields);
      setToken(res.token);
      const me = await api.me();
      if (!me.user?.isAdmin) { removeToken(); throw new Error("Not an admin account."); }
      setUser(me.user);
      await refresh();
    } catch (err) {
      setAuthError(err.message || "Login failed");
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    removeToken();
    setUser(null);
    setProducts([]); setCategories([]); setCollections([]); setOrders([]);
  }

  // ── Products ────────────────────────────────────────────────────────────────

  function openCreateProduct() {
    setEditingProduct(null);
    setProductForm(emptyProduct());
    setProductModal(true);
  }

  function openEditProduct(p) {
    setEditingProduct(p);
    setProductForm({
      name: p.name || "",
      description: p.description || "",
      price: String((Number(p.price || 0) / 100).toFixed(2)),
      category: mongoRefId(p.category),
      collection: mongoRefId(p.collection),
      tags: (p.tags || []).join(", "),
      variants: DEFAULT_SIZES.map(s => {
        const found = (p.variants || []).find(v => v.size === s);
        return { size: s, stock: found ? Number(found.stock ?? 0) : 0, colour: found?.colour || "", sku: found?.sku || "" };
      }),
      newImages: [],
      existingImages: (p.images || []).map(img =>
        typeof img === "string" ? { url: img, publicId: null } : img
      ),
      imagesToRemove: [],
    });
    setProductModal(true);
  }

  async function submitProduct(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", productForm.name);
      fd.append("description", productForm.description);
      fd.append("price", String(Math.round(Number(productForm.price || 0) * 100)));
      fd.append("category", productForm.category);
      if (productForm.collection) fd.append("collection", productForm.collection);
      fd.append("tags", JSON.stringify(productForm.tags.split(",").map(t => t.trim()).filter(Boolean)));
      fd.append("variants", JSON.stringify(
        (productForm.variants || []).map(v => ({
          size: v.size,
          colour: v.colour || undefined,
          stock: Number(v.stock || 0),
          sku: v.sku || undefined,
        }))
      ));
      for (const file of (productForm.newImages || [])) {
        fd.append("images", file);
      }
      if (editingProduct) {
        // Send exact list of existing image URLs to keep — backend removes anything not in this list
        fd.append("keepImageUrls", JSON.stringify((productForm.existingImages || []).map(img => img.url)));
      }

      if (editingProduct) {
        await api.updateProduct(editingProduct._id, fd);
        showToast("Product updated");
      } else {
        await api.createProduct(fd);
        showToast("Product created");
      }
      setProductModal(false);
      await refresh();
    } catch (err) {
      showToast(err.message || "Failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function archiveProduct(id) {
    if (!confirm("Archive this product?")) return;
    try {
      await api.deleteProduct(id);
      showToast("Product archived");
      await refresh();
    } catch (err) {
      showToast(err.message || "Failed", "error");
    }
  }

  // ── Categories ──────────────────────────────────────────────────────────────

  function openCreateCategory() {
    setEditingCategory(null);
    setCategoryForm(emptyCategory());
    setCategoryModal(true);
  }

  function openEditCategory(c) {
    setEditingCategory(c);
    const img = c.image ? (typeof c.image === "string" ? { url: c.image, publicId: null } : c.image) : null;
    setCategoryForm({
      name: c.name || "",
      description: c.description || "",
      video: c.video || "",
      existingImage: img,
      newImage: null,
      removeImage: false,
      newVideo: null,
      removeVideo: false,
    });
    setCategoryModal(true);
  }

  async function submitCategory(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", categoryForm.name);
      fd.append("description", categoryForm.description);
      if (categoryForm.newImage) fd.append("image", categoryForm.newImage);
      if (editingCategory && categoryForm.removeImage) fd.append("removeImage", "true");
      if (categoryForm.newVideo) {
        fd.append("video", categoryForm.newVideo);
      } else if (editingCategory && categoryForm.removeVideo) {
        fd.append("removeVideo", "true");
      } else if (!categoryForm.newVideo) {
        fd.append("video", categoryForm.video || "");
      }

      if (editingCategory) {
        await api.updateCategory(editingCategory._id, fd);
        showToast("Category updated");
      } else {
        await api.createCategory(fd);
        showToast("Category created");
      }
      setCategoryModal(false);
      await refresh();
    } catch (err) {
      showToast(err.message || "Failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function archiveCategory(id) {
    if (!confirm("Archive this category?")) return;
    try {
      await api.deleteCategory(id);
      showToast("Category archived");
      await refresh();
    } catch (err) {
      showToast(err.message || "Failed", "error");
    }
  }

  // ── Orders ──────────────────────────────────────────────────────────────────

  function openOrderModal(order) {
    setOrderModal(order);
    setOrderForm({ orderStatus: order.orderStatus || "", trackingNumber: order.trackingNumber || "" });
  }

  async function submitOrder(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.adminUpdateOrder(orderModal._id, orderForm);
      showToast("Order updated");
      setOrderModal(null);
      await refresh();
    } catch (err) {
      showToast(err.message || "Failed", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived ─────────────────────────────────────────────────────────────────

  const totalRevenue = useMemo(
    () => orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + Number(o.total || 0), 0),
    [orders],
  );
  const pendingCount = useMemo(
    () => orders.filter(o => ["processing", "confirmed"].includes(o.orderStatus)).length,
    [orders],
  );

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(p => p.name?.toLowerCase().includes(q) || p.slug?.toLowerCase().includes(q));
  }, [products, productSearch]);

  const filteredOrders = useMemo(() => {
    let res = orders;
    if (orderStatusFilter) res = res.filter(o => o.orderStatus === orderStatusFilter);
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      res = res.filter(o =>
        o.orderNumber?.toLowerCase().includes(q) ||
        o.guestEmail?.toLowerCase().includes(q) ||
        o.user?.email?.toLowerCase().includes(q),
      );
    }
    return res;
  }, [orders, orderSearch, orderStatusFilter]);

  // ── Render: loading ──────────────────────────────────────────────────────────

  if (booting) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-neutral-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/anti_images/logo1.jpeg" alt="ANTI" className="h-36 w-28 animate-pulse object-contain opacity-90" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  // ── Render: login ────────────────────────────────────────────────────────────

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900">
              <span className="text-xl font-bold tracking-tighter text-white">A</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Admin Dashboard</h1>
            <p className="mt-1.5 text-sm text-neutral-500">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleLogin}
            className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
            <Field label="Email">
              <input type="email" className={INPUT_CLS} placeholder="admin@shopanti.online"
                value={authFields.email}
                onChange={e => setAuthFields(p => ({ ...p, email: e.target.value }))}
                required autoFocus />
            </Field>
            <Field label="Password">
              <input type="password" className={INPUT_CLS} placeholder="••••••••"
                value={authFields.password}
                onChange={e => setAuthFields(p => ({ ...p, password: e.target.value }))}
                required />
            </Field>
            {authError && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{authError}</p>
            )}
            <button type="submit" disabled={authLoading}
              className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 active:bg-neutral-950 disabled:opacity-50">
              {authLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Render: dashboard ────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-100 font-sans">

      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-[#111] px-3 py-5">
        <SidebarContent tab={tab} setTab={setTab} user={user} handleLogout={handleLogout} onNav={() => {}} />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex w-64 shrink-0 flex-col bg-[#111] px-3 py-5 shadow-2xl">
            <SidebarContent tab={tab} setTab={setTab} user={user} handleLogout={handleLogout} onNav={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-3 md:px-6">
          <div className="flex items-center gap-2">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Icon d={ICONS.menu} className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold capitalize text-neutral-900">{tab}</h1>
          </div>
          <div className="flex items-center gap-2">
            {tab === "products" && (
              <button onClick={openCreateProduct}
                className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 md:px-4 md:text-sm">
                <Icon d={ICONS.plus} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Product</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
            {tab === "categories" && (
              <button onClick={openCreateCategory}
                className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 md:px-4 md:text-sm">
                <Icon d={ICONS.plus} className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Category</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6">

          {/* ── Dashboard ─────────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                <StatCard label="Revenue" value={formatRand(totalRevenue)}
                  iconPath={ICONS.revenue} accentBg="bg-emerald-100" accentText="text-emerald-600" />
                <StatCard label="Total Orders" value={orders.length}
                  iconPath={ICONS.orders} accentBg="bg-blue-100" accentText="text-blue-600" />
                <StatCard label="Products" value={products.length}
                  iconPath={ICONS.products} accentBg="bg-violet-100" accentText="text-violet-600" />
                <StatCard label="Pending" value={pendingCount}
                  iconPath={ICONS.dashboard} accentBg="bg-amber-100" accentText="text-amber-600" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
                <div className="border-b border-neutral-100 px-5 py-4">
                  <h2 className="text-sm font-semibold text-neutral-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/80">
                      <TH>Order</TH><TH>Customer</TH><TH>Amount</TH><TH>Status</TH><TH>Payment</TH>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {orders.slice(0, 8).map(o => (
                      <tr key={o._id}
                        className="cursor-pointer transition hover:bg-neutral-50"
                        onClick={() => { setTab("orders"); }}>
                        <td className="px-5 py-3.5 font-mono text-xs text-neutral-600">{o.orderNumber}</td>
                        <td className="px-5 py-3.5 text-xs text-neutral-500">{o.guestEmail || o.user?.email || "—"}</td>
                        <td className="px-5 py-3.5 font-semibold text-neutral-900">{formatRand(o.total)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${orderStatusCls(o.orderStatus)}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${paymentStatusCls(o.paymentStatus)}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center text-sm text-neutral-400">
                          No orders yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Products ──────────────────────────────────────────────── */}
          {tab === "products" && (
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3.5">
                <input className="w-full max-w-xs rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition"
                  placeholder="Search products…"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)} />
                <span className="ml-auto shrink-0 text-xs text-neutral-400">{filteredProducts.length} items</span>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80">
                    <TH>Product</TH><TH>Category</TH><TH>Price</TH><TH>Stock</TH><TH right>Actions</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filteredProducts.map(p => {
                    const stock = (p.variants || []).reduce((s, v) => s + Number(v.stock || 0), 0);
                    const thumb = p.images?.[0]?.url || p.images?.[0] || null;
                    return (
                      <tr key={p._id} className="transition hover:bg-neutral-50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100 border border-neutral-200">
                              {thumb ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={thumb} alt={p.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-neutral-200" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-neutral-900 truncate">{p.name}</div>
                              <div className="font-mono text-[11px] text-neutral-400 truncate">{p.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-neutral-500">{p.category?.name || "—"}</td>
                        <td className="px-5 py-3.5 font-semibold text-neutral-900">{formatRand(p.price)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-sm font-semibold ${stock < 3 ? "text-red-500" : "text-neutral-700"}`}>
                            {stock}
                          </span>
                          {stock < 3 && stock > 0 && (
                            <span className="ml-1.5 text-[10px] text-red-400">low</span>
                          )}
                          {stock === 0 && (
                            <span className="ml-1.5 text-[10px] text-red-500">out</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditProduct(p)}
                              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100">
                              Edit
                            </button>
                            <button onClick={() => archiveProduct(p._id)}
                              className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
                              Archive
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-neutral-400">
                        {productSearch ? "No products match your search" : "No products yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {/* ── Categories ────────────────────────────────────────────── */}
          {tab === "categories" && (
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80">
                    <TH>Category</TH><TH>Slug</TH><TH>Description</TH><TH right>Actions</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {categories.map(c => {
                    const thumb = c.image?.url || c.image || null;
                    return (
                    <tr key={c._id} className="transition hover:bg-neutral-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
                            {thumb ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb} alt={c.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-neutral-200" />
                            )}
                          </div>
                          <span className="font-medium text-neutral-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-[11px] text-neutral-400">{c.slug}</td>
                      <td className="max-w-xs truncate px-5 py-3 text-xs text-neutral-500">{c.description || "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditCategory(c)}
                            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100">
                            Edit
                          </button>
                          <button onClick={() => archiveCategory(c._id)}
                            className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  ); })}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center text-sm text-neutral-400">
                        No categories yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {/* ── Orders ────────────────────────────────────────────────── */}
          {tab === "orders" && (
            <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-3 border-b border-neutral-100 px-5 py-3.5">
                <input className="w-full max-w-xs rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition"
                  placeholder="Search orders…"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)} />
                <select
                  className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none transition"
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}>
                  <option value="">All statuses</option>
                  {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="ml-auto shrink-0 text-xs text-neutral-400">{filteredOrders.length} orders</span>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80">
                    <TH>Order #</TH><TH>Customer</TH><TH>Amount</TH><TH>Status</TH><TH>Payment</TH><TH right>Action</TH>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filteredOrders.map(o => (
                    <tr key={o._id} className="transition hover:bg-neutral-50">
                      <td className="px-5 py-3.5 font-mono text-xs font-medium text-neutral-700">{o.orderNumber}</td>
                      <td className="px-5 py-3.5 text-xs text-neutral-500 max-w-[160px] truncate">
                        {o.guestEmail || o.user?.email || "—"}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-neutral-900">{formatRand(o.total)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${orderStatusCls(o.orderStatus)}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${paymentStatusCls(o.paymentStatus)}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => openOrderModal(o)}
                          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100">
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">
                        {orderSearch || orderStatusFilter ? "No orders match your filters" : "No orders yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Product modal ────────────────────────────────────────────────────── */}
      {productModal && (
        <Modal title={editingProduct ? "Edit Product" : "New Product"} onClose={() => setProductModal(false)}>
          <form onSubmit={submitProduct} className="space-y-4">
            <Field label="Name">
              <input className={INPUT_CLS} placeholder="Product name" value={productForm.name}
                onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} required autoFocus />
            </Field>
            <Field label="Description">
              <textarea className={INPUT_CLS} rows={3} placeholder="Describe the product"
                value={productForm.description}
                onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (ZAR)">
                <input className={INPUT_CLS} type="number" min="0" step="0.01" placeholder="0.00"
                  value={productForm.price}
                  onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} required />
              </Field>
              <Field label="Category">
                <select className={INPUT_CLS + " cursor-pointer"} value={productForm.category}
                  onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))} required>
                  <option value="">Select…</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Collection (optional)">
              <select className={INPUT_CLS + " cursor-pointer"} value={productForm.collection}
                onChange={e => setProductForm(p => ({ ...p, collection: e.target.value }))}>
                <option value="">None</option>
                {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <input className={INPUT_CLS} placeholder="streetwear, limited, unisex"
                value={productForm.tags}
                onChange={e => setProductForm(p => ({ ...p, tags: e.target.value }))} />
            </Field>
            <Field label="Size Variants & Stock">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400 w-10">Size</th>
                      <th className="pb-2 pl-2 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Stock</th>
                      <th className="pb-2 pl-2 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Colour</th>
                      <th className="pb-2 pl-2 text-left text-[10px] font-semibold uppercase tracking-widest text-neutral-400">SKU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {(productForm.variants || []).map((v, idx) => (
                      <tr key={v.size}>
                        <td className="py-1.5 pr-2">
                          <span className="inline-flex h-7 w-9 items-center justify-center rounded-lg bg-neutral-100 text-xs font-bold text-neutral-700">
                            {v.size}
                          </span>
                        </td>
                        <td className="py-1.5 pl-2 pr-2">
                          <input
                            type="number" min="0"
                            className="w-20 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-sm text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none transition"
                            value={v.stock}
                            onChange={e => setProductForm(p => {
                              const variants = [...p.variants];
                              variants[idx] = { ...variants[idx], stock: Number(e.target.value) };
                              return { ...p, variants };
                            })}
                          />
                        </td>
                        <td className="py-1.5 pl-2 pr-2">
                          <input
                            className="w-24 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition"
                            placeholder="Black"
                            value={v.colour}
                            onChange={e => setProductForm(p => {
                              const variants = [...p.variants];
                              variants[idx] = { ...variants[idx], colour: e.target.value };
                              return { ...p, variants };
                            })}
                          />
                        </td>
                        <td className="py-1.5 pl-2">
                          <input
                            className="w-28 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none transition"
                            placeholder={`ANTI-${v.size}`}
                            value={v.sku}
                            onChange={e => setProductForm(p => {
                              const variants = [...p.variants];
                              variants[idx] = { ...variants[idx], sku: e.target.value };
                              return { ...p, variants };
                            })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Field>
            <Field label="Images">
              {/* Existing images */}
              {productForm.existingImages?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {productForm.existingImages.map((img, idx) => (
                    <div key={idx} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() => setProductForm(p => ({
                          ...p,
                          existingImages: p.existingImages.filter((_, i) => i !== idx),
                          imagesToRemove: img.publicId
                            ? [...p.imagesToRemove, img.publicId]
                            : p.imagesToRemove,
                        }))}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                      >
                        <Icon d={ICONS.x} className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New image previews */}
              {productForm.newImages?.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {productForm.newImages.map((file, idx) => (
                    <div key={idx} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-neutral-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        aria-label="Remove new image"
                        onClick={() => setProductForm(p => ({
                          ...p,
                          newImages: p.newImages.filter((_, i) => i !== idx),
                        }))}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                      >
                        <Icon d={ICONS.x} className="w-5 h-5 text-white" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 py-0.5 text-center text-[9px] text-white">new</div>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                className="text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-neutral-700 hover:file:bg-neutral-200 transition"
                onChange={e => {
                  const files = Array.from(e.target.files || []);
                  if (files.length) setProductForm(p => ({ ...p, newImages: [...(p.newImages || []), ...files] }));
                  e.target.value = "";
                }}
              />
            </Field>
            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <button type="button" onClick={() => setProductModal(false)}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50">
                {submitting ? "Saving…" : editingProduct ? "Save changes" : "Create product"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Category modal ───────────────────────────────────────────────────── */}
      {categoryModal && (
        <Modal title={editingCategory ? "Edit Category" : "New Category"} onClose={() => setCategoryModal(false)}>
          <form onSubmit={submitCategory} className="space-y-4">
            <Field label="Name">
              <input className={INPUT_CLS} placeholder="Category name" value={categoryForm.name}
                onChange={e => setCategoryForm(p => ({ ...p, name: e.target.value }))} required autoFocus />
            </Field>
            <Field label="Description">
              <textarea className={INPUT_CLS} rows={3} placeholder="Short description"
                value={categoryForm.description}
                onChange={e => setCategoryForm(p => ({ ...p, description: e.target.value }))} />
            </Field>
            <Field label="Image">
              {/* Existing image */}
              {categoryForm.existingImage && !categoryForm.removeImage && !categoryForm.newImage && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={categoryForm.existingImage.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => setCategoryForm(p => ({ ...p, removeImage: true }))}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                    >
                      <Icon d={ICONS.x} className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <span className="text-xs text-neutral-400">Hover to remove</span>
                </div>
              )}

              {/* New image preview */}
              {categoryForm.newImage && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(categoryForm.newImage)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove new image"
                      onClick={() => setCategoryForm(p => ({ ...p, newImage: null }))}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                    >
                      <Icon d={ICONS.x} className="w-5 h-5 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 py-0.5 text-center text-[9px] text-white">new</div>
                  </div>
                  <span className="text-xs text-neutral-400">Hover to remove</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                className="text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-neutral-700 hover:file:bg-neutral-200 transition"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  if (file) setCategoryForm(p => ({ ...p, newImage: file, removeImage: false }));
                  e.target.value = "";
                }}
              />
            </Field>

            <Field label="Video (upload or URL)">
              {/* Existing uploaded video */}
              {categoryForm.video && !categoryForm.removeVideo && !categoryForm.newVideo && (
                <div className="mb-3">
                  <div className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    <video
                      src={categoryForm.video}
                      className="w-full rounded-xl object-cover"
                      style={{ maxHeight: 140 }}
                      muted loop playsInline autoPlay
                    />
                    <button
                      type="button"
                      aria-label="Remove video"
                      onClick={() => setCategoryForm(p => ({ ...p, removeVideo: true, video: "" }))}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                    >
                      <Icon d={ICONS.x} className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">Hover to remove</p>
                </div>
              )}

              {/* New video file preview */}
              {categoryForm.newVideo && (
                <div className="mb-3">
                  <div className="group relative overflow-hidden rounded-xl border border-blue-200 bg-neutral-100">
                    <video
                      src={URL.createObjectURL(categoryForm.newVideo)}
                      className="w-full rounded-xl object-cover"
                      style={{ maxHeight: 140 }}
                      muted loop playsInline autoPlay
                    />
                    <button
                      type="button"
                      aria-label="Remove new video"
                      onClick={() => setCategoryForm(p => ({ ...p, newVideo: null }))}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100"
                    >
                      <Icon d={ICONS.x} className="w-5 h-5 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 py-0.5 text-center text-[9px] text-white">new</div>
                  </div>
                </div>
              )}

              {/* Upload video file */}
              {!categoryForm.newVideo && (
                <input
                  type="file"
                  accept="video/mp4,video/mov,video/webm,video/avi,video/*"
                  className="text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-neutral-700 hover:file:bg-neutral-200 transition"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    if (file) setCategoryForm(p => ({ ...p, newVideo: file, removeVideo: false, video: "" }));
                    e.target.value = "";
                  }}
                />
              )}

              {/* Fallback: paste URL */}
              {!categoryForm.newVideo && !categoryForm.video && (
                <input
                  className={INPUT_CLS + " mt-2"}
                  placeholder="Or paste a video URL…"
                  value={categoryForm.video}
                  onChange={e => setCategoryForm(p => ({ ...p, video: e.target.value }))}
                />
              )}
            </Field>
            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <button type="button" onClick={() => setCategoryModal(false)}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50">
                {submitting ? "Saving…" : editingCategory ? "Save changes" : "Create category"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Order modal ──────────────────────────────────────────────────────── */}
      {orderModal && (
        <Modal title={`Order · ${orderModal.orderNumber}`} onClose={() => setOrderModal(null)}>
          <form onSubmit={submitOrder} className="space-y-4">
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm space-y-2">
              {[
                ["Amount", formatRand(orderModal.total)],
                ["Customer", orderModal.guestEmail || orderModal.user?.email || "—"],
                ["Items", (orderModal.items || []).length],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-neutral-400">{label}</span>
                  <span className="font-medium text-neutral-800">{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Payment</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${paymentStatusCls(orderModal.paymentStatus)}`}>
                  {orderModal.paymentStatus}
                </span>
              </div>
            </div>
            <Field label="Order Status">
              <select className={INPUT_CLS + " cursor-pointer"} value={orderForm.orderStatus}
                onChange={e => setOrderForm(p => ({ ...p, orderStatus: e.target.value }))}>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Tracking Number (optional)">
              <input className={INPUT_CLS} placeholder="e.g. COURIERZA123456"
                value={orderForm.trackingNumber}
                onChange={e => setOrderForm(p => ({ ...p, trackingNumber: e.target.value }))} />
            </Field>
            <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <button type="button" onClick={() => setOrderModal(null)}
                className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50">
                {submitting ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Toast */}
      {toastState && (
        <Toast message={toastState.message} type={toastState.type} onDismiss={() => setToastState(null)} />
      )}
    </div>
  );
}
