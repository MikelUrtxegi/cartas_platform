"use client";

import { useEffect, useMemo, useState } from "react";

type Deck = {
  id: number;
  name: string;
  description: string | null;
  cards_count?: number;
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return typeof err === "string" ? err : "Error desconocido";
}

function extractDecks(json: unknown): Deck[] {
  if (Array.isArray(json)) return json as Deck[];

  if (typeof json === "object" && json !== null && "results" in json) {
    const results = (json as { results?: unknown }).results;
    if (Array.isArray(results)) return results as Deck[];
  }

  return [];
}

export default function NewSessionView() {
  // Form state
  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [groups, setGroups] = useState<number>(3);
  const [selectedDeckIds, setSelectedDeckIds] = useState<number[]>([]);

  // Data state
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loadingDecks, setLoadingDecks] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDecks() {
      try {
        setLoadingDecks(true);
        setError(null);

        const res = await fetch("/api/dashboard/decks/", {
          method: "GET",
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Error cargando mazos (${res.status})`);
        }

        const json: unknown = await res.json();
        const items = extractDecks(json);

        if (!cancelled) setDecks(items);
      } catch (e: unknown) {
        if (!cancelled) setError(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoadingDecks(false);
      }
    }

    loadDecks();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleDeck = (deckId: number) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId)
        ? prev.filter((id) => id !== deckId)
        : [...prev, deckId],
    );
  };

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      company.trim().length > 0 &&
      groups > 0 &&
      selectedDeckIds.length > 0 &&
      !saving
    );
  }, [name, company, groups, selectedDeckIds, saving]);

  async function onCreateSession() {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: name.trim(),
        company_name: company.trim(),
        groups: Math.max(1, groups),
        deck_ids: selectedDeckIds,
      };

      // ✅ Ajusta endpoint real si es distinto
      const res = await fetch("/api/dashboard/sessions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Error creando sesión (${res.status})`);
      }

      // TODO: aquí luego hacemos redirect a /dashboard o /sessions/{id}
      alert("Sesión creada ✅ (falta redirección)");
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Nueva Sesión</h1>
        <p className="mt-1 text-slate-500">
          Configura los detalles del workshop
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Izquierda */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Información básica
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="session_name"
                  className="text-sm font-medium text-slate-700"
                >
                  Nombre de la sesión
                </label>
                <input
                  id="session_name"
                  name="session_name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  type="text"
                  placeholder="Ej: Transformación Digital Q1"
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="company_name"
                  className="text-sm font-medium text-slate-700"
                >
                  Empresa
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  value={company}
                  onChange={(e) => setCompany(e.currentTarget.value)}
                  type="text"
                  placeholder="Ej: TechCorp"
                  className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="groups"
                  className="text-sm font-medium text-slate-700"
                >
                  Número de grupos
                </label>
                <input
                  id="groups"
                  name="groups"
                  value={groups}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const raw = e.currentTarget.value;
                    const n = raw === "" ? 1 : Number(raw);
                    setGroups(Number.isFinite(n) && n >= 1 ? n : 1);
                  }}
                  type="number"
                  min={1}
                  placeholder="3"
                  className="mt-2 w-24 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Derecha */}
        <div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Seleccionar mazos
            </h2>

            <div className="mt-6 space-y-4">
              {loadingDecks && (
                <div className="text-sm text-slate-500">Cargando mazos…</div>
              )}

              {!loadingDecks && decks.length === 0 && (
                <div className="text-sm text-slate-500">
                  No hay mazos todavía. Crea uno en “Mazos”.
                </div>
              )}

              {!loadingDecks &&
                decks.map((deck) => {
                  const selected = selectedDeckIds.includes(deck.id);

                  return (
                    <div
                      key={deck.id}
                      onClick={() => toggleDeck(deck.id)}
                      className={`cursor-pointer rounded-lg border p-4 transition ${
                        selected
                          ? "border-blue-600 bg-blue-50"
                          : "hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">
                            {deck.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {deck.description ?? "—"}
                            {typeof deck.cards_count === "number"
                              ? ` · ${deck.cards_count} cartas`
                              : ""}
                          </div>
                        </div>

                        <div
                          className={`h-5 w-5 shrink-0 rounded border ${
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-3">
        <button
          type="button"
          className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
          onClick={() => history.back()}
          disabled={saving}
        >
          Cancelar
        </button>

        <button
          type="button"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          onClick={onCreateSession}
          disabled={!canSubmit}
        >
          {saving ? "Creando…" : "Crear sesión"}
        </button>
      </div>
    </div>
  );
}
