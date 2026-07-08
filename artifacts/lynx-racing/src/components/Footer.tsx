import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import lynxLogo from "@assets/lynx-logo.png";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "The Bike", to: "/the-bike" },
      { label: "Events", to: "/events" },
      { label: "Team", to: "/team" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Sponsors", to: "/sponsors" },
      { label: "Join", to: "/join" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];

export function Footer() {
  return (
    <footer className="bg-[#07070B] border-t border-secondary/20 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={lynxLogo} alt="Lynx Racing" className="h-10" />
              <span className="font-display font-bold text-xl tracking-tight">LYNX RACING</span>
            </Link>
            <p className="text-muted-foreground font-mono text-sm leading-relaxed">
              UNSW Electric Motorcycle Racing.
              <br />
              Engineering speed. Building the future of motorsport.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary/60 hover:box-glow-green transition-all"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="font-display uppercase tracking-widest text-primary text-sm font-bold mb-6">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-muted-foreground hover:text-foreground hover:text-glow-green transition-all text-sm font-mono"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted-foreground/60">
            © {new Date().getFullYear()} LYNX RACING // UNSW ELECTRIC
          </p>
          <div className="flex gap-4 items-center">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs font-mono text-primary/70">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
