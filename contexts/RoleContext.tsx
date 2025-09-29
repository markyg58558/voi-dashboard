"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
} from "firebase/firestore";

// 👇 Export this so other files (RoleGate, nav) can import it
export type RoleName = "admin" | "reception" | "artist";
type Role = RoleName | null;

type RoleCtx = {
  role: Role;
  loading: boolean;
  refresh: () => Promise<void>;
};

const Ctx = createContext<RoleCtx>({
  role: null,
  loading: true,
  refresh: async () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = async () => {
    const u = auth.currentUser;
    if (!u) {
      setRole(null);
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", u.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // First user becomes admin; others default to artist (can be changed later in Settings)
      let defaultRole: RoleName = "artist";
      const firstQuery = query(collection(db, "users"), limit(1));
      const firstSnap = await getDocs(firstQuery);
      if (firstSnap.empty) defaultRole = "admin";

      await setDoc(userRef, {
        uid: u.uid,
        email: u.email || "",
        name: u.displayName || "",
        role: defaultRole,
        createdAt: new Date(),
      });

      setRole(defaultRole);
    } else {
      const data = snap.data() as { role?: RoleName };
      setRole(data.role ?? "artist");
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setLoading(true);
      hydrate();
    });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({ role, loading, refresh: hydrate }), [role, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole() {
  return useContext(Ctx);
}
