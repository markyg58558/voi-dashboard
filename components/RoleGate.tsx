"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/contexts/RoleContext";
import type { RoleName } from "@/contexts/RoleContext";

export default function RoleGate({
  allow,
  children,
}: {
  allow: RoleName[];   // e.g., ["admin", "reception"]
  children: ReactNode;
}) {
  const { role, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role && !allow.includes(role)) {
      router.replace("/dashboard");
    }
  }, [loading, role, allow, router]);

  if (loading) return null;
  if (!role || !allow.includes(role)) return null;

  return <>{children}</>;
}
