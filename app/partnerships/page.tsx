import type { Metadata } from "next";

import { Partners } from "@/components/sections/partners";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Three ways into KOMBA FC — Network, Sponsor and Partner. A seat and the room around it, your mark on the night, or a place inside the show itself.",
};

export default function PartnershipsPage() {
  return <Partners />;
}
