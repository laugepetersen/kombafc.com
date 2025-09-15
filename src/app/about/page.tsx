import DefaultHero from "@/components/layout/DefaultHero";
import InstagramEmbed from "@/components/layout/InstagramEmbed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Denmark's leading stage for striking combat sports, bringing world-class fight events and combat sports entertainment to Copenhagen's K.B. Hallen.",
};

export default function page() {
  return (
    <>
      <DefaultHero
        label={"We are bold. We are changing the landscape. Stay tuned."}
        title={"Denmark's leading stage for striking combat sports."}
        secondaryAction={{
          href: "/events",
          label: "Next event",
        }}
        imageSrc={"/hero-about.jpg"}
      />
      <InstagramEmbed />
    </>
  );
}
