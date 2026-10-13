import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AudioToggle } from "./AudioToggle";
import { siteContent } from "@/data/content";
import { useI18n } from "@/hooks/useI18n";
import { useLocation } from "react-router-dom";
import { useInternalLink } from "@/hooks/useInternalLink";
import { DURATION, EASE_FM, STAGGER, DELAY } from "@/lib/motion";
import type { AudienceMode } from "@/sections/AudienceChooser";
import type { Lang } from "@/App";

interface NavProps {
  audience: AudienceMode;
  lang: Lang;
  onAudienceChange: (mode: AudienceMode) => void;
  onLangChange: (lang: Lang) => void;
}

export function Nav({
  audience,
  lang,
  onAudienceChange,
  onLangChange,
}: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const t = useI18n(lang);
  const { logoGeez } = siteContent.nav;
  const location = useLocation();
  const internalLink = useInternalLink();

  const navLinks = [
    { label: t.tours, href: "/tours" },
    { label: t.destinations, href: "/destinations" },
    { label: t.whenToGo, href: "/when-to-go" },
    { label: t.culture, href: "/culture" },
    { label: t.travelerInfo, href: "/traveler-info" },
    { label: t.about, href: "/about" },
    { label: t.planTrip, href: "/plan" },
  ];

  const logoHref = location.pathname === "/" ? "#" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <motion.nav
      ref={navRef}
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: DURATION.reveal,
        delay: DELAY.mount,
        ease: [...EASE_FM.outExpo],
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(24px, 5vw, 64px)",
        height: 64,
        backgroundColor: scrolled ? "var(--indigo)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(241,234,217,0.08)" : "none",
        transition: `background-color ${DURATION.ui}s ease, border-bottom ${DURATION.ui}s ease`,
      }}
    >
      {/* Logo */}
      <a
        href={logoHref}
        aria-label={t.home}
        onClick={internalLink(logoHref)}
        style={{
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          lineHeight: 1,
          cursor: "none",
        }}
        data-cursor-label="Home"
      >
        <motion.span
          whileHover={{ letterSpacing: "0.04em" }}
          transition={{ duration: DURATION.micro }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--paper)",
            letterSpacing: "0.02em",
            fontVariationSettings: '"opsz" 14',
          }}
        >
          Come to Ethiopia Tours
        </motion.span>
        <span
          style={{
            fontFamily: "var(--font-geez)",
            fontSize: 10,
            color: "var(--ochre)",
            letterSpacing: "0.06em",
            marginTop: 2,
            opacity: 0.8,
          }}
          aria-hidden="true"
        >
          {logoGeez} {/* TODO-REVIEW */}
        </span>
      </a>

      {/* Desktop nav links */}
      <ul
        role="list"
        style={{
          display: "flex",
          gap: "clamp(20px, 3vw, 40px)",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
        className="hidden-mobile"
      >
        {navLinks.map((link) => (
          <li key={link.href}>
            <NavLink
              href={link.href}
              label={link.label}
              duration={DURATION.ui}
              easeFm={EASE_FM.outExpo}
              onClick={internalLink(link.href)}
            />
          </li>
        ))}
      </ul>

      {/* Right: audience + lang + sound + hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Audience toggle */}
        <div
          role="group"
          aria-label="Audience mode"
          style={{ display: "flex", border: "1px solid rgba(241,234,217,0.2)" }}
        >
          {(["visitor", "local"] as AudienceMode[]).map((mode) => (
            <button
              key={mode}
              aria-pressed={audience === mode}
              onClick={() => onAudienceChange(mode)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "5px 10px",
                background: audience === mode ? "var(--ochre)" : "transparent",
                color: audience === mode ? "var(--ink)" : "var(--paper)",
                border: "none",
                cursor: "none",
                transition: `background-color ${DURATION.micro}s ease`,
                opacity: audience === mode ? 1 : 0.55,
              }}
            >
              {mode === "visitor" ? t.visiting : t.local}
            </button>
          ))}
        </div>

        {/* Language toggle */}
        <div
          role="group"
          aria-label="Language"
          style={{
            display: "flex",
            border: "1px solid rgba(241,234,217,0.2)",
            marginLeft: 2,
          }}
        >
          {(["en", "am"] as Lang[]).map((l) => (
            <button
              key={l}
              aria-pressed={lang === l}
              onClick={() => onLangChange(l)}
              style={{
                fontFamily:
                  l === "am" ? "var(--font-geez)" : "var(--font-body)",
                fontSize: l === "am" ? 11 : 9,
                letterSpacing: "0.1em",
                padding: "5px 10px",
                background:
                  lang === l ? "rgba(241,234,217,0.12)" : "transparent",
                color: "var(--paper)",
                border: "none",
                cursor: "none",
                transition: `background-color ${DURATION.micro}s ease`,
                opacity: lang === l ? 1 : 0.45,
              }}
            >
              {l === "en" ? "EN" : "አማ"}
              {/* TODO-REVIEW */}
            </button>
          ))}
        </div>

        <AudioToggle />

        {/* Mobile hamburger */}
        <button
          aria-label={menuOpen ? t.close : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "none",
            border: "none",
            cursor: "none",
            padding: 8,
            flexDirection: "column",
            gap: 5,
          }}
          className="mobile-menu-btn"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                y: menuOpen ? (i === 0 ? 9 : i === 2 ? -9 : 0) : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                backgroundColor: "var(--paper)",
                transformOrigin: "center",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu drawer */}
      <motion.div
        initial={false}
        animate={{ x: menuOpen ? 0 : "100%" }}
        transition={{ duration: DURATION.scene, ease: [...EASE_FM.inOutCubic] }}
        aria-hidden={!menuOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "80vw",
          maxWidth: 320,
          backgroundColor: "var(--indigo)",
          zIndex: 999,
          padding: "80px 40px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {navLinks.map((link, i) => (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              setMenuOpen(false);
              internalLink(link.href)(e);
            }}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: menuOpen ? 0 : 40, opacity: menuOpen ? 1 : 0 }}
            transition={{
              delay: menuOpen ? DELAY.mount + i * STAGGER.normal : 0,
              duration: DURATION.ui,
              ease: [...EASE_FM.outExpo],
            }}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontVariationSettings: '"opsz" 32',
              color: "var(--paper)",
              textDecoration: "none",
              lineHeight: 1.3,
              cursor: "none",
            }}
          >
            {link.label}
          </motion.a>
        ))}

        {/* Audience + lang in mobile drawer */}
        <div
          style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          {(["visitor", "local"] as AudienceMode[]).map((mode) => (
            <button
              key={mode}
              aria-pressed={audience === mode}
              onClick={() => {
                onAudienceChange(mode);
                setMenuOpen(false);
              }}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 14px",
                background: audience === mode ? "var(--ochre)" : "transparent",
                color: audience === mode ? "var(--ink)" : "var(--paper)",
                border: "1px solid rgba(241,234,217,0.2)",
                cursor: "none",
              }}
            >
              {mode === "visitor" ? t.visiting : t.local}
            </button>
          ))}
          {(["en", "am"] as Lang[]).map((l) => (
            <button
              key={l}
              aria-pressed={lang === l}
              onClick={() => onLangChange(l)}
              style={{
                fontFamily:
                  l === "am" ? "var(--font-geez)" : "var(--font-body)",
                fontSize: l === "am" ? 13 : 9,
                padding: "6px 14px",
                background:
                  lang === l ? "rgba(241,234,217,0.12)" : "transparent",
                color: "var(--paper)",
                border: "1px solid rgba(241,234,217,0.2)",
                cursor: "none",
              }}
            >
              {l === "en" ? "EN" : "አማ"}
              {/* TODO-REVIEW */}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}

function NavLink({
  href,
  label,
  duration,
  easeFm,
  onClick,
}: {
  href: string;
  label: string;
  duration: number;
  easeFm: readonly number[];
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      style={{
        position: "relative",
        fontFamily: "var(--font-body)",
        fontSize: 12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--paper)",
        textDecoration: "none",
        paddingBottom: 3,
        cursor: "none",
      }}
      onMouseEnter={(e) => {
        const l = (e.currentTarget as HTMLElement).querySelector(
          ".nav-line",
        ) as HTMLElement;
        if (l) l.style.width = "100%";
      }}
      onMouseLeave={(e) => {
        const l = (e.currentTarget as HTMLElement).querySelector(
          ".nav-line",
        ) as HTMLElement;
        if (l) l.style.width = "0%";
      }}
    >
      {label}
      <span
        className="nav-line"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "1px",
          width: "0%",
          backgroundColor: "var(--ochre)",
          transition: `width ${duration}s cubic-bezier(${easeFm.join(",")})`,
        }}
      />
    </a>
  );
}
