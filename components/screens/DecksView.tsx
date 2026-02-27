"use client";

import { useMemo, useState } from "react";

type DeckCard = {
  id: number | string;
  title?: string;
  text?: string;
};

type Deck = {
  id: number | string;
  name?: string;
  title?: string;
  description?: string;
  is_default?: boolean;
  predefined?: boolean;
  cards_count?: number;
  cards?: DeckCard[];
};

type DecksData = {
  decks?: Deck[];
};

function getDeckTitle(d: Deck) {
  return d.name ?? d.title ?? `Mazo ${d.id}`;
}

function getDeckIsDefault(d: Deck) {
  return Boolean(d.is_default ?? d.predefined);
}

function getDeckCardsCount(d: Deck) {
  if (typeof d.cards_count === "number") return d.cards_count;
  if (Array.isArray(d.cards)) return d.cards.length;
  return 0;
}

export default function DecksView({ data }: { data: DecksData }) {
  const decks = useMemo(() => data?.decks ?? [], [data]);
  const [openId, setOpenId] = useState<string | number | null>(null);

  return (
    <main className="admin-page">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="admin-title">Gestión de Mazos</h1>
          <p className="admin-subtitle">
            Crea y gestiona mazos de cartas para tus workshops
          </p>
        </div>

        <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Nuevo mazo
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {decks.length === 0 ? (
          <div className="admin-panel p-6 text-sm admin-muted">
            No hay mazos todavía.
          </div>
        ) : (
          decks.map((deck) => {
            const id = deck.id;
            const isOpen = openId === id;
            const title = getDeckTitle(deck);
            const isDefault = getDeckIsDefault(deck);
            const count = getDeckCardsCount(deck);

            return (
              <div key={String(id)} className="admin-panel">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {title}
                      </span>
                      {isDefault && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                          Predefinido
                        </span>
                      )}
                    </div>

                    <div className="mt-1 truncate text-sm admin-muted">
                      {(deck.description ?? "").trim() || "—"} · {count} cartas
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="admin-muted">{isOpen ? "▾" : "▸"}</span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("edit deck", id);
                      }}
                      className="rounded-md px-2 py-1 text-sm admin-muted hover:bg-slate-100 hover:text-slate-900"
                      aria-label="Editar mazo"
                    >
                      ✎
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("delete deck", id);
                      }}
                      className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                      aria-label="Borrar mazo"
                    >
                      🗑
                    </button>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t px-5 py-4">
                    <div className="space-y-2">
                      {(deck.cards ?? []).length === 0 ? (
                        <div className="text-sm admin-muted">
                          Este mazo no tiene cartas (aún).
                        </div>
                      ) : (
                        (deck.cards ?? []).map((c) => (
                          <div
                            key={String(c.id)}
                            className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-900"
                          >
                            {c.title ?? c.text ?? `Carta ${c.id}`}
                          </div>
                        ))
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          console.log("add card to deck", id);
                        }}
                        className="mt-2 inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 hover:bg-slate-100"
                      >
                        <span className="text-lg leading-none">+</span>
                        Añadir carta
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
