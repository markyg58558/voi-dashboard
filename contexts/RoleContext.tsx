"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection, doc, getDoc, getDocs, limit, query, setDoc,
} from "firebase/firestore";

type Role = "admin" | "reception" | "artist" | null;

type RoleCtx = {
  role: Role;
  loading: boolean;
  refresh: () => Promise<void>;
};

const Ctx = createContext<RoleCtx>({ role: null, loading: true, refresh: async () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = async () => {
    const u = auth.currentUser;
    if (!u) { setRole(null); setLoading(false); return; }

    // ensure user doc exists; first user gets admin, otherwise artist
    const userRef = doc(db, "users", u.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      let defaultRole: Role = "artist";
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
      setRole((snap.data().role as Role) || "artist");
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => { setLoading(true); hydrate(); });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({ role, loading, refresh: hydrate }), [role, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useRole() {
  return useContext(Ctx);
}
