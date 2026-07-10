import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, Instagram, Linkedin } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { SectionHeader } from "@/components/SectionHeader";

const SUBJECTS = ["Sponsorship", "Joining the team", "Media / Press", "General enquiry"];

export default function Contact() {
  useSeo({
    title: "Contact",
    description:
      "Get in touch with UNSW Lynx Racing — for sponsorship, recruitment, media or anything about the electric superbike build.",
  });

  // Deep links (e.g. the sponsorship ENQUIRE buttons) can prefill the subject
  // and message via ?subject=&message= query params.
  const [params] = useSearchParams();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState(() => {
    const subjectParam = params.get("subject");
    return {
      name: "",
      email: "",
      subject: subjectParam && SUBJECTS.includes(subjectParam) ? subjectParam : SUBJECTS[0],
      message: params.get("message") ?? "",
    };
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  const field =
    "w-full rounded-none border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/70";

  return (
    <div>
      <section className="container mx-auto px-6 py-16 md:py-24 lg:px-12">
        <SectionHeader
          code="CONTACT"
          title="Get in Touch"
          subtitle="Sponsorship, recruitment, media or just curious about the build — send us a message and the right person will get back to you."
        />
      </section>

      <section className="container mx-auto px-6 pb-28 lg:px-12">
        <div className="grid gap-px border border-border/40 bg-border/40 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <div className="bg-background p-8 md:p-12">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full flex-col items-center justify-center gap-5 py-16 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center bg-primary text-background">
                  <Check size={28} />
                </span>
                <h3 className="font-display text-2xl font-extrabold uppercase">Message sent</h3>
                <p className="max-w-sm font-mono text-sm text-muted-foreground">
                  Thanks for reaching out. We'll get back to you from the garage as soon as we can.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      Name
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
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
                    >
                      Email
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
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
                  >
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    className={field}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-background">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className={`${field} resize-none`}
                    placeholder="Tell us what's on your mind…"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 bg-primary px-8 py-4 font-display font-bold uppercase tracking-widest text-background transition-colors hover:bg-primary/90"
                >
                  Send message
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <aside className="flex flex-col gap-8 bg-[#0a0a0d] p-8 md:p-12">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                Reach us
              </span>
              <div className="mt-5 space-y-5">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-primary" />
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Based at
                    </p>
                    <p className="font-display font-semibold">UNSW Sydney, Kensington</p>
                  </div>
                </div>
                <p className="text-sm font-light leading-relaxed text-muted-foreground">
                  The fastest way to reach the team is the form or a DM — we'll reply from the garage.
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
                Follow
              </span>
              <div className="mt-4 flex gap-3">
                {[
                  { icon: Instagram, href: "https://instagram.com/unswlynxracing", label: "Instagram — @unswlynxracing" },
                  { icon: Linkedin, href: "https://www.linkedin.com/company/unsw-lynx-racing", label: "LinkedIn — UNSW Lynx Racing" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <p>LX-CONCEPT / 2026</p>
              <p className="mt-1 text-primary/60">Response within ~48h</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
