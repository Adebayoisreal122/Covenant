"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export default function MessagesManager() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get("/contact", true)
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function markRead(id: string, status: ContactMessage["status"]) {
    await api.put(`/contact/${id}`, { status }, true);
    load();
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">Contact Messages</h2>
      <p className="text-sm text-slate-500">Messages sent through the contact form.</p>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {!loading && items.length === 0 && <p className="text-sm text-slate-400">No messages yet.</p>}
        {items.map((m) => (
          <Card
            key={m._id}
            className="cursor-pointer p-5"
            onClick={() => m.status === "new" && markRead(m._id, "read")}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">
                  {m.name} <span className="font-normal text-slate-400">· {m.email}</span>
                </p>
                {m.subject && <p className="text-sm text-slate-500">{m.subject}</p>}
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  m.status === "new" && "bg-call-orange/10 text-call-orange",
                  m.status === "read" && "bg-call-blue/10 text-call-blue",
                  m.status === "replied" && "bg-emerald-100 text-emerald-700"
                )}
              >
                {m.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{m.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
