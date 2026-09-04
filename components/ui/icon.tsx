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
  play_arrow: "M320-203v-560l440 280-440 280Z",
} as const;

export type IconName = keyof typeof paths;

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  /** Give the icon an accessible name when it is not purely decorative. */
  label?: string;
};

export function Icon({ name, label, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
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
