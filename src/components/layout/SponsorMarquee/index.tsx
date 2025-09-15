"use client";
import { db } from "@/db";
import cn from "@/utilities/cn";
import Marquee from "react-fast-marquee";

/**
 * Sponsor marquee using React Fast Marquee
 */
export default function SponsorMarquee(props: { className?: string }) {
  return (
    <section
      className={cn(
        "relative mx-auto max-w-[90rem]",
        "[-webkit-mask-image:linear-gradient(90deg,transparent,white_20%,white_80%,transparent)] [mask-image:linear-gradient(90deg,transparent,white_20%,white_80%,transparent)] [-webkit-mask-repeat:no-repeat] [mask-repeat:no-repeat] [-webkit-mask-size:100%_100%] [mask-size:100%_100%]",
        props.className
      )}
    >
      <Marquee
        speed={50}
        gradient={false}
        pauseOnHover={false}
        className="py-6"
      >
        {db.sponsors.map((sponsor, index) => (
          <img
            key={index}
            className="max-w-[140px]! max-h-[50px]! object-contain mx-4 md:mx-8"
            src={sponsor}
            alt="Sponsor image"
          />
        ))}
      </Marquee>
    </section>
  );
}
