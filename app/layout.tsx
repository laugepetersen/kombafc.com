import type { Metadata } from "next";

import { Header } from "@/components/layout/header";
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
  openGraph: {
    siteName: "KOMBA Fight Club",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
