"use client";

import type { ReactNode } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import TopNav from "@/components/nav/TopNav";
import Sidebar from "@/components/nav/Sidebar";
import { Separator } from "@/components/ui/separator";

export default function ProtectedAppLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <TopNav />
      <div className="mx-auto flex w-full max-w-screen-2xl">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 shrink-0 border-r bg-white p-3 md:block">
          <Sidebar />
          <Separator className="my-3" />
          <div className="px-3 text-xs text-neutral-500">© Victims of Ink</div>
        </aside>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
