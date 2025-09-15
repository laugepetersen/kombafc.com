import DefaultHero from "@/components/layout/DefaultHero";
import SponsorMarquee from "@/components/layout/SponsorMarquee";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Become a partner with KOMBA FIGHT CLUB. Take your brand to the ringside along champions, leaders and visionaries.",
};

export default function page() {
  return (
    <>
      <DefaultHero
        label={
          "Take your brand to the ringside along champions, leaders and visionaries."
        }
        title={"Become a driving force in a growing market."}
        secondaryAction={{
          href: "mailto:partner@kombafc.com",
          label: "Partner with us",
        }}
        imageSrc={"/hero-sponsors.jpg"}
      />
      <SponsorMarquee className="pb-6" />
    </>
  );
}
