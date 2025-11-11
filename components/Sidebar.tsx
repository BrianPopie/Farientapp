"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ai", label: "AI" },
  { href: "/settings", label: "Settings" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[240px] shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="p-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
        Workspace
      </div>
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  prefetch={false}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-muted/10 text-slate-900 dark:text-slate-50"
                      : "text-slate-600 dark:text-slate-300 hover:bg-border/30"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
