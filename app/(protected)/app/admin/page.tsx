"use client";

import { useEffect, useState } from "react";
import DashboardView from "@/components/screens/DashboardView";
import type { DashboardData } from "@/types/dashboard";

export default function AdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("admin_access");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Dashboard fetch failed");

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <div>Cargando dashboard...</div>;
  if (!data) return <div>Error cargando dashboard</div>;

  return <DashboardView data={data} />;
}
