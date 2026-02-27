"use client";

import type { CardsData } from "@/types/cards";

type Card = {
  id: number | string;
  title?: string;
  name?: string;
  description?: string | null;
};

export default function CardsView({ data }: { data: CardsData }) {
  const items: Card[] = data.cards ?? [];

  return (
    <main className="admin-page">
      <h1 className="admin-title">Cartas</h1>
      <p className="admin-subtitle">Gestiona las cartas disponibles</p>

      <div className="mt-6 admin-panel">
        <ul className="divide-y">
          {items.map((c) => (
            <li key={String(c.id)} className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                {c.title ?? c.name ?? `Carta #${c.id}`}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {c.description ?? "—"}
              </div>
            </li>
          ))}

          {items.length === 0 && (
            <li className="p-5 text-sm text-slate-500">No hay cartas.</li>
          )}
        </ul>
      </div>
    </main>
  );
}
