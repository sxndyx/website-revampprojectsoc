import { lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { PageCurtain, type CurtainStage } from "@/components/fx/PageCurtain";
import NotFound from "@/pages/not-found";

// Code-split every route so each "room" loads on demand.
const Home = lazy(() => import("@/pages/home"));
const TheBike = lazy(() => import("@/pages/the-bike"));
const Engineering = lazy(() => import("@/pages/engineering"));
const Sponsors = lazy(() => import("@/pages/sponsors"));
const Events = lazy(() => import("@/pages/events"));
const Team = lazy(() => import("@/pages/team"));
const Gallery = lazy(() => import("@/pages/gallery"));
const Join = lazy(() => import("@/pages/join"));
const Contact = lazy(() => import("@/pages/contact"));

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

/**
 * Routes + cinematic page transition. The router location drives a small state
 * machine: on navigation the carbon curtain closes, the displayed location
 * swaps behind it, then the curtain opens. Reduced-motion swaps instantly.
 */
function AnimatedRoutes() {
  const location = useLocation();
  const reduced = useReducedMotion();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState<CurtainStage>("idle");

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) return;
    if (reduced) {
      setDisplayLocation(location);
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    if (stage === "idle") setStage("cover");
  }, [location, displayLocation, reduced, stage]);

  return (
    <>
      <Routes location={displayLocation}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="the-bike" element={<TheBike />} />
          <Route path="engineering" element={<Engineering />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="events" element={<Events />} />
          <Route path="team" element={<Team />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="join" element={<Join />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <PageCurtain
        stage={stage}
        onCovered={() => {
          setDisplayLocation(location);
          window.scrollTo({ top: 0, behavior: "auto" });
          setStage("reveal");
        }}
        onRevealed={() => setStage("idle")}
      />
    </>
  );
}

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter
        basename={basename}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AnimatedRoutes />
      </BrowserRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
