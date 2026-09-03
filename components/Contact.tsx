"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import api from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/contact", form);
      setStatus("done");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="section-eyebrow text-call-red">Contact</span>
        <h2 className="mt-3 max-w-xl font-display text-4xl font-bold text-ink text-balance">
          We&apos;d love to hear from you
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-call-blue/10 text-call-blue">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Email</p>
                <p className="text-sm text-slate-500">hello@thecallglobal.org</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-call-red/10 text-call-red">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Phone</p>
                <p className="text-sm text-slate-500">+234 800 000 0000</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-call-orange/10 text-call-orange">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Location</p>
                <p className="text-sm text-slate-500">Oyo State, Nigeria</p>
              </div>
            </div>
          </div>

          <Card className="p-6 sm:p-8 lg:col-span-3">
            {status === "done" ? (
              <p className="py-10 text-center font-medium text-call-blue">
                Your message has been sent. We&apos;ll get back to you soon.
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
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  placeholder="Subject"
                  className="sm:col-span-2"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
                <Textarea
                  placeholder="Your message"
                  rows={5}
                  required
                  className="sm:col-span-2"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                {status === "error" && (
                  <p className="sm:col-span-2 text-sm text-call-red">
                    Something went wrong — please try again.
                  </p>
                )}
                <Button type="submit" loading={status === "submitting"} className="sm:col-span-2">
                  Send message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
