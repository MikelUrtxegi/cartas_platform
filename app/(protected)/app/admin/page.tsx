// app/(protected)/app/admin/page.tsx
import DashboardView from "@/components/screens/DashboardView";
import type { DashboardData } from "@/types/dashboard";

async function getDashboardData(): Promise<DashboardData> {
  // IMPORTANTE: ajusta esto a tu backend real
  // Ej: process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/"
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL env var");
  }

  const res = await fetch(`${baseUrl}api/admin/dashboard/`, {
    // Si usas cookies/httpOnly para auth:
    credentials: "include",
    // Si usas JWT en header, esto NO basta: ver nota más abajo.
    cache: "no-store",
  });

  if (!res.ok) {
    // Opcional: log y fallback
    throw new Error(`Dashboard fetch failed: ${res.status}`);
  }

  return res.json();
}

export default async function AdminPage() {
  const data = await getDashboardData();
  return <DashboardView data={data} />;
}
