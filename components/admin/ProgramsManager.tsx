"use client";

import { useEffect, useState, FormEvent } from "react";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";

interface Program {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  startTime?: string;
  venue: string;
  category: string;
  isOnline: boolean;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  startDate: "",
  startTime: "",
  venue: "",
  address: "",
  category: "service",
  isOnline: false,
  onlineLink: "",
  capacity: "",
};

const CATEGORIES = ["crusade", "conference", "service", "outreach", "training", "other"];

export default function ProgramsManager() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .get("/programs")
      .then(setPrograms)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (image) fd.append("image", image);

      await api.post("/programs", fd, true);
      setForm(EMPTY_FORM);
      setImage(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post program.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this program?")) return;
    await api.del(`/programs/${id}`, true);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Upcoming Programs</h2>
          <p className="text-sm text-slate-500">Announce services, crusades, and conferences.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New program"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Program title"
              required
              className="sm:col-span-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              rows={4}
              required
              className="sm:col-span-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
            <Input
              placeholder="Start time (e.g. 6:00 PM)"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <select
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm capitalize focus:border-call-blue focus:outline-none"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Capacity (optional)"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <Input
              placeholder="Venue"
              required
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
            />
            <Input
              placeholder="Address (optional)"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm text-slate-500 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.isOnline}
                onChange={(e) => setForm({ ...form, isOnline: e.target.checked })}
                className="rounded border-slate-300 text-call-blue focus:ring-call-blue"
              />
              This program is online
            </label>
            {form.isOnline && (
              <Input
                placeholder="Online link (Zoom, YouTube, etc.)"
                className="sm:col-span-2"
                value={form.onlineLink}
                onChange={(e) => setForm({ ...form, onlineLink: e.target.value })}
              />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 sm:col-span-2">
              <ImagePlus className="h-4 w-4" />
              {image ? image.name : "Attach a flyer / image (optional)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
            {error && <p className="sm:col-span-2 text-sm text-call-red">{error}</p>}
            <Button type="submit" loading={saving} className="sm:col-span-2">
              Publish program
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {!loading && programs.length === 0 && (
          <p className="text-sm text-slate-400">No programs posted yet.</p>
        )}
        {programs.map((p) => (
          <Card key={p._id} className="flex items-center gap-4 p-4">
            {p.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-ink">{p.title}</p>
              <p className="text-xs text-slate-400 capitalize">
                {p.category} · {new Date(p.startDate).toLocaleDateString()} · {p.isOnline ? "Online" : p.venue}
              </p>
            </div>
            <button
              onClick={() => handleDelete(p._id)}
              className="rounded-lg p-2 text-slate-400 hover:bg-call-red/10 hover:text-call-red"
              aria-label="Delete program"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
