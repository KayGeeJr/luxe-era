"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "../../components/PageHeader";
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
      <main className="bg-white">
        <PageHeader
          eyebrow="Account"
          title="Sign in or"
          titleAccent="register"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
        />
        <section className="luxe-section">
          <AccountGuestForms
            loginData={loginData}
            setLoginData={setLoginData}
            registerData={registerData}
            setRegisterData={setRegisterData}
            handleLogin={handleLogin}
            handleRegister={handleRegister}
            error={error}
            message={message}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <PageHeader
        eyebrow="Account"
        title="My"
        titleAccent="profile"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />
      <section className="luxe-section">
        <div className="luxe-container">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <AccountProfileHeader email={user.email} />
            <AccountActions isAdmin={user.isAdmin} onLogout={logout} />
          </div>

          <form className="mt-8 card-surface grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleProfileUpdate}>
            <input name="name" className="field-input" defaultValue={user.name || ""} placeholder="Name" />
            <input name="phone" className="field-input" defaultValue={user.phone || ""} placeholder="Phone" />
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary-solid">
                Save profile
              </button>
            </div>
          </form>

          <div className="mt-8 card-surface">
            <h2 className="text-lg font-extralight tracking-wide">My orders</h2>
            <div className="mt-4 space-y-3">
              {orders.length === 0 ? (
                <p className="text-sm text-neutral-500">No orders yet.</p>
              ) : null}
              {orders.map((o) => (
                <div key={o._id} className="border border-neutral-200 px-4 py-3">
                  <p className="text-sm font-medium tracking-wide">{o.orderNumber}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {o.orderStatus} · {o.paymentStatus} · {(Number(o.total || 0) / 100).toFixed(2)} ZAR
                  </p>
                </div>
              ))}
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          {message ? <p className="mt-2 text-sm text-green-700">{message}</p> : null}
        </div>
      </section>
    </main>
  );
}

function AccountGuestForms({
  loginData,
  setLoginData,
  registerData,
  setRegisterData,
  handleLogin,
  handleRegister,
  error,
  message,
}) {
  return (
    <div className="luxe-container grid grid-cols-1 gap-6 lg:grid-cols-2">
      <form className="card-surface space-y-4" onSubmit={handleLogin}>
        <h1 className="text-xl font-extralight tracking-wide">Login</h1>
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="btn-primary-solid">
            Login
          </button>
          <Link
            href="/account/forgot-password"
            className="text-sm text-neutral-500 hover:text-accent transition-colors"
          >
            Forgot password?
          </Link>
        </div>
      </form>

      <form className="card-surface space-y-4" onSubmit={handleRegister}>
        <h2 className="text-xl font-extralight tracking-wide">Create account</h2>
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
        <button type="submit" className="btn-primary-solid">
          Register
        </button>
      </form>

      {error ? <p className="lg:col-span-2 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="lg:col-span-2 text-sm text-green-700">{message}</p> : null}
    </div>
  );
}

function AccountProfileHeader({ email }) {
  return (
    <div>
      <p className="luxe-eyebrow text-neutral-400">Signed in</p>
      <h1 className="mt-2 page-title">My profile</h1>
      <p className="mt-1 text-sm text-neutral-500">{email}</p>
    </div>
  );
}

function AccountActions({ isAdmin, onLogout }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {isAdmin ? (
        <Link href="/admin" className="btn-primary-solid !min-h-[40px] !px-6 !text-[10px]">
          Admin
        </Link>
      ) : null}
      <button
        type="button"
        className="border border-neutral-200 px-5 py-2 text-sm tracking-wide hover:border-neutral-900 transition-colors"
        onClick={onLogout}
      >
        Logout
      </button>
    </div>
  );
}
