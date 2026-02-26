import type { DashboardData, DashboardSession } from "@/types/dashboard";

const statusChip: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  active: "bg-blue-100 text-blue-700",
  finished: "bg-emerald-100 text-emerald-700",
};

function statusLabel(status: DashboardSession["status"]) {
  if (status === "draft") return "Borrador";
  if (status === "active") return "En curso";
  if (status === "finished") return "Cerrada";
  return status;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

export default function DashboardView({ data }: { data: DashboardData }) {
  const maxVotes = Math.max(0, ...data.sessions.map((s) => s.votes));

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
            {data.sessions.map((s) => {
              const progress =
                maxVotes > 0 ? Math.round((s.votes / maxVotes) * 100) : 0;

              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-6 p-5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        Sesión #{s.id}
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusChip[s.status] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel(s.status)}
                      </span>
                    </div>

                    <div className="mt-1 text-sm text-slate-500">
                      Company #{s.company.id}
                      {" • "}
                      Sector: {s.company.sector ?? "—"}
                      {" • "}
                      Creada: {formatDate(s.company.created_at)}
                      {" • "}
                      {s.groups} grupos • {s.votes} votos
                    </div>
                  </div>

                  <div className="flex w-48 flex-col items-end gap-2">
                    <div className="flex w-full items-center gap-3">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="w-10 text-right text-xs font-semibold text-slate-500">
                        {progress}%
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}

            {data.sessions.length === 0 && (
              <li className="p-5 text-sm text-slate-500">No hay sesiones.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
