import Link from "next/link";
import { Flame } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink px-5 py-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full ">
            {/* <Flame className="h-4 w-4 text-white" /> */}
            <img src="/icons/icon0.svg" alt="logo" />
          </span>
          Covenant Of Grace Revival Ministry
        </div>
        <p className="text-sm text-white/50">
          © {new Date().getFullYear()} The Call Global. All rights reserved.
        </p>
        <Link href="/admin/login" className="text-sm text-white/40 hover:text-white/70">
          Admin
        </Link>
      </div>
    </footer>
  );
}
