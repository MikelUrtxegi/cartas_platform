"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Item({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition",
        active
          ? "bg-blue-50 text-blue-700"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AdminTopNav() {
  return (
    <div className="w-full border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/app/admin"
            className="flex items-center gap-2 font-semibold"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm">
              C-D
            </span>
            Cartas Digitales
          </Link>

          <nav className="flex items-center gap-1">
            <Item href="/app/admin" label="Dashboard" />
            <Item href="/app/admin/decks" label="Mazos" />
            <Item href="/app/admin/cartas" label="Cartas" />
            <Item href="/app/admin/results" label="Resultados" />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/app/admin/sessions"
            className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Nueva Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
