"use client";

type Card = {
  id: number;
  title?: string;
  name?: string;
  description?: string | null;
};

export default function CardsView({ items }: { items: Card[] }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-slate-900">Cartas</h1>
      <p className="mt-1 text-slate-500">Gestiona las cartas disponibles</p>

      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <ul className="divide-y">
          {items.map((c) => (
            <li key={c.id} className="p-5">
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
    </div>
  );
}
