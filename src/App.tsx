import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION } from "@/lib/motion";

import "@/styles/globals.css";

import { Cursor } from "@/components/Cursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { ScrollDevOverlay } from "@/components/ScrollDevOverlay";

import { Hero } from "@/sections/Hero";
import { AudienceChooser, type AudienceMode } from "@/sections/AudienceChooser";
import { PopularTours } from "@/sections/PopularTours";
import { ScrollStory } from "@/sections/ScrollStory";
import { Map } from "@/sections/Map";
import { WhenToGo } from "@/sections/WhenToGo";
import { RouteBuilder } from "@/sections/RouteBuilder";
import { WhyUs } from "@/sections/WhyUs";
import { TravelerInfo } from "@/sections/TravelerInfo";
import { Voices } from "@/sections/Voices";
import { PlanTrip } from "@/sections/PlanTrip";
import { Footer } from "@/sections/Footer";
import { useLenis } from "@/hooks/useLenis";

gsap.registerPlugin(ScrollTrigger);

const AUDIENCE_KEY = "cte-audience";
const LANG_KEY = "cte-lang";

export type Lang = "en" | "am";

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Audience mode persisted in localStorage
  const [audience, setAudience] = useState<AudienceMode>(() => {
    try {
      return (localStorage.getItem(AUDIENCE_KEY) as AudienceMode) || "visitor";
    } catch {
      return "visitor";
    }
  });

  // Language persisted in localStorage, detected from browser on first visit
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved) return saved;
      const browser = navigator.language.toLowerCase();
      return browser.startsWith("am") ? "am" : "en";
    } catch {
      return "en";
    }
  });

  useLenis();

  const handleAudienceChange = (mode: AudienceMode) => {
    setAudience(mode);
    try {
      localStorage.setItem(AUDIENCE_KEY, mode);
    } catch {
      /* ignore */
    }
    // Refresh scroll triggers after grid change (AudienceChooser grid shifts)
    setTimeout(() => ScrollTrigger.refresh(), 300);
  };

  const handleLangChange = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  };

  // Refresh ScrollTrigger after preloader exits AND after fonts load
  useEffect(() => {
    if (!preloaderDone) return;
    setTimeout(() => ScrollTrigger.refresh(), 200);
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, [preloaderDone]);

  return (
    <>
      <GrainOverlay />
      <Cursor />
      <ScrollDevOverlay />

      <AnimatePresence>
        {!preloaderDone && (
          <Preloader onComplete={() => setPreloaderDone(true)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: preloaderDone ? 1 : 0 }}
        transition={{ duration: DURATION.ui, ease: "easeOut" }}
      >
        {/* Skip to main content */}
        <a
          href="#hero"
          className="sr-only"
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 99999,
            padding: "8px 16px",
            backgroundColor: "var(--ochre)",
            color: "var(--paper)",
            fontFamily: "var(--font-body)",
            fontSize: 12,
            letterSpacing: "0.1em",
            textDecoration: "none",
          }}
          onFocus={(e) =>
            (e.currentTarget as HTMLElement).classList.remove("sr-only")
          }
          onBlur={(e) =>
            (e.currentTarget as HTMLElement).classList.add("sr-only")
          }
        >
          Skip to main content
        </a>

        <Nav
          audience={audience}
          lang={lang}
          onAudienceChange={handleAudienceChange}
          onLangChange={handleLangChange}
        />

        <main id="main-content">
          {/* Phase 5 order: 1 → Hero */}
          <Hero audience={audience} lang={lang} />

          {/* 2 → Who is this for */}
          <AudienceChooser current={audience} onChoose={handleAudienceChange} />

          {/* 3 → Popular tours */}
          <PopularTours audience={audience} />

          {/* 4 → North-to-south destination story */}
          <ScrollStory />

          {/* 5 → Interactive map */}
          <Map />

          {/* 6 → When to go */}
          <WhenToGo />

          {/* 7 → Build your route */}
          <RouteBuilder />

          {/* 8 → Why travel with us */}
          <WhyUs />

          {/* 9 → Traveler info */}
          <TravelerInfo audience={audience} />

          {/* 10 → Words for the road */}
          <Voices />

          {/* 11 → Plan your trip */}
          <PlanTrip audience={audience} />
        </main>

        <Footer lang={lang} />
      </motion.div>
    </>
  );
}
