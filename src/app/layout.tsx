import CountdownBanner from "@/components/layout/CountdownBanner";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import cn from "@/utilities/cn";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Barlow, Inter } from "next/font/google";
import Script from "next/script";
import { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - KOMBA FC",
    default: "KOMBA Fight Club",
  },
  description: "Denmark's Leading Stage for Striking Combat Sports.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon/icon-dark.png",
        href: "/favicon/icon-dark.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon/icon-light.png",
        href: "/favicon/icon-light.png",
      },
    ],
  },
  openGraph: {
    siteName: "KOMBA Fight Club",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KOMBA Fight Club",
      },
    ],
  },
};

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowFont = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          interFont.variable,
          interFont.className,
          barlowFont.variable
        )}
      >
        {/* Facebook Pixel */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '773756348461382');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=773756348461382&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <CountdownBanner />
        <Header />
        <main className={"page"}>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
