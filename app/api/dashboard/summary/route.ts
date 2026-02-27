import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function GET(req: NextRequest) {
  const token: JWT | null = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.access) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const upstream = `${BACKEND_URL}/api/dashboard/summary/`;

  const res = await fetch(upstream, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.access}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const body = await res.text();

  return new NextResponse(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}