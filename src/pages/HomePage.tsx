import type { Lang } from "@/App";
import type { AudienceMode } from "@/sections/AudienceChooser";
import { siteContent } from "@/data/content";
import { useSeo } from "@/hooks/useSeo";

import { Hero } from "@/sections/Hero";
import { PopularTours } from "@/sections/PopularTours";
import { ScrollStory } from "@/sections/ScrollStory";
import { Map } from "@/sections/Map";
import { WhenToGo } from "@/sections/WhenToGo";
import { WhyUs } from "@/sections/WhyUs";
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
  });

  return (
    <>
      <Hero audience={audience} lang={lang} />
      <PopularTours audience={audience} />
      <ScrollStory />
      <Map />
      <WhenToGo />
      <WhyUs />
      <TravelerInfo audience={audience} />
    </>
  );
}
