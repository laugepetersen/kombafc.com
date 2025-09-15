import DefaultHero from "@/components/layout/DefaultHero";
import FightersOverview from "@/components/layout/FightersOverview";
import FullWidthMediaContent from "@/components/layout/FullWidthMediaContent";
import ImageSlideshow from "@/components/layout/ImageSlideshow";
import InstagramEmbed from "@/components/layout/InstagramEmbed";
import MediaContent from "@/components/layout/MediaContent";
import SponsorMarquee from "@/components/layout/SponsorMarquee";
import { content } from "@/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "KOMBA FIGHT CLUB is Denmark's Leading Stage for Striking Combat Sports. First event to take place on October 11th in K. B. Hallen.",
};

export default function HomePage() {
  return (
    <>
      <DefaultHero
        label={content.homePage.hero.label}
        title={content.homePage.hero.title}
        secondaryAction={content.homePage.hero.actions.secondary}
        imageSrc={content.homePage.hero.backgroundImage}
        videoSrc={"/hero-video.mp4"}
      />
      <SponsorMarquee />
      <MediaContent />
      <ImageSlideshow slides={content.homePage.slideshow} />
      <FightersOverview />
      <InstagramEmbed />
      <FullWidthMediaContent className={"mb-0"} />
    </>
  );
}
