import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import lynxMark from "@assets/lynx-mark.png";

/**
 * Title screen (main menu) shown after the boot sequence. Simple, near-black,
 * centered Lynx mark + Orbitron wordmark, with four functional nav buttons that
 * enter in a staggered ease-out sequence after the logo.
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
      reduced ? 0 : 700,
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
        delayChildren: reduced ? 0 : 0.5,
        staggerChildren: reduced ? 0 : 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.5, ease: EASE_OUT },
    },
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-12 px-6">
      {/* Logo lockup */}
      <motion.div
        variants={logo}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-5"
      >
        <img
          src={lynxMark}
          alt="Lynx Racing"
          className="h-24 w-auto object-contain drop-shadow-[0_0_28px_rgba(168,255,62,0.35)] md:h-32"
        />
        <h1 className="pl-[0.28em] text-center font-orbitron text-2xl font-extrabold uppercase tracking-[0.28em] text-foreground md:text-4xl">
          Lynx Racing
        </h1>
      </motion.div>

      {/* Menu */}
      <motion.nav
        variants={list}
        initial="hidden"
        animate="show"
        aria-label="Main menu"
        className="flex w-full max-w-xs flex-col gap-3"
      >
        {MENU.map((m, i) => (
          <motion.div key={m.to} variants={item}>
            <button
              type="button"
              ref={i === 0 ? firstBtnRef : undefined}
              onClick={() => onNavigate(m.to)}
              className="group flex w-full items-center justify-center gap-3 border border-primary/25 px-6 py-3.5 font-rajdhani text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-200 hover:border-primary hover:text-primary focus:outline-none focus-visible:border-primary focus-visible:text-primary"
            >
              <span
                aria-hidden="true"
                className="-translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                &#9656;
              </span>
              {m.label}
              <span
                aria-hidden="true"
                className="translate-x-1 text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              >
                &#9666;
              </span>
            </button>
          </motion.div>
        ))}
      </motion.nav>
    </div>
  );
}
