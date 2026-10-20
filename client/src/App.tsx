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

  const handleContinue = async (withMusic: boolean) => {
    if (withMusic) {
      try {
        await enableMusic();
      } catch (err) {
        console.error(err);
      }
    } else {
      disableMusic();
    }
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
