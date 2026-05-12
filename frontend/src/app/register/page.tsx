"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  function set(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await api.register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      setSuccess("Account created! Please check your email to verify your account.");
      setTimeout(() => router.push(`/verify-account?email=${encodeURIComponent(form.email)}`), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          <div className="hero-logo">✨</div>
          <h2 className="hero-title">Join<br />SpringKit</h2>
          <p className="hero-subtitle">Create your account and get started in seconds. No credit card required.</p>
          <ul className="hero-features">
            <li><span className="icon">⚡</span> Instant account creation</li>
            <li><span className="icon">📧</span> Email verification required</li>
            <li><span className="icon">🔐</span> Secured with JWT tokens</li>
            <li><span className="icon">🛡️</span> Your data is encrypted</li>
          </ul>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create account</h1>
            <p>Fill in the details below to get started</p>
          </div>

          {error   && <div className="alert alert-error"  ><span>⚠️</span> {error}</div>}
          {success && <div className="alert alert-success"><span>✅</span> {success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First name</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input id="firstName" type="text" className="form-input" placeholder="John"
                    value={form.firstName} onChange={set("firstName")} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last name</label>
                <div className="input-wrap">
                  <span className="input-icon">👤</span>
                  <input id="lastName" type="text" className="form-input" placeholder="Doe"
                    value={form.lastName} onChange={set("lastName")} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email address</label>
              <div className="input-wrap">
                <span className="input-icon">✉️</span>
                <input id="reg-email" type="email" className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={set("email")} required autoComplete="email" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input id="reg-password" type={showPass ? "text" : "password"} className="form-input"
                  placeholder="Min 6 characters" value={form.password} onChange={set("password")} required />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text-dim)", fontSize:16 }}
                  aria-label="Toggle password">{showPass ? "🙈" : "👁️"}</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm">Confirm password</label>
              <div className="input-wrap">
                <span className="input-icon">🔒</span>
                <input id="confirm" type={showPass ? "text" : "password"} className="form-input"
                  placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} required />
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={loading} id="register-btn">
              {loading ? <span className="spinner" /> : null}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
