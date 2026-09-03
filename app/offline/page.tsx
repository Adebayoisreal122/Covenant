import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-call-gradient px-5 text-center">
      <WifiOff className="h-12 w-12 text-white/60" />
      <h1 className="mt-6 font-display text-2xl font-bold text-white">You&apos;re offline</h1>
      <p className="mt-2 max-w-sm text-white/60">
        Check your connection and try again. Pages you&apos;ve already visited may still be available.
      </p>
    </main>
  );
}
