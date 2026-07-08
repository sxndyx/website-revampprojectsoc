import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, MapPin, Instagram, Linkedin } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

const SUBJECTS = ["Sponsorship", "Joining the team", "Media / Press", "General enquiry"];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  const field =
    "w-full bg-background border border-border focus:border-primary/70 outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors rounded-none focus:box-glow-green";

  return (
    <div className="pt-20">
      <section className="container mx-auto px-6 lg:px-12 py-16 md:py-24">
        <SectionHeader
          code="CONTACT"
          title="Get in Touch"
          subtitle="Sponsorship, recruitment, media or just curious about the build — send us a message and the right person will get back to you."
        />
      </section>

      <section className="container mx-auto px-6 lg:px-12 pb-28">
        <div className="grid lg:grid-cols-[1fr_360px] gap-px bg-border/40 border border-border/40">
          {/* Form */}
          <div className="bg-background p-8 md:p-12">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center gap-5 py-16"
              >
                <span className="w-14 h-14 flex items-center justify-center bg-primary text-background">
                  <Check size={28} />
                </span>
                <h3 className="font-display font-extrabold uppercase text-2xl">Message sent</h3>
                <p className="text-muted-foreground font-mono text-sm max-w-sm">
                  Thanks for reaching out. We'll get back to you from the garage as soon as we can.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2">
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
                    <label htmlFor="contact-email" className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2">
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
                  <label htmlFor="contact-subject" className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2">
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
                  <label htmlFor="contact-message" className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-2">
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
                  className="group inline-flex items-center gap-3 bg-primary text-background font-display font-bold uppercase tracking-widest px-8 py-4 hover:bg-primary/90 transition-colors box-glow-green"
                >
                  Send message
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <aside className="bg-[#07070c] p-8 md:p-12 flex flex-col gap-8">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">Reach us</span>
              <div className="mt-5 space-y-5">
                <a href="mailto:hello@lynxracing.com" className="flex items-start gap-3 group">
                  <Mail size={18} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                    <p className="font-display font-semibold group-hover:text-primary transition-colors">
                      hello@lynxracing.com
                    </p>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Based at</p>
                    <p className="font-display font-semibold">UNSW Sydney, Kensington</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">Follow</span>
              <div className="flex gap-3 mt-4">
                {[
                  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="w-11 h-11 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/60 hover:box-glow-green transition-all"
                  >
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-auto font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50">
              <p>LX-CONCEPT / 2026</p>
              <p className="text-primary/60 mt-1">Response within ~48h</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
