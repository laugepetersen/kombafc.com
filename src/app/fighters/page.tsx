import AllFighters from "@/components/layout/AllFighters";
import DefaultHero from "@/components/layout/DefaultHero";
import SponsorMarquee from "@/components/layout/SponsorMarquee";
import { content } from "@/db";

/**
 * Fighters page
 */
export default async function FightersPage() {
  return (
    <>
      <DefaultHero
        label={content.fightersPage.hero.label}
        title={content.fightersPage.hero.title}
        primaryAction={content.fightersPage.hero.actions.primary}
        imageSrc={content.fightersPage.hero.backgroundImage}
      />
      <SponsorMarquee />
      <AllFighters />
    </>
  );
}
