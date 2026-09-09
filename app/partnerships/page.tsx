import type { Metadata } from "next";

import { Partners } from "@/components/sections/partners";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "An elevated fight experience, and three ways into it — Network, Sponsor and Partner. The room, your mark on the night, or a place inside the show.",
};

export default function PartnershipsPage() {
  return <Partners />;
}
