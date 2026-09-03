"use client";

import { useEffect, useState } from "react";
import { BookOpen, Calendar } from "lucide-react";
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
  author?: string;
}

export default function DailyDevotions() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/devotions?limit=3")
      .then((data) => setDevotions(data.items || []))
      .catch(() => setError("Couldn't load devotions right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="devotions" className="bg-cloud px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="section-eyebrow text-call-red">Daily Devotions</span>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-bold text-ink text-balance">
              A word to start your day
            </h2>
          </div>
          <BookOpen className="hidden h-10 w-10 shrink-0 text-call-blue/30 sm:block" />
        </div>

        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        )}

        {error && <p className="mt-8 text-slate-500">{error}</p>}

        {!loading && !error && devotions.length === 0 && (
          <p className="mt-8 text-slate-500">No devotions posted yet. Check back soon.</p>
        )}

        {!loading && devotions.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {devotions.map((d) => (
              <Card key={d._id} className="flex flex-col overflow-hidden">
                {d.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.imageUrl} alt="" className="h-40 w-full object-cover" />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(d.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-ink">{d.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-call-blue">{d.scriptureReference}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
                    {d.body}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
