import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The next KOMBA FC card is still under wraps. Leave an address and you hear the date, the venue and the card before anyone else does.",
};

export default function EventsPage() {
  return (
    <HoldPage
      kicker="Classified"
      lines={["The date is sealed.", "You’ll hear it first."]}
      source="events-hold"
    />
  );
}
