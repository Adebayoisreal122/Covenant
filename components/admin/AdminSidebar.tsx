"use client";

import { BookOpen, CalendarDays, Quote, HandHeart, Users, Mail, LogOut, Images, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "devotions"
  | "programs"
  | "testimonies"
  | "prayers"
  | "registrations"
  | "messages"
  | "moments";

const NAV_GROUPS: { label: string; items: { key: AdminTab; label: string; icon: typeof BookOpen }[] }[] = [
  {
    label: "Content",
    items: [
      { key: "devotions", label: "Devotions", icon: BookOpen },
      { key: "programs", label: "Programs", icon: CalendarDays },
      { key: "moments", label: "Moments", icon: Images },
    ],
  },
  {
    label: "Community",
    items: [
      { key: "testimonies", label: "Testimonies", icon: Quote },
      { key: "prayers", label: "Prayer requests", icon: HandHeart },
      { key: "registrations", label: "Registrations", icon: Users },
      { key: "messages", label: "Messages", icon: Mail },
    ],
  },
];

function initials(name?: string) {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "").concat(parts[1]?.[0] || "").toUpperCase() || "A";
}

export default function AdminSidebar({
  active,
  onChange,
  adminName,
  adminEmail,
  onLogout,
  mobileOpen,
  onCloseMobile,
}: {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  adminName?: string;
  adminEmail?: string;
  onLogout: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const content = (
    <div className="flex h-full flex-col bg-ink">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon0.svg" alt="The Call Global logo" className="h-full w-full object-contain" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-sm font-bold text-white">The Call Global</p>
            <p className="truncate text-[11px] text-white/40">Admin dashboard</p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="shrink-0 rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-8 flex-1 overflow-y-auto px-3">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-white/30">
              {group.label}
            </p>
            <div className="mt-2 flex flex-col gap-0.5">
              {group.items.map(({ key, label, icon: Icon }) => {
                const isActive = active === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onChange(key);
                      onCloseMobile();
                    }}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "border-call-orange bg-white/[0.07] text-white"
                        : "border-transparent text-white/55 hover:border-white/20 hover:bg-white/[0.04] hover:text-white/85"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-call-orange" : "text-white/40 group-hover:text-white/60"
                      )}
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Account */}
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
            {initials(adminName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{adminName || "Admin"}</p>
            <p className="truncate text-xs text-white/40">{adminEmail || ""}</p>
          </div>
          <button
            onClick={onLogout}
            className="shrink-0 rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <div className="hidden lg:block lg:w-64 lg:shrink-0">
        <div className="fixed inset-y-0 left-0 w-64">{content}</div>
      </div>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-40 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn(
            "absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={onCloseMobile}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {content}
        </div>
      </div>
    </>
  );
}
