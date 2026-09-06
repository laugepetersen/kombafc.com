import type { ReactNode, SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Country flags, 4:3.
 *
 * Markup is lifted verbatim from `flag-icons` (a devDependency, kept as the
 * source of truth) and inlined here for the same reasons the Material paths
 * are: no stylesheet of 250 rules for the dozen we fly, no per-flag request,
 * and unused entries dropped by the bundler.
 *
 * To add one: take the children of
 * `node_modules/flag-icons/flags/4x3/<code>.svg`, drop the root `id`,
 * camel-case any hyphenated attribute, and add the country to `names` too —
 * that string is the flag's accessible name, and without it a flag is a
 * coloured rectangle to a screen reader.
 *
 * Two kinds of flag in that pack cannot come across as they are:
 *
 * - Ones that draw past the frame and clip themselves back with a
 *   `<defs><clipPath id="xx-a">`. That id is fixed per flag, so two of them
 *   on a page collide. Iceland is the one this pack would have wanted.
 * - Ones carrying a coat of arms. Spain's is 81KB of vector by itself, three
 *   hundred times the file beside it, and at the 16px this renders at every
 *   curve of it lands inside one pixel.
 *
 * Every flag here shares the `0 0 640 480` viewBox, so nothing else changes.
 */
const flags: Record<string, ReactNode> = {
  de: (
    <>
      <path fill="#fc0" d="M0 320h640v160H0z" />
      <path fill="#000001" d="M0 0h640v160H0z" />
      <path fill="red" d="M0 160h640v160H0z" />
    </>
  ),
  dk: (
    <>
      <path fill="#c8102e" d="M0 0h640.1v480H0z" />
      <path fill="#fff" d="M205.7 0h68.6v480h-68.6z" />
      <path fill="#fff" d="M0 205.7h640.1v68.6H0z" />
    </>
  ),
  fi: (
    <>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#002f6c" d="M0 174.5h640v131H0z" />
      <path fill="#002f6c" d="M175.5 0h130.9v480h-131z" />
    </>
  ),
  fr: (
    <>
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#000091" d="M0 0h213.3v480H0z" />
      <path fill="#e1000f" d="M426.7 0H640v480H426.7z" />
    </>
  ),
  gb: (
    <>
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#FFF"
        d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"
      />
      <path
        fill="#C8102E"
        d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"
      />
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </>
  ),
  ie: (
    <>
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#fff" d="M0 0h640v480H0z" />
        <path fill="#009A49" d="M0 0h213.3v480H0z" />
        <path fill="#FF7900" d="M426.7 0H640v480H426.7z" />
      </g>
    </>
  ),
  lt: (
    <>
      <g fillRule="evenodd" strokeWidth="1pt" transform="scale(.64143 .96773)">
        <rect
          width="1063"
          height="708.7"
          fill="#006a44"
          rx="0"
          ry="0"
          transform="scale(.93865 .69686)"
        />
        <rect
          width="1063"
          height="236.2"
          y="475.6"
          fill="#c1272d"
          rx="0"
          ry="0"
          transform="scale(.93865 .69686)"
        />
        <path fill="#fdb913" d="M0 0h997.8v164.6H0z" />
      </g>
    </>
  ),
  ma: (
    <>
      <path fill="#c1272d" d="M640 0H0v480h640z" />
      <path
        fill="none"
        stroke="#006233"
        strokeWidth="11.7"
        d="M320 179.4 284.4 289l93.2-67.6H262.4l93.2 67.6z"
      />
    </>
  ),
  nl: (
    <>
      <path fill="#ae1c28" d="M0 0h640v160H0z" />
      <path fill="#fff" d="M0 160h640v160H0z" />
      <path fill="#21468b" d="M0 320h640v160H0z" />
    </>
  ),
  no: (
    <>
      <path fill="#ed2939" d="M0 0h640v480H0z" />
      <path fill="#fff" d="M180 0h120v480H180z" />
      <path fill="#fff" d="M0 180h640v120H0z" />
      <path fill="#002664" d="M210 0h60v480h-60z" />
      <path fill="#002664" d="M0 210h640v60H0z" />
    </>
  ),
  pl: (
    <>
      <g fillRule="evenodd">
        <path fill="#fff" d="M640 480H0V0h640z" />
        <path fill="#dc143c" d="M640 480H0V240h640z" />
      </g>
    </>
  ),
  se: (
    <>
      <path fill="#005293" d="M0 0h640v480H0z" />
      <path fill="#fecb00" d="M176 0v192H0v96h176v192h96V288h368v-96H272V0z" />
    </>
  ),
  tr: (
    <>
      <g fillRule="evenodd">
        <path fill="#e30a17" d="M0 0h640v480H0z" />
        <path
          fill="#fff"
          d="M407 247.5c0 66.2-54.6 119.9-122 119.9s-122-53.7-122-120 54.6-119.8 122-119.8 122 53.7 122 119.9"
        />
        <path
          fill="#e30a17"
          d="M413 247.5c0 53-43.6 95.9-97.5 95.9s-97.6-43-97.6-96 43.7-95.8 97.6-95.8 97.6 42.9 97.6 95.9z"
        />
        <path
          fill="#fff"
          d="m430.7 191.5-1 44.3-41.3 11.2 40.8 14.5-1 40.7 26.5-31.8 40.2 14-23.2-34.1 28.3-33.9-43.5 12-25.8-37z"
        />
      </g>
    </>
  ),
};

/** Read out in place of the picture. */
const names = {
  de: "Germany",
  dk: "Denmark",
  fi: "Finland",
  fr: "France",
  gb: "United Kingdom",
  ie: "Ireland",
  lt: "Lithuania",
  ma: "Morocco",
  nl: "Netherlands",
  no: "Norway",
  pl: "Poland",
  se: "Sweden",
  tr: "Türkiye",
} as const;

export type CountryCode = keyof typeof names;

type FlagProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  code: CountryCode;
};

export function Flag({ code, className, ...rest }: FlagProps) {
  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label={names[code]}
      className={cn("h-3 w-4 shrink-0", className)}
      {...rest}
    >
      {flags[code]}
    </svg>
  );
}
