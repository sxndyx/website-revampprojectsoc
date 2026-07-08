import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function MailingList() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ first: "", last: "", email: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setSent(true);
  };

  const field =
    "w-full bg-background border border-border focus:border-primary/70 outline-none px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors rounded-none focus:box-glow-green";

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-secondary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto border border-border bg-card/40 backdrop-blur-sm p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs tracking-[0.4em] text-primary">[ SIGNAL ]</span>
            <span className="h-px w-12 bg-primary/40" />
          </div>
          <h3 className="font-display font-extrabold uppercase text-3xl md:text-4xl mb-3">
            Follow the build
          </h3>
          <p className="text-muted-foreground mb-8 font-light max-w-xl">
            Get build updates, reveal dates and behind-the-scenes engineering straight from the garage.
          </p>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 border border-primary/50 bg-primary/5 px-6 py-5"
            >
              <span className="w-10 h-10 flex items-center justify-center bg-primary text-background">
                <Check size={20} />
              </span>
              <div>
                <p className="font-display font-bold uppercase tracking-widest text-primary">Signal locked</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  You're on the list. We'll be in touch from the garage.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
              <input
                aria-label="First name"
                className={field}
                placeholder="First name"
                value={form.first}
                onChange={(e) => setForm({ ...form, first: e.target.value })}
              />
              <input
                aria-label="Last name"
                className={field}
                placeholder="Last name"
                value={form.last}
                onChange={(e) => setForm({ ...form, last: e.target.value })}
              />
              <input
                aria-label="Email address"
                type="email"
                required
                className={`${field} sm:col-span-2`}
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <button
                type="submit"
                className="sm:col-span-2 group flex items-center justify-center gap-3 bg-primary text-background font-display font-bold uppercase tracking-widest py-4 hover:bg-primary/90 transition-colors box-glow-green"
              >
                Join the list
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
