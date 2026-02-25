import { NextResponse } from "next/server";
import type { DashboardData } from "@/types/dashboard";

const BACKEND_URL = process.env.BACKEND_URL as string;

type BackendSession = {
  id: string | number;
  name?: string;
  title?: string;
  status?: string;
  state?: string;
  company?: { name?: string };
  company_name?: string;
  group_count?: number;
  groups_count?: number;
  progress?: number;
  tags?: string[];
};

type BackendVote = {
  id: string | number;
};

function extractArray<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (typeof json === "object" && json !== null && "results" in json) {
    const obj = json as { results?: unknown };
    if (Array.isArray(obj.results)) return obj.results as T[];
  }
  return [];
}

export async function GET(req: Request) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { detail: "Missing BACKEND_URL env var" },
      { status: 500 }
    );
  }

  const cookie = req.headers.get("cookie") ?? "";

  const commonFetch = (path: string) =>
    fetch(`${BACKEND_URL}${path}`, {
      headers: { cookie },
      cache: "no-store",
    });

  const [sessionsRes, votesRes] = await Promise.all([
    commonFetch("/api/sessions/"),
    commonFetch("/api/votes/"),
  ]);

  if (!sessionsRes.ok || !votesRes.ok) {
    return NextResponse.json(
      { detail: "Backend fetch failed" },
      { status: 502 }
    );
  }

  const sessionsJson = await sessionsRes.json();
  const votesJson = await votesRes.json();

  const sessions = extractArray<BackendSession>(sessionsJson);
  const votes = extractArray<BackendVote>(votesJson);

  const activeSessions = sessions.filter((s) => {
    const raw = String(s.status ?? s.state ?? "").toLowerCase();
    return ["en_curso", "in_progress", "active"].includes(raw);
  }).length;

  const totalGroups = sessions.reduce((acc, s) => {
    return acc + Number(s.group_count ?? s.groups_count ?? 0);
  }, 0);

  const ratedCards = votes.length;

  const mappedSessions = sessions.map((s) => {
    const rawStatus = String(s.status ?? s.state ?? "").toLowerCase();

    let status: "En curso" | "Borrador" | "Canvas" | "Cerrada" = "Borrador";

    if (["en_curso", "in_progress", "active"].includes(rawStatus))
      status = "En curso";
    if (["canvas"].includes(rawStatus))
      status = "Canvas";
    if (["cerrada", "closed", "finished"].includes(rawStatus))
      status = "Cerrada";

    return {
      id: String(s.id),
      name: s.name ?? s.title ?? `Sesión ${s.id}`,
      status,
      company: s.company?.name ?? s.company_name ?? "—",
      groups: Number(s.group_count ?? s.groups_count ?? 0),
      tags: s.tags ?? [],
      progress: Number(s.progress ?? 0),
    };
  });

  const data: DashboardData = {
    stats: {
      activeSessions,
      totalGroups,
      ratedCards,
    },
    sessions: mappedSessions,
  };

  return NextResponse.json(data);
}