import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "KOMBA FC is a striking promotion built in Copenhagen — every striking sport in one ring, under a single format. The full story is still under wraps.",
};

export default function AboutPage() {
  return (
    <HoldPage
      kicker="Dossier"
      lines={[
        "One ring. Every art.",
        "The file is not open.",
        "You’ll read it first.",
      ]}
      source="about-hold"
    />
  );
}
