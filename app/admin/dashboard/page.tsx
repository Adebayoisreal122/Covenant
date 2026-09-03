"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAdminGuard } from "@/components/admin/useAdminGuard";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import DevotionsManager from "@/components/admin/DevotionsManager";
import ProgramsManager from "@/components/admin/ProgramsManager";
import TestimoniesManager from "@/components/admin/TestimoniesManager";
import PrayersManager from "@/components/admin/PrayersManager";
import RegistrationsManager from "@/components/admin/RegistrationsManager";
import MessagesManager from "@/components/admin/MessagesManager";

export default function AdminDashboardPage() {
  const { admin, checking, logout } = useAdminGuard();
  const [tab, setTab] = useState<AdminTab>("devotions");

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cloud">
        <Loader2 className="h-6 w-6 animate-spin text-call-blue" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cloud">
      <AdminSidebar active={tab} onChange={setTab} adminName={admin?.name} onLogout={logout} />
      <main className="flex-1 overflow-y-auto p-8">
        {tab === "devotions" && <DevotionsManager />}
        {tab === "programs" && <ProgramsManager />}
        {tab === "testimonies" && <TestimoniesManager />}
        {tab === "prayers" && <PrayersManager />}
        {tab === "registrations" && <RegistrationsManager />}
        {tab === "messages" && <MessagesManager />}
      </main>
    </div>
  );
}
