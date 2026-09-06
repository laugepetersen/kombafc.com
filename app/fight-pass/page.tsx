import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "Fight Pass",
  description:
    "Every KOMBA fight, filmed and kept. The pass is not open yet — leave an address and you get in first.",
};

export default function FightPassPage() {
  return (
    <HoldPage
      kicker="Restricted"
      lines={["The pass is not open.", "You’ll get in first."]}
      // One of two hold pages with a picture of what it is holding — the rest
      // keep the shared gallery. See the note on `image` in HoldPage.
      //
      // Frozen in, like the store's crate. The two are the only pages on the
      // site carrying their own backdrop, they sit next to each other in the
      // menu, and a reader who opens both should find one idea rather than two
      // unrelated renders.
      image={{
        src: "/fight-pass/frozen-pass.webp",
        alt: "A KOMBA Fight Pass card frozen into the ice, lit violet",
      }}
      source="fight-pass-hold"
    />
  );
}
