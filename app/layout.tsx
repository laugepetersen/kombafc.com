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
  // The K is a bare silhouette with no ground of its own, so it needs one file
  // per browser chrome — black on light, white on dark — chosen by `media` on
  // the link rather than by a media query inside a single SVG, which Safari
  // does not re-evaluate.
  //
  // These two are the *only* declared icons, deliberately. Declare a .ico
  // alongside them and Chrome takes the .ico and ignores the scheme entirely —
  // measured, in both orderings and with and without `sizes`. Left undeclared,
  // public/favicon.ico still serves the browsers that cannot render an SVG
  // favicon, which fetch /favicon.ico by convention when no declared icon is
  // usable. It carries its own dark tile, so it reads on either chrome.
  icons: {
    icon: [
      {
        url: "/favicon/icon-black.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon/icon-white.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    // iOS ignores colour scheme and composites a transparent icon onto black,
    // so the home-screen icon is the white mark on the void tile, full bleed —
    // iOS rounds the corners itself.
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
