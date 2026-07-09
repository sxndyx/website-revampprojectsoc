import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "./nav/TopBar";
import { MenuOverlay } from "./nav/MenuOverlay";
import { Footer } from "./nav/Footer";
import { PageLoader } from "./PageLoader";
import { CustomCursor } from "./fx/CustomCursor";
import { HudIntro } from "./intro/HudIntro";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-base text-ink">
      <HudIntro />
      <CustomCursor />
      <TopBar onOpenMenu={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex flex-1 flex-col pt-16">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
