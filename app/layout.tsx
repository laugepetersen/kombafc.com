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
  title: {
    template: "%s — KOMBA FC",
    default: "KOMBA Fight Club",
  },
  description: "The best strikers. A new fight format. In Scandinavia.",
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
    siteName: "KOMBA Fight Club",
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
