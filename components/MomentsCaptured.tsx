"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import api from "@/lib/api";

interface Moment {
  _id: string;
  imageUrl: string;
  caption?: string;
  event?: string;
}

export default function MomentsCaptured() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/moments")
      .then((data) => setMoments((data || []).slice(0, 8)))
      .catch(() => setMoments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="moments" className="bg-cloud px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="section-eyebrow text-call-blue">Moments Captured</span>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-bold text-ink text-balance">
              Life inside the community
            </h2>
          </div>
          <Camera className="hidden h-10 w-10 shrink-0 text-call-blue/30 sm:block" />
        </div>

        {loading && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        )}

        {!loading && moments.length === 0 && (
          <p className="mt-8 text-slate-500">Photos from recent gatherings will appear here soon.</p>
        )}

        {!loading && moments.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {moments.map((m) => (
              <figure
                key={m._id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.imageUrl}
                  alt={m.caption || m.event || "Ministry moment"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {(m.caption || m.event) && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {m.caption || m.event}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
