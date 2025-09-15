import DefaultHero from "@/components/layout/DefaultHero";
import FightersOverview from "@/components/layout/FightersOverview";
import FullWidthMediaContent from "@/components/layout/FullWidthMediaContent";
import ImageSlideshow from "@/components/layout/ImageSlideshow";
import InstagramEmbed from "@/components/layout/InstagramEmbed";
import MediaContent from "@/components/layout/MediaContent";
import SponsorMarquee from "@/components/layout/SponsorMarquee";
import { content } from "@/db";

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
