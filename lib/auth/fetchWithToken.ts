// lib/auth/fetchWithToken.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchWithToken(
  path: string,
  token: string,
  init: RequestInit = {},
) {
  if (!API_BASE_URL) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");

  const clean = path.startsWith("/") ? path : `/${path}`;
  const url = `${API_BASE_URL}${clean}`;

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...init, headers, cache: "no-store" });
}