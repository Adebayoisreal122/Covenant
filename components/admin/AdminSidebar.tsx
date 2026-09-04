"use client";

import { Flame, BookOpen, CalendarDays, Quote, HandHeart, Users, Mail, LogOut, Images, } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab = "devotions" | "programs" | "testimonies" | "prayers" | "registrations" | "messages" | "moments";

const TABS: { key: AdminTab; label: string; icon: typeof BookOpen }[] = [
  { key: "devotions", label: "Devotions", icon: BookOpen },
  { key: "programs", label: "Programs", icon: CalendarDays },
  { key: "testimonies", label: "Testimonies", icon: Quote },
  { key: "prayers", label: "Prayer Requests", icon: HandHeart },
  { key: "registrations", label: "Registrations", icon: Users },
  { key: "messages", label: "Messages", icon: Mail },
  {key: "moments", label: "Moments", icon: Images,},
];

export default function AdminSidebar({
  active,
  onChange,
  adminName,
  onLogout,
}: {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  adminName?: string;
  onLogout: () => void;
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-ink px-4 py-6">
      <div className="flex items-center gap-2 px-2 font-display text-lg font-bold text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full ">
          {/* <Flame className="h-5 w-5 text-white" /> */}
            <img src="/icons/icon0.svg" alt="logo" />

        </span>
        The Call Global
      </div>
      <p className="mt-1 px-2 text-xs text-white/40">{adminName ? `Signed in as ${adminName}` : "Admin dashboard"}</p>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active === key ? "bg-cta-gradient text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </aside>
  );
}
