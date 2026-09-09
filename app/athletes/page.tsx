import type { Metadata } from "next";

import { FightersRoster } from "@/components/sections/fighters-roster";

export const metadata: Metadata = {
  title: "Athletes",
  description:
    "The athletes who made the KOMBA 1.0 card at K.B. Hallen in October 2025 — where each of them came from, what they fight, and how the night went.",
};

export default function AthletesPage() {
  return <FightersRoster />;
}
