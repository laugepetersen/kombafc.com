import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
