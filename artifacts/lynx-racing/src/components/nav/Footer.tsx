import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Instagram, Linkedin } from "lucide-react";
import lynxMark from "@assets/lynx-mark.png";
import { ALL_NAV } from "@/data/nav";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-base">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 bloom-violet-soft opacity-60"
      />
      <div className="relative mx-auto max-w-[1600px] px-5 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1.1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5" aria-label="Lynx Racing — home">
              <img src={lynxMark} alt="" className="h-8 w-auto object-contain" />
              <span className="font-display text-lg font-bold uppercase tracking-[0.16em]">
                Lynx <span className="text-ink-dim">Racing</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-dim">
              A student-built electric superbike concept, engineered from zero at UNSW in Sydney —
              bound for MotoStudent at MotorLand Aragón, Spain.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="https://instagram.com/unswlynxracing" label="Instagram — @unswlynxracing">
                <Instagram size={16} aria-hidden />
              </SocialLink>
              <SocialLink
                href="https://www.linkedin.com/company/unsw-lynx-racing"
                label="LinkedIn — UNSW Lynx Racing"
              >
                <Linkedin size={16} aria-hidden />
              </SocialLink>
            </div>
          </div>

          <nav aria-label="Footer" className="grid content-start grid-cols-2 gap-x-6 gap-y-2.5">
            {ALL_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="mono-label text-ink-dim transition-colors hover:text-acid"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <NewsletterForm />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="mono-label text-ink-dim">© 2026 UNSW Lynx Racing</span>
          <span className="mono-label text-ink-dim">-33.9173 / 151.2313 — Sydney, AU</span>
          <span className="mono-label text-ink-dim">Prototype · Phase: Concept</span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/50 hover:text-acid"
    >
      {children}
    </a>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div>
      <span className="mono-label text-ink-dim">Follow the Build</span>
      <p className="mt-3 text-sm text-ink-dim">
        Reveal dates, milestones and engineering, straight from the garage.
      </p>
      {sent ? (
        <div className="mt-4 inline-flex items-center gap-3 border border-acid/40 bg-acid/5 px-4 py-3">
          <Check size={16} className="text-acid" aria-hidden />
          <span className="mono-label text-ink">You're on the list</span>
        </div>
      ) : (
        <form
          className="mt-4 flex"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) return;
            setSent(true);
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            className="min-w-0 flex-1 border border-hairline bg-surface/60 px-3 py-3 font-mono text-sm text-ink outline-none placeholder:text-white/25 focus:border-acid/60"
          />
          <button
            type="submit"
            aria-label="Join the mailing list"
            className="inline-flex items-center justify-center bg-acid px-4 text-[#0a0a0d] transition-colors hover:bg-acid/90"
          >
            <ArrowRight size={16} aria-hidden />
          </button>
        </form>
      )}
    </div>
  );
}
