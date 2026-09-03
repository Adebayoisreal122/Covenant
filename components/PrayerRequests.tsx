"use client";

import { useState, FormEvent } from "react";
import { HandHeart, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import api from "@/lib/api";

export default function PrayerRequests() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", request: "", isConfidential: false });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/prayers", form);
      setStatus("done");
      setForm({ name: "", email: "", phone: "", request: "", isConfidential: false });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="prayer" className="relative overflow-hidden bg-call-gradient px-5 py-24 lg:px-8">
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-call-red/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="section-eyebrow text-call-orange">Prayer Requests</span>
          <h2 className="mt-3 max-w-md font-display text-4xl font-bold text-white text-balance">
            Let us stand with you in prayer
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Whatever you&apos;re facing, our prayer team is here. Share as much or as little as you&apos;d
            like — every request is read and prayed over.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
            <HandHeart className="h-5 w-5 text-call-orange" />
            Prayed over within 24 hours
          </div>
        </div>

        <Card className="p-6 sm:p-8">
          {status === "done" ? (
            <p className="text-center text-call-blue font-medium py-8">
              Your request has been received. We&apos;re praying with you.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Your name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  placeholder="Phone (optional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Share your prayer request..."
                rows={4}
                required
                value={form.request}
                onChange={(e) => setForm({ ...form, request: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={form.isConfidential}
                  onChange={(e) => setForm({ ...form, isConfidential: e.target.checked })}
                  className="rounded border-slate-300 text-call-blue focus:ring-call-blue"
                />
                <Lock className="h-3.5 w-3.5" /> Keep this confidential
              </label>
              {status === "error" && (
                <p className="text-sm text-call-red">Something went wrong — please try again.</p>
              )}
              <Button type="submit" loading={status === "submitting"} className="w-full">
                Send prayer request
              </Button>
            </form>
          )}
        </Card>
      </div>
    </section>
  );
}
