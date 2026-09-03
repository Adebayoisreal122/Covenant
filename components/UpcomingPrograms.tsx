"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

interface Program {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  startDate: string;
  startTime?: string;
  venue: string;
  isOnline: boolean;
  category: string;
}

export default function UpcomingPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/programs?upcoming=true")
      .then((data) => setPrograms(data || []))
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="programs" className="bg-white px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <span className="section-eyebrow text-call-orange">Upcoming Programs</span>
        <h2 className="mt-3 max-w-xl font-display text-4xl font-bold text-ink text-balance">
          Gatherings you don&apos;t want to miss
        </h2>

        {loading && (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        )}

        {!loading && programs.length === 0 && (
          <p className="mt-8 text-slate-500">No upcoming programs right now — check back soon.</p>
        )}

        {!loading && programs.length > 0 && (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {programs.map((p) => (
              <Card key={p._id} className="flex flex-col overflow-hidden">
                <div className="relative h-44 w-full bg-call-blue">
                  {p.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-cta-gradient px-3 py-1 text-xs font-semibold text-white capitalize">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold text-ink">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600 line-clamp-3">{p.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-call-blue" />
                      {new Date(p.startDate).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {p.startTime ? ` · ${p.startTime}` : ""}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-call-red" />
                      {p.isOnline ? "Online" : p.venue}
                    </div>
                  </div>
                  <a href="#join" className="mt-5">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      Register <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
