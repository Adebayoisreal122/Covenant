"use client";

import { useEffect, useState, FormEvent } from "react";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";

interface Moment {
  _id: string;
  imageUrl: string;
  caption?: string;
  event?: string;
}

export default function MomentsManager() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [event, setEvent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .get("/moments")
      .then(setMoments)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError("Choose at least one photo.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Array.from(files).forEach((file) => fd.append("images", file));
      fd.append("caption", caption);
      fd.append("event", event);

      await api.post("/moments", fd, true);
      setCaption("");
      setEvent("");
      setFiles(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't upload photos.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this photo?")) return;
    await api.del(`/moments/${id}`, true);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink">Moments Captured</h2>
          <p className="text-sm text-slate-500">Upload photos from recent gatherings.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Upload photos"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-6 p-6">
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder="Event label (e.g. Youth Conference 2026)"
              className="sm:col-span-2"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
            />
            <Input
              placeholder="Caption (optional)"
              className="sm:col-span-2"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 sm:col-span-2">
              <ImagePlus className="h-4 w-4" />
              {files && files.length > 0 ? `${files.length} photo(s) selected` : "Choose photos (up to 12)"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => setFiles(e.target.files)}
              />
            </label>
            {error && <p className="sm:col-span-2 text-sm text-call-red">{error}</p>}
            <Button type="submit" loading={saving} className="sm:col-span-2">
              Upload
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {loading && <p className="col-span-full text-sm text-slate-400">Loading...</p>}
        {!loading && moments.length === 0 && (
          <p className="col-span-full text-sm text-slate-400">No photos uploaded yet.</p>
        )}
        {moments.map((m) => (
          <div key={m._id} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.imageUrl} alt={m.caption || m.event || ""} className="h-full w-full object-cover" />
            <button
              onClick={() => handleDelete(m._id)}
              className="absolute right-2 top-2 rounded-lg bg-ink/60 p-1.5 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              aria-label="Delete photo"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {(m.caption || m.event) && (
              <p className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink/80 to-transparent p-2 text-xs text-white">
                {m.caption || m.event}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
