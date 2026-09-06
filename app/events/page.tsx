import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The next KOMBA card is under wraps. Leave an address and you hear it before anyone else.",
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
