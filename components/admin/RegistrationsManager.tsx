"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

interface Registration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  program?: { title: string };
  createdAt: string;
}

export default function RegistrationsManager() {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/registrations", true)
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  function exportCsv() {
    const header = ["Name", "Email", "Phone", "Guests", "Program", "Registered On"];
    const rows = items.map((r) => [
      r.fullName,
      r.email,
      r.phone,
      String(r.numberOfGuests),
      r.program?.title || "General",
      new Date(r.createdAt).toLocaleDateString(),
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Registrations</h2>
          <p className="text-sm text-slate-500">Everyone who has signed up for a program.</p>
        </div>
        <Button variant="secondary" onClick={exportCsv} disabled={items.length === 0}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Program</th>
              <th className="px-5 py-3">Guests</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-5 py-6 text-slate-400" colSpan={5}>
                  Loading...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td className="px-5 py-6 text-slate-400" colSpan={5}>
                  No registrations yet.
                </td>
              </tr>
            )}
            {items.map((r) => (
              <tr key={r._id} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-medium text-ink">{r.fullName}</td>
                <td className="px-5 py-3 text-slate-500">
                  {r.email}
                  <br />
                  {r.phone}
                </td>
                <td className="px-5 py-3 text-slate-500">{r.program?.title || "General"}</td>
                <td className="px-5 py-3 text-slate-500">{r.numberOfGuests}</td>
                <td className="px-5 py-3 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
