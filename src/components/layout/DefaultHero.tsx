"use client";
import cn from "@/utilities/cn";
import Image from "next/image";
import Button from "../atoms/Button";
import Kicker from "../atoms/Kicker";

/**
 * Props for {@link DefaultHero}
 */
interface DefaultHeroProps {
  label: string;
  title: string;
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
  imageSrc: string;
  videoSrc?: string;
}

/**
 * Default hero section
 */
export default function DefaultHero(props: DefaultHeroProps) {
  const { label, title, primaryAction, secondaryAction, imageSrc, videoSrc } =
    props;

  return (
    <section
      className={cn("relative -mt-(--header-height) bg-black overflow-hidden")}
    >
      {/* Background */}
      <div
        className={
          "relative max-md:aspect-square md:absolute top-0 left-0 md:w-full md:h-full"
        }
      >
        {imageSrc && !videoSrc && (
          <Image
            className={"object-cover"}
            src={imageSrc}
            alt={"Hero background image"}
            fill
            priority
          />
        )}

        {videoSrc && imageSrc && (
          <video
            src={videoSrc}
            poster={videoSrc + "#t=0.1"}
            preload="metadata"
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            className={"absolute inset-0 object-cover w-full h-full"}
          />
        )}

        <div
          className={
            "absolute  top-0 left-0 w-full h-full bg-[url('/noise.png')] bg-repeat [background-size:200px_200px] md:[background-size:300px_300px] mix-blend-screen opacity-10"
          }
        ></div>
        <div
          className={
            "absolute top-0 left-0 w-full h-[calc(100%+2px)] [background:radial-gradient(100%_50%_at_50%_50%,rgba(0,0,0,0)_0%,#000_100%)]  md:[background:radial-gradient(80%_50%_at_50%_50%,rgba(0,0,0,0.2)_0%,#000_100%)]"
          }
        ></div>
      </div>

      {/* Content */}
      <div
        className={
          "container flex flex-col max-md:items-center max-md:text-center gap-6 md:gap-8 max-md:-mt-15 md:pt-[24rem] pb-12 md:pb-16 relative z-10"
        }
      >
        <div className={"flex flex-col gap-2 md:gap-3"}>
          <h1
            className={cn("max-w-3xl")}
            dangerouslySetInnerHTML={{ __html: title }}
          ></h1>
          <Kicker text={label} />
        </div>
        {(primaryAction || secondaryAction) && (
          <div className={"flex gap-4 font-heading font-bold"}>
            {secondaryAction && (
              <Button type="outline-white" href={secondaryAction.href}>
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button type="white" href={primaryAction.href}>
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
