"use client";

import { useMemo } from "react";

type ResultCard = {
  id: number | string;
  title: string;
  score?: number; // %
};

type Quadrant = {
  key: string; // "now_ready", etc
  title: string; // "Ahora · Preparados"
  items: ResultCard[];
};

type ResultsData = {
  total_sessions?: number;
  total_votes?: number;
  quadrants?: Quadrant[];
};

export default function ResultsView({ data }: { data: ResultsData }) {
  const sessions = data?.total_sessions ?? 0;
  const votes = data?.total_votes ?? 0;

  const quadrants = useMemo(() => data?.quadrants ?? [], [data]);

  return (
    <main className="admin-page">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="admin-title">Resultados Globales</h1>
          <p className="admin-subtitle">
            Resumen agregado de todas las sesiones · {sessions} sesiones ·{" "}
            {votes} cartas valoradas
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Canvas placeholder */}
        <div className="lg:col-span-8">
          <div className="admin-panel p-5">
            <div className="admin-panel-title">
              Mapa Canvas — Posicionamiento estratégico
            </div>

            <div className="mt-4 aspect-[4/3] w-full rounded-lg border bg-slate-50">
              {/* TODO: aquí meteremos el canvas real (grid 2x2 + bubbles) */}
              <div className="flex h-full items-center justify-center text-sm admin-muted">
                (Canvas pendiente de conectar)
              </div>
            </div>
          </div>
        </div>

        {/* Distribution panel */}
        <div className="lg:col-span-4">
          <div className="admin-panel p-5">
            <div className="admin-panel-title">Distribución por cuadrante</div>

            <div className="mt-4 space-y-3">
              {quadrants.length === 0 ? (
                <div className="text-sm admin-muted">
                  No hay datos de resultados todavía.
                </div>
              ) : (
                quadrants.map((q) => (
                  <div key={q.key} className="rounded-lg border bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-slate-900">
                        {q.title}
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                        {q.items.length}
                      </span>
                    </div>

                    <ul className="mt-2 space-y-1 text-sm admin-muted">
                      {q.items.slice(0, 6).map((it) => (
                        <li key={String(it.id)} className="flex gap-2">
                          <span>•</span>
                          <span className="flex-1">
                            {it.title}
                            {typeof it.score === "number"
                              ? ` (${it.score}%)`
                              : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
