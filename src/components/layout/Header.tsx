"use client";

import { content } from "@/db";
import cn from "@/utilities/cn";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Button from "../atoms/Button";
import ScrambleLink from "../atoms/ScrambleLink";

/**
 * Header
 */
export default function Header() {
  const ref = useRef<HTMLElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isDesktopOrMobile = useMediaQuery({
    minWidth: 768,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry?.isIntersecting);
      },
      { threshold: [1] }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && !isDesktopOrMobile) {
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.documentElement.classList.remove("overflow-hidden");
    }

    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isOpen, isDesktopOrMobile]);

  return (
    <header
      ref={ref}
      className={cn(
        "sticky -top-[1px] z-50 flex items-center justify-between h-(--header-height)  text-neutral-50 font-heading outline outline-gray-500/20",
        { "bg-black/85": isSticky },
        { "backdrop-blur-sm": isSticky && !isOpen }
      )}
    >
      <Link
        href={"/"}
        className={"relative z-50 w-32 h-6 ml-[4vw]"}
        onClick={() => setIsOpen(false)}
      >
        <Image
          className={"object-contain"}
          src={"/logo.png"}
          alt={"Komba Logo"}
          fill
        />
      </Link>
      <nav className={"max-md:hidden"}>
        <ul className={"flex gap-6 text-sm"}>
          {content.header.links.map((link, index) => (
            <li key={index}>
              <ScrambleLink
                className={
                  "uppercase hover:text-accent-yellow transition-colors"
                }
                href={link.href}
              >
                {link.label}
              </ScrambleLink>
            </li>
          ))}
        </ul>
      </nav>
      <nav
        className={cn(
          "md:hidden overflow-hidden fixed top-0 z-40 w-full bg-black transition-all duration-600",
          {
            "h-0": !isOpen,
            "h-full": isOpen,
          }
        )}
      >
        <div
          className={cn(
            "absolute top-0 z-50 w-full h-[calc(var(--header-height)+var(--banner-height))] border-b border-b-white/10",
            {
              "h-(--header-height)": isSticky,
            }
          )}
        ></div>
        <div
          className={cn(
            "overflow-auto h-[calc(100%-var(--header-height)-var(--banner-height))] mt-[calc(var(--header-height)+var(--banner-height))]",
            {
              "h-[calc(100%-var(--header-height))] mt-(--header-height)":
                isSticky,
            }
          )}
        >
          <ul className={"container flex flex-col gap-6 py-10"}>
            {content.header.links.map((link, index) => (
              <li key={index}>
                <Link
                  className={cn(
                    "block uppercase -translate-y-4 text-neutral-200 text-xl opacity-0 duration-200 hover:text-white transition-all",
                    {
                      "translate-y-0 opacity-100 delay-[calc((var(--link-index)+1)*50ms)]":
                        isOpen,
                    }
                  )}
                  href={link.href}
                  style={{ "--link-index": index } as CSSProperties}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <div className="flex flex-col gap-4 mt-6">
              <Button
                type="outline-white"
                className="text-xl normal-case h-16"
                href={"/events"}
                onClick={() => setIsOpen(false)}
              >
                Next event
              </Button>
              <Button
                type="yellow"
                className="text-xl normal-case h-16"
                target="_blank"
                href={content.header.action.href}
                onClick={() => setIsOpen(false)}
              >
                Get your tickets
              </Button>
            </div>
          </ul>
        </div>
      </nav>
      <div className="flex items-center gap-0 md:gap-6 h-full">
        <div className="relative bg-gradient-to-br from-[#FF0649] to-[#AC002B] grid place-content-center rounded-full h-[32px] md:h-[36px] w-22">
          <ScrambleLink
            target="_blank"
            href="https://liveliveapp.dk/app/event/JVZFKfA81LYO8OmVplfz"
            className="-mt-0.5 !w-full py-2 px-4 font-bold"
          >
            WATCH
          </ScrambleLink>
        </div>
        <Button
          type="yellow"
          className="max-md:hidden h-full text-base normal-case"
          target="_blank"
          href={content.header.action.href}
        >
          {content.header.action.label}
        </Button>

        <button
          className={
            "z-50 md:hidden flex items-center justify-center h-full aspect-square cursor-pointer"
          }
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={"relative h-8 w-8"}>
            {isOpen ? (
              <Image src={"/close.svg"} alt={"Close icon"} fill />
            ) : (
              <Image src={"/hamburger.svg"} alt={"Hamburger icon"} fill />
            )}
          </div>
        </button>
      </div>
    </header>
  );
}
