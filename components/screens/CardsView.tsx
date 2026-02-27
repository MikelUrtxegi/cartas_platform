"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";

import type { CardsData, CardItem } from "@/types/cards";
import { extractCards, isCardItem } from "@/types/cards";

type Props = {
  data: CardsData;
  token: string | null;
  onReload: () => Promise<void> | void;
};

type CardId = CardItem["id"];

type CardFormState = {
  title: string;
  category: string;
  description: string;
};

type Mode = { kind: "create" } | { kind: "edit"; id: CardId };

type CreateCardPayload = {
  title: string;
  description?: string;
  category?: string;
};

type UpdateCardPayload = CreateCardPayload;

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

/** Exactamente el mismo azul que "Crear sesión" */
const PRIMARY_BLUE_BUTTON_CLASS =
  "inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700";

const ICON_BUTTON_CLASS =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white text-slate-700 shadow-sm transition hover:bg-secondary hover:text-slate-900 active:scale-[0.98]";

async function apiCreateCard(
  token: string | null,
  payload: CreateCardPayload,
): Promise<CardItem> {
  const res = await fetch("/api/dashboard/cards/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cards create failed (${res.status}): ${text}`);
  }

  const json: unknown = await res.json();
  if (!isCardItem(json)) {
    throw new Error("Respuesta de creación inválida: no devuelve una CardItem");
  }
  return json;
}

async function apiUpdateCard(
  token: string | null,
  id: CardId,
  payload: UpdateCardPayload,
): Promise<CardItem> {
  const res = await fetch(
    `/api/dashboard/cards/${encodeURIComponent(String(id))}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cards update failed (${res.status}): ${text}`);
  }

  const json: unknown = await res.json();
  if (!isCardItem(json)) {
    throw new Error("Respuesta de edición inválida: no devuelve una CardItem");
  }
  return json;
}

async function apiDeleteCard(token: string | null, id: CardId): Promise<void> {
  const res = await fetch(
    `/api/dashboard/cards/${encodeURIComponent(String(id))}/`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Cards delete failed (${res.status}): ${text}`);
  }
}

function cardToForm(c: CardItem): CardFormState {
  return {
    title: c.title ?? "",
    category: c.category ?? "",
    description: c.description ?? "",
  };
}

function normalizePayload(form: CardFormState): CreateCardPayload {
  const title = form.title.trim();
  const category = form.category.trim();
  const description = form.description.trim();

  return {
    title,
    category: category ? category : undefined,
    description: description ? description : undefined,
  };
}

export default function CardsView({ data, token, onReload }: Props) {
  const cards = React.useMemo(() => extractCards(data), [data]);

  const [error, setError] = React.useState<string | null>(null);

  const [isOpen, setIsOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [mode, setMode] = React.useState<Mode>({ kind: "create" });
  const [form, setForm] = React.useState<CardFormState>({
    title: "",
    category: "",
    description: "",
  });

  function openCreate() {
    setMode({ kind: "create" });
    setForm({ title: "", category: "", description: "" });
    setError(null);
    setIsOpen(true);
  }

  function openEdit(c: CardItem) {
    setMode({ kind: "edit", id: c.id });
    setForm(cardToForm(c));
    setError(null);
    setIsOpen(true);
  }

  async function onSubmit() {
    const payload = normalizePayload(form);
    if (!payload.title) {
      setError("El título es obligatorio.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (mode.kind === "create") {
        await apiCreateCard(token, payload);
      } else {
        await apiUpdateCard(token, mode.id, payload);
      }

      setIsOpen(false);
      await onReload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error guardando carta");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: CardId) {
    const ok = window.confirm("¿Seguro que quieres borrar esta carta?");
    if (!ok) return;

    setError(null);

    try {
      await apiDeleteCard(token, id);
      await onReload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error borrando carta");
    }
  }

  return (
    <div className="admin-page space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="admin-title">Cartas</h1>
          <p className="admin-subtitle">Gestiona las cartas del sistema.</p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className={PRIMARY_BLUE_BUTTON_CLASS}
        >
          + Crear carta
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ÚNICO panel contenedor con grid */}
      <div className="admin-panel p-6">
        {cards.length === 0 ? (
          <div className="flex h-44 items-center justify-center rounded-xl border border-dashed text-sm text-slate-500">
            Aún no hay cartas. Crea la primera con “Crear carta”.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <div
                key={String(c.id)}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {c.title}
                    </h3>
                    {c.category ? (
                      <p className="mt-1 text-xs text-slate-500">
                        {c.category}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">
                        Sin categoría
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={ICON_BUTTON_CLASS}
                      onClick={() => openEdit(c)}
                      aria-label="Editar carta"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className={ICON_BUTTON_CLASS}
                      onClick={() => void onDelete(c.id)}
                      aria-label="Borrar carta"
                      title="Borrar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {c.description ? (
                  <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm text-slate-600">
                    {c.description}
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-slate-500 italic">
                    Sin descripción
                  </p>
                )}

                {c.created_at ? (
                  <p className="mt-4 text-xs text-slate-400">
                    {formatDate(c.created_at)}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => (saving ? null : setIsOpen(false))}
          />

          <div className="relative z-10 w-full max-w-lg rounded-xl border bg-white shadow-xl">
            <div className="border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {mode.kind === "create" ? "Crear carta" : "Editar carta"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {mode.kind === "create"
                  ? "Rellena los campos y guarda."
                  : "Modifica los campos y guarda los cambios."}
              </p>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Título *
                </label>
                <input
                  className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-ring focus:ring-2 focus:ring-ring/20"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Ej: Comunicación"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Categoría
                </label>
                <input
                  className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-ring focus:ring-2 focus:ring-ring/20"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="Ej: Soft skills"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">
                  Descripción
                </label>
                <textarea
                  className="min-h-[110px] w-full rounded-xl border border-input bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-ring focus:ring-2 focus:ring-ring/20"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Texto de la carta…"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
              <button
                type="button"
                className="rounded-full border px-4 py-2 text-sm text-slate-700 hover:bg-secondary disabled:opacity-60"
                onClick={() => setIsOpen(false)}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                type="button"
                className={`${PRIMARY_BLUE_BUTTON_CLASS} disabled:opacity-60`}
                onClick={() => void onSubmit()}
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
