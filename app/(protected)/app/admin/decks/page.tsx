"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import DecksView from "@/components/screens/DecksView";
import type { DecksData } from "@/types/decks";

type SessionWithTokens = {
  access?: string;
  error?: string;
};

export default function AdminDecksPage() {
  const { data: session, status } = useSession();

  const token = useMemo(() => {
    return (session as SessionWithTokens | null)?.access ?? null;
  }, [session]);

  const refreshError = (session as SessionWithTokens | null)?.error;

  const [data, setData] = useState<DecksData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (refreshError === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/auth/login" });
      return;
    }

    async function loadDecks(): Promise<void> {
      try {
        setError(null);

        // AJUSTA si tu api route es distinta
        const response = await fetch("/api/dashboard/decks/", {
          method: "GET",
        });

        if (!response.ok) {
          const message = await response.text().catch(() => "");
          throw new Error(
            `Decks fetch failed (${response.status}): ${message}`,
          );
        }

        const json = await response.json();
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando mazos");
      }
    }

    if (status === "authenticated") loadDecks();
    if (status === "unauthenticated") signOut({ callbackUrl: "/auth/login" });
  }, [status, token, refreshError]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div>Cargando mazos...</div>;

  return <DecksView data={data} />;
}
