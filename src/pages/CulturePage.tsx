import { useState } from "react";
import { motion } from "framer-motion";
import { siteContent } from "@/data/content";
import { useSeo } from "@/hooks/useSeo";
import {
  PageHero,
  HeroLabel,
  HeroHeadline,
  HeroSub,
} from "@/components/PageHero";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * CulturePage — a proper pre-trip reference guide.
 *
 * Sections:
 * 1. Intro
 * 2. Greetings and practical phrases — vertical, readable
 * 3. The coffee ceremony — step by step
 * 4. Etiquette — what to know before you arrive
 * 5. Tipping — honest, specific
 * 6. Photography — respectful approach
 */

const ETIQUETTE = [
  {
    heading: "Greetings matter more than you expect.",
    body: "In Ethiopia, saying hello before asking anything is not optional — it is the minimum. A transaction that starts without a greeting is rude. A long greeting, even with someone you are buying a SIM card from, is normal. Slow down.",
  },
  {
    heading: "Religious sites: shoes off, voice down.",
    body: "Both Orthodox churches and mosques require shoes removed at the door. In Lalibela, the trenches and tunnels between churches are functioning worship spaces, not corridors. Clergy and pilgrims take priority over tourists. Move aside, wait, do not photograph the interior without permission.",
  },
  {
    heading: "Dress conservatively at religious sites.",
    body: "Shoulders and knees covered for everyone — the rule applies to men as well as women. Scarves are available to borrow at most major sites, but having your own is faster. In the Omo Valley, ask your guide before any photograph of an individual.",
  },
  {
    heading: "The coffee ceremony is an invitation, not a show.",
    body: "If you are invited to a coffee ceremony in someone's home, accept. Sitting through three rounds (Abol, Tona, Baraka) is the polite minimum. Leaving after the first cup is an insult. Two hours is normal. Bring nothing — the ceremony is the gift.",
  },
  {
    heading: "Bargaining exists, but not everywhere.",
    body: "Merkato and tourist markets: bargain. Restaurants, guesthouses, fuel, minibuses: fixed price. Asking for a lower price in a restaurant is embarrassing for everyone. Asking 'ስንት ነው?' (how much?) in a market is the start of a conversation, not a demand." /* TODO-REVIEW */,
  },
  {
    heading: "The left hand is considered unclean.",
    body: "Use your right hand when giving money, receiving things, eating, pointing. Handing someone something with your left hand is a minor insult. This applies especially in rural areas and with older people.",
  },
];

const TIPPING = [
  {
    context: "Guide (full day)",
    amount: "USD 10–15 per day, per group — not per person",
  },
  { context: "Driver", amount: "USD 5–10 per day" },
  { context: "Hotel porter", amount: "10–20 ETB per bag" },
  {
    context: "Restaurant",
    amount: "10% is generous; round up in local restaurants",
  },
  {
    context: "Danakil armed escort",
    amount: "USD 5–10 per armed guard at the end of the trip",
  },
  {
    context: "Site guard / key holder",
    amount: "20–50 ETB if they open a locked site for you",
  },
];

const PHOTOGRAPHY = [
  {
    rule: "Ask first, always.",
    detail:
      "In Addis and most cities, people are generally fine with being photographed if you ask. In the Omo Valley, community visit fees include a photography right — but the fee is for the group, not per photograph. Your guide manages this.",
  },
  {
    rule: "No photography inside rock-hewn churches.",
    detail:
      "At Lalibela, Tigray, and most Orthodox churches: photography is either banned or requires a separate permit. Your guide will know which applies. The icon paintings are fragile — the flash prohibition is not aesthetic, it is conservation.",
  },
  {
    rule: "Armed forces and government buildings.",
    detail:
      "Do not photograph police, military, airports, bridges, or government buildings. This is enforced.",
  },
  {
    rule: "Delete if asked.",
    detail:
      "If someone asks you to delete a photo of them, delete it. This is not negotiable.",
  },
];

export function CulturePage() {
  const { meta, voices } = siteContent;
  const isMobile = useIsMobile();
  const [openEtiquette, setOpenEtiquette] = useState<number | null>(null);

  useSeo({
    title: `Culture & Language — ${meta.title}`,
    description:
      "Practical Amharic phrases, coffee ceremony steps, etiquette, tipping and photography guidance for Ethiopia.",
    canonical: "/culture",
  });

  return (
    <>
      {/* ── Masthead ── */}
      <PageHero
        imgSrc="/media/tours/3-Day-Omo-Valley-Quick-Tour-to-Mursi-Hamer-Karo-Tribes-480.webp"
        imgAlt="Omo Valley tribeswomen in traditional dress, southern Ethiopia"
        gradientDir="down"
        darkness={0.75}
        imgPosition="center 35%"
      >
        <HeroLabel>Culture &amp; Language</HeroLabel>
        <HeroHeadline>What to know before you arrive.</HeroHeadline>
        <HeroSub>
          Language, greetings, the coffee ceremony, what to photograph and what
          not to. None of this is mandatory. All of it changes how people
          respond to you.
        </HeroSub>
      </PageHero>

      {/* ── Practical phrases ── */}
      <section
        style={{
          backgroundColor: "var(--paper)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(48px, 5vw, 64px) 1fr",
            gap: "0 clamp(24px, 4vw, 48px)",
            marginBottom: "clamp(48px, 6vh, 72px)",
          }}
        >
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
            Phrases
          </div>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 48, "wght" 600',
                fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
                color: "var(--ink)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              {voices.headline}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(13px, 1.1vw, 15px)",
                color: "var(--ink)",
                opacity: 0.55,
                lineHeight: 1.7,
                maxWidth: 540,
              }}
            >
              {voices.subline}
            </p>
          </div>
        </div>

        {/* Phrase table */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {voices.phrases.map((phrase, i) => (
            <motion.div
              key={phrase.amharic}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{
                duration: DURATION.reveal,
                delay: i * 0.06,
                ease: [...EASE_FM.outExpo],
              }}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr 1fr"
                  : "clamp(120px, 15vw, 200px) clamp(160px, 20vw, 240px) 1fr clamp(160px, 22vw, 280px)",
                gap: isMobile
                  ? "clamp(8px, 2vw, 16px)"
                  : "0 clamp(16px, 2.5vw, 32px)",
                alignItems: "baseline",
                padding: "clamp(14px, 2vh, 22px) 0",
                borderBottom: "1px solid rgba(18,17,16,0.08)",
              }}
            >
              {/* Amharic */}
              <div
                className="geez"
                style={{
                  fontFamily: "var(--font-geez)",
                  fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
                  color: "var(--ink)",
                  lineHeight: 1.1,
                }}
              >
                {phrase.amharic} {/* TODO-REVIEW */}
              </div>
              {/* Transliteration */}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontVariationSettings: '"opsz" 14, "wght" 300',
                  fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
                  color: "var(--ochre)",
                  letterSpacing: "0.02em",
                }}
              >
                {phrase.transliteration} {/* TODO-REVIEW */}
              </div>
              {/* Meaning */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  color: "var(--ink)",
                  opacity: 0.75,
                }}
              >
                {phrase.meaning}
              </div>
              {/* Context */}
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: "clamp(11px, 0.9vw, 13px)",
                  color: "var(--ink)",
                  opacity: 0.4,
                }}
              >
                {phrase.context}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Coffee ceremony ── */}
      <section
        style={{
          backgroundColor: "var(--indigo)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "1fr clamp(260px, 38vw, 480px)",
            gap: "clamp(40px, 6vw, 72px)",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--ochre)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 1,
                  backgroundColor: "var(--ochre)",
                }}
              />
              Coffee ceremony
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 48, "wght" 600',
                fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
                color: "var(--paper)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 16,
              }}
            >
              Three rounds. Two hours minimum.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(13px, 1.1vw, 15px)",
                color: "var(--paper)",
                opacity: 0.6,
                lineHeight: 1.75,
                marginBottom: 28,
                maxWidth: 400,
              }}
            >
              The buna ceremony is the social centre of daily life in Ethiopia.
              It is not a performance for tourists — when you are invited, you
              are a guest. The three rounds have names: Abol (strongest), Tona
              (medium), Baraka (light, the blessing). Leaving after Abol is
              rude. Staying for all three is the correct response.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {voices.coffeeSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{
                    duration: DURATION.ui,
                    delay: i * 0.08,
                    ease: [...EASE_FM.outExpo],
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(32px, 4vw, 48px) 1fr",
                    gap: "clamp(12px, 1.5vw, 20px)",
                    alignItems: "start",
                  }}
                >
                  <span
                    className="geez"
                    style={{
                      fontFamily: "var(--font-geez)",
                      fontSize: "1.6rem",
                      color: "var(--ochre)",
                      lineHeight: 1,
                    }}
                  >
                    {["፩", "፪", "፫", "፬", "፭"][i] ?? String(step.step)}{" "}
                    {/* TODO-REVIEW */}
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "var(--paper)",
                        marginBottom: 3,
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontStyle: "italic",
                        fontSize: 12,
                        color: "var(--paper)",
                        opacity: 0.5,
                      }}
                    >
                      {step.notes}
                    </div>
                    <div
                      className="geez"
                      style={{
                        fontFamily: "var(--font-geez)",
                        fontSize: "0.85rem",
                        color: "var(--ochre)",
                        opacity: 0.55,
                        marginTop: 3,
                      }}
                    >
                      {step.amharic} {/* TODO-REVIEW */}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: buna fact column */}
          <div
            style={{
              backgroundColor: "rgba(241,234,217,0.06)",
              padding: "clamp(24px, 3vw, 36px)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ochre)",
                marginBottom: 4,
              }}
            >
              Worth knowing
            </div>
            {[
              "Ethiopia is where Arabica coffee originates — the Kaffa forest in the southwest is the wild source.",
              "The ceremony is done by women of the household. Watching is appropriate; interfering is not.",
              "Incense (etan) is always burned during the ceremony. The smell of frankincense and roasting coffee is one of Addis.",
              "Coffee is served in small cups without handles (finjal) with sugar on the side, never milk.",
              "The ceremony can happen at any time of day. 7am is common before work. It is not a special occasion — it is daily life.",
            ].map((fact, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <span
                  style={{
                    width: 14,
                    height: 1,
                    backgroundColor: "var(--ochre)",
                    flexShrink: 0,
                    marginTop: 9,
                  }}
                  aria-hidden="true"
                />
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--paper)",
                    opacity: 0.7,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Etiquette ── */}
      <section
        style={{
          backgroundColor: "var(--paper)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 48, "wght" 600',
            fontSize: "clamp(1.8rem, 3.5vw, 3.5rem)",
            color: "var(--ink)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "clamp(32px, 4vh, 48px)",
          }}
        >
          Six things that matter.
        </h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {ETIQUETTE.map((item, i) => (
            <div
              key={item.heading}
              style={{ borderBottom: "1px solid rgba(18,17,16,0.08)" }}
            >
              <button
                onClick={() => setOpenEtiquette(openEtiquette === i ? null : i)}
                aria-expanded={openEtiquette === i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "clamp(16px, 2.5vh, 22px) 0",
                  background: "none",
                  border: "none",
                  cursor: "none",
                  textAlign: "left",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "clamp(16px, 2.5vw, 28px)",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "var(--ochre)",
                      opacity: 0.6,
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontVariationSettings: '"opsz" 18, "wght" 500',
                      fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)",
                      color: "var(--ink)",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.heading}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: openEtiquette === i ? 45 : 0 }}
                  transition={{ duration: DURATION.micro }}
                  style={{
                    color: "var(--ochre)",
                    fontSize: 20,
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  +
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openEtiquette === i ? "auto" : 0,
                  opacity: openEtiquette === i ? 1 : 0,
                }}
                transition={{
                  duration: DURATION.ui,
                  ease: [...EASE_FM.outCubic],
                }}
                style={{ overflow: "hidden" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(13px, 1.1vw, 15px)",
                    color: "var(--ink)",
                    opacity: 0.7,
                    lineHeight: 1.75,
                    paddingBottom: "clamp(16px, 2.5vh, 22px)",
                    paddingLeft:
                      "calc(clamp(16px, 2.5vw, 28px) + clamp(20px, 2.5vw, 28px) + clamp(16px, 2.5vw, 28px))",
                    margin: 0,
                  }}
                >
                  {item.body}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tipping + Photography side by side ── */}
      <section
        style={{
          backgroundColor: "var(--ink)",
          padding: "clamp(56px, 7vh, 80px) clamp(24px, 6vw, 80px)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "start",
          }}
        >
          {/* Tipping */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 48, "wght" 600',
                fontSize: "clamp(1.6rem, 3vw, 3rem)",
                color: "var(--paper)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Tipping.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(12px, 1vw, 14px)",
                color: "var(--paper)",
                opacity: 0.5,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Tipping is expected for guides and drivers. These are rough
              figures — adjust for quality and length of trip.
            </p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {TIPPING.map((item, _i) => (
                <div
                  key={item.context}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    padding: "clamp(12px, 1.8vh, 18px) 0",
                    borderBottom: "1px solid rgba(241,234,217,0.08)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--paper)",
                      opacity: 0.65,
                    }}
                  >
                    {item.context}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--ochre)",
                    }}
                  >
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Photography */}
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontVariationSettings: '"opsz" 48, "wght" 600',
                fontSize: "clamp(1.6rem, 3vw, 3rem)",
                color: "var(--paper)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Photography.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(12px, 1vw, 14px)",
                color: "var(--paper)",
                opacity: 0.5,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              Four rules. They are not complicated.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {PHOTOGRAPHY.map((item, _i) => (
                <div key={item.rule}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--paper)",
                      marginBottom: 6,
                    }}
                  >
                    {item.rule}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(12px, 1vw, 14px)",
                      color: "var(--paper)",
                      opacity: 0.6,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
