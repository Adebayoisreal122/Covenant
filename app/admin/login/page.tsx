"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import api from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.post("/auth/login", form);
      localStorage.setItem("tcg_admin_token", data.token);
      localStorage.setItem("tcg_admin", JSON.stringify(data.admin));
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-call-gradient px-5">
      <Card className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full ">
            {/* <Flame className="h-6 w-6 text-white" /> */}
            <img src="/icons/icon0.svg" alt="logo" />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate-500">The Call Global dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p className="text-sm text-call-red">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            <Lock className="h-4 w-4" /> Sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}
