"use client";

import type { FormEvent } from "react";

type Props = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string | null;
  onAdminSubmit: (e: FormEvent<HTMLFormElement>) => void;

  joinCode: string;
  setJoinCode: (v: string) => void;
  onParticipantJoin: (e: FormEvent<HTMLFormElement>) => void;
};

export default function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onAdminSubmit,
  joinCode,
  setJoinCode,
  onParticipantJoin,
}: Props) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl grid gap-6 md:grid-cols-2">
        {/* Admin */}
        <form
          onSubmit={onAdminSubmit}
          className="space-y-4 border rounded-xl p-6 bg-background"
        >
          <h1 className="text-xl font-semibold">Admin</h1>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full border rounded-md px-3 py-2 bg-background"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              name="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="w-full border rounded-md px-3 py-2 bg-background"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              name="password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border rounded-md py-2 font-medium"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Participante */}
        <form
          onSubmit={onParticipantJoin}
          className="space-y-4 border rounded-xl p-6 bg-background"
        >
          <h2 className="text-xl font-semibold">Participante</h2>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="code">
              Código de sesión
            </label>
            <input
              id="code"
              className="w-full border rounded-md px-3 py-2 bg-background"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Ej: ABC123"
            />
          </div>

          <button
            type="submit"
            className="w-full border rounded-md py-2 font-medium"
          >
            Entrar con código
          </button>

          <p className="text-sm text-muted-foreground">
            Si te lo han dado en el taller, úsalo aquí para votar las cartas.
          </p>
        </form>
      </div>
    </main>
  );
}
