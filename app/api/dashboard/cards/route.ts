import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type JwtToken = {
  access?: string;
};

function isJwtToken(value: unknown): value is JwtToken {
  return typeof value === "object" && value !== null;
}

async function getAccessFromNextAuth(req: NextRequest): Promise<string | null> {
  const raw: unknown = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!isJwtToken(raw)) return null;
  return typeof raw.access === "string" ? raw.access : null;
}

export async function GET(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      { detail: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const access = await getAccessFromNextAuth(req);
  if (!access) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const upstream = await fetch(`${API_BASE}/api/dashboard/cards/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json(
      { detail: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const access = await getAccessFromNextAuth(req);
  if (!access) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const body = await req.text();

  const upstream = await fetch(`${API_BASE}/api/dashboard/cards/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body,
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}