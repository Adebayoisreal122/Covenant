"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Prayer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  request: string;
  isConfidential: boolean;
  status: "new" | "praying" | "answered" | "archived";
  createdAt: string;
}

const STATUSES: Prayer["status"][] = ["new", "praying", "answered", "archived"];

export default function PrayersManager() {
  const [items, setItems] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get("/prayers", true)
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: Prayer["status"]) {
    await api.put(`/prayers/${id}`, { status }, true);
    load();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">Prayer Requests</h2>
      <p className="text-sm text-slate-500">Track and follow up on requests from the community.</p>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-400">No prayer requests yet.</p>}
        {items.map((p) => (
          <Card key={p._id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">
                  {p.name} {p.isConfidential && <span className="text-xs text-slate-400">(confidential)</span>}
                </p>
                <p className="text-xs text-slate-400">{p.email || p.phone || "No contact provided"}</p>
              </div>
              <select
                value={p.status}
                onChange={(e) => updateStatus(p._id, e.target.value as Prayer["status"])}
                className={cn(
                  "rounded-full border-0 px-3 py-1 text-xs font-medium capitalize focus:outline-none focus:ring-2 focus:ring-call-blue/30",
                  p.status === "new" && "bg-call-orange/10 text-call-orange",
                  p.status === "praying" && "bg-call-blue/10 text-call-blue",
                  p.status === "answered" && "bg-emerald-100 text-emerald-700",
                  p.status === "archived" && "bg-slate-100 text-slate-500"
                )}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-sm text-slate-600">{p.request}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
