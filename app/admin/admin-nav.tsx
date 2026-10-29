"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "طلبات الحجز" },
  { href: "/admin/courses", label: "الكورسات" },
  { href: "/admin/messages", label: "الرسايل" },
  { href: "/admin/students", label: "الطلبة" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="أقسام لوحة التحكم" className="-mt-12 relative">
      <ul className="grid grid-cols-2 gap-2 rounded-2xl border-[1.5px] border-beige-dark bg-white p-2 sm:grid-cols-4">
        {TABS.map((tab) => {
          const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={
                  "flex min-h-12 items-center justify-center rounded-xl px-3 font-bold no-underline transition-colors " +
                  (active ? "bg-brand text-white" : "text-ink hover:bg-beige")
                }
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
