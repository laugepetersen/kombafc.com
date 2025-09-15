"use client";
import cn from "@/utilities/cn";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ImageSlideshowProps {
  slides: {
    paragraph: string;
    imageSrc: string;
  }[];
  className?: string;
}

/**
 * Image slideshow with paragraphs
 */
export default function ImageSlideshow(props: ImageSlideshowProps) {
  const { slides } = props;
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const groups = gsap.utils.toArray<HTMLDivElement>(".content-group");
        const images = gsap.utils.toArray<HTMLImageElement>(".fade-image");

        /*
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: imagesRef.current,
          pinSpacing: false,
        });
         */

        groups.forEach((group, i) => {
          if (i === 0) return;

          ScrollTrigger.create({
            trigger: group,
            start: "top center",
            end: "bottom center",
            onEnter: () => gsap.to(images[i], { autoAlpha: 1, duration: 0.3 }),
            onLeaveBack: () =>
              gsap.to(images[i], { autoAlpha: 0, duration: 0.3 }),
          });
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLImageElement>(".fade-image").forEach((img) => {
          gsap.set(img, { autoAlpha: 1 });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn("relative layout-block text-white", props.className)}
    >
      <div
        className={
          "container relative flex flex-col gap-[min(4rem,4vw)] md:flex-row max-md:py-16"
        }
      >
        {/* Mobile */}
        <div
          className={"flex flex-col md:items-center gap-24 md:gap-10 flex-1"}
        >
          {slides.map((item, index) => (
            <div
              key={index}
              className={
                "group content-group md:h-screen flex items-center max-md:flex-col md:max-w-[560px]"
              }
            >
              <div className={"relative aspect-square w-full mb-4 md:hidden"}>
                <Image
                  className={"w-full h-full object-cover"}
                  src={item.imageSrc}
                  alt={"Slideshow image"}
                  fill
                />
              </div>
              <p
                className={
                  "max-md:group-even:text-right text-2xl md:text-[2rem] leading-[130%] bg-gradient-to-r from-white to-[#999] bg-clip-text text-transparent font-medium"
                }
              >
                {item.paragraph}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div
          ref={imagesRef}
          className={
            "sticky top-0 hidden md:flex justify-end items-center flex-1 h-screen max-w-1/2  pt-[calc(2rem+var(--header-height))] pb-8"
          }
        >
          <div className={"relative w-full max-h-full aspect-[5/8]"}>
            {slides.map((item, index) => (
              <Image
                key={index}
                className={
                  "fade-image absolute inset-0 w-full h-full object-cover opacity-0 first:opacity-100 rounded-xl"
                }
                src={item.imageSrc}
                alt={"Slideshow image"}
                fill
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "absolute -z-10 top-0 left-0 w-full h-full bg-black",
          "[clip-path:polygon(0_0,100%_0,100%_100%,var(--clip-corner)_100%,0_calc(100%-var(--clip-corner))))]"
        )}
      ></div>
    </section>
  );
}
