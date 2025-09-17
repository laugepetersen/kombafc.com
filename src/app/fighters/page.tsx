import AllFighters from "@/components/layout/AllFighters";
import DefaultHero from "@/components/layout/DefaultHero";
import SponsorMarquee from "@/components/layout/SponsorMarquee";
import { content } from "@/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fighters",
  description:
    "The best strikers to take on Denmark. Watch Muay Thai & K-1 in it's finest form directly in Copenhagen.",
};

export default async function FightersPage() {
  return (
    <>
      <DefaultHero
        label={content.fightersPage.hero.label}
        title={content.fightersPage.hero.title}
        imageSrc={content.fightersPage.hero.backgroundImage}
      />
      <SponsorMarquee />
      <AllFighters />
    </>
  );
}
