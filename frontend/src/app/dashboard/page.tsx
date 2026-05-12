"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  enabled?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ old:"", newP:"", confirm:"" });
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed?.user ?? parsed ?? { email: "user@example.com" });
    } catch {
      setUser({ email: "user@example.com" });
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  async function handleChangePwd(e: React.FormEvent) {
    e.preventDefault();
    setPwdErr(""); setPwdMsg("");
    if (pwdForm.newP !== pwdForm.confirm) { setPwdErr("Passwords do not match"); return; }
    setPwdLoading(true);
    try {
      const { api } = await import("@/lib/api");
      await api.updatePassword(pwdForm.old, pwdForm.newP);
      setPwdMsg("Password updated successfully!");
      setPwdForm({ old:"", newP:"", confirm:"" });
    } catch (err: unknown) {
      setPwdErr(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  }

  if (!user) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div className="spinner" style={{ width:36, height:36 }} />
      </div>
    );
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "User";
  const initials = displayName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0,2);

  return (
    <div className="dash-root">
      {/* Nav */}
      <nav className="dash-nav">
        <div className="dash-nav-brand">
          <div className="nav-logo">🚀</div>
          <span>SpringKit</span>
        </div>
        <div className="dash-nav-actions">
          <div style={{
            width:38, height:38, borderRadius:"50%",
            background:"linear-gradient(135deg, var(--primary), var(--accent))",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:700, fontSize:"0.9rem", color:"#fff"
          }}>
            {initials}
          </div>
          <button className="btn btn-outline" onClick={logout} id="logout-btn"
            style={{ padding:"8px 18px", fontSize:"0.85rem" }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="dash-body">
        {/* Welcome */}
        <div className="dash-welcome">
          <h1>Good to see you, {user.firstName || "there"} 👋</h1>
          <p>Here&apos;s an overview of your account and available actions.</p>
        </div>

        {/* Stat cards */}
        <div className="dash-grid">
          <div className="stat-card">
            <div className="stat-icon purple">🔐</div>
            <div className="stat-label">Auth Status</div>
            <div className="stat-value" style={{ fontSize:"1.2rem", color:"var(--success)" }}>Authenticated</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cyan">👤</div>
            <div className="stat-label">Role</div>
            <div className="stat-value" style={{ fontSize:"1.2rem" }}>{user.role || "USER"}</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-label">Account</div>
            <div className="stat-value" style={{ fontSize:"1.2rem" }}>
              {user.enabled !== false ? "Verified" : "Unverified"}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amber">🛡️</div>
            <div className="stat-label">Security</div>
            <div className="stat-value" style={{ fontSize:"1.2rem" }}>JWT Active</div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {/* Profile card */}
          <div className="profile-card">
            <h2>Account Details</h2>

            {user.firstName && (
              <div className="profile-row">
                <span className="profile-row-label">First name</span>
                <span className="profile-row-value">{user.firstName}</span>
              </div>
            )}
            {user.lastName && (
              <div className="profile-row">
                <span className="profile-row-label">Last name</span>
                <span className="profile-row-value">{user.lastName}</span>
              </div>
            )}
            <div className="profile-row">
              <span className="profile-row-label">Email</span>
              <span className="profile-row-value">{user.email}</span>
            </div>
            <div className="profile-row">
              <span className="profile-row-label">Role</span>
              <span className="profile-row-value">
                <span className="badge badge-success">{user.role || "USER"}</span>
              </span>
            </div>
            <div className="profile-row">
              <span className="profile-row-label">Status</span>
              <span className="profile-row-value">
                <span className={`badge ${user.enabled !== false ? "badge-success" : "badge-warning"}`}>
                  {user.enabled !== false ? "✓ Active" : "⚠ Unverified"}
                </span>
              </span>
            </div>
          </div>

          {/* Actions card */}
          <div className="profile-card">
            <h2>Quick Actions</h2>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <button
                className="btn btn-outline"
                style={{ justifyContent:"flex-start", gap:12, padding:"14px 18px" }}
                onClick={() => setShowChangePwd(v => !v)}
                id="change-pwd-toggle"
              >
                🔒 Change Password
              </button>

              {showChangePwd && (
                <form onSubmit={handleChangePwd} style={{ background:"var(--surface2)", borderRadius:10, padding:20, display:"flex", flexDirection:"column", gap:12 }}>
                  {pwdErr && <div className="alert alert-error" style={{ marginBottom:0 }}><span>⚠️</span>{pwdErr}</div>}
                  {pwdMsg && <div className="alert alert-success" style={{ marginBottom:0 }}><span>✅</span>{pwdMsg}</div>}
                  <input type="password" className="form-input no-icon" placeholder="Current password"
                    value={pwdForm.old} onChange={e => setPwdForm(f => ({...f, old:e.target.value}))} required />
                  <input type="password" className="form-input no-icon" placeholder="New password"
                    value={pwdForm.newP} onChange={e => setPwdForm(f => ({...f, newP:e.target.value}))} required />
                  <input type="password" className="form-input no-icon" placeholder="Confirm new password"
                    value={pwdForm.confirm} onChange={e => setPwdForm(f => ({...f, confirm:e.target.value}))} required />
                  <button className="btn btn-primary" type="submit" disabled={pwdLoading} id="change-pwd-btn">
                    {pwdLoading ? <span className="spinner" /> : null}
                    {pwdLoading ? "Updating…" : "Update password"}
                  </button>
                </form>
              )}

              <Link href="/verify-account" style={{ textDecoration:"none" }}>
                <button className="btn btn-outline" style={{ width:"100%", justifyContent:"flex-start", gap:12, padding:"14px 18px" }} id="verify-link-btn">
                  📧 Verify Account
                </button>
              </Link>

              <button
                className="btn btn-outline"
                style={{ justifyContent:"flex-start", gap:12, padding:"14px 18px", color:"var(--danger)", borderColor:"rgba(239,68,68,0.3)" }}
                onClick={logout}
                id="logout-action-btn"
              >
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* API Info */}
        <div className="profile-card" style={{ marginTop:24 }}>
          <h2>API Information</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginTop:8 }}>
            {[
              { label:"Base URL", value:"http://localhost:8000/api/v1" },
              { label:"Auth Endpoint", value:"/auth/**" },
              { label:"Swagger UI", value:"/swagger-ui.html" },
              { label:"API Docs", value:"/v3/api-docs" },
            ].map(item => (
              <div key={item.label} style={{ background:"var(--surface2)", borderRadius:8, padding:16 }}>
                <div style={{ color:"var(--text-muted)", fontSize:"0.78rem", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.06em" }}>{item.label}</div>
                <code style={{ color:"var(--primary-l)", fontSize:"0.85rem", wordBreak:"break-all" }}>{item.value}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
