"use client";

import { useEffect, useState } from "react";
import CardsView from "@/components/screens/CardsView";

type Card = {
  id: number;
  title?: string;
  name?: string;
  description?: string | null;
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return typeof err === "string" ? err : "Error desconocido";
}

function extractCards(json: unknown): Card[] {
  if (Array.isArray(json)) return json as Card[];

  if (typeof json === "object" && json !== null && "results" in json) {
    const results = (json as { results?: unknown }).results;
    if (Array.isArray(results)) return results as Card[];
  }

  return [];
}

export default function CardsClient() {
  const [items, setItems] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch("/api/dashboard/cards/", { method: "GET" });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Cards fetch failed (${res.status}): ${txt}`);
        }

        const json: unknown = await res.json();
        const arr = extractCards(json);

        if (!cancelled) setItems(arr);
      } catch (e: unknown) {
        if (!cancelled) setError(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (loading) {
    return <div className="text-sm text-slate-500">Cargando cartas…</div>;
  }

  return <CardsView items={items} />;
}
