import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import CaseStudy from "@/pages/CaseStudy";
import Home from "@/pages/Home";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Welcome from "./components/welcome/Welcome";
import { enableMusic, disableMusic } from "./components/audio/audioManager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/work/:slug" component={CaseStudy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [welcomeVisible, setWelcomeVisible] = useState(true);
  const [routerMounted, setRouterMounted] = useState(false);

  const handleContinue = async (withMusic: boolean) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("ak-intro-seen");
    }
    // Preload hero image and project covers so nothing pops in later
    const imgHero = new Image();
    imgHero.src = "/manus-storage/async-images/X9GM8StSJdVKEge4C3uzKT/image-1.webp";
    const imgProj1 = new Image();
    imgProj1.src = "/images/image-1.webp";
    const imgProj2 = new Image();
    imgProj2.src = "/manus-storage/async-images/g7V58voJE1n5czprifrmCS/image-2.webp";
    const imgProj3 = new Image();
    imgProj3.src = "/manus-storage/async-images/g7V58voJE1n5czprifrmCS/image-3.webp";

    if (withMusic) {
      try {
        await enableMusic();
      } catch (err) {
        console.error(err);
      }
    } else {
      disableMusic();
    }
    // Mount Router (and thus Folio intro screen) before welcome slides away
    setRouterMounted(true);
    setWelcomeVisible(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AnimatePresence>
            {welcomeVisible && (
              <motion.div
                style={{ position: "fixed", inset: 0, zIndex: 9999 }}
                exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
              >
                <Welcome onContinue={handleContinue} />
              </motion.div>
            )}
          </AnimatePresence>
          {routerMounted && <Router />}
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
