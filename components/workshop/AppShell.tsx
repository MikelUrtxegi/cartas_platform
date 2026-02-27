"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/app/admin", label: "Dashboard" },
  { href: "/app/admin/decks", label: "Mazos" },
  { href: "/app/admin/cards", label: "Cartas" },
  { href: "/app/admin/results", label: "Resultados" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AppShell({
  children,
  primaryActionHref = "/sessions/new",
  primaryActionLabel = "Nueva sesión",
}: {
  children: React.ReactNode;
  primaryActionHref?: string;
  primaryActionLabel?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/app/admin" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                C-D
              </div>
              <span className="text-sm font-semibold text-slate-900">
                Cartas Digitales
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {tabs.map((t) => {
                const href = t.href;
                const isDashboardRoot = href === "/app/admin"; // ajusta si tu dashboard es otra ruta
                const active = isDashboardRoot
                  ? pathname === href
                  : pathname === href || pathname?.startsWith(href + "/");

                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link
            href={primaryActionHref}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + {primaryActionLabel}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
