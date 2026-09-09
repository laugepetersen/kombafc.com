import { Google_Sans_Flex } from "next/font/google";
import localFont from "next/font/local";

/**
 * Headings. Licensed, so the files are committed rather than fetched.
 * Only the weights the design actually uses are shipped — each is ~45KB, and
 * the hero calls for Black Italic.
 */
export const eurostile = localFont({
  src: [
    {
      path: "../public/fonts/eurostile-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/eurostile-bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/eurostile-black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/eurostile-black-italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-eurostile",
  display: "swap",
  // Eurostile is markedly wider than the fallback, so without adjusted metrics
  // the swap visibly reflows headings.
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/**
 * Body copy. Variable (weight 1–1000), self-hosted by next/font so there is no
 * request to fonts.googleapis.com and no third-party connection on load.
 */
export const googleSans = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans",
  display: "swap",
  // Google Sans Flex is too new to be in the table of precalculated metrics
  // next/font/google ships (1753 families, none of them this one), so
  // adjustFontFallback can only warn on every compile and emit nothing. Left on
  // its own it also left the stack a bare `"Google Sans Flex"` with nothing
  // behind it — during the swap the browser reached past the sans-serifs to its
  // own default and set body copy 7.7% narrow. Name the stack instead: Arial
  // lands within 0.7%, which is what the missing size-adjust would have bought.
  // The ascent and descent overrides would have bought nothing at all — leading
  // here is a fixed multiple of the type size, so no line box moves either way.
  adjustFontFallback: false,
  fallback: ["Arial", "ui-sans-serif", "system-ui", "sans-serif"],
});
