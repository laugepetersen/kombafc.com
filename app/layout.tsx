import type { Metadata } from "next";

import { eurostile, googleSans } from "@/app/fonts";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SvgDefs } from "@/components/ui/svg-defs";
import { TapPress } from "@/components/ui/tap-press";
import { isCanonicalProduction } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  // robots.txt alone only asks crawlers not to *fetch* a URL — it does not
  // keep an already-discovered URL out of the index. The meta tag does, so
  // staging carries both.
  robots: isCanonicalProduction ? undefined : { index: false, follow: false },
  // Two shapes, and the order is the point. Every inner page reads
  // "Athletes — KOMBA FC" — what you are looking at first, because that is the
  // half a search result has room to show and the half that differs. The home
  // page inverts it and leads with the name, since there the brand *is* the
  // subject and there is no page title to put in front of it.
  //
  // An em dash rather than a bullet, on Lauge's call. It is the separator both
  // shapes use, so it is written once here and nowhere else — a route that
  // wants its own punctuation is a route that has left the template.
  //
  // `default` is what the home page renders: it is the only route without a
  // title of its own, and `template` is not applied to `default`, so the string
  // below goes out verbatim. A new route that forgets a title would inherit it
  // too — every current one sets its own.
  title: {
    template: "%s — KOMBA FC",
    default: "KOMBA FC — All Strikers. One Arena.",
  },
  // Serves as the home page's description as well as the site-wide fallback.
  description:
    "KOMBA FC puts Muay Thai and K-1 on the same card. The fighters, all ten bouts from the October debut in full, and what comes next.",
  metadataBase: new URL("https://kombafc.com"),
  // The mark now ships on its own ground — a purple squircle tile — so it no
  // longer needs one file per browser chrome. That was only ever necessary
  // because the old K was a bare silhouette that vanished into whichever
  // chrome matched it; a tile reads on both, and the `media`-paired
  // icon-black/icon-white SVGs it took to do that are gone with it.
  //
  // PNG rather than SVG because the tile's gradient came in as raster artwork.
  // 512 is declared for anything that wants a large icon and 32 for the tab
  // itself, rather than making every browser downscale half a megabyte.
  // public/favicon.ico stays undeclared and carries 16/32/48 for the browsers
  // that fetch it by convention — declare it here and Chrome takes the .ico and
  // ignores everything else, which is the trap the old pair was written around.
  icons: {
    icon: [
      { url: "/favicon/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    // iOS composites onto its own ground and rounds the corners itself, so it
    // takes the tile full bleed.
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    siteName: "KOMBA FC",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${eurostile.variable} ${googleSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SvgDefs />
        <TapPress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
