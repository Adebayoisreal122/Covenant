"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAdminGuard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("tcg_admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    api
      .get("/auth/me", true)
      .then((data) => setAdmin(data))
      .catch(() => {
        localStorage.removeItem("tcg_admin_token");
        router.replace("/admin/login");
      })
      .finally(() => setChecking(false));
  }, [router]);

  function logout() {
    localStorage.removeItem("tcg_admin_token");
    localStorage.removeItem("tcg_admin");
    router.replace("/admin/login");
  }

  return { admin, checking, logout };
}
