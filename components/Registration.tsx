"use client";

import { useEffect, useState, FormEvent } from "react";
import { Facebook, MessageCircle, Send, CheckCircle2,   Instagram, Music2,  Youtube, } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";

interface GroupLinks {
  facebook: string;
  whatsapp: string;
  telegram: string;
  youtube: string;
  instagram: string;
  tiktok: string;
}

const GROUP_META = [
  {
    key: "facebook" as const,
    label: "Facebook Group",
    icon: Facebook,
    color: "bg-call-blue",
  },
  {
    key: "whatsapp" as const,
    label: "WhatsApp Community",
    icon: MessageCircle,
    color: "bg-green-500",
  },
  {
    key: "telegram" as const,
    label: "Telegram Channel",
    icon: Send,
    color: "bg-sky-500",
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    icon: Instagram,
    color: "bg-orange-700",
  },
  {
    key: "tiktok" as const,
    label: "TikTok",
    icon: Music2,
    color: "bg-black",
  },
];

export default function Registration() {
  const [links, setLinks] = useState<GroupLinks | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    numberOfGuests: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  useEffect(() => {
    api
      .get("/registrations/groups")
      .then(setLinks)
      .catch(() => setLinks(null));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await api.post("/registrations", {
        ...form,
        numberOfGuests:
          form.numberOfGuests === "" ? 0 : Number(form.numberOfGuests),
      });

      setStatus("done");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        numberOfGuests: "",
      });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="join" className="bg-cloud px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="section-eyebrow text-call-blue">
          Registration &amp; Community
        </span>
        <h2 className="mt-3 max-w-xl font-display text-4xl font-bold text-ink text-balance">
          Register, then stay connected
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Registration form */}
          <Card className="p-6 sm:p-8 lg:col-span-3">
            <h3 className="font-display text-xl font-bold text-ink">
              Program registration
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Reserve your spot for our next gathering.
            </p>

            {status === "done" ? (
              <div className="mt-8 flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-call-blue" />
                <p className="mt-4 font-medium text-ink">
                  You&apos;re registered! Check your email for details.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 sm:grid-cols-2"
              >
                <Input
                  placeholder="Full name"
                  required
                  className="sm:col-span-2"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  placeholder="Phone number"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Guests joining you"
                  className="sm:col-span-2"
                  value={form.numberOfGuests}
                  onChange={(e) =>
                    setForm({ ...form, numberOfGuests: e.target.value })
                  }
                />
                {status === "error" && (
                  <p className="sm:col-span-2 text-sm text-call-red">
                    Something went wrong — please try again.
                  </p>
                )}
                <Button
                  type="submit"
                  loading={status === "submitting"}
                  className="sm:col-span-2"
                >
                  Complete registration
                </Button>
              </form>
            )}
          </Card>

          {/* Join groups */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="font-display text-xl font-bold text-ink">
              Join our community
            </h3>
            <p className="text-sm text-slate-500">
              Get daily encouragement, program updates, and connect with others.
            </p>
            {GROUP_META.map(({ key, label, icon: Icon, color }) => (
              <a
                key={key}
                href={links?.[key] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${color}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    {label}
                  </span>
                  <span className="block text-xs text-slate-400">
                    Tap to join
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
