import DefaultHero from "@/components/layout/DefaultHero";
import InstagramEmbed from "@/components/layout/InstagramEmbed";

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
