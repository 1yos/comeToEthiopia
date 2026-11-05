import type { Lang } from "@/App";
import type { AudienceMode } from "@/sections/AudienceChooser";
import { siteContent } from "@/data/content";
import { useSeo } from "@/hooks/useSeo";

import { Hero } from "@/sections/Hero";
import { PopularTours } from "@/sections/PopularTours";
import { ScrollStory } from "@/sections/ScrollStory";
import { Map } from "@/sections/Map";
import { WhenToGo } from "@/sections/WhenToGo";
import { GoogleReviews } from "@/sections/GoogleReviews";
import { TravelerInfo } from "@/sections/TravelerInfo";

interface HomePageProps {
  audience: AudienceMode;
  lang: Lang;
  onAudienceChange: (mode: AudienceMode) => void;
}

export function HomePage({
  audience,
  lang,
  onAudienceChange: _onAudienceChange,
}: HomePageProps) {
  const { meta } = siteContent;
  useSeo({
    title: meta.title,
    description: meta.description,
    canonical: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "Come to Ethiopia Tours",
      description: meta.description,
      url: "https://cometoethiopiatours.com",
      telephone: "+251903182009",
      email: "cometoethiopiatours@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Addis Ababa",
        addressCountry: "ET",
      },
      sameAs: [
        "https://www.instagram.com/cometoethiopiatours/",
        "https://www.youtube.com/@CometoEthiopiatours",
        "https://www.tiktok.com/@cometo.ethiopia.tours",
      ],
    },
  });

  return (
    <>
      <Hero audience={audience} lang={lang} />
      <PopularTours audience={audience} />
      <ScrollStory />
      <Map />
      <WhenToGo />
      <GoogleReviews />
      <TravelerInfo audience={audience} />
    </>
  );
}
