import type { Metadata } from "next";

import { Partners } from "@/components/sections/partners";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Three ways into KOMBA — Network, Sponsor and Partner. The room, the mark on the night, or a place inside the show itself.",
};

export default function PartnershipsPage() {
  return <Partners />;
}
