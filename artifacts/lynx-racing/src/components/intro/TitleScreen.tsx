import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import lynxMark from "@assets/lynx-mark.png";

/**
 * Title screen (main menu) shown after the boot sequence. Centered Lynx mark +
 * Orbitron wordmark, with a bottom-left menu of functional route buttons styled
 * as text-only items (no outline) in a stylised gothic display face.
 */

const MENU = [
  { label: "Explore The Bike", to: "/the-bike" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "The Team", to: "/team" },
  { label: "Events", to: "/events" },
];

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function TitleScreen({
  onNavigate,
  reduced,
}: {
  onNavigate: (to: string) => void;
  reduced: boolean;
}) {
  const firstBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Move keyboard focus to the first menu item once the entrance settles.
    const t = window.setTimeout(
      () => firstBtnRef.current?.focus(),
      reduced ? 0 : 900,
    );
    return () => clearTimeout(t);
  }, [reduced]);

  const logo: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.7, ease: EASE_OUT },
    },
  };

  const list: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduced ? 0 : 0.55,
        staggerChildren: reduced ? 0 : 0.09,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : -14 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: reduced ? 0 : 0.5, ease: EASE_OUT },
    },
  };

  return (
    <div className="absolute inset-0">
      {/* Centered logo lockup */}
      <motion.div
        variants={logo}
        initial="hidden"
        animate="show"
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 pb-24 [@media(max-height:640px)]:justify-start [@media(max-height:640px)]:gap-3 [@media(max-height:640px)]:pt-6 [@media(max-height:640px)]:pb-0"
      >
        <img
          src={lynxMark}
          alt="Lynx Racing"
          className="h-24 w-auto object-contain drop-shadow-[0_0_28px_rgba(168,255,62,0.35)] md:h-32 [@media(max-height:640px)]:h-14"
        />
        <h1 className="pl-[0.28em] text-center font-orbitron text-2xl font-extrabold uppercase tracking-[0.28em] text-foreground md:text-4xl [@media(max-height:640px)]:text-lg">
          Lynx Racing
        </h1>
      </motion.div>

      {/* Bottom-left menu (text-only, no outline) */}
      <motion.nav
        variants={list}
        initial="hidden"
        animate="show"
        aria-label="Main menu"
        className="absolute bottom-10 left-5 flex w-72 flex-col gap-0.5 sm:bottom-16 sm:left-14 sm:w-80"
      >
        {MENU.map((m, i) => (
          <motion.div key={m.to} variants={item}>
            <button
              type="button"
              ref={i === 0 ? firstBtnRef : undefined}
              onClick={() => onNavigate(m.to)}
              className="group relative flex w-full items-center gap-2 py-2 pl-2 pr-4 text-left font-gothic text-xl font-medium uppercase tracking-[0.12em] text-foreground/55 transition-colors duration-200 hover:text-primary focus:outline-none focus:text-primary md:text-2xl"
            >
              {/* Soft feathered glow on hover/focus (no box, no hard edges) */}
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(174,255,62,0.16),transparent_72%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100" />
              {/* Active marker */}
              <span
                aria-hidden="true"
                className="relative w-3 shrink-0 text-base leading-none text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100"
              >
                &#9656;
              </span>
              <span className="relative">{m.label}</span>
            </button>
          </motion.div>
        ))}
      </motion.nav>
    </div>
  );
}
