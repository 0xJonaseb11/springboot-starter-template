const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; message: string; data: T }> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/${endpoint}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: unknown }>("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: { firstName: string; lastName: string; email: string; password: string }) =>
    request<{ user: unknown }>("auth/register", { method: "POST", body: JSON.stringify(payload) }),

  forgotPassword: (email: string) =>
    request<null>(`auth/forgot-password?email=${encodeURIComponent(email)}`, { method: "POST" }),

  resetPassword: (email: string, resetCode: string, newPassword: string) =>
    request<null>("auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, resetCode, newPassword }),
    }),

  initiateVerification: (email: string) =>
    request<null>(`auth/initiate-verification?email=${encodeURIComponent(email)}`, { method: "POST" }),

  verifyAccount: (code: string) =>
    request<null>(`auth/verify-account?code=${encodeURIComponent(code)}`, { method: "POST" }),

  resendVerification: (email: string) =>
    request<null>(`auth/resend-verification?email=${encodeURIComponent(email)}`, { method: "POST" }),

  updatePassword: (oldPassword: string, newPassword: string) =>
    request<null>("auth/update-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};
