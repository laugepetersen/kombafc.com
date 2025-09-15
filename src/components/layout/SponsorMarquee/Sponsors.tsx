import { db } from "@/db";
import Image from "next/image";

/**
 * Sponsors
 */
export default function Sponsors(props: {}) {
  return (
    <ul
      className={
        "inline-flex items-center animate-(--animate-marquee) gap-16 pt-6 pr-12 shrink-0"
      }
    >
      {db.sponsors.map((sponsor, index) => (
        <li key={index}>
          <Image
            className={"shrink-0 max-w-[140px]! max-h-[50px]!"}
            src={sponsor}
            alt={"Sponsor image"}
            width={100}
            height={50}
            style={{ width: "100%", height: "auto" }}
          />
        </li>
      ))}
    </ul>
  );
}
