"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email:"", resetCode:"", newPassword:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.newPassword !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await api.resetPassword(form.email, form.resetCode, form.newPassword);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Reset failed");
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
          <div className="hero-logo">🔐</div>
          <h2 className="hero-title">Set a new<br />Password</h2>
          <p className="hero-subtitle">Enter the reset code from your email and choose a strong new password.</p>
          <ul className="hero-features">
            <li><span className="icon">📧</span> Code sent to your email</li>
            <li><span className="icon">🔒</span> Choose a strong password</li>
            <li><span className="icon">✅</span> Instant account access</li>
          </ul>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Reset password</h1>
            <p>Enter your code and new password below</p>
          </div>

          {error && <div className="alert alert-error"><span>⚠️</span> {error}</div>}

          {success ? (
            <div className="alert alert-success" style={{ flexDirection:"column", alignItems:"center", padding:32, gap:12 }}>
              <div style={{ fontSize:48 }}>🎉</div>
              <strong>Password reset!</strong>
              <span style={{ fontSize:"0.88rem", color:"var(--text-muted)" }}>Redirecting to sign in…</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="rp-email">Email address</label>
                <div className="input-wrap">
                  <span className="input-icon">✉️</span>
                  <input id="rp-email" type="email" className="form-input" placeholder="you@example.com"
                    value={form.email} onChange={set("email")} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="resetCode">Reset code</label>
                <div className="input-wrap">
                  <span className="input-icon">🔑</span>
                  <input id="resetCode" type="text" className="form-input" placeholder="Enter the code from email"
                    value={form.resetCode} onChange={set("resetCode")} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rp-newPass">New password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input id="rp-newPass" type="password" className="form-input" placeholder="Min 6 characters"
                    value={form.newPassword} onChange={set("newPassword")} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rp-confirm">Confirm new password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input id="rp-confirm" type="password" className="form-input" placeholder="Repeat new password"
                    value={form.confirm} onChange={set("confirm")} required />
                </div>
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading} id="reset-btn">
                {loading ? <span className="spinner" /> : null}
                {loading ? "Resetting…" : "Reset password"}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <Link href="/forgot-password">← Resend reset code</Link>
            &nbsp;·&nbsp;
            <Link href="/login">Back to sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
