"use client";

import { useEffect, useState } from "react";
import DashboardView from "@/components/screens/DashboardView";
import type { DashboardData } from "@/types/dashboard";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return typeof err === "string" ? err : "Error desconocido";
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);

        const res = await fetch("/api/dashboard/summary/", { method: "GET" });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Dashboard fetch failed (${res.status}): ${txt}`);
        }

        const json = (await res.json()) as DashboardData;
        if (!cancelled) setData(json);
      } catch (e: unknown) {
        if (!cancelled) setError(getErrorMessage(e));
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

  if (!data) {
    return <div className="text-sm text-slate-500">Cargando dashboard…</div>;
  }

  return <DashboardView data={data} />;
}
