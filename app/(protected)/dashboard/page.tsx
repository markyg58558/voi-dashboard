"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
          Dashboard
        </h1>

        {/* TEST badge – remove later */}
        <span className="inline-flex items-center rounded-full bg-voi px-2 py-0.5 text-xs font-semibold text-white">
          TEST UPDATE #1
        </span>
      </div>

      <p className="text-sm text-neutral-500">Quick snapshot of studio activity.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Leads (today)" value="0" />
        <StatCard title="Bookings (this week)" value="0" />
        <StatCard title="Revenue (this month)" value="$0" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="uppercase tracking-wide">Getting started</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-neutral-600 space-y-1">
          <p>Use the top navigation to move between sections.</p>
          <p>
            Open <span className="font-semibold">Account → Log out</span> to confirm protection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-wide text-neutral-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold">{value}</div>
      </CardContent>
    </Card>
  );
}
