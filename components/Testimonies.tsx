"use client";

import { useEffect, useState, FormEvent } from "react";
import { Quote, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import api from "@/lib/api";

interface Testimony {
  _id: string;
  name: string;
  location?: string;
  story: string;
}

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", location: "", story: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  useEffect(() => {
    api
      .get("/testimonies")
      .then((data) => setTestimonies((data || []).slice(0, 6)))
      .catch(() => setTestimonies([]));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/testimonies", form);
      setStatus("done");
      setForm({ name: "", email: "", location: "", story: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="testimonies" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="section-eyebrow text-call-red">Testimonies</span>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-bold text-ink text-balance">
              Stories of what God has done
            </h2>
          </div>
          <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
            <Sparkles className="h-4 w-4" /> Share your testimony
          </Button>
        </div>

        {showForm && (
          <Card className="mt-8 p-6 sm:p-8">
            {status === "done" ? (
              <p className="text-center text-call-blue font-medium py-6">
                Thank you for sharing! Your testimony is awaiting review and will appear here once approved.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  placeholder="Location (optional)"
                  className="sm:col-span-2"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <Textarea
                  placeholder="Tell us your story..."
                  rows={5}
                  required
                  className="sm:col-span-2"
                  value={form.story}
                  onChange={(e) => setForm({ ...form, story: e.target.value })}
                />
                {status === "error" && (
                  <p className="sm:col-span-2 text-sm text-call-red">
                    Something went wrong — please try again.
                  </p>
                )}
                <Button type="submit" loading={status === "submitting"} className="sm:col-span-2">
                  Submit testimony
                </Button>
              </form>
            )}
          </Card>
        )}

        {testimonies.length > 0 && (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonies.map((t) => (
              <Card key={t._id} className="p-6">
                <Quote className="h-7 w-7 text-call-orange/50" />
                <p className="mt-4 text-sm leading-relaxed text-slate-600 line-clamp-6">{t.story}</p>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {t.name}
                  {t.location && <span className="font-normal text-slate-400"> · {t.location}</span>}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
