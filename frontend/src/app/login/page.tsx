"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      {/* ── Hero ── */}
      <aside className="auth-hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content">
          <div className="hero-logo">🚀</div>
          <h2 className="hero-title">SpringKit<br />Auth Portal</h2>
          <p className="hero-subtitle">
            A production-ready Spring Boot starter with JWT authentication &amp; role-based access control.
          </p>
          <ul className="hero-features">
            <li><span className="icon">🔐</span> JWT Bearer token auth</li>
            <li><span className="icon">📧</span> Email verification flow</li>
            <li><span className="icon">🔑</span> Password reset via email</li>
            <li><span className="icon">👮</span> Role-based access control</li>
          </ul>
        </div>
      </aside>

      {/* ── Form ── */}
      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text-dim)", fontSize:16 }}
                  aria-label="Toggle password visibility"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ textAlign:"right", marginBottom:24, marginTop:-12 }}>
              <Link href="/forgot-password" style={{ color:"var(--primary-l)", fontSize:"0.85rem", textDecoration:"none" }}>
                Forgot password?
              </Link>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} id="login-btn">
              {loading ? <span className="spinner" /> : null}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="divider"><span>New here?</span></div>

          <div className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link href="/register">Create one</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
