import { cn } from "@/lib/utils";

/**
 * The Call Global's signature visual motif: radiating rings that suggest
 * a call going out / being answered. Used sparingly — hero CTA, dividers.
 */
export default function PulseRing({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-3 w-3", className)} aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-call-orange animate-pulse-ring" />
      <span className="relative inline-flex h-3 w-3 rounded-full bg-call-orange" />
    </span>
  );
}
