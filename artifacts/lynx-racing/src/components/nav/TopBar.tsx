import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import lynxMark from "@assets/lynx-mark.png";
import { PRIMARY_NAV } from "@/data/nav";
import { Magnetic } from "@/components/fx/Magnetic";

interface TopBarProps {
  onOpenMenu: () => void;
}

/** Persistent top navigation — brand, primary links, live status chip, menu. */
export function TopBar({ onOpenMenu }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="glass border-b border-hairline">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Lynx Racing — home">
            <img src={lynxMark} alt="" className="h-7 w-auto object-contain" />
            <span className="font-display text-[15px] font-bold uppercase tracking-[0.16em] text-ink">
              Lynx<span className="text-ink-dim"> Racing</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `mono-label transition-colors ${isActive ? "text-acid" : "text-ink-dim hover:text-ink"}`
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-flex items-center gap-1.5">
                    {isActive && <span className="h-1 w-1 rounded-full bg-acid" aria-hidden />}
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 lg:gap-4">
            <StatusChip />
            <Magnetic className="inline-flex" strength={0.4}>
              <button
                onClick={onOpenMenu}
                className="inline-flex items-center gap-2 border border-hairline bg-surface/60 px-3.5 py-2 mono-label text-ink transition-colors hover:border-acid/50 hover:text-acid"
                aria-label="Open menu"
              >
                <Menu size={14} aria-hidden /> Menu
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusChip() {
  return (
    <span className="hidden items-center gap-2 border border-hairline bg-surface/50 px-3 py-2 lg:inline-flex">
      <span className="relative flex h-1.5 w-1.5" aria-hidden>
        <span className="absolute inline-flex h-full w-full rounded-full bg-acid animate-pulse-dot" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid" />
      </span>
      <span className="mono-label text-ink-dim">
        SYS.ONLINE — PHASE: <span className="text-acid">CONCEPT</span>
      </span>
    </span>
  );
}
