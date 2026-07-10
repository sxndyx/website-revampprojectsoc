import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Instagram, Linkedin, MapPin } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { EASE_OUT_STRONG } from "@/lib/motion";

const SUBJECTS = ["Sponsorship", "Joining the team", "Media / Press", "General enquiry"];

/**
 * Contact. Honest by design: no team inbox is live yet, so the form composes
 * your message, copies it, and points you at the channels a human actually
 * reads — nothing pretends to be "sent".
 */
export default function Contact() {
  useSeo({
    title: "Contact",
    description:
      "Get in touch with UNSW Lynx Racing — sponsorship, recruitment, media or anything about the electric superbike build.",
  });

  const reduced = useReducedMotion();
  const [params] = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState(() => {
    const subjectParam = params.get("subject");
    return {
      name: "",
      email: "",
      subject: subjectParam && SUBJECTS.includes(subjectParam) ? subjectParam : SUBJECTS[0],
      message: params.get("message") ?? "",
    };
  });

  const valid = form.name.trim() && /.+@.+\..+/.test(form.email) && form.message.trim();

  const composed = useMemo(
    () =>
      `${form.subject.toUpperCase()} — VIA LYNXRACING SITE\n\nFrom: ${form.name} (${form.email})\n\n${form.message}`,
    [form],
  );

  const copyMessage = async () => {
    setTouched(true);
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(composed);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      setCopied(false);
    }
  };

  const field =
    "w-full border border-hairline bg-surface px-4 py-3 font-mono text-sm text-ink outline-none transition-colors placeholder:text-ink-dim/50 focus:border-acid/60";

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-20 h-[38rem] w-[38rem] bloom-violet-soft" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-10 lg:py-20">
        <Reveal>
          <MonoLabel text="COMMS — SPONSORSHIP · RECRUITMENT · MEDIA" className="text-acid" />
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
            Open a channel
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-2xl text-ink-dim">
            Sponsorship, joining, media or just curious about the build — compose it here and send
            it through a channel a human actually reads.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <div className="grid gap-px border border-hairline bg-hairline lg:grid-cols-[1.4fr_1fr]">
            {/* Composer */}
            <div className="bg-[#0a0a0d] p-7 md:p-10">
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void copyMessage();
                }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block mono-label text-ink-dim">
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      className={field}
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block mono-label text-ink-dim">
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      className={field}
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-2 block mono-label text-ink-dim">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    className={field}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-surface">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block mono-label text-ink-dim">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    className={`${field} resize-none`}
                    placeholder="Tell us what's on your mind…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                {touched && !valid && (
                  <p className="mono-label text-danger">NAME, VALID EMAIL AND MESSAGE ARE REQUIRED</p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 bg-acid px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
                  >
                    {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                    {copied ? "Copied — now send it" : "Copy message"}
                  </button>
                  <a
                    href="https://instagram.com/unswlynxracing"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2.5 border border-hairline px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:border-acid/50 hover:text-acid"
                  >
                    <Instagram size={16} aria-hidden /> Send via DM
                  </a>
                </div>

                <AnimatePresence>
                  {copied && (
                    <motion.p
                      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT_STRONG }}
                      className="mono-label text-acid"
                    >
                      MESSAGE ON YOUR CLIPBOARD — PASTE IT INTO A DM
                    </motion.p>
                  )}
                </AnimatePresence>

                <p className="pt-2 text-xs text-ink-dim">
                  No team inbox is live yet — this composer copies your message instead of
                  pretending to send it. DMs are answered from the garage.
                </p>
              </form>
            </div>

            {/* Channel card */}
            <aside className="flex flex-col gap-8 bg-[#08080a] p-7 md:p-10">
              <div>
                <MonoLabel text="REACH US" className="text-acid" decode={false} />
                <div className="mt-5 flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-acid" aria-hidden />
                  <div>
                    <p className="mono-label text-ink-dim">BASED AT</p>
                    <p className="mt-1 font-display font-bold uppercase">UNSW Sydney, Kensington</p>
                    <p className="mono-label mt-1 text-ink-dim">-33.9173 / 151.2313</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-hairline pt-7">
                <MonoLabel text="CHANNELS" className="text-ink-dim" decode={false} />
                <div className="mt-4 space-y-3">
                  <a
                    href="https://instagram.com/unswlynxracing"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between border border-hairline px-4 py-3 transition-colors hover:border-acid/50"
                  >
                    <span className="flex items-center gap-3 text-sm text-ink">
                      <Instagram size={16} className="text-ink-dim group-hover:text-acid" aria-hidden />
                      @unswlynxracing
                    </span>
                    <ArrowUpRight size={14} className="text-ink-dim group-hover:text-acid" aria-hidden />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/unsw-lynx-racing"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between border border-hairline px-4 py-3 transition-colors hover:border-acid/50"
                  >
                    <span className="flex items-center gap-3 text-sm text-ink">
                      <Linkedin size={16} className="text-ink-dim group-hover:text-acid" aria-hidden />
                      UNSW Lynx Racing
                    </span>
                    <ArrowUpRight size={14} className="text-ink-dim group-hover:text-acid" aria-hidden />
                  </a>
                </div>
              </div>

              <div className="border-t border-hairline pt-7">
                <MonoLabel text="PARTNER WITH US" className="text-ink-dim" decode={false} />
                <p className="mt-3 text-sm text-ink-dim">
                  Exploring sponsorship? The livery configurator shows exactly what your brand
                  gets.
                </p>
                <Link
                  to="/sponsors"
                  className="group mt-3 inline-flex items-center gap-2 mono-label-lg text-acid transition-colors hover:text-ink"
                >
                  Open the configurator
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </Link>
              </div>

              <div className="mt-auto pt-6 mono-label text-ink-dim/60">
                <p>LX-CONCEPT / 2026</p>
                <p className="mt-1">RESPONSE FROM THE GARAGE — TYPICALLY ~48H</p>
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
