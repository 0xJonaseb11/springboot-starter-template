"use client";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { Suspense } from "react";

function VerifyAccountInner() {
  const router = useRouter();
  const params = useSearchParams();
  const emailParam = params.get("email") || "";

  const [code, setCode]       = useState("");
  const [email, setEmail]     = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => { if (emailParam) setEmail(emailParam); }, [emailParam]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); setResendMsg("");
    setLoading(true);
    try {
      await api.verifyAccount(code);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) { setError("Please enter your email to resend the code"); return; }
    setResendMsg(""); setError("");
    setResending(true);
    try {
      await api.resendVerification(email);
      setResendMsg("Verification code resent! Check your inbox.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-root">
      <aside className="auth-hero">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-content">
          <div className="hero-logo">📧</div>
          <h2 className="hero-title">Verify your<br />Account</h2>
          <p className="hero-subtitle">
            We sent a verification code to your email. Enter it below to activate your account.
          </p>
          <ul className="hero-features">
            <li><span className="icon">📬</span> Check your inbox & spam folder</li>
            <li><span className="icon">⏱️</span> Code valid for 15 minutes</li>
            <li><span className="icon">🔄</span> Resend if you didn&apos;t receive it</li>
          </ul>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Verify account</h1>
            <p>Enter the code we sent to{email ? <> <strong>{email}</strong></> : " your email"}</p>
          </div>

          {error     && <div className="alert alert-error"  ><span>⚠️</span> {error}</div>}
          {resendMsg && <div className="alert alert-success"><span>✅</span> {resendMsg}</div>}

          {success ? (
            <div className="alert alert-success" style={{ flexDirection:"column", alignItems:"center", padding:32, gap:12 }}>
              <div style={{ fontSize:48 }}>✅</div>
              <strong>Account verified!</strong>
              <span style={{ fontSize:"0.88rem", color:"var(--text-muted)" }}>Redirecting to sign in…</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {!emailParam && (
                <div className="form-group">
                  <label className="form-label" htmlFor="va-email">Your email</label>
                  <div className="input-wrap">
                    <span className="input-icon">✉️</span>
                    <input id="va-email" type="email" className="form-input" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="va-code">Verification code</label>
                <div className="input-wrap">
                  <span className="input-icon">🔑</span>
                  <input id="va-code" type="text" className="form-input"
                    placeholder="Paste code from email"
                    value={code} onChange={e => setCode(e.target.value)} required
                    style={{ letterSpacing: "0.15em", fontWeight: 600, fontSize:"1.05rem" }} />
                </div>
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading} id="verify-btn">
                {loading ? <span className="spinner" /> : null}
                {loading ? "Verifying…" : "Verify account"}
              </button>

              <div style={{ textAlign:"center", marginTop:20 }}>
                <button type="button" className="btn btn-ghost" onClick={handleResend} disabled={resending} id="resend-btn">
                  {resending ? "Sending…" : "Resend verification code"}
                </button>
              </div>
            </form>
          )}

          <div className="auth-footer">
            <Link href="/login">← Back to sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}><div className="spinner" style={{ width:32, height:32 }} /></div>}>
      <VerifyAccountInner />
    </Suspense>
  );
}
