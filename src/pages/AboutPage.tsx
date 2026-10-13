import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSeo } from "@/hooks/useSeo";
import {
  PageHero,
  HeroLabel,
  HeroHeadline,
  HeroSub,
} from "@/components/PageHero";
import { siteContent } from "@/data/content";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * AboutPage — the company story told as editorial copy.
 * No bullet points. No icon cards. Just text, contact and a CTA.
 *
 * Structure:
 * 1. Masthead — who this is
 * 2. Story — why the company exists, what makes it different
 * 3. How it works — the three-step process
 * 4. Contact block — direct phone, WhatsApp, email, socials
 */
export function AboutPage() {
  const { meta, footer } = siteContent;

  const isMobile = useIsMobile();
  useSeo({
    title: `About — ${meta.title}`,
    description:
      "Come to Ethiopia Tours is owned and operated by a single professional Ethiopian guide based in Addis Ababa. No resellers. No middlemen.",
    canonical: "/about",
  });

  return (
    <>
      {/* ── Masthead ── */}
      <PageHero
        imgSrc="/media/tours/Lalibela-Ethiopia-Tours-480.webp"
        imgAlt="Lalibela rock-hewn churches at dawn, Amhara region, northern Ethiopia"
        gradientDir="down"
        darkness={0.76}
        imgPosition="center 40%"
      >
        <HeroLabel>About</HeroLabel>
        <HeroHeadline>One guide. Based in Addis. No middlemen.</HeroHeadline>
        <HeroSub>
          Come to Ethiopia Tours is owned and operated by a single professional
          Ethiopian guide. No resellers. No call centres. One person who knows
          the country.
        </HeroSub>
      </PageHero>

      {/* ── Story — editorial copy, two columns on desktop ── */}
      <section
        style={{
          backgroundColor: "var(--paper)",
          padding: "0 clamp(24px, 6vw, 80px) clamp(64px, 8vh, 100px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "clamp(48px, 5vw, 64px) 1fr clamp(260px, 35vw, 440px)",
            gap: "0 clamp(32px, 5vw, 72px)",
            alignItems: "start",
          }}
        >
          {/* Vertical label */}
          <div
            style={{
              writingMode: "vertical-rl",
              fontFamily: "var(--font-body)",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ochre)",
              paddingTop: 4,
            }}
          >
            The company
          </div>

          {/* Main narrative */}
          <div>
            {[
              {
                heading: "Why this company exists.",
                body: "Ethiopia is one of the most misrepresented destinations in Africa. Tour operators abroad sell it as a package — churches, tribespeople, volcano — ticking boxes, never staying long enough for anything to matter. Come to Ethiopia Tours started because there is a better version of that trip available to anyone willing to go slower and trust a guide who actually lives here.",
              },
              {
                heading: "What a guide is, and what an agency is not.",
                body: "An agency resells tours it did not design, from lodges it has never slept in, with drivers it does not know. A guide is the person on the road with you, who has been to Chenek in January and knows which side of the escarpment the wolves use at dawn. That distinction matters every single day of the trip.",
              },
              {
                heading: "How the itineraries are built.",
                body: "Every route starts with a conversation. We ask what you want to feel at the end of the trip — not which famous site you want to photograph. Then we build the days around that. The itinerary on this website is a starting point, not a fixed schedule. Groups change their minds; guides adapt.",
              },
              {
                heading: "Local knowledge that is actually local.",
                body: "The guide who runs these tours has lived in Addis Ababa for years and has been working in Ethiopian tourism long enough to know which lodge at Chenek has the best view of the valley, which buna house in Lalibela opens at 5am, and when the Afar armed escort convoy departs for Erta Ale. That knowledge is not available from a London travel desk.",
              },
            ].map(({ heading, body }, i) => (
              <motion.div
                key={heading}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{
                  duration: DURATION.reveal,
                  delay: i * 0.08,
                  ease: [...EASE_FM.outExpo],
                }}
                style={{ marginBottom: "clamp(36px, 5vh, 52px)" }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontVariationSettings: '"opsz" 32, "wght" 600',
                    fontStyle: "italic",
                    fontSize: "clamp(1.2rem, 2vw, 1.7rem)",
                    color: "var(--ink)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                    marginBottom: 14,
                  }}
                >
                  {heading}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(14px, 1.2vw, 16px)",
                    color: "var(--ink)",
                    opacity: 0.75,
                    lineHeight: 1.8,
                  }}
                >
                  {body}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Sidebar — facts + quote */}
          <div
            style={{
              position: "sticky",
              top: 88,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            {/* Placeholder for guide photo */}
            <div
              style={{
                backgroundColor: "var(--indigo)",
                aspectRatio: "3/4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ textAlign: "center", padding: 24 }}>
                <div
                  className="geez"
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-geez)",
                    fontSize: "4rem",
                    color: "var(--paper)",
                    opacity: 0.15,
                    lineHeight: 1,
                  }}
                >
                  ሰው {/* TODO-REVIEW */}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--paper)",
                    opacity: 0.3,
                    marginTop: 12,
                  }}
                >
                  Photo — owner to supply
                </div>
              </div>
            </div>

            {/* Pull quote */}
            <blockquote
              style={{
                borderLeft: "2px solid var(--ochre)",
                paddingLeft: 18,
                margin: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontVariationSettings: '"opsz" 18, "wght" 400',
                  fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                  color: "var(--ink)",
                  lineHeight: 1.5,
                  marginBottom: 10,
                }}
              >
                "The best guide is not the one who tells you the most facts. It
                is the one who knows when to be quiet."
              </p>
              <cite
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  color: "var(--ink)",
                  opacity: 0.45,
                  fontStyle: "normal",
                }}
              >
                — {footer.madeIn}
              </cite>
            </blockquote>

            {/* Facts */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: "20px 0",
                borderTop: "1px solid rgba(18,17,16,0.1)",
              }}
            >
              {[
                { label: "Based", value: "Addis Ababa, Ethiopia" },
                { label: "Languages", value: "Amharic, English" },
                { label: "Operates", value: "All of Ethiopia" },
                { label: "Group size", value: "Solo to 12" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(80px, 10vw, 110px) 1fr",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--ochre)",
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ink)",
                      opacity: 0.7,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section
        style={{
          backgroundColor: "var(--indigo)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 48, "wght" 600',
            fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
            color: "var(--paper)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "clamp(36px, 5vh, 52px)",
          }}
        >
          How it works.
        </h2>

        {/* Three steps — NOT three equal cards. Each step is progressively indented. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            {
              step: "01",
              title: "You tell us the shape of the trip.",
              body: "Dates, group size, what kind of trip it is — first visit, returning, specific interest. You do not need a full brief. A rough sense of what you want is enough to start.",
            },
            {
              step: "02",
              title: "We come back with a real itinerary.",
              body: "Not a template pulled from a database. A route built for your dates, your group and your interests — with specific lodges, honest travel times and a day-by-day structure that makes geographic sense.",
              indent: "5vw",
            },
            {
              step: "03",
              title: "You adjust it until it feels right.",
              body: "The itinerary is a conversation, not a contract. We change it. We move things. We add a market day or remove an overnight. Then when it is right, we confirm and you book.",
              indent: "10vw",
            },
          ].map(({ step, title, body, indent }) => (
            <div
              key={step}
              style={{
                paddingLeft: indent ?? 0,
                paddingTop: "clamp(24px, 3vh, 36px)",
                paddingBottom: "clamp(24px, 3vh, 36px)",
                borderBottom: "1px solid rgba(241,234,217,0.08)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "clamp(40px, 4vw, 56px) 1fr",
                  gap: "clamp(16px, 2vw, 28px)",
                  alignItems: "start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    color: "var(--ochre)",
                    opacity: 0.6,
                    paddingTop: 4,
                  }}
                >
                  {step}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings: '"opsz" 24, "wght" 600',
                      fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
                      color: "var(--paper)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.01em",
                      marginBottom: 10,
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(13px, 1.1vw, 15px)",
                      color: "var(--paper)",
                      opacity: 0.65,
                      lineHeight: 1.75,
                    }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact block ── */}
      <section
        style={{
          backgroundColor: "var(--paper)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "start",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 48, "wght" 600',
                fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Talk to us directly.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(13px, 1.1vw, 15px)",
                color: "var(--ink)",
                opacity: 0.6,
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              No contact form here. Call, WhatsApp or email — whatever works. We
              are in Addis Ababa (GMT+3) and usually reply the same day.
            </p>
            <Link
              to="/plan"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "var(--font-body)",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--paper)",
                backgroundColor: "var(--ink)",
                padding: "13px 24px",
                textDecoration: "none",
                cursor: "none",
                transition: `background-color ${DURATION.micro}s ease`,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--ochre)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--ink)")
              }
            >
              Plan your trip →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              {
                label: "WhatsApp & Call",
                value: "+251 903 18 2009",
                href: "https://wa.me/251903182009",
              },
              {
                label: "Email",
                value: "cometoethiopiatours@gmail.com",
                href: "mailto:cometoethiopiatours@gmail.com",
              },
              {
                label: "Instagram",
                value: "@cometoethiopiatours",
                href: "https://www.instagram.com/cometoethiopiatours/",
              },
              {
                label: "TikTok",
                value: "@cometo.ethiopia.tours",
                href: "https://www.tiktok.com/@cometo.ethiopia.tours",
              },
              {
                label: "YouTube",
                value: "@CometoEthiopiatours",
                href: "https://www.youtube.com/@CometoEthiopiatours",
              },
            ].map(({ label, value, href }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ochre)",
                    marginBottom: 3,
                  }}
                >
                  {label}
                </div>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--ink)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(18,17,16,0.2)",
                    paddingBottom: 2,
                    cursor: "none",
                    transition: `border-color ${DURATION.micro}s ease`,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      "var(--ochre)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(18,17,16,0.2)")
                  }
                >
                  {value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
