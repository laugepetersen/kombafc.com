import { content } from "@/db";
import cn from "@/utilities/cn";
import Image from "next/image";
import { ReactNode } from "react";
import Button from "../atoms/Button";
import Kicker from "../atoms/Kicker";

/**
 * Props for {@link FullWidthMediaContent}
 */
interface FullWidthMediaContentProps {
  children?: ReactNode;
  className?: string;
}

/**
 * FullWidthMediaContent
 */
export default async function FullWidthMediaContent(
  props: FullWidthMediaContentProps
) {
  return (
    <section className={cn("layout-block", props.className)}>
      <div
        className={
          "relative flex items-end w-full h-[80vh] min-h-min pt-[24rem] pb-16"
        }
      >
        <div
          className={
            "container flex flex-col items-center md:items-start gap-8 max-md:text-center"
          }
        >
          <div className={"flex flex-col gap-4"}>
            <h2
              className={
                "text-white text-[2rem] md:text-[3rem] font-extrabold leading-[110%] italic max-w-xl"
              }
            >
              {content.homePage.fwMediaContent.title}
            </h2>
            <Kicker
              text={content.homePage.fwMediaContent.text}
              className={"max-w-md"}
            />
          </div>
          {/* <Link
            className={"text-black bg-white px-6 py-4 font-heading font-bold"}
            href={content.homePage.fwMediaContent.action.href}
          >
            {content.homePage.fwMediaContent.action.label}
          </Link> */}

          <Button
            type="white"
            href={"mailto:partner@kombafc.com"}
            target="_blank"
          >
            {content.homePage.fwMediaContent.action.label}
          </Button>
        </div>
        <Image
          className={
            "-z-10 object-cover md:[clip-path:polygon(0_0,calc(100%-var(--clip-corner))_0,100%_var(--clip-corner),100%_100%,0_100%)]"
          }
          src={"/hero-sponsors.jpg"}
          alt={"Background image"}
          fill
          sizes="100vw 80vh"
          quality={100}
        />
        <div
          className={
            "absolute -z-10 top-0 left-0 w-full h-full bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"
          }
        ></div>
      </div>
    </section>
  );
}
