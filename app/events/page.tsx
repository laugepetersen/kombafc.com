import type { Metadata } from "next";

import { HoldPage } from "@/components/sections/hold-page";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The next KOMBA FC card is still under wraps. Sign up and the date, the venue and the full card reach you before they reach anyone else.",
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
