import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Instagram, Linkedin } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import { Reveal } from "@/components/fx/Reveal";
import { MonoLabel } from "@/components/fx/MonoLabel";
import { ConceptCaption } from "@/components/fx/ConceptCaption";

type Category = "ALL" | "RENDERS" | "BUILD" | "TEAM" | "EVENTS";

interface Slide {
  id: string;
  cat: Exclude<Category, "ALL">;
  src: string;
  srcSet?: string;
  alt: string;
  caption: string;
}

const SLIDES: Slide[] = [
  {
    id: "hero",
    cat: "RENDERS",
    src: "/renders/hero-1920.webp",
    srcSet: "/renders/hero-960.webp 960w, /renders/hero-1280.webp 1280w, /renders/hero-1920.webp 1920w",
    alt: "Front three-quarter concept render of the Lynx electric superbike prototype in a dark studio with purple and green rim lighting",
    caption: "PROTO-01 // FRONT THREE-QUARTER — CONCEPT STUDY",
  },
  {
    id: "side",
    cat: "RENDERS",
    src: "/renders/side-1440.webp",
    srcSet: "/renders/side-960.webp 960w, /renders/side-1440.webp 1440w, /renders/side-2560.webp 2560w",
    alt: "Side profile concept render of the Lynx electric superbike prototype showing carbon bodywork, battery pack and orange high-voltage cabling",
    caption: "PROTO-01 // SIDE PROFILE — BLANK LIVERY",
  },
  {
    id: "helmet",
    cat: "RENDERS",
    src: "/renders/helmet-1440.webp",
    srcSet: "/renders/helmet-960.webp 960w, /renders/helmet-1440.webp 1440w, /renders/helmet-2048.webp 2048w",
    alt: "Blank matte carbon racing helmet concept render with purple visor light and acid green spoiler accents",
    caption: "RIDER KIT // HELMET — CONCEPT STUDY",
  },
];

const EMPTY_COPY: Record<Exclude<Category, "ALL" | "RENDERS">, string> = {
  BUILD: "Documentation begins with the first chassis weld.",
  TEAM: "Garage portraits arrive with the first full-squad build night.",
  EVENTS: "Race-weekend photography starts at the first shakedown.",
};

const CATS: Category[] = ["ALL", "RENDERS", "BUILD", "TEAM", "EVENTS"];

/** Fullscreen media wall: crossfading slides, keyboard + wheel navigation, minimal chrome. */
export default function Gallery() {
  useSeo({
    title: "Gallery — Media Wall",
    description:
      "Concept renders, CAD and the build log of the Lynx Racing electric superbike — growing as the prototype becomes hardware.",
  });

  const reduced = useReducedMotion();
  const [cat, setCat] = useState<Category>("ALL");
  const [index, setIndex] = useState(0);
  const wheelLock = useRef(0);

  const slides = useMemo(() => (cat === "ALL" || cat === "RENDERS" ? SLIDES : []), [cat]);
  const empty = slides.length === 0;
  const slide = empty ? null : slides[Math.min(index, slides.length - 1)];

  const go = useCallback(
    (dir: 1 | -1) => {
      if (!slides.length) return;
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - wheelLock.current < 650 || Math.abs(e.deltaY) < 12) return;
    wheelLock.current = now;
    go(e.deltaY > 0 ? 1 : -1);
  };

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 carbon-weave" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 lg:px-10 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <MonoLabel text="MEDIA WALL — DOCUMENTING THE FIRST BUILD" className="text-acid" />
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
                Gallery
              </h1>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div role="tablist" aria-label="Gallery categories" className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={cat === c}
                  onClick={() => {
                    setCat(c);
                    setIndex(0);
                  }}
                  className={`border px-3.5 py-2 mono-label transition-colors ${
                    cat === c
                      ? "border-acid/60 bg-acid/10 text-acid"
                      : "border-hairline text-ink-dim hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Stage */}
        <Reveal delay={0.15} className="mt-10">
          <div
            onWheel={onWheel}
            className="relative select-none border border-hairline bg-[#08080a]"
          >
            {/* HUD frame */}
            <span aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 h-5 w-5 border-l border-t border-acid/40" />
            <span aria-hidden className="pointer-events-none absolute right-0 top-0 z-10 h-5 w-5 border-r border-t border-acid/40" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 z-10 h-5 w-5 border-b border-l border-acid/40" />
            <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 z-10 h-5 w-5 border-b border-r border-acid/40" />

            <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/10]">
              <AnimatePresence mode="wait">
                {empty ? (
                  <motion.div
                    key={`empty-${cat}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0.15 : 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center"
                  >
                    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 bloom-violet-soft" />
                    <MonoLabel text={`${cat} // NO ENTRIES YET`} className="relative text-ink-dim" decode={false} />
                    <p className="relative max-w-md font-display text-2xl font-bold uppercase tracking-tight md:text-3xl">
                      {EMPTY_COPY[cat as keyof typeof EMPTY_COPY]}
                    </p>
                    <p className="relative text-sm text-ink-dim">Follow along — this wall fills up as the machine gets real.</p>
                    <div className="relative mt-2 flex gap-3">
                      <a
                        href="https://instagram.com/unswlynxracing"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Instagram — @unswlynxracing"
                        className="flex h-10 w-10 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/60 hover:text-acid"
                      >
                        <Instagram size={16} />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/unsw-lynx-racing"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="LinkedIn — UNSW Lynx Racing"
                        className="flex h-10 w-10 items-center justify-center border border-hairline text-ink-dim transition-colors hover:border-acid/60 hover:text-acid"
                      >
                        <Linkedin size={16} />
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.img
                    key={slide!.id}
                    src={slide!.src}
                    srcSet={slide!.srcSet}
                    sizes="(min-width: 1024px) 1100px, 100vw"
                    alt={slide!.alt}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduced ? 0.15 : 0.6 }}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                )}
              </AnimatePresence>

              {/* Click zones */}
              {!empty && slides.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={() => go(-1)}
                    className="group absolute inset-y-0 left-0 z-10 flex w-1/4 items-center justify-start pl-4 outline-none"
                  >
                    <span className="flex h-10 w-10 items-center justify-center border border-hairline bg-[#060607]/60 text-ink-dim opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <ArrowLeft size={16} />
                    </span>
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => go(1)}
                    className="group absolute inset-y-0 right-0 z-10 flex w-1/4 items-center justify-end pr-4 outline-none"
                  >
                    <span className="flex h-10 w-10 items-center justify-center border border-hairline bg-[#060607]/60 text-ink-dim opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <ArrowRight size={16} />
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Chrome bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-4 py-3 md:px-6">
              {empty ? (
                <span className="mono-label text-ink-dim">STANDBY</span>
              ) : (
                <>
                  <span className="mono-label text-ink">{slide!.caption}</span>
                  <span className="flex items-center gap-5">
                    <ConceptCaption />
                    <span className="mono-label text-ink-dim">
                      {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal onView className="mt-6">
          <p className="mono-label text-ink-dim">← → OR SCROLL TO NAVIGATE</p>
        </Reveal>
      </div>
    </section>
  );
}
