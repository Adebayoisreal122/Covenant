"use client";

import { useEffect, useState, FormEvent } from "react";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";

interface Devotion {
  _id: string;
  title: string;
  scriptureReference: string;
  scriptureText?: string;
  body: string;
  imageUrl?: string;
  date: string;
}

const EMPTY_FORM = {
  title: "",
  scriptureReference: "",
  scriptureText: "",
  body: "",
  date: new Date().toISOString().slice(0, 10),
};

export default function DevotionsManager() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .get("/devotions?limit=50")
      .then((data) => setDevotions(data.items || []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      await api.post("/devotions", fd, true);
      setForm(EMPTY_FORM);
      setImage(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't post devotion.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this devotion?")) return;
    await api.del(`/devotions/${id}`, true);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Daily Devotions</h2>
          <p className="text-sm text-slate-500">Post today&apos;s word for the community.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "New devotion"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Title"
              required
              className="sm:col-span-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Scripture reference (e.g. Psalm 91:1-4)"
              required
              value={form.scriptureReference}
              onChange={(e) => setForm({ ...form, scriptureReference: e.target.value })}
            />
            <Input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Textarea
              placeholder="Scripture text (optional)"
              rows={2}
              className="sm:col-span-2"
              value={form.scriptureText}
              onChange={(e) => setForm({ ...form, scriptureText: e.target.value })}
            />
            <Textarea
              placeholder="Devotion body"
              rows={6}
              required
              className="sm:col-span-2"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 sm:col-span-2">
              <ImagePlus className="h-4 w-4" />
              {image ? image.name : "Attach an image (optional)"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
            {error && <p className="sm:col-span-2 text-sm text-call-red">{error}</p>}
            <Button type="submit" loading={saving} className="sm:col-span-2">
              Publish devotion
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-slate-400">Loading...</p>}
        {!loading && devotions.length === 0 && (
          <p className="text-sm text-slate-400">No devotions posted yet.</p>
        )}
        {devotions.map((d) => (
          <Card key={d._id} className="flex items-center gap-4 p-4">
            {d.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-ink">{d.title}</p>
              <p className="text-xs text-slate-400">
                {d.scriptureReference} · {new Date(d.date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(d._id)}
              className="rounded-lg p-2 text-slate-400 hover:bg-call-red/10 hover:text-call-red"
              aria-label="Delete devotion"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
