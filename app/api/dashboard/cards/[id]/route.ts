import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

function pickAuthHeader(req: Request): Record<string, string> {
  const auth = req.headers.get("authorization");
  return auth ? { Authorization: auth } : {};
}

export async function PATCH(
  req: Request,
  context: { params: { id: string } },
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { detail: "BACKEND_URL no configurado" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const { id } = context.params;

  const upstream = await fetch(`${BACKEND_URL}api/dashboard/cards/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...pickAuthHeader(req),
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

export async function DELETE(
  req: Request,
  context: { params: { id: string } },
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { detail: "BACKEND_URL no configurado" },
      { status: 500 },
    );
  }

  const { id } = context.params;

  const upstream = await fetch(`${BACKEND_URL}api/dashboard/cards/${id}/`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      ...pickAuthHeader(req),
    },
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
}