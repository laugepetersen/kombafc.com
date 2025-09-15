import DefaultHero from "@/components/layout/DefaultHero";

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
