import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import lynxLogo from "@assets/lynx-logo.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "The Bike", to: "/the-bike" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "Events", to: "/events" },
  { label: "Team", to: "/team" },
  { label: "Join", to: "/join" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-secondary/20 shadow-[0_4px_30px_-10px_rgba(123,44,255,0.15)]"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="relative z-50 flex items-center gap-3 group">
            <img
              src={lynxLogo}
              alt="Lynx Racing"
              className="h-8 md:h-10 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(168,255,62,0.8)]"
            />
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block text-foreground group-hover:text-primary transition-colors">
              LYNX RACING
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium font-display uppercase tracking-widest transition-all duration-200 relative group ${
                    isActive ? "text-primary text-glow-green" : "text-muted-foreground hover:text-primary"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-2 left-0 w-full h-[2px] bg-primary transition-transform origin-left ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              to="/sponsors"
              className="px-6 py-2.5 font-display uppercase tracking-widest text-sm font-bold text-primary border-2 border-primary/50 rounded-none relative overflow-hidden group hover:border-primary transition-colors box-glow-green bg-gradient-to-r from-transparent to-primary/5 hover:to-primary/20"
            >
              <span className="relative z-10 group-hover:text-glow-green">PARTNER WITH US</span>
              <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden relative z-50 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-background/95 backdrop-blur-xl border-b border-primary/20 pt-24 px-6 pb-8 flex flex-col lg:hidden"
          >
            <div className="flex-1 flex flex-col justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-2xl font-display font-bold uppercase tracking-wider transition-colors block ${
                        isActive ? "text-primary" : "text-foreground hover:text-primary"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05 + 0.1 }}
                className="mt-8 pt-8 border-t border-border"
              >
                <Link
                  to="/sponsors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 text-center font-display uppercase tracking-widest font-bold text-background bg-primary hover:bg-primary/90 transition-colors block box-glow-green"
                >
                  PARTNER WITH US
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
