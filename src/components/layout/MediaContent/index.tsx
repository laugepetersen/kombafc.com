import { content } from "@/db";
import Image from "next/image";
import Link from "next/link";
import Button from "../../atoms/Button";

export default function MediaContent() {
  return (
    <section
      className={
        "container layout-block flex max-md:flex-col items-center md:gap-[min(4rem,4vw)]"
      }
    >
      <div className={"relative flex-1 shrink-0 grow w-full h-auto"}>
        <Image
          src={content.homePage.mediaContent.imageSrc}
          alt={"Poster image"}
          width={1024}
          height={1600}
        />
      </div>
      <Link
        className={
          "md:hidden text-white bg-[linear-gradient(90deg,#4C0C83_0%,#9C2BFF_50%,#4C0C83_100%)] px-6 py-4 font-heading font-bold w-full text-center"
        }
        href={content.homePage.mediaContent.action.href}
      >
        {content.homePage.mediaContent.action.mobileLabel}
      </Link>
      <div className={"flex-1 max-md:hidden"}>
        <h2
          className={"[&>span]:text-accent-purple mb-4"}
          dangerouslySetInnerHTML={{
            __html: content.homePage.mediaContent.title,
          }}
        ></h2>
        <p className={"text-neutral-800 leading-[160%] mb-6"}>
          {content.homePage.mediaContent.description}
        </p>
        <div className={"flex gap-3"}>
          <Button
            target="_blank"
            type="black"
            href={content.homePage.mediaContent.action.href}
          >
            {content.homePage.mediaContent.action.label}
          </Button>
          <Button
            type="outline-black"
            target="_blank"
            href={"https://kbhallen.dk/event/komba-fight-club_2025-10-11/"}
          >
            Learn more
          </Button>
        </div>
      </div>
    </section>
  );
}
