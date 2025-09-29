"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm uppercase",
                active ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
