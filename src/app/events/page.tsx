import DefaultHero from "@/components/layout/DefaultHero";
import FullWidthMediaContent from "@/components/layout/FullWidthMediaContent";
import ImageSlideshow from "@/components/layout/ImageSlideshow";
import InstagramEmbed from "@/components/layout/InstagramEmbed";
import SponsorMarquee from "@/components/layout/SponsorMarquee";
import { globals } from "@/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Next event KOMBA FIGHT CLUB, Saturday October 11 in Copenhagen's K. B. Hallen. A Muay Thai & K-1 showdown with the best strikers.",
};

export default function page() {
  return (
    <>
      <DefaultHero
        label={"Saturday, October 11 in K. B. Hallen. Doors opening at 5 PM."}
        title={"KOMBA FC 1.0:</br>Sat Oct 11 in K. B. Hallen."}
        secondaryAction={{
          href: globals.ticketLink,
          label: "Get your tickets",
        }}
        imageSrc={"/hero-events.jpg"}
      />
      <SponsorMarquee className="pb-6" />
      <ImageSlideshow
        className="mt-0"
        slides={[
          {
            paragraph:
              "Experience the electrifying atmosphere of striking combat sports as we host the first-ever KOMBA FIGHT CLUB.",
            imageSrc: "/sample-1.png",
          },
          {
            paragraph:
              "Taking place in the iconic K. B. Hallen, a venue known for its state-of-the-art facilities with capacity for 3000 spectators.",
            imageSrc: "/sample-2.png",
          },
          {
            paragraph:
              "Featuring a lineup of international and national elite strikers, world titles on stake, and live performance from an secret artist.",
            imageSrc: "/sample-3.png",
          },
        ]}
      />
      <InstagramEmbed />
      <FullWidthMediaContent className="mb-0" />
    </>
  );
}
