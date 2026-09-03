"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Testimony {
  _id: string;
  name: string;
  location?: string;
  story: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function TestimoniesManager() {
  const [items, setItems] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get("/testimonies/admin/all", true)
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function setStatus(id: string, status: "approved" | "rejected") {
    await api.put(`/testimonies/${id}/status`, { status }, true);
    load();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">Testimonies</h2>
      <p className="text-sm text-slate-500">Review and approve submissions before they go live.</p>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-400">No testimonies yet.</p>}
        {items.map((t) => (
          <Card key={t._id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ink">
                  {t.name} {t.location && <span className="font-normal text-slate-400">· {t.location}</span>}
                </p>
                <span
                  className={cn(
                    "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    t.status === "approved" && "bg-call-blue/10 text-call-blue",
                    t.status === "pending" && "bg-call-orange/10 text-call-orange",
                    t.status === "rejected" && "bg-call-red/10 text-call-red"
                  )}
                >
                  {t.status}
                </span>
              </div>
              {t.status === "pending" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setStatus(t._id, "approved")}
                    className="rounded-lg bg-call-blue/10 p-2 text-call-blue hover:bg-call-blue/20"
                    aria-label="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setStatus(t._id, "rejected")}
                    className="rounded-lg bg-call-red/10 p-2 text-call-red hover:bg-call-red/20"
                    aria-label="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-3 text-sm text-slate-600">{t.story}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
