"use client";

import { Menu } from "lucide-react";

export default function AdminTopbar({ title, onOpenMenu }: { title: string; onOpenMenu: () => void }) {
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-100 bg-white/90 px-4 py-3.5 backdrop-blur lg:hidden">
      <button
        onClick={onOpenMenu}
        className="rounded-lg p-1.5 text-ink hover:bg-slate-100"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <p className="font-display text-base font-bold text-ink">{title}</p>
    </div>
  );
}
