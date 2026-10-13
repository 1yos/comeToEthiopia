import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION } from "@/lib/motion";

import "@/styles/globals.css";

import { Cursor } from "@/components/Cursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Preloader } from "@/components/Preloader";
import { ScrollDevOverlay } from "@/components/ScrollDevOverlay";
import { Layout } from "@/components/Layout";
import { useLenis } from "@/hooks/useLenis";

import { HomePage } from "@/pages/HomePage";
import { ToursPage } from "@/pages/ToursPage";
import { TourDetailPage } from "@/pages/TourDetailPage";
import { DestinationsPage } from "@/pages/DestinationsPage";
import { WhenToGoPage } from "@/pages/WhenToGoPage";
import { PlanPage } from "@/pages/PlanPage";
import { AboutPage } from "@/pages/AboutPage";
import { CulturePage } from "@/pages/CulturePage";
import { GalleryPage } from "@/pages/GalleryPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

import type { AudienceMode } from "@/sections/AudienceChooser";

export type Lang = "en" | "am";

const AUDIENCE_KEY = "cte-audience";
const LANG_KEY = "cte-lang";
const VISIT_KEY = "cte-visited";

const PRERENDER =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("prerender");

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(() => {
    if (PRERENDER) return true;
    // Show preloader on every hard page load — only skip within same JS session
    // (i.e. client-side navigation won't re-show it, but refresh always does)
    return false;
  });

  const handlePreloaderDone = useCallback(() => {
    try {
      sessionStorage.setItem(VISIT_KEY, "1");
    } catch {
      /* ignore */
    }
    setPreloaderDone(true);
  }, []);

  const [audience, setAudience] = useState<AudienceMode>(() => {
    try {
      return (localStorage.getItem(AUDIENCE_KEY) as AudienceMode) || "visitor";
    } catch {
      return "visitor";
    }
  });

  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved) return saved;
      return navigator.language.toLowerCase().startsWith("am") ? "am" : "en";
    } catch {
      return "en";
    }
  });

  useLenis();

  const handleAudienceChange = useCallback((mode: AudienceMode) => {
    setAudience(mode);
    try {
      localStorage.setItem(AUDIENCE_KEY, mode);
    } catch {
      /* ignore */
    }
    setTimeout(() => ScrollTrigger.refresh(), 300);
  }, []);

  const handleLangChange = useCallback((l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!preloaderDone) return;
    setTimeout(() => ScrollTrigger.refresh(), 200);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, [preloaderDone]);

  // Shared props passed to every page that needs them
  const pageProps = { audience, lang };

  return (
    <>
      <GrainOverlay />
      <Cursor />
      <ScrollDevOverlay />

      <AnimatePresence>
        {!preloaderDone && <Preloader onComplete={handlePreloaderDone} />}
      </AnimatePresence>

      <motion.div
        initial={PRERENDER ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: preloaderDone ? 1 : 0 }}
        transition={{ duration: DURATION.ui, ease: "easeOut" }}
      >
        <Routes>
          <Route
            element={
              <Layout
                audience={audience}
                lang={lang}
                onAudienceChange={handleAudienceChange}
                onLangChange={handleLangChange}
              />
            }
          >
            {/* Home */}
            <Route
              path="/"
              element={
                <HomePage
                  {...pageProps}
                  onAudienceChange={handleAudienceChange}
                />
              }
            />

            {/* Tours */}
            <Route path="/tours" element={<ToursPage {...pageProps} />} />
            <Route path="/tours/:slug" element={<TourDetailPage />} />

            {/* Destinations */}
            <Route path="/destinations" element={<DestinationsPage />} />

            {/* When to go */}
            <Route path="/when-to-go" element={<WhenToGoPage />} />

            {/* Gallery */}
            <Route path="/gallery" element={<GalleryPage />} />

            {/* Culture & language */}
            <Route path="/culture" element={<CulturePage />} />

            {/* Plan your trip */}
            <Route path="/plan" element={<PlanPage audience={audience} />} />

            {/* About */}
            <Route path="/about" element={<AboutPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </motion.div>
    </>
  );
}
