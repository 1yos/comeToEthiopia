import { Link } from "react-router-dom";
import { siteContent } from "@/data/content";
import { useSeo } from "@/hooks/useSeo";
import {
  PageHero,
  HeroLabel,
  HeroHeadline,
  HeroSub,
} from "@/components/PageHero";

export function NotFoundPage() {
  const { notFound, meta } = siteContent;

  useSeo({
    title: `${notFound.title} — ${meta.title}`,
    noindex: true,
  });

  return (
    <>
      <PageHero
        imgSrc="/media/regions/Axum-Aksum-Historical-Attractions-of-Ethiopia-Tours-and-Travel-Holidays-480.webp"
        imgAlt="Axum obelisks and ancient stelae, Tigray region, northern Ethiopia"
        gradientDir="down"
        darkness={0.85}
        imgPosition="center 45%"
      >
        <HeroLabel>{notFound.label}</HeroLabel>
        <HeroHeadline>{notFound.headline}</HeroHeadline>
        <HeroSub>{notFound.subline}</HeroSub>

        {/* Links sit inside the hero, above overlay */}
        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--paper)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(241,234,217,0.3)",
              paddingBottom: 3,
              cursor: "none",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "var(--ochre)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor =
                "rgba(241,234,217,0.3)")
            }
          >
            {notFound.homeLabel}
          </Link>

          <Link
            to="/#popular-tours"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "var(--font-body)",
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink)",
              backgroundColor: "var(--paper)",
              padding: "12px 24px",
              textDecoration: "none",
              cursor: "none",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--ochre)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.backgroundColor =
                "var(--paper)")
            }
          >
            {notFound.toursLabel}
          </Link>
        </div>
      </PageHero>
    </>
  );
}
