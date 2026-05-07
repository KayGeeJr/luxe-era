"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getSessionId, getToken, removeToken, setToken } from "../../lib/api";
import LogoLoader from "../../components/LogoLoader";

function initialRegister() {
  return { name: "", email: "", password: "" };
}

function initialLogin() {
  return { email: "", password: "" };
}

export default function AccountPage() {
  const [registerData, setRegisterData] = useState(initialRegister());
  const [loginData, setLoginData] = useState(initialLogin());
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMeAndOrders() {
    const me = await api.me();
    setUser(me.user || null);
    const myOrders = await api.myOrders();
    setOrders(myOrders.orders || []);
  }

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        if (!getToken()) return;
        await loadMeAndOrders();
      } catch {
        removeToken();
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      const sessionId = getSessionId();
      const res = await api.register(registerData);
      setToken(res.token);
      if (sessionId) await api.mergeCart(sessionId).catch(() => {});
      await loadMeAndOrders();
      setRegisterData(initialRegister());
      setMessage("Registration successful");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      const sessionId = getSessionId();
      const res = await api.login(loginData);
      setToken(res.token);
      if (sessionId) await api.mergeCart(sessionId).catch(() => {});
      await loadMeAndOrders();
      setLoginData(initialLogin());
      setMessage("Logged in");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  async function handleProfileUpdate(e) {
    e.preventDefault();
    try {
      setError("");
      setMessage("");
      const form = new FormData(e.currentTarget);
      const payload = {
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
      };
      await api.updateProfile(payload);
      await loadMeAndOrders();
      setMessage("Profile updated");
    } catch (err) {
      setError(err.message || "Update failed");
    }
  }

  function logout() {
    removeToken();
    setUser(null);
    setOrders([]);
    setMessage("Logged out");
  }

  if (loading) return <LogoLoader />;

  if (!user) {
    return (
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form className="card-surface space-y-3" onSubmit={handleLogin}>
            <h1 className="text-xl font-semibold tracking-tight">Login</h1>
            <input
              className="field-input"
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <input
              className="field-input"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
              required
            />
            <div className="flex items-center justify-between gap-3">
              <button type="submit" className="btn-primary-solid rounded-full px-8">
                Login
              </button>
              <Link
                href="/account/forgot-password"
                className="text-sm text-neutral-500 hover:text-neutral-700 transition underline-offset-2 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>

          <form className="card-surface space-y-3" onSubmit={handleRegister}>
            <h2 className="text-xl font-semibold tracking-tight">Create Account</h2>
            <input
              className="field-input"
              placeholder="Name"
              value={registerData.name}
              onChange={(e) => setRegisterData((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              className="field-input"
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <input
              className="field-input"
              type="password"
              placeholder="Password (min 8 chars)"
              value={registerData.password}
              onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))}
              required
              minLength={8}
            />
            <button type="submit" className="btn-primary-solid rounded-full px-8">
              Register
            </button>
          </form>
        </div>
        {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}
        {message ? <div className="mt-2 text-sm text-green-700">{message}</div> : null}
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="page-kicker">Account</div>
          <h1 className="mt-2 page-title">My Profile</h1>
          <div className="mt-1 text-sm text-neutral-600">{user.email}</div>
        </div>
        <div className="flex items-center gap-2">
          {user.isAdmin && (
            <Link
              href="/admin"
              className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
            >
              Admin Dashboard
            </Link>
          )}
          <button type="button" className="rounded-full border border-neutral-200 px-4 py-2 text-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <form className="mt-6 card-surface grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleProfileUpdate}>
        <input name="name" className="field-input" defaultValue={user.name || ""} placeholder="Name" />
        <input name="phone" className="field-input" defaultValue={user.phone || ""} placeholder="Phone" />
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary-solid rounded-full px-8">
            Save Profile
          </button>
        </div>
      </form>

      <div className="mt-8 card-surface">
        <h2 className="text-lg font-semibold tracking-tight">My Orders</h2>
        <div className="mt-3 space-y-2">
          {orders.length === 0 ? <div className="text-sm text-neutral-600">No orders yet.</div> : null}
          {orders.map((o) => (
            <div key={o._id} className="rounded-lg border border-neutral-200 px-3 py-2">
              <div className="text-sm font-medium">{o.orderNumber}</div>
              <div className="text-xs text-neutral-600">
                {o.orderStatus} • {o.paymentStatus} • {(Number(o.total || 0) / 100).toFixed(2)} ZAR
              </div>
            </div>
          ))}
        </div>
      </div>

      {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}
      {message ? <div className="mt-2 text-sm text-green-700">{message}</div> : null}
    </div>
  );
}
