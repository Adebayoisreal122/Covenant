"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import DevotionsManager from "@/components/admin/DevotionsManager";
import ProgramsManager from "@/components/admin/ProgramsManager";
import MomentsManager from "@/components/admin/MomentsManager";
import TestimoniesManager from "@/components/admin/TestimoniesManager";
import PrayersManager from "@/components/admin/PrayersManager";
import RegistrationsManager from "@/components/admin/RegistrationsManager";
import MessagesManager from "@/components/admin/MessagesManager";

const TAB_TITLES: Record<AdminTab, string> = {
  devotions: "Devotions",
  programs: "Programs",
  moments: "Moments captured",
  testimonies: "Testimonies",
  prayers: "Prayer requests",
  registrations: "Registrations",
  messages: "Messages",
};

export default function AdminDashboardPage() {
  const { admin, checking, logout } = useAdminGuard();
  const [tab, setTab] = useState<AdminTab>("devotions");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud">
        <Loader2 className="h-6 w-6 animate-spin text-call-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cloud lg:flex">
      <AdminSidebar
        active={tab}
        onChange={setTab}
        adminName={admin?.name}
        adminEmail={admin?.email}
        onLogout={logout}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminTopbar title={TAB_TITLES[tab]} onOpenMenu={() => setMobileNavOpen(true)} />

        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {tab === "devotions" && <DevotionsManager />}
          {tab === "programs" && <ProgramsManager />}
          {tab === "moments" && <MomentsManager />}
          {tab === "testimonies" && <TestimoniesManager />}
          {tab === "prayers" && <PrayersManager />}
          {tab === "registrations" && <RegistrationsManager />}
          {tab === "messages" && <MessagesManager />}
        </main>
      </div>
    </div>
  );
}