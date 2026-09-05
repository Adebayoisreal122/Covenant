import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import PulseRing from "@/components/PulseRing";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/convenant 13.jpg')",
        }}
        role="img"
        aria-label="Congregation gathered in worship"
      />
      {/* Overlay: navy base with a warm bottom-left glow toward the CTA */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/65" />
      <div className="absolute inset-0 bg-call-gradient opacity-80 mix-blend-multiply" />
      <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-call-red/20 blur-[120px]" />
      <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-call-orange/20 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-24 lg:px-8">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur w-fit">
          <PulseRing />
          <span className="section-eyebrow text-white/80">Live every Sunday · 9AM &amp; 11AM</span>
        </div>

        <h1 className="mt-8 max-w-3xl text-balance font-display text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          Answer the call.
          <span className="block bg-cta-gradient bg-clip-text text-transparent">Find your people.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
          Covenant Of Grace Rivival Ministry is a community built on holiness and prayr, daily devotion, real testimonies, and
          gathering in person and online. Wherever you are in your journey, there&apos;s a seat for you.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a href="#join">
            <Button size="lg" className="w-full sm:w-auto">
              Register for the next program <ArrowRight className="h-5 w-5" />
            </Button>
          </a>
          <a href="#devotions">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <PlayCircle className="h-5 w-5" /> Read today&apos;s devotion
            </Button>
          </a>
        </div>

        <dl className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8">
          <div>
            <dt className="sr-only">Members</dt>
            <dd className="font-display text-3xl font-bold text-white">12k+</dd>
            <p className="text-sm text-white/60">Community members</p>
          </div>
          <div>
            <dt className="sr-only">Cities</dt>
            <dd className="font-display text-3xl font-bold text-white">40+</dd>
            <p className="text-sm text-white/60">Cities reached</p>
          </div>
          <div>
            <dt className="sr-only">Years</dt>
            <dd className="font-display text-3xl font-bold text-white">10</dd>
            <p className="text-sm text-white/60">Years of ministry</p>
          </div>
        </dl>
      </div>
    </section>
  );
}
