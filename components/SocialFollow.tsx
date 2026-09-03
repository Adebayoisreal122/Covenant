import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/thecallglobal", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com/@thecallglobal", icon: Youtube },
  { label: "Facebook", href: "https://facebook.com/thecallglobal", icon: Facebook },
  { label: "Twitter / X", href: "https://twitter.com/thecallglobal", icon: Twitter },
];

export default function SocialFollow() {
  return (
    <section className="border-y border-slate-100 bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
        <span className="section-eyebrow text-call-orange">Follow along</span>
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Stay connected between gatherings
        </h2>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cloud text-call-blue transition-colors hover:bg-cta-gradient hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
