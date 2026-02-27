"use client";

import type { DashboardData, DashboardSession } from "@/types/dashboard";
import Link from "next/link";

const statusChip: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700",
  active: "bg-blue-100 text-blue-700",
  finished: "bg-emerald-100 text-emerald-700",
};

function statusLabel(status: DashboardSession["status"]) {
  if (status === "draft") return "Creado";
  if (status === "active") return "En ejecución";
  if (status === "rated") return "Valorado";
  if (status === "finished") return "Finalizado";
  return status;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function pickCreatedOrUpdatedLabel(
  createdAt?: string | null,
  updatedAt?: string | null,
) {
  const c = createdAt ? new Date(createdAt).getTime() : NaN;
  const u = updatedAt ? new Date(updatedAt).getTime() : NaN;

  if (Number.isNaN(c) && Number.isNaN(u)) {
    return { label: "Creada", value: null as string | null };
  }
  if (!Number.isNaN(c) && Number.isNaN(u)) {
    return { label: "Creada", value: createdAt ?? null };
  }
  if (Number.isNaN(c) && !Number.isNaN(u)) {
    return { label: "Editada", value: updatedAt ?? null };
  }

  // ambas válidas
  if (!Number.isNaN(c) && !Number.isNaN(u)) {
    if (u > c) return { label: "Editada", value: updatedAt ?? null };
    return { label: "Creada", value: createdAt ?? null };
  }

  return { label: "Creada", value: createdAt ?? null };
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}
function StatCardLink({
  value,
  label,
  href,
}: {
  value: string | number;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border bg-white p-5 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </Link>
  );
}

type DashboardCompanyExtended = DashboardSession["company"] & {
  name?: string | null;
  legal_name?: string | null;
  updated_at?: string | null;
};

type DashboardSessionExtended = DashboardSession & {
  created_at?: string | null;
  updated_at?: string | null;
  company: DashboardCompanyExtended;
};

type DashboardDataExtended = Omit<DashboardData, "sessions"> & {
  sessions: DashboardSessionExtended[];
};

export default function DashboardView({ data }: { data: DashboardData }) {
  const dataExt = data as DashboardDataExtended;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">Gestiona tus sesiones de workshop</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCardLink
          value={data.stats.activeSessions}
          label="Sesiones activas"
          href="/app/sessions"
        />
        <StatCardLink
          value={data.stats.totalGroups}
          label="Grupos totales"
          href="/app/groups"
        />

        <StatCardLink
          value={data.stats.ratedCards}
          label="Cartas valoradas"
          href="/app/cards"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Sesiones</h2>

        <div className="mt-4 rounded-xl border bg-white shadow-sm">
          <ul className="divide-y">
            {dataExt.sessions.map((s) => {
              const companyName =
                s.company.name ??
                s.company.legal_name ??
                `Company #${s.company.id}`;

              // Preferimos fechas de sesión si existen; si no, las de company
              const createdAt = s.created_at ?? s.company.created_at ?? null;
              const updatedAt = s.updated_at ?? s.company.updated_at ?? null;

              const { label: dateLabel, value: dateValue } =
                pickCreatedOrUpdatedLabel(createdAt, updatedAt);

              return (
                <li key={s.id}>
                  <Link
                    href={`/app/sessions/${s.id}`} // ajusta la ruta si tu detalle es otra
                    className="flex items-center justify-between gap-6 p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {/* IZQUIERDA */}
                    <div className="min-w-0">
                      {/* Nombre compañía */}
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {companyName}
                      </div>

                      {/* Línea de meta-info */}
                      <div className="mt-1 text-sm text-slate-500">
                        Sector: {s.company.sector ?? "—"}
                        {" • "}
                        {dateLabel}: {formatDate(dateValue)}
                        {" • "}
                        {s.groups} grupos
                        {" • "}
                        {s.votes} votos Sesión #{s.id}
                        {" • "}
                      </div>
                    </div>

                    {/* DERECHA */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          statusChip[s.status] ?? "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statusLabel(s.status)}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}

            {dataExt.sessions.length === 0 && (
              <li className="p-5 text-sm text-slate-500">No hay sesiones.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
