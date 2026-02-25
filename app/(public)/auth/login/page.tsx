"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";

import LoginView from "@/components/screens/LoginView";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ADMIN LOGIN
  async function onAdminSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("[LOGIN] Attempting login with:", { email, password });

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("[LOGIN] signIn response:", res);

    setLoading(false);

    if (!res?.ok) {
      setError("Credenciales incorrectas o error del servidor");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  // PARTICIPANT JOIN
  function onParticipantJoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const code = joinCode.trim();

    if (!code) {
      setError("Introduce un código de sesión");
      return;
    }

    router.push(`/participant/${encodeURIComponent(code)}`);
  }

  return (
    <LoginView
      // admin
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      error={error}
      onAdminSubmit={onAdminSubmit}
      // participant
      joinCode={joinCode}
      setJoinCode={setJoinCode}
      onParticipantJoin={onParticipantJoin}
    />
  );
}
