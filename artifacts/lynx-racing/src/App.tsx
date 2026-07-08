import { lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { IntroSequence } from "@/components/intro/IntroSequence";
import NotFound from "@/pages/not-found";

// Code-split every route. The 3D viewer chunk is only pulled in by the routes
// that import it (Home + The Bike), never by the plain content pages.
const Home = lazy(() => import("@/pages/home"));
const TheBike = lazy(() => import("@/pages/the-bike"));
const Sponsors = lazy(() => import("@/pages/sponsors"));
const Events = lazy(() => import("@/pages/events"));
const Team = lazy(() => import("@/pages/team"));
const Join = lazy(() => import("@/pages/join"));
const Contact = lazy(() => import("@/pages/contact"));

const queryClient = new QueryClient();

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter
          basename={basename}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="the-bike" element={<TheBike />} />
              <Route path="sponsors" element={<Sponsors />} />
              <Route path="events" element={<Events />} />
              <Route path="team" element={<Team />} />
              <Route path="join" element={<Join />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          {/* App-entry intro: boot sequence -> title screen. Lives inside the
              router so its menu can navigate, and overlays the whole site.
              Plays on every full page load; not persisted across reloads. */}
          <IntroSequence />
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
