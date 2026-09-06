import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Material Symbols, weight 400, outlined.
 *
 * Paths are lifted verbatim from `@material-symbols/svg-400` (a devDependency,
 * kept as the source of truth) and inlined here so icons cost nothing at
 * runtime: no icon font to download, no per-icon request, and unused entries
 * are dropped by the bundler.
 *
 * To add one: copy the `d` attribute out of
 * `node_modules/@material-symbols/svg-400/outlined/<name>.svg`. All Material
 * Symbols share the `0 -960 960 960` viewBox, so nothing else needs changing.
 */
const paths = {
  /** Header menu trigger — the 3×3 grid used in the design. */
  apps: "M179-179q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19ZM179-433q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19ZM179-687q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Zm254 0q-19-19-19-47t19-47q19-19 47-19t47 19q19 19 19 47t-19 47q-19 19-47 19t-47-19Z",
  close:
    "m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z",
  /** The language selector. Material's globe *with* meridians — the plain
      `globe` is a landmass silhouette, and the lined one is what a reader
      has been taught means "language" rather than "world". */
  language:
    "M323-111.5Q250-143 196-197t-85-127.5Q80-398 80-482t31-156.5Q142-711 196-765t127-84.5Q396-880 480-880t157 30.5Q710-819 764-765t85 126.5Q880-566 880-482t-31 157.5Q818-251 764-197t-127 85.5Q564-80 480-80t-157-31.5ZM480-138q35-36 58.5-82.5T577-331H384q14 60 37.5 108t58.5 85Zm-85-12q-25-38-43-82t-30-99H172q38 71 88 111.5T395-150Zm171-1q72-23 129.5-69T788-331H639q-13 54-30.5 98T566-151ZM152-391h159q-3-27-3.5-48.5T307-482q0-25 1-44.5t4-43.5H152q-7 24-9.5 43t-2.5 45q0 26 2.5 46.5T152-391Zm221 0h215q4-31 5-50.5t1-40.5q0-20-1-38.5t-5-49.5H373q-4 31-5 49.5t-1 38.5q0 21 1 40.5t5 50.5Zm275 0h160q7-24 9.5-44.5T820-482q0-26-2.5-45t-9.5-43H649q3 35 4 53.5t1 34.5q0 22-1.5 41.5T648-391Zm-10-239h150q-33-69-90.5-115T565-810q25 37 42.5 80T638-630Zm-254 0h194q-11-53-37-102.5T480-820q-32 27-54 71t-42 119Zm-212 0h151q11-54 28-96.5t43-82.5q-75 19-131 64t-91 115Z",
  /** The selector's own affordance, and nothing else so far. */
  keyboard_arrow_down: "M480-344 240-584l43-43 197 197 197-197 43 43-240 240Z",
  /** The at of a social handle. Material has no brand marks; see flag.tsx. */
  alternate_email:
    "M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480v53q0 56-39.34 94.5Q801.31-294 744-294q-36.08 0-68.04-17.5Q644-329 627-361q-26 34-65.08 50.5Q522.83-294 480-294q-77.61 0-132.3-54Q293-402 293-480.01q0-78.02 54.5-133Q402-668 480-668t132.5 54.99Q667-558.02 667-480v53q0 30.61 22.5 51.81Q712-354 743.5-354t54-21.19Q820-396.39 820-427v-53q0-142.38-99-241.19T480-820q-142 0-241 99t-99 241q0 142 98.81 241 98.82 99 241.19 99h214v60H480Zm90-310.75q37-36.75 37-89.25 0-54-37.06-91t-90-37Q427-608 390-571t-37 91q0 52.5 37.06 89.25t90 36.75Q533-354 570-390.75Z",
  /** Outbound social and off-site links — the corner it points to is the tell. */
  arrow_outward: "m242-246-42-42 412-412H234v-60h480v480h-60v-378L242-246Z",
  /** Format grid — an equaliser's pull, for the volume in the room. */
  graphic_eq:
    "M285-240v-480h60v480h-60ZM450-80v-800h60v800h-60ZM120-400v-160h60v160h-60Zm495 160v-480h60v480h-60Zm165-160v-160h60v160h-60Z",
  /** Format grid — the halftime act. */
  music_note:
    "M286.5-163.5Q243-207 243-270t43.5-106.5Q330-420 393-420q28 0 50.5 8t39.5 22v-450h234v135H543v435q0 63-43.5 106.5T393-120q-63 0-106.5-43.5Z",
  /** Confirmation once an address is on the announcement list. */
  mark_email_read:
    "M633-80 472-241l43-43 118 118 244-244 43 43L633-80ZM478-527l334-213H144l334 213Zm0 60L140-684v452h256l60 60H140q-24 0-42-18t-18-42v-508q0-24 18-42t42-18h677q24 0 42 18t18 42v244l-60 60v-248L478-467Zm1 9Zm-1-69Zm1 60Z",
  /** Ticks off what a partnership package carries. */
  check: "M378-246 154-470l43-43 181 181 384-384 43 43-427 427Z",
  play_arrow: "M320-203v-560l440 280-440 280Z",
  /** Format grid — the kick, for every sport that throws one. */
  sports_martial_arts:
    "m429-40-19-386-163-94-19 68 78 136-51 30-92-157 46-164 237-137-112-112 42-42 168 167-145 83 85 69 318-283 38 38-330 360-20 424h-61ZM193-677q-30 0-51.5-21.5T120-750q0-30 21.5-51.5T193-823q30 0 51.5 21.5T266-750q0 30-21.5 51.5T193-677Z",
  /** Format grid — the glove. */
  sports_mma:
    "M320-120q-18 0-29-11t-11-29v-95h400v95q0 18-11 29t-29 11H320Zm440-525v127q0 7-1 9l-31 148q-4 17-16 27t-29 10H277q-17 0-29-10t-16-27l-31-148q-1-2-1-9v-262q0-26 17-43t43-17h370q26 0 43 17t17 43v135q0-16 9.5-25.5T725-680q16 0 25.5 9.5T760-645ZM289-384h382l29-147v-37h-70v-212H260v249l29 147Zm46-184h220v-134H335v134Zm145-14Z",
} as const;

export type IconName = keyof typeof paths;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  /** Give the icon an accessible name when it is not purely decorative. */
  label?: string;
  /**
   * Fill with the eyebrow's violet ramp instead of `currentColor` — the same
   * gradient `text-chrome-violet` paints, off the shared paint server in
   * `SvgDefs`. Forced colours ignore the reference and fall back to the
   * element's own colour, which is what that mode wants anyway.
   */
  violet?: boolean;
};

export function Icon({ name, label, violet, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      fill={violet ? "url(#chrome-violet)" : "currentColor"}
      className={cn("size-6 shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  );
}
