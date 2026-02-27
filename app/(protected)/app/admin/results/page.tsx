"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import ResultsView from "@/components/screens/ResultsView";
import type { ResultsData } from "@/types/results";

type SessionWithTokens = {
  access?: string;
  error?: string;
};

export default function AdminResultsPage() {
  const { data: session, status } = useSession();

  const token = useMemo(() => {
    return (session as SessionWithTokens | null)?.access ?? null;
  }, [session]);

  const refreshError = (session as SessionWithTokens | null)?.error;

  const [data, setData] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (refreshError === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/auth/login" });
      return;
    }

    async function loadResults(): Promise<void> {
      try {
        setError(null);

        // AJUSTA si tu api route es distinta
        const response = await fetch("/api/dashboard/summary/", {
          method: "GET",
        });

        if (!response.ok) {
          const message = await response.text().catch(() => "");
          throw new Error(
            `Results fetch failed (${response.status}): ${message}`,
          );
        }

        const json = await response.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando resultados");
      }
    }

    if (status === "authenticated") loadResults();
    if (status === "unauthenticated") signOut({ callbackUrl: "/auth/login" });
  }, [status, token, refreshError]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div>Cargando resultados...</div>;

  return <ResultsView data={data} />;
}
