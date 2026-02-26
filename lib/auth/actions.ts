// lib/auth/actions.ts
import { clearTokens, setTokens, type AuthTokens } from "./tokens";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function buildUrl(path: string) {
  if (!API_BASE_URL) throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${clean}`;
}

export async function loginWithEmailPassword(email: string, password: string) {
  const res = await fetch(buildUrl("/api/auth/token/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as AuthTokens;
  if (!data.access || !data.refresh) throw new Error("Invalid token response");

  setTokens({ access: data.access, refresh: data.refresh });
  return data;
}

export function logout() {
  clearTokens();
}