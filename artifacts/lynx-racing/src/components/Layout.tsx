import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageLoader } from "./PageLoader";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
