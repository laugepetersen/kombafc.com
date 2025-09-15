import DefaultHero from "@/components/layout/DefaultHero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with KOMBA FIGHT CLUB. Whether it's about sponsorships, partnerships, fighter application or other inquiries. Contact us now.",
};

export default function page() {
  return (
    <>
      <DefaultHero
        label={
          "Partnering inquiries, sponsorship opportunities, fight applications, and more."
        }
        title={"Contact us"}
        primaryAction={{
          href: "mailto:partner@kombafc.com",
          label: "Partner inquiries",
        }}
        secondaryAction={{
          href: "mailto:info@kombafc.com",
          label: "Other inquiries",
        }}
        imageSrc={"/sample-2.png"}
      />
    </>
  );
}
