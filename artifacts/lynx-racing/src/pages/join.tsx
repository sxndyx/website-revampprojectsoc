import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Check, ChevronDown, Copy, Instagram } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { Magnetic } from "@/components/fx/Magnetic";
import { DEPARTMENTS } from "@/data/site";
import { EASE_OUT_STRONG } from "@/lib/motion";

const DOING = [
  { n: "01", title: "Design", body: "CAD, simulation and vehicle dynamics on a real race machine — not a tutorial project." },
  { n: "02", title: "Manufacture", body: "Machining, welding, composites and assembly. Your parts end up on the bike, with your name in the build log." },
  { n: "03", title: "Test", body: "Bench rigs, data acquisition and shakedowns — finding out what the machine actually does." },
  { n: "04", title: "Race Operations", body: "Procedures, pit organisation and race-weekend logistics for an international campaign." },
  { n: "05", title: "Business & Media", body: "Sponsorship, budget, brand and the storytelling that keeps the whole programme funded." },
];

const FAQ = [
  {
    q: "Do I need experience?",
    a: "No. Most members learn their squad's tools on the job — drive and reliability matter more than your starting skill set. Experienced members mentor new ones by design.",
  },
  {
    q: "How much time does it take?",
    a: "Squads run between roughly four and twelve hours a week depending on role and season. Exam-time flexibility is real — the team plans around the academic calendar.",
  },
  {
    q: "Who can join?",
    a: "Any UNSW student, any degree. Engineering squads skew technical, but business, media and operations are just as critical to getting on the grid.",
  },
  {
    q: "When can I apply?",
    a: "Expressions of interest are open all year. Formal intakes run at the start of each term — apply now and you'll be in the queue for the next one.",
  },
];

/**
 * Recruitment. The application flow is deliberately honest: there is no team
 * inbox live yet, so "apply" composes your expression of interest, copies it,
 * and hands you to the team's DMs — nothing pretends to be submitted.
 */
export default function Join() {
  useSeo({
    title: "Join — Build The First One",
    description:
      "Join UNSW Lynx Racing: real engineering, manufacturing, testing and race operations on Australia's next student-built electric superbike. No experience required.",
  });

  const reduced = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", degree: "", dept: DEPARTMENTS[0].name, msg: "" });
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);

  const valid = form.name.trim() && /.+@.+\..+/.test(form.email) && form.degree.trim();

  const application = useMemo(
    () =>
      `EXPRESSION OF INTEREST — LYNX RACING\n\nName: ${form.name}\nEmail: ${form.email}\nDegree / year: ${form.degree}\nSquad: ${form.dept}\n\n${form.msg || "Keen to help build the first one."}`,
    [form],
  );

  const copyApplication = async () => {
    setTouched(true);
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(application);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard can be unavailable — the textarea below stays selectable.
      setCopied(false);
    }
  };

  const field =
    "w-full border border-hairline bg-surface px-4 py-3 font-mono text-sm text-ink outline-none transition-colors placeholder:text-ink-dim/50 focus:border-acid/60";

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-40 h-[40rem] w-[40rem] bloom-violet-soft" />
      <div aria-hidden className="pointer-events-none absolute -right-52 top-[70rem] h-[36rem] w-[36rem] bloom-violet-soft" />

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[62vh] max-w-6xl flex-col justify-center px-5 py-16 lg:px-10">
        <Reveal>
          <MonoLabel text="RECRUITMENT — OPEN ALL YEAR · ALL DEGREES" className="text-acid" />
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-5 font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight md:text-[7rem]">
            Build the
            <br />
            first one<span className="text-acid text-acid-glow">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg text-ink-dim">
            Nobody has built this motorcycle before — that's the point. Join the students
            engineering Australia's next electric superbike from a blank page to the MotoStudent
            grid.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <Magnetic className="mt-9 inline-flex">
            <a
              href="#apply"
              className="inline-flex items-center gap-3 bg-acid px-7 py-4 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
            >
              Express interest <ArrowDown size={16} aria-hidden />
            </a>
          </Magnetic>
        </Reveal>
      </section>

      {/* What you'll actually do */}
      <section className="relative mx-auto max-w-6xl px-5 pb-20 lg:px-10">
        <Reveal onView>
          <MonoLabel text="WHAT YOU'LL ACTUALLY DO" className="text-ink-dim" decode={false} />
        </Reveal>
        <div className="mt-6 border-t border-hairline">
          {DOING.map((row, i) => (
            <Reveal key={row.n} onView amount={0.3}>
              <div className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-hairline py-6 transition-colors hover:bg-surface/40 md:grid-cols-[7rem_16rem_1fr] md:gap-8">
                <span className="font-display text-3xl font-bold text-ink/10 transition-colors group-hover:text-acid/60 md:text-5xl">
                  {row.n}
                </span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight">{row.title}</h2>
                <p className="col-start-2 text-ink-dim md:col-start-3">{row.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 pb-20 lg:px-10">
        <div className="grid gap-px border border-hairline bg-hairline lg:grid-cols-[1.1fr_1fr]">
          <div className="bg-[#0a0a0d] p-7 md:p-10">
            <MonoLabel text="EXPRESSION OF INTEREST" className="text-acid" decode={false} />
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight md:text-4xl">
              Take a seat in the garage
            </h2>
            <p className="mt-3 text-sm text-ink-dim">
              Straight answer: the team inbox isn't live yet, so nothing here silently disappears
              into a database. Fill this in, copy it, and fire it at our DMs — a human reads every
              one.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                void copyApplication();
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="join-name" className="mb-2 block mono-label text-ink-dim">
                    Name *
                  </label>
                  <input
                    id="join-name"
                    className={field}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="join-email" className="mb-2 block mono-label text-ink-dim">
                    Email *
                  </label>
                  <input
                    id="join-email"
                    type="email"
                    className={field}
                    placeholder="you@student.unsw.edu.au"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="join-degree" className="mb-2 block mono-label text-ink-dim">
                    Degree & year *
                  </label>
                  <input
                    id="join-degree"
                    className={field}
                    placeholder="e.g. Mechatronics, 2nd year"
                    value={form.degree}
                    onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="join-dept" className="mb-2 block mono-label text-ink-dim">
                    Squad
                  </label>
                  <select
                    id="join-dept"
                    className={field}
                    value={form.dept}
                    onChange={(e) => setForm({ ...form, dept: e.target.value })}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.name} value={d.name} className="bg-surface">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="join-msg" className="mb-2 block mono-label text-ink-dim">
                  Anything else
                </label>
                <textarea
                  id="join-msg"
                  rows={3}
                  className={`${field} resize-none`}
                  placeholder="What do you want to build?"
                  value={form.msg}
                  onChange={(e) => setForm({ ...form, msg: e.target.value })}
                />
              </div>

              {touched && !valid && (
                <p className="mono-label text-danger">NAME, VALID EMAIL AND DEGREE ARE REQUIRED</p>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 bg-acid px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-[#0a0a0d] transition-colors hover:bg-acid/90"
                >
                  {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
                  {copied ? "Copied — now send it" : "Copy application"}
                </button>
                <a
                  href="https://instagram.com/unswlynxracing"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2.5 border border-hairline px-6 py-3.5 font-display text-sm font-bold uppercase tracking-widest text-ink transition-colors hover:border-acid/50 hover:text-acid"
                >
                  <Instagram size={16} aria-hidden /> Open our DMs
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
                    APPLICATION ON YOUR CLIPBOARD — PASTE IT INTO A DM OR EMAIL
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Squad picker summary */}
          <div className="bg-[#0a0a0d] p-7 md:p-10">
            <MonoLabel text="PICK YOUR SQUAD" className="text-ink-dim" decode={false} />
            <ul className="mt-5 divide-y divide-hairline border-y border-hairline">
              {DEPARTMENTS.map((d) => (
                <li key={d.name}>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, dept: d.name }))}
                    aria-pressed={form.dept === d.name}
                    className={`flex w-full items-center justify-between gap-4 py-3 text-left transition-colors ${
                      form.dept === d.name ? "text-acid" : "text-ink hover:text-acid/80"
                    }`}
                  >
                    <span className="font-display text-base font-bold uppercase tracking-tight">
                      {d.name}
                    </span>
                    <span className="mono-label text-ink-dim">{d.commitment}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-dim">
              Not sure? Pick the closest one — squads share a garage, and switching later is
              normal.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 lg:px-10">
        <Reveal onView>
          <MonoLabel text="STRAIGHT ANSWERS" className="text-ink-dim" decode={false} />
        </Reveal>
        <div className="mt-6 border-t border-hairline">
          {FAQ.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={f.q} className="border-b border-hairline">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-display text-lg font-bold uppercase tracking-tight md:text-xl">
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={`shrink-0 text-ink-dim transition-transform duration-300 ${isOpen ? "rotate-180 text-acid" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                      exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0.15 : 0.45, ease: EASE_OUT_STRONG }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-ink-dim">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
