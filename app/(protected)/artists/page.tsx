"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ArtistForm, { type Artist } from "@/components/artists/ArtistForm";
import RoleGate from "@/components/RoleGate";

type ArtistRow = Artist & {
  id: string;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

function instaUrl(handle?: string) {
  if (!handle) return undefined;
  return handle.startsWith("http")
    ? handle
    : `https://instagram.com/${handle.replace(/^@/, "")}`;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  // Edit sheet state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<Partial<Artist> | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // live list: ONLY active artists
  useEffect(() => {
    const qy = query(
      collection(db, "artists"),
      where("status", "==", "active"),
      orderBy("name", "asc")
    );
    const unsub = onSnapshot(qy, (snap) => {
      const items: ArtistRow[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          name: data.name ?? "",
          email: data.email,
          instagram: data.instagram,
          status: (data.status ?? "active") as "active" | "inactive",
          createdAt: data.createdAt ?? null,
          updatedAt: data.updatedAt ?? null,
        };
      });
      setArtists(items);
    });
    return () => unsub();
  }, []);

  // load a fresh copy from Firestore when opening editor
  const openEdit = async (id: string) => {
    setLoadingEdit(true);
    setEditId(id);
    setEditOpen(true);
    try {
      const snap = await getDoc(doc(db, "artists", id));
      setEditInitial((snap.data() as any) ?? null);
    } finally {
      setLoadingEdit(false);
    }
  };

  const confirmDelete = async (id: string) => {
    if (!confirm("Delete this artist? This cannot be undone.")) return;
    await deleteDoc(doc(db, "artists", id));
  };

  return (
    <RoleGate allow={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Artists</h1>
            <p className="text-sm text-muted-foreground">Active artist profiles</p>
          </div>
          <Sheet open={createOpen} onOpenChange={setCreateOpen}>
            <SheetTrigger asChild>
              <Button>Add artist</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add artist</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <ArtistForm mode="create" onDone={() => setCreateOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team (Active)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Instagram</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {artists.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="py-2 font-medium">{a.name}</td>
                      <td className="py-2">{a.email || "—"}</td>
                      <td className="py-2">
                        {a.instagram ? (
                          <a className="underline" href={instaUrl(a.instagram)} target="_blank">
                            {a.instagram}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(a.id)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => confirmDelete(a.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {artists.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-500">
                        No active artists yet — add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit slide-over */}
        <Sheet open={editOpen} onOpenChange={(o) => { if (!o) { setEditOpen(false); setEditId(null); setEditInitial(null); } }}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit artist</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {loadingEdit ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : editId && editInitial ? (
                <ArtistForm
                  mode="edit"
                  id={editId}
                  initial={editInitial}
                  onDone={() => { setEditOpen(false); setEditId(null); }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">No artist selected.</p>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </RoleGate>
  );
}
