import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "@/sections/Footer";
import { ScrollReset } from "./ScrollReset";
import { DURATION } from "@/lib/motion";
import type { Lang } from "@/App";
import type { AudienceMode } from "@/sections/AudienceChooser";

interface LayoutProps {
  audience: AudienceMode;
  lang: Lang;
  onAudienceChange: (mode: AudienceMode) => void;
  onLangChange: (lang: Lang) => void;
}

export function Layout({ audience, lang, onAudienceChange, onLangChange }: LayoutProps) {
  const location = useLocation();

  return (
    <>
      {/* Skip to main content — targets the <main> with tabIndex={-1} */}
      <a
        href="#main-content"
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
        onAudienceChange={onAudienceChange}
        onLangChange={onLangChange}
      />

      <motion.main
        key={location.pathname}
        id="main-content"
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.ui, ease: "easeOut" }}
        style={{ outline: "none", display: "block" }}
      >
        <Outlet />
        <ScrollReset />
      </motion.main>

      <Footer lang={lang} />
    </>
  );
}