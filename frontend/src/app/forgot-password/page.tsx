"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <aside className="auth-hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content">
          <div className="hero-logo">🔑</div>
          <h2 className="hero-title">Reset your<br />Password</h2>
          <p className="hero-subtitle">
            Enter your email and we&apos;ll send you a reset link so you can get back in quickly.
          </p>
          <ul className="hero-features">
            <li><span className="icon">📬</span> Check your inbox for the code</li>
            <li><span className="icon">⏱️</span> Code expires after 15 minutes</li>
            <li><span className="icon">🔒</span> Secure reset process</li>
          </ul>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Forgot password?</h1>
            <p>We&apos;ll email you a reset code</p>
          </div>

          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          {sent ? (
            <div className="alert alert-success" style={{ flexDirection:"column", gap:16, padding:24 }}>
              <div style={{ fontSize:40, textAlign:"center" }}>📬</div>
              <div>
                <strong>Reset email sent!</strong><br />
                <span style={{ fontSize:"0.88rem" }}>
                  We sent a password reset code to <strong>{email}</strong>.
                  Check your inbox and follow the link.
                </span>
              </div>
              <Link href="/reset-password" style={{ color:"var(--success)", fontWeight:600, fontSize:"0.9rem" }}>
                Enter reset code →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="fp-email">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input id="fp-email" type="email" className="form-input"
                    placeholder="you@example.com" value={email}
                    onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading} id="forgot-btn">
                {loading ? <span className="spinner" /> : null}
                {loading ? "Sending…" : "Send reset code"}
              </button>
            </form>
          )}

          <div className="auth-footer">
            Remember it? <Link href="/login">Back to sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
