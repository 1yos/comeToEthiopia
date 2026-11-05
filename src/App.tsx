import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION } from "@/lib/motion";

import "@/styles/globals.css";
import "@/admin/styles/admin.css";

import { Cursor } from "@/components/Cursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Preloader } from "@/components/Preloader";
import { ScrollDevOverlay } from "@/components/ScrollDevOverlay";
import { Layout } from "@/components/Layout";
import { useLenis } from "@/hooks/useLenis";
import { usePageTracking } from "@/hooks/usePageTracking";

import { HomePage } from "@/pages/HomePage";
import { ToursPage } from "@/pages/ToursPage";
import { TourDetailPage } from "@/pages/TourDetailPage";
import { DestinationsPage } from "@/pages/DestinationsPage";
import { WhenToGoPage } from "@/pages/WhenToGoPage";
import { PlanPage } from "@/pages/PlanPage";
import { AboutPage } from "@/pages/AboutPage";
import { CulturePage } from "@/pages/CulturePage";
import { GalleryPage } from "@/pages/GalleryPage";
import { TravelerInfoPage } from "@/pages/TravelerInfoPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Admin panel — layout and login are eagerly loaded
import { LoginPage } from "@/admin/pages/LoginPage";
import { AdminLayout } from "@/admin/components/AdminLayout";

// Admin pages — lazy-loaded to reduce initial bundle
import { lazy, Suspense } from "react";
const DashboardPage = lazy(() =>
  import("@/admin/pages/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const ToursAdminPage = lazy(() =>
  import("@/admin/pages/ToursAdminPage").then((m) => ({
    default: m.ToursAdminPage,
  })),
);
const TourEditPage = lazy(() =>
  import("@/admin/pages/TourEditPage").then((m) => ({
    default: m.TourEditPage,
  })),
);
const DestinationsAdminPage = lazy(() =>
  import("@/admin/pages/DestinationsAdminPage").then((m) => ({
    default: m.DestinationsAdminPage,
  })),
);
const GalleryAdminPage = lazy(() =>
  import("@/admin/pages/GalleryAdminPage").then((m) => ({
    default: m.GalleryAdminPage,
  })),
);
const ContentAdminPage = lazy(() =>
  import("@/admin/pages/ContentAdminPage").then((m) => ({
    default: m.ContentAdminPage,
  })),
);
const ReviewsAdminPage = lazy(() =>
  import("@/admin/pages/ReviewsAdminPage").then((m) => ({
    default: m.ReviewsAdminPage,
  })),
);
const ContactAdminPage = lazy(() =>
  import("@/admin/pages/ContactAdminPage").then((m) => ({
    default: m.ContactAdminPage,
  })),
);
const EnquiriesPage = lazy(() =>
  import("@/admin/pages/EnquiriesPage").then((m) => ({
    default: m.EnquiriesPage,
  })),
);
const AnalyticsPage = lazy(() =>
  import("@/admin/pages/AnalyticsPage").then((m) => ({
    default: m.AnalyticsPage,
  })),
);
const FeaturedToursPage = lazy(() =>
  import("@/admin/pages/FeaturedToursPage").then((m) => ({
    default: m.FeaturedToursPage,
  })),
);
const SiteHealthPage = lazy(() =>
  import("@/admin/pages/SiteHealthPage").then((m) => ({
    default: m.SiteHealthPage,
  })),
);

function AdminPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            <div
              className="admin-skeleton admin-skeleton--title"
              style={{ width: 120 }}
            />
          </div>
        }
      >
        {children}
      </Suspense>
    </AdminLayout>
  );
}

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
  usePageTracking();

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

            {/* Traveler info */}
            <Route
              path="/traveler-info"
              element={<TravelerInfoPage audience={audience} />}
            />

            {/* Plan your trip */}
            <Route path="/plan" element={<PlanPage audience={audience} />} />

            {/* About */}
            <Route path="/about" element={<AboutPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* ── Admin panel — outside the public Layout ── */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <AdminPageWrapper>
                <DashboardPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/tours"
            element={
              <AdminPageWrapper>
                <ToursAdminPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/tours/:id"
            element={
              <AdminPageWrapper>
                <TourEditPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/destinations"
            element={
              <AdminPageWrapper>
                <DestinationsAdminPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <AdminPageWrapper>
                <GalleryAdminPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminPageWrapper>
                <ContentAdminPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <AdminPageWrapper>
                <ReviewsAdminPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/contact"
            element={
              <AdminPageWrapper>
                <ContactAdminPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <AdminPageWrapper>
                <EnquiriesPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminPageWrapper>
                <AnalyticsPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/featured"
            element={
              <AdminPageWrapper>
                <FeaturedToursPage />
              </AdminPageWrapper>
            }
          />
          <Route
            path="/admin/health"
            element={
              <AdminPageWrapper>
                <SiteHealthPage />
              </AdminPageWrapper>
            }
          />
        </Routes>
      </motion.div>
    </>
  );
}
