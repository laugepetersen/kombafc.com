import Sponsors from "@/components/layout/SponsorMarquee/Sponsors";
import cn from "@/utilities/cn";
import "./styles.css";

/**
 * Sponsor marquee
 */
export default async function SponsorMarquee(props: { className?: string }) {
  return (
    <section
      className={cn(
        "flex mx-auto max-w-[90rem]",
        "[-webkit-mask-image:linear-gradient(90deg,transparent,white_20%,white_80%,transparent)] [mask-image:linear-gradient(90deg,transparent,white_20%,white_80%,transparent)] [-webkit-mask-repeat:no-repeat] [mask-repeat:no-repeat] [-webkit-mask-size:100%_100%] [mask-size:100%_100%]",
        props.className
      )}
    >
      <Sponsors />
      <Sponsors />
      <Sponsors />
      <Sponsors />
    </section>
  );
}
