// components/screens/DashboardView.tsx
import type { DashboardData, DashboardSession } from "@/types/dashboard";

const statusStyles: Record<DashboardSession["status"], string> = {
  "En curso": "bg-blue-100 text-blue-700",
  Borrador: "bg-slate-100 text-slate-700",
  Canvas: "bg-amber-100 text-amber-700",
  Cerrada: "bg-slate-200 text-slate-700 line-through",
};

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

export default function DashboardView({ data }: { data: DashboardData }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">Gestiona tus sesiones de workshop</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard value={data.stats.activeSessions} label="Sesiones activas" />
        <StatCard value={data.stats.totalGroups} label="Grupos totales" />
        <StatCard value={data.stats.ratedCards} label="Cartas valoradas" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Sesiones</h2>

        <div className="mt-4 rounded-xl border bg-white shadow-sm">
          <ul className="divide-y">
            {data.sessions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-6 p-5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {s.name}
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[s.status]}`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {s.company} • {s.groups} grupos • {s.tags.join(", ")}
                  </div>
                </div>

                <div className="flex w-48 flex-col items-end gap-2">
                  <div className="flex w-full items-center gap-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-xs font-semibold text-slate-500">
                      {s.progress}%
                    </div>
                  </div>
                </div>
              </li>
            ))}

            {data.sessions.length === 0 && (
              <li className="p-5 text-sm text-slate-500">
                No hay sesiones todavía.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
