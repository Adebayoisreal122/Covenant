"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X,} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Devotions", href: "#devotions" },
  { label: "Programs", href: "#programs" },
  { label: "Moments", href: "#moments" },
  { label: "Testimonies", href: "#testimonies" },
  { label: "Prayer", href: "#prayer" },
  { label: "Join Us", href: "#join" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass-nav shadow-lg shadow-black/10" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full ">
            {/* <Flame className="h-5 w-5 text-white" strokeWidth={2.4} /> */}
            <img src="/icons/icon0.svg" alt="logo" />
          </span>
         Covenant Of Grace Revival Ministry
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition-colors hover:text-call-orange"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a href="#join">
            <Button size="sm">Register Now</Button>
          </a>
        </div>

        <button
          className="text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="glass-nav lg:hidden">
          <div className="flex flex-col gap-1 px-5 pb-5 pt-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            <a href="#join" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full">Register Now</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
