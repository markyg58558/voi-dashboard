"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/nav";
import { useRole } from "@/contexts/RoleContext"; // expects RoleProvider wrapping (protected) layout

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole(); // "admin" | "reception" | "artist" | null

  const canSee = (item: (typeof navItems)[number]) =>
    !item.roles || (role && item.roles.includes(role));

  return (
    <nav aria-label="Sidebar" className="space-y-1">
      {navItems.filter(canSee).map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm uppercase transition-colors",
              active ? "bg-gray-100 font-semibold" : "hover:bg-gray-100"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
