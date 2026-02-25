"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

import DashboardView from "@/components/screens/DashboardView";
import type { DashboardData } from "@/types/dashboard";

type SessionWithTokens = {
  access?: string;
};

export default function AdminPage() {
  const { data: session, status } = useSession();

  const token = useMemo(() => {
    return (session as SessionWithTokens | null)?.access ?? null;
  }, [session]);

  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      try {
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!baseUrl) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
        if (!token) throw new Error("Missing access token (login required)");

        const response = await fetch(`${baseUrl}/api/dashboard/summary/`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            `Dashboard fetch failed (${response.status}): ${message}`,
          );
        }

        const json: DashboardData = await response.json();
        setData(json);
      } catch (err) {
        setData(null);
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    // Espera a que NextAuth tenga la sesión lista
    if (status === "authenticated") {
      loadDashboard();
    }
    if (status === "unauthenticated") {
      setError("No autenticado (login required)");
      setData(null);
    }
  }, [status, token]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div>Cargando dashboard...</div>;

  return <DashboardView data={data} />;
}
