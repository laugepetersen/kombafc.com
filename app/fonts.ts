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
});
