"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import DashboardView from "@/components/screens/DashboardView";
import type { DashboardData } from "@/types/dashboard";
import { fetchWithToken } from "@/lib/auth/fetchWithToken";

type SessionWithTokens = {
  access?: string;
  error?: string;
};

export default function AdminPage() {
  const { data: session, status } = useSession();

  const token = useMemo(() => {
    return (session as SessionWithTokens | null)?.access ?? null;
  }, [session]);

  const refreshError = (session as SessionWithTokens | null)?.error;

  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (refreshError === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/auth/login" });
      return;
    }

    async function loadDashboard(): Promise<void> {
      try {
        setError(null);

        if (!token) throw new Error("Missing access token (login required)");

        const response = await fetchWithToken("/api/dashboard/summary/", token);

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

    if (status === "authenticated") {
      loadDashboard();
    }

    if (status === "unauthenticated") {
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [status, token, refreshError]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div>Cargando dashboard...</div>;

  return <DashboardView data={data} />;
}
