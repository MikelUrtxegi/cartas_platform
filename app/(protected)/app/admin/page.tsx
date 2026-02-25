"use client";

import { useEffect, useState } from "react";
import DashboardView from "@/components/screens/DashboardView";
import type { DashboardData } from "@/types/dashboard";

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = localStorage.getItem("admin_access");

        if (!baseUrl) {
          throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
        }

        if (!token) {
          throw new Error("Missing admin_access token (login required)");
        }

        const response = await fetch(`${baseUrl}/api/dashboard/summary/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      }
    }

    loadDashboard();
  }, []);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!data) {
    return <div>Cargando dashboard...</div>;
  }

  return <DashboardView data={data} />;
}
