// app/(protected)/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Workshop", href: "/app/workshop" },
  { label: "Dashboard", href: "/app/admin" },
  { label: "Mazos", href: "/app/admin/mazos" },
  { label: "Cartas", href: "/app/admin/cartas" },
  { label: "Resultados", href: "/app/admin/resultados" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              W
            </div>

            <nav className="flex items-center gap-1">
              {tabs.map((t) => {
                const active =
                  pathname === t.href ||
                  (t.href !== "/app/admin" && pathname.startsWith(t.href));

                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={[
                      "rounded-md px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              + Nueva Sesión
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              M
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
