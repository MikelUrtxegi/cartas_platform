"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";

import CardsView from "@/components/screens/CardsView";
import type { CardsData } from "@/types/cards";
import { isCardsData } from "@/types/cards";

type SessionWithTokens = {
  access?: string;
  error?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSessionWithTokens(value: unknown): value is SessionWithTokens {
  if (!isObject(value)) return false;

  const access = value.access;
  const error = value.error;

  const accessOk = access === undefined || typeof access === "string";
  const errorOk = error === undefined || typeof error === "string";

  return accessOk && errorOk;
}

export default function AdminCardsPage() {
  const { data: session, status } = useSession();

  const token = useMemo(() => {
    const s: unknown = session;
    return isSessionWithTokens(s) ? (s.access ?? null) : null;
  }, [session]);

  const refreshError = useMemo(() => {
    const s: unknown = session;
    return isSessionWithTokens(s) ? s.error : undefined;
  }, [session]);

  const [data, setData] = useState<CardsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCards = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      const response = await fetch("/api/dashboard/cards/", {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(`Cards fetch failed (${response.status}): ${message}`);
      }

      const json: unknown = await response.json();

      if (!isCardsData(json)) {
        throw new Error(
          "Respuesta de API inválida: formato de cartas no reconocido",
        );
      }

      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error cargando cartas");
    }
  }, [token]);

  useEffect(() => {
    if (refreshError === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/auth/login" });
      return;
    }

    if (status === "authenticated") void loadCards();
    if (status === "unauthenticated") signOut({ callbackUrl: "/auth/login" });
  }, [status, refreshError, loadCards]);

  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (!data) return <div>Cargando cartas...</div>;

  return <CardsView data={data} token={token} onReload={loadCards} />;
}
