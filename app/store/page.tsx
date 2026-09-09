import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Merch, drops and collectibles. The KOMBA FC store is not open yet — leave an address and you get first pick when the first drop lands.",
};

export default function StorePage() {
  return (
    <HoldPage
      kicker="Embargoed"
      lines={["The store is not open.", "You’ll get first pick."]}
      // The second hold page with a picture of what it is holding — the crate
      // on ice, which is the eyebrow said as a photograph. See `image` in
      // HoldPage for why the other four keep the shared gallery.
      image={{
        src: "/store/frozen-crate.webp",
        alt: "A KOMBA flight case frozen into the ice, lit violet from inside",
      }}
      source="store-hold"
    />
  );
}
