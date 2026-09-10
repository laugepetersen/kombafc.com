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
  /**
   * The story chip's badge.
   *
   * The rounded *filled* glyph rather than this file's outlined 400, and it is
   * the one entry that breaks that rule on purpose: the badge is a solid
   * starburst everywhere it appears, and an outline of it reads as a sticker
   * of the thing rather than the thing.
   */
  verified:
    "m437-433-73-76q-9-10-22-10t-23 9q-10 10-10 23t10 23l97 96q9 9 21 9t21-9l183-182q9-9 9-22t-10-22q-9-8-21.5-7.5T598-593L437-433ZM332-84l-62-106-124-25q-11-2-18.5-12t-5.5-21l14-120-79-92q-8-8-8-20t8-20l79-91-14-120q-2-11 5.5-21t18.5-12l124-25 62-107q6-10 17-14t22 1l109 51 109-51q11-5 22-1.5t17 13.5l63 108 123 25q11 2 18.5 12t5.5 21l-14 120 79 91q8 8 8 20t-8 20l-79 92 14 120q2 11-5.5 21T814-215l-123 25-63 107q-6 10-17 13.5T589-71l-109-51-109 51q-11 5-22 1t-17-14Z",
  /** About creed — the bolt, for the new era. */
  bolt: "m393-165 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400-80h-80Zm154-396Z",
  /** About creed — the arena the sports meet in. */
  stadium:
    "M158-699v-144l144 72-144 72Zm540 0v-144l144 72-144 72Zm-252-36v-144l144 72-144 72ZM430-80q-76-3-140-13.5T179.5-120q-46.5-16-73-36.5T80-200v-360q0-25 31.5-46.5t85.5-38q54-16.5 127-26t156-9.5q83 0 156 9.5t127 26q54 16.5 85.5 38T880-560v360q0 23-26.5 43.5t-73 36.5Q734-104 670-93.5T530-80v-170H430v170Zm50-420q97 0 172.5-14.5T800-558q-23-24-107.5-43T480-620q-128 0-212.5 19T160-558q72 29 147.5 43.5T480-500ZM370-145v-165h220v165q80-5 138.5-21.5T820-205v-297q-57 26-149 44t-191 18q-99 0-191-18t-149-44v297q33 22 91.5 38.5T370-145Zm110-179Z",
  /** About creed — the thing being remade. */
  autorenew:
    "M196-331q-20-36-28-72.5t-8-74.5q0-131 94.5-225.5T480-798h43l-80-80 39-39 149 149-149 149-40-40 79-79h-41q-107 0-183.5 76.5T220-478q0 29 5.5 55t13.5 49l-43 43ZM476-40 327-189l149-149 39 39-80 80h45q107 0 183.5-76.5T740-479q0-29-5-55t-15-49l43-43q20 36 28.5 72.5T800-479q0 131-94.5 225.5T480-159h-45l80 80-39 39Z",
  /** Format grid — the kick, for every sport that throws one. */
  sports_martial_arts:
    "m429-40-19-386-163-94-19 68 78 136-51 30-92-157 46-164 237-137-112-112 42-42 168 167-145 83 85 69 318-283 38 38-330 360-20 424h-61ZM193-677q-30 0-51.5-21.5T120-750q0-30 21.5-51.5T193-823q30 0 51.5 21.5T266-750q0 30-21.5 51.5T193-677Z",
  /** About — the belts on the honours list. */
  military_tech:
    "M280-880h400v333q0 23-11.32 42.15Q657.37-485.7 637-474l-141 82 26 97h134l-109 81 42 134-109-81-110 81 42-134-109-81h135.11L463-392l-140-82q-20.37-11.7-31.68-30.85Q280-524 280-547v-333Zm60 60v273q0 7 4.5 13t13.5 11l96 53v-350H340Zm280 0H514v350l88-53q9-5 13.5-11t4.5-13v-273ZM484-637Zm-30-8Zm60 0Z",
  /** About — the rule set. */
  gavel:
    "M160-120v-60h480v60H160Zm222-212L160-554l70-72 224 222-72 72Zm254-254L414-810l72-70 222 222-72 72Zm202 426L302-696l42-42 536 536-42 42Z",
  /** About — the sports and the passports that meet in one ring. */
  public:
    "M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM437-141v-82q-35 0-59-26t-24-61v-44L149-559q-5 20-7 39.5t-2 39.5q0 130 84.5 227T437-141Zm294-108q44-48 66.5-107.5T820-480q0-106-58-192.5T607-799v18q0 35-24 61t-59 26h-87v87q0 17-13.5 28T393-568h-83v88h258q17 0 28 13t11 30v127h43q29 0 51 17t30 44Z",
  /** About — the show inside the show. */
  theaters:
    "M160-120v-720h60v60h120v-60h280v60h120v-60h60v720h-60v-60H620v60H340v-60H220v60h-60Zm60-120h120v-120H220v120Zm0-180h120v-120H220v120Zm0-180h120v-120H220v120Zm400 360h120v-120H620v120Zm0-180h120v-120H620v120Zm0-180h120v-120H620v120ZM400-180h160v-600H400v600Zm0-600h160-160Z",
  /** About — the broadcast. */
  videocam:
    "M140-160q-24 0-42-18t-18-42v-520q0-24 18-42t42-18h520q24 0 42 18t18 42v215l160-160v410L720-435v215q0 24-18 42t-42 18H140Zm0-60h520v-520H140v520Zm0 0v-520 520Z",
  /** About — the premium end of the room. */
  workspace_premium:
    "m385-412 36-115-95-74h116l38-119 37 119h117l-95 74 35 115-94-71-95 71ZM244-40v-304q-45-47-64.5-103T160-560q0-136 92-228t228-92q136 0 228 92t92 228q0 57-19.5 113T716-344v304l-236-79-236 79Zm420.5-335.5Q740-451 740-560t-75.5-184.5Q589-820 480-820t-184.5 75.5Q220-669 220-560t75.5 184.5Q371-300 480-300t184.5-75.5ZM304-124l176-55 176 55v-171q-40 29-86 42t-90 13q-44 0-90-13t-86-42v171Zm176-86Z",
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
