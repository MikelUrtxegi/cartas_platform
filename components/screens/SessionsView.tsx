"use client";

import Link from "next/link";
import { useMemo } from "react";

type SessionItem = {
  id: number | string;
  title?: string;
  name?: string;
  company?: string;
  status?: string; // "in_progress" etc
  created_at?: string;
};

type SessionsData = {
  sessions?: SessionItem[];
};

function getSessionTitle(s: SessionItem) {
  return s.title ?? s.name ?? `Sesión ${s.id}`;
}

export default function SessionsView({ data }: { data: SessionsData }) {
  const sessions = useMemo(() => data?.sessions ?? [], [data]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Sesiones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Crea y gestiona sesiones del workshop.
          </p>
        </div>

        <Link
          href="/app/admin/sessions/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Nueva sesión
        </Link>
      </div>

      <div className="mt-8 rounded-xl border bg-background">
        <div className="grid grid-cols-12 gap-3 border-b px-5 py-3 text-xs font-medium text-muted-foreground">
          <div className="col-span-6">Sesión</div>
          <div className="col-span-3">Empresa</div>
          <div className="col-span-3 text-right">Estado</div>
        </div>

        {sessions.length === 0 ? (
          <div className="px-5 py-6 text-sm text-muted-foreground">
            No hay sesiones todavía.
          </div>
        ) : (
          sessions.map((s) => (
            <Link
              key={String(s.id)}
              href={`/app/admin/sessions/${s.id}`}
              className="grid grid-cols-12 gap-3 px-5 py-4 hover:bg-muted/40"
            >
              <div className="col-span-6">
                <div className="text-sm font-medium">{getSessionTitle(s)}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {s.created_at ? `Creada: ${s.created_at}` : ""}
                </div>
              </div>

              <div className="col-span-3 text-sm text-muted-foreground">
                {s.company ?? "—"}
              </div>

              <div className="col-span-3 text-right text-sm">
                <span className="rounded-full bg-muted px-2 py-1 text-xs">
                  {s.status ?? "—"}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
