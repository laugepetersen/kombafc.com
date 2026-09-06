import type { Metadata } from "next";

import { FightersRoster } from "@/components/sections/fighters-roster";

export const metadata: Metadata = {
  title: "Athletes",
  description:
    "The athletes who made the KOMBA 1.0 card at K.B. Hallen, October 2025.",
};

export default function AthletesPage() {
  return <FightersRoster />;
}
