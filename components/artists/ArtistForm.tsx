"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const SERVICE_OPTIONS = ["Tattoo", "Consultation", "Touch up"] as const;

export type Artist = {
  name: string;
  email?: string;
  phone?: string;
  instagram?: string;
  specialty?: string;
  bio?: string;
  status: "active" | "inactive";
  abn?: string;
  gstRegistered?: boolean;
  commissionPercent?: number | null;
  startDate?: Timestamp | null;
  endDate?: Timestamp | null;
  services?: string[];
};

export default function ArtistForm({
  mode = "create",
  id,
  initial,
  onDone,
}: {
  mode?: "create" | "edit";
  id?: string;
  initial?: Partial<Artist>;
  onDone?: () => void;
}) {
  // base
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [instagram, setInstagram] = useState(initial?.instagram ?? "");
  const [specialty, setSpecialty] = useState(initial?.specialty ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(initial?.status ?? "active");

  // new fields
  const [abn, setAbn] = useState(initial?.abn ?? "");
  const [gstRegistered, setGstRegistered] = useState<boolean>(Boolean(initial?.gstRegistered));
  const [commission, setCommission] = useState(
    typeof initial?.commissionPercent === "number" ? String(initial?.commissionPercent) : ""
  );
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [services, setServices] = useState<string[]>(
    Array.isArray(initial?.services) ? (initial!.services as string[]) : []
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // helpers
  const toInputDate = (v?: any) => {
    if (!v) return "";
    const d: Date = v instanceof Date ? v : v?.toDate ? v.toDate() : new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  useEffect(() => {
    setStartDateStr(toInputDate(initial?.startDate));
    setEndDateStr(toInputDate(initial?.endDate));
  }, [initial?.startDate, initial?.endDate]);

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const omitUndefined = <T extends Record<string, any>>(obj: T): T =>
    Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Name is required");

    if (abn && !/^\d{11}$/.test(abn.replace(/\s+/g, ""))) {
      return setError("ABN should be 11 digits (no spaces).");
    }

    // commission → number or null (never undefined)
    let commissionNum: number | null = null;
    if (commission.trim() !== "") {
      const n = Number(commission);
      if (Number.isNaN(n)) return setError("Commission % must be a number (0–100).");
      commissionNum = Math.max(0, Math.min(100, n));
    }

    const startTs = startDateStr ? Timestamp.fromDate(new Date(startDateStr)) : null;
    const endTs = endDateStr ? Timestamp.fromDate(new Date(endDateStr)) : null;

    setSaving(true);
    try {
      const payload = omitUndefined({
        name: name.trim(),
        status,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        instagram: instagram.trim() || undefined,
        specialty: specialty.trim() || undefined,
        bio: bio.trim() || undefined,
        abn: abn.trim() || undefined,
        gstRegistered,
        commissionPercent: commissionNum,
        startDate: startTs,
        endDate: endTs,
        services,
      });

      if (mode === "create") {
        await addDoc(collection(db, "artists"), {
          ...payload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (mode === "edit" && id) {
        await updateDoc(doc(db, "artists", id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
      }

      onDone?.();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Identity */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle or URL" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g., realism, fine line" />
        </div>
      </section>

      {/* Business */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="abn">ABN</Label>
          <Input id="abn" value={abn} onChange={(e) => setAbn(e.target.value)} placeholder="11 digits" />
          <label className="mt-2 flex items-center gap-2 text-sm">
            <Checkbox checked={gstRegistered} onCheckedChange={(v) => setGstRegistered(Boolean(v))} />
            <span>GST registered</span>
          </label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="commission">Commission %</Label>
          <Input
            id="commission"
            type="number"
            step="0.1"
            min={0}
            max={100}
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            placeholder="e.g., 40"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input id="startDate" type="date" value={startDateStr} onChange={(e) => setStartDateStr(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End date</Label>
            <Input id="endDate" type="date" value={endDateStr} onChange={(e) => setEndDateStr(e.target.value)} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="space-y-3">
        <Label>Services</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          {SERVICE_OPTIONS.map((s) => (
            <label key={s} className="flex items-center gap-2 rounded-md border px-3 py-2">
              <Checkbox checked={services.includes(s)} onCheckedChange={() => toggleService(s)} aria-label={s} />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Bio */}
      <section className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : mode === "edit" ? "Save changes" : "Create artist"}
        </Button>
      </div>
    </form>
  );
}
