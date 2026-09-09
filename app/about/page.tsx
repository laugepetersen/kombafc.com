import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "About",
  description:
    "A new era of striking sports — every striking discipline in one ring, under one format. Built in Copenhagen, with more to tell than we are telling yet.",
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
