"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Logo from "@/components/Logo";
import Sidebar from "@/components/nav/Sidebar";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useRole } from "@/contexts/RoleContext";

// shadcn
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

// icon
import { Menu } from "lucide-react";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole(); // "admin" | "reception" | "artist" | null

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const user = auth.currentUser;
  const initial = (user?.displayName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  const canSee = (item: (typeof navItems)[number]) =>
    !item.roles || (role && item.roles.includes(role));

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center gap-4 px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="p-4"><Logo /></div>
            <div className="border-t p-2">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>

        <Logo />

        {/* Primary nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.filter(canSee).map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href}>
                <Button
                  variant={active ? "secondary" : "ghost"}
                  className={cn("uppercase tracking-wide", active && "bg-gray-100")}
                >
                  {label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto">
          <AccountMenu onLogout={logout} initial={initial} role={role ?? undefined} />
        </div>
      </div>
    </header>
  );
}

function AccountMenu({
  onLogout,
  initial,
  role,
}: {
  onLogout: () => Promise<void>;
  initial: string;
  role?: "admin" | "reception" | "artist";
}) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          Signed in{role ? ` — ${role}` : ""}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/artists")}>Manage artists</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
